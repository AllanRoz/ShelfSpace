const BOOKS_KEY        = 'shelfspace_books'
const COLLECTIONS_KEY  = 'shelfspace_collections'
const READING_LISTS_KEY = 'shelfspace_reading_lists'
const SETTINGS_KEY     = 'shelfspace_settings'

export const storage = {
  // ── Books ──
  getBooks() {
    try { return JSON.parse(localStorage.getItem(BOOKS_KEY)) || [] }
    catch { return [] }
  },
  saveBooks(books) {
    localStorage.setItem(BOOKS_KEY, JSON.stringify(books))
  },
  getBookById(id) {
    return this.getBooks().find(b => b.id === id) || null
  },

  // ── Collections ──
  getCollections() {
    try { return JSON.parse(localStorage.getItem(COLLECTIONS_KEY)) || [] }
    catch { return [] }
  },
  saveCollections(collections) {
    localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(collections))
  },

  // ── Reading Lists ──
  // ReadingList: { id, name, description, bookIds: string[], createdAt: ISO }
  getReadingLists() {
    try { return JSON.parse(localStorage.getItem(READING_LISTS_KEY)) || [] }
    catch { return [] }
  },
  saveReadingLists(lists) {
    localStorage.setItem(READING_LISTS_KEY, JSON.stringify(lists))
  },

  // ── Settings ──
  getSettings() {
    try { return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || { theme: 'light' } }
    catch { return { theme: 'light' } }
  },
  saveSettings(settings) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  },
}
