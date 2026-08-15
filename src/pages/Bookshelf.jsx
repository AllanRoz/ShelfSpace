import React, { useState } from 'react'
import { useLibrary } from '../context/LibraryContext'
import BookSpine from '../components/bookshelf/BookSpine'
import BookDetailModal from '../components/bookshelf/BookDetailModal'

const BookshelfPage = () => {
  const { books } = useLibrary()
  const [selectedBook, setSelectedBook] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleBookClick = (book) => {
    setSelectedBook(book)
    setIsModalOpen(true)
  }

  // Chunk books into shelves (e.g., 20 books per shelf)
  const booksPerShelf = 20
  const shelves = []
  for (let i = 0; i < books.length; i += booksPerShelf) {
    shelves.push(books.slice(i, i + booksPerShelf))
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen">
      <header className="mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold text-stone-800 dark:text-stone-100">My Library</h1>
          <p className="text-stone-500 dark:text-stone-400 mt-2">A curated collection of knowledge and stories.</p>
        </div>
        <div className="hidden md:block text-right">
          <span className="text-sm font-medium text-stone-400 uppercase tracking-widest">{books.length} Volumes</span>
        </div>
      </header>

      <div className="space-y-16 pb-20">
        {shelves.map((shelfBooks, shelfIdx) => (
          <div key={shelfIdx} className="relative">
            {/* The Books */}
            <div className="flex items-end justify-center gap-1 px-4 pb-0 overflow-x-auto no-scrollbar">
              {shelfBooks.map(book => (
                <BookSpine 
                  key={book.id} 
                  book={book} 
                  onClick={handleBookClick} 
                />
              ))}
            </div>

            {/* The Wooden Shelf */}
            <div className="h-4 w-full bg-stone-800 dark:bg-stone-950 rounded-sm shadow-lg relative">
              {/* Shelf Top Lip */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-stone-700 dark:bg-stone-800 rounded-t-sm" />
              {/* Shelf Texture/Grain (simplified gradient) */}
              <div className="absolute inset-0 bg-gradient-to-b from-stone-700/50 to-transparent" />
            </div>
            
            {/* Shelf Support/Legs (Optional visual detail) */}
            <div className="absolute -bottom-2 left-10 w-4 h-4 bg-stone-800 dark:bg-stone-950 rounded-sm" />
            <div className="absolute -bottom-2 right-10 w-4 h-4 bg-stone-800 dark:bg-stone-950 rounded-sm" />
          </div>
        ))}
      </div>

      <BookDetailModal 
        book={selectedBook} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  )
}

export default BookshelfPage
