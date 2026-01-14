# Quick Start Guide

## Running the Application

### 1. Install Dependencies (if not already done)
```bash
npm install
```

### 2. Set Up Environment Variables
Ensure `.env.local` exists with:
```env
OPENAI_API_KEY=your_openai_api_key
JWT_SECRET=your_jwt_secret_here
DATABASE_PATH=./data/tasks.json
```

### 3. Start Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Testing the New Features

### Login & Dashboard
1. Navigate to `http://localhost:3000`
2. Log in with existing credentials:
   - Email: `designerfatii@gmail.com` or `ubaid12@gmail.com`
   - Password: (your existing password)
3. You'll be redirected to the dashboard immediately (no blocking screen)

### AI Chatbot
1. On the dashboard, look for the floating chat button (💬) in bottom-right corner
2. Click to open chat window
3. Try these commands:
   ```
   "Add buy groceries tomorrow"
   "Mark task 1 as complete"
   "Show my pending tasks"
   "Delete task: buy groceries"
   "Update task 2 priority to high"
   ```

### History Tracking
Check the history files to see all logged actions:
```bash
# View user-specific history
cat history/users/{userId}.json

# View chatbot conversations
cat history/chatbot/conversations.json

# View login events
cat history/login-history.json

# View todo events
cat history/todo-history.json
```

## Verifying Data Safety

### Check existing data is intact:
```bash
# View all users and tasks
cat data/tasks.json

# Should show 2 users with 14 total tasks (preserved)
```

## Features Overview

### Dashboard Features (Existing - All Working)
- ✓ Add tasks with priority, deadline, category
- ✓ Search and filter tasks
- ✓ Edit tasks inline
- ✓ Mark tasks complete/incomplete
- ✓ Delete tasks with confirmation
- ✓ Progress tracking
- ✓ Analytics page

### New Chatbot Features
- ✓ Natural language task creation
- ✓ Task completion via chat
- ✓ Task deletion via chat
- ✓ Task updates via chat
- ✓ List/query tasks
- ✓ Smart date parsing ("tomorrow", "next week")
- ✓ Priority detection ("urgent", "important")
- ✓ Tag extraction (#work, #personal)

### New History Features
- ✓ Per-user action logs
- ✓ Chatbot conversation logs
- ✓ Logout tracking
- ✓ Complete audit trail

## Project Structure

```
hackathon-2/
├── app/
│   ├── api/
│   │   ├── ai/chat/          # NEW: Chatbot endpoint
│   │   ├── auth/             # Login, signup, logout (enhanced)
│   │   └── todos/            # Task CRUD (unchanged)
│   ├── dashboard/            # Dashboard UI (+ chatbot)
│   └── login/                # Login page (unchanged)
├── components/
│   └── ChatbotWidget.tsx     # NEW: Chat UI component
├── lib/
│   ├── ai.ts                 # OpenAI integration (existing)
│   ├── auth.ts               # JWT auth (unchanged)
│   ├── db.ts                 # Database (unchanged)
│   └── history.ts            # ENHANCED: Logging system
├── history/                  # NEW: History logs folder
│   ├── users/                # Per-user logs
│   ├── chatbot/              # Chatbot logs
│   ├── login-history.json    # Auth events
│   └── todo-history.json     # Task events
└── data/
    └── tasks.json            # User & task data (preserved)
```

## Troubleshooting

### Chatbot not working?
1. Check `.env.local` has valid `OPENAI_API_KEY`
2. Check browser console for errors
3. Verify API endpoint: `POST /api/ai/chat`

### Tasks not updating?
1. Check network tab for failed requests
2. Verify authentication (token cookie)
3. Check `data/tasks.json` permissions

### History not logging?
1. Check `history/` folder permissions
2. Verify history files are writable
3. Check server logs for errors

## Next Steps

1. Test all existing features to confirm they work
2. Try the AI chatbot with various commands
3. Check history files to see logging in action
4. Review the codebase to understand the implementation

All existing functionality is preserved and working. The new features are additive enhancements that don't break anything existing.
