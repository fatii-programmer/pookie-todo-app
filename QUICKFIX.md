# 🚀 QUICK FIX - Get Chatbot Working in 2 Minutes

## The Problem
Chatbot shows: "Sorry, I encountered an error. Please try again."

## The Cause
**Missing `.env.local` file!** The OpenAI API key isn't loaded.

## The Solution (Choose One)

### Option A: Automated Setup (Easiest)
```bash
node scripts/setup-env.js
```
Follow the prompts to enter your OpenAI API key.

### Option B: Manual Setup (30 seconds)
```bash
# 1. Create environment file
cp .env.local.example .env.local

# 2. Get API key from https://platform.openai.com/api-keys

# 3. Edit .env.local and replace this line:
#    OPENAI_API_KEY=sk-proj-REPLACE-WITH-YOUR-ACTUAL-KEY
#    With your actual key

# 4. Generate JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Copy output and add to .env.local as JWT_SECRET

# 5. Restart server
npm run dev
```

## Verify It Works
```bash
# Run diagnostic
node scripts/diagnose-chatbot.js

# Should say: ✅ ALL CHECKS PASSED!
```

## Test Chatbot
1. Open http://localhost:3000
2. Login
3. Click chat button (💬)
4. Type: "add task: buy milk"
5. Task should be created immediately!

## That's It!

The RAG chatbot is **fully implemented**:
- ✅ Context retrieval
- ✅ Function calling
- ✅ History storage
- ✅ Error handling
- ✅ Natural language understanding

It just needed your API key.

## Full Documentation
- **CHATBOT_DIAGNOSIS.md** - Complete technical explanation
- **IMPLEMENTATION_GUIDE.md** - Architecture details
- **scripts/diagnose-chatbot.js** - Diagnostic tool
