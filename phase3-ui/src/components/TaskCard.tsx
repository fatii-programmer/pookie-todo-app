'use client';

import { motion } from 'framer-motion';
import { format, isPast, isToday, isTomorrow, differenceInHours } from 'date-fns';
import { useState } from 'react';
import type { Task } from '@/types';
import { PriorityBadge } from './PriorityBadge';
import { TagChip } from './TagChip';

interface TaskCardProps {
  task: Task;
  onToggle?: (id: number) => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export function TaskCard({ task, onToggle, onEdit, onDelete }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  const getDueDateDisplay = () => {
    if (!task.dueDate) return null;

    const dueDate = new Date(task.dueDate);
    const isOverdue = isPast(dueDate) && !isToday(dueDate);

    if (isOverdue) {
      return (
        <span className="text-rose-500 font-medium">
          ⚠️ Overdue - {format(dueDate, 'MMM d, h:mm a')}
        </span>
      );
    }

    if (isToday(dueDate)) {
      return (
        <span className="text-peach-500 font-medium">
          Today at {format(dueDate, 'h:mm a')}
        </span>
      );
    }

    if (isTomorrow(dueDate)) {
      return (
        <span className="text-mint-500 font-medium">
          Tomorrow at {format(dueDate, 'h:mm a')}
        </span>
      );
    }

    const hoursUntil = differenceInHours(dueDate, new Date());
    if (hoursUntil < 24) {
      return (
        <span className="text-mint-500 font-medium">
          {format(dueDate, 'h:mm a')} ({hoursUntil}h)
        </span>
      );
    }

    return <span>{format(dueDate, 'MMM d, h:mm a')}</span>;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.4, ease: [0, 0, 0.2, 1] }}
      className={`
        relative glass p-6 rounded-2xl shadow-md cursor-pointer
        transition-all duration-300
        hover:scale-[1.02] hover:shadow-lg hover:shadow-lavender/20
        hover:border-lavender-200 hover:-translate-y-1
        ${task.completed ? 'opacity-60 border-mint-300' : ''}
        ${isEditing ? 'border-lavender-500 border-2 shadow-xl shadow-lavender/40 scale-[1.02]' : ''}
        group
      `}
    >
      {/* Priority Indicator Dot */}
      <div
        className={`
          absolute -left-1.5 top-6 w-3 h-3 rounded-full
          ${task.priority === 'high' ? 'bg-rose-500 shadow-rose' : ''}
          ${task.priority === 'medium' ? 'bg-peach-500 shadow-peach' : ''}
          ${task.priority === 'low' ? 'bg-mint-500 shadow-mint' : ''}
        `}
      />

      {/* Main Content */}
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <motion.button
          onClick={() => onToggle?.(task.id)}
          className={`
            flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center
            transition-all duration-200 hover:scale-110
            ${task.completed ? 'bg-lavender-500 border-lavender-500' : 'border-neutral-300'}
          `}
          whileTap={{ scale: 0.8 }}
          aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {task.completed && (
            <motion.svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <motion.path
                d="M3 8L6 11L13 4"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
          )}
        </motion.button>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <h3
            className={`
              text-lg font-medium text-neutral-900 mb-1
              ${task.completed ? 'line-through' : ''}
              line-clamp-2
            `}
          >
            {task.description}
          </h3>

          {/* Due Date */}
          {task.dueDate && (
            <div className="flex items-center gap-1.5 text-sm text-neutral-500 mb-2">
              <span>📅</span>
              {getDueDateDisplay()}
            </div>
          )}

          {/* Tags */}
          {task.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {task.tags.map((tag) => (
                <TagChip key={tag} tag={tag} />
              ))}
            </div>
          )}
        </div>

        {/* Priority Badge (Top Right) */}
        <PriorityBadge priority={task.priority} />
      </div>

      {/* Action Buttons */}
      <div
        className={`
          flex items-center gap-2 mt-4 pt-4 border-t border-neutral-200
          ${isEditing ? 'opacity-100' : 'opacity-0 md:group-hover:opacity-100'}
          transition-opacity duration-200
        `}
      >
        <button
          onClick={() => {
            setIsEditing(!isEditing);
            onEdit?.(task.id);
          }}
          className="px-3 py-1.5 text-sm font-medium text-lavender-700 rounded-lg
            hover:bg-lavender-50 transition-colors duration-200"
          aria-label="Edit task"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete?.(task.id)}
          className="px-3 py-1.5 text-sm font-medium text-rose-600 rounded-lg
            hover:bg-rose-50 transition-colors duration-200"
          aria-label="Delete task"
        >
          Delete
        </button>
      </div>
    </motion.div>
  );
}
