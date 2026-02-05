'use client'

import { usePathname } from 'next/navigation'
import Sidebar from './Sidebar'
import Footer from './Footer'

interface LayoutWrapperProps {
  children: React.ReactNode
}

export default function LayoutWrapper({ children }: LayoutWrapperProps): JSX.Element {
  const pathname = usePathname()

  // Don't show sidebar on login page
  const showSidebar = pathname !== '/login' && pathname !== '/'

  if (!showSidebar) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1">{children}</div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />

      {/* Main content area with left margin for sidebar on desktop */}
      <div className="flex-1 w-full md:ml-64 transition-all duration-300 flex flex-col">
        <div className="flex-1">{children}</div>
        <Footer />
      </div>
    </div>
  )
}
