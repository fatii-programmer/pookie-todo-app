'use client'

import { useEffect, useState } from 'react'

/**
 * Hook to safely detect if component is mounted on the client.
 *
 * Returns false during server-side rendering and initial hydration,
 * then true after the component is mounted on the client.
 *
 * This prevents hydration mismatches when using client-only APIs like:
 * - localStorage, sessionStorage
 * - window, document, navigator
 * - Date.toLocaleDateString(), Intl APIs
 * - Browser-specific values (timezone, locale, language)
 *
 * @example
 * ```tsx
 * const mounted = useMounted()
 *
 * if (!mounted) {
 *   return <div>Loading...</div> // Or return null, or a placeholder
 * }
 *
 * // Now safe to use client-only APIs
 * const userEmail = localStorage.getItem('userEmail')
 * ```
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return mounted
}
