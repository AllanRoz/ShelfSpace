import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useLibrary } from '../context/LibraryContext'
import BookSpine from '../components/bookshelf/BookSpine'
import BookDetailModal from '../components/bookshelf/BookDetailModal'
import { SearchBar, FilterBar } from '../components/ui/SearchFilter'
import { Search, ArrowUp, ArrowDown } from 'lucide-react'

const BookshelfPage = () => {
  const { books } = useLibrary()
  const [selectedBook, setSelectedBook]   = useState(null)
  const [isModalOpen, setIsModalOpen]     = useState(false)
  const [searchTerm, setSearchTerm]       = useState('')
  const [filters, setFilters]             = useState({ genre: '', status: '' })
  const [sortKey, setSortKey]             = useState('dateAdded')
  const [sortAsc, setSortAsc]             = useState(false)   // false = descending (newest first)

  const handleFilterChange = (key, value) => setFilters(prev => ({ ...prev, [key]: value }))
  const handleBookClick = (book) => { setSelectedBook(book); setIsModalOpen(true) }

  const processedBooks = useMemo(() => {
    const filtered = books.filter(book => {
      const q = searchTerm.toLowerCase()
      const matchesSearch =
        book.title.toLowerCase().includes(q) ||
        book.author.toLowerCase().includes(q) ||
        (book.genre || '').toLowerCase().includes(q) ||
        (book.isbn || '').toLowerCase().includes(q) ||
        (book.personalNotes || '').toLowerCase().includes(q)
      const matchesGenre  = !filters.genre  || book.genre  === filters.genre
      const matchesStatus = !filters.status || book.status === filters.status
      return matchesSearch && matchesGenre && matchesStatus
    })

    filtered.sort((a, b) => {
      let valA, valB
      if (sortKey === 'rating')           { valA = a.rating || 0;           valB = b.rating || 0 }
      else if (sortKey === 'pages')       { valA = a.pages  || 0;           valB = b.pages  || 0 }
      else if (sortKey === 'dateAdded')   { valA = new Date(a.dateAdded);   valB = new Date(b.dateAdded) }
      else if (sortKey === 'publicationYear') { valA = a.publicationYear || 0; valB = b.publicationYear || 0 }
      else { valA = (a[sortKey] || '').toString().toLowerCase(); valB = (b[sortKey] || '').toString().toLowerCase() }

      if (valA < valB) return sortAsc ? -1 : 1
      if (valA > valB) return sortAsc ? 1  : -1
      return 0
    })

    return filtered
  }, [books, searchTerm, filters, sortKey, sortAsc])

  const booksPerShelf = 20
  const shelves = []
  for (let i = 0; i < processedBooks.length; i += booksPerShelf) {
    shelves.push(processedBooks.slice(i, i + booksPerShelf))
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen">
      <header className="mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-4xl font-extrabold text-stone-800 dark:text-[#e8ddd3] tracking-tight">My Library</h1>
            <p className="text-stone-500 dark:text-stone-500 mt-1">A curated collection of knowledge and stories.</p>
          </motion.div>
          <span className="hidden md:block text-sm font-semibold text-stone-400 dark:text-stone-600 uppercase tracking-widest">
            {processedBooks.length} {processedBooks.length === 1 ? 'Volume' : 'Volumes'}
          </span>
        </div>

        {/* Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="flex flex-col md:flex-row gap-3 p-4 bg-white dark:bg-[#1f1a15] border border-stone-200 dark:border-[#2e2720] rounded-2xl shadow-sm"
        >
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
          <div className="flex items-center gap-2">
            <FilterBar filters={filters} setFilter={handleFilterChange} sort={sortKey} setSort={setSortKey} />
            {/* Asc/Desc toggle */}
            <button
              onClick={() => setSortAsc(v => !v)}
              title={sortAsc ? 'Ascending' : 'Descending'}
              className="p-2 rounded-lg border border-stone-200 dark:border-[#2e2720] bg-white dark:bg-[#1f1a15] text-stone-500 dark:text-stone-400 hover:text-accent-warm hover:border-accent-warm/40 transition-all"
            >
              {sortAsc ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
            </button>
          </div>
        </motion.div>
      </header>

      {/* Shelves */}
      <div className="space-y-16 pb-24">
        {shelves.length > 0 ? shelves.map((shelfBooks, shelfIdx) => (
          <motion.div key={shelfIdx}
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 + shelfIdx * 0.08, duration: 0.5 }}
            className="relative"
          >
            <div className="flex items-end justify-center gap-0.5 px-4 overflow-x-auto pb-0">
              {shelfBooks.map((book, bookIdx) => (
                <motion.div key={book.id}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + bookIdx * 0.015, duration: 0.35 }}
                >
                  <BookSpine book={book} onClick={handleBookClick} />
                </motion.div>
              ))}
            </div>
            {/* Shelf board */}
            <div className="relative h-5 w-full bg-gradient-to-b from-[#3d2f1f] to-[#2a1f12] dark:from-[#2a1f12] dark:to-[#1a1008] rounded-sm shadow-lg">
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#5c442a] dark:bg-[#3d2c18] rounded-t-sm" />
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30 rounded-b-sm" />
            </div>
            <div className="absolute -bottom-3 left-8 w-3 h-8 bg-[#2a1f12] dark:bg-[#1a1008] rounded-b-sm opacity-60" />
            <div className="absolute -bottom-3 right-8 w-3 h-8 bg-[#2a1f12] dark:bg-[#1a1008] rounded-b-sm opacity-60" />
          </motion.div>
        )) : (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="p-6 rounded-full bg-stone-100 dark:bg-[#1f1a15] mb-4">
              <Search size={40} className="text-stone-300 dark:text-stone-700" />
            </div>
            <h3 className="text-xl font-bold text-stone-700 dark:text-stone-400 mb-2">No books found</h3>
            <p className="text-stone-400 dark:text-stone-600 text-sm">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>

      <BookDetailModal book={selectedBook} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}

export default BookshelfPage
