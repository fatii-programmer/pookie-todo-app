'use client';

import { motion } from 'framer-motion';
import type { Priority } from '@/types';

interface PriorityBadgeProps {
  priority: Priority;
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const config = {
    high: {
      gradient: 'bg-priority-high-gradient',
      text: 'text-white',
      shadow: 'shadow-rose',
      emoji: '🔴',
      label: 'High',
    },
    medium: {
      gradient: 'bg-priority-medium-gradient',
      text: 'text-[#A0522D]',
      shadow: 'shadow-peach',
      emoji: '🟠',
      label: 'Medium',
    },
    low: {
      gradient: 'bg-priority-low-gradient',
      text: 'text-[#00846A]',
      shadow: 'shadow-mint',
      emoji: '🟢',
      label: 'Low',
    },
  };

  const { gradient, text, shadow, emoji, label } = config[priority];

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className={`
        inline-flex items-center gap-1.5
        px-3 py-1.5 rounded-full
        ${gradient} ${text} ${shadow}
        text-xs font-semibold uppercase tracking-wider
      `}
    >
      <span className="text-sm">{emoji}</span>
      <span>{label}</span>
    </motion.div>
  );
}
