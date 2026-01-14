import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getTasks, addTask } from '@/lib/db'
import { Task } from '@/types'

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
    const { description, priority, tags, dueDate } = body

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
      dueDate: dueDate ? new Date(dueDate) : null,
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
