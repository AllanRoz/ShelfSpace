import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, Star, BookOpen, Calendar, Bookmark, Trash2, Edit3,
  CheckCircle, Clock, Heart, Plus, Quote, Layers
} from 'lucide-react'
import { useLibrary } from '../../context/LibraryContext'
import { useNavigate } from 'react-router-dom'

const StarRating = ({ rating, onChange }) => (
  <div className="flex gap-1">
    {[1,2,3,4,5].map(n => (
      <button
        key={n}
        type="button"
        onClick={() => onChange(n === rating ? 0 : n)}
        className={`text-xl transition-colors ${n <= rating ? 'text-amber-400' : 'text-stone-300 dark:text-stone-700'} hover:text-amber-400`}
      >
        ★
      </button>
    ))}
  </div>
)

const TAB_CLASSES = (active) =>
  `px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
    active
      ? 'bg-accent-warm/15 dark:bg-accent-warm/10 text-accent-warm border border-accent-warm/20'
      : 'text-stone-500 dark:text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
  }`

const BookDetailModal = ({ book, isOpen, onClose }) => {
  const { updateBook, deleteBook, collections, readingLists, addBookToCollection, addBookToList } = useLibrary()
  const navigate = useNavigate()

  const [tab,             setTab]             = useState('details')
  const [newQuote,        setNewQuote]        = useState('')
  const [activeCollection, setActiveCollection] = useState('')
  const [activeList,      setActiveList]      = useState('')

  if (!book) return null

  const progress = book.pages > 0 ? Math.min(100, Math.round((book.currentPage / book.pages) * 100)) : 0

  const handleDelete = () => {
    if (window.confirm(`Delete "${book.title}"? This cannot be undone.`)) {
      deleteBook(book.id)
      onClose()
    }
  }

  const handleEdit = () => {
    onClose()
    navigate(`/edit/${book.id}`)
  }

  const addQuote = () => {
    if (!newQuote.trim()) return
    const quotes = [...(book.favoriteQuotes || []), newQuote.trim()]
    updateBook(book.id, { favoriteQuotes: quotes })
    setNewQuote('')
  }

  const removeQuote = (idx) => {
    const quotes = (book.favoriteQuotes || []).filter((_, i) => i !== idx)
    updateBook(book.id, { favoriteQuotes: quotes })
  }

  const statusBadge = {
    'Finished':          'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    'Currently Reading': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'DNF':               'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  }[book.status] || 'bg-stone-100 text-stone-600 dark:bg-[#2a221a] dark:text-stone-400'

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-stone-950/70 dark:bg-black/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 24 }}
            transition={{ type: 'spring', stiffness: 340, damping: 30 }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-[#1f1a15] border border-stone-200 dark:border-[#2e2720] rounded-3xl shadow-2xl dark:shadow-black/60 overflow-hidden flex flex-col md:flex-row"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-stone-100/90 dark:bg-[#2a221a]/90 text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-[#e8ddd3] hover:bg-stone-200 dark:hover:bg-[#352b20] transition-colors shadow-sm backdrop-blur-sm"
            >
              <X size={18} />
            </button>

            {/* ── Left: Cover ── */}
            <div className="w-full md:w-72 shrink-0 bg-stone-100 dark:bg-[#16120e] flex items-center justify-center p-8">
              <div className="w-full aspect-[2/3] rounded-xl overflow-hidden shadow-2xl dark:shadow-black/60 relative">
                {book.coverImage
                  ? <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
                  : <div className="w-full h-full bg-stone-200 dark:bg-[#2a221a] flex items-center justify-center text-stone-400"><BookOpen size={48} /></div>
                }
                {book.status === 'Currently Reading' && book.pages > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <div className="flex justify-between text-xs text-white/80 mb-1.5">
                      <span>{progress}% done</span>
                      <span>{book.currentPage}/{book.pages} pg</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-accent-warm rounded-full" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── Right: Details ── */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Header */}
              <div className="p-6 pb-3 border-b border-stone-100 dark:border-[#2e2720]">
                <div className="flex items-start justify-between mb-3 pr-12 md:pr-14">
                  <div className="flex-1 pr-3">
                    <h2 className="text-2xl font-extrabold text-stone-900 dark:text-[#e8ddd3] leading-tight">{book.title}</h2>
                    <p className="text-base text-stone-500 dark:text-stone-400 mt-0.5">{book.author}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => updateBook(book.id, { isFavorite: !book.isFavorite })}
                      className={`p-2 rounded-xl transition-all ${book.isFavorite ? 'text-rose-500 bg-rose-50 dark:bg-rose-900/20' : 'text-stone-300 dark:text-stone-600 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20'}`}
                      title={book.isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
                      <Heart size={18} fill={book.isFavorite ? 'currentColor' : 'none'} />
                    </button>
                    <button onClick={handleEdit} className="p-2 rounded-xl text-stone-300 dark:text-stone-600 hover:text-accent-warm hover:bg-accent-warm/10 transition-all" title="Edit book">
                      <Edit3 size={18} />
                    </button>
                    <button onClick={handleDelete} className="p-2 rounded-xl text-stone-300 dark:text-stone-600 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all" title="Delete book">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Badges + star rating */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-stone-100 dark:bg-[#2a221a] text-stone-600 dark:text-stone-400">{book.genre}</span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusBadge}`}>{book.status}</span>
                  <StarRating
                    rating={book.rating || 0}
                    onChange={(r) => updateBook(book.id, { rating: r })}
                  />
                </div>

                {/* Tabs */}
                <div className="flex gap-1 mt-4">
                  {['details','quotes','organize'].map(t => (
                    <button key={t} onClick={() => setTab(t)} className={TAB_CLASSES(tab === t)}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto p-6 pt-4">

                {/* ── DETAILS TAB ── */}
                {tab === 'details' && (
                  <div className="space-y-5">
                    <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                      {book.description || 'No description provided.'}
                    </p>

                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { icon: BookOpen,    text: `${book.pages || '—'} pages` },
                        { icon: Calendar,    text: `Published ${book.publicationYear || '—'}` },
                        { icon: Bookmark,    text: `Added ${new Date(book.dateAdded).toLocaleDateString()}` },
                        ...(book.dateStarted  ? [{ icon: Clock,        text: `Started ${new Date(book.dateStarted).toLocaleDateString()}` }] : []),
                        ...(book.dateFinished ? [{ icon: CheckCircle,  text: `Finished ${new Date(book.dateFinished).toLocaleDateString()}` }] : []),
                      ].map(({ icon: Icon, text }, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-stone-500 dark:text-stone-500">
                          <Icon size={14} className="shrink-0 text-stone-400 dark:text-stone-600" />
                          <span>{text}</span>
                        </div>
                      ))}
                    </div>

                    {book.personalNotes && (
                      <div className="p-4 rounded-xl bg-stone-50 dark:bg-[#16120e] border border-stone-200 dark:border-[#2e2720]">
                        <p className="text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-600 mb-2">Personal Notes</p>
                        <p className="text-sm text-stone-600 dark:text-stone-400 italic leading-relaxed">"{book.personalNotes}"</p>
                      </div>
                    )}

                    {/* Quick status actions */}
                    <div className="flex gap-3 pt-2">
                      <button onClick={() => updateBook(book.id, { status: 'Currently Reading', dateStarted: book.dateStarted || new Date().toISOString() })}
                        className="flex-1 py-2.5 px-3 rounded-xl text-sm font-semibold bg-stone-100 dark:bg-[#2a221a] text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-[#352b20] transition-all flex items-center justify-center gap-2">
                        <Clock size={15} /> Reading
                      </button>
                      <button onClick={() => updateBook(book.id, { status: 'Finished', dateFinished: book.dateFinished || new Date().toISOString() })}
                        className="flex-1 py-2.5 px-3 rounded-xl text-sm font-semibold bg-accent-warm hover:bg-accent-dark text-white transition-all flex items-center justify-center gap-2 shadow-md shadow-accent-warm/20">
                        <CheckCircle size={15} /> Finished
                      </button>
                    </div>
                  </div>
                )}

                {/* ── QUOTES TAB ── */}
                {tab === 'quotes' && (
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <textarea
                        rows={2}
                        value={newQuote}
                        onChange={(e) => setNewQuote(e.target.value)}
                        placeholder="Add a favourite quote from this book…"
                        className="flex-1 px-3 py-2 rounded-xl text-sm border border-stone-200 dark:border-[#2e2720] bg-white dark:bg-[#16120e] text-stone-800 dark:text-[#e8ddd3] placeholder-stone-400 dark:placeholder-stone-600 focus:ring-2 focus:ring-accent-warm focus:outline-none resize-none"
                      />
                      <button onClick={addQuote} className="px-3 py-2 bg-accent-warm hover:bg-accent-dark text-white rounded-xl shrink-0 transition-all self-end">
                        <Plus size={18} />
                      </button>
                    </div>

                    {(book.favoriteQuotes || []).length > 0 ? (
                      <div className="space-y-3">
                        {book.favoriteQuotes.map((q, i) => (
                          <div key={i} className="group flex items-start gap-3 p-4 bg-stone-50 dark:bg-[#16120e] border border-stone-200 dark:border-[#2e2720] rounded-xl">
                            <Quote size={16} className="text-accent-warm shrink-0 mt-0.5" />
                            <p className="flex-1 text-sm text-stone-700 dark:text-stone-300 italic leading-relaxed">"{q}"</p>
                            <button onClick={() => removeQuote(i)} className="opacity-0 group-hover:opacity-100 text-stone-300 dark:text-stone-700 hover:text-rose-500 transition-all shrink-0">
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-10 rounded-xl bg-stone-50 dark:bg-[#16120e] border-2 border-dashed border-stone-200 dark:border-[#2e2720]">
                        <Quote size={28} className="mx-auto text-stone-300 dark:text-stone-700 mb-2" />
                        <p className="text-sm text-stone-400 dark:text-stone-600">No quotes saved yet.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* ── ORGANIZE TAB ── */}
                {tab === 'organize' && (
                  <div className="space-y-5">
                    {/* Add to Collection */}
                    <div className="p-4 rounded-xl bg-stone-50 dark:bg-[#16120e] border border-stone-200 dark:border-[#2e2720]">
                      <p className="text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-600 mb-3 flex items-center gap-1.5">
                        <Layers size={12} /> Add to Collection
                      </p>
                      <div className="flex gap-2">
                        <select value={activeCollection} onChange={(e) => setActiveCollection(e.target.value)}
                          className="flex-1 px-3 py-2 rounded-lg border border-stone-200 dark:border-[#2e2720] bg-white dark:bg-[#1f1a15] text-sm text-stone-800 dark:text-stone-300 focus:ring-2 focus:ring-accent-warm focus:outline-none">
                          <option value="">Select a collection…</option>
                          {collections.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        <button onClick={() => { if (!activeCollection) return; addBookToCollection(activeCollection, book.id); setActiveCollection('') }}
                          className="px-4 py-2 bg-stone-800 dark:bg-accent-warm text-white rounded-lg text-sm font-bold hover:bg-stone-700 dark:hover:bg-accent-dark transition-all">
                          Add
                        </button>
                      </div>
                      {collections.length === 0 && <p className="text-xs text-stone-400 dark:text-stone-600 mt-2">No collections yet. Create one on the Collections page.</p>}
                    </div>

                    {/* Add to Reading List */}
                    <div className="p-4 rounded-xl bg-stone-50 dark:bg-[#16120e] border border-stone-200 dark:border-[#2e2720]">
                      <p className="text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-600 mb-3 flex items-center gap-1.5">
                        <Bookmark size={12} /> Add to Reading List
                      </p>
                      <div className="flex gap-2">
                        <select value={activeList} onChange={(e) => setActiveList(e.target.value)}
                          className="flex-1 px-3 py-2 rounded-lg border border-stone-200 dark:border-[#2e2720] bg-white dark:bg-[#1f1a15] text-sm text-stone-800 dark:text-stone-300 focus:ring-2 focus:ring-accent-warm focus:outline-none">
                          <option value="">Select a reading list…</option>
                          {readingLists.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                        </select>
                        <button onClick={() => { if (!activeList) return; addBookToList(activeList, book.id); setActiveList('') }}
                          className="px-4 py-2 bg-stone-800 dark:bg-accent-warm text-white rounded-lg text-sm font-bold hover:bg-stone-700 dark:hover:bg-accent-dark transition-all">
                          Add
                        </button>
                      </div>
                      {readingLists.length === 0 && <p className="text-xs text-stone-400 dark:text-stone-600 mt-2">No reading lists yet. Create one on the Reading Lists page.</p>}
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
