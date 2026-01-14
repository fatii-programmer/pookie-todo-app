# Evolution of Todo - Phase IV Specification

**Version:** 4.0.0
**Date:** 2025-12-31
**Status:** Ready for Implementation
**Governed By:** CONSTITUTION.md v1.0.0
**Deploys:** SPEC-PHASE-III.md v3.0.0

---

## Table of Contents
1. [Overview](#overview)
2. [Deployment Architecture](#deployment-architecture)
3. [Containerization Specification](#containerization-specification)
4. [Kubernetes Manifests Specification](#kubernetes-manifests-specification)
5. [Helm Chart Specification](#helm-chart-specification)
6. [Minikube Deployment Specification](#minikube-deployment-specification)
7. [Local AI Deployment Specification](#local-ai-deployment-specification)
8. [Configuration Management](#configuration-management)
9. [Monitoring & Observability](#monitoring--observability)
10. [Security Hardening](#security-hardening)
11. [Acceptance Criteria](#acceptance-criteria)

---

## Overview

### Purpose
Phase IV makes the Phase III conversational AI todo application production-ready through containerization, orchestration, and deployment automation. This phase enables deployment to local development environments (Minikube), cloud platforms (Kubernetes), and includes an optional local AI mode for offline operation.

### Scope
This specification defines:
1. **Docker containerization** - Multi-stage builds, optimization, security
2. **Kubernetes deployment** - Pods, Services, ConfigMaps, Secrets, PersistentVolumes
3. **Helm packaging** - Charts, templates, values, overrides
4. **Minikube setup** - Local Kubernetes cluster deployment
5. **Local AI mode** - Self-hosted LLM alternative to OpenAI (Ollama)
6. **Configuration management** - Environment-based configs, secrets handling
7. **Observability** - Logging, metrics, health checks
8. **CI/CD readiness** - Build automation, testing, deployment pipelines

### Key Capabilities
- **One-command deployment** via Helm
- **Multi-environment support** (dev, staging, prod)
- **Zero-downtime updates** with rolling deployments
- **Horizontal scaling** for high availability
- **Persistent storage** for task data
- **Local development** with Minikube
- **Offline mode** with local AI model

---

## Deployment Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Kubernetes Cluster                    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │                   Ingress Controller                │    │
│  │            (nginx-ingress / traefik)               │    │
│  └──────────────────┬─────────────────────────────────┘    │
│                     │                                        │
│  ┌──────────────────▼─────────────────────────────────┐    │
│  │                  Service (ClusterIP)                │    │
│  │            todo-app-service (port 8000)            │    │
│  └──────────────────┬─────────────────────────────────┘    │
│                     │                                        │
│  ┌──────────────────▼─────────────────────────────────┐    │
│  │              Deployment (3 replicas)                │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐│    │
│  │  │   Pod 1     │  │   Pod 2     │  │   Pod 3     ││    │
│  │  │ ┌─────────┐ │  │ ┌─────────┐ │  │ ┌─────────┐││    │
│  │  │ │FastAPI  │ │  │ │FastAPI  │ │  │ │FastAPI  │││    │
│  │  │ │Container│ │  │ │Container│ │  │ │Container│││    │
│  │  │ └─────────┘ │  │ └─────────┘ │  │ └─────────┘││    │
│  │  └─────────────┘  └─────────────┘  └─────────────┘│    │
│  └──────────────────┬─────────────────────────────────┘    │
│                     │                                        │
│  ┌──────────────────▼─────────────────────────────────┐    │
│  │         PersistentVolumeClaim (RWX)                 │    │
│  │          (Shared storage for tasks.json)            │    │
│  └──────────────────┬─────────────────────────────────┘    │
│                     │                                        │
│  ┌──────────────────▼─────────────────────────────────┐    │
│  │            PersistentVolume (NFS/EBS)               │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                  ConfigMap & Secrets                  │  │
│  │  - Environment variables                              │  │
│  │  - OpenAI API key (or Ollama endpoint)               │  │
│  │  - Storage paths, timeouts, etc.                     │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘

External Dependencies:
┌─────────────────┐              ┌─────────────────┐
│  OpenAI API     │  OR          │  Ollama (Local) │
│  (Cloud)        │              │  (In-cluster)   │
└─────────────────┘              └─────────────────┘
```

### Deployment Environments

| Environment | Purpose | Replicas | AI Backend | Storage |
|-------------|---------|----------|------------|---------|
| **Development** | Local Minikube | 1 | Ollama (local) | hostPath |
| **Staging** | Pre-production testing | 2 | OpenAI API | NFS/EBS |
| **Production** | Live system | 3+ | OpenAI API | NFS/EBS with backups |

---

## Containerization Specification

### Dockerfile Requirements

#### FR-19: Multi-Stage Docker Build
**ID:** FR-19
**Priority:** Critical
**Description:** Docker image built using multi-stage process for minimal size and security.

**Stage 1: Builder**
- Base image: `python:3.11-slim` or `python:3.11-alpine`
- Install build dependencies (gcc, musl-dev for Alpine)
- Install Python dependencies from `requirements.txt`
- Create virtual environment
- Compile Python bytecode

**Stage 2: Runtime**
- Base image: `python:3.11-slim` or `python:3.11-alpine`
- Copy only virtual environment from builder
- Copy application source code
- Create non-root user `todoapp`
- Set working directory `/app`
- Expose port 8000
- Define healthcheck
- Run as non-root user

**Expected Dockerfile Structure:**
```dockerfile
# Stage 1: Builder
FROM python:3.11-slim AS builder
WORKDIR /build
COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

# Stage 2: Runtime
FROM python:3.11-slim
WORKDIR /app
COPY --from=builder /root/.local /root/.local
COPY src/ ./src/
RUN useradd -m -u 1000 todoapp && \
    chown -R todoapp:todoapp /app
USER todoapp
EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Image Size Target:** < 200MB
**Build Time Target:** < 2 minutes
**Security:** No root user, minimal attack surface

---

#### FR-20: Docker Image Optimization
**ID:** FR-20
**Priority:** High
**Description:** Optimized image for fast pulls, minimal size, and security.

**Optimization Requirements:**
1. **Layer Caching**
   - Copy `requirements.txt` before source code
   - Leverage build cache for dependencies
   - Separate frequently-changed from static files

2. **Size Reduction**
   - Use Alpine or slim base images
   - Remove build dependencies in final stage
   - Use `.dockerignore` to exclude unnecessary files
   - Compress layers where possible

3. **Security Hardening**
   - Scan for vulnerabilities (Trivy, Snyk)
   - Use specific version tags (not `latest`)
   - Run as non-root user
   - Read-only root filesystem where possible
   - Drop unnecessary capabilities

**.dockerignore Contents:**
```
__pycache__/
*.pyc
*.pyo
*.pyd
.Python
*.so
*.egg
*.egg-info/
dist/
build/
.git/
.gitignore
.pytest_cache/
.coverage
*.md
tests/
docs/
.env
.venv/
venv/
```

---

#### FR-21: Container Health Checks
**ID:** FR-21
**Priority:** High
**Description:** Container includes health check for orchestration readiness.

**Health Check Endpoint:** `GET /health`
**Expected Response:**
```json
{
  "status": "healthy",
  "version": "3.0.0",
  "openai": "connected" | "degraded",
  "storage": "accessible" | "unavailable"
}
```

**Health Check Criteria:**
- HTTP 200 status code
- Response time < 3 seconds
- Storage accessible
- AI backend reachable (warn if degraded, fail if unavailable)

**Dockerfile Healthcheck:**
```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1
```

**Kubernetes Probes:**
- **Liveness Probe:** Restart if unhealthy for 90 seconds
- **Readiness Probe:** Remove from load balancer if unhealthy
- **Startup Probe:** Allow 60 seconds for initial startup

---

## Kubernetes Manifests Specification

### Resource Definitions

#### FR-22: Deployment Manifest
**ID:** FR-22
**Priority:** Critical
**Description:** Kubernetes Deployment for FastAPI application with rolling updates.

**Deployment Specification:**

**Metadata:**
- Name: `todo-app-deployment`
- Namespace: `todo-app` (or environment-specific)
- Labels: `app=todo-app`, `version=3.0.0`, `tier=backend`

**Replica Count:**
- Development: 1
- Staging: 2
- Production: 3

**Pod Template:**
- Container name: `todo-app`
- Image: `<registry>/todo-app:3.0.0`
- Image pull policy: `IfNotPresent` (dev), `Always` (prod)
- Port: 8000
- Resource requests: CPU 100m, Memory 128Mi
- Resource limits: CPU 500m, Memory 512Mi

**Environment Variables (from ConfigMap):**
- `STORAGE_PATH=/data/tasks.json`
- `SESSION_TIMEOUT_MINUTES=30`
- `RATE_LIMIT_PER_MINUTE=100`
- `LOG_LEVEL=INFO`

**Environment Variables (from Secret):**
- `OPENAI_API_KEY` (base64 encoded)

**Volume Mounts:**
- `/data` → PersistentVolumeClaim `todo-app-storage`

**Strategy:**
- Type: `RollingUpdate`
- Max surge: 1
- Max unavailable: 0 (zero-downtime)

**Expected YAML Structure:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: todo-app-deployment
  namespace: todo-app
  labels:
    app: todo-app
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: todo-app
  template:
    metadata:
      labels:
        app: todo-app
    spec:
      containers:
      - name: todo-app
        image: todo-app:3.0.0
        ports:
        - containerPort: 8000
        env:
        - name: OPENAI_API_KEY
          valueFrom:
            secretKeyRef:
              name: todo-app-secrets
              key: openai-api-key
        envFrom:
        - configMapRef:
            name: todo-app-config
        volumeMounts:
        - name: storage
          mountPath: /data
        resources:
          requests:
            cpu: 100m
            memory: 128Mi
          limits:
            cpu: 500m
            memory: 512Mi
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 5
          periodSeconds: 5
      volumes:
      - name: storage
        persistentVolumeClaim:
          claimName: todo-app-pvc
```

---

#### FR-23: Service Manifest
**ID:** FR-23
**Priority:** Critical
**Description:** Kubernetes Service for load balancing across pods.

**Service Specification:**

**Metadata:**
- Name: `todo-app-service`
- Namespace: `todo-app`

**Type:** `ClusterIP` (internal), `LoadBalancer` (cloud), `NodePort` (Minikube)

**Selector:** `app=todo-app`

**Ports:**
- Name: `http`
- Protocol: `TCP`
- Port: 80 (external)
- TargetPort: 8000 (container)

**Session Affinity:** `ClientIP` (30-minute timeout to maintain session)

**Expected YAML Structure:**
```yaml
apiVersion: v1
kind: Service
metadata:
  name: todo-app-service
  namespace: todo-app
spec:
  type: ClusterIP
  sessionAffinity: ClientIP
  sessionAffinityConfig:
    clientIP:
      timeoutSeconds: 1800
  selector:
    app: todo-app
  ports:
  - name: http
    protocol: TCP
    port: 80
    targetPort: 8000
```

---

#### FR-24: ConfigMap Manifest
**ID:** FR-24
**Priority:** High
**Description:** ConfigMap for non-sensitive configuration.

**ConfigMap Contents:**

**Metadata:**
- Name: `todo-app-config`

**Data:**
- `STORAGE_PATH`: `/data/tasks.json`
- `SESSION_TIMEOUT_MINUTES`: `30`
- `RATE_LIMIT_PER_MINUTE`: `100`
- `LOG_LEVEL`: `INFO` (dev), `WARNING` (prod)
- `AI_BACKEND`: `openai` or `ollama`
- `OLLAMA_ENDPOINT`: `http://ollama-service:11434` (if local AI)

**Expected YAML Structure:**
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: todo-app-config
  namespace: todo-app
data:
  STORAGE_PATH: "/data/tasks.json"
  SESSION_TIMEOUT_MINUTES: "30"
  RATE_LIMIT_PER_MINUTE: "100"
  LOG_LEVEL: "INFO"
  AI_BACKEND: "openai"
```

---

#### FR-25: Secret Manifest
**ID:** FR-25
**Priority:** Critical
**Description:** Secret for sensitive credentials.

**Secret Contents:**

**Metadata:**
- Name: `todo-app-secrets`

**Type:** `Opaque`

**Data (base64 encoded):**
- `openai-api-key`: OpenAI API key

**Security Requirements:**
- Never commit to version control
- Use external secret management (Sealed Secrets, Vault) in production
- Rotate secrets regularly
- Encrypt at rest in etcd

**Expected YAML Structure:**
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: todo-app-secrets
  namespace: todo-app
type: Opaque
data:
  openai-api-key: <base64-encoded-key>
```

**Creation Method:**
```bash
kubectl create secret generic todo-app-secrets \
  --from-literal=openai-api-key=sk-... \
  -n todo-app
```

---

#### FR-26: PersistentVolumeClaim Manifest
**ID:** FR-26
**Priority:** High
**Description:** PVC for persistent task storage.

**PVC Specification:**

**Metadata:**
- Name: `todo-app-pvc`

**Access Modes:** `ReadWriteMany` (RWX) for multi-pod access

**Storage Class:**
- Minikube: `standard` (hostPath)
- Cloud: `nfs` or `efs` (AWS), `azurefile` (Azure), `filestore` (GCP)

**Storage Size:** 1Gi (sufficient for task data)

**Expected YAML Structure:**
```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: todo-app-pvc
  namespace: todo-app
spec:
  accessModes:
  - ReadWriteMany
  storageClassName: nfs
  resources:
    requests:
      storage: 1Gi
```

**Storage Considerations:**
- RWX required for shared access across pods
- Backup strategy: snapshot PV daily
- Disaster recovery: replicate to different zone/region

---

#### FR-27: Ingress Manifest
**ID:** FR-27
**Priority:** Medium
**Description:** Ingress for external HTTP access.

**Ingress Specification:**

**Metadata:**
- Name: `todo-app-ingress`

**Ingress Class:** `nginx` or `traefik`

**Rules:**
- Host: `todo-app.example.com` (configurable)
- Path: `/` (all paths)
- Backend: `todo-app-service:80`

**TLS:**
- Secret: `todo-app-tls` (cert-manager)
- Hosts: `todo-app.example.com`

**Annotations:**
- `cert-manager.io/cluster-issuer: letsencrypt-prod`
- `nginx.ingress.kubernetes.io/rate-limit: 100`

**Expected YAML Structure:**
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: todo-app-ingress
  namespace: todo-app
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  ingressClassName: nginx
  tls:
  - hosts:
    - todo-app.example.com
    secretName: todo-app-tls
  rules:
  - host: todo-app.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: todo-app-service
            port:
              number: 80
```

---

## Helm Chart Specification

### Chart Structure

#### FR-28: Helm Chart Organization
**ID:** FR-28
**Priority:** Critical
**Description:** Helm chart for templated, repeatable deployments.

**Directory Structure:**
```
todo-app/
├── Chart.yaml              # Chart metadata
├── values.yaml             # Default values
├── values-dev.yaml         # Development overrides
├── values-staging.yaml     # Staging overrides
├── values-prod.yaml        # Production overrides
├── templates/
│   ├── _helpers.tpl        # Template helpers
│   ├── deployment.yaml     # Deployment template
│   ├── service.yaml        # Service template
│   ├── configmap.yaml      # ConfigMap template
│   ├── secret.yaml         # Secret template (external in prod)
│   ├── pvc.yaml            # PVC template
│   ├── ingress.yaml        # Ingress template
│   ├── hpa.yaml            # HorizontalPodAutoscaler (optional)
│   └── NOTES.txt           # Post-install instructions
├── charts/                 # Dependency charts (Ollama)
└── .helmignore             # Files to exclude
```

---

#### FR-29: Chart.yaml Specification
**ID:** FR-29
**Priority:** High
**Description:** Helm chart metadata definition.

**Chart Metadata:**
- **apiVersion:** `v2`
- **name:** `todo-app`
- **description:** `Evolution of Todo - Conversational AI Task Manager`
- **type:** `application`
- **version:** `4.0.0` (chart version)
- **appVersion:** `3.0.0` (application version)
- **keywords:** `todo`, `ai`, `chatbot`, `task-management`
- **maintainers:** Name and email
- **home:** Repository URL
- **sources:** Git repository URLs

**Dependencies (Optional):**
- **name:** `ollama`
- **version:** `1.0.0`
- **repository:** `https://charts.example.com/`
- **condition:** `ollama.enabled`

**Expected Structure:**
```yaml
apiVersion: v2
name: todo-app
description: Evolution of Todo - Conversational AI Task Manager
type: application
version: 4.0.0
appVersion: 3.0.0
keywords:
  - todo
  - ai
  - chatbot
  - task-management
maintainers:
  - name: Claude Code
    email: noreply@anthropic.com
home: https://github.com/evolution-of-todo
sources:
  - https://github.com/evolution-of-todo
dependencies:
  - name: ollama
    version: "1.0.0"
    repository: "https://charts.otwld.com/"
    condition: ollama.enabled
```

---

#### FR-30: values.yaml Specification
**ID:** FR-30
**Priority:** Critical
**Description:** Default configuration values with sensible defaults.

**Values Structure:**

**Image Configuration:**
```yaml
image:
  repository: todo-app
  tag: "3.0.0"
  pullPolicy: IfNotPresent
```

**Replica Configuration:**
```yaml
replicaCount: 2
```

**Resource Configuration:**
```yaml
resources:
  requests:
    cpu: 100m
    memory: 128Mi
  limits:
    cpu: 500m
    memory: 512Mi
```

**Service Configuration:**
```yaml
service:
  type: ClusterIP
  port: 80
  targetPort: 8000
  sessionAffinity: ClientIP
```

**Ingress Configuration:**
```yaml
ingress:
  enabled: false
  className: nginx
  annotations: {}
  hosts:
    - host: todo-app.local
      paths:
        - path: /
          pathType: Prefix
  tls: []
```

**Storage Configuration:**
```yaml
persistence:
  enabled: true
  accessMode: ReadWriteMany
  size: 1Gi
  storageClass: ""
```

**AI Backend Configuration:**
```yaml
ai:
  backend: openai  # or "ollama"
  openai:
    apiKey: ""  # Set via --set or values override
  ollama:
    enabled: false
    endpoint: "http://ollama-service:11434"
```

**Application Configuration:**
```yaml
config:
  storagePath: "/data/tasks.json"
  sessionTimeoutMinutes: 30
  rateLimitPerMinute: 100
  logLevel: INFO
```

**Autoscaling Configuration:**
```yaml
autoscaling:
  enabled: false
  minReplicas: 2
  maxReplicas: 10
  targetCPUUtilizationPercentage: 80
```

---

#### FR-31: Template Helpers
**ID:** FR-31
**Priority:** Medium
**Description:** Reusable template functions in _helpers.tpl.

**Required Helpers:**

**Chart Name:**
```yaml
{{- define "todo-app.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}
```

**Full Name:**
```yaml
{{- define "todo-app.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
```

**Labels:**
```yaml
{{- define "todo-app.labels" -}}
helm.sh/chart: {{ include "todo-app.chart" . }}
{{ include "todo-app.selectorLabels" . }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}
```

**Selector Labels:**
```yaml
{{- define "todo-app.selectorLabels" -}}
app.kubernetes.io/name: {{ include "todo-app.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}
```

---

## Minikube Deployment Specification

### Local Kubernetes Setup

#### FR-32: Minikube Prerequisites
**ID:** FR-32
**Priority:** High
**Description:** Requirements for local Minikube deployment.

**System Requirements:**
- **CPU:** 2+ cores
- **RAM:** 4GB+ available
- **Disk:** 20GB+ free space
- **OS:** Windows, macOS, or Linux

**Software Requirements:**
- **Minikube:** v1.32+
- **kubectl:** v1.28+
- **Docker:** 24.0+ (or Podman)
- **Helm:** v3.13+

**Minikube Addons Required:**
- `ingress` - NGINX Ingress Controller
- `storage-provisioner` - Dynamic PV provisioning
- `metrics-server` - Resource metrics
- `dashboard` - Kubernetes Dashboard (optional)

**Installation Validation:**
```bash
minikube version
kubectl version --client
helm version
docker --version
```

---

#### FR-33: Minikube Cluster Configuration
**ID:** FR-33
**Priority:** High
**Description:** Minikube cluster setup with appropriate resources.

**Cluster Creation Command:**
```bash
minikube start \
  --cpus=2 \
  --memory=4096 \
  --disk-size=20g \
  --driver=docker \
  --kubernetes-version=v1.28.0 \
  --addons=ingress,storage-provisioner,metrics-server
```

**Profile Configuration:**
- **Profile Name:** `todo-app-dev`
- **Driver:** `docker` (default), `virtualbox`, `hyperv`, `podman`
- **Container Runtime:** `docker` or `containerd`

**Addon Enablement:**
```bash
minikube addons enable ingress
minikube addons enable storage-provisioner
minikube addons enable metrics-server
```

**Cluster Validation:**
```bash
minikube status
kubectl cluster-info
kubectl get nodes
```

---

#### FR-34: Local Image Building
**ID:** FR-34
**Priority:** High
**Description:** Build and load Docker image into Minikube.

**Build Strategy:**

**Option 1: Build with Minikube Docker Daemon**
```bash
eval $(minikube docker-env)
docker build -t todo-app:3.0.0 .
```

**Option 2: Build Locally and Load**
```bash
docker build -t todo-app:3.0.0 .
minikube image load todo-app:3.0.0
```

**Image Verification:**
```bash
minikube image ls | grep todo-app
```

**Image Tag Strategy:**
- Development: `todo-app:3.0.0-dev`
- Staging: `todo-app:3.0.0-staging`
- Production: `registry.example.com/todo-app:3.0.0`

---

#### FR-35: Minikube Deployment Steps
**ID:** FR-35
**Priority:** Critical
**Description:** Step-by-step deployment to Minikube cluster.

**Deployment Procedure:**

**Step 1: Create Namespace**
```bash
kubectl create namespace todo-app
```

**Step 2: Create Secrets**
```bash
kubectl create secret generic todo-app-secrets \
  --from-literal=openai-api-key=${OPENAI_API_KEY} \
  -n todo-app
```

**Step 3: Install with Helm**
```bash
helm install todo-app ./todo-app \
  --namespace todo-app \
  --values ./todo-app/values-dev.yaml \
  --set image.tag=3.0.0-dev \
  --set ingress.enabled=true \
  --set ingress.hosts[0].host=todo-app.local
```

**Step 4: Wait for Deployment**
```bash
kubectl rollout status deployment/todo-app-deployment -n todo-app
```

**Step 5: Get Service URL**
```bash
minikube service todo-app-service -n todo-app --url
```

**Step 6: Access Application**
```bash
# Get Minikube IP
MINIKUBE_IP=$(minikube ip)

# Add to /etc/hosts
echo "$MINIKUBE_IP todo-app.local" | sudo tee -a /etc/hosts

# Access via browser
curl http://todo-app.local/health
```

**Step 7: View Logs**
```bash
kubectl logs -f deployment/todo-app-deployment -n todo-app
```

**Step 8: Port Forwarding (Alternative Access)**
```bash
kubectl port-forward service/todo-app-service 8000:80 -n todo-app
# Access at http://localhost:8000
```

---

#### FR-36: Development Values Override
**ID:** FR-36
**Priority:** High
**Description:** Minikube-specific configuration overrides.

**values-dev.yaml Structure:**
```yaml
# Development environment overrides
replicaCount: 1

image:
  repository: todo-app
  tag: "3.0.0-dev"
  pullPolicy: Never  # Use local image

service:
  type: NodePort  # Expose via Minikube

ingress:
  enabled: true
  className: nginx
  hosts:
    - host: todo-app.local
      paths:
        - path: /
          pathType: Prefix

persistence:
  storageClass: "standard"  # Minikube default

resources:
  requests:
    cpu: 50m
    memory: 64Mi
  limits:
    cpu: 200m
    memory: 256Mi

config:
  logLevel: DEBUG

ai:
  backend: ollama  # Use local AI
  ollama:
    enabled: true

ollama:
  enabled: true
  replicaCount: 1
  resources:
    requests:
      cpu: 500m
      memory: 1Gi
```

---

## Local AI Deployment Specification

### Ollama Integration

#### FR-37: Local AI Architecture
**ID:** FR-37
**Priority:** High
**Description:** Deploy Ollama as local AI alternative to OpenAI.

**Architecture:**
```
┌─────────────────────────────────────────┐
│          Todo App Pods                  │
│  ┌─────────────┐  ┌─────────────┐      │
│  │ FastAPI     │  │ FastAPI     │      │
│  │ Container   │  │ Container   │      │
│  └──────┬──────┘  └──────┬──────┘      │
│         │                 │              │
│         └────────┬────────┘              │
│                  │                       │
│         ┌────────▼────────┐             │
│         │  Ollama Service │             │
│         │  (ClusterIP)    │             │
│         └────────┬────────┘             │
│                  │                       │
│         ┌────────▼────────┐             │
│         │  Ollama Pod     │             │
│         │  ┌───────────┐  │             │
│         │  │ Ollama    │  │             │
│         │  │ Container │  │             │
│         │  │           │  │             │
│         │  │ Model:    │  │             │
│         │  │ llama3.2  │  │             │
│         │  └───────────┘  │             │
│         └─────────────────┘             │
└─────────────────────────────────────────┘
```

**Why Ollama:**
- Run LLMs locally without internet
- No API costs
- Data privacy (no external calls)
- Faster response times (no network latency)
- Suitable for development/testing

**Supported Models:**
- `llama3.2` (3B parameters, fast)
- `llama3.1` (8B parameters, balanced)
- `mistral` (7B parameters, alternative)

---

#### FR-38: Ollama Deployment Manifest
**ID:** FR-38
**Priority:** High
**Description:** Kubernetes deployment for Ollama service.

**Deployment Specification:**

**Metadata:**
- Name: `ollama-deployment`
- Namespace: `todo-app`

**Container:**
- Image: `ollama/ollama:latest`
- Port: 11434
- Resources: CPU 1000m, Memory 2Gi (for 3B model)

**Volume Mount:**
- `/root/.ollama` → PVC for model storage (5Gi)

**Init Container:**
- Pull model on startup: `ollama pull llama3.2`

**Expected YAML Structure:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ollama-deployment
  namespace: todo-app
spec:
  replicas: 1
  selector:
    matchLabels:
      app: ollama
  template:
    metadata:
      labels:
        app: ollama
    spec:
      initContainers:
      - name: model-puller
        image: ollama/ollama:latest
        command: ['ollama', 'pull', 'llama3.2']
        volumeMounts:
        - name: ollama-storage
          mountPath: /root/.ollama
      containers:
      - name: ollama
        image: ollama/ollama:latest
        ports:
        - containerPort: 11434
        volumeMounts:
        - name: ollama-storage
          mountPath: /root/.ollama
        resources:
          requests:
            cpu: 500m
            memory: 1Gi
          limits:
            cpu: 2000m
            memory: 4Gi
      volumes:
      - name: ollama-storage
        persistentVolumeClaim:
          claimName: ollama-pvc
```

**Service Manifest:**
```yaml
apiVersion: v1
kind: Service
metadata:
  name: ollama-service
  namespace: todo-app
spec:
  selector:
    app: ollama
  ports:
  - port: 11434
    targetPort: 11434
```

---

#### FR-39: Local AI Integration
**ID:** FR-39
**Priority:** High
**Description:** Configure Todo app to use Ollama instead of OpenAI.

**Configuration Changes:**

**Environment Variables:**
- `AI_BACKEND=ollama`
- `OLLAMA_ENDPOINT=http://ollama-service:11434`
- `OLLAMA_MODEL=llama3.2`

**ConfigMap Update:**
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: todo-app-config
data:
  AI_BACKEND: "ollama"
  OLLAMA_ENDPOINT: "http://ollama-service:11434"
  OLLAMA_MODEL: "llama3.2"
```

**Code Adaptation (Application Level):**
- Detect `AI_BACKEND` environment variable
- If `ollama`: use Ollama API client instead of OpenAI
- API compatibility layer for tool calls
- Prompt formatting differences handled

**Ollama API Compatibility:**
- Ollama provides OpenAI-compatible API
- Use `/v1/chat/completions` endpoint
- Tools/functions supported (with limitations)

---

#### FR-40: Model Selection Strategy
**ID:** FR-40
**Priority:** Medium
**Description:** Choose appropriate local model based on resources.

**Model Comparison:**

| Model | Size | Parameters | RAM Required | Speed | Quality |
|-------|------|------------|--------------|-------|---------|
| llama3.2 | 2GB | 3B | 2GB | Fast | Good |
| llama3.1 | 5GB | 8B | 6GB | Medium | Better |
| mistral | 4GB | 7B | 5GB | Medium | Good |
| phi-3 | 2GB | 3.8B | 2GB | Fast | Good |

**Selection Criteria:**
- **Development (Minikube):** llama3.2 (fast, small)
- **Staging (Cloud):** llama3.1 (balanced)
- **Production:** OpenAI API (best quality)

**Configuration via Helm:**
```yaml
ai:
  backend: ollama
  ollama:
    model: llama3.2  # Override per environment
```

---

## Configuration Management

### Environment-Based Configuration

#### FR-41: Multi-Environment Support
**ID:** FR-41
**Priority:** High
**Description:** Support dev, staging, prod environments with separate configs.

**Environment Differences:**

| Config | Development | Staging | Production |
|--------|-------------|---------|------------|
| Replicas | 1 | 2 | 3+ |
| Resources | Minimal | Medium | High |
| AI Backend | Ollama | OpenAI | OpenAI |
| Log Level | DEBUG | INFO | WARNING |
| Storage | hostPath | NFS | NFS + Backup |
| TLS | Disabled | Enabled | Enabled |
| Ingress | NodePort | LoadBalancer | LoadBalancer |

**Helm Values Files:**
- `values.yaml` - Base defaults
- `values-dev.yaml` - Development overrides
- `values-staging.yaml` - Staging overrides
- `values-prod.yaml` - Production overrides

**Deployment Command:**
```bash
# Development
helm install todo-app ./todo-app -f values-dev.yaml

# Staging
helm install todo-app ./todo-app -f values-staging.yaml

# Production
helm install todo-app ./todo-app -f values-prod.yaml
```

---

#### FR-42: Secret Management
**ID:** FR-42
**Priority:** Critical
**Description:** Secure handling of sensitive credentials.

**Secret Sources by Environment:**

**Development:**
- Method: Manual kubectl create secret
- Storage: Kubernetes secrets (base64)
- Rotation: Manual

**Staging:**
- Method: Sealed Secrets or SOPS
- Storage: Git repository (encrypted)
- Rotation: Manual

**Production:**
- Method: External Secrets Operator + Vault/AWS Secrets Manager
- Storage: External secret store
- Rotation: Automatic (30 days)

**Sealed Secrets Example:**
```bash
# Install Sealed Secrets controller
helm install sealed-secrets sealed-secrets/sealed-secrets -n kube-system

# Create sealed secret
kubectl create secret generic todo-app-secrets \
  --from-literal=openai-api-key=sk-... \
  --dry-run=client -o yaml | \
  kubeseal -o yaml > sealed-secret.yaml

# Commit sealed-secret.yaml to git (safe)
kubectl apply -f sealed-secret.yaml
```

**External Secrets Example:**
```yaml
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: todo-app-secrets
spec:
  refreshInterval: 1h
  secretStoreRef:
    name: vault-backend
    kind: SecretStore
  target:
    name: todo-app-secrets
  data:
  - secretKey: openai-api-key
    remoteRef:
      key: todo-app/openai-api-key
```

---

## Monitoring & Observability

#### FR-43: Logging Strategy
**ID:** FR-43
**Priority:** High
**Description:** Structured logging with centralized aggregation.

**Logging Requirements:**
- **Format:** JSON structured logs
- **Fields:** timestamp, level, message, request_id, session_id
- **Output:** stdout (captured by Kubernetes)
- **Aggregation:** Fluent Bit → Elasticsearch/Loki
- **Retention:** 7 days (dev), 30 days (prod)

**Log Levels:**
- Development: DEBUG
- Staging: INFO
- Production: WARNING

**Example Log Entry:**
```json
{
  "timestamp": "2025-12-31T10:00:00Z",
  "level": "INFO",
  "message": "Task added successfully",
  "request_id": "req_abc123",
  "session_id": "sess_xyz789",
  "task_id": 1,
  "intent": "AddTask",
  "confidence": 0.95
}
```

**Fluent Bit ConfigMap:**
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: fluent-bit-config
data:
  fluent-bit.conf: |
    [INPUT]
        Name              tail
        Path              /var/log/containers/todo-app*.log
        Parser            docker
        Tag               todo-app.*
    [OUTPUT]
        Name              es
        Match             todo-app.*
        Host              elasticsearch
        Port              9200
```

---

#### FR-44: Metrics & Monitoring
**ID:** FR-44
**Priority:** Medium
**Description:** Prometheus metrics for performance monitoring.

**Metrics to Expose:**

**Application Metrics:**
- `todo_app_requests_total` (counter) - Total HTTP requests
- `todo_app_request_duration_seconds` (histogram) - Request latency
- `todo_app_tasks_total` (gauge) - Total tasks in system
- `todo_app_sessions_active` (gauge) - Active sessions
- `todo_app_ai_requests_total` (counter) - AI API calls
- `todo_app_ai_request_duration_seconds` (histogram) - AI latency
- `todo_app_errors_total` (counter) - Error count by type

**Kubernetes Metrics:**
- CPU usage per pod
- Memory usage per pod
- Restart count
- Network I/O

**Prometheus Annotations:**
```yaml
annotations:
  prometheus.io/scrape: "true"
  prometheus.io/port: "8000"
  prometheus.io/path: "/metrics"
```

**Example Metrics Endpoint:**
```
# HELP todo_app_requests_total Total number of requests
# TYPE todo_app_requests_total counter
todo_app_requests_total{method="POST",endpoint="/sessions/{id}/messages",status="200"} 1234

# HELP todo_app_request_duration_seconds Request duration
# TYPE todo_app_request_duration_seconds histogram
todo_app_request_duration_seconds_bucket{le="0.1"} 450
todo_app_request_duration_seconds_bucket{le="0.5"} 890
```

---

#### FR-45: Health & Readiness Probes
**ID:** FR-45
**Priority:** Critical
**Description:** Kubernetes probes for automated health management.

**Liveness Probe:**
- **Purpose:** Restart unhealthy containers
- **Endpoint:** `GET /health`
- **Initial Delay:** 30 seconds
- **Period:** 10 seconds
- **Timeout:** 3 seconds
- **Failure Threshold:** 3 (restart after 30 seconds unhealthy)

**Readiness Probe:**
- **Purpose:** Remove from load balancer when not ready
- **Endpoint:** `GET /health`
- **Initial Delay:** 5 seconds
- **Period:** 5 seconds
- **Timeout:** 3 seconds
- **Failure Threshold:** 2

**Startup Probe:**
- **Purpose:** Allow slow startup (AI model loading)
- **Endpoint:** `GET /health`
- **Initial Delay:** 0 seconds
- **Period:** 5 seconds
- **Timeout:** 3 seconds
- **Failure Threshold:** 12 (60 seconds total)

**Probe Configuration:**
```yaml
livenessProbe:
  httpGet:
    path: /health
    port: 8000
  initialDelaySeconds: 30
  periodSeconds: 10
  timeoutSeconds: 3
  failureThreshold: 3

readinessProbe:
  httpGet:
    path: /health
    port: 8000
  initialDelaySeconds: 5
  periodSeconds: 5
  timeoutSeconds: 3
  failureThreshold: 2

startupProbe:
  httpGet:
    path: /health
    port: 8000
  initialDelaySeconds: 0
  periodSeconds: 5
  timeoutSeconds: 3
  failureThreshold: 12
```

---

## Security Hardening

#### FR-46: Container Security
**ID:** FR-46
**Priority:** Critical
**Description:** Secure container configuration following best practices.

**Security Measures:**

**1. Non-Root User:**
- Run as UID 1000 (todoapp user)
- Drop all capabilities
- Read-only root filesystem

**2. Security Context:**
```yaml
securityContext:
  runAsNonRoot: true
  runAsUser: 1000
  runAsGroup: 1000
  fsGroup: 1000
  allowPrivilegeEscalation: false
  capabilities:
    drop:
    - ALL
  readOnlyRootFilesystem: true
```

**3. Image Scanning:**
- Scan with Trivy or Snyk before deployment
- Fail CI/CD on HIGH or CRITICAL vulnerabilities
- Regular rescans of base images

**4. Network Policies:**
```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: todo-app-netpol
spec:
  podSelector:
    matchLabels:
      app: todo-app
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: nginx-ingress
    ports:
    - port: 8000
  egress:
  - to:
    - podSelector:
        matchLabels:
          app: ollama
    ports:
    - port: 11434
  - to:
    - namespaceSelector: {}
      podSelector:
        matchLabels:
          k8s-app: kube-dns
    ports:
    - port: 53
      protocol: UDP
```

---

#### FR-47: RBAC Configuration
**ID:** FR-47
**Priority:** High
**Description:** Role-Based Access Control for service account.

**ServiceAccount:**
```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: todo-app-sa
  namespace: todo-app
```

**Role (Namespace-scoped):**
```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: todo-app-role
  namespace: todo-app
rules:
- apiGroups: [""]
  resources: ["configmaps"]
  verbs: ["get", "list"]
- apiGroups: [""]
  resources: ["secrets"]
  verbs: ["get"]
```

**RoleBinding:**
```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: todo-app-rolebinding
  namespace: todo-app
subjects:
- kind: ServiceAccount
  name: todo-app-sa
  namespace: todo-app
roleRef:
  kind: Role
  name: todo-app-role
  apiGroup: rbac.authorization.k8s.io
```

**Deployment Update:**
```yaml
spec:
  template:
    spec:
      serviceAccountName: todo-app-sa
```

---

## Acceptance Criteria

### AC-1: Docker Containerization
- [ ] Multi-stage Dockerfile builds successfully
- [ ] Final image size < 200MB
- [ ] Image builds in < 2 minutes
- [ ] Runs as non-root user (UID 1000)
- [ ] Healthcheck passes in < 3 seconds
- [ ] No HIGH/CRITICAL vulnerabilities (Trivy scan)
- [ ] .dockerignore excludes unnecessary files

### AC-2: Kubernetes Deployment
- [ ] Deployment manifest creates pods successfully
- [ ] Service routes traffic to pods correctly
- [ ] ConfigMap applies configuration properly
- [ ] Secret mounts credentials securely
- [ ] PVC provides persistent storage
- [ ] Ingress exposes application externally
- [ ] Rolling updates complete with zero downtime

### AC-3: Helm Chart
- [ ] Chart installs successfully with default values
- [ ] Templates render correctly with different values
- [ ] Dependencies install properly (Ollama)
- [ ] Upgrade works without data loss
- [ ] Rollback restores previous version
- [ ] Chart passes `helm lint` validation
- [ ] NOTES.txt displays useful information

### AC-4: Minikube Deployment
- [ ] Minikube cluster starts with required addons
- [ ] Image builds and loads into Minikube
- [ ] Helm chart installs on Minikube
- [ ] Application accessible via NodePort
- [ ] Ingress works with /etc/hosts entry
- [ ] Logs accessible via kubectl
- [ ] Port forwarding provides access

### AC-5: Local AI (Ollama)
- [ ] Ollama deployment creates pod successfully
- [ ] Model pulls and loads correctly
- [ ] Service exposes port 11434
- [ ] Todo app connects to Ollama successfully
- [ ] Conversations work with local AI
- [ ] Performance acceptable (<5s response)
- [ ] Model persistence across restarts

### AC-6: Multi-Environment
- [ ] Dev values override defaults correctly
- [ ] Staging values configure 2 replicas
- [ ] Prod values configure 3+ replicas
- [ ] Environment-specific configs apply
- [ ] Secrets managed per environment
- [ ] Resource limits appropriate per env

### AC-7: Configuration Management
- [ ] ConfigMap values injected as env vars
- [ ] Secrets base64 encoded and mounted
- [ ] External Secrets Operator works (prod)
- [ ] Sealed Secrets encrypt properly (staging)
- [ ] Config changes trigger pod restart
- [ ] No secrets in version control

### AC-8: Monitoring & Observability
- [ ] Structured JSON logs output to stdout
- [ ] Logs aggregated by Fluent Bit
- [ ] Prometheus scrapes metrics endpoint
- [ ] Metrics exported correctly
- [ ] Dashboards display key metrics
- [ ] Alerts configured for errors

### AC-9: Health Checks
- [ ] Liveness probe restarts unhealthy pods
- [ ] Readiness probe removes unready pods
- [ ] Startup probe allows initial startup
- [ ] /health endpoint returns 200
- [ ] Probe timeouts configured correctly
- [ ] Failed probes logged appropriately

### AC-10: Security
- [ ] Containers run as non-root
- [ ] Security context applied correctly
- [ ] Image scans pass with no critical vulns
- [ ] Network policies restrict traffic
- [ ] RBAC limits service account permissions
- [ ] Secrets encrypted at rest
- [ ] TLS enabled for external traffic (prod)

### AC-11: Performance
- [ ] Application starts in < 60 seconds
- [ ] Rolling update completes in < 2 minutes
- [ ] Supports 100 concurrent sessions
- [ ] API responds in < 500ms (excluding AI)
- [ ] No memory leaks during 24hr test
- [ ] Storage I/O performs adequately

### AC-12: Documentation
- [ ] README includes deployment instructions
- [ ] Helm chart README documents all values
- [ ] Minikube setup guide complete
- [ ] Troubleshooting section included
- [ ] Architecture diagrams provided
- [ ] CHANGELOG updated with Phase IV

### AC-13: CI/CD Readiness
- [ ] Dockerfile builds in CI pipeline
- [ ] Helm chart lints in CI
- [ ] Image tagged with git commit SHA
- [ ] Automated testing passes
- [ ] Security scans integrated
- [ ] Deployment scriptable

---

## Implementation Checklist

### Phase IV Deliverables

**Required Files:**
- [ ] `Dockerfile` - Multi-stage container build
- [ ] `.dockerignore` - Build exclusions
- [ ] `kubernetes/deployment.yaml` - Deployment manifest
- [ ] `kubernetes/service.yaml` - Service manifest
- [ ] `kubernetes/configmap.yaml` - ConfigMap
- [ ] `kubernetes/secret.yaml.template` - Secret template
- [ ] `kubernetes/pvc.yaml` - PersistentVolumeClaim
- [ ] `kubernetes/ingress.yaml` - Ingress
- [ ] `kubernetes/ollama-deployment.yaml` - Ollama deployment
- [ ] `helm/todo-app/Chart.yaml` - Helm chart metadata
- [ ] `helm/todo-app/values.yaml` - Default values
- [ ] `helm/todo-app/values-dev.yaml` - Dev overrides
- [ ] `helm/todo-app/values-staging.yaml` - Staging overrides
- [ ] `helm/todo-app/values-prod.yaml` - Prod overrides
- [ ] `helm/todo-app/templates/_helpers.tpl` - Template helpers
- [ ] `helm/todo-app/templates/deployment.yaml` - Deployment template
- [ ] `helm/todo-app/templates/service.yaml` - Service template
- [ ] `helm/todo-app/templates/configmap.yaml` - ConfigMap template
- [ ] `helm/todo-app/templates/ingress.yaml` - Ingress template
- [ ] `helm/todo-app/templates/NOTES.txt` - Install notes
- [ ] `scripts/minikube-setup.sh` - Minikube initialization
- [ ] `scripts/deploy-local.sh` - Local deployment script
- [ ] `scripts/build-image.sh` - Image build script
- [ ] `DEPLOYMENT.md` - Deployment documentation

**Optional Files:**
- [ ] `kubernetes/hpa.yaml` - HorizontalPodAutoscaler
- [ ] `kubernetes/networkpolicy.yaml` - Network policies
- [ ] `kubernetes/rbac.yaml` - RBAC configuration
- [ ] `monitoring/prometheus.yaml` - Prometheus config
- [ ] `monitoring/grafana-dashboard.json` - Grafana dashboard
- [ ] `.github/workflows/build.yml` - CI pipeline
- [ ] `.github/workflows/deploy.yml` - CD pipeline

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 4.0.0 | 2025-12-31 | Human Architect | Phase IV deployment specification |

---

## Approval

**Specification Status:** Ready for Implementation

**Next Steps:**
1. Human reviews and approves deployment architecture
2. Set up Minikube development environment
3. Hand off to Claude Code for implementation
4. Claude Code creates all deployment artifacts
5. Test local Minikube deployment
6. Test with Ollama local AI
7. Prepare for cloud deployment
8. Human reviews and approves

---

**Document Owner:** Human Architect
**Implementation Owner:** Claude Code (when approved)
**Governed By:** CONSTITUTION.md v1.0.0
**Deploys:** SPEC-PHASE-III.md v3.0.0
