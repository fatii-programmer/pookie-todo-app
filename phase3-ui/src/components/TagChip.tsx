'use client';

import { motion } from 'framer-motion';
import { TAG_VARIANTS } from '@/types';

interface TagChipProps {
  tag: string;
  onRemove?: () => void;
  clickable?: boolean;
  onClick?: () => void;
}

export function TagChip({ tag, onRemove, clickable = false, onClick }: TagChipProps) {
  const variant = TAG_VARIANTS[tag.toLowerCase()] || TAG_VARIANTS.default;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className={`
        inline-flex items-center gap-1.5 px-3 py-1 rounded-full
        text-xs font-medium border
        ${clickable || onClick ? 'cursor-pointer hover:scale-105 active:scale-95' : ''}
        transition-transform duration-200
      `}
      style={{
        backgroundColor: variant.background,
        color: variant.color,
        borderColor: variant.border,
      }}
      onClick={onClick}
    >
      <span>#</span>
      <span>{tag}</span>

      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 opacity-70 hover:opacity-100 hover:scale-125 transition-all duration-200"
          aria-label={`Remove ${tag} tag`}
        >
          ×
        </button>
      )}
    </motion.div>
  );
}
