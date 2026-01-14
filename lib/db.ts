import fs from 'fs/promises'
import path from 'path'
import { Task, User } from '@/types'
import { logAction } from './history'

const DB_PATH = process.env.DATABASE_PATH || './data/tasks.json'

interface Database {
  version: string
  users: User[]
  tasks: Record<string, Task[]>
  metadata: {
    nextId: Record<string, number>
    lastModified: string
  }
}

let dbCache: Database | null = null

async function ensureDbExists() {
  try {
    await fs.access(DB_PATH)
  } catch {
    const dir = path.dirname(DB_PATH)
    await fs.mkdir(dir, { recursive: true })
    const initialDb: Database = {
      version: '3.0.0',
      users: [],
      tasks: {},
      metadata: {
        nextId: {},
        lastModified: new Date().toISOString(),
      },
    }
    await fs.writeFile(DB_PATH, JSON.stringify(initialDb, null, 2))
  }
}

async function readDb(): Promise<Database> {
  if (dbCache) return dbCache

  await ensureDbExists()
  const data = await fs.readFile(DB_PATH, 'utf-8')
  dbCache = JSON.parse(data)
  return dbCache!
}

async function writeDb(db: Database) {
  db.metadata.lastModified = new Date().toISOString()
  dbCache = db
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2))
}

export async function getUser(email: string): Promise<User | null> {
  const db = await readDb()
  return db.users.find(u => u.email === email) || null
}

export async function createUser(user: User): Promise<void> {
  const db = await readDb()
  db.users.push(user)
  await writeDb(db)

  // Log signup action
  await logAction('user_signup', user.id, undefined, {
    email: user.email,
    createdAt: user.createdAt,
  })
}

export async function getTasks(userId: string): Promise<Task[]> {
  const db = await readDb()
  return db.tasks[userId] || []
}

export async function addTask(userId: string, task: Omit<Task, 'id'>): Promise<Task> {
  const db = await readDb()

  if (!db.tasks[userId]) {
    db.tasks[userId] = []
    db.metadata.nextId[userId] = 1
  }

  const id = db.metadata.nextId[userId]
  db.metadata.nextId[userId]++

  const newTask: Task = { ...task, id }
  db.tasks[userId].push(newTask)

  await writeDb(db)

  // Log todo creation
  await logAction('todo_created', userId, newTask.id, {
    description: newTask.description,
    priority: newTask.priority,
    tags: newTask.tags,
  })

  return newTask
}

export async function updateTask(userId: string, taskId: number, updates: Partial<Task>): Promise<Task | null> {
  const db = await readDb()
  const tasks = db.tasks[userId] || []
  const taskIndex = tasks.findIndex(t => t.id === taskId)

  if (taskIndex === -1) return null

  const oldTask = tasks[taskIndex]
  const updatedTask = { ...oldTask, ...updates, id: taskId }
  db.tasks[userId][taskIndex] = updatedTask

  await writeDb(db)

  // Log the appropriate action
  if (updates.completed !== undefined) {
    if (updates.completed && !oldTask.completed) {
      await logAction('todo_completed', userId, taskId, {
        description: updatedTask.description,
      })
    } else if (!updates.completed && oldTask.completed) {
      await logAction('todo_uncompleted', userId, taskId, {
        description: updatedTask.description,
      })
    }
  } else {
    await logAction('todo_updated', userId, taskId, {
      updates,
      description: updatedTask.description,
    })
  }

  return updatedTask
}

export async function deleteTask(userId: string, taskId: number): Promise<boolean> {
  const db = await readDb()
  const tasks = db.tasks[userId] || []
  const taskIndex = tasks.findIndex(t => t.id === taskId)

  if (taskIndex === -1) return false

  const deletedTask = tasks[taskIndex]
  db.tasks[userId].splice(taskIndex, 1)
  await writeDb(db)

  // Log deletion
  await logAction('todo_deleted', userId, taskId, {
    description: deletedTask.description,
  })

  return true
}
