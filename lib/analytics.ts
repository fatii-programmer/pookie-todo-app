import { getTodoHistory, getLoginHistory } from './history'
import { getTasks } from './db'
import { Task } from '@/types'

export interface ProductivityStats {
  totalTasks: number
  completedTasks: number
  pendingTasks: number
  completionRate: number
  tasksCreatedToday: number
  tasksCompletedToday: number
  tasksCreatedThisWeek: number
  tasksCompletedThisWeek: number
  tasksCreatedThisMonth: number
  tasksCompletedThisMonth: number
  averageCompletionTime: number | null
  currentStreak: number
  longestStreak: number
  priorityDistribution: {
    low: number
    normal: number
    high: number
    critical: number
  }
  categoryStats: Record<string, number>
  productivityTrend: {
    date: string
    completed: number
    created: number
  }[]
  completionsByDay: {
    day: string
    count: number
  }[]
  recentActivity: {
    date: string
    action: string
    description: string
  }[]
}

function getDateKey(date: Date): string {
  return date.toISOString().split('T')[0]
}

function getDayName(date: Date): string {
  // Use consistent day names to avoid locale-dependent variations
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  return days[date.getDay()]
}

function isToday(date: Date): boolean {
  const today = new Date()
  return getDateKey(date) === getDateKey(today)
}

function isThisWeek(date: Date): boolean {
  const today = new Date()
  const weekAgo = new Date(today)
  weekAgo.setDate(weekAgo.getDate() - 7)
  return date >= weekAgo && date <= today
}

function isThisMonth(date: Date): boolean {
  const today = new Date()
  const monthAgo = new Date(today)
  monthAgo.setMonth(monthAgo.getMonth() - 1)
  return date >= monthAgo && date <= today
}

function calculateStreak(completionDates: Date[]): { current: number; longest: number } {
  if (completionDates.length === 0) return { current: 0, longest: 0 }

  // Sort dates in descending order
  const sortedDates = completionDates
    .map(d => getDateKey(d))
    .filter((v, i, a) => a.indexOf(v) === i) // unique dates
    .sort()
    .reverse()

  let currentStreak = 0
  let longestStreak = 0
  let tempStreak = 0

  const today = getDateKey(new Date())
  let expectedDate = new Date()

  for (const dateStr of sortedDates) {
    const expected = getDateKey(expectedDate)

    if (dateStr === expected) {
      tempStreak++
      if (dateStr === today || tempStreak > 1) {
        currentStreak = tempStreak
      }
      longestStreak = Math.max(longestStreak, tempStreak)
      expectedDate.setDate(expectedDate.getDate() - 1)
    } else {
      tempStreak = 1
      expectedDate = new Date(dateStr)
      expectedDate.setDate(expectedDate.getDate() - 1)
    }
  }

  return { current: currentStreak, longest: longestStreak }
}

export async function calculateProductivityStats(userId: string): Promise<ProductivityStats> {
  const [todoHistory, tasks] = await Promise.all([
    getTodoHistory(userId),
    getTasks(userId),
  ])

  const completedTasks = tasks.filter(t => t.completed).length
  const pendingTasks = tasks.length - completedTasks
  const completionRate = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0

  // Count tasks by time period
  const tasksCreatedToday = todoHistory.filter(
    h => h.actionType === 'todo_created' && isToday(new Date(h.timestamp))
  ).length

  const tasksCompletedToday = todoHistory.filter(
    h => h.actionType === 'todo_completed' && isToday(new Date(h.timestamp))
  ).length

  const tasksCreatedThisWeek = todoHistory.filter(
    h => h.actionType === 'todo_created' && isThisWeek(new Date(h.timestamp))
  ).length

  const tasksCompletedThisWeek = todoHistory.filter(
    h => h.actionType === 'todo_completed' && isThisWeek(new Date(h.timestamp))
  ).length

  const tasksCreatedThisMonth = todoHistory.filter(
    h => h.actionType === 'todo_created' && isThisMonth(new Date(h.timestamp))
  ).length

  const tasksCompletedThisMonth = todoHistory.filter(
    h => h.actionType === 'todo_completed' && isThisMonth(new Date(h.timestamp))
  ).length

  // Calculate average completion time
  const completionTimes: number[] = []
  const completedHistory = todoHistory.filter(h => h.actionType === 'todo_completed')

  for (const completion of completedHistory) {
    const creation = todoHistory.find(
      h => h.actionType === 'todo_created' && h.todoId === completion.todoId
    )
    if (creation) {
      const timeDiff = new Date(completion.timestamp).getTime() - new Date(creation.timestamp).getTime()
      completionTimes.push(timeDiff)
    }
  }

  const averageCompletionTime = completionTimes.length > 0
    ? completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length
    : null

  // Calculate streaks
  const completionDates = todoHistory
    .filter(h => h.actionType === 'todo_completed')
    .map(h => new Date(h.timestamp))

  const { current: currentStreak, longest: longestStreak } = calculateStreak(completionDates)

  // Priority distribution
  const priorityDistribution = {
    low: tasks.filter(t => t.priority === 'low').length,
    normal: tasks.filter(t => t.priority === 'normal').length,
    high: tasks.filter(t => t.priority === 'high').length,
    critical: tasks.filter(t => t.priority === 'critical').length,
  }

  // Category stats
  const categoryStats: Record<string, number> = {}
  tasks.forEach(task => {
    if (task.tags && task.tags.length > 0) {
      task.tags.forEach(tag => {
        categoryStats[tag] = (categoryStats[tag] || 0) + 1
      })
    }
  })

  // Productivity trend (last 30 days)
  const productivityTrend: { date: string; completed: number; created: number }[] = []
  const last30Days = new Date()
  last30Days.setDate(last30Days.getDate() - 30)

  const dateMap: Record<string, { completed: number; created: number }> = {}

  for (let i = 0; i < 30; i++) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const key = getDateKey(date)
    dateMap[key] = { completed: 0, created: 0 }
  }

  todoHistory.forEach(h => {
    const date = new Date(h.timestamp)
    if (date >= last30Days) {
      const key = getDateKey(date)
      if (dateMap[key]) {
        if (h.actionType === 'todo_completed') {
          dateMap[key].completed++
        } else if (h.actionType === 'todo_created') {
          dateMap[key].created++
        }
      }
    }
  })

  Object.keys(dateMap).forEach(date => {
    productivityTrend.push({
      date,
      completed: dateMap[date].completed,
      created: dateMap[date].created,
    })
  })

  productivityTrend.sort((a, b) => a.date.localeCompare(b.date))

  // Completions by day of week
  const dayMap: Record<string, number> = {
    'Sunday': 0,
    'Monday': 0,
    'Tuesday': 0,
    'Wednesday': 0,
    'Thursday': 0,
    'Friday': 0,
    'Saturday': 0,
  }

  todoHistory
    .filter(h => h.actionType === 'todo_completed')
    .forEach(h => {
      const day = getDayName(new Date(h.timestamp))
      dayMap[day]++
    })

  const completionsByDay = Object.keys(dayMap).map(day => ({
    day,
    count: dayMap[day],
  }))

  // Recent activity (last 10 actions)
  const recentActivity = todoHistory
    .slice(-10)
    .reverse()
    .map(h => ({
      date: new Date(h.timestamp).toISOString().replace('T', ' ').split('.')[0],
      action: h.actionType.replace('_', ' '),
      description: h.metadata?.description || 'N/A',
    }))

  return {
    totalTasks: tasks.length,
    completedTasks,
    pendingTasks,
    completionRate,
    tasksCreatedToday,
    tasksCompletedToday,
    tasksCreatedThisWeek,
    tasksCompletedThisWeek,
    tasksCreatedThisMonth,
    tasksCompletedThisMonth,
    averageCompletionTime,
    currentStreak,
    longestStreak,
    priorityDistribution,
    categoryStats,
    productivityTrend,
    completionsByDay,
    recentActivity,
  }
}
