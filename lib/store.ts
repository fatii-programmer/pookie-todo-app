import { create } from 'zustand'
import { Task, ChatMessage } from '@/types'

interface TodoStore {
  tasks: Task[]
  setTasks: (tasks: Task[]) => void
  addTask: (task: Task) => void
  updateTask: (id: number, updates: Partial<Task>) => void
  deleteTask: (id: number) => void
  
  messages: ChatMessage[]
  addMessage: (message: ChatMessage) => void
  
  activeFilter: 'all' | 'today' | 'upcoming' | 'completed'
  setActiveFilter: (filter: 'all' | 'today' | 'upcoming' | 'completed') => void
}

export const useTodoStore = create<TodoStore>((set) => ({
  tasks: [],
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    })),
  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    })),
  
  messages: [],
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  
  activeFilter: 'all',
  setActiveFilter: (filter) => set({ activeFilter: filter }),
}))
