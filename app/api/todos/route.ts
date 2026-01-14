import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(): Promise<Response> {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Call the backend API for getting tasks
    const backendUrl = process.env.BACKEND_URL || 'https://pookie-todo-backend.vercel.app'
    const res = await fetch(`${backendUrl}/api/todos`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch tasks' },
        { status: res.status }
      )
    }

    const data = await res.json()
    return NextResponse.json({ tasks: data.tasks })
  } catch (error) {
    console.error('Get tasks error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { description, priority, tags, due_date } = body

    if (!description) {
      return NextResponse.json(
        { error: 'Description is required' },
        { status: 400 }
      )
    }

    // Call the backend API for creating task
    const backendUrl = process.env.BACKEND_URL || 'https://pookie-todo-backend.vercel.app'
    const res = await fetch(`${backendUrl}/api/todos`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        description,
        priority: priority || 'normal',
        tags: tags || [],
        due_date: due_date || null,
      }),
    })

    if (!res.ok) {
      const errorData = await res.json()
      return NextResponse.json(
        { error: errorData.detail || 'Failed to create task' },
        { status: res.status }
      )
    }

    const data = await res.json()
    return NextResponse.json({ task: data })
  } catch (error) {
    console.error('Create task error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
