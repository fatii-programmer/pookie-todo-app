import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { calculateProductivityStats } from '@/lib/analytics'

export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const stats = await calculateProductivityStats(session.userId)

    return NextResponse.json({ stats })
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
