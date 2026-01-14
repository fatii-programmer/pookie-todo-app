export type Priority = 'low' | 'normal' | 'high' | 'critical'

export interface Task {
  id: number
  description: string
  completed: boolean
  createdAt: Date
  priority: Priority
  tags: string[]
  dueDate: Date | null
}

export interface User {
  id: string
  email: string
  passwordHash: string
  createdAt: Date
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface ConversationContext {
  lastMentionedTaskIds: number[]
  activeFilters: FilterCriteria | null
  awaitingClarification: ClarificationState | null
}

export interface FilterCriteria {
  status?: 'complete' | 'pending' | 'all'
  priority?: Priority | 'any'
  tags?: string[]
  dueDate?: {
    start?: Date
    end?: Date
  }
}

export interface ClarificationState {
  question: string
  options: string[]
  context: Record<string, unknown>
}

export interface AIFunctionCall {
  name: string
  arguments: Record<string, unknown>
}
