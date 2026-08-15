import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, Upload, ShieldCheck, Trash2, AlertTriangle } from 'lucide-react'
import { libraryUtils } from '../utils/libraryUtils'

const SettingsPage = () => {
  const [importStatus, setImportStatus] = useState({ type: '', message: '' })

  const handleImport = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const result = libraryUtils.importLibrary(ev.target.result)
      setImportStatus(
        result.success
          ? { type: 'success', message: 'Library imported successfully! Refresh the page to see your books.' }
          : { type: 'error', message: result.error }
      )
    }
    reader.readAsText(file)
  }

  const handleClearData = () => {
    if (window.confirm('This will permanently delete your entire library. This cannot be undone. Continue?')) {
      localStorage.clear()
      window.location.reload()
    }
  }

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold text-stone-800 dark:text-[#e8ddd3]">Settings</h1>
        <p className="text-stone-500 dark:text-stone-500 mt-1">Manage your data and backup your collection.</p>
      </header>

      <div className="space-y-6">

        {/* ── Export ── */}
        <SettingsCard
          icon={<Download size={20} className="text-accent-warm" />}
          title="Export Library"
          description="Download your entire library as a JSON file. Use this to back up your books, collections, and reading progress."
          action={
            <button
              onClick={() => libraryUtils.exportLibrary()}
              className="px-5 py-2 bg-accent-warm hover:bg-accent-dark text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-accent-warm/20"
            >
              Export JSON
            </button>
          }
        />

        {/* ── Import ── */}
        <SettingsCard
          icon={<Upload size={20} className="text-emerald-500" />}
          title="Import Library"
          description="Restore your library from a previously exported JSON file. This will overwrite your current library."
          action={
            <label className="inline-block px-5 py-2 bg-white dark:bg-[#2a221a] border border-stone-200 dark:border-[#352b20] text-stone-700 dark:text-stone-300 text-sm font-bold rounded-xl hover:bg-stone-50 dark:hover:bg-[#352b20] transition-all cursor-pointer shadow-sm">
              Upload JSON
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
          }
        >
          <AnimatePresence>
            {importStatus.message && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex items-start gap-3 p-3 rounded-xl text-sm mt-4 ${
                  importStatus.type === 'success'
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40'
                    : 'bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800/40'
                }`}
              >
                {importStatus.type === 'success'
                  ? <ShieldCheck size={16} className="shrink-0 mt-0.5" />
                  : <AlertTriangle size={16} className="shrink-0 mt-0.5" />}
                <span>{importStatus.message}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </SettingsCard>

        {/* ── Danger Zone ── */}
        <div className="border border-rose-200 dark:border-rose-900/40 rounded-2xl overflow-hidden">
          <div className="px-5 py-3 bg-rose-50 dark:bg-rose-900/20">
            <p className="text-xs font-bold uppercase tracking-widest text-rose-500 dark:text-rose-400">Danger Zone</p>
          </div>
          <div className="p-5 bg-white dark:bg-[#1f1a15] flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-rose-100 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 shrink-0">
              <Trash2 size={20} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-stone-800 dark:text-[#e8ddd3] mb-1">Wipe Library</h3>
              <p className="text-sm text-stone-500 dark:text-stone-500 mb-4">
                Permanently delete all books, collections, and settings. This action is irreversible. Export first if you want to keep your data.
              </p>
              <button
                onClick={handleClearData}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-rose-600/20"
              >
                Delete Everything
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

const SettingsCard = ({ icon, title, description, action, children }) => (
  <div className="bg-white dark:bg-[#1f1a15] border border-stone-200 dark:border-[#2e2720] rounded-2xl p-5 shadow-sm">
    <div className="flex items-start gap-4">
      <div className="p-2.5 rounded-xl bg-stone-100 dark:bg-[#2a221a] shrink-0">{icon}</div>
      <div className="flex-1">
        <h3 className="font-bold text-stone-800 dark:text-[#e8ddd3] mb-1">{title}</h3>
        <p className="text-sm text-stone-500 dark:text-stone-500 mb-4">{description}</p>
        {action}
        {children}
      </div>
    </div>
  </div>
)

export default SettingsPage
