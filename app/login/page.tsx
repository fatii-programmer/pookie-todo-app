'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function LoginPage(): JSX.Element {
  const router = useRouter()
  const [isSignup, setIsSignup] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (isSignup && password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const endpoint = isSignup ? '/api/auth/signup' : '/api/auth/login'
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Authentication failed')
        setLoading(false)
        return
      }

      // Save user email to localStorage for the Header component
      if (data.email) {
        localStorage.setItem('userEmail', data.email)
      }

      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black p-4">
      <a href="#login-form" className="skip-link">
        Skip to login form
      </a>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-5xl sm:text-6xl font-display font-bold text-white text-center tracking-tight">
          pookie todo
        </h1>
        <p className="text-pink-300 text-center mt-2 text-sm font-medium">Stay organized with love</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 sm:p-10"
        role="main"
        aria-labelledby="form-heading"
      >
        <h2 id="form-heading" className="text-2xl sm:text-3xl font-display font-bold text-center text-black mb-8">
          {isSignup ? 'Create your account' : 'Welcome back, pookie ♡'}
        </h2>

        <form
          id="login-form"
          onSubmit={handleSubmit}
          className="space-y-5"
          aria-label={isSignup ? 'Sign up form' : 'Login form'}
        >
          <div>
            <label htmlFor="email-input" className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-required="true"
              aria-invalid={error ? 'true' : 'false'}
              aria-describedby={error ? 'form-error' : undefined}
              autoComplete="email"
              className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 hover:border-gray-300 transition-all duration-200 text-black text-base"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label htmlFor="password-input" className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              aria-required="true"
              aria-invalid={error ? 'true' : 'false'}
              aria-describedby={error ? 'form-error' : 'password-hint'}
              autoComplete={isSignup ? 'new-password' : 'current-password'}
              className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 hover:border-gray-300 transition-all duration-200 text-black text-base"
              placeholder="••••••••"
            />
            <span id="password-hint" className="sr-only">Password must be at least 8 characters long</span>
          </div>

          {isSignup && (
            <div>
              <label htmlFor="confirm-password-input" className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                id="confirm-password-input"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                aria-required="true"
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={error ? 'form-error' : 'confirm-password-hint'}
                autoComplete="new-password"
                className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 hover:border-gray-300 transition-all duration-200 text-black text-base"
                placeholder="••••••••"
              />
              <span id="confirm-password-hint" className="sr-only">Re-enter your password to confirm</span>
            </div>
          )}

          {error && (
            <div
              id="form-error"
              role="alert"
              aria-live="polite"
              className="bg-red-50 border-2 border-red-200 rounded-lg p-4 text-sm font-medium text-red-700 flex items-start gap-2"
            >
              <span aria-hidden="true" className="text-red-500 text-base">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            aria-label={loading ? 'Submitting form' : isSignup ? 'Create account' : 'Login to your account'}
            className="w-full h-12 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl hover:from-pink-600 hover:to-purple-700 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg transition-all duration-200 text-base mt-6"
          >
            {loading ? 'Loading...' : isSignup ? 'Create Account' : 'Login'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => {
              setIsSignup(!isSignup)
              setError('')
            }}
            aria-label={isSignup ? 'Switch to login form' : 'Switch to sign up form'}
            className="text-sm font-medium text-pink-600 hover:text-pink-700 hover:underline focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 rounded-md px-3 py-2 transition-colors duration-200"
          >
            {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign up"}
          </button>
        </div>
      </motion.div>

      <p className="mt-8 text-sm text-gray-400 font-medium" role="contentinfo">
        Made with <span aria-label="love" className="text-pink-400">♡</span> by Pookie Tech
      </p>
    </div>
  )
}
