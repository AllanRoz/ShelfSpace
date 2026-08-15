import React, { createContext, useContext, useState, useEffect } from 'react'
import { storage } from '../utils/storage'

const LibraryContext = createContext()

export const LibraryProvider = ({ children }) => {
  const [books, setBooks]               = useState([])
  const [collections, setCollections]   = useState([])
  const [readingLists, setReadingLists] = useState([])
  const [isLoaded, setIsLoaded]         = useState(false)

  useEffect(() => {
    setBooks(storage.getBooks())
    setCollections(storage.getCollections())
    setReadingLists(storage.getReadingLists())
    setIsLoaded(true)
  }, [])

  // ── Books ──
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
    const updated = [...books, newBook]
    setBooks(updated)
    storage.saveBooks(updated)
    return newBook
  }

  const updateBook = (id, updates) => {
    const updated = books.map(b => b.id === id ? { ...b, ...updates } : b)
    setBooks(updated)
    storage.saveBooks(updated)
  }

  const deleteBook = (id) => {
    const updated = books.filter(b => b.id !== id)
    setBooks(updated)
    storage.saveBooks(updated)
    // Also remove from collections and reading lists
    const updatedCols = collections.map(c => ({ ...c, bookIds: c.bookIds.filter(bid => bid !== id) }))
    setCollections(updatedCols)
    storage.saveCollections(updatedCols)
    const updatedLists = readingLists.map(l => ({ ...l, bookIds: l.bookIds.filter(bid => bid !== id) }))
    setReadingLists(updatedLists)
    storage.saveReadingLists(updatedLists)
  }

  // ── Collections ──
  const addCollection = (name) => {
    const col = { id: Date.now().toString(), name, bookIds: [] }
    const updated = [...collections, col]
    setCollections(updated)
    storage.saveCollections(updated)
  }

  const removeCollection = (id) => {
    const updated = collections.filter(c => c.id !== id)
    setCollections(updated)
    storage.saveCollections(updated)
  }

  const renameCollection = (id, name) => {
    const updated = collections.map(c => c.id === id ? { ...c, name } : c)
    setCollections(updated)
    storage.saveCollections(updated)
  }

  const addBookToCollection = (colId, bookId) => {
    const updated = collections.map(c =>
      c.id === colId ? { ...c, bookIds: [...new Set([...c.bookIds, bookId])] } : c
    )
    setCollections(updated)
    storage.saveCollections(updated)
  }

  const removeBookFromCollection = (colId, bookId) => {
    const updated = collections.map(c =>
      c.id === colId ? { ...c, bookIds: c.bookIds.filter(id => id !== bookId) } : c
    )
    setCollections(updated)
    storage.saveCollections(updated)
  }

  // ── Reading Lists ──
  const addReadingList = (name, description = '') => {
    const list = {
      id: Date.now().toString(),
      name,
      description,
      bookIds: [],
      createdAt: new Date().toISOString(),
    }
    const updated = [...readingLists, list]
    setReadingLists(updated)
    storage.saveReadingLists(updated)
    return list
  }

  const removeReadingList = (id) => {
    const updated = readingLists.filter(l => l.id !== id)
    setReadingLists(updated)
    storage.saveReadingLists(updated)
  }

  const renameReadingList = (id, name, description) => {
    const updated = readingLists.map(l =>
      l.id === id ? { ...l, name, description: description ?? l.description } : l
    )
    setReadingLists(updated)
    storage.saveReadingLists(updated)
  }

  const addBookToList = (listId, bookId) => {
    const updated = readingLists.map(l =>
      l.id === listId ? { ...l, bookIds: [...new Set([...l.bookIds, bookId])] } : l
    )
    setReadingLists(updated)
    storage.saveReadingLists(updated)
  }

  const removeBookFromList = (listId, bookId) => {
    const updated = readingLists.map(l =>
      l.id === listId ? { ...l, bookIds: l.bookIds.filter(id => id !== bookId) } : l
    )
    setReadingLists(updated)
    storage.saveReadingLists(updated)
  }

  return (
    <LibraryContext.Provider value={{
      books, collections, readingLists, isLoaded,
      addBook, updateBook, deleteBook,
      addCollection, removeCollection, renameCollection, addBookToCollection, removeBookFromCollection,
      addReadingList, removeReadingList, renameReadingList, addBookToList, removeBookFromList,
    }}>
      {children}
    </LibraryContext.Provider>
  )
}

export const useLibrary = () => {
  const ctx = useContext(LibraryContext)
  if (!ctx) throw new Error('useLibrary must be used inside LibraryProvider')
  return ctx
}
