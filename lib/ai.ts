import OpenAI from 'openai'
import { Task, Priority } from '@/types'
import { parseNaturalDate, parseNaturalTime } from '@/utils/date-parser'
import { env, validateApiKey } from './env'

/**
 * OpenAI Client Initialization
 *
 * Uses centralized environment validation from lib/env.ts
 * API key validation happens on module load with loud failures
 */
const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY || 'dummy-key-will-fail',
})

const tools: OpenAI.Chat.ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'create_task',
      description: 'Create a new task',
      parameters: {
        type: 'object',
        properties: {
          title: { type: 'string', description: 'Task title/description' },
          priority: { type: 'string', enum: ['low', 'normal', 'high', 'critical'] },
          tags: { type: 'array', items: { type: 'string' } },
          dueDateStr: { type: 'string', description: 'Natural language due date like tomorrow or next Monday' },
        },
        required: ['title'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'update_task',
      description: 'Update an existing task',
      parameters: {
        type: 'object',
        properties: {
          taskId: { type: 'number' },
          title: { type: 'string' },
          priority: { type: 'string', enum: ['low', 'normal', 'high', 'critical'] },
          tags: { type: 'array', items: { type: 'string' } },
          dueDateStr: { type: 'string' },
        },
        required: ['taskId'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'delete_task',
      description: 'Delete a task',
      parameters: {
        type: 'object',
        properties: {
          taskId: { type: 'number' },
        },
        required: ['taskId'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'mark_complete',
      description: 'Mark a task as complete',
      parameters: {
        type: 'object',
        properties: {
          taskId: { type: 'number' },
        },
        required: ['taskId'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'list_tasks',
      description: 'List tasks with optional filters',
      parameters: {
        type: 'object',
        properties: {
          status: { type: 'string', enum: ['complete', 'pending', 'all'] },
          priority: { type: 'string' },
          tags: { type: 'array', items: { type: 'string' } },
        },
      },
    },
  },
]

const systemPrompt = `You are a friendly AI assistant for a todo app with a warm "pookie" personality.

Personality traits:
- Warm and encouraging, never condescending
- Use "pookie" occasionally as a term of endearment
- Celebrate completions enthusiastically
- Keep responses concise but friendly
- Use ♡ and ✨ emojis sparingly for warmth

When parsing user input:
- Extract due dates from natural language (tomorrow, next Monday, etc.)
- Identify priority from keywords (important→high, urgent→critical)
- Detect tags from hashtags (#work, #personal, etc.)
- Use fuzzy matching for task titles when ID not provided

Always:
- Confirm actions with friendly messages
- Ask for clarification when ambiguous
- Suggest helpful next steps
- Be encouraging and positive

Examples:
User: "Add buy milk tomorrow at 5pm"
You: [Call create_task] → "Got it, pookie! ♡ I've added 'Buy milk' for tomorrow at 5:00 PM."

User: "Mark task 3 done"
You: [Call mark_complete] → "Awesome! ✓ Task #3 is now complete. You're crushing it! ♡"`

export async function processChatMessage(
  message: string,
  tasks: Task[],
  history: OpenAI.Chat.ChatCompletionMessageParam[]
): Promise<{
  response: string
  functionCalls: any[]
  error?: string
}> {
  // Validate API key at runtime
  const apiKeyCheck = validateApiKey()
  if (!apiKeyCheck.valid) {
    const errorMsg = apiKeyCheck.error || 'OpenAI API key is not valid'
    console.error('❌ API Key Validation Failed:', errorMsg)
    console.error('   User query:', message.substring(0, 50))
    console.error('   Stack trace:', new Error().stack)
    return {
      response: '',
      functionCalls: [],
      error: errorMsg
    }
  }

  try {
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      ...history,
      { role: 'user', content: message },
    ]

    console.log('🤖 Sending request to OpenAI...')

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      tools,
      tool_choice: 'auto',
    })

    console.log('✅ OpenAI response received')
    const responseMessage = completion.choices[0].message
    const functionCalls = responseMessage.tool_calls || []

    console.log(`📞 Function calls: ${functionCalls.length}`)

    return {
      response: responseMessage.content || '',
      functionCalls: functionCalls.map(tc => ({
        name: tc.function.name,
        arguments: JSON.parse(tc.function.arguments),
      })),
    }
  } catch (error) {
    // LOUD ERROR LOGGING - Full stack trace for debugging
    console.error('\n' + '='.repeat(60))
    console.error('❌ OPENAI API ERROR - FULL DETAILS')
    console.error('='.repeat(60))
    console.error('Error type:', error instanceof Error ? error.constructor.name : typeof error)
    console.error('Error message:', error instanceof Error ? error.message : String(error))

    if (error instanceof Error) {
      console.error('\nFull Stack Trace:')
      console.error(error.stack)

      // Log additional error properties
      console.error('\nError Object:')
      console.error(JSON.stringify(error, Object.getOwnPropertyNames(error), 2))
    } else {
      console.error('\nRaw error:', error)
    }

    console.error('\nContext:')
    console.error('  - User message:', message.substring(0, 100))
    console.error('  - Tasks count:', tasks.length)
    console.error('  - History length:', history.length)
    console.error('='.repeat(60) + '\n')

    // Determine user-friendly error message
    let errorMessage = 'Failed to communicate with AI service.'

    if (error instanceof Error) {
      if (error.message.includes('API key') || error.message.includes('Incorrect API key')) {
        errorMessage = 'Invalid OpenAI API key. Please check your .env.local file.'
      } else if (error.message.includes('rate limit')) {
        errorMessage = 'OpenAI rate limit exceeded. Please try again in a moment.'
      } else if (error.message.includes('insufficient_quota')) {
        errorMessage = 'OpenAI API quota exceeded. Please check your OpenAI account billing.'
      } else if (error.message.includes('model_not_found')) {
        errorMessage = 'OpenAI model not available. Please check your API access.'
      } else {
        errorMessage = `OpenAI Error: ${error.message}`
      }
    }

    return {
      response: '',
      functionCalls: [],
      error: errorMessage
    }
  }
}

export function parseDueDateFromString(dateStr: string): Date | null {
  const date = parseNaturalDate(dateStr)
  if (!date) return null

  const time = parseNaturalTime(dateStr)
  if (time) {
    date.setHours(time.hours, time.minutes, 0, 0)
  }

  return date
}
