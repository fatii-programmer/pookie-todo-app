import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { getUserById } from '@/lib/db'
import { isGmailAddress } from '@/lib/admin-notifications'

export async function GET(request: NextRequest) {
  try {
    // Get user from token
    const token = request.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Get user from database
    const user = await getUserById(payload.userId)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Determine login provider based on email
    let provider: 'google' | 'credentials' = 'credentials'
    if (isGmailAddress(user.email)) {
      provider = 'google'
    }

    // Extract display name from email
    const emailLocalPart = user.email.split('@')[0]
    const displayName = emailLocalPart
      .replace(/[0-9_.-]/g, ' ')
      .split(' ')
      .filter(Boolean)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ') || 'User'

    // Return profile data (excluding passwordHash)
    return NextResponse.json({
      id: user.id,
      email: user.email,
      displayName,
      provider,
      createdAt: user.createdAt,
    })
  } catch (error) {
    console.error('Profile API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}
