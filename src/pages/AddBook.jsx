import React from 'react'
import { Book, Bookmark, Calendar, FileText, Hash, Layers, Quote, Clock } from 'lucide-react'
import { useLibrary } from '../context/LibraryContext'
import { useNavigate } from 'react-router-dom'

// Shared input class for consistent dark mode styling
const inputCls = `
  w-full px-4 py-2.5 rounded-xl text-sm
  border border-stone-200 dark:border-[#2e2720]
  bg-white dark:bg-[#16120e]
  text-stone-800 dark:text-[#e8ddd3]
  placeholder-stone-400 dark:placeholder-stone-600
  focus:ring-2 focus:ring-accent-warm focus:outline-none
  transition-all
`

const InputField = ({ label, icon: Icon, children }) => (
  <div className="space-y-1.5">
    <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-600">
      {Icon && <Icon size={12} />}
      {label}
    </label>
    {children}
  </div>
)

const SelectField = ({ label, options, value, onChange, icon: Icon }) => (
  <InputField label={label} icon={Icon}>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={inputCls}
    >
      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </InputField>
)

const AddBook = () => {
  const { addBook } = useLibrary()
  const navigate = useNavigate()

  const [formData, setFormData] = React.useState({
    title: '',
    author: '',
    isbn: '',
    genre: 'Fiction',
    pages: '',
    publicationYear: '',
    coverImage: '',
    description: '',
    status: 'Want to Read',
    personalNotes: '',
  })

  const set = (key) => (e) => setFormData(prev => ({ ...prev, [key]: e.target ? e.target.value : e }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.author.trim()) {
      alert('Title and Author are required.')
      return
    }
    addBook({
      ...formData,
      pages: parseInt(formData.pages) || 0,
      publicationYear: parseInt(formData.publicationYear) || 0,
    })
    navigate('/')
  }

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-stone-800 dark:text-[#e8ddd3]">Add New Book</h1>
        <p className="text-stone-500 dark:text-stone-500 mt-1">Every great library starts with the next great book.</p>
      </div>

      <div className="bg-white dark:bg-[#1f1a15] border border-stone-200 dark:border-[#2e2720] rounded-2xl shadow-sm p-6 md:p-8">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <InputField label="Title" icon={Book}>
            <input type="text" required value={formData.title} onChange={set('title')} placeholder="e.g. The Great Gatsby" className={inputCls} />
          </InputField>

          <InputField label="Author" icon={FileText}>
            <input type="text" required value={formData.author} onChange={set('author')} placeholder="e.g. F. Scott Fitzgerald" className={inputCls} />
          </InputField>

          <InputField label="ISBN" icon={Hash}>
            <input type="text" value={formData.isbn} onChange={set('isbn')} placeholder="e.g. 978-0-06-112008-4" className={inputCls} />
          </InputField>

          <SelectField
            label="Genre" icon={Layers}
            options={['Fiction', 'Fantasy', 'Sci-Fi', 'Non-Fiction', 'Biography', 'History', 'Finance', 'Psychology', 'Self Improvement', 'Mystery', 'Classic', 'Philosophy', 'Business']}
            value={formData.genre}
            onChange={(val) => setFormData(prev => ({ ...prev, genre: val }))}
          />

          <InputField label="Total Pages" icon={Book}>
            <input type="number" min="0" value={formData.pages} onChange={set('pages')} placeholder="e.g. 320" className={inputCls} />
          </InputField>

          <InputField label="Publication Year" icon={Calendar}>
            <input type="number" min="1" max="2100" value={formData.publicationYear} onChange={set('publicationYear')} placeholder="e.g. 1925" className={inputCls} />
          </InputField>

          <InputField label="Cover Image URL" icon={Bookmark}>
            <input type="url" value={formData.coverImage} onChange={set('coverImage')} placeholder="https://…" className={inputCls} />
          </InputField>

          <SelectField
            label="Reading Status" icon={Clock}
            options={['Want to Read', 'Currently Reading', 'Finished', 'DNF']}
            value={formData.status}
            onChange={(val) => setFormData(prev => ({ ...prev, status: val }))}
          />

          <div className="md:col-span-2 space-y-5">
            <InputField label="Description" icon={FileText}>
              <textarea rows={3} value={formData.description} onChange={set('description')} placeholder="What is this book about?" className={inputCls} />
            </InputField>

            <InputField label="Personal Notes" icon={Quote}>
              <textarea rows={3} value={formData.personalNotes} onChange={set('personalNotes')} placeholder="Your thoughts, takeaways, feelings…" className={inputCls} />
            </InputField>
          </div>

          <div className="md:col-span-2 flex justify-end gap-3 pt-2 border-t border-stone-100 dark:border-[#2e2720] mt-2">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-[#2a221a] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-sm font-bold bg-accent-warm hover:bg-accent-dark text-white shadow-md shadow-accent-warm/20 transition-all active:scale-95"
            >
              Save Book
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddBook
