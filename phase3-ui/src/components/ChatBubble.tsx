'use client';

import { motion } from 'framer-motion';
import { format } from 'date-fns';
import type { Message } from '@/types';

interface ChatBubbleProps {
  message: Message;
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const isPookie = message.role === 'pookie';

  if (message.type === 'typing') {
    return <TypingIndicator />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: isPookie ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`flex items-start gap-3 mb-4 ${isPookie ? '' : 'justify-end'}`}
    >
      {isPookie && <PookieAvatar />}

      <div className={`flex flex-col ${isPookie ? 'items-start' : 'items-end'} max-w-[80%] md:max-w-[60%]`}>
        <div
          className={`
            px-4 py-3 rounded-2xl
            ${
              isPookie
                ? 'glass-strong rounded-tl-sm border-white/60 text-neutral-900'
                : 'bg-btn-primary-gradient text-white rounded-tr-sm shadow-lg shadow-lavender/30'
            }
          `}
        >
          <p className="text-base leading-relaxed whitespace-pre-wrap">{message.content}</p>

          {message.taskPreview && (
            <div className="mt-3 p-3 rounded-xl bg-white/50 border border-white/40">
              <div className="flex items-start gap-2">
                <span className="text-lg">☐</span>
                <div className="flex-1">
                  <p className="font-medium text-sm">{message.taskPreview.description}</p>
                  {message.taskPreview.dueDate && (
                    <p className="text-xs text-neutral-600 mt-1">
                      Due: {format(new Date(message.taskPreview.dueDate), 'MMM d, h:mm a')}
                    </p>
                  )}
                  {message.taskPreview.tags.length > 0 && (
                    <p className="text-xs text-neutral-600 mt-1">
                      {message.taskPreview.tags.map((tag) => `#${tag}`).join(' ')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {message.actions && message.actions.length > 0 && (
            <div className="flex flex-col gap-2 mt-3">
              {message.actions.map((action) => (
                <button
                  key={action.id}
                  onClick={action.onClick}
                  className="w-full px-4 py-2 text-sm font-medium rounded-lg
                    bg-white/60 hover:bg-white/80 border border-white/40
                    transition-all duration-200 hover:scale-[1.02]"
                >
                  {action.icon && <span className="mr-2">{action.icon}</span>}
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <span className={`text-xs text-neutral-400 mt-1 ${isPookie ? 'ml-11' : 'mr-11'}`}>
          {format(new Date(message.timestamp), 'h:mm a')}
        </span>
      </div>

      {!isPookie && <UserAvatar />}
    </motion.div>
  );
}

function PookieAvatar() {
  return (
    <div
      className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-lavender-400 to-mint-400
        flex items-center justify-center border-2 border-white shadow-sm"
    >
      <span className="text-sm">🐰</span>
    </div>
  );
}

function UserAvatar() {
  return (
    <div
      className="flex-shrink-0 w-8 h-8 rounded-full bg-lavender-500
        flex items-center justify-center border-2 border-white shadow-sm
        text-white text-sm font-semibold"
    >
      U
    </div>
  );
}

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-start gap-3 mb-4"
    >
      <PookieAvatar />

      <div className="glass-strong px-4 py-3 rounded-2xl rounded-tl-sm">
        <div className="flex items-center gap-1">
          <motion.div
            className="w-2 h-2 rounded-full bg-neutral-400"
            animate={{ y: [-4, 0, -4] }}
            transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="w-2 h-2 rounded-full bg-neutral-400"
            animate={{ y: [-4, 0, -4] }}
            transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut', delay: 0.15 }}
          />
          <motion.div
            className="w-2 h-2 rounded-full bg-neutral-400"
            animate={{ y: [-4, 0, -4] }}
            transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
          />
        </div>
      </div>
    </motion.div>
  );
}
