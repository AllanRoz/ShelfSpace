import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useLibrary } from '../context/LibraryContext'
import BookForm from '../components/books/BookForm'

const EditBook = () => {
  const { id } = useParams()
  const { books, updateBook } = useLibrary()
  const navigate = useNavigate()

  const book = books.find(b => b.id === id)

  if (!book) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
        <h2 className="text-2xl font-bold text-stone-700 dark:text-stone-300 mb-2">Book not found</h2>
        <button onClick={() => navigate('/bookshelf')} className="text-accent-warm hover:underline text-sm mt-2">
          Return to Bookshelf
        </button>
      </div>
    )
  }

  const handleSubmit = (formData) => {
    updateBook(id, formData)
    navigate('/bookshelf')
  }

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-stone-800 dark:text-[#e8ddd3]">Edit Book</h1>
        <p className="text-stone-500 dark:text-stone-500 mt-1">Update the details for <span className="font-semibold text-stone-700 dark:text-stone-300">"{book.title}"</span></p>
      </div>
      <div className="bg-white dark:bg-[#1f1a15] border border-stone-200 dark:border-[#2e2720] rounded-2xl shadow-sm p-6 md:p-8">
        <BookForm
          initialData={book}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/bookshelf')}
          submitLabel="Save Changes"
        />
      </div>
    </div>
  )
}

export default EditBook
