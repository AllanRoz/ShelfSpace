import React from 'react'
import { motion } from 'framer-motion'

export const Card = ({ children, className = '' }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-white dark:bg-stone-800 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-700 p-6 ${className}`}
  >
    {children}
  </motion.div>
)

export const StatCard = ({ label, value, subValue, icon: Icon, colorClass = 'text-accent-warm' }) => (
  <Card className="flex items-start gap-4">
    <div className={`p-3 rounded-xl bg-stone-100 dark:bg-stone-700 ${colorClass}`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-sm font-medium text-stone-500 dark:text-stone-400">{label}</p>
      <h3 className="text-2xl font-bold text-stone-900 dark:text-stone-100">{value}</h3>
      {subValue && <p className="text-xs text-stone-400 dark:text-stone-500 mt-1">{subValue}</p>}
    </div>
  </Card>
)

export const Section = ({ title, children, action }) => (
  <div className="mb-10">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100">{title}</h2>
      {action && (
        <button className="text-sm font-medium text-accent-warm hover:text-accent-dark transition-colors">
          {action}
        </button>
      )}
    </div>
    {children}
  </div>
)
