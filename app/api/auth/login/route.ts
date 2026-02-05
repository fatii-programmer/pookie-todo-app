import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/db'
import { verifyPassword, createToken } from '@/lib/auth'
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

    // Get user from database
    const user = await getUser(email)

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Verify password
    const isValid = await verifyPassword(password, user.passwordHash)

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Create JWT token
    const token = await createToken(user.id)

    // Determine auth provider
    const provider = isGmailAddress(email) ? 'google' : 'credentials'

    // Log login activity for admin records
    await logAction('user_login', user.id, undefined, {
      email: user.email,
      provider,
      userAgent: request.headers.get('user-agent') || undefined,
    })

    // Log activity for admin activity log
    await logActivity(user.email, 'login', provider, {
      userId: user.id,
      userAgent: request.headers.get('user-agent') || undefined,
    })

    // Log admin notification for Gmail logins
    if (provider === 'google') {
      await logLoginNotification(email, 'google', {
        userId: user.id,
        userAgent: request.headers.get('user-agent') || undefined,
      })
    }

    // Set auth cookie
    const response = NextResponse.json({
      success: true,
      userId: user.id,
      email: user.email
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
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
