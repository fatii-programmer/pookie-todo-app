'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ProductivityStats } from '@/lib/analytics'
import Header from '@/components/Header'
import { AnalyticsSkeleton } from '@/components/LoadingSkeleton'

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
      <div className="min-h-screen bg-gray-50">
        <Header
          title="Analytics"
          subtitle="Track your progress and boost your productivity"
          showSearch={false}
        />
        <AnalyticsSkeleton />
      </div>
    )
  }

  if (!stats) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gray-50 flex items-center justify-center"
      >
        <div className="text-center">
          <div className="text-6xl mb-4">📊</div>
          <div className="text-black text-lg font-medium">Failed to load analytics</div>
          <p className="text-gray-500 mt-2">Please try refreshing the page</p>
        </div>
      </motion.div>
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
        title="Analytics"
        subtitle="Track your progress and boost your productivity"
        showSearch={false}
      />

      <main id="main-content" className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
        <h2 className="sr-only">Analytics Dashboard</h2>

        {/* Overview Cards */}
        <section aria-labelledby="overview-heading">
          <h3 id="overview-heading" className="sr-only">Overview Statistics</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-6 sm:mb-8" role="list">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.2 } }}
            className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl p-6 sm:p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 border border-pink-400"
            role="listitem"
            tabIndex={0}
            aria-label={`Total tasks: ${stats.totalTasks}`}
          >
            <div className="text-sm sm:text-base opacity-90 mb-3 font-semibold tracking-wide uppercase" aria-hidden="true">Total Tasks</div>
            <div className="text-4xl sm:text-5xl font-black" aria-hidden="true">{stats.totalTasks}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.2 } }}
            className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 sm:p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 border border-green-400"
            role="listitem"
            tabIndex={0}
            aria-label={`Completed tasks: ${stats.completedTasks}. Completion rate: ${stats.completionRate.toFixed(1)} percent`}
          >
            <div className="text-sm sm:text-base opacity-90 mb-3 font-semibold tracking-wide uppercase" aria-hidden="true">Completed</div>
            <div className="text-4xl sm:text-5xl font-black" aria-hidden="true">{stats.completedTasks}</div>
            <div className="text-sm opacity-90 mt-3 font-semibold" aria-hidden="true">
              {stats.completionRate.toFixed(1)}% completion rate
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.2 } }}
            className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 sm:p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 border border-blue-400"
            role="listitem"
            tabIndex={0}
            aria-label={`Current streak: ${stats.currentStreak} days. Longest streak: ${stats.longestStreak} days`}
          >
            <div className="text-sm sm:text-base opacity-90 mb-3 font-semibold tracking-wide uppercase" aria-hidden="true">Current Streak</div>
            <div className="text-4xl sm:text-5xl font-black" aria-hidden="true">{stats.currentStreak}</div>
            <div className="text-sm opacity-90 mt-3 font-semibold" aria-hidden="true">
              Longest: {stats.longestStreak} days
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.2 } }}
            className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 sm:p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 border border-orange-400"
            role="listitem"
            tabIndex={0}
            aria-label={`Average completion time: ${formatTime(stats.averageCompletionTime)}`}
          >
            <div className="text-sm sm:text-base opacity-90 mb-3 font-semibold tracking-wide uppercase" aria-hidden="true">Avg Completion</div>
            <div className="text-4xl sm:text-5xl font-black" aria-hidden="true">{formatTime(stats.averageCompletionTime)}</div>
          </motion.div>
        </div>
        </section>

        {/* Time Period Stats */}
        <section aria-labelledby="time-period-heading">
          <h3 id="time-period-heading" className="sr-only">Time Period Statistics</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-gray-100"
            role="article"
            aria-labelledby="today-heading"
          >
            <h4 id="today-heading" className="text-xl sm:text-2xl font-black text-gray-900 mb-6 tracking-tight">Today</h4>
            <div className="space-y-4" role="list">
              <div className="flex justify-between items-center py-3 border-b border-gray-100" role="listitem">
                <span className="text-base font-semibold text-gray-700">Created</span>
                <span className="text-2xl font-black text-gray-900" aria-label={`${stats.tasksCreatedToday} tasks created today`}>{stats.tasksCreatedToday}</span>
              </div>
              <div className="flex justify-between items-center py-3" role="listitem">
                <span className="text-base font-semibold text-gray-700">Completed</span>
                <span className="text-2xl font-black text-green-600" aria-label={`${stats.tasksCompletedToday} tasks completed today`}>{stats.tasksCompletedToday}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-gray-100"
            role="article"
            aria-labelledby="week-heading"
          >
            <h4 id="week-heading" className="text-xl sm:text-2xl font-black text-gray-900 mb-6 tracking-tight">This Week</h4>
            <div className="space-y-4" role="list">
              <div className="flex justify-between items-center py-3 border-b border-gray-100" role="listitem">
                <span className="text-base font-semibold text-gray-700">Created</span>
                <span className="text-2xl font-black text-gray-900" aria-label={`${stats.tasksCreatedThisWeek} tasks created this week`}>{stats.tasksCreatedThisWeek}</span>
              </div>
              <div className="flex justify-between items-center py-3" role="listitem">
                <span className="text-base font-semibold text-gray-700">Completed</span>
                <span className="text-2xl font-black text-green-600" aria-label={`${stats.tasksCompletedThisWeek} tasks completed this week`}>{stats.tasksCompletedThisWeek}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 sm:col-span-2 lg:col-span-1 border-2 border-gray-100"
            role="article"
            aria-labelledby="month-heading"
          >
            <h4 id="month-heading" className="text-xl sm:text-2xl font-black text-gray-900 mb-6 tracking-tight">This Month</h4>
            <div className="space-y-4" role="list">
              <div className="flex justify-between items-center py-3 border-b border-gray-100" role="listitem">
                <span className="text-base font-semibold text-gray-700">Created</span>
                <span className="text-2xl font-black text-gray-900" aria-label={`${stats.tasksCreatedThisMonth} tasks created this month`}>{stats.tasksCreatedThisMonth}</span>
              </div>
              <div className="flex justify-between items-center py-3" role="listitem">
                <span className="text-base font-semibold text-gray-700">Completed</span>
                <span className="text-2xl font-black text-green-600" aria-label={`${stats.tasksCompletedThisMonth} tasks completed this month`}>{stats.tasksCompletedThisMonth}</span>
              </div>
            </div>
          </motion.div>
        </div>
        </section>

        {/* Priority Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-2xl p-6 sm:p-8 mb-6 sm:mb-8 shadow-lg border-2 border-gray-100"
          role="region"
          aria-labelledby="priority-heading"
        >
          <h3 id="priority-heading" className="text-xl sm:text-2xl font-black text-gray-900 mb-6 sm:mb-8 tracking-tight">Priority Distribution</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4" role="list">
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-300 shadow-sm hover:shadow-md transition-all" role="listitem" tabIndex={0} aria-label={`Low priority: ${stats.priorityDistribution.low} tasks`}>
              <div className="text-3xl sm:text-4xl font-black text-green-700 mb-2" aria-hidden="true">{stats.priorityDistribution.low}</div>
              <div className="text-sm sm:text-base font-bold text-gray-700" aria-hidden="true">🌱 Low</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl border-2 border-yellow-300 shadow-sm hover:shadow-md transition-all" role="listitem" tabIndex={0} aria-label={`Normal priority: ${stats.priorityDistribution.normal} tasks`}>
              <div className="text-3xl sm:text-4xl font-black text-yellow-700 mb-2" aria-hidden="true">{stats.priorityDistribution.normal}</div>
              <div className="text-sm sm:text-base font-bold text-gray-700" aria-hidden="true">⭐ Normal</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl border-2 border-red-300 shadow-sm hover:shadow-md transition-all" role="listitem" tabIndex={0} aria-label={`High priority: ${stats.priorityDistribution.high} tasks`}>
              <div className="text-3xl sm:text-4xl font-black text-red-700 mb-2" aria-hidden="true">{stats.priorityDistribution.high}</div>
              <div className="text-sm sm:text-base font-bold text-gray-700" aria-hidden="true">⚡ High</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-300 shadow-sm hover:shadow-md transition-all" role="listitem" tabIndex={0} aria-label={`Critical priority: ${stats.priorityDistribution.critical} tasks`}>
              <div className="text-3xl sm:text-4xl font-black text-purple-700 mb-2" aria-hidden="true">{stats.priorityDistribution.critical}</div>
              <div className="text-sm sm:text-base font-bold text-gray-700" aria-hidden="true">🔥 Critical</div>
            </div>
          </div>
        </motion.div>

        {/* Completions by Day */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-xl p-5 sm:p-6 mb-6 sm:mb-8 shadow-md"
          role="region"
          aria-labelledby="productive-days-heading"
        >
          <h3 id="productive-days-heading" className="text-lg sm:text-xl font-bold text-black mb-4 sm:mb-6">Most Productive Days</h3>
          <div className="space-y-3" role="list">
            {stats.completionsByDay
              .sort((a, b) => b.count - a.count)
              .map((day, i) => (
                <div key={i} className="flex items-center gap-3" role="listitem">
                  <div className="w-24 text-gray-600">{day.day}</div>
                  <div className="flex-1 bg-gray-100 rounded-full h-8 relative overflow-hidden" role="progressbar" aria-valuenow={day.count} aria-valuemin={0} aria-valuemax={Math.max(...stats.completionsByDay.map(d => d.count))} aria-label={`${day.day}: ${day.count} tasks completed`}>
                    <div
                      className="bg-gradient-to-r from-pink-500 to-purple-600 h-full rounded-full flex items-center justify-end px-3 text-white text-sm font-semibold transition-all"
                      style={{
                        width: `${Math.max((day.count / Math.max(...stats.completionsByDay.map(d => d.count))) * 100, 5)}%`
                      }}
                      aria-hidden="true"
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
            className="bg-white rounded-xl p-5 sm:p-6 mb-6 sm:mb-8 shadow-md"
          >
            <h3 className="text-lg sm:text-xl font-bold text-black mb-4 sm:mb-6">Tasks by Category</h3>
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
          className="bg-white rounded-xl p-5 sm:p-6 mb-6 sm:mb-8 shadow-md"
          role="region"
          aria-labelledby="trend-heading"
        >
          <h3 id="trend-heading" className="text-lg sm:text-xl font-bold text-black mb-4 sm:mb-6">30-Day Productivity Trend</h3>
          <div className="h-64 flex items-end gap-1" role="img" aria-label="30-day productivity trend chart showing tasks created and completed each day">
            {stats.productivityTrend.slice(-30).map((day, i) => {
              const maxValue = Math.max(
                ...stats.productivityTrend.map(d => Math.max(d.created, d.completed))
              )
              const createdHeight = maxValue > 0 ? (day.created / maxValue) * 100 : 0
              const completedHeight = maxValue > 0 ? (day.completed / maxValue) * 100 : 0

              return (
                <div key={i} className="flex-1 flex flex-col justify-end gap-1 min-w-0" title={`${day.date}: ${day.created} created, ${day.completed} completed`} aria-label={`${day.date}: ${day.created} tasks created, ${day.completed} tasks completed`}>
                  <div
                    className="bg-blue-500 rounded-t transition-all hover:bg-blue-600"
                    style={{ height: `${createdHeight}%`, minHeight: day.created > 0 ? '4px' : '0' }}
                    aria-hidden="true"
                  />
                  <div
                    className="bg-green-500 rounded-t transition-all hover:bg-green-600"
                    style={{ height: `${completedHeight}%`, minHeight: day.completed > 0 ? '4px' : '0' }}
                    aria-hidden="true"
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
          className="bg-white rounded-xl p-5 sm:p-6 shadow-md"
          role="region"
          aria-labelledby="recent-activity-heading"
        >
          <h3 id="recent-activity-heading" className="text-lg sm:text-xl font-bold text-black mb-4 sm:mb-6">Recent Activity</h3>
          <div className="space-y-3" role="list">
            {stats.recentActivity.map((activity, i) => (
              <div key={i} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0" role="listitem">
                <time className="text-xs text-gray-500 w-32 flex-shrink-0" dateTime={activity.date}>{activity.date}</time>
                <div className="flex-1">
                  <div className="text-sm font-medium text-black capitalize">{activity.action}</div>
                  <div className="text-sm text-gray-600">{activity.description}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </motion.div>
  )
}
