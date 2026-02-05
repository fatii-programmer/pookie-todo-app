import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getUserById } from '@/lib/db'
import { getActivityLog, isAdminUser } from '@/lib/activity-log'

// eslint-disable-next-line max-lines-per-function
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Verify user is authenticated
    const session = await getSession()

    if (!session?.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user to check if admin
    const user = await getUserById(session.userId)

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if user is admin
    if (!isAdminUser(user.email)) {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      )
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action') as 'login' | 'signup' | null
    const limitParam = searchParams.get('limit')
    const limit = limitParam ? parseInt(limitParam, 10) : undefined

    // Fetch activity log
    const activities = await getActivityLog({
      action: action || undefined,
      limit,
    })

    return NextResponse.json({ activities })
  } catch (error) {
    console.error('Admin activity log error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
