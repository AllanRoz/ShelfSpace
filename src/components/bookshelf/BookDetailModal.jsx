import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, Star, BookOpen, Calendar, Bookmark, Trash2, Edit3,
  CheckCircle, Clock, Heart, Plus, Quote, Layers, Ban, Check, ArrowRight
} from 'lucide-react'
import { useLibrary } from '../../context/LibraryContext'
import { useNavigate } from 'react-router-dom'

const StarRating = ({ rating, onChange }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((n) => (
      <button
        key={n}
        type="button"
        onClick={() => onChange(n === rating ? 0 : n)}
        className={`text-xl transition-transform hover:scale-125 active:scale-95 cursor-pointer ${
          n <= rating ? 'text-amber-400' : 'text-stone-300 dark:text-stone-700'
        } hover:text-amber-400`}
        title={`Rate ${n} star${n > 1 ? 's' : ''}`}
      >
        ★
      </button>
    ))}
    {rating > 0 && (
      <span className="text-xs font-bold text-amber-500 ml-1.5">{rating}.0</span>
    )}
  </div>
)

const TAB_CLASSES = (active) =>
  `px-4 py-2 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
    active
      ? 'bg-accent-warm/15 dark:bg-accent-warm/10 text-accent-warm border border-accent-warm/25 shadow-xs'
      : 'text-stone-500 dark:text-stone-500 hover:text-stone-800 dark:hover:text-stone-300 hover:bg-stone-100 dark:hover:bg-[#27211a]'
  }`

const STATUS_CONFIG = {
  'Want to Read': {
    icon: Bookmark,
    activeCls: 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700',
    badgeCls: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    btnCls: 'hover:bg-amber-50 dark:hover:bg-amber-950/30 text-stone-600 dark:text-stone-400',
  },
  'Currently Reading': {
    icon: Clock,
    activeCls: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700',
    badgeCls: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    btnCls: 'hover:bg-blue-50 dark:hover:bg-blue-950/30 text-stone-600 dark:text-stone-400',
  },
  'Finished': {
    icon: CheckCircle,
    activeCls: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700',
    badgeCls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    btnCls: 'hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-stone-600 dark:text-stone-400',
  },
  'DNF': {
    icon: Ban,
    activeCls: 'bg-rose-100 dark:bg-rose-900/30 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-700',
    badgeCls: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
    btnCls: 'hover:bg-rose-50 dark:hover:bg-rose-950/30 text-stone-600 dark:text-stone-400',
  },
}

const BookDetailModal = ({ book: initialBook, isOpen, onClose }) => {
  const {
    books, updateBook, deleteBook, collections, readingLists,
    addBookToCollection, removeBookFromCollection,
    addBookToList, removeBookFromList
  } = useLibrary()
  const navigate = useNavigate()

  // Always look up the live book object from LibraryContext so state updates reflect immediately!
  const book = books.find(b => b.id === initialBook?.id) || initialBook

  const [tab, setTab]                         = useState('details')
  const [newQuote, setNewQuote]               = useState('')
  const [activeCollection, setActiveCollection] = useState('')
  const [activeList, setActiveList]           = useState('')
  const [editingPage, setEditingPage]         = useState(false)
  const [pageInput, setPageInput]             = useState('')
  const [feedbackMsg, setFeedbackMsg]         = useState(null)

  if (!book) return null

  const progress = book.pages > 0 ? Math.min(100, Math.round(((book.currentPage || 0) / book.pages) * 100)) : 0

  const showFeedback = (msg) => {
    setFeedbackMsg(msg)
    setTimeout(() => setFeedbackMsg(null), 2500)
  }

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${book.title}"? This cannot be undone.`)) {
      deleteBook(book.id)
      onClose()
    }
  }

  const handleEdit = () => {
    onClose()
    navigate(`/edit/${book.id}`)
  }

  const handleStatusChange = (newStatus) => {
    const updates = { status: newStatus }
    if (newStatus === 'Currently Reading' && !book.dateStarted) {
      updates.dateStarted = new Date().toISOString()
    } else if (newStatus === 'Finished') {
      if (!book.dateStarted) updates.dateStarted = new Date().toISOString()
      updates.dateFinished = new Date().toISOString()
      updates.currentPage = book.pages || book.currentPage
    }
    updateBook(book.id, updates)
    showFeedback(`Status set to "${newStatus}"`)
  }

  const handleSavePage = () => {
    const p = Math.max(0, Math.min(book.pages || 99999, parseInt(pageInput) || 0))
    const updates = { currentPage: p }
    if (book.pages > 0 && p >= book.pages) {
      updates.status = 'Finished'
      if (!book.dateFinished) updates.dateFinished = new Date().toISOString()
    } else if (p > 0 && book.status === 'Want to Read') {
      updates.status = 'Currently Reading'
      if (!book.dateStarted) updates.dateStarted = new Date().toISOString()
    }
    updateBook(book.id, updates)
    setEditingPage(false)
    showFeedback(`Page updated to ${p}`)
  }

  const handleStepPage = (delta) => {
    const cur = book.currentPage || 0
    const next = Math.max(0, Math.min(book.pages || 99999, cur + delta))
    const updates = { currentPage: next }
    if (book.pages > 0 && next >= book.pages) {
      updates.status = 'Finished'
      if (!book.dateFinished) updates.dateFinished = new Date().toISOString()
    }
    updateBook(book.id, updates)
  }

  const addQuote = (e) => {
    if (e) e.preventDefault()
    if (!newQuote.trim()) return
    const quotes = [...(book.favoriteQuotes || []), newQuote.trim()]
    updateBook(book.id, { favoriteQuotes: quotes })
    setNewQuote('')
    showFeedback('Quote added!')
  }

  const removeQuote = (idx) => {
    const quotes = (book.favoriteQuotes || []).filter((_, i) => i !== idx)
    updateBook(book.id, { favoriteQuotes: quotes })
    showFeedback('Quote removed')
  }

  const handleAddCollection = () => {
    if (!activeCollection) return
    addBookToCollection(activeCollection, book.id)
    const colName = collections.find(c => c.id === activeCollection)?.name || 'collection'
    setActiveCollection('')
    showFeedback(`Added to "${colName}"`)
  }

  const handleAddList = () => {
    if (!activeList) return
    addBookToList(activeList, book.id)
    const listName = readingLists.find(l => l.id === activeList)?.name || 'list'
    setActiveList('')
    showFeedback(`Added to "${listName}"`)
  }

  // Find which collections and lists this book is in
  const memberCollections = collections.filter(c => c.bookIds.includes(book.id))
  const memberLists       = readingLists.filter(l => l.bookIds.includes(book.id))

  const currentConfig = STATUS_CONFIG[book.status] || STATUS_CONFIG['Want to Read']

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

          {/* Modal Card */}
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
              overflow-hidden flex flex-col md:flex-row z-10
            "
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-stone-100/90 dark:bg-[#2a221a]/90 text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-[#e8ddd3] hover:bg-stone-200 dark:hover:bg-[#352b20] transition-colors shadow-sm backdrop-blur-sm cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* ── Left: Cover & Progress ── */}
            <div className="w-full md:w-72 shrink-0 bg-stone-100 dark:bg-[#16120e] flex flex-col items-center justify-between p-6 md:p-8 border-b md:border-b-0 md:border-r border-stone-200 dark:border-[#2e2720]">
              <div className="w-full max-w-[200px] md:max-w-none aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl dark:shadow-black/60 relative bg-stone-200 dark:bg-[#2a221a] group">
                {book.coverImage ? (
                  <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 dark:text-stone-600 gap-2">
                    <BookOpen size={44} />
                    <span className="text-xs font-semibold">No Cover</span>
                  </div>
                )}
                {/* Favorite Heart on Cover */}
                <button
                  type="button"
                  onClick={() => {
                    updateBook(book.id, { isFavorite: !book.isFavorite })
                    showFeedback(!book.isFavorite ? 'Marked as Favorite' : 'Removed from Favorites')
                  }}
                  className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-transform hover:scale-110 active:scale-95 cursor-pointer shadow-sm ${
                    book.isFavorite
                      ? 'bg-rose-500/90 text-white'
                      : 'bg-black/30 text-white/80 hover:text-white'
                  }`}
                  title={book.isFavorite ? 'Favorite' : 'Mark as Favorite'}
                >
                  <Heart size={16} fill={book.isFavorite ? 'currentColor' : 'none'} />
                </button>
              </div>

              {/* Progress Box under cover on desktop */}
              {book.pages > 0 && (
                <div className="w-full mt-5 p-3.5 rounded-2xl bg-white dark:bg-[#1f1a15] border border-stone-200 dark:border-[#2e2720] shadow-xs">
                  <div className="flex justify-between items-center text-xs text-stone-500 dark:text-stone-400 mb-1.5">
                    <span className="font-semibold">Reading Progress</span>
                    <span className="font-bold text-stone-700 dark:text-[#e8ddd3]">{progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-stone-100 dark:bg-[#2a221a] rounded-full overflow-hidden mb-2.5">
                    <div
                      className="h-full bg-accent-warm rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    <button
                      type="button"
                      onClick={() => handleStepPage(-10)}
                      disabled={(book.currentPage || 0) <= 0}
                      className="px-2 py-1 text-[10px] font-bold rounded-lg bg-stone-100 dark:bg-[#2a221a] text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-[#352b20] disabled:opacity-40 transition-colors cursor-pointer"
                    >
                      -10
                    </button>
                    {editingPage ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={pageInput}
                          onChange={(e) => setPageInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSavePage()}
                          placeholder={book.currentPage || 0}
                          min="0"
                          max={book.pages}
                          autoFocus
                          className="w-14 px-1.5 py-0.5 text-center text-xs font-bold rounded-md border border-accent-warm bg-white dark:bg-[#16120e] text-stone-800 dark:text-[#e8ddd3] focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={handleSavePage}
                          className="px-2 py-1 text-[10px] font-bold rounded-md bg-accent-warm text-white hover:bg-accent-dark transition-colors cursor-pointer"
                        >
                          ✓
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setPageInput(String(book.currentPage || 0))
                          setEditingPage(true)
                        }}
                        className="text-xs font-medium text-stone-600 dark:text-stone-400 hover:text-accent-warm transition-colors cursor-pointer underline decoration-dotted"
                        title="Click to edit current page"
                      >
                        {book.currentPage || 0} / {book.pages} pg
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleStepPage(10)}
                      disabled={(book.currentPage || 0) >= book.pages}
                      className="px-2 py-1 text-[10px] font-bold rounded-lg bg-stone-100 dark:bg-[#2a221a] text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-[#352b20] disabled:opacity-40 transition-colors cursor-pointer"
                    >
                      +10
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ── Right: Details & Tabs ── */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Header */}
              <div className="p-6 pb-3 border-b border-stone-100 dark:border-[#2e2720]">
                <div className="flex items-start justify-between mb-3 pr-12 md:pr-14">
                  <div className="flex-1 pr-3">
                    <h2 className="text-2xl font-extrabold text-stone-900 dark:text-[#e8ddd3] leading-tight line-clamp-2">
                      {book.title}
                    </h2>
                    <p className="text-base text-stone-500 dark:text-stone-400 mt-0.5">{book.author}</p>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        updateBook(book.id, { isFavorite: !book.isFavorite })
                        showFeedback(!book.isFavorite ? 'Added to favorites' : 'Removed from favorites')
                      }}
                      className={`p-2 rounded-xl transition-all cursor-pointer ${
                        book.isFavorite
                          ? 'text-rose-500 bg-rose-50 dark:bg-rose-900/20'
                          : 'text-stone-300 dark:text-stone-600 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20'
                      }`}
                      title={book.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <Heart size={18} fill={book.isFavorite ? 'currentColor' : 'none'} />
                    </button>
                    <button
                      type="button"
                      onClick={handleEdit}
                      className="p-2 rounded-xl text-stone-300 dark:text-stone-600 hover:text-accent-warm hover:bg-accent-warm/10 transition-all cursor-pointer"
                      title="Edit book"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="p-2 rounded-xl text-stone-300 dark:text-stone-600 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all cursor-pointer"
                      title="Delete book"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Genre badge + Star Rating */}
                <div className="flex flex-wrap items-center gap-3">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-stone-100 dark:bg-[#2a221a] text-stone-600 dark:text-stone-400">
                    {book.genre}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${currentConfig.badgeCls}`}>
                    {book.status}
                  </span>
                  <StarRating
                    rating={book.rating || 0}
                    onChange={(r) => {
                      updateBook(book.id, { rating: r })
                      showFeedback(r > 0 ? `Rated ${r} star${r > 1 ? 's' : ''}` : 'Rating cleared')
                    }}
                  />
                </div>

                {/* Toast Feedback */}
                <AnimatePresence>
                  {feedbackMsg && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="inline-flex items-center gap-1.5 px-3 py-1 mt-2 text-xs font-semibold rounded-lg bg-accent-warm/15 text-accent-warm border border-accent-warm/30"
                    >
                      <Check size={12} />
                      <span>{feedbackMsg}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Tabs */}
                <div className="flex gap-1.5 mt-4">
                  {['details', 'quotes', 'organize'].map((t) => (
                    <button key={t} type="button" onClick={() => setTab(t)} className={TAB_CLASSES(tab === t)}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                      {t === 'quotes' && (book.favoriteQuotes || []).length > 0 && (
                        <span className="ml-1.5 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-accent-warm text-white">
                          {book.favoriteQuotes.length}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto p-6 pt-4">

                {/* ── DETAILS TAB ── */}
                {tab === 'details' && (
                  <div className="space-y-6">
                    {/* Status Switcher - 4 Interactive Buttons */}
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-600 mb-2">
                        Update Reading Status
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {Object.entries(STATUS_CONFIG).map(([st, cfg]) => {
                          const Icon = cfg.icon
                          const isActive = book.status === st
                          return (
                            <button
                              key={st}
                              type="button"
                              onClick={() => handleStatusChange(st)}
                              className={`
                                py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-2 cursor-pointer
                                ${isActive
                                  ? `${cfg.activeCls} shadow-sm font-bold scale-[1.02]`
                                  : `border-stone-200 dark:border-[#2e2720] bg-stone-50/70 dark:bg-[#16120e] ${cfg.btnCls}`
                                }
                              `}
                            >
                              <Icon size={14} />
                              <span>{st === 'Currently Reading' ? 'Reading' : st}</span>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-600 mb-1.5">
                        Description
                      </p>
                      <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                        {book.description || 'No description provided.'}
                      </p>
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      {[
                        { icon: BookOpen,    text: `${book.pages || '—'} pages` },
                        { icon: Calendar,    text: `Published ${book.publicationYear || '—'}` },
                        { icon: Bookmark,    text: `Added ${new Date(book.dateAdded).toLocaleDateString()}` },
                        ...(book.dateStarted  ? [{ icon: Clock,        text: `Started ${new Date(book.dateStarted).toLocaleDateString()}` }] : []),
                        ...(book.dateFinished ? [{ icon: CheckCircle,  text: `Finished ${new Date(book.dateFinished).toLocaleDateString()}` }] : []),
                      ].map(({ icon: Icon, text }, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                          <Icon size={14} className="shrink-0 text-stone-400 dark:text-stone-600" />
                          <span>{text}</span>
                        </div>
                      ))}
                    </div>

                    {/* Notes */}
                    {book.personalNotes && (
                      <div className="p-4 rounded-2xl bg-stone-50 dark:bg-[#16120e] border border-stone-200 dark:border-[#2e2720]">
                        <p className="text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-600 mb-1.5">Personal Notes</p>
                        <p className="text-sm text-stone-600 dark:text-stone-400 italic leading-relaxed">"{book.personalNotes}"</p>
                      </div>
                    )}
                  </div>
                )}

                {/* ── QUOTES TAB ── */}
                {tab === 'quotes' && (
                  <div className="space-y-5">
                    <form onSubmit={addQuote} className="flex gap-2">
                      <textarea
                        rows={2}
                        value={newQuote}
                        onChange={(e) => setNewQuote(e.target.value)}
                        placeholder="Add a favorite quote from this book…"
                        className="flex-1 px-3.5 py-2.5 rounded-xl text-sm border border-stone-200 dark:border-[#2e2720] bg-white dark:bg-[#16120e] text-stone-800 dark:text-[#e8ddd3] placeholder-stone-400 dark:placeholder-stone-600 focus:ring-2 focus:ring-accent-warm focus:outline-none resize-none"
                      />
                      <button
                        type="submit"
                        disabled={!newQuote.trim()}
                        className="px-4 py-2 bg-accent-warm hover:bg-accent-dark disabled:opacity-40 text-white rounded-xl font-bold shrink-0 transition-all self-end cursor-pointer flex items-center gap-1.5"
                      >
                        <Plus size={16} />
                        <span>Add</span>
                      </button>
                    </form>

                    {(book.favoriteQuotes || []).length > 0 ? (
                      <div className="space-y-3">
                        {book.favoriteQuotes.map((q, i) => (
                          <div
                            key={i}
                            className="group flex items-start gap-3 p-4 bg-stone-50 dark:bg-[#16120e] border border-stone-200 dark:border-[#2e2720] rounded-2xl"
                          >
                            <Quote size={18} className="text-accent-warm shrink-0 mt-0.5" />
                            <p className="flex-1 text-sm text-stone-700 dark:text-stone-300 italic leading-relaxed">"{q}"</p>
                            <button
                              type="button"
                              onClick={() => removeQuote(i)}
                              className="opacity-70 hover:opacity-100 p-1 text-stone-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all shrink-0 cursor-pointer"
                              title="Delete quote"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 rounded-2xl bg-stone-50 dark:bg-[#16120e] border-2 border-dashed border-stone-200 dark:border-[#2e2720]">
                        <Quote size={32} className="mx-auto text-stone-300 dark:text-stone-700 mb-2" />
                        <p className="text-sm font-semibold text-stone-600 dark:text-stone-400 mb-1">No quotes saved yet</p>
                        <p className="text-xs text-stone-400 dark:text-stone-600">Type a favorite quote above to save it here.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* ── ORGANIZE TAB ── */}
                {tab === 'organize' && (
                  <div className="space-y-6">
                    {/* Collections membership */}
                    <div className="p-4 rounded-2xl bg-stone-50 dark:bg-[#16120e] border border-stone-200 dark:border-[#2e2720]">
                      <p className="text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-600 mb-3 flex items-center gap-1.5">
                        <Layers size={13} /> Collections
                      </p>

                      {/* Chips of current collections */}
                      {memberCollections.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3.5">
                          {memberCollections.map((col) => (
                            <span
                              key={col.id}
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-accent-warm/15 text-accent-warm border border-accent-warm/30"
                            >
                              <span>{col.name}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  removeBookFromCollection(col.id, book.id)
                                  showFeedback(`Removed from "${col.name}"`)
                                }}
                                className="hover:text-rose-500 cursor-pointer"
                                title="Remove from collection"
                              >
                                <X size={12} />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex gap-2">
                        <select
                          value={activeCollection}
                          onChange={(e) => setActiveCollection(e.target.value)}
                          className="flex-1 px-3 py-2 rounded-xl border border-stone-200 dark:border-[#2e2720] bg-white dark:bg-[#1f1a15] text-sm text-stone-800 dark:text-stone-300 focus:ring-2 focus:ring-accent-warm focus:outline-none"
                        >
                          <option value="">Choose a collection…</option>
                          {collections
                            .filter(c => !c.bookIds.includes(book.id))
                            .map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        <button
                          type="button"
                          disabled={!activeCollection}
                          onClick={handleAddCollection}
                          className="px-4 py-2 bg-stone-800 dark:bg-accent-warm disabled:opacity-40 text-white rounded-xl text-xs font-bold hover:bg-stone-700 dark:hover:bg-accent-dark transition-all cursor-pointer"
                        >
                          Add
                        </button>
                      </div>
                      {collections.length === 0 && (
                        <p className="text-xs text-stone-400 dark:text-stone-600 mt-2">
                          No collections yet. Create collections on the Collections page.
                        </p>
                      )}
                    </div>

                    {/* Reading Lists membership */}
                    <div className="p-4 rounded-2xl bg-stone-50 dark:bg-[#16120e] border border-stone-200 dark:border-[#2e2720]">
                      <p className="text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-600 mb-3 flex items-center gap-1.5">
                        <Bookmark size={13} /> Reading Lists
                      </p>

                      {/* Chips of current reading lists */}
                      {memberLists.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3.5">
                          {memberLists.map((l) => (
                            <span
                              key={l.id}
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                            >
                              <span>{l.name}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  removeBookFromList(l.id, book.id)
                                  showFeedback(`Removed from "${l.name}"`)
                                }}
                                className="hover:text-rose-500 cursor-pointer"
                                title="Remove from list"
                              >
                                <X size={12} />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex gap-2">
                        <select
                          value={activeList}
                          onChange={(e) => setActiveList(e.target.value)}
                          className="flex-1 px-3 py-2 rounded-xl border border-stone-200 dark:border-[#2e2720] bg-white dark:bg-[#1f1a15] text-sm text-stone-800 dark:text-stone-300 focus:ring-2 focus:ring-accent-warm focus:outline-none"
                        >
                          <option value="">Choose a reading list…</option>
                          {readingLists
                            .filter(l => !l.bookIds.includes(book.id))
                            .map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                        </select>
                        <button
                          type="button"
                          disabled={!activeList}
                          onClick={handleAddList}
                          className="px-4 py-2 bg-stone-800 dark:bg-accent-warm disabled:opacity-40 text-white rounded-xl text-xs font-bold hover:bg-stone-700 dark:hover:bg-accent-dark transition-all cursor-pointer"
                        >
                          Add
                        </button>
                      </div>
                      {readingLists.length === 0 && (
                        <p className="text-xs text-stone-400 dark:text-stone-600 mt-2">
                          No reading lists yet. Create lists on the Reading Lists page.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default BookDetailModal
