import React from 'react'
import { LibraryProvider } from './context/LibraryContext'
import App from './App'
import { storage } from './utils/storage'
import { SAMPLE_BOOKS } from './data/sampleBooks'

const Root = () => {
  // Initialize sample data if library is empty
  if (storage.getBooks().length === 0) {
    const sampleData = SAMPLE_BOOKS.map(book => ({
      ...book,
      id: Math.random().toString(36).substr(2, 9),
      dateAdded: new Date().toISOString(),
    }))
    storage.saveBooks(sampleData)
  }

  return (
    <LibraryProvider>
      <App />
    </LibraryProvider>
  )
}

export default Root
