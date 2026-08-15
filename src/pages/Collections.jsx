import React, { useState } from 'react'
import { useLibrary } from '../context/LibraryContext'
import { Card, Section } from '../components/ui/DashboardUI'
import { Book, Trash2, Plus, X, Save } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const CollectionManager = () => {
  const { 
    collections, 
    addCollection, 
    removeCollection, 
    books 
  } = useLibrary()
  
  const [newColName, setNewColName] = useState('')

  const handleCreate = (e) => {
    e.preventDefault()
    if (!newColName.trim()) return
    addCollection(newColName)
    setNewColName('')
  }

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-stone-800 dark:text-stone-100">Collections</h1>
        <p className="text-stone-500 dark:text-stone-400 mt-2">Organize your library into curated groups.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Creation Form */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-24">
            <h2 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-4">New Collection</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-500 dark:text-stone-400 mb-1">Collection Name</label>
                <input 
                  type="text"
                  value={newColName}
                  onChange={(e) => setNewColName(e.target.value)}
                  placeholder="e.g. Summer 2026 Reads"
                  className="w-full px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-accent-warm focus:outline-none transition-all"
                />
              </div>
              <button 
                type="submit"
                className="w-full py-2 px-4 bg-accent-warm text-white font-bold rounded-xl hover:bg-accent-dark transition-all flex items-center justify-center gap-2"
              >
                <Plus size={18} />
                Create Collection
              </button>
            </form>
          </Card>
        </div>

        {/* Collections Grid */}
        <div className="lg:col-span-2">
          {collections.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {collections.map(col => {
                const colBooks = books.filter(b => col.bookIds.includes(b.id))
                return (
                  <Card key={col.id} className="p-6 group relative hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-stone-100 dark:bg-stone-700 rounded-lg text-accent-warm">
                          <Layers size={20} />
                        </div>
                        <h3 className="font-bold text-stone-800 dark:text-stone-100">{col.name}</h3>
                      </div>
                      <button 
                        onClick={() => removeCollection(col.id)}
                        className="p-1 text-stone-300 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <p className="text-sm text-stone-500 dark:text-stone-400 mb-4">
                      {colBooks.length} books in this collection
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {colBooks.slice(0, 5).map(b => (
                        <div key={b.id} className="w-6 h-6 rounded-sm bg-stone-200 dark:bg-stone-700 overflow-hidden shadow-sm" title={b.title}>
                          <img src={b.coverImage} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                      {colBooks.length > 5 && (
                        <div className="w-6 h-6 rounded-sm bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-[8px] font-bold text-stone-400">
                          +{colBooks.length - 5}
                        </div>
                      )}
                    </div>
                  </Card>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-20 bg-stone-50 dark:bg-stone-900/30 rounded-3xl border-2 border-dashed border-stone-200 dark:border-stone-700">
              <Layers size={48} className="mx-auto text-stone-300 dark:text-stone-600 mb-4" />
              <h3 className="text-lg font-bold text-stone-800 dark:text-stone-100">No collections yet</h3>
              <p className="text-stone-500 dark:text-stone-400">Create your first collection to group your favorite books!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Re-importing Layers because I used it in the code
import { Layers } from 'lucide-react'

export default CollectionManager
