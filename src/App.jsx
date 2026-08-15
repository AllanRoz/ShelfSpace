import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/ui/Layout'
import Dashboard    from './pages/Dashboard'
import AddBook      from './pages/AddBook'
import EditBook     from './pages/EditBook'
import Bookshelf    from './pages/Bookshelf'
import Collections  from './pages/Collections'
import ReadingLists from './pages/ReadingLists'
import Authors      from './pages/Authors'
import StatisticsPage from './pages/Stats'
import SettingsPage   from './pages/Settings'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/"             element={<Dashboard />} />
        <Route path="/bookshelf"    element={<Bookshelf />} />
        <Route path="/collections"  element={<Collections />} />
        <Route path="/lists"        element={<ReadingLists />} />
        <Route path="/authors"      element={<Authors />} />
        <Route path="/stats"        element={<StatisticsPage />} />
        <Route path="/settings"     element={<SettingsPage />} />
        <Route path="/add"          element={<AddBook />} />
        <Route path="/edit/:id"     element={<EditBook />} />
      </Routes>
    </Layout>
  )
}

export default App
