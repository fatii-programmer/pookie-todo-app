import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getSession } from '@/lib/auth'
import { logAction } from '@/lib/history'

export async function POST() {
  // Get session before deleting token
  const session = await getSession()

  const cookieStore = cookies()
  cookieStore.delete('token')

  // Log logout action if user was logged in
  if (session) {
    await logAction('user_logout', session.userId, undefined, {
      timestamp: new Date().toISOString()
    })
  }

  return NextResponse.json({ success: true })
}
