import React, { useState } from 'react'
import { Layers, Trash2, Plus, BookOpen, X, ChevronRight, ArrowLeft } from 'lucide-react'
import { useLibrary } from '../context/LibraryContext'
import { motion, AnimatePresence } from 'framer-motion'
import BookDetailModal from '../components/bookshelf/BookDetailModal'

const CollectionManager = () => {
  const { collections, addCollection, removeCollection, removeBookFromCollection, books } = useLibrary()
  const [newColName, setNewColName]         = useState('')
  const [activeColId, setActiveColId]       = useState(null)
  const [selectedBook, setSelectedBook]     = useState(null)
  const [isModalOpen, setIsModalOpen]       = useState(false)

  const handleCreate = (e) => {
    e.preventDefault()
    if (!newColName.trim()) return
    addCollection(newColName.trim())
    setNewColName('')
  }

  const handleOpenBook = (book) => {
    setSelectedBook(book)
    setIsModalOpen(true)
  }

  const activeCollection = collections.find(c => c.id === activeColId)
  const activeColBooks   = activeCollection ? books.filter(b => activeCollection.bookIds.includes(b.id)) : []

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      {activeCollection ? (
        /* ── Drilldown view of active collection ── */
        <div>
          <button
            type="button"
            onClick={() => setActiveColId(null)}
            className="mb-6 flex items-center gap-2 text-sm font-semibold text-stone-600 dark:text-stone-400 hover:text-accent-warm transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Back to All Collections</span>
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white dark:bg-[#1f1a15] border border-stone-200 dark:border-[#2e2720] rounded-2xl shadow-sm mb-8">
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-accent-warm/15 rounded-2xl text-accent-warm shrink-0">
                <Layers size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-stone-800 dark:text-[#e8ddd3]">{activeCollection.name}</h2>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  {activeColBooks.length} {activeColBooks.length === 1 ? 'book' : 'books'} in this collection
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                if (window.confirm(`Delete collection "${activeCollection.name}"? (Books will not be deleted)`)) {
                  removeCollection(activeCollection.id)
                  setActiveColId(null)
                }
              }}
              className="px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 border border-rose-200 dark:border-rose-900/40 rounded-xl transition-all self-start sm:self-auto cursor-pointer"
            >
              Delete Collection
            </button>
          </div>

          {activeColBooks.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {activeColBooks.map(book => (
                <div key={book.id} className="group relative">
                  <div
                    onClick={() => handleOpenBook(book)}
                    className="aspect-[2/3] rounded-2xl overflow-hidden shadow-sm mb-2 bg-stone-200 dark:bg-[#2a221a] border border-stone-200/50 dark:border-[#2e2720]/50 cursor-pointer"
                  >
                    {book.coverImage ? (
                      <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-400"><BookOpen size={24} /></div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeBookFromCollection(activeCollection.id, book.id)
                    }}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white/80 hover:text-white hover:bg-rose-600 transition-all opacity-0 group-hover:opacity-100 shadow-md cursor-pointer"
                    title="Remove from collection"
                  >
                    <X size={12} />
                  </button>
                  <h4 onClick={() => handleOpenBook(book)} className="text-xs font-semibold text-stone-800 dark:text-[#e8ddd3] line-clamp-2 leading-tight group-hover:text-accent-warm transition-colors cursor-pointer">
                    {book.title}
                  </h4>
                  <p className="text-[10px] text-stone-400 dark:text-stone-600 truncate">{book.author}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 rounded-3xl border-2 border-dashed border-stone-200 dark:border-[#2e2720] bg-stone-50/50 dark:bg-[#16120e]/50">
              <p className="text-sm font-semibold text-stone-600 dark:text-stone-400 mb-1">This collection is empty</p>
              <p className="text-xs text-stone-400 dark:text-stone-600">Open any book on the bookshelf and use the "Organize" tab to add it here.</p>
            </div>
          )}
        </div>
      ) : (
        /* ── All collections overview ── */
        <>
          <header className="mb-10">
            <h1 className="text-4xl font-extrabold text-stone-800 dark:text-[#e8ddd3]">Collections</h1>
            <p className="text-stone-500 dark:text-stone-500 mt-2">Organize your library into curated groups.</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Create panel */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white dark:bg-[#1f1a15] rounded-2xl border border-stone-200 dark:border-[#2e2720] p-6 shadow-sm">
                <h2 className="text-lg font-bold text-stone-800 dark:text-[#e8ddd3] mb-4">New Collection</h2>
                <form onSubmit={handleCreate} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-600 mb-1.5">
                      Name
                    </label>
                    <input
                      type="text"
                      value={newColName}
                      onChange={(e) => setNewColName(e.target.value)}
                      placeholder="e.g. Summer 2026 Reads"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-[#2e2720] bg-stone-50 dark:bg-[#16120e] text-stone-800 dark:text-[#e8ddd3] placeholder-stone-400 dark:placeholder-stone-600 focus:ring-2 focus:ring-accent-warm focus:outline-none transition-all text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!newColName.trim()}
                    className="w-full py-2.5 px-4 bg-accent-warm hover:bg-accent-dark disabled:opacity-40 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-md shadow-accent-warm/20 cursor-pointer"
                  >
                    <Plus size={16} />
                    Create Collection
                  </button>
                </form>
              </div>
            </div>

            {/* Collections grid */}
            <div className="lg:col-span-2">
              {collections.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {collections.map(col => {
                    const colBooks = books.filter(b => col.bookIds.includes(b.id))
                    return (
                      <div
                        key={col.id}
                        onClick={() => setActiveColId(col.id)}
                        className="bg-white dark:bg-[#1f1a15] border border-stone-200 dark:border-[#2e2720] rounded-2xl p-5 hover:shadow-md dark:hover:shadow-black/30 transition-all group cursor-pointer"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-accent-warm/10 rounded-lg text-accent-warm">
                              <Layers size={18} />
                            </div>
                            <h3 className="font-bold text-stone-800 dark:text-[#e8ddd3] group-hover:text-accent-warm transition-colors">{col.name}</h3>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              if (window.confirm(`Delete collection "${col.name}"?`)) {
                                removeCollection(col.id)
                              }
                            }}
                            className="p-1.5 rounded-lg text-stone-300 dark:text-stone-700 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors cursor-pointer"
                            title="Delete collection"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                        <p className="text-xs text-stone-400 dark:text-stone-600 mb-3">
                          {colBooks.length} {colBooks.length === 1 ? 'book' : 'books'}
                        </p>
                        {/* Tiny cover strip */}
                        <div className="flex gap-1.5 items-center">
                          {colBooks.slice(0, 6).map(b => (
                            <div
                              key={b.id}
                              className="w-8 h-11 rounded-md overflow-hidden bg-stone-200 dark:bg-[#2a221a] shadow-xs"
                              title={b.title}
                            >
                              {b.coverImage ? (
                                <img src={b.coverImage} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-stone-400"><BookOpen size={10} /></div>
                              )}
                            </div>
                          ))}
                          {colBooks.length > 6 && (
                            <div className="w-8 h-11 rounded-md bg-stone-100 dark:bg-[#2a221a] flex items-center justify-center text-[10px] font-bold text-stone-400 dark:text-stone-600">
                              +{colBooks.length - 6}
                            </div>
                          )}
                          <div className="ml-auto text-stone-400 group-hover:text-accent-warm transition-colors">
                            <ChevronRight size={16} />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-24 rounded-3xl border-2 border-dashed border-stone-200 dark:border-[#2e2720] bg-stone-50/50 dark:bg-[#16120e]/50">
                  <div className="p-5 rounded-full bg-stone-100 dark:bg-[#2a221a] mb-4">
                    <Layers size={32} className="text-stone-300 dark:text-stone-700" />
                  </div>
                  <h3 className="text-lg font-bold text-stone-700 dark:text-stone-400 mb-1">No collections yet</h3>
                  <p className="text-sm text-stone-400 dark:text-stone-600 text-center max-w-xs">
                    Create your first collection to group your books by theme, mood, or goal.
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <BookDetailModal
        book={selectedBook}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}

export default CollectionManager
