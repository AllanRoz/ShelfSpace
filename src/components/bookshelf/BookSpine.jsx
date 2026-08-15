import React, { useMemo } from 'react'
import { motion } from 'framer-motion'

const SPINE_COLORS = [
  'bg-red-900', 'bg-blue-900', 'bg-green-900', 'bg-yellow-800', 
  'bg-stone-700', 'bg-indigo-900', 'bg-emerald-900', 'bg-rose-900',
  'bg-slate-800', 'bg-orange-900', 'bg-cyan-900', 'bg-purple-900'
]

const BookSpine = ({ book, onClick }) => {
  // Memoize random values so they don't change on every render
  const style = useMemo(() => ({
    height: Math.floor(Math.random() * (220 - 180) + 180) + 'px',
    width: Math.floor(Math.random() * (40 - 20) + 20) + 'px',
    color: SPINE_COLORS[Math.floor(Math.random() * SPINE_COLORS.length)],
    rotation: (Math.random() * 2 - 1).toFixed(2) + 'deg',
  }), [])

  return (
    <motion.div
      onClick={() => onClick(book)}
      whileHover={{ 
        y: -12, 
        scale: 1.05, 
        zIndex: 10,
        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.3)' 
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`
        relative cursor-pointer flex flex-col justify-center items-center 
        ${style.color} border-l border-white/20 border-r border-black/20 
        rounded-sm shadow-md overflow-hidden transition-colors
      `}
      style={{ 
        height: style.height, 
        width: style.width, 
        rotate: style.rotation,
      }}
    >
      {/* Book Title - Vertical Text */}
      <span className="whitespace-nowrap rotate-90 text-[10px] font-bold text-stone-100 uppercase tracking-widest opacity-80 pointer-events-none">
        {book.title}
      </span>

      {/* Decorative Gold Bands */}
      <div className="absolute top-4 left-0 right-0 h-0.5 bg-yellow-600/40" />
      <div className="absolute bottom-4 left-0 right-0 h-0.5 bg-yellow-600/40" />
    </motion.div>
  )
}

export default BookSpine
