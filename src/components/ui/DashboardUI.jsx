import React from 'react'
import { motion } from 'framer-motion'

export const Card = ({ children, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    className={`
      bg-white dark:bg-[#1f1a15]
      rounded-2xl shadow-sm
      border border-stone-200 dark:border-[#2e2720]
      p-6
      ${className}
    `}
  >
    {children}
  </motion.div>
)

export const StatCard = ({ label, value, subValue, icon: Icon, colorClass = 'text-accent-warm' }) => (
  <Card className="flex items-start gap-4">
    <div className={`p-3 rounded-xl bg-stone-100 dark:bg-[#2a221a] ${colorClass} shrink-0`}>
      <Icon size={22} />
    </div>
    <div>
      <p className="text-sm font-medium text-stone-500 dark:text-stone-500">{label}</p>
      <h3 className="text-2xl font-bold text-stone-900 dark:text-[#e8ddd3]">{value}</h3>
      {subValue && <p className="text-xs text-stone-400 dark:text-stone-600 mt-0.5">{subValue}</p>}
    </div>
  </Card>
)

export const Section = ({ title, children, action, onAction }) => (
  <div className="mb-10">
    <div className="flex items-center justify-between mb-5">
      <h2 className="text-xl font-bold text-stone-800 dark:text-[#e8ddd3]">{title}</h2>
      {action && (
        <button
          type="button"
          onClick={onAction}
          className="text-sm font-semibold text-accent-warm hover:text-accent-dark transition-colors cursor-pointer flex items-center gap-1"
        >
          <span>{action}</span>
          <span>→</span>
        </button>
      )}
    </div>
    {children}
  </div>
)
