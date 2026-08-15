import React, { useState } from 'react'
import { Plus, Trash2, BookOpen, List, X } from 'lucide-react'
import { useLibrary } from '../context/LibraryContext'
import { motion, AnimatePresence } from 'framer-motion'
import BookDetailModal from '../components/bookshelf/BookDetailModal'

const ReadingLists = () => {
  const { readingLists, addReadingList, removeReadingList, removeBookFromList, books } = useLibrary()
  const [name,        setName]        = useState('')
  const [description, setDescription] = useState('')
  const [expandedId,  setExpandedId]  = useState(null)
  const [selectedBook, setSelectedBook] = useState(null)
  const [isModalOpen, setIsModalOpen]   = useState(false)

  const handleCreate = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    addReadingList(name.trim(), description.trim())
    setName('')
    setDescription('')
  }

  const handleOpenBook = (book) => {
    setSelectedBook(book)
    setIsModalOpen(true)
  }

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold text-stone-800 dark:text-[#e8ddd3]">Reading Lists</h1>
        <p className="text-stone-500 dark:text-stone-500 mt-1">Create ordered lists for goals, challenges, or themes — separate from your collections.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ── Create Panel ── */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white dark:bg-[#1f1a15] border border-stone-200 dark:border-[#2e2720] rounded-2xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-stone-800 dark:text-[#e8ddd3] mb-4">New Reading List</h2>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-600 mb-1">Name</label>
                <input
                  type="text" value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. 2026 Reading Challenge"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-[#2e2720] bg-stone-50 dark:bg-[#16120e] text-stone-800 dark:text-[#e8ddd3] placeholder-stone-400 dark:placeholder-stone-600 focus:ring-2 focus:ring-accent-warm focus:outline-none text-sm transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-600 mb-1">Description (optional)</label>
                <input
                  type="text" value={description} onChange={(e) => setDescription(e.target.value)}
                  placeholder="What's this list for?"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-[#2e2720] bg-stone-50 dark:bg-[#16120e] text-stone-800 dark:text-[#e8ddd3] placeholder-stone-400 dark:placeholder-stone-600 focus:ring-2 focus:ring-accent-warm focus:outline-none text-sm transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={!name.trim()}
                className="w-full py-2.5 bg-accent-warm hover:bg-accent-dark disabled:opacity-40 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-md shadow-accent-warm/20 cursor-pointer"
              >
                <Plus size={16} /> Create List
              </button>
            </form>
          </div>
        </div>

        {/* ── Lists ── */}
        <div className="lg:col-span-2 space-y-4">
          {readingLists.length > 0 ? readingLists.map(list => {
            const listBooks = books.filter(b => list.bookIds.includes(b.id))
            const doneCount = listBooks.filter(b => b.status === 'Finished').length
            const pct = listBooks.length ? Math.round((doneCount / listBooks.length) * 100) : 0
            const isExpanded = expandedId === list.id

            return (
              <motion.div
                key={list.id}
                layout
                className="bg-white dark:bg-[#1f1a15] border border-stone-200 dark:border-[#2e2720] rounded-2xl overflow-hidden shadow-sm"
              >
                {/* Header row */}
                <div
                  className="flex items-center gap-4 p-5 cursor-pointer hover:bg-stone-50 dark:hover:bg-[#27211a] transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : list.id)}
                >
                  <div className="p-2.5 bg-accent-warm/10 rounded-xl text-accent-warm shrink-0">
                    <List size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-stone-800 dark:text-[#e8ddd3] truncate">{list.name}</h3>
                      <span className="text-xs text-stone-400 dark:text-stone-600 shrink-0">{listBooks.length} books</span>
                    </div>
                    {list.description && (
                      <p className="text-xs text-stone-500 dark:text-stone-600 mt-0.5 truncate">{list.description}</p>
                    )}
                    {/* Progress bar */}
                    {listBooks.length > 0 && (
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex-1 h-1.5 bg-stone-100 dark:bg-[#2a221a] rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-[10px] text-stone-400 dark:text-stone-600 shrink-0">{doneCount}/{listBooks.length} read</span>
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removeReadingList(list.id) }}
                    className="p-1.5 rounded-lg text-stone-300 dark:text-stone-700 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors shrink-0 cursor-pointer"
                    title="Delete reading list"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                {/* Expanded book list */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden border-t border-stone-100 dark:border-[#2e2720]"
                    >
                      <div className="p-4 space-y-2">
                        {listBooks.length > 0 ? listBooks.map((book, i) => (
                          <div
                            key={book.id}
                            onClick={() => handleOpenBook(book)}
                            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-stone-50 dark:hover:bg-[#27211a] group transition-colors cursor-pointer"
                          >
                            <span className="text-xs font-bold text-stone-300 dark:text-stone-700 w-5 shrink-0">{i + 1}</span>
                            <div className="w-8 h-10 rounded overflow-hidden bg-stone-200 dark:bg-[#2a221a] shrink-0 shadow-sm">
                              {book.coverImage
                                ? <img src={book.coverImage} alt="" className="w-full h-full object-cover" />
                                : <div className="w-full h-full flex items-center justify-center"><BookOpen size={12} className="text-stone-400" /></div>
                              }
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-stone-800 dark:text-[#e8ddd3] group-hover:text-accent-warm transition-colors truncate">{book.title}</p>
                              <p className="text-xs text-stone-400 dark:text-stone-600 truncate">{book.author}</p>
                            </div>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                              book.status === 'Finished' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                              : book.status === 'Currently Reading' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                              : 'bg-stone-100 text-stone-500 dark:bg-[#2a221a] dark:text-stone-500'
                            }`}>
                              {book.status === 'Currently Reading' ? 'Reading' : book.status}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                removeBookFromList(list.id, book.id)
                              }}
                              className="opacity-0 group-hover:opacity-100 p-1 text-stone-300 dark:text-stone-700 hover:text-rose-500 transition-all shrink-0 cursor-pointer"
                              title="Remove from list"
                            >
                              <X size={13} />
                            </button>
                          </div>
                        )) : (
                          <p className="text-center text-sm text-stone-400 dark:text-stone-600 py-4">
                            No books added yet. Open a book's detail panel and add it to this list.
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          }) : (
            <div className="flex flex-col items-center justify-center py-24 rounded-3xl border-2 border-dashed border-stone-200 dark:border-[#2e2720] bg-stone-50/50 dark:bg-[#16120e]/50">
              <div className="p-5 rounded-full bg-stone-100 dark:bg-[#2a221a] mb-4">
                <List size={32} className="text-stone-300 dark:text-stone-700" />
              </div>
              <h3 className="text-lg font-bold text-stone-700 dark:text-stone-400 mb-1">No reading lists yet</h3>
              <p className="text-sm text-stone-400 dark:text-stone-600 text-center max-w-xs">
                Create your first reading list — a 2026 challenge, a themed list, or books to read before a trip.
              </p>
            </div>
          )}
        </div>
      </div>

      <BookDetailModal
        book={selectedBook}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}

export default ReadingLists
