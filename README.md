# Pookie Todo - Phase III

AI-powered web todo application with pastel "pookie" aesthetic, natural language processing, and full Kubernetes deployment.

## Architecture

**Frontend:** Next.js 14 (Docker)
**Backend:** FastAPI (Python, Docker)
**Orchestration:** Kubernetes
**Local Dev:** Minikube
**AI:** OpenAI GPT-4
**Database:** JSON file (persistent volume)

## Features

- AI-powered natural language chat
- Soft pastel "pookie" aesthetic
- Responsive design (desktop/tablet/mobile)
- JWT authentication
- Persistent storage
- Framer Motion animations
- Kubernetes-ready deployment

## Quick Start

### Option 1: Docker Compose (Recommended for Development)

```bash
# Setup
npm install
cp .env.local.example .env.local
# Edit .env.local with your keys

# Run
docker-compose up --build

# Access at http://localhost:3000
```

### Option 2: Minikube (Full Kubernetes)

```bash
# Start Minikube
minikube start --driver=docker
minikube addons enable ingress

# Build images
eval $(minikube docker-env)
docker build -t pookie-frontend:latest .
docker build -t pookie-backend:latest ./backend

# Deploy
kubectl apply -f k8s/namespace.yaml
cp k8s/secrets.yaml.example k8s/secrets.yaml
# Edit secrets.yaml with your keys
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/pvc.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/ingress.yaml

# Access
kubectl port-forward -n pookie-todo service/frontend 3000:3000
# Open http://localhost:3000
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

## Project Structure

```
├── app/                    # Next.js frontend
│   ├── api/               # Next.js API routes (optional)
│   ├── login/             # Login page
│   ├── dashboard/         # Dashboard
│   └── globals.css        # Tailwind styles
├── backend/               # FastAPI backend
│   ├── main.py           # API endpoints
│   ├── requirements.txt  # Python dependencies
│   └── Dockerfile        # Backend container
├── components/           # React components
├── lib/                  # Utilities (auth, db, ai)
├── k8s/                  # Kubernetes manifests
│   ├── namespace.yaml
│   ├── backend-deployment.yaml
│   ├── frontend-deployment.yaml
│   ├── ingress.yaml
│   ├── pvc.yaml
│   └── secrets.yaml.example
├── Dockerfile            # Frontend container
├── docker-compose.yml    # Local development
└── README.md
```

## API Endpoints

**Authentication:**
- POST `/api/auth/signup` - Create account
- POST `/api/auth/login` - Login
- POST `/api/auth/logout` - Logout

**Todos:**
- GET `/api/todos` - List tasks
- POST `/api/todos` - Create task
- PATCH `/api/todos/{id}` - Update task
- DELETE `/api/todos/{id}` - Delete task

**AI:**
- POST `/api/ai/chat` - Process chat message

## AI Commands

Try natural language like:
- "Add buy milk tomorrow at 5pm #shopping"
- "Mark task 3 as done"
- "Show my work tasks"
- "Move all work tasks to Monday evening"

The AI responds with a warm, friendly tone.

## Development

```bash
# Frontend
npm run dev

# Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

# Type checking
npm run type-check

# Linting
npm run lint
```

## Kubernetes Commands

```bash
# Check status
kubectl get pods -n pookie-todo

# View logs
kubectl logs -n pookie-todo deployment/backend

# Scale
kubectl scale deployment/frontend --replicas=3 -n pookie-todo

# Restart
kubectl rollout restart deployment/backend -n pookie-todo
```

## Environment Variables

```env
# .env.local (Frontend)
NEXT_PUBLIC_API_URL=http://localhost:8000

# Backend
JWT_SECRET=your-secret-key
OPENAI_API_KEY=sk-your-key
```

## Color Palette

```
Lavender  #E6D9F5  Primary
Mint      #D5F5E8  Success
Peach     #FFE5D9  Critical
Sky       #D9EBFF  Info
Rose      #FFD9E8  Warning
Lemon     #FFF9D9  Medium
Cream     #FAF8F5  Background
Charcoal  #4A4555  Text
```

## License

MIT

---

Generated with Claude Code - Spec-Driven Development
