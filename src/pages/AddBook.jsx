import React from 'react'
import { Book, Bookmark, Calendar, FileText, Star, Hash, Layers, Quote, Clock } from 'lucide-react'
import { Card } from '../components/ui/DashboardUI'
import { useLibrary } from '../context/LibraryContext'
import { useNavigate } from 'react-router-dom'

const InputField = ({ label, icon: Icon, children }) => (
  <div className="space-y-2">
    <label className="flex items-center gap-2 text-sm font-medium text-stone-600 dark:text-stone-400">
      {Icon && <Icon size={14} />}
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
      className="w-full px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-accent-warm focus:outline-none transition-all"
    >
      {options.map(opt => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
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

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.title || !formData.author) return alert('Title and Author are required!')

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
        <h1 className="text-3xl font-bold text-stone-800 dark:text-stone-100">Add New Book</h1>
        <p className="text-stone-500 dark:text-stone-400">Add a new masterpiece to your digital shelf.</p>
      </div>

      <Card className="p-8">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Title" icon={Book}>
            <input 
              type="text" 
              required
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="e.g. The Great Gatsby"
              className="w-full px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-accent-warm focus:outline-none transition-all"
            />
          </InputField>

          <InputField label="Author" icon={FileText}>
            <input 
              type="text" 
              required
              value={formData.author}
              onChange={(e) => setFormData({...formData, author: e.target.value})}
              placeholder="e.g. F. Scott Fitzgerald"
              className="w-full px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-accent-warm focus:outline-none transition-all"
            />
          </InputField>

          <InputField label="ISBN" icon={Hash}>
            <input 
              type="text" 
              value={formData.isbn}
              onChange={(e) => setFormData({...formData, isbn: e.target.value})}
              placeholder="e.g. 978-3-16-148410-0"
              className="w-full px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-accent-warm focus:outline-none transition-all"
            />
          </InputField>

          <SelectField 
            label="Genre" 
            icon={Layers}
            options={['Fiction', 'Fantasy', 'Sci-Fi', 'Non-Fiction', 'Biography', 'History', 'Finance', 'Psychology', 'Self Improvement', 'Mystery', 'Classic']} 
            value={formData.genre}
            onChange={(val) => setFormData({...formData, genre: val})}
          />

          <InputField label="Total Pages" icon={Book}>
            <input 
              type="number" 
              value={formData.pages}
              onChange={(e) => setFormData({...formData, pages: e.target.value})}
              placeholder="e.g. 320"
              className="w-full px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-accent-warm focus:outline-none transition-all"
            />
          </InputField>

          <InputField label="Publication Year" icon={Calendar}>
            <input 
              type="number" 
              value={formData.publicationYear}
              onChange={(e) => setFormData({...formData, publicationYear: e.target.value})}
              placeholder="e.g. 1925"
              className="w-full px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-accent-warm focus:outline-none transition-all"
            />
          </InputField>

          <InputField label="Cover Image URL" icon={Bookmark}>
            <input 
              type="url" 
              value={formData.coverImage}
              onChange={(e) => setFormData({...formData, coverImage: e.target.value})}
              placeholder="https://..."
              className="w-full px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-accent-warm focus:outline-none transition-all"
            />
          </InputField>

          <SelectField 
            label="Status" 
            icon={Clock}
            options={['Want to Read', 'Currently Reading', 'Finished', 'DNF']} 
            value={formData.status}
            onChange={(val) => setFormData({...formData, status: val})}
          />

          <div className="md:col-span-2 space-y-6">
            <InputField label="Description" icon={FileText}>
              <textarea 
                rows="3"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="What is this book about?"
                className="w-full px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-accent-warm focus:outline-none transition-all"
              />
            </InputField>

            <InputField label="Personal Notes" icon={Quote}>
              <textarea 
                rows="3"
                value={formData.personalNotes}
                onChange={(e) => setFormData({...formData, personalNotes: e.target.value})}
                placeholder="Your thoughts..."
                className="w-full px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-accent-warm focus:outline-none transition-all"
              />
            </InputField>
          </div>

          <div className="md:col-span-2 flex justify-end gap-4 mt-4">
            <button 
              type="button"
              onClick={() => navigate('/')}
              className="px-6 py-2 rounded-xl text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-700 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-6 py-2 rounded-xl bg-accent-warm text-white font-bold hover:bg-accent-dark shadow-md transition-all"
            >
              Save Book
            </button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default AddBook
