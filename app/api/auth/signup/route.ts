import { NextRequest, NextResponse } from 'next/server'
import { getUser, createUser } from '@/lib/db'
import { hashPassword, createToken } from '@/lib/auth'
import { nanoid } from 'nanoid'
import { logLoginNotification, isGmailAddress } from '@/lib/admin-notifications'
import { logAction } from '@/lib/history'
import { logActivity } from '@/lib/activity-log'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await getUser(email)

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    // Hash password and create user
    const passwordHash = await hashPassword(password)
    const userId = nanoid()

    await createUser({
      id: userId,
      email,
      passwordHash,
      createdAt: new Date()
    })

    // Create JWT token
    const token = await createToken(userId)

    // Determine auth provider
    const provider = isGmailAddress(email) ? 'google' : 'credentials'

    // Log activity for admin activity log
    await logActivity(email, 'signup', provider, {
      userId,
      userAgent: request.headers.get('user-agent') || undefined,
    })

    // Log admin notification for Gmail signups
    if (isGmailAddress(email)) {
      await logLoginNotification(email, 'google', {
        userId,
        userAgent: request.headers.get('user-agent') || undefined,
        metadata: { action: 'signup' }
      })
    }

    // Set auth cookie
    const response = NextResponse.json({
      success: true,
      userId,
      email
    })

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
