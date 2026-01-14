from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
import json
import os
from pathlib import Path
from openai import OpenAI

app = FastAPI(title="Pookie Todo API")

# Get allowed origins from environment variable or use defaults
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SECRET_KEY = os.getenv("JWT_SECRET", "your-secret-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_DAYS = 7
DB_PATH = Path("data/tasks.json")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# Initialize OpenAI client with modern SDK (v1.0+)
openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class User(BaseModel):
    id: str
    email: EmailStr
    password_hash: str
    created_at: datetime

class Task(BaseModel):
    id: int
    description: str
    completed: bool
    created_at: datetime
    priority: str
    tags: List[str]
    due_date: Optional[datetime]

class Database(BaseModel):
    version: str
    users: List[User]
    tasks: dict
    metadata: dict

class SignupRequest(BaseModel):
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TaskCreate(BaseModel):
    description: str
    priority: str = "normal"
    tags: List[str] = []
    due_date: Optional[datetime] = None

class TaskUpdate(BaseModel):
    description: Optional[str] = None
    completed: Optional[bool] = None
    priority: Optional[str] = None
    tags: Optional[List[str]] = None
    due_date: Optional[datetime] = None

class ChatRequest(BaseModel):
    message: str
    history: List[dict] = []

def load_db() -> Database:
    DB_PATH.parent.mkdir(exist_ok=True)
    if not DB_PATH.exists():
        db = Database(version="3.0.0", users=[], tasks={}, metadata={"nextId": {}})
        save_db(db)
    with open(DB_PATH) as f:
        return Database(**json.load(f))

def save_db(db: Database):
    with open(DB_PATH, 'w') as f:
        json.dump(db.dict(), f, default=str, indent=2)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def create_token(user_id: str) -> str:
    expire = datetime.utcnow() + timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
    return jwt.encode({"sub": user_id, "exp": expire}, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_id
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

@app.post("/api/auth/signup")
async def signup(req: SignupRequest):
    db = load_db()
    if any(u.email == req.email for u in db.users):
        raise HTTPException(status_code=400, detail="User already exists")
    
    user_id = str(len(db.users) + 1)
    user = User(
        id=user_id,
        email=req.email,
        password_hash=hash_password(req.password),
        created_at=datetime.utcnow()
    )
    db.users.append(user)
    save_db(db)
    
    token = create_token(user_id)
    return {"token": token, "user_id": user_id}

@app.post("/api/auth/login")
async def login(req: LoginRequest):
    db = load_db()
    user = next((u for u in db.users if u.email == req.email), None)
    if not user or not verify_password(req.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_token(user.id)
    return {"token": token, "user_id": user.id}

@app.get("/api/todos")
async def get_todos(user_id: str = Depends(get_current_user)):
    db = load_db()
    tasks = db.tasks.get(user_id, [])
    return {"tasks": tasks}

@app.post("/api/todos")
async def create_todo(task: TaskCreate, user_id: str = Depends(get_current_user)):
    db = load_db()
    if user_id not in db.tasks:
        db.tasks[user_id] = []
        db.metadata["nextId"][user_id] = 1
    
    task_id = db.metadata["nextId"][user_id]
    db.metadata["nextId"][user_id] += 1
    
    new_task = Task(
        id=task_id,
        description=task.description,
        completed=False,
        created_at=datetime.utcnow(),
        priority=task.priority,
        tags=task.tags,
        due_date=task.due_date
    )
    db.tasks[user_id].append(new_task)
    save_db(db)
    
    return new_task

@app.patch("/api/todos/{task_id}")
async def update_todo(task_id: int, updates: TaskUpdate, user_id: str = Depends(get_current_user)):
    db = load_db()
    tasks = db.tasks.get(user_id, [])
    task_index = next((i for i, t in enumerate(tasks) if t.id == task_id), None)
    
    if task_index is None:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task_dict = tasks[task_index].dict()
    update_dict = updates.dict(exclude_unset=True)
    task_dict.update(update_dict)
    
    db.tasks[user_id][task_index] = Task(**task_dict)
    save_db(db)
    
    return db.tasks[user_id][task_index]

@app.delete("/api/todos/{task_id}")
async def delete_todo(task_id: int, user_id: str = Depends(get_current_user)):
    db = load_db()
    tasks = db.tasks.get(user_id, [])
    task_index = next((i for i, t in enumerate(tasks) if t.id == task_id), None)
    
    if task_index is None:
        raise HTTPException(status_code=404, detail="Task not found")
    
    db.tasks[user_id].pop(task_index)
    save_db(db)
    
    return {"success": True}

@app.post("/api/ai/chat")
async def chat(req: ChatRequest, user_id: str = Depends(get_current_user)):
    system_msg = """You are a friendly AI assistant with a warm "pookie" personality.
Be concise, encouraging, and use ♡ sparingly. Help manage tasks naturally."""

    messages = [{"role": "system", "content": system_msg}]
    messages.extend(req.history)
    messages.append({"role": "user", "content": req.message})

    # Updated to use modern OpenAI SDK (v1.0+) syntax
    response = openai_client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages
    )

    return {"response": response.choices[0].message.content}

@app.get("/health")
async def health():
    """Health check endpoint for Kubernetes probes"""
    health_status = {
        "status": "healthy",
        "version": "3.0.0",
        "storage": "unknown",
        "openai": "unknown"
    }

    # Check storage accessibility
    try:
        DB_PATH.parent.mkdir(exist_ok=True)
        test_file = DB_PATH.parent / ".health_check"
        test_file.write_text("ok")
        test_file.unlink()
        health_status["storage"] = "accessible"
    except Exception as e:
        health_status["storage"] = "unavailable"
        health_status["status"] = "degraded"

    # Check OpenAI connectivity
    try:
        if openai_client.api_key:
            health_status["openai"] = "connected"
        else:
            health_status["openai"] = "degraded"
    except Exception:
        health_status["openai"] = "degraded"

    return health_status

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
