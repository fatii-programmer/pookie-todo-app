# Pookie Todo - Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────┐
│                   Ingress                       │
│              (pookie.local)                     │
└───────────┬─────────────────────┬───────────────┘
            │                     │
    ┌───────▼──────┐      ┌──────▼──────┐
    │   Frontend   │      │   Backend   │
    │   Next.js    │◄────►│   FastAPI   │
    │   (Port 3000)│      │  (Port 8000)│
    └──────────────┘      └──────┬──────┘
                                 │
                          ┌──────▼──────┐
                          │     PVC     │
                          │  (Storage)  │
                          └─────────────┘
```

## Components

### Frontend (Next.js)
- **Container**: Node.js 18 Alpine
- **Framework**: Next.js 14 App Router
- **Styling**: Tailwind CSS + Framer Motion
- **State**: Zustand
- **Port**: 3000
- **Replicas**: 2 (in Kubernetes)

### Backend (FastAPI)
- **Container**: Python 3.11 Slim
- **Framework**: FastAPI + Uvicorn
- **Auth**: JWT (jose)
- **AI**: OpenAI GPT-4
- **Storage**: JSON files
- **Port**: 8000
- **Replicas**: 2 (in Kubernetes)

### Kubernetes Resources

**Namespace**: pookie-todo

**Deployments**:
- frontend (2 replicas)
- backend (2 replicas)

**Services**:
- frontend (ClusterIP, port 3000)
- backend (ClusterIP, port 8000)

**Ingress**:
- Routes `/api/*` → backend
- Routes `/*` → frontend

**Storage**:
- PersistentVolumeClaim (1Gi)
- Mounted at `/app/data` in backend

**Secrets**:
- jwt-secret
- openai-key

## Data Flow

### Authentication Flow
```
Client → Frontend → Backend /api/auth/login
                  ← JWT Token
Client stores token
Client → Frontend → Backend /api/todos (with Bearer token)
                  ← Authorized response
```

### AI Chat Flow
```
User types message → Frontend
                   → Backend /api/ai/chat
                   → OpenAI GPT-4 API
                   ← AI response
Frontend ← Backend
Chat bubble displayed
```

### Task Management Flow
```
User creates task → Frontend (optimistic update)
                  → Backend /api/todos
                  → JSON file storage
                  ← Confirmation
Frontend updates state
```

## Deployment Models

### Local Development
```
docker-compose up
├── frontend:3000
└── backend:8000
```

### Minikube
```
minikube start
kubectl apply -f k8s/
├── Ingress (pookie.local)
├── Frontend Service
├── Backend Service
└── PVC
```

### Production Kubernetes
```
Cloud K8s Cluster
├── LoadBalancer Ingress
├── Frontend Deployment (N replicas)
├── Backend Deployment (N replicas)
├── PVC (Cloud Storage)
└── TLS/SSL (cert-manager)
```

## Scaling Strategy

**Horizontal Scaling**:
```bash
kubectl scale deployment/frontend --replicas=5 -n pookie-todo
kubectl scale deployment/backend --replicas=5 -n pookie-todo
```

**Resource Limits** (add to deployments):
```yaml
resources:
  requests:
    memory: "256Mi"
    cpu: "250m"
  limits:
    memory: "512Mi"
    cpu: "500m"
```

## Security

- JWT tokens (httpOnly cookies in production)
- Bcrypt password hashing
- CORS configured
- Secrets stored in Kubernetes Secrets
- No hardcoded credentials

## Monitoring

Add to deployments:
```bash
# Prometheus metrics
# Grafana dashboards
# Health check endpoints: /health
```

## High Availability

- 2+ replicas per service
- Pod anti-affinity rules
- PVC with ReadWriteMany for shared storage
- Ingress with SSL/TLS termination
- Database backup strategy

## Future Enhancements

- PostgreSQL instead of JSON files
- Redis for session storage
- Horizontal Pod Autoscaler (HPA)
- Network policies
- Service mesh (Istio)
- CI/CD pipeline
- Monitoring stack
- Log aggregation
