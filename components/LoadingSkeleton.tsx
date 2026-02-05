import React from 'react'

interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string
  height?: string
  className?: string
}

export function Skeleton({
  variant = 'rectangular',
  width = '100%',
  height = '20px',
  className = ''
}: SkeletonProps) {
  const baseClasses = 'skeleton-shimmer'
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg'
  }

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={{ width, height }}
    />
  )
}

// Dashboard Task Card Skeleton
export function TaskCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100 animate-fade-in">
      <div className="flex items-start gap-3">
        <Skeleton variant="circular" width="28px" height="28px" />
        <div className="flex-1 space-y-3">
          <Skeleton height="20px" width="80%" />
          <div className="flex gap-2">
            <Skeleton height="28px" width="70px" className="rounded-full" />
            <Skeleton height="28px" width="60px" className="rounded-full" />
          </div>
        </div>
      </div>
      <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
        <Skeleton height="44px" className="flex-1" />
        <Skeleton height="44px" className="flex-1" />
      </div>
    </div>
  )
}

// Analytics Stat Card Skeleton
export function StatCardSkeleton() {
  return (
    <div className="bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl p-5 sm:p-6 shadow-lg animate-fade-in">
      <Skeleton height="16px" width="60%" className="mb-3 bg-gray-300" />
      <Skeleton height="36px" width="40%" className="bg-gray-300" />
    </div>
  )
}

// Dashboard Loading State
export function DashboardSkeleton() {
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8 animate-fade-in">
      {/* Add Task Form Skeleton */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-4 sm:mb-6">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Skeleton height="48px" className="flex-1" />
            <Skeleton height="48px" width="100px" className="sm:w-[100px]" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <Skeleton height="48px" />
            <Skeleton height="48px" />
            <Skeleton height="48px" />
          </div>
        </div>
      </div>

      {/* Filter Skeleton */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="flex gap-3">
          <Skeleton height="48px" width="80px" />
          <Skeleton height="48px" width="100px" />
          <Skeleton height="48px" width="110px" />
        </div>
      </div>

      {/* Progress Skeleton */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 mb-4 sm:mb-6">
        <div className="flex items-center justify-between mb-3">
          <Skeleton height="16px" width="150px" />
          <Skeleton height="16px" width="40px" />
        </div>
        <Skeleton height="12px" className="rounded-full" />
      </div>

      {/* Task Cards Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
        <TaskCardSkeleton />
        <TaskCardSkeleton />
        <TaskCardSkeleton />
        <TaskCardSkeleton />
      </div>
    </div>
  )
}

// Analytics Loading State
export function AnalyticsSkeleton() {
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 animate-fade-in">
      {/* Overview Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-6 sm:mb-8">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>

      {/* Time Period Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white rounded-xl p-5 sm:p-6 shadow-md">
          <Skeleton height="24px" width="60px" className="mb-4" />
          <div className="space-y-3">
            <Skeleton height="20px" />
            <Skeleton height="20px" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 sm:p-6 shadow-md">
          <Skeleton height="24px" width="80px" className="mb-4" />
          <div className="space-y-3">
            <Skeleton height="20px" />
            <Skeleton height="20px" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 sm:p-6 shadow-md">
          <Skeleton height="24px" width="90px" className="mb-4" />
          <div className="space-y-3">
            <Skeleton height="20px" />
            <Skeleton height="20px" />
          </div>
        </div>
      </div>

      {/* Chart Skeleton */}
      <div className="bg-white rounded-xl p-5 sm:p-6 mb-6 sm:mb-8 shadow-md">
        <Skeleton height="24px" width="200px" className="mb-6" />
        <Skeleton height="256px" />
      </div>
    </div>
  )
}
