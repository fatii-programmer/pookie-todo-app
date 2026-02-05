'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Header from '@/components/Header'
import { useMounted } from '@/hooks/useMounted'

interface ProfileData {
  id: string
  email: string
  displayName: string
  provider: 'google' | 'credentials'
  createdAt: string
}

export default function ProfilePage(): JSX.Element {
  const router = useRouter()
  const mounted = useMounted()
  const [userEmail, setUserEmail] = useState('')
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!mounted) return

    const email = localStorage.getItem('userEmail')
    if (email) {
      setUserEmail(email)
    }

    // Fetch profile data
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/profile')
        if (res.ok) {
          const data = await res.json()
          setProfile(data)
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [mounted])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="min-h-screen bg-gray-50"
    >
      <a href="#profile-content" className="skip-link">
        Skip to profile content
      </a>

      <Header
        title="Profile"
        subtitle="Manage your account settings"
        showSearch={false}
      />

      <main id="profile-content" className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 hover:shadow-2xl transition-all duration-300 border-2 border-gray-100"
          role="article"
          aria-labelledby="profile-heading"
        >
          {!mounted ? (
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 mb-8 sm:mb-10">
              <div
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-black text-3xl sm:text-4xl shadow-xl border-4 border-white animate-pulse"
                role="img"
                aria-label="Loading user profile"
              >
                <div className="w-full h-full flex items-center justify-center">...</div>
              </div>
              <div className="text-center sm:text-left">
                <div className="h-8 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 mb-8 sm:mb-10">
              <div
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-black text-3xl sm:text-4xl shadow-xl border-4 border-white"
                role="img"
                aria-label={`User avatar with initials ${userEmail ? userEmail.substring(0, 2).toUpperCase() : 'U'}`}
              >
                {userEmail ? userEmail.substring(0, 2).toUpperCase() : 'U'}
              </div>
              <div className="text-center sm:text-left">
                <h2 id="profile-heading" className="text-2xl sm:text-3xl font-display font-black text-gray-900 mb-2 tracking-tight">
                  {userEmail.split('@')[0] || 'User'}
                </h2>
                <p className="text-base sm:text-lg text-gray-600 font-medium">{userEmail || 'user@example.com'}</p>
              </div>
            </div>
          )}

          <div className="border-t-2 border-gray-100 pt-8">
            <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-6 tracking-tight">Account Details</h3>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                    <div className="h-12 bg-gray-100 rounded-xl"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-5" role="list" aria-label="Profile details">
                {/* Display Name */}
                <div role="listitem">
                  <label className="block text-sm font-bold text-gray-500 mb-2 uppercase tracking-wide">
                    Name
                  </label>
                  <div className="w-full h-14 px-5 bg-gray-50 border-2 border-gray-200 rounded-xl flex items-center">
                    <span className="text-gray-900 text-base font-semibold">
                      {profile?.displayName || userEmail.split('@')[0] || 'User'}
                    </span>
                  </div>
                </div>

                {/* Email */}
                <div role="listitem">
                  <label className="block text-sm font-bold text-gray-500 mb-2 uppercase tracking-wide">
                    Email Address
                  </label>
                  <div className="w-full h-14 px-5 bg-gray-50 border-2 border-gray-200 rounded-xl flex items-center">
                    <span className="text-gray-900 text-base font-semibold">
                      {profile?.email || userEmail || 'user@example.com'}
                    </span>
                  </div>
                </div>

                {/* Login Provider */}
                <div role="listitem">
                  <label className="block text-sm font-bold text-gray-500 mb-2 uppercase tracking-wide">
                    Login Provider
                  </label>
                  <div className="w-full h-14 px-5 bg-gray-50 border-2 border-gray-200 rounded-xl flex items-center gap-3">
                    {profile?.provider === 'google' ? (
                      <>
                        <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        <span className="text-gray-900 text-base font-semibold">Google</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="text-gray-900 text-base font-semibold">Email & Password</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Account Created */}
                <div role="listitem">
                  <label className="block text-sm font-bold text-gray-500 mb-2 uppercase tracking-wide">
                    Member Since
                  </label>
                  <div className="w-full h-14 px-5 bg-gray-50 border-2 border-gray-200 rounded-xl flex items-center gap-3">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-900 text-base font-semibold">
                      {profile?.createdAt
                        ? new Date(profile.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })
                        : 'Not available'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </motion.div>
  )
}
