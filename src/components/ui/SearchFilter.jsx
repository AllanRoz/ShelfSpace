import React from 'react'
import { Search, Filter, ArrowUpDown } from 'lucide-react'

export const SearchBar = ({ value, onChange, placeholder = "Search your library..." }) => (
  <div className="relative flex-1 max-w-md">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
    <input 
      type="text" 
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-accent-warm focus:outline-none transition-all"
    />
  </div>
)

export const FilterBar = ({ filters, setFilter, sort, setSort }) => {
  const genreOptions = ['All Genres', 'Fiction', 'Fantasy', 'Sci-Fi', 'Non-Fiction', 'Biography', 'History', 'Finance', 'Psychology', 'Self Improvement', 'Mystery', 'Classic']
  const statusOptions = ['All Statuses', 'Want to Read', 'Currently Reading', 'Finished', 'DNF']
  const sortOptions = [
    { label: 'Title', value: 'title' },
    { label: 'Author', value: 'author' },
    { label: 'Rating', value: 'rating' },
    { label: 'Date Added', value: 'dateAdded' },
    { label: 'Pages', value: 'pages' },
  ]

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2">
        <Filter size={16} className="text-stone-400" />
        <select 
          value={filters.genre} 
          onChange={(e) => setFilter('genre', e.target.value)}
          className="px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs font-medium text-stone-600 dark:text-stone-300 focus:ring-2 focus:ring-accent-warm focus:outline-none"
        >
          {genreOptions.map(opt => <option key={opt} value={opt === 'All Genres' ? '' : opt}>{opt}</option>)}
        </select>
        
        <select 
          value={filters.status} 
          onChange={(e) => setFilter('status', e.target.value)}
          className="px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs font-medium text-stone-600 dark:text-stone-300 focus:ring-2 focus:ring-accent-warm focus:outline-none"
        >
          {statusOptions.map(opt => <option key={opt} value={opt === 'All Statuses' ? '' : opt}>{opt}</option>)}
        </select>
      </div>

      <div className="flex items-center gap-2 border-l border-stone-200 dark:border-stone-700 pl-3">
        <ArrowUpDown size={16} className="text-stone-400" />
        <select 
          value={sort} 
          onChange={(e) => setSort(e.target.value)}
          className="px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs font-medium text-stone-600 dark:text-stone-300 focus:ring-2 focus:ring-accent-warm focus:outline-none"
        >
          {sortOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      </div>
    </div>
  )
}
