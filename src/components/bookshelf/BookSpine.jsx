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
        y: -15, 
        scale: 1.05, 
        zIndex: 10,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' 
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`
        relative cursor-pointer flex flex-col justify-center items-center 
        ${style.color} border-l border-white/30 border-r border-black/40 
        rounded-sm shadow-md overflow-hidden transition-colors
        bg-gradient-to-r from-black/20 via-transparent to-black/20
      `}
      style={{ 
        height: style.height, 
        width: style.width, 
        rotate: style.rotation,
      }}
    >
      {/* Book Title - Vertical Text */}
      <span className="whitespace-nowrap rotate-90 text-[10px] font-bold text-stone-100 uppercase tracking-widest opacity-90 pointer-events-none drop-shadow-sm">
        {book.title}
      </span>

      {/* Decorative Gold Bands - Premium Polish */}
      <div className="absolute top-4 left-0 right-0 h-1 bg-gradient-to-r from-yellow-700 via-yellow-400 to-yellow-700 opacity-60" />
      <div className="absolute bottom-4 left-0 right-0 h-1 bg-gradient-to-r from-yellow-700 via-yellow-400 to-yellow-700 opacity-60" />
      
      {/* Subtle Leather Texture Overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/leather.png')]" />
    </motion.div>
  )
}

export default BookSpine
