# Pookie Todo Helm Chart

Helm chart for deploying the Pookie Todo AI-powered task management application to Kubernetes.

## Prerequisites

- Kubernetes 1.28+
- Helm 3.13+
- kubectl configured for your cluster

## Installation

### Quick Start (Minikube)

```bash
# Start Minikube with required addons
minikube start --cpus=2 --memory=4096
minikube addons enable ingress

# Build images in Minikube
eval $(minikube docker-env)
docker build -t pookie-frontend:latest .
docker build -t pookie-backend:latest ./backend

# Create secrets
kubectl create namespace pookie-todo
kubectl create secret generic pookie-secrets \
  --from-literal=jwt-secret=your-secret-key \
  --from-literal=openai-key=sk-your-openai-key \
  -n pookie-todo

# Install chart
helm install pookie-todo ./helm/pookie-todo \
  --namespace pookie-todo \
  --values ./helm/pookie-todo/values-dev.yaml

# Access application
minikube service frontend -n pookie-todo
```

### Production Installation

```bash
# Install with custom values
helm install pookie-todo ./helm/pookie-todo \
  --namespace pookie-todo \
  --create-namespace \
  --set image.frontend.repository=registry.example.com/pookie-frontend \
  --set image.frontend.tag=1.0.0 \
  --set image.backend.repository=registry.example.com/pookie-backend \
  --set image.backend.tag=1.0.0 \
  --set secrets.jwtSecret=your-jwt-secret \
  --set secrets.openaiApiKey=sk-your-key \
  --set ingress.hosts[0].host=todo.example.com
```

## Configuration

### Key Values

| Parameter | Description | Default |
|-----------|-------------|---------|
| `replicaCount.frontend` | Number of frontend replicas | `2` |
| `replicaCount.backend` | Number of backend replicas | `2` |
| `image.frontend.repository` | Frontend image repository | `pookie-frontend` |
| `image.frontend.tag` | Frontend image tag | `latest` |
| `image.backend.repository` | Backend image repository | `pookie-backend` |
| `image.backend.tag` | Backend image tag | `latest` |
| `ingress.enabled` | Enable ingress | `true` |
| `ingress.className` | Ingress class | `nginx` |
| `ingress.hosts[0].host` | Ingress hostname | `pookie.local` |
| `persistence.enabled` | Enable persistent storage | `true` |
| `persistence.size` | PVC storage size | `1Gi` |
| `persistence.accessMode` | PVC access mode | `ReadWriteMany` |
| `secrets.jwtSecret` | JWT signing secret | `""` |
| `secrets.openaiApiKey` | OpenAI API key | `""` |
| `config.logLevel` | Application log level | `INFO` |
| `resources.backend.limits.cpu` | Backend CPU limit | `500m` |
| `resources.backend.limits.memory` | Backend memory limit | `512Mi` |

### Environment-Specific Values

#### Development (values-dev.yaml)
- 1 replica each
- NodePort service
- Minimal resource limits
- DEBUG logging
- Local images (pullPolicy: Never)

#### Staging (values-staging.yaml)
Create this file with:
- 2 replicas each
- ClusterIP/LoadBalancer service
- Medium resource limits
- INFO logging
- Registry images

#### Production (values-prod.yaml)
Create this file with:
- 3+ replicas each
- LoadBalancer service
- Production resource limits
- WARNING logging
- Registry images with version tags
- TLS enabled

## Upgrading

```bash
# Upgrade with new values
helm upgrade pookie-todo ./helm/pookie-todo \
  --namespace pookie-todo \
  --values ./helm/pookie-todo/values-dev.yaml

# Rollback if needed
helm rollback pookie-todo -n pookie-todo
```

## Uninstalling

```bash
helm uninstall pookie-todo -n pookie-todo
kubectl delete namespace pookie-todo
```

## Accessing the Application

### Via Ingress

Add to `/etc/hosts`:
```
<MINIKUBE_IP> pookie.local
```

Then open: http://pookie.local

### Via Port Forward

```bash
kubectl port-forward -n pookie-todo service/frontend 3000:3000
```

Open: http://localhost:3000

### Via NodePort (Minikube)

```bash
minikube service frontend -n pookie-todo --url
```

## Troubleshooting

### Pods not starting

```bash
kubectl describe pod <pod-name> -n pookie-todo
kubectl logs <pod-name> -n pookie-todo
```

### Health check failing

```bash
kubectl port-forward -n pookie-todo service/backend 8000:8000
curl http://localhost:8000/health
```

### Storage issues

```bash
kubectl get pvc -n pookie-todo
kubectl describe pvc pookie-pvc -n pookie-todo
```

### Secrets not found

```bash
kubectl create secret generic pookie-secrets \
  --from-literal=jwt-secret=my-secret \
  --from-literal=openai-key=sk-... \
  -n pookie-todo
```

## Chart Development

### Linting

```bash
helm lint ./helm/pookie-todo
```

### Template Rendering

```bash
helm template pookie-todo ./helm/pookie-todo \
  --values ./helm/pookie-todo/values-dev.yaml
```

### Dry Run

```bash
helm install pookie-todo ./helm/pookie-todo \
  --dry-run --debug \
  --values ./helm/pookie-todo/values-dev.yaml
```

## License

MIT
