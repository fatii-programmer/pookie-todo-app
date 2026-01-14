#!/bin/bash

echo "🚀 Pookie Todo Deployment Script"
echo "=================================="

# Check for Minikube
if ! command -v minikube &> /dev/null; then
    echo "❌ Minikube not found. Please install Minikube first."
    exit 1
fi

# Check for kubectl
if ! command -v kubectl &> /dev/null; then
    echo "❌ kubectl not found. Please install kubectl first."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Start Minikube
echo "🔧 Starting Minikube..."
minikube start --driver=docker
minikube addons enable ingress

# Build Docker images
echo "🐳 Building Docker images..."
eval $(minikube docker-env)
docker build -t pookie-frontend:latest .
docker build -t pookie-backend:latest ./backend

# Create secrets
if [ ! -f "k8s/secrets.yaml" ]; then
    echo "⚠️  Creating secrets.yaml from example..."
    cp k8s/secrets.yaml.example k8s/secrets.yaml
    echo "📝 Please edit k8s/secrets.yaml with your actual secrets"
    echo "   Then run this script again."
    exit 0
fi

# Deploy to Kubernetes
echo "☸️  Deploying to Kubernetes..."
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/pvc.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/ingress.yaml

# Wait for deployments
echo "⏳ Waiting for deployments to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/frontend -n pookie-todo
kubectl wait --for=condition=available --timeout=300s deployment/backend -n pookie-todo

echo ""
echo "✨ Deployment complete!"
echo ""
echo "📊 Status:"
kubectl get pods -n pookie-todo

echo ""
echo "🌐 Access the application:"
echo "   kubectl port-forward -n pookie-todo service/frontend 3000:3000"
echo "   Then open: http://localhost:3000"
echo ""
echo "📝 View logs:"
echo "   kubectl logs -n pookie-todo deployment/frontend"
echo "   kubectl logs -n pookie-todo deployment/backend"
