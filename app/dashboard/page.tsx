'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Task } from '@/types'

export default function DashboardPage(): JSX.Element {
  const router = useRouter()
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

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
      router.refresh()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-display font-bold text-white">
              pookie todo
            </h1>
            <p className="text-gray-400 mt-1">
              your tasks, organized with love
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => router.push('/analytics')}
              className="px-4 py-2 text-sm bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-md hover:from-pink-600 hover:to-purple-700 transition-default font-semibold"
            >
              📊 Analytics
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm bg-white text-black rounded-md hover:bg-gray-200 transition-default"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Add Task Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6">
          <form onSubmit={handleAddTask} className="space-y-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Add a new task..."
                className="flex-1 h-12 px-4 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-default text-black"
              />
              <button
                type="submit"
                disabled={!newTask.trim() || creating}
                className="px-6 h-12 bg-pink-500 text-white font-semibold rounded-md hover:bg-pink-600 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed transition-default"
              >
                {creating ? 'Adding...' : 'Add'}
              </button>
            </div>

            {/* Additional fields: Priority, Deadline, Category */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Priority</label>
                <select
                  value={newTaskPriority}
                  onChange={(e) => setNewTaskPriority(e.target.value as 'low' | 'normal' | 'high' | 'critical')}
                  className="w-full h-10 px-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 transition-default text-black"
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Deadline</label>
                <input
                  type="date"
                  value={newTaskDeadline}
                  onChange={(e) => setNewTaskDeadline(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 transition-default text-black"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Category</label>
                <input
                  type="text"
                  value={newTaskCategory}
                  onChange={(e) => setNewTaskCategory(e.target.value)}
                  placeholder="e.g., Work, Personal"
                  className="w-full h-10 px-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 transition-default text-black"
                />
              </div>
            </div>
          </form>
        </div>

        {/* Search and Filter Controls */}
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tasks..."
              className="flex-1 h-10 px-4 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 transition-default text-black"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-4 h-10 rounded-md font-medium transition-default ${
                  filterStatus === 'all'
                    ? 'bg-pink-500 text-white'
                    : 'bg-gray-100 text-black hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterStatus('pending')}
                className={`px-4 h-10 rounded-md font-medium transition-default ${
                  filterStatus === 'pending'
                    ? 'bg-pink-500 text-white'
                    : 'bg-gray-100 text-black hover:bg-gray-200'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilterStatus('completed')}
                className={`px-4 h-10 rounded-md font-medium transition-default ${
                  filterStatus === 'completed'
                    ? 'bg-pink-500 text-white'
                    : 'bg-gray-100 text-black hover:bg-gray-200'
                }`}
              >
                Completed
              </button>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        {tasks.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-700">
                {tasks.filter(t => t.completed).length} of {tasks.length} completed
              </span>
              <span className="text-sm font-semibold text-pink-500">
                {Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-pink-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(tasks.filter(t => t.completed).length / tasks.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Task List */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredTasks.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-xl shadow-lg p-12 text-center"
              >
                <div className="text-6xl mb-4">✨</div>
                <h3 className="text-xl font-display font-semibold text-black mb-2">
                  {tasks.length === 0 ? 'No tasks yet' : 'No tasks found'}
                </h3>
                <p className="text-gray-600">
                  {tasks.length === 0 ? 'Add your first task to get started' : 'Try adjusting your filters'}
                </p>
              </motion.div>
            ) : (
              filteredTasks.map((task, index) => {
                const isEditing = editingTask?.id === task.id
                const isDeleteConfirm = deleteConfirmId === task.id

                return (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-default"
                  >
                    <div className="flex items-start gap-4">
                      <button
                        onClick={() => handleToggleComplete(task)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-default mt-1 ${
                          task.completed
                            ? 'bg-pink-500 border-pink-500'
                            : 'border-gray-300 hover:border-pink-500'
                        }`}
                      >
                        {task.completed && (
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editingTask.description}
                            onChange={(e) =>
                              setEditingTask({ ...editingTask, description: e.target.value })
                            }
                            className="w-full px-3 py-1 bg-white border border-pink-500 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-black"
                          />
                        ) : (
                          <p
                            className={`font-medium ${
                              task.completed ? 'line-through text-gray-400' : 'text-black'
                            }`}
                          >
                            {task.description}
                          </p>
                        )}

                        <div className="flex flex-wrap gap-2 mt-2">
                          {/* Priority Badge */}
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-medium ${
                              task.priority === 'critical'
                                ? 'bg-purple-100 text-purple-700'
                                : task.priority === 'high'
                                ? 'bg-red-100 text-red-700'
                                : task.priority === 'normal'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-green-100 text-green-700'
                            }`}
                          >
                            {task.priority}
                          </span>

                          {/* Category Tags */}
                          {task.tags && task.tags.length > 0 && (
                            task.tags.map((tag, i) => (
                              <span
                                key={i}
                                className="text-xs px-2 py-1 rounded-full bg-pink-100 text-pink-700 font-medium"
                              >
                                {tag}
                              </span>
                            ))
                          )}

                          {/* Due Date */}
                          {task.dueDate && (
                            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-black font-medium">
                              📅 {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {/* Edit Button */}
                        <button
                          onClick={() => handleEditTask(task)}
                          className={`p-2 rounded-md transition-default ${
                            isEditing
                              ? 'bg-pink-500 text-white'
                              : 'text-pink-500 hover:bg-pink-50'
                          }`}
                          title={isEditing ? 'Save' : 'Edit'}
                        >
                          {isEditing ? (
                            <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                              <path d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                              <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          )}
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className={`p-2 rounded-md transition-default ${
                            isDeleteConfirm
                              ? 'bg-red-500 text-white'
                              : 'text-red-500 hover:bg-red-50'
                          }`}
                          title={isDeleteConfirm ? 'Click again to confirm' : 'Delete'}
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Delete Confirmation Message */}
                    {isDeleteConfirm && (
                      <div className="mt-2 text-sm text-red-500 font-medium">
                        Click delete again to confirm
                      </div>
                    )}
                  </motion.div>
                )
              })
            )}
          </AnimatePresence>
        </div>

      </div>

    </div>
  )
}
