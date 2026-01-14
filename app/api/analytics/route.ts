import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getTasks } from '@/lib/db'

export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get tasks for analytics
    const tasks = await getTasks(session.userId)
    const completedTasks = tasks.filter(t => t.completed).length
    const pendingTasks = tasks.filter(t => !t.completed).length

    return NextResponse.json({
      stats: {
        totalTasks: tasks.length,
        completedTasks,
        pendingTasks,
        productivityScore: tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0,
        streak: 0
      }
    })
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
