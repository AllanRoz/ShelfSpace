import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useLibrary } from '../context/LibraryContext'
import BookSpine from '../components/bookshelf/BookSpine'
import BookDetailModal from '../components/bookshelf/BookDetailModal'
import { SearchBar, FilterBar } from '../components/ui/SearchFilter'
import { Search } from 'lucide-react'

const BookshelfPage = () => {
  const { books } = useLibrary()
  const [selectedBook, setSelectedBook] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({ genre: '', status: '' })
  const [sortKey, setSortKey] = useState('dateAdded')

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleBookClick = (book) => {
    setSelectedBook(book)
    setIsModalOpen(true)
  }

  const processedBooks = useMemo(() => {
    return books
      .filter(book => {
        const matchesSearch = 
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.genre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.isbn.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (book.personalNotes && book.personalNotes.toLowerCase().includes(searchTerm.toLowerCase()))

        const matchesGenre = !filters.genre || book.genre === filters.genre
        const matchesStatus = !filters.status || book.status === filters.status

        return matchesSearch && matchesGenre && matchesStatus
      })
      .sort((a, b) => {
        if (sortKey === 'rating') return (b.rating || 0) - (a.rating || 0)
        if (sortKey === 'pages') return b.pages - a.pages
        if (sortKey === 'dateAdded') return new Date(b.dateAdded) - new Date(a.dateAdded)
        const valA = (a[sortKey] || '').toString().toLowerCase()
        const valB = (b[sortKey] || '').toString().toLowerCase()
        return valA.localeCompare(valB)
      })
  }, [books, searchTerm, filters, sortKey])

  const booksPerShelf = 20
  const shelves = []
  for (let i = 0; i < processedBooks.length; i += booksPerShelf) {
    shelves.push(processedBooks.slice(i, i + booksPerShelf))
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen">
      <header className="mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-stone-800 dark:text-stone-100">My Library</h1>
            <p className="text-stone-500 dark:text-stone-400 mt-2">A curated collection of knowledge and stories.</p>
          </motion.div>
          <div className="hidden md:block text-right">
            <span className="text-sm font-medium text-stone-400 uppercase tracking-widest">{processedBooks.length} Volumes Found</span>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-col md:flex-row gap-4 p-4 bg-white dark:bg-stone-800 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-700"
        >
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
          <FilterBar filters={filters} setFilter={handleFilterChange} sort={sortKey} setSort={setSortKey} />
        </motion.div>
      </header>

      <div className="space-y-16 pb-20">
        {shelves.length > 0 ? shelves.map((shelfBooks, shelfIdx) => (
          <motion.div 
            key={shelfIdx} 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + (shelfIdx * 0.1), duration: 0.6 }}
            className="relative"
          >
            <div className="flex items-end justify-center gap-1 px-4 pb-0 overflow-x-auto no-scrollbar">
              {shelfBooks.map((book, bookIdx) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + (bookIdx * 0.02), duration: 0.4 }}
                >
                  <BookSpine book={book} onClick={handleBookClick} />
                </motion.div>
              ))}
            </div>

            <div className="h-4 w-full bg-stone-800 dark:bg-stone-950 rounded-sm shadow-lg relative">
              <div className="absolute top-0 left-0 right-0 h-1 bg-stone-700 dark:bg-stone-800 rounded-t-sm" />
              <div className="absolute inset-0 bg-gradient-to-b from-stone-700/50 to-transparent" />
            </div>
            
            <div className="absolute -bottom-2 left-10 w-4 h-4 bg-stone-800 dark:bg-stone-950 rounded-sm" />
            <div className="absolute -bottom-2 right-10 w-4 h-4 bg-stone-800 dark:bg-stone-950 rounded-sm" />
          </motion.div>
        )) : (
          <div className="text-center py-20">
            <div className="inline-flex p-6 bg-stone-100 dark:bg-stone-800 rounded-full mb-4">
              <Search size={48} className="text-stone-300 dark:text-stone-600" />
            </div>
            <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100">No books found</h3>
            <p className="text-stone-500 dark:text-stone-400">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>

      <BookDetailModal book={selectedBook} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}

export default BookshelfPage
