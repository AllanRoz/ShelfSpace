import React from 'react'
import { Search, Filter, ArrowUpDown } from 'lucide-react'

const inputCls = `
  px-3 py-2 rounded-lg text-xs font-medium
  border border-stone-200 dark:border-[#2e2720]
  bg-white dark:bg-[#1f1a15]
  text-stone-700 dark:text-stone-300
  focus:ring-2 focus:ring-accent-warm focus:outline-none
  transition-all
`

export const SearchBar = ({ value, onChange, placeholder = 'Search your library…' }) => (
  <div className="relative flex-1 max-w-md">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-600" size={16} />
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 dark:border-[#2e2720] bg-white dark:bg-[#1f1a15] text-stone-800 dark:text-[#e8ddd3] placeholder-stone-400 dark:placeholder-stone-600 focus:ring-2 focus:ring-accent-warm focus:outline-none transition-all text-sm`}
    />
  </div>
)

export const FilterBar = ({ filters, setFilter, sort, setSort }) => {
  const genreOptions = ['All Genres', 'Fiction', 'Fantasy', 'Sci-Fi', 'Non-Fiction', 'Biography', 'History', 'Finance', 'Psychology', 'Self Improvement', 'Mystery', 'Classic']
  const statusOptions = ['All Statuses', 'Want to Read', 'Currently Reading', 'Finished', 'DNF']
  const sortOptions = [
    { label: 'Date Added',        value: 'dateAdded' },
    { label: 'Title',             value: 'title' },
    { label: 'Author',            value: 'author' },
    { label: 'Rating',            value: 'rating' },
    { label: 'Publication Year',  value: 'publicationYear' },
    { label: 'Pages',             value: 'pages' },
  ]

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1.5">
        <Filter size={14} className="text-stone-400 dark:text-stone-600" />
        <select
          value={filters.genre}
          onChange={(e) => setFilter('genre', e.target.value)}
          className={inputCls}
        >
          {genreOptions.map(opt => (
            <option key={opt} value={opt === 'All Genres' ? '' : opt}>{opt}</option>
          ))}
        </select>

        <select
          value={filters.status}
          onChange={(e) => setFilter('status', e.target.value)}
          className={inputCls}
        >
          {statusOptions.map(opt => (
            <option key={opt} value={opt === 'All Statuses' ? '' : opt}>{opt}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-1.5 border-l border-stone-200 dark:border-[#2e2720] pl-2">
        <ArrowUpDown size={14} className="text-stone-400 dark:text-stone-600" />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className={inputCls}
        >
          {sortOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    </div>
  )
}
