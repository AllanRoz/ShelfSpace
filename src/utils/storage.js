/**
 * ShelfSpace Data Model Documentation
 * 
 * Book Object:
 * {
 *   id: string,                 // Unique ID (UUID or timestamp)
 *   title: string,              // Book title
 *   author: string,             // Author name
 *   isbn: string,               // ISBN-10 or ISBN-13
 *   genre: string,              // Genre (e.g., 'Fiction', 'Science')
 *   pages: number,              // Total pages
 *   currentPage: number,        // Current page being read
 *   publicationYear: number,    // Year of publication
 *   coverImage: string,         // URL to cover image
 *   description: string,        // Book summary/description
 *   rating: number,             // 1-5 stars
 *   status: 'Want to Read' | 'Currently Reading' | 'Finished' | 'DNF',
 *   dateAdded: string,           // ISO date string
 *   dateStarted: string | null,  // ISO date string or null
 *   dateFinished: string | null, // ISO date string or null
 *   personalNotes: string,       // User's personal thoughts
 *   favoriteQuotes: string[],    // Array of quotes
 *   isFavorite: boolean,        // Marked as favorite
 * }
 * 
 * Collection Object:
 * {
 *   id: string,
 *   name: string,
 *   bookIds: string[],           // Array of Book IDs
 * }
 */

const BOOKS_KEY = 'shelfspace_books'
const COLLECTIONS_KEY = 'shelfspace_collections'
const SETTINGS_KEY = 'shelfspace_settings'

export const storage = {
  // --- Books ---
  getBooks() {
    const books = localStorage.getItem(BOOKS_KEY)
    return books ? JSON.parse(books) : []
  },

  saveBooks(books) {
    localStorage.setItem(BOOKS_KEY, JSON.stringify(books))
  },

  getBookById(id) {
    const books = this.getBooks()
    return books.find(book => book.id === id) || null
  },

  saveBook(book) {
    const books = this.getBooks()
    const index = books.findIndex(b => b.id === book.id)
    if (index !== -1) {
      books[index] = book
    } else {
      books.push(book)
    }
    this.saveBooks(books)
    return book
  },

  deleteBook(id) {
    const books = this.getBooks().filter(book => book.id !== id)
    this.saveBooks(books)
  },

  // --- Collections ---
  getCollections() {
    const collections = localStorage.getItem(COLLECTIONS_KEY)
    return collections ? JSON.parse(collections) : []
  },

  saveCollections(collections) {
    localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(collections))
  },

  // --- Settings ---
  getSettings() {
    const settings = localStorage.getItem(SETTINGS_KEY)
    return settings ? JSON.parse(settings) : { theme: 'light' }
  },

  saveSettings(settings) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  }
}
