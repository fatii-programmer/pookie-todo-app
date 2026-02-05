'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useMounted } from '@/hooks/useMounted'

interface HeaderProps {
  title: string
  subtitle?: string
  onSearch?: (searchTerm: string) => void
  searchPlaceholder?: string
  showSearch?: boolean
}

export default function Header({
  title,
  subtitle,
  onSearch,
  searchPlaceholder = 'Search...',
  showSearch = true,
}: HeaderProps): JSX.Element {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const mounted = useMounted()

  // Handle search input
  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    if (onSearch) {
      onSearch(value)
    }
  }

  // Handle logout
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
      router.refresh()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }

    if (mounted) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [mounted])

  // Get user email from localStorage - only safe to access after mount to prevent hydration mismatch
  const userEmail = mounted
    ? localStorage.getItem('userEmail') || 'user@example.com'
    : 'user@example.com'

  // Get initials for avatar
  const getInitials = (email: string): string => {
    const parts = email.split('@')[0].split('.')
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase()
    }
    return email.substring(0, 2).toUpperCase()
  }

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40" role="banner">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 md:ml-0 ml-12 sm:ml-14">
          {/* Left: Page Title */}
          <div className="flex-shrink-0 min-w-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-gray-900 truncate tracking-tight" id="page-title">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm sm:text-base text-gray-500 truncate font-medium" id="page-subtitle">{subtitle}</p>
            )}
          </div>

          {/* Center: Search Box */}
          {showSearch && (
            <div className="hidden md:flex flex-1 max-w-md mx-8" role="search">
              <div className="relative w-full">
                <label htmlFor="search-input" className="sr-only">
                  Search tasks
                </label>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" aria-hidden="true">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  id="search-input"
                  type="search"
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder={searchPlaceholder}
                  aria-label="Search tasks"
                  className="block w-full pl-10 pr-3 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 hover:border-gray-300 transition-all duration-200 text-black placeholder-gray-400 font-medium bg-gray-50 focus:bg-white"
                />
              </div>
            </div>
          )}

          {/* Right: User Avatar & Actions */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* User Avatar with Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                aria-label="Open user menu"
                aria-expanded={isProfileOpen}
                aria-haspopup="true"
                aria-controls="user-menu"
                className="flex items-center gap-2 p-2 min-w-[44px] min-h-[44px] rounded-full hover:bg-gray-100 active:bg-gray-200 transition-default focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shadow-md" aria-hidden="true">
                  {getInitials(userEmail)}
                </div>
                <span className="sr-only">User menu for {userEmail}</span>
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    id="user-menu"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                  >
                    {/* User Info */}
                    <div className="px-4 py-3 sm:py-4 border-b border-gray-100" role="none">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm sm:text-base" aria-hidden="true">
                          {getInitials(userEmail)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm sm:text-base font-semibold text-black truncate" role="heading" aria-level={2}>
                            {userEmail.split('@')[0]}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500 truncate">{userEmail}</p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1" role="none">
                      <motion.button
                        onClick={() => {
                          router.push('/dashboard')
                          setIsProfileOpen(false)
                        }}
                        role="menuitem"
                        whileTap={{ scale: 0.98 }}
                        aria-label="Go to Dashboard"
                        className="w-full text-left px-4 py-3 sm:py-2.5 min-h-[44px] sm:min-h-0 text-sm sm:text-base text-gray-700 hover:bg-pink-50 hover:text-pink-600 active:bg-pink-100 transition-all duration-200 flex items-center gap-3"
                      >
                        <svg className="w-5 h-5 sm:w-4 sm:h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Dashboard
                      </motion.button>

                      <motion.button
                        onClick={() => {
                          router.push('/analytics')
                          setIsProfileOpen(false)
                        }}
                        role="menuitem"
                        whileTap={{ scale: 0.98 }}
                        aria-label="Go to Analytics"
                        className="w-full text-left px-4 py-3 sm:py-2.5 min-h-[44px] sm:min-h-0 text-sm sm:text-base text-gray-700 hover:bg-pink-50 hover:text-pink-600 active:bg-pink-100 transition-all duration-200 flex items-center gap-3"
                      >
                        <svg className="w-5 h-5 sm:w-4 sm:h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Analytics
                      </motion.button>

                      <motion.button
                        onClick={() => {
                          router.push('/admin/activity')
                          setIsProfileOpen(false)
                        }}
                        role="menuitem"
                        whileTap={{ scale: 0.98 }}
                        aria-label="Go to Activity Log (Admin)"
                        className="w-full text-left px-4 py-3 sm:py-2.5 min-h-[44px] sm:min-h-0 text-sm sm:text-base text-gray-700 hover:bg-purple-50 hover:text-purple-600 active:bg-purple-100 transition-all duration-200 flex items-center gap-3"
                      >
                        <svg className="w-5 h-5 sm:w-4 sm:h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                        Activity Log
                      </motion.button>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-gray-100 py-1" role="none">
                      <motion.button
                        onClick={handleLogout}
                        role="menuitem"
                        whileTap={{ scale: 0.98 }}
                        aria-label="Logout from account"
                        className="w-full text-left px-4 py-3 sm:py-2.5 min-h-[44px] sm:min-h-0 text-sm sm:text-base text-red-600 hover:bg-red-50 active:bg-red-100 transition-all duration-200 flex items-center gap-3 font-medium"
                      >
                        <svg className="w-5 h-5 sm:w-4 sm:h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Mobile Search (shows below header on small screens) */}
        {showSearch && (
          <div className="md:hidden pb-3 sm:pb-4" role="search">
            <div className="relative">
              <label htmlFor="search-input-mobile" className="sr-only">
                Search tasks
              </label>
              <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none" aria-hidden="true">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                id="search-input-mobile"
                type="search"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder={searchPlaceholder}
                aria-label="Search tasks"
                className="block w-full h-12 pl-10 sm:pl-11 pr-3 sm:pr-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 hover:border-gray-300 transition-all duration-200 text-base text-black placeholder-gray-400 font-medium bg-gray-50 focus:bg-white"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
