'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { ChatBubble } from './ChatBubble';

export function ChatPanel() {
  const { isChatPanelOpen, setChatPanelOpen, messages, addMessage, isTyping, setTyping } = useAppStore();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;

    addMessage({
      content: input,
      role: 'user',
    });

    setInput('');
    setTyping(true);

    setTimeout(() => {
      setTyping(false);
      addMessage({
        content: "Hey! I'm Pookie, your friendly task assistant. I'd love to help you manage your tasks! 🐰✨",
        role: 'pookie',
      });
    }, 1500);
  };

  const suggestions = ['Show my tasks', 'Add a task', "What's due today?"];

  return (
    <>
      {/* Minimized State */}
      <AnimatePresence>
        {!isChatPanelOpen && (
          <motion.button
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            onClick={() => setChatPanelOpen(true)}
            className="fixed bottom-0 left-0 right-0 z-30
              glass-strong border-t border-white/40 h-[60px]
              flex items-center justify-between px-6
              hover:bg-white/90 transition-colors duration-200"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">💬</span>
              <span className="font-medium text-neutral-900">Chat with Pookie</span>
            </div>
            <span className="text-neutral-500">↑</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Expanded State */}
      <AnimatePresence>
        {isChatPanelOpen && (
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed bottom-0 left-0 right-0 z-30
              bg-white shadow-2xl rounded-t-3xl
              h-[500px] md:h-[500px]
              flex flex-col"
          >
            {/* Header */}
            <div className="bg-lavender-100 px-6 py-4 rounded-t-3xl flex items-center justify-between">
              <h2 className="text-lg font-semibold text-lavender-700 flex items-center gap-2">
                <span>🐰</span>
                <span>Pookie</span>
              </h2>
              <button
                onClick={() => setChatPanelOpen(false)}
                className="w-9 h-9 rounded-full hover:bg-lavender-200
                  transition-colors duration-200 flex items-center justify-center"
                aria-label="Minimize chat"
              >
                <span className="text-lavender-700">↓</span>
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-lavender-50/50 to-mint-50/50 scrollbar-hide">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="text-6xl mb-4">🐰</div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-2">Hey there!</h3>
                  <p className="text-neutral-500 mb-6">How can I help you today?</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => setInput(suggestion)}
                        className="px-4 py-2 text-sm glass rounded-full
                          hover:bg-white/80 transition-all duration-200 hover:scale-105"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((message) => (
                <ChatBubble key={message.id} message={message} />
              ))}

              {isTyping && <ChatBubble message={{ id: 'typing', content: '', role: 'pookie', timestamp: new Date(), type: 'typing' }} />}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-white border-t border-neutral-200 p-4 shadow-lg">
              <div className="relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Ask Pookie anything..."
                  className="w-full bg-neutral-50 border-2 border-transparent
                    focus:border-lavender-300 rounded-2xl py-4 px-4 pr-14
                    min-h-[56px] max-h-[200px] resize-none outline-none
                    text-base transition-colors duration-200"
                  rows={1}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="absolute right-2 bottom-2 w-11 h-11 rounded-full
                    bg-btn-primary-gradient text-white
                    flex items-center justify-center
                    disabled:opacity-50 disabled:cursor-not-allowed
                    hover:scale-110 active:scale-95
                    transition-transform duration-200"
                  aria-label="Send message"
                >
                  <span className="text-xl">→</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
