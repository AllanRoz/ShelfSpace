import React, { useState } from 'react'
import { Layers, Trash2, Plus } from 'lucide-react'
import { useLibrary } from '../context/LibraryContext'
import { Card, Section } from '../components/ui/DashboardUI'

const CollectionManager = () => {
  const { collections, addCollection, removeCollection, books } = useLibrary()
  const [newColName, setNewColName] = useState('')

  const handleCreate = (e) => {
    e.preventDefault()
    if (!newColName.trim()) return
    addCollection(newColName.trim())
    setNewColName('')
  }

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-stone-800 dark:text-[#e8ddd3]">Collections</h1>
        <p className="text-stone-500 dark:text-stone-500 mt-2">Organize your library into curated groups.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ── Create panel ── */}
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
                className="w-full py-2.5 px-4 bg-accent-warm hover:bg-accent-dark text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-md shadow-accent-warm/20"
              >
                <Plus size={16} />
                Create Collection
              </button>
            </form>
          </div>
        </div>

        {/* ── Collections grid ── */}
        <div className="lg:col-span-2">
          {collections.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {collections.map(col => {
                const colBooks = books.filter(b => col.bookIds.includes(b.id))
                return (
                  <div
                    key={col.id}
                    className="bg-white dark:bg-[#1f1a15] border border-stone-200 dark:border-[#2e2720] rounded-2xl p-5 hover:shadow-md dark:hover:shadow-black/30 transition-all group"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-accent-warm/10 dark:bg-accent-warm/10 rounded-lg text-accent-warm">
                          <Layers size={18} />
                        </div>
                        <h3 className="font-bold text-stone-800 dark:text-[#e8ddd3]">{col.name}</h3>
                      </div>
                      <button
                        onClick={() => removeCollection(col.id)}
                        className="p-1.5 rounded-lg text-stone-300 dark:text-stone-700 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                    <p className="text-xs text-stone-400 dark:text-stone-600 mb-3">
                      {colBooks.length} {colBooks.length === 1 ? 'book' : 'books'}
                    </p>
                    {/* Tiny cover strip */}
                    <div className="flex gap-1">
                      {colBooks.slice(0, 7).map(b => (
                        <div
                          key={b.id}
                          className="w-7 h-10 rounded overflow-hidden bg-stone-200 dark:bg-[#2a221a] shadow-sm"
                          title={b.title}
                        >
                          <img src={b.coverImage} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                      {colBooks.length > 7 && (
                        <div className="w-7 h-10 rounded bg-stone-100 dark:bg-[#2a221a] flex items-center justify-center text-[9px] font-bold text-stone-400 dark:text-stone-600">
                          +{colBooks.length - 7}
                        </div>
                      )}
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
    </div>
  )
}

export default CollectionManager
