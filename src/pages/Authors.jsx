import React, { useMemo, useState } from 'react'
import { useLibrary } from '../context/LibraryContext'
import { Search, BookOpen, Star, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import BookDetailModal from '../components/bookshelf/BookDetailModal'

const AuthorCard = ({ author, books, onClick }) => {
  const finished   = books.filter(b => b.status === 'Finished').length
  const avgRating  = books.filter(b => b.rating > 0).length
    ? (books.filter(b => b.rating > 0).reduce((a, b) => a + b.rating, 0) / books.filter(b => b.rating > 0).length).toFixed(1)
    : null
  const coverBooks = books.filter(b => b.coverImage).slice(0, 3)

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      onClick={() => onClick(author)}
      className="bg-white dark:bg-[#1f1a15] border border-stone-200 dark:border-[#2e2720] rounded-2xl p-5 cursor-pointer hover:shadow-md dark:hover:shadow-black/30 transition-all"
    >
      {/* Mini cover strip */}
      <div className="flex gap-1.5 mb-4">
        {coverBooks.map(b => (
          <div key={b.id} className="w-10 h-14 rounded-lg overflow-hidden shadow-sm bg-stone-200 dark:bg-[#2a221a]">
            <img src={b.coverImage} alt="" className="w-full h-full object-cover" />
          </div>
        ))}
        {books.length > 3 && (
          <div className="w-10 h-14 rounded-lg bg-stone-100 dark:bg-[#2a221a] flex items-center justify-center text-[9px] font-bold text-stone-400 dark:text-stone-600">
            +{books.length - 3}
          </div>
        )}
      </div>

      <h3 className="font-bold text-stone-800 dark:text-[#e8ddd3] mb-1 truncate">{author}</h3>
      <div className="flex items-center gap-3 text-xs text-stone-400 dark:text-stone-600">
        <span className="flex items-center gap-1"><BookOpen size={11} /> {books.length} book{books.length !== 1 ? 's' : ''}</span>
        <span>{finished} finished</span>
        {avgRating && <span className="flex items-center gap-0.5"><Star size={11} className="text-amber-400" /> {avgRating}</span>}
      </div>
    </motion.div>
  )
}

const AuthorPage = ({ author, books, onBack, onBookClick }) => {
  const finished = books.filter(b => b.status === 'Finished').length
  const totalPages = books.filter(b => b.status === 'Finished').reduce((a, b) => a + (b.pages || 0), 0)

  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-sm font-semibold text-stone-600 dark:text-stone-400 hover:text-accent-warm transition-colors cursor-pointer"
      >
        <ArrowLeft size={16} />
        <span>Back to All Authors</span>
      </button>

      <div className="mb-8 p-6 bg-white dark:bg-[#1f1a15] border border-stone-200 dark:border-[#2e2720] rounded-2xl shadow-sm">
        <h2 className="text-3xl font-extrabold text-stone-800 dark:text-[#e8ddd3] mb-1">{author}</h2>
        <div className="flex flex-wrap gap-4 mt-3 text-sm text-stone-500 dark:text-stone-400">
          <span>{books.length} books in library</span>
          <span>{finished} finished</span>
          <span>{totalPages.toLocaleString()} pages read</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {books.map(book => (
          <div
            key={book.id}
            className="group cursor-pointer"
            onClick={() => onBookClick(book)}
          >
            <div className="aspect-[2/3] rounded-2xl overflow-hidden shadow-sm mb-2 bg-stone-200 dark:bg-[#2a221a] border border-stone-200/50 dark:border-[#2e2720]/50">
              {book.coverImage ? (
                <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              ) : (
                <div className="w-full h-full flex items-center justify-center"><BookOpen size={24} className="text-stone-400" /></div>
              )}
            </div>
            <h4 className="text-xs font-semibold text-stone-800 dark:text-[#e8ddd3] line-clamp-2 leading-tight group-hover:text-accent-warm transition-colors">{book.title}</h4>
            <span className={`text-[10px] font-medium mt-0.5 block ${
              book.status === 'Finished' ? 'text-emerald-500 font-semibold' :
              book.status === 'Currently Reading' ? 'text-blue-500 font-semibold' :
              'text-stone-400 dark:text-stone-600'
            }`}>{book.status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const Authors = () => {
  const { books } = useLibrary()
  const [search,         setSearch]         = useState('')
  const [selectedAuthor, setSelectedAuthor] = useState(null)
  const [selectedBook,   setSelectedBook]   = useState(null)
  const [isModalOpen,    setIsModalOpen]    = useState(false)

  const authorMap = useMemo(() => {
    const map = {}
    books.forEach(b => {
      if (!b.author) return
      if (!map[b.author]) map[b.author] = []
      map[b.author].push(b)
    })
    return map
  }, [books])

  const filtered = useMemo(() =>
    Object.entries(authorMap)
      .filter(([name]) => name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => b[1].length - a[1].length),
  [authorMap, search])

  const handleBookClick = (book) => {
    setSelectedBook(book)
    setIsModalOpen(true)
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      {selectedAuthor ? (
        <AuthorPage
          author={selectedAuthor}
          books={authorMap[selectedAuthor] || []}
          onBack={() => setSelectedAuthor(null)}
          onBookClick={handleBookClick}
        />
      ) : (
        <>
          <header className="mb-8">
            <h1 className="text-4xl font-extrabold text-stone-800 dark:text-[#e8ddd3]">Authors</h1>
            <p className="text-stone-500 dark:text-stone-500 mt-1">Browse your library by author.</p>
          </header>

          <div className="relative max-w-sm mb-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-600" size={16} />
            <input
              type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search authors…"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-[#2e2720] bg-white dark:bg-[#1f1a15] text-stone-800 dark:text-[#e8ddd3] placeholder-stone-400 dark:placeholder-stone-600 focus:ring-2 focus:ring-accent-warm focus:outline-none text-sm"
            />
          </div>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(([author, authorBooks]) => (
                <AuthorCard key={author} author={author} books={authorBooks} onClick={setSelectedAuthor} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-stone-400 dark:text-stone-600">
              {books.length === 0 ? 'Add some books to see your authors.' : 'No authors matched your search.'}
            </div>
          )}
        </>
      )}

      {/* Detail Modal */}
      <BookDetailModal
        book={selectedBook}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}

export default Authors
