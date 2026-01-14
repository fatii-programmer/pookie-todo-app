import { addDays, addWeeks, nextMonday, nextFriday, nextSaturday, nextSunday, endOfMonth, parseISO, format } from 'date-fns'

export function parseNaturalDate(input: string): Date | null {
  const lower = input.toLowerCase().trim()
  const now = new Date()

  if (lower === 'today' || lower === 'tonight') return now
  if (lower === 'tomorrow') return addDays(now, 1)
  if (lower === 'next week') return addWeeks(now, 1)

  if (lower.startsWith('next ')) {
    const day = lower.slice(5)
    if (day === 'monday') return nextMonday(now)
    if (day === 'friday') return nextFriday(now)
    if (day === 'saturday') return nextSaturday(now)
    if (day === 'sunday') return nextSunday(now)
  }

  const inDaysMatch = lower.match(/in (\d+) days?/)
  if (inDaysMatch) return addDays(now, parseInt(inDaysMatch[1]))

  if (lower === 'end of week') return nextSunday(now)
  if (lower === 'end of month') return endOfMonth(now)

  try {
    const parsed = parseISO(input)
    if (!isNaN(parsed.getTime())) return parsed
  } catch {
    // Ignore parsing errors and continue to return null
  }

  return null
}

export function parseNaturalTime(input: string): { hours: number; minutes: number } | null {
  const lower = input.toLowerCase().trim()

  if (lower === 'morning') return { hours: 9, minutes: 0 }
  if (lower === 'afternoon') return { hours: 14, minutes: 0 }
  if (lower === 'evening') return { hours: 18, minutes: 0 }
  if (lower === 'noon') return { hours: 12, minutes: 0 }

  const timeMatch = lower.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/)
  if (timeMatch) {
    let hours = parseInt(timeMatch[1])
    const minutes = timeMatch[2] ? parseInt(timeMatch[2]) : 0
    const meridiem = timeMatch[3]

    if (meridiem === 'pm' && hours < 12) hours += 12
    if (meridiem === 'am' && hours === 12) hours = 0

    return { hours, minutes }
  }

  return null
}

export function formatDueDate(date: Date | null): string {
  if (!date) return ''

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const tomorrow = addDays(today, 1)
  const taskDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())

  if (taskDate.getTime() === today.getTime()) {
    return 'Today, ' + format(date, 'h:mm a')
  }
  if (taskDate.getTime() === tomorrow.getTime()) {
    return 'Tomorrow, ' + format(date, 'h:mm a')
  }
  if (taskDate < today) {
    return 'Overdue: ' + format(date, 'MMM d')
  }
  return format(date, 'MMM d, h:mm a')
}
