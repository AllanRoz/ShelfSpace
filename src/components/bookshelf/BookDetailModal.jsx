import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, Star, BookOpen, Calendar, Bookmark, Trash2, Edit3,
  CheckCircle, Clock, Heart
} from 'lucide-react'
import { useLibrary } from '../../context/LibraryContext'

const BookDetailModal = ({ book, isOpen, onClose }) => {
  const { updateBook, deleteBook, collections, addBookToCollection } = useLibrary()
  const [activeCollection, setActiveCollection] = React.useState('')

  if (!book) return null

  const handleToggleFavorite = () => updateBook(book.id, { isFavorite: !book.isFavorite })

  const handleDelete = () => {
    if (window.confirm(`Delete "${book.title}"?`)) {
      deleteBook(book.id)
      onClose()
    }
  }

  const progress = book.pages > 0 ? Math.min(100, Math.round((book.currentPage / book.pages) * 100)) : 0

  const statusBadge = {
    'Finished':          'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    'Currently Reading': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'DNF':               'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  }[book.status] || 'bg-stone-100 text-stone-600 dark:bg-[#2a221a] dark:text-stone-400'

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-stone-950/70 dark:bg-black/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 24 }}
            transition={{ type: 'spring', stiffness: 340, damping: 30 }}
            className="
              relative w-full max-w-4xl max-h-[90vh]
              bg-white dark:bg-[#1f1a15]
              border border-stone-200 dark:border-[#2e2720]
              rounded-3xl shadow-2xl dark:shadow-black/60
              overflow-hidden flex flex-col md:flex-row
            "
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-stone-100/80 dark:bg-[#2a221a]/80 text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-[#e8ddd3] transition-colors backdrop-blur-sm"
            >
              <X size={18} />
            </button>

            {/* ── Left: Cover ── */}
            <div className="w-full md:w-80 shrink-0 bg-stone-100 dark:bg-[#16120e] flex items-center justify-center p-8">
              <div className="w-full aspect-[2/3] rounded-xl overflow-hidden shadow-2xl dark:shadow-black/60 relative">
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
                {/* Progress overlay at bottom */}
                {book.status === 'Currently Reading' && book.pages > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <div className="flex justify-between text-xs text-white/80 mb-1.5">
                      <span>Progress</span>
                      <span>{book.currentPage} / {book.pages} pages</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent-warm rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-white/60 text-[10px] mt-1 text-right">{progress}%</p>
                  </div>
                )}
              </div>
            </div>

            {/* ── Right: Details ── */}
            <div className="flex-1 p-7 overflow-y-auto">
              {/* Header row */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 pr-4">
                  <h2 className="text-2xl font-extrabold text-stone-900 dark:text-[#e8ddd3] leading-tight">{book.title}</h2>
                  <p className="text-base text-stone-500 dark:text-stone-400 mt-1">{book.author}</p>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <button
                    onClick={handleToggleFavorite}
                    className={`p-2 rounded-xl transition-all ${book.isFavorite ? 'text-rose-500 bg-rose-50 dark:bg-rose-900/20' : 'text-stone-300 dark:text-stone-600 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20'}`}
                    title="Toggle Favorite"
                  >
                    <Heart size={18} fill={book.isFavorite ? 'currentColor' : 'none'} />
                  </button>
                  <button
                    onClick={handleDelete}
                    className="p-2 rounded-xl text-stone-300 dark:text-stone-600 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all"
                    title="Delete Book"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-5">
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-stone-100 dark:bg-[#2a221a] text-stone-600 dark:text-stone-400">
                  {book.genre}
                </span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusBadge}`}>
                  {book.status}
                </span>
                {book.rating > 0 && (
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400">
                    {'★'.repeat(book.rating)}{'☆'.repeat(5 - book.rating)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed mb-6">
                {book.description || 'No description provided.'}
              </p>

              {/* Meta grid */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  { icon: BookOpen, text: `${book.pages} pages` },
                  { icon: Calendar, text: `Published ${book.publicationYear}` },
                  { icon: Bookmark, text: `Added ${new Date(book.dateAdded).toLocaleDateString()}` },
                  ...(book.dateFinished ? [{ icon: CheckCircle, text: `Finished ${new Date(book.dateFinished).toLocaleDateString()}` }] : []),
                ].map(({ icon: Icon, text }, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-stone-500 dark:text-stone-500">
                    <Icon size={14} className="shrink-0 text-stone-400 dark:text-stone-600" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>

              {/* Notes */}
              {book.personalNotes && (
                <div className="p-4 rounded-xl bg-stone-50 dark:bg-[#16120e] border border-stone-200 dark:border-[#2e2720] mb-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-600 mb-2">Personal Notes</p>
                  <p className="text-sm text-stone-600 dark:text-stone-400 italic leading-relaxed">"{book.personalNotes}"</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 mb-5">
                <button
                  onClick={() => updateBook(book.id, { status: 'Currently Reading' })}
                  className="flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold bg-stone-100 dark:bg-[#2a221a] text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-[#352b20] transition-all flex items-center justify-center gap-2"
                >
                  <Clock size={16} /> Reading
                </button>
                <button
                  onClick={() => updateBook(book.id, { status: 'Finished' })}
                  className="flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold bg-accent-warm hover:bg-accent-dark text-white transition-all flex items-center justify-center gap-2 shadow-md shadow-accent-warm/20"
                >
                  <CheckCircle size={16} /> Finished
                </button>
              </div>

              {/* Add to Collection */}
              {collections.length > 0 && (
                <div className="p-4 rounded-xl bg-stone-50 dark:bg-[#16120e] border border-stone-200 dark:border-[#2e2720]">
                  <p className="text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-600 mb-2">Add to Collection</p>
                  <div className="flex gap-2">
                    <select
                      value={activeCollection}
                      onChange={(e) => setActiveCollection(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg border border-stone-200 dark:border-[#2e2720] bg-white dark:bg-[#1f1a15] text-sm text-stone-800 dark:text-stone-300 focus:ring-2 focus:ring-accent-warm focus:outline-none"
                    >
                      <option value="">Select a collection…</option>
                      {collections.map(col => (
                        <option key={col.id} value={col.id}>{col.name}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => {
                        if (!activeCollection) return
                        addBookToCollection(activeCollection, book.id)
                        setActiveCollection('')
                      }}
                      className="px-4 py-2 bg-stone-800 dark:bg-accent-warm text-white rounded-lg text-sm font-bold hover:bg-stone-700 dark:hover:bg-accent-dark transition-all"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default BookDetailModal
