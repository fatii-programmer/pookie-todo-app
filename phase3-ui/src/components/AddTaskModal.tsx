'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import type { Priority } from '@/types';
import { TagChip } from './TagChip';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: {
    description: string;
    priority: Priority;
    dueDate: string | null;
    tags: string[];
  }) => void;
}

export function AddTaskModal({ isOpen, onClose, onSubmit }: AddTaskModalProps) {
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  const handleSubmit = () => {
    if (!description.trim()) return;

    onSubmit({
      description: description.trim(),
      priority,
      dueDate: dueDate || null,
      tags,
    });

    setDescription('');
    setPriority('medium');
    setDueDate('');
    setTags([]);
    onClose();
  };

  const handleAddTag = () => {
    const trimmedTag = newTag.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
              className="relative w-full max-w-[560px] bg-white/95 backdrop-blur-2xl
                border border-white/60 rounded-3xl p-8 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 rounded-full
                  hover:bg-neutral-100 transition-colors duration-200
                  flex items-center justify-center text-neutral-500 hover:text-neutral-700"
                aria-label="Close modal"
              >
                <span className="text-2xl">×</span>
              </button>

              {/* Header */}
              <h2 className="text-2xl font-semibold text-neutral-900 text-center mb-6">
                Add New Task ✨
              </h2>

              {/* Description Input */}
              <div className="mb-6">
                <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-2">
                  What do you need to do?
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g., Buy groceries for dinner"
                  className="w-full px-4 py-3 bg-white border-2 border-neutral-200
                    focus:border-lavender-500 rounded-xl min-h-[80px] resize-none
                    text-base transition-colors duration-200 outline-none"
                  autoFocus
                />
              </div>

              {/* Priority Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-neutral-700 mb-3">Priority:</label>
                <div className="flex gap-4">
                  {(['high', 'medium', 'low'] as Priority[]).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPriority(p)}
                      className="flex items-center gap-2 group"
                    >
                      <div
                        className={`
                          w-5 h-5 rounded-full border-2 flex items-center justify-center
                          transition-all duration-200
                          ${
                            priority === p
                              ? p === 'high'
                                ? 'bg-rose-500 border-rose-500'
                                : p === 'medium'
                                ? 'bg-peach-500 border-peach-500'
                                : 'bg-mint-500 border-mint-500'
                              : 'border-neutral-300'
                          }
                        `}
                      >
                        {priority === p && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                      <span className="text-sm capitalize group-hover:text-lavender-700 transition-colors">
                        {p}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Due Date Input */}
              <div className="mb-6">
                <label htmlFor="dueDate" className="block text-sm font-medium text-neutral-700 mb-2">
                  Due Date:
                </label>
                <input
                  id="dueDate"
                  type="datetime-local"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-neutral-200
                    focus:border-lavender-500 rounded-xl text-base
                    transition-colors duration-200 outline-none"
                />
              </div>

              {/* Tags Section */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-neutral-700 mb-2">Tags:</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {tags.map((tag) => (
                    <TagChip key={tag} tag={tag} onRemove={() => handleRemoveTag(tag)} />
                  ))}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      placeholder="Add tag..."
                      className="px-3 py-1 text-xs border-2 border-dashed border-neutral-300
                        rounded-full outline-none focus:border-lavender-400"
                    />
                    <button
                      onClick={handleAddTag}
                      className="px-3 py-1 text-xs font-medium text-lavender-700
                        border-2 border-dashed border-lavender-300 rounded-full
                        hover:bg-lavender-50 transition-colors duration-200"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-between gap-4">
                <button
                  onClick={onClose}
                  className="px-6 py-3 text-neutral-700 rounded-xl
                    hover:bg-neutral-100 transition-colors duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!description.trim()}
                  className="px-8 py-3 bg-btn-primary-gradient text-white rounded-xl
                    font-medium shadow-lg shadow-lavender/30 hover:scale-105
                    active:scale-95 transition-transform duration-200
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  Create Task
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
