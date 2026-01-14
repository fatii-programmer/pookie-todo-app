import { NextRequest, NextResponse } from 'next/server'
import { getUser, createUser } from '@/lib/db'
import { hashPassword, createToken } from '@/lib/auth'
import { nanoid } from 'nanoid'

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

    // Set auth cookie
    const response = NextResponse.json({
      success: true,
      userId
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
