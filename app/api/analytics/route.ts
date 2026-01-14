import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Analytics functionality is not yet implemented in the backend
    // Return a default response for now
    return NextResponse.json({
      stats: {
        totalTasks: 0,
        completedTasks: 0,
        pendingTasks: 0,
        productivityScore: 0,
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
