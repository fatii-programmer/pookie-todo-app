# Deployment Guide - Pookie Todo

## Local Development with Minikube

### Prerequisites
- Docker Desktop
- Minikube
- kubectl

### Setup Steps

1. **Start Minikube**
```bash
minikube start --driver=docker
minikube addons enable ingress
```

2. **Build Docker Images**
```bash
# Use Minikube's Docker daemon
eval $(minikube docker-env)

# Build frontend
docker build -t pookie-frontend:latest .

# Build backend
docker build -t pookie-backend:latest ./backend
```

3. **Create Kubernetes Secrets**
```bash
# Copy and edit secrets
cp k8s/secrets.yaml.example k8s/secrets.yaml
# Edit k8s/secrets.yaml with your actual secrets

# Apply secrets
kubectl apply -f k8s/secrets.yaml
```

4. **Deploy to Kubernetes**
```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/pvc.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/ingress.yaml
```

5. **Configure Local DNS**
Add to `/etc/hosts` (or `C:\Windows\System32\drivers\etc\hosts`):
```
127.0.0.1 pookie.local
```

6. **Access Application**
```bash
# Get Minikube IP
minikube ip

# Forward ports
kubectl port-forward -n pookie-todo service/frontend 3000:3000
kubectl port-forward -n pookie-todo service/backend 8000:8000
```

Open browser: http://pookie.local:3000

### Useful Commands

```bash
# Check pod status
kubectl get pods -n pookie-todo

# View logs
kubectl logs -n pookie-todo deployment/frontend
kubectl logs -n pookie-todo deployment/backend

# Scale deployments
kubectl scale deployment/frontend --replicas=3 -n pookie-todo

# Delete all resources
kubectl delete namespace pookie-todo

# Restart deployments
kubectl rollout restart deployment/frontend -n pookie-todo
kubectl rollout restart deployment/backend -n pookie-todo
```

## Docker Compose (Alternative)

For simpler local development:

```bash
# Create .env file
echo "JWT_SECRET=your-secret" > .env
echo "OPENAI_API_KEY=sk-your-key" >> .env

# Start services
docker-compose up --build

# Access at http://localhost:3000
```

## Production Deployment

### Build Production Images

```bash
docker build -t your-registry/pookie-frontend:v1.0.0 .
docker build -t your-registry/pookie-backend:v1.0.0 ./backend

docker push your-registry/pookie-frontend:v1.0.0
docker push your-registry/pookie-backend:v1.0.0
```

### Deploy to Cloud Kubernetes

1. Update image references in k8s/*.yaml
2. Apply manifests:
```bash
kubectl apply -f k8s/
```

3. Configure external DNS/Ingress
4. Enable TLS with cert-manager

## Monitoring

```bash
# Watch pods
kubectl get pods -n pookie-todo -w

# Resource usage
kubectl top pods -n pookie-todo

# Describe issues
kubectl describe pod <pod-name> -n pookie-todo
```

## Troubleshooting

**Pods not starting:**
```bash
kubectl describe pod <pod-name> -n pookie-todo
kubectl logs <pod-name> -n pookie-todo
```

**Image pull errors:**
```bash
# Verify Docker images exist
docker images | grep pookie

# Rebuild if needed
eval $(minikube docker-env)
docker build -t pookie-frontend:latest .
```

**Ingress not working:**
```bash
# Verify ingress addon
minikube addons list

# Enable if needed
minikube addons enable ingress
```
