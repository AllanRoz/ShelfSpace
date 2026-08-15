import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { Layout } from './components/ui/Layout'
import Dashboard from './pages/Dashboard'
import AddBook from './pages/AddBook'

import Bookshelf from './pages/Bookshelf'
import Collections from './pages/Collections'
import StatisticsPage from './pages/Stats'
import SettingsPage from './pages/Settings'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/bookshelf" element={<Bookshelf />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/stats" element={<StatisticsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/add" element={<AddBook />} />
      </Routes>
    </Layout>
  )
}

export default App
