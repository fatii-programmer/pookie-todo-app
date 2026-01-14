'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from '@/components/Sidebar';
import { ChatPanel } from '@/components/ChatPanel';
import { TaskCard } from '@/components/TaskCard';
import { AddTaskModal } from '@/components/AddTaskModal';
import type { Task } from '@/types';

const mockTasks: Task[] = [
  {
    id: 1,
    description: 'Buy groceries for dinner',
    completed: false,
    createdAt: new Date('2025-12-30'),
    priority: 'high',
    tags: ['shopping', 'personal'],
    dueDate: new Date('2025-12-31T18:00:00'),
  },
  {
    id: 2,
    description: 'Finish project report',
    completed: false,
    createdAt: new Date('2025-12-29'),
    priority: 'medium',
    tags: ['work'],
    dueDate: new Date('2026-01-02T17:00:00'),
  },
  {
    id: 3,
    description: 'Call dentist for appointment',
    completed: true,
    createdAt: new Date('2025-12-28'),
    priority: 'low',
    tags: ['personal'],
    dueDate: null,
  },
];

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleToggle = (id: number) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)));
  };

  const handleDelete = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleAddTask = (newTask: {
    description: string;
    priority: 'high' | 'medium' | 'low';
    dueDate: string | null;
    tags: string[];
  }) => {
    const task: Task = {
      id: Math.max(...tasks.map((t) => t.id), 0) + 1,
      description: newTask.description,
      completed: false,
      createdAt: new Date(),
      priority: newTask.priority,
      tags: newTask.tags,
      dueDate: newTask.dueDate ? new Date(newTask.dueDate) : null,
    };
    setTasks([task, ...tasks]);
  };

  const activeTasks = tasks.filter((t) => !t.completed);
  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="min-h-screen bg-pookie-gradient flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 min-h-screen pb-32">
        {/* Header */}
        <header className="sticky top-0 z-20 glass-strong border-b border-white/30 px-4 md:px-8 py-4 md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl md:text-3xl font-display font-semibold text-neutral-900">
              Today's Tasks
            </h1>
            <div className="bg-lavender-100 text-lavender-700 px-4 py-2 rounded-full text-sm font-medium">
              {activeTasks.length} tasks • {completedCount} done
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden w-10 h-10 rounded-full glass flex items-center justify-center"
            aria-label="Menu"
          >
            ☰
          </button>
        </header>

        {/* Content Area */}
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          {activeTasks.length === 0 ? (
            <EmptyState onAddTask={() => setIsAddModalOpen(true)} />
          ) : (
            <motion.div
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {activeTasks.map((task) => (
                <motion.div
                  key={task.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 },
                  }}
                >
                  <TaskCard task={task} onToggle={handleToggle} onDelete={handleDelete} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Floating Add Button */}
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 400, damping: 20 }}
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAddModalOpen(true)}
          className="fixed bottom-32 right-8 w-16 h-16 md:bottom-8
            bg-btn-primary-gradient rounded-full shadow-xl shadow-lavender
            flex items-center justify-center text-white text-3xl
            hover:shadow-2xl transition-shadow duration-200
            z-20"
          aria-label="Add new task"
        >
          +
        </motion.button>
      </main>

      {/* Chat Panel */}
      <ChatPanel />

      {/* Add Task Modal */}
      <AddTaskModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSubmit={handleAddTask} />
    </div>
  );
}

function EmptyState({ onAddTask }: { onAddTask: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20"
    >
      <div className="text-8xl mb-6">🎉</div>
      <h2 className="text-2xl font-semibold text-neutral-900 mb-2">All caught up!</h2>
      <p className="text-neutral-500 mb-8">No tasks for today</p>
      <button
        onClick={onAddTask}
        className="px-8 py-4 bg-btn-primary-gradient text-white rounded-xl
          font-medium shadow-lg shadow-lavender/30 hover:scale-105
          active:scale-95 transition-transform duration-200"
      >
        Add your first task
      </button>
    </motion.div>
  );
}
