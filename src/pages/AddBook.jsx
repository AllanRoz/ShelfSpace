import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useLibrary } from '../context/LibraryContext'
import BookForm from '../components/books/BookForm'

const AddBook = () => {
  const { addBook } = useLibrary()
  const navigate = useNavigate()

  const handleSubmit = (formData) => {
    addBook(formData)
    navigate('/bookshelf')
  }

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-stone-800 dark:text-[#e8ddd3]">Add New Book</h1>
        <p className="text-stone-500 dark:text-stone-500 mt-1">Every great library starts with the next great book.</p>
      </div>
      <div className="bg-white dark:bg-[#1f1a15] border border-stone-200 dark:border-[#2e2720] rounded-2xl shadow-sm p-6 md:p-8">
        <BookForm
          onSubmit={handleSubmit}
          onCancel={() => navigate('/bookshelf')}
          submitLabel="Add to Library"
        />
      </div>
    </div>
  )
}

export default AddBook
