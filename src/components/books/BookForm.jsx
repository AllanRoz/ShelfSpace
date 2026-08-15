import React, { useState } from 'react'
import { Book, Bookmark, Calendar, FileText, Hash, Layers, Quote, Clock, Search, Loader, X } from 'lucide-react'

const GENRES = ['Fiction', 'Fantasy', 'Sci-Fi', 'Non-Fiction', 'Biography', 'History', 'Finance', 'Psychology', 'Self Improvement', 'Mystery', 'Classic', 'Philosophy', 'Business']
const STATUSES = ['Want to Read', 'Currently Reading', 'Finished', 'DNF']

export const inputCls = `
  w-full px-4 py-2.5 rounded-xl text-sm
  border border-stone-200 dark:border-[#2e2720]
  bg-white dark:bg-[#16120e]
  text-stone-800 dark:text-[#e8ddd3]
  placeholder-stone-400 dark:placeholder-stone-600
  focus:ring-2 focus:ring-accent-warm focus:outline-none
  transition-all
`

export const InputField = ({ label, icon: Icon, children }) => (
  <div className="space-y-1.5">
    <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-600">
      {Icon && <Icon size={11} />}
      {label}
    </label>
    {children}
  </div>
)

const SelectField = ({ label, options, value, onChange, icon: Icon }) => (
  <InputField label={label} icon={Icon}>
    <select value={value} onChange={(e) => onChange(e.target.value)} className={inputCls}>
      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </InputField>
)

// Open Library search — free, no key required
const searchOpenLibrary = async (query) => {
  const res = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=5&fields=title,author_name,isbn,first_publish_year,number_of_pages_median,subject,cover_i`)
  const data = await res.json()
  return data.docs || []
}

const BookForm = ({ initialData = {}, onSubmit, onCancel, submitLabel = 'Save Book' }) => {
  const [formData, setFormData] = useState({
    title: '', author: '', isbn: '', genre: 'Fiction',
    coverImage: '', description: '', status: 'Want to Read',
    personalNotes: '',
    ...initialData,
    pages:           initialData.pages           ? String(initialData.pages)           : '',
    publicationYear: initialData.publicationYear ? String(initialData.publicationYear) : '',
  })

  const [searchQuery, setSearchQuery]   = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching]   = useState(false)
  const [showResults, setShowResults]   = useState(false)

  const set = (key) => (e) => setFormData(prev => ({ ...prev, [key]: e.target ? e.target.value : e }))

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    setIsSearching(true)
    setShowResults(true)
    try {
      const results = await searchOpenLibrary(searchQuery)
      setSearchResults(results)
    } catch {
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const applyResult = (doc) => {
    const isbn = doc.isbn ? doc.isbn[0] : ''
    const coverId = doc.cover_i
    setFormData(prev => ({
      ...prev,
      title:           doc.title                  || prev.title,
      author:          doc.author_name?.[0]       || prev.author,
      isbn:            isbn                        || prev.isbn,
      publicationYear: String(doc.first_publish_year || prev.publicationYear),
      pages:           String(doc.number_of_pages_median || prev.pages),
      coverImage:      coverId
        ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
        : prev.coverImage,
    }))
    setShowResults(false)
    setSearchQuery('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.author.trim()) {
      alert('Title and Author are required.')
      return
    }
    onSubmit({
      ...formData,
      pages:           parseInt(formData.pages)           || 0,
      publicationYear: parseInt(formData.publicationYear) || 0,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* ── Open Library Search ── */}
      <div className="p-4 bg-accent-warm/8 dark:bg-accent-warm/5 border border-accent-warm/20 rounded-xl">
        <p className="text-xs font-bold uppercase tracking-wider text-accent-warm dark:text-accent-warm mb-2">Auto-fill from Open Library</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearch())}
            placeholder="Search by title or author…"
            className={inputCls}
          />
          <button
            type="button"
            onClick={handleSearch}
            className="px-4 py-2.5 bg-accent-warm hover:bg-accent-dark text-white rounded-xl text-sm font-bold shrink-0 flex items-center gap-2 transition-all"
          >
            {isSearching ? <Loader size={14} className="animate-spin" /> : <Search size={14} />}
            Search
          </button>
        </div>

        {/* Results dropdown */}
        {showResults && (
          <div className="mt-2 border border-stone-200 dark:border-[#2e2720] rounded-xl overflow-hidden bg-white dark:bg-[#1f1a15] shadow-lg">
            <div className="flex justify-between items-center px-3 py-2 border-b border-stone-100 dark:border-[#2e2720]">
              <span className="text-xs text-stone-500 dark:text-stone-600">
                {isSearching ? 'Searching…' : `${searchResults.length} results`}
              </span>
              <button type="button" onClick={() => setShowResults(false)} className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200">
                <X size={14} />
              </button>
            </div>
            {searchResults.length > 0 ? searchResults.map((doc, i) => (
              <button
                key={i}
                type="button"
                onClick={() => applyResult(doc)}
                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-stone-50 dark:hover:bg-[#2a221a] transition-colors text-left border-b border-stone-50 dark:border-[#2e2720] last:border-0"
              >
                {doc.cover_i && (
                  <img
                    src={`https://covers.openlibrary.org/b/id/${doc.cover_i}-S.jpg`}
                    alt=""
                    className="w-8 h-10 object-cover rounded shadow-sm shrink-0"
                  />
                )}
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-stone-800 dark:text-[#e8ddd3] truncate">{doc.title}</p>
                  <p className="text-xs text-stone-500 dark:text-stone-600 truncate">{doc.author_name?.[0]} · {doc.first_publish_year}</p>
                </div>
              </button>
            )) : !isSearching && (
              <p className="px-3 py-4 text-sm text-stone-400 dark:text-stone-600 text-center">No results found.</p>
            )}
          </div>
        )}
      </div>

      {/* ── Form Fields ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <InputField label="Title" icon={Book}>
          <input type="text" required value={formData.title} onChange={set('title')} placeholder="e.g. The Great Gatsby" className={inputCls} />
        </InputField>

        <InputField label="Author" icon={FileText}>
          <input type="text" required value={formData.author} onChange={set('author')} placeholder="e.g. F. Scott Fitzgerald" className={inputCls} />
        </InputField>

        <InputField label="ISBN" icon={Hash}>
          <input type="text" value={formData.isbn} onChange={set('isbn')} placeholder="e.g. 978-0-06-112008-4" className={inputCls} />
        </InputField>

        <SelectField label="Genre" icon={Layers} options={GENRES} value={formData.genre} onChange={(v) => setFormData(p => ({ ...p, genre: v }))} />

        <InputField label="Total Pages" icon={Book}>
          <input type="number" min="0" value={formData.pages} onChange={set('pages')} placeholder="e.g. 320" className={inputCls} />
        </InputField>

        <InputField label="Publication Year" icon={Calendar}>
          <input type="number" min="1" max="2100" value={formData.publicationYear} onChange={set('publicationYear')} placeholder="e.g. 1925" className={inputCls} />
        </InputField>

        <InputField label="Cover Image URL" icon={Bookmark}>
          <input type="url" value={formData.coverImage} onChange={set('coverImage')} placeholder="https://…" className={inputCls} />
        </InputField>

        <SelectField label="Reading Status" icon={Clock} options={STATUSES} value={formData.status} onChange={(v) => setFormData(p => ({ ...p, status: v }))} />

        {/* Cover preview */}
        {formData.coverImage && (
          <div className="md:col-span-2 flex items-center gap-4">
            <img src={formData.coverImage} alt="Cover preview" className="w-16 h-24 object-cover rounded-lg shadow" />
            <p className="text-xs text-stone-400 dark:text-stone-600">Cover preview</p>
          </div>
        )}

        <div className="md:col-span-2 space-y-5">
          <InputField label="Description" icon={FileText}>
            <textarea rows={3} value={formData.description} onChange={set('description')} placeholder="What is this book about?" className={inputCls} />
          </InputField>
          <InputField label="Personal Notes" icon={Quote}>
            <textarea rows={3} value={formData.personalNotes} onChange={set('personalNotes')} placeholder="Your thoughts, takeaways, feelings…" className={inputCls} />
          </InputField>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2 border-t border-stone-100 dark:border-[#2e2720]">
        <button type="button" onClick={onCancel} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-[#2a221a] transition-all">
          Cancel
        </button>
        <button type="submit" className="px-6 py-2.5 rounded-xl text-sm font-bold bg-accent-warm hover:bg-accent-dark text-white shadow-md shadow-accent-warm/20 transition-all active:scale-95">
          {submitLabel}
        </button>
      </div>
    </form>
  )
}

export default BookForm
