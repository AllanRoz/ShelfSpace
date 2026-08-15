import React from 'react'
import { LibraryProvider } from './context/LibraryContext'
import App from './App'
import { storage } from './utils/storage'
import { SAMPLE_BOOKS } from './data/sampleBooks'

// Bump this version string any time sample data changes.
// If the stored version doesn't match, sample data is re-seeded.
const SAMPLE_DATA_VERSION = 'v2'
const SAMPLE_VERSION_KEY = 'shelfspace_sample_version'

const Root = () => {
  const storedVersion = localStorage.getItem(SAMPLE_VERSION_KEY)

  // Re-seed if this is the first launch OR if sample data is from an older version
  if (storage.getBooks().length === 0 || storedVersion !== SAMPLE_DATA_VERSION) {
    const sampleData = SAMPLE_BOOKS.map(book => ({
      ...book,
      id: Math.random().toString(36).substr(2, 9),
      dateAdded: new Date().toISOString(),
      favoriteQuotes: [],
    }))
    storage.saveBooks(sampleData)
    localStorage.setItem(SAMPLE_VERSION_KEY, SAMPLE_DATA_VERSION)
  }

  return (
    <LibraryProvider>
      <App />
    </LibraryProvider>
  )
}

export default Root
