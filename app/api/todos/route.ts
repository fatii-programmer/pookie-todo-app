import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getTasks, addTask } from '@/lib/db'

export async function GET(): Promise<Response> {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const tasks = await getTasks(session.userId)
    return NextResponse.json({ tasks })
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
    const session = await getSession()

    if (!session) {
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

    const task = await addTask(session.userId, {
      description,
      completed: false,
      createdAt: new Date(),
      priority: priority || 'normal',
      tags: tags || [],
      dueDate: due_date ? new Date(due_date) : null,
    })

    return NextResponse.json({ task })
  } catch (error) {
    console.error('Create task error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
