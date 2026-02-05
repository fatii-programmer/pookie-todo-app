'use client'

import { useState, useEffect, useRef } from 'react'
import Header from '@/components/Header'
import { motion, AnimatePresence } from 'framer-motion'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatPage(): JSX.Element {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const initializedRef = useRef(false)

  // Get user email and send initial greeting
  useEffect(() => {
    if (initializedRef.current) return
    initializedRef.current = true

    const email = localStorage.getItem('userEmail')
    setUserEmail(email)

    // Send initial greeting
    const getGreeting = async () => {
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(email && { 'x-user-email': email }),
          },
          body: JSON.stringify({ message: 'hi' }),
        })

        if (res.ok) {
          const data = await res.json()
          setMessages([{ role: 'assistant', content: data.response }])
        } else {
          setMessages([{
            role: 'assistant',
            content: 'Hi there! How can I help you with your tasks today?',
          }])
        }
      } catch {
        setMessages([{
          role: 'assistant',
          content: 'Hi there! How can I help you with your tasks today?',
        }])
      }
    }

    getGreeting()
  }, [])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')

    // Add user message immediately
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(userEmail && { 'x-user-email': userEmail }),
        },
        body: JSON.stringify({
          message: userMessage,
          history: messages,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'Sorry, I had trouble processing that. Please try again!',
        }])
      }
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, something went wrong. Please try again!',
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="min-h-screen bg-gray-50 flex flex-col"
    >
      <a href="#chat-messages" className="skip-link">
        Skip to chat messages
      </a>

      <Header
        title="AI Chat"
        subtitle="Chat with your AI task assistant"
        showSearch={false}
      />

      <main className="flex-1 max-w-4xl mx-auto w-full p-4 sm:p-6 md:p-8 flex flex-col">
        {/* Chat Messages */}
        <motion.div
          id="chat-messages"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="flex-1 bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-6 overflow-y-auto border-2 border-gray-100"
          role="log"
          aria-live="polite"
          aria-atomic="false"
          aria-relevant="additions"
          aria-label="Chat conversation"
        >
          <div className="space-y-4 sm:space-y-5">
            <AnimatePresence mode="popLayout">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  layout
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  role="article"
                  aria-label={`${message.role === 'user' ? 'Your message' : 'Assistant message'}: ${message.content}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-4 sm:p-5 shadow-md ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg border border-pink-400'
                        : 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900 border-2 border-gray-200'
                    }`}
                  >
                    <span className="sr-only">{message.role === 'user' ? 'You said:' : 'Assistant said:'}</span>
                    <p className="text-base sm:text-lg font-medium leading-relaxed whitespace-pre-line">{message.content}</p>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900 border-2 border-gray-200 rounded-2xl p-4 sm:p-5 shadow-md">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        </motion.div>

        {/* Input Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="bg-white rounded-2xl shadow-xl p-5 sm:p-6 border-2 border-gray-100"
          role="form"
          aria-label="Chat message form"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <label htmlFor="chat-input" className="sr-only">Type your message</label>
            <input
              id="chat-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
              placeholder="Type your message..."
              aria-label="Message input"
              aria-describedby="send-hint"
              className="flex-1 h-14 px-5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 focus:bg-white hover:border-gray-300 transition-all duration-200 text-black text-base font-medium placeholder-gray-400"
            />
            <span id="send-hint" className="sr-only">Press Enter to send message</span>
            <motion.button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              whileTap={{ scale: 0.95 }}
              aria-label={isLoading ? 'Sending message' : input.trim() ? 'Send message' : 'Type a message to send'}
              aria-disabled={!input.trim() || isLoading}
              className="w-full sm:w-auto px-8 h-14 sm:min-w-[120px] bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:from-pink-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg transition-all duration-200 text-base"
            >
              {isLoading ? 'Sending...' : 'Send'}
            </motion.button>
          </div>
        </motion.div>
      </main>
    </motion.div>
  )
}
