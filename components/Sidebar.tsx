'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useMounted } from '@/hooks/useMounted'

interface NavItem {
  name: string
  path: string
  icon: JSX.Element
  action?: () => void
}

export default function Sidebar(): JSX.Element {
  const router = useRouter()
  const pathname = usePathname()
  const mounted = useMounted()
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Check if screen is mobile - only run on client to prevent hydration mismatch
  useEffect(() => {
    if (!mounted) return

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setIsOpen(true)
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [mounted])

  // Handle logout
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      localStorage.removeItem('userEmail')
      router.push('/login')
      router.refresh()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const navItems: NavItem[] = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
    },
    {
      name: 'Analytics',
      path: '/analytics',
      icon: (
        <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      name: 'AI Chat',
      path: '/chat',
      icon: (
        <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
    },
    {
      name: 'Profile',
      path: '/profile',
      icon: (
        <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
  ]

  const handleNavigation = (path: string) => {
    router.push(path)
    if (isMobile) {
      setIsOpen(false)
    }
  }

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed top-4 left-4 z-50 p-3 min-w-[48px] min-h-[48px] flex items-center justify-center bg-black text-white rounded-lg shadow-lg hover:bg-gray-900 active:bg-gray-800 transition-default md:hidden"
          aria-label="Toggle sidebar"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      )}

      {/* Overlay for mobile */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {(isOpen || !isMobile) && (
          <motion.aside
            role="navigation"
            aria-label="Main navigation"
            initial={isMobile ? { x: -280 } : false}
            animate={{ x: 0 }}
            exit={isMobile ? { x: -280 } : {}}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed left-0 top-0 h-full w-64 bg-black text-white shadow-2xl z-50 flex flex-col dark-bg"
          >
            {/* Logo/Brand */}
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-xl" aria-hidden="true">
                  <svg
                    className="w-7 h-7 text-white"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-display font-bold tracking-tight" aria-label="Pookie Todo">pookie todo</h2>
                  <p className="text-xs text-gray-400 font-medium" aria-label="Stay organized">Stay organized <span className="text-pink-400">♡</span></p>
                </div>
              </div>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 py-4 sm:py-6 px-3 overflow-y-auto" aria-label="Primary navigation">
              <ul className="space-y-2" role="list">
                {navItems.map((item, index) => {
                  const active = isActive(item.path)
                  return (
                    <li key={item.name}>
                      <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleNavigation(item.path)}
                        aria-label={`Navigate to ${item.name}`}
                        aria-current={active ? 'page' : undefined}
                        className={`w-full flex items-center gap-3 px-4 py-3.5 min-h-[48px] rounded-xl font-bold transition-all duration-200 text-base shadow-sm ${
                          active
                            ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg scale-105'
                            : 'text-gray-300 hover:bg-gray-900 hover:text-white hover:shadow-md active:bg-gray-800'
                        }`}
                      >
                        <span className={active ? 'text-white' : 'text-gray-400'} aria-hidden="true">
                          {item.icon}
                        </span>
                        <span>{item.name}</span>
                        {active && (
                          <>
                            <span className="sr-only">(current page)</span>
                            <motion.div
                              layoutId="activeIndicator"
                              className="ml-auto w-2 h-2 rounded-full bg-white"
                              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                              aria-hidden="true"
                            />
                          </>
                        )}
                      </motion.button>
                    </li>
                  )
                })}
              </ul>
            </nav>

            {/* Logout Button */}
            <div className="p-3 border-t border-gray-800">
              <motion.button
                onClick={handleLogout}
                whileTap={{ scale: 0.98 }}
                aria-label="Logout from your account"
                className="w-full flex items-center gap-3 px-4 py-3.5 min-h-[48px] rounded-xl font-bold text-gray-300 hover:bg-red-600 hover:text-white hover:shadow-lg active:bg-red-700 transition-all duration-200 text-base shadow-sm"
              >
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </motion.button>
            </div>

          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}
