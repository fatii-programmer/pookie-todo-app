import fs from 'fs/promises'
import path from 'path'

// Use /tmp on Vercel (serverless), or local path for development
const isVercel = process.env.VERCEL === '1'
const HISTORY_DIR = isVercel
  ? '/tmp/history'
  : (process.env.HISTORY_PATH || './history')

export type ActionType =
  | 'user_signup'
  | 'user_login'
  | 'user_logout'
  | 'todo_created'
  | 'todo_updated'
  | 'todo_completed'
  | 'todo_uncompleted'
  | 'todo_deleted'

export interface HistoryEntry {
  id: string
  timestamp: string
  userId: string
  actionType: ActionType
  todoId?: number
  metadata?: Record<string, any>
}

// Global in-memory history for serverless environments
declare global {
  var __history: Record<string, HistoryEntry[]> | undefined
}

let historyCache: Record<string, HistoryEntry[]> = global.__history || {}

async function ensureHistoryDirExists() {
  try {
    await fs.access(HISTORY_DIR)
  } catch {
    try {
      await fs.mkdir(HISTORY_DIR, { recursive: true })
    } catch {
      // Ignore errors on serverless
    }
  }
}

async function readHistoryFile(filename: string): Promise<HistoryEntry[]> {
  // Return from cache if available
  if (historyCache[filename]) {
    return historyCache[filename]
  }

  try {
    await ensureHistoryDirExists()
    const filePath = path.join(HISTORY_DIR, filename)
    const data = await fs.readFile(filePath, 'utf-8')
    const entries = JSON.parse(data)
    historyCache[filename] = entries
    global.__history = historyCache
    return entries
  } catch {
    historyCache[filename] = []
    global.__history = historyCache
    return []
  }
}

async function writeHistoryFile(filename: string, entries: HistoryEntry[]) {
  historyCache[filename] = entries
  global.__history = historyCache

  try {
    await ensureHistoryDirExists()
    const filePath = path.join(HISTORY_DIR, filename)
    await fs.writeFile(filePath, JSON.stringify(entries, null, 2))
  } catch {
    // Ignore file write errors on serverless
  }
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

export async function logAction(
  actionType: ActionType,
  userId: string,
  todoId?: number,
  metadata?: Record<string, any>
) {
  const entry: HistoryEntry = {
    id: generateId(),
    timestamp: new Date().toISOString(),
    userId,
    actionType,
    todoId,
    metadata,
  }

  // Write to central history files (backward compatibility)
  let filename: string
  if (actionType === 'user_signup' || actionType === 'user_login' || actionType === 'user_logout') {
    filename = 'login-history.json'
  } else {
    filename = 'todo-history.json'
  }

  const entries = await readHistoryFile(filename)
  entries.push(entry)
  await writeHistoryFile(filename, entries)

  // Also write to per-user history file for comprehensive tracking
  await logUserAction(userId, entry)

  return entry
}

// Log to per-user history file
async function logUserAction(userId: string, entry: HistoryEntry) {
  try {
    const userHistoryDir = path.join(HISTORY_DIR, 'users')

    try {
      await fs.access(userHistoryDir)
    } catch {
      await fs.mkdir(userHistoryDir, { recursive: true })
    }

    const userFilePath = path.join(userHistoryDir, `${userId}.json`)

    let userEntries: HistoryEntry[] = []
    try {
      const data = await fs.readFile(userFilePath, 'utf-8')
      userEntries = JSON.parse(data)
    } catch {
      // File doesn't exist yet, start with empty array
    }

    userEntries.push(entry)
    await fs.writeFile(userFilePath, JSON.stringify(userEntries, null, 2))
  } catch {
    // Ignore file system errors on serverless
  }
}

export async function getLoginHistory(userId?: string): Promise<HistoryEntry[]> {
  const entries = await readHistoryFile('login-history.json')

  if (userId) {
    return entries.filter(e => e.userId === userId)
  }

  return entries
}

export async function getTodoHistory(userId?: string, todoId?: number): Promise<HistoryEntry[]> {
  const entries = await readHistoryFile('todo-history.json')

  let filtered = entries

  if (userId) {
    filtered = filtered.filter(e => e.userId === userId)
  }

  if (todoId !== undefined) {
    filtered = filtered.filter(e => e.todoId === todoId)
  }

  return filtered
}

export async function getAllHistory(userId?: string): Promise<HistoryEntry[]> {
  const loginHistory = await getLoginHistory(userId)
  const todoHistory = await getTodoHistory(userId)

  const combined = [...loginHistory, ...todoHistory]

  // Sort by timestamp descending (most recent first)
  return combined.sort((a, b) =>
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )
}

// Get user-specific history from per-user file
export async function getUserHistory(userId: string): Promise<HistoryEntry[]> {
  const userHistoryDir = path.join(HISTORY_DIR, 'users')
  const userFilePath = path.join(userHistoryDir, `${userId}.json`)

  try {
    const data = await fs.readFile(userFilePath, 'utf-8')
    const entries = JSON.parse(data)
    return entries.sort((a: HistoryEntry, b: HistoryEntry) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
  } catch {
    return []
  }
}
