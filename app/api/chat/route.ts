import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { getUser, getTasks } from '@/lib/db'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

// Extract first name from email
function getNameFromEmail(email: string): string {
  const localPart = email.split('@')[0]
  // Remove numbers and special characters, capitalize first letter
  const name = localPart
    .replace(/[0-9_.-]/g, ' ')
    .split(' ')
    .filter(Boolean)[0] || 'there'
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
}

// Rule-based response generator
function generateResponse(
  message: string,
  userName: string,
  taskCount: number,
  completedCount: number,
  pendingCount: number
): string {
  const lowerMessage = message.toLowerCase().trim()

  // Greetings
  if (/^(hi|hello|hey|greetings|good\s*(morning|afternoon|evening)|howdy|yo)\b/i.test(lowerMessage)) {
    const greetings = [
      `Hi ${userName}! How can I help you organize your tasks today?`,
      `Hello ${userName}! Ready to tackle your todos?`,
      `Hey ${userName}! What can I help you with today?`,
    ]
    return greetings[Math.floor(Math.random() * greetings.length)]
  }

  // How are you / what's up
  if (/how are you|what'?s up|how'?s it going/i.test(lowerMessage)) {
    return `I'm doing great, thanks for asking! I'm here to help you stay organized. You have ${pendingCount} pending task${pendingCount !== 1 ? 's' : ''} right now.`
  }

  // Task count / status queries
  if (/how many (tasks?|todos?)|task count|todo count/i.test(lowerMessage)) {
    if (taskCount === 0) {
      return `You don't have any tasks yet, ${userName}. Would you like to add some? Head over to the Dashboard to create your first task!`
    }
    return `You have ${taskCount} total task${taskCount !== 1 ? 's' : ''}: ${completedCount} completed and ${pendingCount} pending. Keep up the great work!`
  }

  // Pending tasks
  if (/pending|incomplete|not done|what('?s| is) left|remaining/i.test(lowerMessage)) {
    if (pendingCount === 0) {
      return `Amazing! You have no pending tasks. You're all caught up!`
    }
    return `You have ${pendingCount} pending task${pendingCount !== 1 ? 's' : ''}. Head to the Dashboard to see and manage them!`
  }

  // Completed tasks
  if (/completed?|done|finished/i.test(lowerMessage)) {
    if (completedCount === 0) {
      return `No tasks completed yet, but that's okay! Every journey starts with a single step.`
    }
    return `You've completed ${completedCount} task${completedCount !== 1 ? 's' : ''}. Great progress!`
  }

  // Add task request
  if (/add (a )?(task|todo)|create (a )?(task|todo)|new (task|todo)/i.test(lowerMessage)) {
    return `I'd love to help you add a task! For now, please head to the Dashboard where you can easily add new tasks with priorities, due dates, and tags. I'm working on adding that feature directly in chat!`
  }

  // Delete task request
  if (/delete|remove|get rid of/i.test(lowerMessage) && /task|todo/i.test(lowerMessage)) {
    return `To delete a task, please go to the Dashboard and click the delete button on the task you want to remove. I'll be able to help with that directly in chat soon!`
  }

  // Complete/mark done request
  if (/(mark|set).*(done|complete)|complete (a |the )?(task|todo)/i.test(lowerMessage)) {
    return `To mark a task as complete, visit the Dashboard and click the checkbox next to the task. Each completion is a small victory!`
  }

  // Help / what can you do
  if (/help|what can you (do|help)|how (do|can) (i|you)|features?|capabilities/i.test(lowerMessage)) {
    return `I can help you with your todos! Here's what I can do:\n\n` +
      `- Tell you how many tasks you have\n` +
      `- Show your pending or completed task counts\n` +
      `- Guide you on how to add, complete, or delete tasks\n` +
      `- Chat about your productivity\n\n` +
      `For managing tasks directly, head to the Dashboard. What would you like to know?`
  }

  // Analytics / productivity
  if (/analytics|productivity|stats|statistics|progress|how am i doing/i.test(lowerMessage)) {
    const completionRate = taskCount > 0 ? Math.round((completedCount / taskCount) * 100) : 0
    if (taskCount === 0) {
      return `Check out the Analytics page to see your productivity trends once you start adding tasks!`
    }
    return `Your completion rate is ${completionRate}%! You've completed ${completedCount} out of ${taskCount} tasks. Visit the Analytics page for detailed insights and trends.`
  }

  // Thank you
  if (/thank|thanks|thx|ty/i.test(lowerMessage)) {
    const responses = [
      `You're welcome, ${userName}! Happy to help.`,
      `Anytime! Let me know if you need anything else.`,
      `My pleasure! Good luck with your tasks!`,
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  // Bye / goodbye
  if (/bye|goodbye|see you|gotta go|leaving/i.test(lowerMessage)) {
    return `Goodbye, ${userName}! Good luck with your tasks. Come back anytime!`
  }

  // Motivation / encouragement
  if (/motivat|encourage|inspire|feeling (lazy|down|unmotivated)/i.test(lowerMessage)) {
    const motivations = [
      `You've got this, ${userName}! Every task you complete brings you closer to your goals.`,
      `Remember: progress, not perfection! Start with one small task and build momentum.`,
      `The secret to getting ahead is getting started. Pick one task and crush it!`,
      `You're capable of amazing things. Let's tackle those tasks together!`,
    ]
    return motivations[Math.floor(Math.random() * motivations.length)]
  }

  // Priority / important tasks
  if (/priority|important|urgent|critical/i.test(lowerMessage)) {
    return `Great question! In the Dashboard, you can set task priorities (low, normal, high, critical) when creating or editing tasks. This helps you focus on what matters most!`
  }

  // Due date / deadline
  if (/due date|deadline|when|schedule/i.test(lowerMessage)) {
    return `You can set due dates for your tasks in the Dashboard! This helps you stay on track and never miss a deadline.`
  }

  // Tags / categories
  if (/tag|categor|label|organiz/i.test(lowerMessage)) {
    return `You can add tags to your tasks to organize them by category (like #work, #personal, #shopping). Check out the Dashboard to add tags to your tasks!`
  }

  // Default response for unrecognized messages
  const defaults = [
    `I'm here to help with your todos! You can ask me about your task count, pending items, or how to manage your tasks. What would you like to know?`,
    `I can help you stay organized! Try asking "how many tasks do I have?" or "what's pending?" - or visit the Dashboard to manage your todos directly.`,
    `Not sure I understood that, but I'm happy to help with your tasks! Ask me about your todo status or check the Dashboard for full task management.`,
  ]
  return defaults[Math.floor(Math.random() * defaults.length)]
}

export async function POST(request: NextRequest) {
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

    const { message, history } = await request.json() as {
      message: string
      history?: ChatMessage[]
    }

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Get user info for personalization
    const tasks = await getTasks(payload.userId)

    // Try to get user email from the database
    // We need to search by userId, so let's get it from localStorage on client side
    // For now, extract from the request or use a default
    let userName = 'there'

    // Get user email from a custom header (sent from client)
    const userEmail = request.headers.get('x-user-email')
    if (userEmail) {
      userName = getNameFromEmail(userEmail)
    }

    const completedCount = tasks.filter(t => t.completed).length
    const pendingCount = tasks.length - completedCount

    // Generate response
    const response = generateResponse(
      message,
      userName,
      tasks.length,
      completedCount,
      pendingCount
    )

    return NextResponse.json({
      response,
      taskStats: {
        total: tasks.length,
        completed: completedCount,
        pending: pendingCount,
      },
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    )
  }
}
