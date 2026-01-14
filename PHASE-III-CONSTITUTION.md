# Phase III Constitution: AI-Powered Conversational Todo Assistant

**Version:** 3.0.0
**Date:** 2025-12-31
**Status:** Specification Phase

---

## 1. Core Principles

### 1.1 Non-Destructive Evolution
- **MUST NOT** modify, refactor, rename, or delete any existing files
- **MUST NOT** alter existing APIs, routes, or database schemas
- **MUST NOT** change authentication, analytics, or dashboard logic
- **ALL** changes are strictly **ADDITIVE ONLY**
- **MUST** preserve all existing functionality completely

### 1.2 Integration Philosophy
- Integrate seamlessly with existing todo system
- Reuse existing APIs (`/api/todos`, `/api/todos/[id]`)
- Leverage existing history logging system (`lib/history.ts`)
- Maintain existing data structures (`data/tasks.json`, `history/*.json`)
- Extend, never replace

### 1.3 Spec-Driven Development
- **MUST** complete full specification before implementation
- **MUST** obtain explicit user approval before coding
- **MUST** follow specifications exactly as written
- **MUST** document all new components comprehensively

---

## 2. Phase III Objectives

### 2.1 Primary Goal
Build an AI-powered conversational interface that allows users to manage their todos using natural language, creating a delightful "pookie" assistant experience.

### 2.2 Key Features
1. **Natural Language Processing**
   - Understand user intent from casual conversation
   - Parse commands like "add buy milk", "mark task 5 done", "show my pending tasks"
   - Support context-aware follow-up questions

2. **Conversational UI**
   - Chat-style interface integrated into dashboard
   - Message history persistence
   - Typing indicators and smooth animations
   - "Pookie" personality in responses

3. **Todo Management via Chat**
   - Create todos conversationally
   - Update/complete/delete todos by description or ID
   - Search and filter tasks via natural language
   - Bulk operations through conversation

4. **AI Agent System**
   - OpenAI Agents SDK for orchestration
   - MCP (Model Context Protocol) server for tool integration
   - Function calling for todo operations
   - Context management across conversation

---

## 3. Technical Architecture

### 3.1 Technology Stack
- **AI Framework:** OpenAI API (GPT-4)
- **Agent SDK:** OpenAI Agents SDK (official)
- **Protocol:** Model Context Protocol (MCP SDK)
- **UI:** React + Framer Motion (existing stack)
- **State:** Zustand or React Context
- **API Layer:** Next.js API routes (additive)

### 3.2 Component Structure
```
New Additions (Additive Only):
├── app/
│   ├── api/
│   │   ├── chat/
│   │   │   ├── route.ts              [NEW: Chat endpoint]
│   │   │   └── stream/route.ts       [NEW: Streaming responses]
│   │   └── mcp/
│   │       └── tools/route.ts        [NEW: MCP tool registry]
│   └── chat/
│       └── page.tsx                  [NEW: Standalone chat page]
├── components/
│   ├── ChatWidget.tsx                [NEW: Floating chat widget]
│   ├── ChatMessage.tsx               [NEW: Message component]
│   ├── ChatInput.tsx                 [NEW: Input with suggestions]
│   └── ChatHistory.tsx               [NEW: Conversation history]
├── lib/
│   ├── ai/
│   │   ├── agent.ts                  [NEW: OpenAI Agent setup]
│   │   ├── prompts.ts                [NEW: System prompts]
│   │   ├── tools.ts                  [NEW: Tool definitions]
│   │   └── parser.ts                 [NEW: Intent parsing]
│   ├── mcp/
│   │   ├── server.ts                 [NEW: MCP server]
│   │   ├── tools/
│   │   │   ├── todo-tools.ts         [NEW: Todo operations]
│   │   │   ├── search-tools.ts       [NEW: Search/filter]
│   │   │   └── analytics-tools.ts    [NEW: Stats queries]
│   │   └── context.ts                [NEW: Conversation context]
│   └── chat-store.ts                 [NEW: Chat state management]
└── types/
    └── chat.ts                       [NEW: Chat type definitions]
```

### 3.3 Data Flow
```
User Message → Chat UI → API Route → Agent SDK → MCP Tools →
Existing Todo APIs → History Logging → Response → Chat UI
```

---

## 4. Integration Points

### 4.1 Existing Systems (READ-ONLY)
- **Todo APIs:** `/api/todos` (GET, POST), `/api/todos/[id]` (PATCH, DELETE)
- **History Logging:** `lib/history.ts` (logAction function)
- **Authentication:** `lib/auth.ts` (getSession function)
- **Database:** `lib/db.ts` (all functions)
- **Analytics:** `lib/analytics.ts` (read for insights)

### 4.2 New Endpoints (ADDITIVE)
- `POST /api/chat` - Send message, get AI response
- `GET /api/chat/stream` - SSE streaming responses
- `GET /api/chat/history` - Conversation history
- `POST /api/mcp/tools` - MCP tool execution

---

## 5. AI Agent Specifications

### 5.1 Agent Personality ("Pookie Assistant")
- **Tone:** Friendly, helpful, slightly playful
- **Style:** Casual but professional, uses emojis sparingly
- **Examples:**
  - ✅ "Got it! I've added 'buy groceries' to your list 🛒"
  - ✅ "You have 3 pending high-priority tasks. Want me to list them?"
  - ❌ "Task has been successfully created in the database."

### 5.2 Capabilities
1. **Todo CRUD Operations**
   - Create: "add task X", "remind me to Y"
   - Read: "show my tasks", "what's pending?"
   - Update: "mark task 5 done", "change priority of X to high"
   - Delete: "delete task 3", "remove buy milk"

2. **Search & Filter**
   - By status: "show completed tasks"
   - By priority: "what are my high priority items?"
   - By category: "list all work tasks"
   - By date: "tasks due this week"

3. **Analytics Queries**
   - "How am I doing today?"
   - "What's my completion rate?"
   - "Show my productivity trend"

4. **Contextual Awareness**
   - Remember previous messages in conversation
   - Handle follow-up questions ("mark it done", "delete that one")
   - Clarify ambiguous requests

### 5.3 Tool Functions
```typescript
Available Tools:
- createTodo(description, priority?, tags?, dueDate?)
- getTodos(filter?: { status, priority, tags })
- updateTodo(id, updates)
- deleteTodo(id)
- searchTodos(query)
- getProductivityStats()
- getTaskById(id)
```

---

## 6. MCP Server Design

### 6.1 Purpose
Provide a standardized protocol for the AI agent to interact with todo system using MCP (Model Context Protocol).

### 6.2 Tool Registry
```typescript
MCP Tools:
1. todo_create
2. todo_read
3. todo_update
4. todo_delete
5. todo_search
6. todo_stats
7. todo_list_by_filter
```

### 6.3 Context Management
- Track conversation history
- Maintain referenced task IDs
- Store user preferences
- Handle multi-turn interactions

---

## 7. User Experience Flow

### 7.1 Chat Widget (Dashboard Integration)
1. Floating chat button in bottom-right corner
2. Click to expand chat panel
3. Minimizable, draggable (optional)
4. Badge shows unread AI suggestions

### 7.2 Standalone Chat Page
1. Full-screen chat interface at `/chat`
2. Sidebar with quick actions
3. Conversation history
4. Export/clear options

### 7.3 Message Types
- **User Messages:** Text input, voice input (future)
- **AI Responses:** Text with formatting, suggested actions
- **System Messages:** Task created/updated confirmations
- **Rich Cards:** Todo previews, analytics snapshots

---

## 8. Security & Privacy

### 8.1 Authentication
- **MUST** verify session before processing chat requests
- **MUST** scope all operations to authenticated user
- **MUST** prevent cross-user data access

### 8.2 Data Handling
- **MUST** sanitize user inputs
- **MUST** validate AI function calls
- **MUST NOT** expose sensitive data in prompts
- **MUST** log all AI operations to history

### 8.3 Rate Limiting
- Max 50 messages per user per hour
- Streaming response timeout: 30 seconds
- Token usage monitoring

---

## 9. Error Handling

### 9.1 Graceful Degradation
- If AI fails, show friendly error
- Fallback to direct todo UI
- Never crash existing features

### 9.2 Error Messages
- **AI Unavailable:** "I'm having trouble thinking right now. Try again?"
- **Invalid Command:** "I didn't quite get that. Could you rephrase?"
- **Permission Error:** "Oops! I can't do that right now."

---

## 10. Testing Strategy

### 10.1 Unit Tests
- Tool function parsing
- Intent recognition
- Context management

### 10.2 Integration Tests
- AI → MCP → API flow
- History logging verification
- Multi-turn conversations

### 10.3 User Acceptance
- Natural language comprehension
- Response quality
- UI/UX smoothness

---

## 11. Success Criteria

### 11.1 Functional Requirements
✅ User can create todos via natural language
✅ User can query tasks conversationally
✅ User can update/delete tasks via chat
✅ AI maintains conversation context
✅ All operations logged to history
✅ Existing features remain unchanged

### 11.2 Quality Requirements
✅ Response time < 3 seconds (95th percentile)
✅ Intent accuracy > 90%
✅ Zero breaking changes to existing code
✅ Mobile-responsive chat UI
✅ Accessibility (keyboard nav, screen readers)

---

## 12. Implementation Phases

### Phase III-A: Foundation (Specs & Setup)
1. Write constitution ✅
2. Write detailed specifications (SPEC-PHASE-III.md)
3. Get user approval
4. Setup project structure

### Phase III-B: MCP Server
1. Implement MCP tool registry
2. Create todo operation tools
3. Add context management
4. Test tool execution

### Phase III-C: AI Agent
1. Setup OpenAI Agent SDK
2. Configure system prompts
3. Implement function calling
4. Test conversation flow

### Phase III-D: Chat UI
1. Build chat widget component
2. Create standalone chat page
3. Add message history
4. Implement streaming responses

### Phase III-E: Integration & Polish
1. Integrate with dashboard
2. Add history logging
3. Error handling
4. Final testing

---

## 13. Non-Goals (Out of Scope)

❌ Voice input/output (future phase)
❌ Multi-user collaboration
❌ Custom AI training
❌ Mobile native app
❌ Offline support
❌ Third-party integrations (Slack, etc.)
❌ Replacing existing UI with chat-only interface

---

## 14. Maintenance & Evolution

### 14.1 Versioning
- Follow semantic versioning
- Document breaking changes (none expected)
- Maintain changelog

### 14.2 Monitoring
- Track AI usage and costs
- Monitor response quality
- Log errors and failures

### 14.3 Future Enhancements
- Voice interaction
- Proactive suggestions
- Smart scheduling
- Team collaboration features

---

## 15. Compliance & Ethics

### 15.1 AI Ethics
- Transparent about AI usage
- No manipulative patterns
- User data privacy first
- Explainable AI decisions

### 15.2 Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support
- High contrast mode

---

**End of Constitution**

This document serves as the guiding framework for Phase III development. All implementation decisions must align with these principles and specifications.
