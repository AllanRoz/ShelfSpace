import { storage } from './storage'

export const libraryUtils = {
  exportLibrary() {
    const data = {
      books:        storage.getBooks(),
      collections:  storage.getCollections(),
      readingLists: storage.getReadingLists(),
      exportedAt:   new Date().toISOString(),
      version:      '2.0',
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `shelfspace-backup-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  },

  importLibrary(jsonString) {
    try {
      const data = JSON.parse(jsonString)

      if (!data.books || !Array.isArray(data.books)) {
        throw new Error('Invalid backup: books list is missing or malformed.')
      }
      if (data.books.length > 0 && (!data.books[0].title || !data.books[0].author)) {
        throw new Error('Invalid backup: books are missing required fields (title/author).')
      }
      if (data.collections && !Array.isArray(data.collections)) {
        throw new Error('Invalid backup: collections list is malformed.')
      }
      if (data.readingLists && !Array.isArray(data.readingLists)) {
        throw new Error('Invalid backup: reading lists are malformed.')
      }

      storage.saveBooks(data.books)
      if (data.collections)  storage.saveCollections(data.collections)
      if (data.readingLists) storage.saveReadingLists(data.readingLists)

      return { success: true, error: null }
    } catch (e) {
      return { success: false, error: e.message }
    }
  },
}
