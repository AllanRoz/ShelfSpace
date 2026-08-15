import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { Layout } from './components/ui/Layout'
import Dashboard from './pages/Dashboard'
import AddBook from './pages/AddBook'

import Bookshelf from './pages/Bookshelf'
const Stats = () => <div className="p-8"> <h1 className="text-3xl font-bold text-stone-800 dark:text-stone-100">Statistics</h1> <p className="mt-2 text-stone-600 dark:text-stone-400">Your reading stats will appear here.</p> </div>;
const Settings = () => <div className="p-8"> <h1 className="text-3xl font-bold text-stone-800 dark:text-stone-100">Settings</h1> <p className="mt-2 text-stone-600 dark:text-stone-400">Manage your library settings.</p> </div>;

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/bookshelf" element={<Bookshelf />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/add" element={<AddBook />} />
      </Routes>
    </Layout>
  )
}

export default App
