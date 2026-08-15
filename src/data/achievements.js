import React from 'react'

export const ACHIEVEMENT_DEFINITIONS = [
  { id: 'first_book', name: 'First Page', description: 'Read your first book', criteria: (books) => books.some(b => b.status === 'Finished'), icon: '📚' },
  { id: 'five_books', name: 'Avid Reader', description: 'Read 5 books', criteria: (books) => books.filter(b => b.status === 'Finished').length >= 5, icon: '📖' },
  { id: 'ten_books', name: 'Bookworm', description: 'Read 10 books', criteria: (books) => books.filter(b => b.status === 'Finished').length >= 10, icon: '🐛' },
  { id: 'twenty_five_books', name: 'Bibliophile', description: 'Read 25 books', criteria: (books) => books.filter(b => b.status === 'Finished').length >= 25, icon: '🌟' },
  { id: 'thousand_pages', name: 'Page Turner', description: 'Read 1,000 pages', criteria: (books) => books.reduce((acc, b) => acc + (b.status === 'Finished' ? b.pages : 0), 0) >= 1000, icon: '📄' },
  { id: 'five_thousand_pages', name: 'Literary Giant', description: 'Read 5,000 pages', criteria: (books) => books.reduce((acc, b) => acc + (b.status === 'Finished' ? b.pages : 0), 0) >= 5000, icon: '🏔️' },
  { id: 'five_genres', name: 'Eclectic Taste', description: 'Read 5 different genres', criteria: (books) => new Set(books.filter(b => b.status === 'Finished').map(b => b.genre)).size >= 5, icon: '🌈' },
  { id: 'ten_books_year', name: 'Annual Ace', description: 'Read 10 books this year', criteria: (books) => {
    const currentYear = new Date().getFullYear()
    return books.filter(b => b.status === 'Finished' && b.dateFinished && new Date(b.dateFinished).getFullYear() === currentYear).length >= 10
  }, icon: '📅' },
]
