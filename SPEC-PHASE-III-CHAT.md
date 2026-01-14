# Phase III Technical Specifications: AI Conversational Todo Assistant

**Version:** 3.0.0
**Date:** 2025-12-31
**Constitution Reference:** PHASE-III-CONSTITUTION.md

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Type Definitions](#2-type-definitions)
3. [MCP Server Implementation](#3-mcp-server-implementation)
4. [AI Agent System](#4-ai-agent-system)
5. [API Routes](#5-api-routes)
6. [UI Components](#6-ui-components)
7. [State Management](#7-state-management)
8. [Integration Layer](#8-integration-layer)
9. [Error Handling](#9-error-handling)
10. [Testing Specifications](#10-testing-specifications)

---

## 1. Architecture Overview

### 1.1 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        User Interface                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Chat Widget  │  │ Chat Page    │  │ Dashboard    │      │
│  │ (Floating)   │  │ (/chat)      │  │ (Existing)   │      │
│  └──────┬───────┘  └──────┬───────┘  └──────────────┘      │
└─────────┼──────────────────┼───────────────────────────────┘
          │                  │
          └────────┬─────────┘
                   │
          ┌────────▼────────┐
          │   Chat Store    │ (New: State Management)
          │   (Zustand)     │
          └────────┬────────┘
                   │
    ┌──────────────┼──────────────┐
    │              │              │
┌───▼───┐    ┌────▼────┐    ┌───▼────┐
│ POST  │    │  GET    │    │ POST   │
│ /chat │    │ /chat   │    │ /mcp   │
└───┬───┘    │ /stream │    │ /tools │
    │        └────┬────┘    └───┬────┘
    │             │             │
    └─────────────┼─────────────┘
                  │
         ┌────────▼────────┐
         │  AI Agent Core  │ (New: OpenAI SDK)
         │  - GPT-4        │
         │  - Prompts      │
         │  - Context      │
         └────────┬────────┘
                  │
         ┌────────▼────────┐
         │   MCP Server    │ (New: Tool Protocol)
         │  - Tool Router  │
         │  - Validators   │
         └────────┬────────┘
                  │
    ┌─────────────┼─────────────┐
    │             │             │
┌───▼────┐   ┌───▼────┐   ┌───▼─────┐
│ Todo   │   │ Search │   │Analytics│
│ Tools  │   │ Tools  │   │ Tools   │
└───┬────┘   └───┬────┘   └───┬─────┘
    │            │            │
    └────────────┼────────────┘
                 │
    ┌────────────▼────────────┐
    │   Existing Todo APIs    │ (No Changes)
    │  /api/todos             │
    │  /api/todos/[id]        │
    └────────────┬────────────┘
                 │
    ┌────────────▼────────────┐
    │    Database Layer       │ (No Changes)
    │  - lib/db.ts            │
    │  - lib/history.ts       │
    │  - data/tasks.json      │
    └─────────────────────────┘
```

### 1.2 Data Flow

```
1. User Input Flow:
   User types "add buy milk"
   → ChatInput component
   → Chat Store (optimistic update)
   → POST /api/chat
   → AI Agent (intent parsing)
   → MCP Tool: todo_create
   → POST /api/todos (existing)
   → lib/db.addTask (existing)
   → lib/history.logAction (existing)
   → Response to AI Agent
   → Stream response to client
   → Update Chat Store
   → Display in ChatMessage

2. Query Flow:
   User asks "what's pending?"
   → POST /api/chat
   → AI Agent
   → MCP Tool: todo_list_by_filter
   → GET /api/todos (existing)
   → Format results
   → Stream response
   → Render rich card with task list
```

---

## 2. Type Definitions

### 2.1 New Type File: `types/chat.ts`

```typescript
import { Task } from './index'

// Message Types
export type MessageRole = 'user' | 'assistant' | 'system'

export interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  timestamp: Date
  metadata?: {
    toolCalls?: ToolCall[]
    taskIds?: number[]
    suggestions?: string[]
    richContent?: RichContent
  }
}

export interface ToolCall {
  id: string
  name: string
  arguments: Record<string, any>
  result?: any
}

export type RichContentType = 'task_list' | 'task_card' | 'stats_card' | 'error'

export interface RichContent {
  type: RichContentType
  data: any
}

// Conversation Context
export interface ConversationContext {
  conversationId: string
  userId: string
  messages: ChatMessage[]
  referencedTaskIds: number[]
  lastIntent?: string
  createdAt: Date
  updatedAt: Date
}

// MCP Tool Types
export interface MCPTool {
  name: string
  description: string
  parameters: {
    type: 'object'
    properties: Record<string, MCPParameter>
    required?: string[]
  }
}

export interface MCPParameter {
  type: string
  description: string
  enum?: string[]
}

export interface MCPToolCall {
  tool: string
  arguments: Record<string, any>
}

export interface MCPToolResult {
  success: boolean
  data?: any
  error?: string
  tasks?: Task[]
}

// Agent Types
export interface AgentConfig {
  model: string
  temperature: number
  maxTokens: number
  tools: MCPTool[]
  systemPrompt: string
}

export interface AgentResponse {
  message: string
  toolCalls?: ToolCall[]
  richContent?: RichContent
  suggestions?: string[]
}

// Chat Store State
export interface ChatState {
  conversations: Record<string, ConversationContext>
  activeConversationId: string | null
  isLoading: boolean
  error: string | null
  isStreaming: boolean
}

// API Request/Response Types
export interface ChatRequest {
  message: string
  conversationId?: string
}

export interface ChatResponse {
  conversationId: string
  message: ChatMessage
  suggestions?: string[]
}

export interface StreamChunk {
  type: 'token' | 'tool_call' | 'rich_content' | 'done'
  data: any
}
```

---

## 3. MCP Server Implementation

### 3.1 MCP Tool Definitions: `lib/mcp/tools/todo-tools.ts`

```typescript
import { MCPTool, MCPToolResult } from '@/types/chat'
import { Task } from '@/types'

export const TODO_TOOLS: MCPTool[] = [
  {
    name: 'todo_create',
    description: 'Create a new todo task',
    parameters: {
      type: 'object',
      properties: {
        description: {
          type: 'string',
          description: 'The task description'
        },
        priority: {
          type: 'string',
          description: 'Task priority level',
          enum: ['low', 'normal', 'high', 'critical']
        },
        tags: {
          type: 'array',
          description: 'Category tags for the task'
        },
        dueDate: {
          type: 'string',
          description: 'Due date in ISO format'
        }
      },
      required: ['description']
    }
  },
  {
    name: 'todo_list',
    description: 'Get all todos for the user',
    parameters: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          description: 'Filter by completion status',
          enum: ['all', 'completed', 'pending']
        },
        priority: {
          type: 'string',
          description: 'Filter by priority',
          enum: ['low', 'normal', 'high', 'critical']
        },
        tags: {
          type: 'array',
          description: 'Filter by tags'
        }
      }
    }
  },
  {
    name: 'todo_update',
    description: 'Update an existing todo task',
    parameters: {
      type: 'object',
      properties: {
        taskId: {
          type: 'number',
          description: 'The ID of the task to update'
        },
        description: {
          type: 'string',
          description: 'New task description'
        },
        priority: {
          type: 'string',
          description: 'New priority level',
          enum: ['low', 'normal', 'high', 'critical']
        },
        completed: {
          type: 'boolean',
          description: 'Mark as completed or pending'
        },
        tags: {
          type: 'array',
          description: 'Update tags'
        },
        dueDate: {
          type: 'string',
          description: 'Update due date'
        }
      },
      required: ['taskId']
    }
  },
  {
    name: 'todo_delete',
    description: 'Delete a todo task',
    parameters: {
      type: 'object',
      properties: {
        taskId: {
          type: 'number',
          description: 'The ID of the task to delete'
        }
      },
      required: ['taskId']
    }
  },
  {
    name: 'todo_search',
    description: 'Search todos by keyword or description',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query'
        }
      },
      required: ['query']
    }
  },
  {
    name: 'todo_get_stats',
    description: 'Get productivity statistics',
    parameters: {
      type: 'object',
      properties: {}
    }
  }
]

// Tool Execution Functions
export interface ToolExecutor {
  execute(toolName: string, args: any, userId: string): Promise<MCPToolResult>
}

export async function executeTodoTool(
  toolName: string,
  args: Record<string, any>,
  userId: string
): Promise<MCPToolResult> {
  // Implementation will call existing APIs
  // This is just the signature
  throw new Error('To be implemented')
}
```

### 3.2 MCP Server: `lib/mcp/server.ts`

```typescript
import { TODO_TOOLS } from './tools/todo-tools'
import { MCPTool, MCPToolCall, MCPToolResult } from '@/types/chat'

export class MCPServer {
  private tools: Map<string, MCPTool>

  constructor() {
    this.tools = new Map()
    this.registerTools(TODO_TOOLS)
  }

  registerTools(tools: MCPTool[]) {
    tools.forEach(tool => {
      this.tools.set(tool.name, tool)
    })
  }

  getTools(): MCPTool[] {
    return Array.from(this.tools.values())
  }

  getTool(name: string): MCPTool | undefined {
    return this.tools.get(name)
  }

  validateToolCall(call: MCPToolCall): boolean {
    const tool = this.getTool(call.tool)
    if (!tool) return false

    // Validate required parameters
    const required = tool.parameters.required || []
    for (const param of required) {
      if (!(param in call.arguments)) {
        return false
      }
    }

    return true
  }

  async executeTool(
    toolName: string,
    args: Record<string, any>,
    userId: string
  ): Promise<MCPToolResult> {
    // Will be implemented to route to appropriate executor
    throw new Error('To be implemented')
  }
}

export const mcpServer = new MCPServer()
```

### 3.3 Context Manager: `lib/mcp/context.ts`

```typescript
import { ConversationContext, ChatMessage } from '@/types/chat'
import { nanoid } from 'nanoid'

export class ConversationContextManager {
  private contexts: Map<string, ConversationContext>

  constructor() {
    this.contexts = new Map()
  }

  createContext(userId: string): ConversationContext {
    const context: ConversationContext = {
      conversationId: nanoid(),
      userId,
      messages: [],
      referencedTaskIds: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }

    this.contexts.set(context.conversationId, context)
    return context
  }

  getContext(conversationId: string): ConversationContext | undefined {
    return this.contexts.get(conversationId)
  }

  addMessage(conversationId: string, message: ChatMessage) {
    const context = this.contexts.get(conversationId)
    if (!context) throw new Error('Context not found')

    context.messages.push(message)
    context.updatedAt = new Date()

    // Track referenced task IDs
    if (message.metadata?.taskIds) {
      context.referencedTaskIds.push(...message.metadata.taskIds)
    }
  }

  getRecentMessages(conversationId: string, count: number = 10): ChatMessage[] {
    const context = this.contexts.get(conversationId)
    if (!context) return []

    return context.messages.slice(-count)
  }

  clearContext(conversationId: string) {
    this.contexts.delete(conversationId)
  }
}

export const contextManager = new ConversationContextManager()
```

---

## 4. AI Agent System

### 4.1 System Prompts: `lib/ai/prompts.ts`

```typescript
export const SYSTEM_PROMPT = `You are Pookie, a friendly and helpful AI assistant for managing todo tasks. Your personality is warm, slightly playful, and always encouraging.

**Your Capabilities:**
- Create, read, update, and delete todo tasks
- Search and filter tasks by various criteria
- Provide productivity insights and statistics
- Answer questions about tasks and progress

**Communication Style:**
- Be friendly and conversational, not robotic
- Use emojis occasionally to add warmth (but don't overdo it)
- Keep responses concise and actionable
- Celebrate user achievements and progress
- Offer helpful suggestions when appropriate

**Examples of Good Responses:**
- "Got it! I've added 'buy groceries' to your list 🛒. Anything else?"
- "You have 3 high-priority tasks pending. Want me to show them?"
- "Great job! You've completed 5 tasks today. You're on fire! 🔥"

**Examples of Bad Responses:**
- "The task has been successfully created in the database with ID 42."
- "Error: Invalid parameter type."
- "I have executed the todo_create function with the following parameters..."

**Tool Usage:**
When users ask you to manage tasks, use the appropriate tools:
- todo_create: For adding new tasks
- todo_list: For showing/listing tasks
- todo_update: For modifying or completing tasks
- todo_delete: For removing tasks
- todo_search: For finding specific tasks
- todo_get_stats: For productivity insights

**Context Awareness:**
- Remember the current conversation
- Use "it", "that", "the task" to refer to recently mentioned items
- If ambiguous, ask clarifying questions

**Important Rules:**
- NEVER make up task IDs or data
- ALWAYS use tools to interact with tasks
- NEVER claim to do something you can't
- If unsure, ask the user to clarify
`

export const ERROR_PROMPT = `The tool call failed. Explain the error to the user in a friendly way and suggest what they could try instead.`

export const CLARIFICATION_PROMPT = `The user's request is ambiguous. Ask them a clarifying question to better understand what they want.`
```

### 4.2 AI Agent Core: `lib/ai/agent.ts`

```typescript
import OpenAI from 'openai'
import { ChatMessage, AgentConfig, AgentResponse } from '@/types/chat'
import { mcpServer } from '@/lib/mcp/server'
import { SYSTEM_PROMPT } from './prompts'

export class TodoAgent {
  private openai: OpenAI
  private config: AgentConfig

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey })

    this.config = {
      model: 'gpt-4-turbo-preview',
      temperature: 0.7,
      maxTokens: 1000,
      tools: mcpServer.getTools(),
      systemPrompt: SYSTEM_PROMPT
    }
  }

  async processMessage(
    userMessage: string,
    conversationHistory: ChatMessage[],
    userId: string
  ): Promise<AgentResponse> {
    // Will be implemented
    throw new Error('To be implemented')
  }

  private buildMessages(
    userMessage: string,
    history: ChatMessage[]
  ): OpenAI.Chat.ChatCompletionMessageParam[] {
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: this.config.systemPrompt
      }
    ]

    // Add conversation history
    for (const msg of history) {
      messages.push({
        role: msg.role,
        content: msg.content
      })
    }

    // Add current user message
    messages.push({
      role: 'user',
      content: userMessage
    })

    return messages
  }

  private async executeToolCalls(
    toolCalls: any[],
    userId: string
  ): Promise<any[]> {
    // Will be implemented
    throw new Error('To be implemented')
  }
}
```

### 4.3 Intent Parser: `lib/ai/parser.ts`

```typescript
export type IntentType =
  | 'create_task'
  | 'list_tasks'
  | 'update_task'
  | 'delete_task'
  | 'search_tasks'
  | 'get_stats'
  | 'general_query'
  | 'unclear'

export interface ParsedIntent {
  type: IntentType
  confidence: number
  entities: Record<string, any>
}

export function parseUserIntent(message: string): ParsedIntent {
  const normalized = message.toLowerCase().trim()

  // Create patterns
  const createPatterns = [
    /^(add|create|new|make)\s+(.+)/,
    /^remind me to\s+(.+)/,
    /^i need to\s+(.+)/,
    /^(.+)\s+(task|todo)$/
  ]

  // List patterns
  const listPatterns = [
    /^(show|list|display|what|what's|get)\s+(my\s+)?(tasks?|todos?)/,
    /^what do i have/,
    /^what('s|\s+is)\s+(pending|due|upcoming)/
  ]

  // Update patterns
  const updatePatterns = [
    /^(mark|set|update|change)\s+(.+)/,
    /^(complete|finish|done)\s+(.+)/,
  ]

  // Delete patterns
  const deletePatterns = [
    /^(delete|remove|cancel)\s+(.+)/,
  ]

  // Stats patterns
  const statsPatterns = [
    /^how (am i|have i|did i)/,
    /^(show|get)\s+(my\s+)?(stats|progress|analytics)/,
  ]

  // Check patterns
  for (const pattern of createPatterns) {
    if (pattern.test(normalized)) {
      return {
        type: 'create_task',
        confidence: 0.9,
        entities: { description: normalized.match(pattern)?.[2] || '' }
      }
    }
  }

  // ... similar checks for other patterns ...

  return {
    type: 'unclear',
    confidence: 0.3,
    entities: {}
  }
}
```

---

## 5. API Routes

### 5.1 Chat Endpoint: `app/api/chat/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { TodoAgent } from '@/lib/ai/agent'
import { contextManager } from '@/lib/mcp/context'
import { ChatRequest, ChatMessage } from '@/types/chat'
import { nanoid } from 'nanoid'

const agent = new TodoAgent(process.env.OPENAI_API_KEY!)

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body: ChatRequest = await request.json()
    const { message, conversationId } = body

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Get or create conversation context
    let context = conversationId
      ? contextManager.getContext(conversationId)
      : null

    if (!context) {
      context = contextManager.createContext(session.userId)
    }

    // Create user message
    const userMessage: ChatMessage = {
      id: nanoid(),
      role: 'user',
      content: message,
      timestamp: new Date()
    }

    contextManager.addMessage(context.conversationId, userMessage)

    // Process with AI agent
    const history = contextManager.getRecentMessages(context.conversationId, 10)
    const response = await agent.processMessage(
      message,
      history,
      session.userId
    )

    // Create assistant message
    const assistantMessage: ChatMessage = {
      id: nanoid(),
      role: 'assistant',
      content: response.message,
      timestamp: new Date(),
      metadata: {
        toolCalls: response.toolCalls,
        suggestions: response.suggestions,
        richContent: response.richContent
      }
    }

    contextManager.addMessage(context.conversationId, assistantMessage)

    return NextResponse.json({
      conversationId: context.conversationId,
      message: assistantMessage,
      suggestions: response.suggestions
    })

  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### 5.2 Stream Endpoint: `app/api/chat/stream/route.ts`

```typescript
import { NextRequest } from 'next/server'
import { getSession } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return new Response('Unauthorized', { status: 401 })
    }

    const stream = new ReadableStream({
      async start(controller) {
        // SSE streaming implementation
        const encoder = new TextEncoder()

        controller.enqueue(encoder.encode('data: {"type":"connected"}\n\n'))

        // Will implement streaming response here
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    })

  } catch (error) {
    return new Response('Error', { status: 500 })
  }
}
```

### 5.3 MCP Tools Endpoint: `app/api/mcp/tools/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { mcpServer } from '@/lib/mcp/server'

export async function GET() {
  // Return available tools
  return NextResponse.json({
    tools: mcpServer.getTools()
  })
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { tool, arguments: args } = await request.json()

    if (!tool || !args) {
      return NextResponse.json(
        { error: 'Tool and arguments required' },
        { status: 400 }
      )
    }

    // Validate tool call
    if (!mcpServer.validateToolCall({ tool, arguments: args })) {
      return NextResponse.json(
        { error: 'Invalid tool call' },
        { status: 400 }
      )
    }

    // Execute tool
    const result = await mcpServer.executeTool(tool, args, session.userId)

    return NextResponse.json(result)

  } catch (error) {
    console.error('MCP error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

---

## 6. UI Components

### 6.1 Chat Widget: `components/ChatWidget.tsx`

```typescript
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChatInput } from './ChatInput'
import { ChatMessage } from './ChatMessage'
import { useChatStore } from '@/lib/chat-store'

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const { messages, sendMessage, isLoading } = useChatStore()

  return (
    <>
      {/* Floating Button */}
      <motion.button
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full shadow-lg flex items-center justify-center text-white text-2xl z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        💬
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-black">Pookie Assistant</h3>
                <p className="text-xs text-gray-500">Your AI todo helper</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(msg => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              <ChatInput onSend={sendMessage} disabled={isLoading} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
```

### 6.2 Chat Input Component: `components/ChatInput.tsx`

```typescript
'use client'

import { useState, KeyboardEvent } from 'react'

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (!input.trim() || disabled) return
    onSend(input)
    setInput('')
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type a message..."
        disabled={disabled}
        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-black disabled:opacity-50"
      />
      <button
        onClick={handleSend}
        disabled={disabled || !input.trim()}
        className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Send
      </button>
    </div>
  )
}
```

### 6.3 Chat Message Component: `components/ChatMessage.tsx`

```typescript
'use client'

import { ChatMessage as ChatMessageType } from '@/types/chat'
import { motion } from 'framer-motion'

interface ChatMessageProps {
  message: ChatMessageType
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2 ${
          isUser
            ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
            : 'bg-gray-100 text-black'
        }`}
      >
        <p className="text-sm">{message.content}</p>

        {/* Rich Content Rendering */}
        {message.metadata?.richContent && (
          <div className="mt-2">
            {/* Will render based on richContent.type */}
          </div>
        )}

        {/* Suggestions */}
        {message.metadata?.suggestions && (
          <div className="mt-2 flex flex-wrap gap-2">
            {message.metadata.suggestions.map((suggestion, i) => (
              <button
                key={i}
                className="text-xs px-2 py-1 bg-white/20 rounded-full hover:bg-white/30"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}
```

---

## 7. State Management

### 7.1 Chat Store: `lib/chat-store.ts`

```typescript
import { create } from 'zustand'
import { ChatMessage, ChatState } from '@/types/chat'

interface ChatStore extends ChatState {
  sendMessage: (message: string) => Promise<void>
  clearConversation: () => void
  setError: (error: string | null) => void
}

export const useChatStore = create<ChatStore>((set, get) => ({
  conversations: {},
  activeConversationId: null,
  isLoading: false,
  error: null,
  isStreaming: false,

  sendMessage: async (message: string) => {
    set({ isLoading: true, error: null })

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          conversationId: get().activeConversationId
        })
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const data = await response.json()

      set(state => ({
        conversations: {
          ...state.conversations,
          [data.conversationId]: {
            ...state.conversations[data.conversationId],
            messages: [
              ...(state.conversations[data.conversationId]?.messages || []),
              data.message
            ]
          }
        },
        activeConversationId: data.conversationId,
        isLoading: false
      }))

    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false
      })
    }
  },

  clearConversation: () => {
    set({
      conversations: {},
      activeConversationId: null,
      error: null
    })
  },

  setError: (error) => {
    set({ error })
  }
}))
```

---

## 8. Integration Layer

### 8.1 Tool Executors: Implementation of `lib/mcp/tools/todo-tools.ts` (execution)

```typescript
import { MCPToolResult } from '@/types/chat'

export async function executeTodoCreate(
  args: { description: string; priority?: string; tags?: string[]; dueDate?: string },
  userId: string
): Promise<MCPToolResult> {
  // Calls existing POST /api/todos
  try {
    const response = await fetch('/api/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `token=${getTokenForUser(userId)}` // Internal auth
      },
      body: JSON.stringify({
        description: args.description,
        priority: args.priority || 'normal',
        tags: args.tags || [],
        dueDate: args.dueDate || null
      })
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Failed to create task'
      }
    }

    return {
      success: true,
      data: data.task,
      tasks: [data.task]
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Similar implementations for:
// - executeTodoList
// - executeTodoUpdate
// - executeTodoDelete
// - executeTodoSearch
// - executeTodoGetStats
```

---

## 9. Error Handling

### 9.1 Error Types

```typescript
export class ChatError extends Error {
  constructor(
    message: string,
    public code: string,
    public userMessage: string
  ) {
    super(message)
  }
}

export const ChatErrors = {
  UNAUTHORIZED: new ChatError(
    'User not authenticated',
    'UNAUTHORIZED',
    "Oops! You need to be logged in to chat with me."
  ),
  RATE_LIMIT: new ChatError(
    'Rate limit exceeded',
    'RATE_LIMIT',
    "Whoa! You're chatting too fast. Take a breather? 😅"
  ),
  AI_ERROR: new ChatError(
    'AI service error',
    'AI_ERROR',
    "I'm having trouble thinking right now. Mind trying again?"
  ),
  TOOL_ERROR: new ChatError(
    'Tool execution failed',
    'TOOL_ERROR',
    "I couldn't complete that action. Could you try rephrasing?"
  )
}
```

### 9.2 Error Boundaries

```typescript
// In chat components
try {
  await sendMessage(input)
} catch (error) {
  if (error instanceof ChatError) {
    showUserFriendlyError(error.userMessage)
  } else {
    showUserFriendlyError("Something went wrong. Please try again.")
  }
}
```

---

## 10. Testing Specifications

### 10.1 Unit Tests

```typescript
// Example test for intent parser
describe('parseUserIntent', () => {
  it('should detect create intent', () => {
    const result = parseUserIntent('add buy milk')
    expect(result.type).toBe('create_task')
    expect(result.confidence).toBeGreaterThan(0.8)
  })

  it('should detect list intent', () => {
    const result = parseUserIntent('show my tasks')
    expect(result.type).toBe('list_tasks')
  })
})

// MCP Server tests
describe('MCPServer', () => {
  it('should register tools correctly', () => {
    const server = new MCPServer()
    expect(server.getTools().length).toBeGreaterThan(0)
  })

  it('should validate tool calls', () => {
    const server = new MCPServer()
    const valid = server.validateToolCall({
      tool: 'todo_create',
      arguments: { description: 'test' }
    })
    expect(valid).toBe(true)
  })
})
```

### 10.2 Integration Tests

```typescript
describe('Chat API', () => {
  it('should create task via chat', async () => {
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        message: 'add buy groceries'
      })
    })

    expect(response.ok).toBe(true)
    const data = await response.json()
    expect(data.message.content).toContain('added')
  })
})
```

---

## 11. Environment Variables

```env
# .env.local
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4-turbo-preview
MAX_TOKENS=1000
TEMPERATURE=0.7
```

---

## 12. File Summary

### New Files to Create (23 files)

```
types/chat.ts
lib/ai/agent.ts
lib/ai/prompts.ts
lib/ai/parser.ts
lib/mcp/server.ts
lib/mcp/context.ts
lib/mcp/tools/todo-tools.ts
lib/mcp/tools/search-tools.ts
lib/mcp/tools/analytics-tools.ts
lib/chat-store.ts
app/api/chat/route.ts
app/api/chat/stream/route.ts
app/api/mcp/tools/route.ts
app/chat/page.tsx
components/ChatWidget.tsx
components/ChatMessage.tsx
components/ChatInput.tsx
components/ChatHistory.tsx
components/RichContent.tsx
components/TaskCard.tsx
components/StatsCard.tsx
components/SuggestionsBar.tsx
__tests__/chat.test.ts
```

---

**END OF SPECIFICATIONS**

This specification document is ready for user review and approval before implementation begins.
