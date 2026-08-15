import React, { createContext, useContext, useState, useEffect } from 'react'
import { storage } from '../utils/storage'

const LibraryContext = createContext()

export const LibraryProvider = ({ children }) => {
  const [books, setBooks] = useState([])
  const [collections, setCollections] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const loadedBooks = storage.getBooks()
    const loadedCollections = storage.getCollections()
    
    setBooks(loadedBooks)
    setCollections(loadedCollections)
    setIsLoaded(true)
  }, [])

  const addBook = (bookData) => {
    const newBook = {
      id: Date.now().toString(),
      dateAdded: new Date().toISOString(),
      currentPage: 0,
      rating: 0,
      favoriteQuotes: [],
      isFavorite: false,
      dateStarted: null,
      dateFinished: null,
      ...bookData,
    }
    const updatedBooks = [...books, newBook]
    setBooks(updatedBooks)
    storage.saveBooks(updatedBooks)
    return newBook
  }

  const updateBook = (id, updates) => {
    const updatedBooks = books.map(book => 
      book.id === id ? { ...book, ...updates } : book
    )
    setBooks(updatedBooks)
    storage.saveBooks(updatedBooks)
  }

  const deleteBook = (id) => {
    const updatedBooks = books.filter(book => book.id !== id)
    setBooks(updatedBooks)
    storage.saveBooks(updatedBooks)
  }

  const addCollection = (name) => {
    const newCol = {
      id: Date.now().toString(),
      name,
      bookIds: [],
    }
    const updatedCols = [...collections, newCol]
    setCollections(updatedCols)
    storage.saveCollections(updatedCols)
  }

  const removeCollection = (id) => {
    const updatedCols = collections.filter(col => col.id !== id)
    setCollections(updatedCols)
    storage.saveCollections(updatedCols)
  }

  const addBookToCollection = (colId, bookId) => {
    const updatedCols = collections.map(col => 
      col.id === colId 
        ? { ...col, bookIds: [...new Set([...col.bookIds, bookId])] } 
        : col
    )
    setCollections(updatedCols)
    storage.saveCollections(updatedCols)
  }

  const removeBookFromCollection = (colId, bookId) => {
    const updatedCols = collections.map(col => 
      col.id === colId 
        ? { ...col, bookIds: col.bookIds.filter(id => id !== bookId) } 
        : col
    )
    setCollections(updatedCols)
    storage.saveCollections(updatedCols)
  }

  return (
    <LibraryContext.Provider value={{
      books,
      collections,
      isLoaded,
      addBook,
      updateBook,
      deleteBook,
      addCollection,
      removeCollection,
      addBookToCollection,
      removeBookFromCollection
    }}>
      {children}
    </LibraryContext.Provider>
  )
}

export const useLibrary = () => {
  const context = useContext(LibraryContext)
  if (!context) {
    throw new Error('useLibrary must be used within a LibraryProvider')
  }
  return context
}
