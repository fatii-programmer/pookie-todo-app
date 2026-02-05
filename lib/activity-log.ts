import fs from 'fs/promises'
import path from 'path'

// Use /tmp on Vercel (serverless), or local path for development
const isVercel = process.env.VERCEL === '1'
const ACTIVITY_LOG_DIR = isVercel
  ? '/tmp/activity-log'
  : (process.env.ACTIVITY_LOG_PATH || './activity-log')

export type ActionType = 'signup' | 'login'
export type AuthProvider = 'google' | 'credentials'

export interface ActivityEntry {
  id: string
  timestamp: string
  email: string
  action: ActionType
  provider: AuthProvider
  userId?: string
  userAgent?: string
  ipAddress?: string
}

// Global in-memory cache for serverless environments
declare global {
  // eslint-disable-next-line no-var
  var __activityLog: ActivityEntry[] | undefined
}

let activityCache: ActivityEntry[] = global.__activityLog || []

async function ensureActivityLogDirExists(): Promise<void> {
  try {
    await fs.access(ACTIVITY_LOG_DIR)
  } catch {
    try {
      await fs.mkdir(ACTIVITY_LOG_DIR, { recursive: true })
    } catch {
      // Ignore errors on serverless
    }
  }
}

function generateId(): string {
  return `activity-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

async function readActivityLog(): Promise<ActivityEntry[]> {
  if (activityCache.length > 0) {
    return activityCache
  }

  try {
    await ensureActivityLogDirExists()
    const filePath = path.join(ACTIVITY_LOG_DIR, 'activity-log.json')
    const data = await fs.readFile(filePath, 'utf-8')
    activityCache = JSON.parse(data) as ActivityEntry[]
    global.__activityLog = activityCache
    return activityCache
  } catch {
    activityCache = []
    global.__activityLog = activityCache
    return []
  }
}

async function writeActivityLog(entries: ActivityEntry[]): Promise<void> {
  activityCache = entries
  global.__activityLog = activityCache

  try {
    await ensureActivityLogDirExists()
    const filePath = path.join(ACTIVITY_LOG_DIR, 'activity-log.json')
    await fs.writeFile(filePath, JSON.stringify(entries, null, 2))
  } catch {
    // Ignore file write errors on serverless
  }
}

/**
 * Log a login or signup activity
 */
export async function logActivity(
  email: string,
  action: ActionType,
  provider: AuthProvider,
  options?: {
    userId?: string
    userAgent?: string
    ipAddress?: string
  }
): Promise<ActivityEntry> {
  const entry: ActivityEntry = {
    id: generateId(),
    timestamp: new Date().toISOString(),
    email,
    action,
    provider,
    userId: options?.userId,
    userAgent: options?.userAgent,
    ipAddress: options?.ipAddress,
  }

  const entries = await readActivityLog()
  entries.push(entry)
  await writeActivityLog(entries)

  // Log to console for immediate visibility
  console.log(`[ACTIVITY LOG] ${email} - ${action} via ${provider}`)

  return entry
}

/**
 * Get all activity entries (admin-only access)
 */
export async function getActivityLog(options?: {
  action?: ActionType
  limit?: number
}): Promise<ActivityEntry[]> {
  let entries = await readActivityLog()

  if (options?.action) {
    entries = entries.filter(e => e.action === options.action)
  }

  // Sort by timestamp descending (most recent first)
  entries = entries.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )

  if (options?.limit) {
    entries = entries.slice(0, options.limit)
  }

  return entries
}

/**
 * Check if a user is admin (project owner)
 * For hackathon simplicity, we check against a predefined admin email
 */
export function isAdminUser(email: string): boolean {
  const adminEmail = process.env.ADMIN_EMAIL || 'designerfatii@gmail.com'
  return email.toLowerCase() === adminEmail.toLowerCase()
}
