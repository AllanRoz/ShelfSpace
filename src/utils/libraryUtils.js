import React from 'react'
import { storage } from '../utils/storage'

export const libraryUtils = {
  /**
   * Exports the entire library and collections to a JSON file.
   */
  exportLibrary() {
    const data = {
      books: storage.getBooks(),
      collections: storage.getCollections(),
      exportedAt: new Date().toISOString(),
      version: '1.0'
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `shelfspace-backup-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  },

  /**
   * Validates and imports a library JSON file.
   * Returns a result object { success: boolean, error: string | null }
   */
  importLibrary(jsonData) {
    try {
      const data = JSON.parse(jsonData)
      
      if (!data.books || !Array.isArray(data.books)) {
        throw new Error('Invalid backup file: Books list is missing or malformed.')
      }
      
      if (data.collections && !Array.isArray(data.collections)) {
        throw new Error('Invalid backup file: Collections list is malformed.')
      }

      // Basic validation of book structure for the first few entries
      if (data.books.length > 0) {
        const firstBook = data.books[0]
        if (!firstBook.title || !firstBook.author) {
          throw new Error('Invalid backup file: Books are missing required fields (title/author).')
        }
      }

      storage.saveBooks(data.books)
      if (data.collections) {
        storage.saveCollections(data.collections)
      }

      return { success: true, error: null }
    } catch (e) {
      return { success: false, error: e.message }
    }
  }
}
