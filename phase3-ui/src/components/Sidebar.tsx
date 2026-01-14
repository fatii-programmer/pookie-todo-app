'use client';

import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import Link from 'next/link';

interface NavItem {
  icon: string;
  label: string;
  badge: number;
  href: string;
  view: 'dashboard' | 'today' | 'upcoming' | 'completed';
}

const navItems: NavItem[] = [
  { icon: '📅', label: 'Today', badge: 3, href: '/dashboard/today', view: 'today' },
  { icon: '🔮', label: 'Upcoming', badge: 7, href: '/dashboard/upcoming', view: 'upcoming' },
  { icon: '✅', label: 'Completed', badge: 12, href: '/dashboard/completed', view: 'completed' },
  { icon: '📝', label: 'All Tasks', badge: 22, href: '/dashboard', view: 'dashboard' },
];

export function Sidebar() {
  const { activeView, setActiveView, isSidebarOpen } = useAppStore();

  if (!isSidebarOpen) return null;

  return (
    <motion.aside
      initial={{ x: -280, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -280, opacity: 0 }}
      className="hidden md:block w-[280px] h-screen glass-light border-r border-white/20 p-6 sticky top-0"
    >
      {/* Pookie Avatar Section */}
      <div className="mb-8 glass-strong p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-lavender-400 to-mint-400 flex items-center justify-center border-2 border-white shadow-md">
            <span className="text-2xl">🐰</span>
          </div>
          <div>
            <p className="font-semibold text-neutral-900">Hey, Friend!</p>
            <p className="text-sm text-neutral-500">You're doing great! 🌟</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-2 mb-8">
        {navItems.map((item) => (
          <Link
            key={item.view}
            href={item.href}
            onClick={() => setActiveView(item.view)}
            className={`
              flex items-center justify-between px-4 py-3 rounded-xl
              transition-all duration-200 hover:scale-[1.02]
              ${
                activeView === item.view
                  ? 'bg-lavender-100 text-lavender-700'
                  : 'hover:bg-lavender-50 text-neutral-700'
              }
            `}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </div>
            {item.badge > 0 && (
              <span
                className="bg-lavender-500 text-white text-xs font-semibold
                px-2 py-0.5 rounded-full min-w-[24px] text-center"
              >
                {item.badge}
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* Quick Stats Card */}
      <div className="glass-strong p-4 rounded-2xl shadow-md">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">📊</span>
          <h3 className="text-sm font-semibold text-neutral-700">This Week</h3>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-baseline">
            <span className="text-xs text-neutral-500">Completed</span>
            <span className="text-xl font-bold text-lavender-600">12</span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="text-xs text-neutral-500">Remaining</span>
            <span className="text-xl font-bold text-lavender-600">8</span>
          </div>
          <div className="pt-2 mt-2 border-t border-neutral-200">
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-500">Progress</span>
              <span className="text-sm font-bold text-lavender-600">🔥 60%</span>
            </div>
            <div className="mt-2 h-2 bg-neutral-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '60%' }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-lavender-500 to-mint-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Settings Button */}
      <Link
        href="/settings"
        className="mt-8 w-full px-4 py-3 flex items-center gap-3
          text-neutral-700 hover:bg-lavender-50 rounded-xl
          transition-colors duration-200"
      >
        <span className="text-xl">⚙️</span>
        <span className="font-medium">Settings</span>
      </Link>
    </motion.aside>
  );
}
