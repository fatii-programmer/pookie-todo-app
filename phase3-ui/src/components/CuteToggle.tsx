'use client';

import { motion } from 'framer-motion';

interface CuteToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export function CuteToggle({ checked, onChange, label, disabled = false }: CuteToggleProps) {
  return (
    <div className="flex items-center gap-3">
      <motion.button
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className={`
          relative w-14 h-8 rounded-full border-2 border-transparent
          transition-all duration-300 cursor-pointer
          focus:outline-none focus:ring-2 focus:ring-lavender-500 focus:ring-offset-2
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${checked ? 'bg-gradient-to-r from-lavender-400 to-mint-400' : 'bg-neutral-200'}
        `}
        whileHover={!disabled ? { scale: 1.05 } : {}}
        whileTap={!disabled ? { scale: 0.95 } : {}}
        aria-label={label || 'Toggle'}
        role="switch"
        aria-checked={checked}
      >
        <motion.div
          className={`
            absolute top-0.5 w-7 h-7 rounded-full bg-white shadow-md
          `}
          layout
          transition={{
            type: 'spring',
            stiffness: 700,
            damping: 30,
          }}
          style={{
            left: checked ? 'calc(100% - 28px - 2px)' : '2px',
            boxShadow: checked ? '0 4px 12px rgba(168, 126, 255, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.1)',
          }}
        />
      </motion.button>

      {label && (
        <span
          className={`
            text-sm font-medium transition-colors duration-200
            ${checked ? 'text-lavender-700' : 'text-neutral-700'}
          `}
        >
          {label}
        </span>
      )}
    </div>
  );
}
