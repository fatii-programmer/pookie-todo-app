'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ProductivityStats } from '@/lib/analytics'

export default function AnalyticsPage(): JSX.Element {
  const router = useRouter()
  const [stats, setStats] = useState<ProductivityStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/analytics')
      if (res.status === 401) {
        router.push('/login')
        return
      }
      const data = await res.json()
      setStats(data.stats)
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (ms: number | null): string => {
    if (!ms) return 'N/A'
    const hours = Math.floor(ms / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)
    if (days > 0) return `${days}d ${hours % 24}h`
    if (hours > 0) return `${hours}h`
    const minutes = Math.floor(ms / (1000 * 60))
    return `${minutes}m`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg">Loading analytics...</div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg">Failed to load analytics</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-display font-bold text-white">
              Productivity Analytics
            </h1>
            <p className="text-gray-400 mt-1">
              Track your progress and boost your productivity
            </p>
          </div>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 text-sm bg-white text-black rounded-md hover:bg-gray-200 transition-default"
          >
            Back to Dashboard
          </button>
        </header>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl p-6 text-white"
          >
            <div className="text-sm opacity-90 mb-2">Total Tasks</div>
            <div className="text-4xl font-bold">{stats.totalTasks}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white"
          >
            <div className="text-sm opacity-90 mb-2">Completed</div>
            <div className="text-4xl font-bold">{stats.completedTasks}</div>
            <div className="text-sm opacity-75 mt-2">
              {stats.completionRate.toFixed(1)}% completion rate
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-6 text-white"
          >
            <div className="text-sm opacity-90 mb-2">Current Streak</div>
            <div className="text-4xl font-bold">{stats.currentStreak}</div>
            <div className="text-sm opacity-75 mt-2">
              Longest: {stats.longestStreak} days
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl p-6 text-white"
          >
            <div className="text-sm opacity-90 mb-2">Avg Completion</div>
            <div className="text-4xl font-bold">{formatTime(stats.averageCompletionTime)}</div>
          </motion.div>
        </div>

        {/* Time Period Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl p-6"
          >
            <h3 className="text-xl font-bold text-black mb-4">Today</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Created</span>
                <span className="font-semibold text-black">{stats.tasksCreatedToday}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Completed</span>
                <span className="font-semibold text-green-600">{stats.tasksCompletedToday}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl p-6"
          >
            <h3 className="text-xl font-bold text-black mb-4">This Week</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Created</span>
                <span className="font-semibold text-black">{stats.tasksCreatedThisWeek}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Completed</span>
                <span className="font-semibold text-green-600">{stats.tasksCompletedThisWeek}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl p-6"
          >
            <h3 className="text-xl font-bold text-black mb-4">This Month</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Created</span>
                <span className="font-semibold text-black">{stats.tasksCreatedThisMonth}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Completed</span>
                <span className="font-semibold text-green-600">{stats.tasksCompletedThisMonth}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Priority Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-xl p-6 mb-8"
        >
          <h3 className="text-xl font-bold text-black mb-4">Priority Distribution</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-700">{stats.priorityDistribution.low}</div>
              <div className="text-sm text-gray-600 mt-1">Low</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-3xl font-bold text-yellow-700">{stats.priorityDistribution.normal}</div>
              <div className="text-sm text-gray-600 mt-1">Normal</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-3xl font-bold text-red-700">{stats.priorityDistribution.high}</div>
              <div className="text-sm text-gray-600 mt-1">High</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-700">{stats.priorityDistribution.critical}</div>
              <div className="text-sm text-gray-600 mt-1">Critical</div>
            </div>
          </div>
        </motion.div>

        {/* Completions by Day */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-xl p-6 mb-8"
        >
          <h3 className="text-xl font-bold text-black mb-4">Most Productive Days</h3>
          <div className="space-y-3">
            {stats.completionsByDay
              .sort((a, b) => b.count - a.count)
              .map((day, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-24 text-gray-600">{day.day}</div>
                  <div className="flex-1 bg-gray-100 rounded-full h-8 relative overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-pink-500 to-purple-600 h-full rounded-full flex items-center justify-end px-3 text-white text-sm font-semibold transition-all"
                      style={{
                        width: `${Math.max((day.count / Math.max(...stats.completionsByDay.map(d => d.count))) * 100, 5)}%`
                      }}
                    >
                      {day.count > 0 && day.count}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </motion.div>

        {/* Category Stats */}
        {Object.keys(stats.categoryStats).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-white rounded-xl p-6 mb-8"
          >
            <h3 className="text-xl font-bold text-black mb-4">Tasks by Category</h3>
            <div className="flex flex-wrap gap-3">
              {Object.entries(stats.categoryStats)
                .sort(([, a], [, b]) => b - a)
                .map(([category, count], i) => (
                  <div
                    key={i}
                    className="px-4 py-2 bg-pink-100 text-pink-700 rounded-full font-medium"
                  >
                    {category}: {count}
                  </div>
                ))}
            </div>
          </motion.div>
        )}

        {/* Productivity Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-white rounded-xl p-6 mb-8"
        >
          <h3 className="text-xl font-bold text-black mb-4">30-Day Productivity Trend</h3>
          <div className="h-64 flex items-end gap-1">
            {stats.productivityTrend.slice(-30).map((day, i) => {
              const maxValue = Math.max(
                ...stats.productivityTrend.map(d => Math.max(d.created, d.completed))
              )
              const createdHeight = maxValue > 0 ? (day.created / maxValue) * 100 : 0
              const completedHeight = maxValue > 0 ? (day.completed / maxValue) * 100 : 0

              return (
                <div key={i} className="flex-1 flex flex-col justify-end gap-1 min-w-0" title={day.date}>
                  <div
                    className="bg-blue-500 rounded-t transition-all hover:bg-blue-600"
                    style={{ height: `${createdHeight}%`, minHeight: day.created > 0 ? '4px' : '0' }}
                  />
                  <div
                    className="bg-green-500 rounded-t transition-all hover:bg-green-600"
                    style={{ height: `${completedHeight}%`, minHeight: day.completed > 0 ? '4px' : '0' }}
                  />
                </div>
              )
            })}
          </div>
          <div className="flex gap-6 mt-4 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded" />
              <span className="text-sm text-gray-600">Created</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded" />
              <span className="text-sm text-gray-600">Completed</span>
            </div>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="bg-white rounded-xl p-6"
        >
          <h3 className="text-xl font-bold text-black mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {stats.recentActivity.map((activity, i) => (
              <div key={i} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
                <div className="text-xs text-gray-500 w-32 flex-shrink-0">{activity.date}</div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-black capitalize">{activity.action}</div>
                  <div className="text-sm text-gray-600">{activity.description}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
