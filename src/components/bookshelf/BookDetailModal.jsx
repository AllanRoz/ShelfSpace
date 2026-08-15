import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Star, BookOpen, Calendar, Bookmark, Quote, Trash2, Edit3, CheckCircle, Clock, Heart } from 'lucide-react'
import { useLibrary } from '../../context/LibraryContext'

const BookDetailModal = ({ book, isOpen, onClose }) => {
  const { updateBook, deleteBook, collections, addBookToCollection } = useLibrary()
  const [activeCollection, setActiveCollection] = useState('')
  
  if (!book) return null

  const handleToggleFavorite = () => {
    updateBook(book.id, { isFavorite: !book.isFavorite })
  }

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${book.title}"?`)) {
      deleteBook(book.id)
      onClose()
    }
  }

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
            className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-stone-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-white/80 dark:bg-stone-700/80 rounded-full text-stone-500 hover:text-stone-800 dark:hover:text-stone-100 transition-colors"
            >
              <X size={20} />
            </button>

            {/* Left: Cover Art */}
            <div className="w-full md:w-1/3 bg-stone-100 dark:bg-stone-900 p-8 flex items-center justify-center">
              <div className="relative w-full aspect-[2/3] shadow-2xl rounded-lg overflow-hidden group">
                <img 
                  src={book.coverImage} 
                  alt={book.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>

            {/* Right: Details */}
            <div className="flex-1 p-8 overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div>
                    <h2 className="text-3xl font-bold text-stone-800 dark:text-stone-100">{book.title}</h2>
                    <p className="text-lg text-stone-500 dark:text-stone-400">{book.author}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={handleToggleFavorite}
                    className={`p-2 rounded-full transition-colors ${book.isFavorite ? 'text-rose-500 bg-rose-50 dark:bg-rose-900/20' : 'text-stone-400 hover:text-rose-500'}`}
                    title="Favorite Book"
                  >
                    <Heart size={20} fill={book.isFavorite ? 'currentColor' : 'none'} />
                  </button>
                  <button 
                    onClick={handleDelete}
                    className="p-2 text-stone-400 hover:text-rose-500 transition-colors"
                    title="Delete Book"
                  >
                    <Trash2 size={20} />
                  </button>
                  <button 
                    onClick={() => window.alert('Edit mode coming in next phase!')}
                    className="p-2 text-stone-400 hover:text-accent-warm transition-colors"
                    title="Edit Book"
                  >
                    <Edit3 size={20} />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mb-6">
                <span className="px-3 py-1 bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300 rounded-full text-xs font-medium">
                  {book.genre}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  book.status === 'Finished' ? 'bg-emerald-100 text-emerald-700' : 
                  book.status === 'Currently Reading' ? 'bg-blue-100 text-blue-700' : 
                  'bg-stone-100 text-stone-600'
                }`}>
                  {book.status}
                </span>
                <div className="flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                  <Star size={12} fill="currentColor" />
                  {book.rating || 'No rating'}
                </div>
              </div>

              <p className="text-stone-600 dark:text-stone-400 leading-relaxed mb-8">
                {book.description || 'No description provided.'}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm text-stone-500 dark:text-stone-400">
                    <BookOpen size={16} />
                    <span>{book.pages} pages</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-stone-500 dark:text-stone-400">
                    <Calendar size={16} />
                    <span>Published {book.publicationYear}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-stone-500 dark:text-stone-400">
                    <Bookmark size={16} />
                    <span>Added {new Date(book.dateAdded).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-stone-50 dark:bg-stone-900/50 rounded-2xl border border-stone-100 dark:border-stone-700">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">Personal Notes</h4>
                    <p className="text-sm text-stone-600 dark:text-stone-300 italic">
                      "{book.personalNotes || 'No notes yet...'}"
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex gap-3">
                  <button 
                    onClick={() => updateBook(book.id, { status: 'Currently Reading' })}
                    className="flex-1 py-3 px-4 bg-stone-100 dark:bg-stone-700 hover:bg-stone-200 dark:hover:bg-stone-600 text-stone-800 dark:text-stone-100 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                  >
                    <Clock size={18} />
                    Reading
                  </button>
                  <button 
                    onClick={() => updateBook(book.id, { status: 'Finished' })}
                    className="flex-1 py-3 px-4 bg-accent-warm hover:bg-accent-dark text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2 shadow-lg shadow-accent-warm/20"
                  >
                    <CheckCircle size={18} />
                    Finished
                  </button>
                </div>

                <div className="p-4 bg-stone-50 dark:bg-stone-900/50 rounded-2xl border border-stone-200 dark:border-stone-700">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">Add to Collection</label>
                  <div className="flex gap-2">
                    <select 
                      value={activeCollection}
                      onChange={(e) => setActiveCollection(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-sm text-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-accent-warm focus:outline-none"
                    >
                      <option value="">Select a collection...</option>
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
                      className="px-4 py-2 bg-stone-800 dark:bg-stone-100 text-white dark:text-stone-900 rounded-lg text-sm font-bold hover:bg-stone-700 dark:hover:bg-stone-200 transition-all"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default BookDetailModal
