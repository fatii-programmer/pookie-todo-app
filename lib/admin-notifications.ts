import fs from 'fs/promises'
import path from 'path'

// Use /tmp on Vercel (serverless), or local path for development
const isVercel = process.env.VERCEL === '1'
const NOTIFICATIONS_DIR = isVercel
  ? '/tmp/admin-notifications'
  : (process.env.NOTIFICATIONS_PATH || './admin-notifications')

export type NotificationType =
  | 'login_google'
  | 'login_oauth'
  | 'security_alert'
  | 'system_event'

export type NotificationStatus = 'pending' | 'sent' | 'failed'

export type NotificationChannel = 'email' | 'push' | 'sms' | 'webhook'

export interface AdminNotification {
  id: string
  timestamp: string
  type: NotificationType
  status: NotificationStatus
  message: string
  data: {
    email: string
    provider: string
    userId?: string
    ipAddress?: string
    userAgent?: string
    [key: string]: any
  }
  channels: {
    channel: NotificationChannel
    status: NotificationStatus
    sentAt?: string
    error?: string
  }[]
  metadata?: Record<string, any>
}

// Global in-memory cache for serverless environments
declare global {
  var __adminNotifications: AdminNotification[] | undefined
}

let notificationsCache: AdminNotification[] = global.__adminNotifications || []

async function ensureNotificationsDirExists() {
  try {
    await fs.access(NOTIFICATIONS_DIR)
  } catch {
    try {
      await fs.mkdir(NOTIFICATIONS_DIR, { recursive: true })
    } catch {
      // Ignore errors on serverless
    }
  }
}

function generateId(): string {
  return `notif-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

async function readNotifications(): Promise<AdminNotification[]> {
  if (notificationsCache.length > 0) {
    return notificationsCache
  }

  try {
    await ensureNotificationsDirExists()
    const filePath = path.join(NOTIFICATIONS_DIR, 'notifications.json')
    const data = await fs.readFile(filePath, 'utf-8')
    notificationsCache = JSON.parse(data)
    global.__adminNotifications = notificationsCache
    return notificationsCache
  } catch {
    notificationsCache = []
    global.__adminNotifications = notificationsCache
    return []
  }
}

async function writeNotifications(notifications: AdminNotification[]) {
  notificationsCache = notifications
  global.__adminNotifications = notificationsCache

  try {
    await ensureNotificationsDirExists()
    const filePath = path.join(NOTIFICATIONS_DIR, 'notifications.json')
    await fs.writeFile(filePath, JSON.stringify(notifications, null, 2))
  } catch {
    // Ignore file write errors on serverless
  }
}

/**
 * Log a login event as an admin notification
 */
export async function logLoginNotification(
  email: string,
  provider: 'google' | 'email' | 'oauth',
  options?: {
    userId?: string
    ipAddress?: string
    userAgent?: string
    metadata?: Record<string, any>
  }
): Promise<AdminNotification> {
  const notification: AdminNotification = {
    id: generateId(),
    timestamp: new Date().toISOString(),
    type: provider === 'google' ? 'login_google' : 'login_oauth',
    status: 'pending',
    message: `User ${email} logged in via ${provider.charAt(0).toUpperCase() + provider.slice(1)}`,
    data: {
      email,
      provider,
      userId: options?.userId,
      ipAddress: options?.ipAddress,
      userAgent: options?.userAgent,
    },
    channels: [],
    metadata: options?.metadata,
  }

  const notifications = await readNotifications()
  notifications.push(notification)
  await writeNotifications(notifications)

  // Log to console for immediate visibility (can be monitored in production logs)
  console.log(`[ADMIN NOTIFICATION] ${notification.message}`)

  return notification
}

/**
 * Get all admin notifications (admin-only access)
 */
export async function getAdminNotifications(options?: {
  type?: NotificationType
  status?: NotificationStatus
  limit?: number
}): Promise<AdminNotification[]> {
  let notifications = await readNotifications()

  if (options?.type) {
    notifications = notifications.filter(n => n.type === options.type)
  }

  if (options?.status) {
    notifications = notifications.filter(n => n.status === options.status)
  }

  // Sort by timestamp descending (most recent first)
  notifications = notifications.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )

  if (options?.limit) {
    notifications = notifications.slice(0, options.limit)
  }

  return notifications
}

/**
 * Update notification status (for future notification delivery system)
 */
export async function updateNotificationStatus(
  notificationId: string,
  status: NotificationStatus,
  channelUpdates?: { channel: NotificationChannel; status: NotificationStatus; error?: string }
): Promise<AdminNotification | null> {
  const notifications = await readNotifications()
  const index = notifications.findIndex(n => n.id === notificationId)

  if (index === -1) {
    return null
  }

  notifications[index].status = status

  if (channelUpdates) {
    const channelIndex = notifications[index].channels.findIndex(
      c => c.channel === channelUpdates.channel
    )

    if (channelIndex === -1) {
      notifications[index].channels.push({
        channel: channelUpdates.channel,
        status: channelUpdates.status,
        sentAt: channelUpdates.status === 'sent' ? new Date().toISOString() : undefined,
        error: channelUpdates.error,
      })
    } else {
      notifications[index].channels[channelIndex] = {
        ...notifications[index].channels[channelIndex],
        status: channelUpdates.status,
        sentAt: channelUpdates.status === 'sent' ? new Date().toISOString() : undefined,
        error: channelUpdates.error,
      }
    }
  }

  await writeNotifications(notifications)
  return notifications[index]
}

/**
 * Check if email is a Gmail address
 */
export function isGmailAddress(email: string): boolean {
  return email.toLowerCase().endsWith('@gmail.com') ||
         email.toLowerCase().endsWith('@googlemail.com')
}
