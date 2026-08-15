import React, { useState } from 'react'
import { Card } from '../components/ui/DashboardUI'
import { Download, Upload, ShieldCheck, Trash2, AlertTriangle } from 'lucide-react'
import { libraryUtils } from '../utils/libraryUtils'
import { storage } from '../utils/storage'
import { motion } from 'framer-motion'

const SettingsPage = () => {
  const [isImporting, setIsImporting] = useState(false)
  const [importStatus, setImportStatus] = useState({ type: '', message: '' })

  const handleExport = () => {
    libraryUtils.exportLibrary()
  }

  const handleImport = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const result = libraryUtils.importLibrary(event.target.result)
      if (result.success) {
        setImportStatus({ type: 'success', message: 'Library imported successfully! Please refresh the page.' })
      } else {
        setImportStatus({ type: 'error', message: result.error })
      }
    }
    reader.readAsText(file)
  }

  const handleClearData = () => {
    if (window.confirm('Are you absolutely sure? This will permanently delete your entire library, all collections, and settings. This cannot be undone.')) {
      localStorage.clear()
      window.location.reload()
    }
  }

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-stone-800 dark:text-stone-100">Settings</h1>
        <p className="text-stone-500 dark:text-stone-400 mt-2">Manage your data and backup your collection.</p>
      </header>

      <div className="space-y-8">
        {/* Backup Section */}
        <Section title="Backup & Restore" icon={<ShieldCheck className="text-emerald-500" />}>
          <Card className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-700">
                <h3 className="font-bold text-stone-800 dark:text-stone-100 mb-2 flex items-center gap-2">
                  <Download size={18} className="text-accent-warm" />
                  Export Library
                </h3>
                <p className="text-sm text-stone-500 dark:text-stone-400 mb-4">
                  Download your entire library as a JSON file. Keep this file safe as it is the only way to recover your data.
                </p>
                <button 
                  onClick={handleExport}
                  className="px-4 py-2 bg-accent-warm text-white rounded-xl font-medium hover:bg-accent-dark transition-all shadow-sm"
                >
                  Export JSON
                </button>
              </div>

              <div className="flex-1 p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-700">
                <h3 className="font-bold text-stone-800 dark:text-stone-100 mb-2 flex items-center gap-2">
                  <Upload size={18} className="text-accent-warm" />
                  Import Library
                </h3>
                <p className="text-sm text-stone-500 dark:text-stone-400 mb-4">
                  Restore your library from a previously exported JSON backup file.
                </p>
                <label className="px-4 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl font-medium hover:bg-stone-100 dark:hover:bg-stone-700 transition-all cursor-pointer block text-center shadow-sm">
                  Upload JSON
                  <input type="file" accept=".json" onChange={handleImport} className="hidden" />
                </label>
              </div>
            </div>

            <AnimatePresence>
              {importStatus.message && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`p-4 rounded-xl flex items-center gap-3 text-sm ${
                    importStatus.type === 'success' 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800' 
                      : 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800'
                  }`}
                >
                  {importStatus.type === 'success' ? <ShieldCheck size={18} /> : <AlertTriangle size={18} />}
                  {importStatus.message}
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </Section>

        {/* Danger Zone */}
        <Section title="Danger Zone">
          <Card className="p-6 border-rose-100 dark:border-rose-900/30">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-xl">
                <Trash2 size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-stone-800 dark:text-stone-100 mb-1">Reset All Data</h3>
                <p className="text-sm text-stone-500 dark:text-stone-400 mb-4">
                  This will permanently delete all your books, collections, and settings. This action is irreversible.
                </p>
                <button 
                  onClick={handleClearData}
                  className="px-4 py-2 bg-rose-600 text-white rounded-xl font-medium hover:bg-rose-700 transition-all shadow-sm shadow-rose-600/20"
                >
                  Wipe Library
                </button>
              </div>
            </div>
          </Card>
        </Section>
      </div>
    </div>
  )
}

// Import Section to avoid a crash since it's used in the JSX
import { Section } from '../components/ui/DashboardUI'

export default SettingsPage
