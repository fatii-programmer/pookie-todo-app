'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Header from '@/components/Header'
import { useMounted } from '@/hooks/useMounted'

interface ActivityEntry {
  id: string
  timestamp: string
  email: string
  action: 'signup' | 'login'
  provider: 'google' | 'credentials'
  userId?: string
  userAgent?: string
}

interface ActivityResponse {
  activities?: ActivityEntry[]
}

// eslint-disable-next-line max-lines-per-function
export default function AdminActivityPage(): JSX.Element {
  const router = useRouter()
  const mounted = useMounted()
  const [activities, setActivities] = useState<ActivityEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'login' | 'signup'>('all')

  const fetchActivities = useCallback(async (): Promise<void> => {
    try {
      const res = await fetch('/api/admin/activity')

      if (res.status === 401) {
        router.push('/login')
        return
      }

      if (res.status === 403) {
        setError('Access denied. Admin privileges required.')
        setLoading(false)
        return
      }

      if (!res.ok) {
        throw new Error('Failed to fetch activities')
      }

      const data: ActivityResponse = await res.json() as ActivityResponse
      setActivities(data.activities || [])
    } catch (err) {
      console.error('Failed to fetch activities:', err)
      setError('Failed to load activity log')
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    void fetchActivities()
  }, [fetchActivities])

  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const filteredActivities = activities.filter(activity => {
    if (filter === 'all') return true
    return activity.action === filter
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header
          title="Activity Log"
          subtitle="admin view"
          showSearch={false}
        />
        <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
              <span className="ml-3 text-gray-600 font-medium">Loading activity log...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header
          title="Activity Log"
          subtitle="admin view"
          showSearch={false}
        />
        <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-red-200">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h3>
              <p className="text-gray-600">{error}</p>
              <button
                onClick={() => router.push('/dashboard')}
                className="mt-6 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
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
        title="Activity Log"
        subtitle="admin view"
        showSearch={false}
      />

      <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
        {/* Filter Controls */}
        <section className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row gap-3" role="group" aria-label="Activity filter options">
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => setFilter('all')}
                aria-pressed={filter === 'all'}
                className={`flex-1 sm:flex-none px-6 sm:px-8 h-12 rounded-xl font-bold transition-all duration-200 text-base shadow-sm ${
                  filter === 'all'
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md active:scale-95 border border-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('login')}
                aria-pressed={filter === 'login'}
                className={`flex-1 sm:flex-none px-6 sm:px-8 h-12 rounded-xl font-bold transition-all duration-200 text-base shadow-sm ${
                  filter === 'login'
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md active:scale-95 border border-gray-200'
                }`}
              >
                Logins
              </button>
              <button
                onClick={() => setFilter('signup')}
                aria-pressed={filter === 'signup'}
                className={`flex-1 sm:flex-none px-6 sm:px-8 h-12 rounded-xl font-bold transition-all duration-200 text-base shadow-sm ${
                  filter === 'signup'
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md active:scale-95 border border-gray-200'
                }`}
              >
                Signups
              </button>
            </div>
          </div>
        </section>

        {/* Stats Summary */}
        <section className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl shadow-lg p-6 mb-6 border border-pink-100">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                {activities.length}
              </p>
              <p className="text-sm text-gray-600 font-medium">Total Activities</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {activities.filter(a => a.action === 'signup').length}
              </p>
              <p className="text-sm text-gray-600 font-medium">Signups</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {activities.filter(a => a.action === 'login').length}
              </p>
              <p className="text-sm text-gray-600 font-medium">Logins</p>
            </div>
          </div>
        </section>

        {/* Activity List */}
        <section className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
          </div>

          <div className="divide-y divide-gray-100">
            <AnimatePresence mode="popLayout">
              {filteredActivities.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-8 text-center"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-700 mb-1">No activities yet</h3>
                  <p className="text-gray-500">Activity will appear here when users sign up or log in</p>
                </motion.div>
              ) : (
                // eslint-disable-next-line max-lines-per-function
                filteredActivities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: index * 0.03 }}
                    className="p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {/* Icon */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        activity.action === 'signup'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-blue-100 text-blue-600'
                      }`}>
                        {activity.action === 'signup' ? (
                          <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                          </svg>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-gray-900 truncate">{activity.email}</span>
                          <span className={`inline-flex items-center text-xs px-2 py-1 rounded-full font-semibold ${
                            activity.action === 'signup'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {activity.action === 'signup' ? 'Signed up' : 'Logged in'}
                          </span>
                          <span className={`inline-flex items-center text-xs px-2 py-1 rounded-full font-semibold ${
                            activity.provider === 'google'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {activity.provider === 'google' ? 'Google' : 'Email'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {mounted ? formatTimestamp(activity.timestamp) : activity.timestamp}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </section>
      </div>
    </motion.div>
  )
}
