import React from 'react'
import { BookOpen, CheckCircle, Clock, Star, Bookmark, Book as BookIcon } from 'lucide-react'
import { StatCard, Section, Card } from '../components/ui/DashboardUI'
import { useLibrary } from '../context/LibraryContext'

const Dashboard = () => {
  const { books } = useLibrary()

  // Calculate actual stats from books state
  const stats = {
    totalBooks: books.length,
    booksRead: books.filter(b => b.status === 'Finished').length,
    currentlyReading: books.filter(b => b.status === 'Currently Reading').length,
    wantToRead: books.filter(b => b.status === 'Want to Read').length,
    avgRating: books.length 
      ? (books.reduce((acc, b) => acc + (b.rating || 0), 0) / books.length).toFixed(1) 
      : '0.0',
    pagesRead: books.reduce((acc, b) => acc + (b.status === 'Finished' ? b.pages : (b.currentPage || 0)), 0),
    completedThisYear: books.filter(b => {
      if (!b.dateFinished) return false
      return new Date(b.dateFinished).getFullYear() === new Date().getFullYear()
    }).length
  }

  const continueReading = books.filter(b => b.status === 'Currently Reading')
  const recentlyAdded = [...books].sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded)).slice(0, 4)

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-stone-800 dark:text-stone-100">Welcome back, Reader</h1>
        <p className="text-stone-500 dark:text-stone-400 mt-1">Your personal library is looking wonderful today.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard label="Total Books" value={stats.totalBooks} icon={BookIcon} subValue="Across all genres" />
        <StatCard label="Books Read" value={stats.booksRead} icon={CheckCircle} colorClass="text-emerald-600 dark:text-emerald-400" subValue={stats.totalBooks ? `${((stats.booksRead/stats.totalBooks)*100).toFixed(1)}% of library` : '0% of library'} />
        <StatCard label="Reading Now" value={stats.currentlyReading} icon={Clock} colorClass="text-blue-600 dark:text-blue-400" subValue="Keep it up!" />
        <StatCard label="Avg Rating" value={stats.avgRating} icon={Star} colorClass="text-amber-500 dark:text-amber-400" subValue="Out of 5.0 stars" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-10">
          <Section title="Continue Reading" action="View All">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {continueReading.length > 0 ? continueReading.map(book => (
                <Card key={book.id} className="p-4 flex gap-4 hover:shadow-md transition-shadow cursor-pointer group">
                  <img src={book.coverImage} alt={book.title} className="w-16 h-24 object-cover rounded shadow-sm group-hover:scale-105 transition-transform" />
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <h3 className="font-bold text-stone-800 dark:text-stone-100 line-clamp-1">{book.title}</h3>
                      <p className="text-sm text-stone-500 dark:text-stone-400">{book.author}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-medium text-stone-400 dark:text-stone-500">
                        <span>Progress</span>
                        <span>{book.currentPage} / {book.pages} pages</span>
                      </div>
                      <div className="w-full h-2 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-accent-warm" 
                          style={{ width: `${((book.currentPage / book.pages) * 100) || 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              )) : (
                <p className="text-stone-500 dark:text-stone-400 italic">No books currently being read.</p>
              )}
            </div>
          </Section>

          <Section title="Recently Added" action="Go to Bookshelf">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {recentlyAdded.map(book => (
                <div key={book.id} className="group cursor-pointer">
                  <div className="aspect-[2/3] overflow-hidden rounded-xl shadow-sm mb-3 relative">
                    <img 
                      src={book.coverImage} 
                      alt={book.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  </div>
                  <h3 className="font-bold text-sm text-stone-800 dark:text-stone-100 line-clamp-1">{book.title}</h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 truncate">{book.author}</p>
                </div>
              ))}
            </div>
          </Section>
        </div>

        <div className="space-y-8">
          <Section title="Reading Goal">
            <Card className="text-center py-8">
              <div className="relative inline-flex items-center justify-center mb-4">
                <div className="w-32 h-32 rounded-full border-8 border-stone-100 dark:border-stone-700 flex items-center justify-center relative">
                  <div className="text-center">
                    <span className="text-3xl font-bold text-stone-800 dark:text-stone-100 block">{stats.completedThisYear}</span>
                    <span className="text-xs text-stone-500 dark:text-stone-400 uppercase tracking-wider">of 25</span>
                  </div>
                </div>
              </div>
              <h3 className="font-bold text-stone-800 dark:text-stone-100 mb-1">Annual Goal</h3>
              <p className="text-sm text-stone-500 dark:text-stone-400">You're {Math.round((stats.completedThisYear/25)*100)}% of the way to your 2026 goal!</p>
            </Card>
          </Section>

          <Section title="Quick Stats">
            <Card className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-stone-600 dark:text-stone-400 text-sm">
                  <Bookmark size={16} />
                  <span>Want to read</span>
                </div>
                <span className="font-bold text-stone-800 dark:text-stone-100">{stats.wantToRead}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-stone-600 dark:text-stone-400 text-sm">
                  <BookOpen size={16} />
                  <span>Pages read</span>
                </div>
                <span className="font-bold text-stone-800 dark:text-stone-100">{stats.pagesRead.toLocaleString()}</span>
              </div>
            </Card>
          </Section>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
