'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Task } from '@/types'
import Header from '@/components/Header'
import { DashboardSkeleton } from '@/components/LoadingSkeleton'
import { useMounted } from '@/hooks/useMounted'

export default function DashboardPage(): JSX.Element {
  const router = useRouter()
  const mounted = useMounted()
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState('')
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'normal' | 'high' | 'critical'>('normal')
  const [newTaskDeadline, setNewTaskDeadline] = useState('')
  const [newTaskCategory, setNewTaskCategory] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'pending'>('all')
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('pookie-tasks')
    if (savedTasks) {
      try {
        const parsed = JSON.parse(savedTasks)
        setTasks(parsed)
        setLoading(false)
      } catch (error) {
        console.error('Failed to parse saved tasks:', error)
      }
    }
    fetchTasks()
  }, [])

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (tasks.length >= 0 && !loading) {
      localStorage.setItem('pookie-tasks', JSON.stringify(tasks))
    }
  }, [tasks, loading])

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/todos')
      if (res.status === 401) {
        router.push('/login')
        return
      }
      const data = await res.json()
      setTasks(data.tasks || [])
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTask.trim() || creating) return

    setCreating(true)
    try {
      const taskData = {
        description: newTask.trim(),
        priority: newTaskPriority,
        tags: newTaskCategory.trim() ? [newTaskCategory.trim()] : [],
        due_date: newTaskDeadline || null,
      }

      const res = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      })

      if (res.ok) {
        const data = await res.json()
        setTasks([...tasks, data.task])
        // Reset form fields
        setNewTask('')
        setNewTaskPriority('normal')
        setNewTaskDeadline('')
        setNewTaskCategory('')
      }
    } catch (error) {
      console.error('Failed to create task:', error)
    } finally {
      setCreating(false)
    }
  }

  const handleToggleComplete = async (task: Task) => {
    try {
      const res = await fetch(`/api/todos/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !task.completed }),
      })

      if (res.ok) {
        const data = await res.json()
        setTasks(tasks.map(t => t.id === task.id ? data.task : t))
      }
    } catch (error) {
      console.error('Failed to toggle task:', error)
    }
  }

  const handleDeleteTask = async (taskId: number) => {
    // Only delete if confirmed
    if (deleteConfirmId !== taskId) {
      setDeleteConfirmId(taskId)
      return
    }

    try {
      const res = await fetch(`/api/todos/${taskId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setTasks(tasks.filter(t => t.id !== taskId))
        setDeleteConfirmId(null)
      }
    } catch (error) {
      console.error('Failed to delete task:', error)
    }
  }

  const handleEditTask = async (task: Task) => {
    if (!editingTask || editingTask.id !== task.id) {
      setEditingTask(task)
      return
    }

    try {
      const res = await fetch(`/api/todos/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: editingTask.description,
          priority: editingTask.priority,
          tags: editingTask.tags,
          due_date: editingTask.dueDate,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        setTasks(tasks.map(t => t.id === task.id ? data.task : t))
        setEditingTask(null)
      }
    } catch (error) {
      console.error('Failed to update task:', error)
    }
  }

  // Filter and search tasks
  const filteredTasks = tasks.filter(task => {
    // Filter by status
    if (filterStatus === 'completed' && !task.completed) return false
    if (filterStatus === 'pending' && task.completed) return false

    // Filter by search term
    if (searchTerm && !task.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false
    }

    return true
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header
          title="Dashboard"
          subtitle="your tasks, organized with love"
          onSearch={setSearchTerm}
          searchPlaceholder="Search tasks..."
        />
        <DashboardSkeleton />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="min-h-screen bg-gray-50"
    >
      <Header
        title="Dashboard"
        subtitle="your tasks, organized with love"
        onSearch={setSearchTerm}
        searchPlaceholder="Search tasks..."
      />

      <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
        <div id="main-content" tabIndex={-1} className="sr-only">
          Main content
        </div>

        {/* Add Task Form */}
        <section aria-labelledby="add-task-heading" className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6 border border-gray-100">
          <h2 id="add-task-heading" className="sr-only">Add new task</h2>
          <form onSubmit={handleAddTask} aria-label="Create new task form" className="space-y-5">
            <div className="flex flex-col sm:flex-row gap-3">
              <label htmlFor="new-task-input" className="sr-only">Task description</label>
              <input
                id="new-task-input"
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Add a new task..."
                aria-label="Task description"
                aria-required="true"
                className="flex-1 h-14 px-5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 focus:bg-white hover:border-gray-300 transition-all duration-200 text-black text-base font-medium placeholder-gray-400"
              />
              <button
                type="submit"
                disabled={!newTask.trim() || creating}
                aria-label={creating ? 'Adding task' : 'Add task'}
                className="px-8 h-14 sm:min-w-[120px] bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-xl shadow-md hover:shadow-xl hover:from-pink-600 hover:to-purple-700 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md transition-all duration-200 text-base"
              >
                {creating ? 'Adding...' : 'Add Task'}
              </button>
            </div>

            {/* Additional fields: Priority, Deadline, Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="task-priority" className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
                <select
                  id="task-priority"
                  value={newTaskPriority}
                  onChange={(e) => setNewTaskPriority(e.target.value as 'low' | 'normal' | 'high' | 'critical')}
                  aria-label="Select task priority"
                  className="w-full h-12 px-4 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 focus:bg-white hover:border-gray-300 transition-all duration-200 text-black text-base font-medium cursor-pointer"
                >
                  <option value="low">🌱 Low</option>
                  <option value="normal">⭐ Normal</option>
                  <option value="high">⚡ High</option>
                  <option value="critical">🔥 Critical</option>
                </select>
              </div>

              <div>
                <label htmlFor="task-deadline" className="block text-sm font-semibold text-gray-700 mb-2">Deadline</label>
                <input
                  id="task-deadline"
                  type="date"
                  value={newTaskDeadline}
                  onChange={(e) => setNewTaskDeadline(e.target.value)}
                  aria-label="Select task deadline"
                  className="w-full h-12 px-4 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 focus:bg-white hover:border-gray-300 transition-all duration-200 text-black text-base font-medium cursor-pointer"
                />
              </div>

              <div className="sm:col-span-2 md:col-span-1">
                <label htmlFor="task-category" className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                <input
                  id="task-category"
                  type="text"
                  value={newTaskCategory}
                  onChange={(e) => setNewTaskCategory(e.target.value)}
                  placeholder="e.g., Work, Personal"
                  aria-label="Task category"
                  className="w-full h-12 px-4 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 focus:bg-white hover:border-gray-300 transition-all duration-200 text-black text-base font-medium placeholder-gray-400"
                />
              </div>
            </div>
          </form>
        </section>

        {/* Filter Controls */}
        <section aria-labelledby="filter-heading" className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
          <h2 id="filter-heading" className="sr-only">Filter tasks</h2>
          <div className="flex flex-col sm:flex-row gap-3" role="group" aria-label="Task filter options">
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => setFilterStatus('all')}
                aria-label="Show all tasks"
                aria-pressed={filterStatus === 'all'}
                className={`flex-1 sm:flex-none px-6 sm:px-8 h-12 rounded-xl font-bold transition-all duration-200 text-base shadow-sm ${
                  filterStatus === 'all'
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md active:scale-95 border border-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterStatus('pending')}
                aria-label="Show pending tasks only"
                aria-pressed={filterStatus === 'pending'}
                className={`flex-1 sm:flex-none px-6 sm:px-8 h-12 rounded-xl font-bold transition-all duration-200 text-base shadow-sm ${
                  filterStatus === 'pending'
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md active:scale-95 border border-gray-200'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilterStatus('completed')}
                aria-label="Show completed tasks only"
                aria-pressed={filterStatus === 'completed'}
                className={`flex-1 sm:flex-none px-6 sm:px-8 h-12 rounded-xl font-bold transition-all duration-200 text-base shadow-sm ${
                  filterStatus === 'completed'
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md active:scale-95 border border-gray-200'
                }`}
              >
                Completed
              </button>
            </div>
          </div>
        </section>

        {/* Progress Indicator */}
        {tasks.length > 0 && (
          <section aria-labelledby="progress-heading" className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl shadow-lg p-6 mb-6 border border-pink-100">
            <h2 id="progress-heading" className="sr-only">Task completion progress</h2>
            <div className="flex items-center justify-between mb-4">
              <span className="text-base font-semibold text-gray-800" aria-live="polite">
                {tasks.filter(t => t.completed).length} of {tasks.length} completed
              </span>
              <span className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent" aria-live="polite">
                {Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)}%
              </span>
            </div>
            <div
              className="w-full bg-white rounded-full h-4 shadow-inner border border-gray-200"
              role="progressbar"
              aria-valuenow={Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Task completion progress"
            >
              <div
                className="bg-gradient-to-r from-pink-500 to-purple-600 h-4 rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${(tasks.filter(t => t.completed).length / tasks.length) * 100}%` }}
              />
            </div>
          </section>
        )}

        {/* Task List */}
        <section aria-labelledby="tasks-heading">
          <h2 id="tasks-heading" className="sr-only">Your tasks</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5" role="list">
            <AnimatePresence mode="popLayout">
              {filteredTasks.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="col-span-full bg-white rounded-2xl shadow-lg p-12 text-center border-2 border-dashed border-gray-200"
              >
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 mb-4">
                    <svg className="w-12 h-12 text-pink-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-2xl font-display font-bold text-black mb-2">
                  {tasks.length === 0 ? 'No tasks yet — add a new one!' : 'No tasks found'}
                </h3>
                <p className="text-gray-500 text-lg">
                  {tasks.length === 0 ? 'Start organizing your day with your first task ✨' : 'Try adjusting your filters to see more tasks'}
                </p>
              </motion.div>
            ) : (
              filteredTasks.map((task, index) => {
                const isEditing = editingTask?.id === task.id
                const isDeleteConfirm = deleteConfirmId === task.id

                return (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -20 }}
                    transition={{
                      delay: index * 0.05,
                      layout: { duration: 0.3 }
                    }}
                    whileHover={{ y: -6, transition: { duration: 0.2 } }}
                    className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl p-6 border-2 border-gray-100 hover:border-pink-300 transition-all duration-300"
                  >
                    {/* Priority Indicator Bar */}
                    <div className={`absolute top-0 left-0 right-0 h-1.5 rounded-t-2xl shadow-sm ${
                      task.priority === 'critical'
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                        : task.priority === 'high'
                        ? 'bg-gradient-to-r from-red-500 to-orange-500'
                        : task.priority === 'normal'
                        ? 'bg-gradient-to-r from-yellow-400 to-yellow-500'
                        : 'bg-gradient-to-r from-green-400 to-emerald-500'
                    }`} />

                    <div className="flex items-start gap-3">
                      {/* Checkbox */}
                      <button
                        onClick={() => handleToggleComplete(task)}
                        aria-label={task.completed ? 'Mark task as incomplete' : 'Mark task as complete'}
                        aria-pressed={task.completed}
                        role="checkbox"
                        aria-checked={task.completed}
                        className={`w-8 h-8 rounded-full border-3 flex items-center justify-center flex-shrink-0 transition-all duration-300 mt-0.5 ${
                          task.completed
                            ? 'bg-gradient-to-br from-pink-500 to-purple-600 border-pink-500 shadow-lg scale-105'
                            : 'border-gray-300 hover:border-pink-500 hover:bg-pink-50 hover:scale-110 active:scale-95 shadow-sm'
                        }`}
                      >
                        {task.completed && (
                          <svg
                            className="w-5 h-5 text-white"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="3"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>

                      {/* Task Content */}
                      <div className="flex-1 min-w-0">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editingTask.description}
                            onChange={(e) =>
                              setEditingTask({ ...editingTask, description: e.target.value })
                            }
                            className="w-full px-3 py-2 bg-white border-2 border-pink-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-black font-medium"
                          />
                        ) : (
                          <h4
                            className={`font-bold text-lg mb-4 transition-colors ${
                              task.completed ? 'line-through text-gray-400' : 'text-gray-900 group-hover:text-pink-600'
                            }`}
                          >
                            {task.description}
                          </h4>
                        )}

                        {/* Badges Row */}
                        <div className="flex flex-wrap gap-2">
                          {/* Priority Badge */}
                          <span
                            className={`inline-flex items-center text-xs px-3 py-1.5 rounded-full font-bold shadow-sm ${
                              task.priority === 'critical'
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                                : task.priority === 'high'
                                ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white'
                                : task.priority === 'normal'
                                ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black'
                                : 'bg-gradient-to-r from-green-400 to-emerald-500 text-white'
                            }`}
                          >
                            <span className="mr-1">
                              {task.priority === 'critical' ? '🔥' : task.priority === 'high' ? '⚡' : task.priority === 'normal' ? '⭐' : '🌱'}
                            </span>
                            {task.priority}
                          </span>

                          {/* Category Tags */}
                          {task.tags && task.tags.length > 0 && (
                            task.tags.map((tag, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center text-xs px-3 py-1.5 rounded-full bg-pink-100 text-pink-700 font-semibold border border-pink-200"
                              >
                                #{tag}
                              </span>
                            ))
                          )}

                          {/* Due Date */}
                          {task.dueDate && (
                            <span className="inline-flex items-center text-xs px-3 py-1.5 rounded-full bg-black text-white font-semibold shadow-sm">
                              <svg className="w-3 h-3 mr-1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {mounted ? new Date(task.dueDate).toLocaleDateString() : new Date(task.dueDate).toISOString().split('T')[0]}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 mt-5 pt-5 border-t-2 border-gray-100" role="group" aria-label="Task actions">
                      <motion.button
                        onClick={() => handleEditTask(task)}
                        whileTap={{ scale: 0.95 }}
                        aria-label={isEditing ? 'Save task changes' : `Edit task: ${task.description}`}
                        className={`flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold transition-all duration-200 text-base min-h-[44px] shadow-sm ${
                          isEditing
                            ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg scale-105'
                            : 'bg-pink-50 text-pink-700 hover:bg-pink-100 hover:shadow-md border-2 border-pink-200 hover:border-pink-300'
                        }`}
                      >
                        {isEditing ? (
                          <>
                            <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                              <path d="M5 13l4 4L19 7" />
                            </svg>
                            Save
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                              <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </>
                        )}
                      </motion.button>

                      <motion.button
                        onClick={() => handleDeleteTask(task.id)}
                        whileTap={{ scale: 0.95 }}
                        aria-label={isDeleteConfirm ? 'Confirm delete task' : `Delete task: ${task.description}`}
                        className={`flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold transition-all duration-200 text-base min-h-[44px] shadow-sm ${
                          isDeleteConfirm
                            ? 'bg-red-500 text-white shadow-lg scale-105'
                            : 'bg-red-50 text-red-700 hover:bg-red-100 hover:shadow-md border-2 border-red-200 hover:border-red-300'
                        }`}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2.5"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        {isDeleteConfirm ? 'Confirm' : 'Delete'}
                      </motion.button>
                    </div>

                    {/* Delete Confirmation Message */}
                    {isDeleteConfirm && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4 p-4 bg-red-50 border-2 border-red-200 rounded-xl"
                      >
                        <p className="text-sm text-red-700 font-bold text-center">
                          ⚠️ Click delete again to confirm
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                )
              })
            )}
            </AnimatePresence>
          </div>
        </section>
      </div>
    </motion.div>
  )
}
