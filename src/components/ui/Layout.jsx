import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Book, LayoutDashboard, BarChart3, Settings, Moon, Sun,
  Menu, X, Layers, Plus, List, Users
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export const Layout = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    if (saved === 'dark' || (!saved && prefersDark)) {
      setIsDarkMode(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleTheme = () => {
    const next = !isDarkMode
    setIsDarkMode(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }

  const navItems = [
    { name: 'Dashboard',     path: '/',            icon: LayoutDashboard },
    { name: 'Bookshelf',     path: '/bookshelf',   icon: Book },
    { name: 'Authors',       path: '/authors',     icon: Users },
    { name: 'Collections',   path: '/collections', icon: Layers },
    { name: 'Reading Lists', path: '/lists',       icon: List },
    { name: 'Statistics',    path: '/stats',       icon: BarChart3 },
    { name: 'Settings',      path: '/settings',    icon: Settings },
  ]

  return (
    <div className="min-h-screen flex flex-col md:flex-row">

      {/* ── Sidebar ── */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 flex flex-col
        bg-stone-100 dark:bg-[#1a1510]
        border-r border-stone-200 dark:border-[#2a2218]
        shadow-xl dark:shadow-black/40
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0
      `}>
        {/* Logo */}
        <div className="px-6 pt-6 pb-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-warm to-accent-dark flex items-center justify-center shadow-lg shadow-accent-warm/30">
            <Book className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-stone-800 dark:text-[#e8ddd3] tracking-tight leading-none">ShelfSpace</h1>
            <p className="text-[10px] text-stone-400 dark:text-stone-500 font-medium tracking-widest uppercase mt-0.5">Your Library</p>
          </div>
        </div>

        {/* Add Book CTA */}
        <div className="px-4 pb-4">
          <Link
            to="/add"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-accent-warm hover:bg-accent-dark text-white text-sm font-bold transition-all shadow-md shadow-accent-warm/20 active:scale-95"
          >
            <Plus size={16} />
            Add Book
          </Link>
        </div>

        {/* Nav divider label */}
        <p className="px-6 pb-2 text-[10px] uppercase tracking-widest font-bold text-stone-400 dark:text-stone-600">Navigation</p>

        {/* Nav Items */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navItems.map(({ name, path, icon: Icon }) => {
            const isActive = location.pathname === path
            return (
              <Link
                key={path}
                to={path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`
                  relative flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium
                  transition-all duration-200 group
                  ${isActive
                    ? 'bg-accent-warm/15 dark:bg-accent-warm/10 text-accent-warm dark:text-accent-warm border border-accent-warm/20 dark:border-accent-warm/15'
                    : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200/70 dark:hover:bg-[#251e16] hover:text-stone-900 dark:hover:text-[#e8ddd3]'}
                `}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavPill"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-accent-warm rounded-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                <Icon size={18} />
                <span>{name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Theme toggle */}
        <div className="px-3 pb-6 pt-4 border-t border-stone-200 dark:border-[#2a2218] mt-4">
          <button
            onClick={toggleTheme}
            className="
              flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium
              text-stone-600 dark:text-stone-400
              hover:bg-stone-200/70 dark:hover:bg-[#251e16]
              hover:text-stone-900 dark:hover:text-[#e8ddd3]
              transition-all duration-200
            "
          >
            <div className={`p-1 rounded-lg transition-colors ${isDarkMode ? 'bg-amber-500/15 text-amber-400' : 'bg-stone-200 text-stone-600'}`}>
              {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
            </div>
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 flex flex-col min-w-0 relative bg-stone-50 dark:bg-[#16120e]">

        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white dark:bg-[#1a1510] border-b border-stone-200 dark:border-[#2a2218] sticky top-0 z-40 shadow-sm dark:shadow-black/30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-warm to-accent-dark flex items-center justify-center">
              <Book className="text-white" size={16} />
            </div>
            <span className="font-extrabold text-stone-800 dark:text-[#e8ddd3] tracking-tight">ShelfSpace</span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/add"
              className="px-3 py-1.5 bg-accent-warm text-white text-xs font-bold rounded-lg shadow-sm"
            >
              + Add
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-[#251e16] rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>
    </div>
  )
}
