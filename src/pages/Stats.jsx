import React, { useMemo } from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import { Bar, Pie } from 'react-chartjs-2'
import { useLibrary } from '../context/LibraryContext'
import { StatCard, Section, Card } from '../components/ui/DashboardUI'
import { Trophy, BookOpen, Calendar, Hash } from 'lucide-react'
import { ACHIEVEMENT_DEFINITIONS } from '../data/achievements'
import { motion } from 'framer-motion'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

const StatisticsPage = () => {
  const { books } = useLibrary()

  // --- Calculations ---
  const stats = useMemo(() => {
    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth()

    const finishedBooks = books.filter(b => b.status === 'Finished')
    
    const booksThisYear = finishedBooks.filter(b => b.dateFinished && new Date(b.dateFinished).getFullYear() === currentYear).length
    const booksThisMonth = finishedBooks.filter(b => b.dateFinished && new Date(b.dateFinished).getMonth() === currentMonth && new Date(b.dateFinished).getFullYear() === currentYear).length
    const totalPages = finishedBooks.reduce((acc, b) => acc + (b.pages || 0), 0)
    const avgPages = finishedBooks.length ? Math.round(totalPages / finishedBooks.length) : 0
    const avgRating = finishedBooks.length ? (finishedBooks.reduce((acc, b) => acc + (b.rating || 0), 0) / finishedBooks.length).toFixed(1) : '0.0'

    // Genre distribution
    const genreCounts = {}
    books.forEach(b => {
      genreCounts[b.genre] = (genreCounts[b.genre] || 0) + 1
    })

    // Monthly activity (last 6 months)
    const monthlyData = new Array(6).fill(0)
    const monthNames = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date()
      d.setMonth(now.getMonth() - i)
      monthNames.push(d.toLocaleString('default', { month: 'short' }))
    }

    finishedBooks.forEach(b => {
      if (!b.dateFinished) return
      const d = new Date(b.dateFinished)
      const diff = (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth())
      if (diff >= 0 && diff < 6) {
        monthlyData[5 - diff]++
      }
    })

    return {
      booksThisYear,
      booksThisMonth,
      totalPages,
      avgPages,
      avgRating,
      genreCounts,
      monthlyData,
      monthNames
    }
  }, [books])

  // --- Chart Data ---
  const genreChartData = {
    labels: Object.keys(stats.genreCounts),
    datasets: [{
      label: 'Books',
      data: Object.values(stats.genreCounts),
      backgroundColor: [
        '#d4a373', '#a98467', '#6b705c', '#b7b7a4', '#ffe8d6', 
        '#ddbea9', '#cb997e', '#ffb4a2', '#e5989b', '#b5838d'
      ],
      borderWidth: 0,
    }]
  }

  const activityChartData = {
    labels: stats.monthNames,
    datasets: [{
      label: 'Books Completed',
      data: stats.monthlyData,
      backgroundColor: 'rgba(212, 163, 115, 0.6)',
      borderColor: '#d4a373',
      borderWidth: 2,
      borderRadius: 8,
    }]
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-stone-800 dark:text-stone-100">Reading Statistics</h1>
        <p className="text-stone-500 dark:text-stone-400 mt-2">Visualizing your journey through the pages.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard label="Read This Year" value={stats.booksThisYear} icon={Calendar} colorClass="text-blue-600 dark:text-blue-400" />
        <StatCard label="Read This Month" value={stats.booksThisMonth} icon={Clock} colorClass="text-emerald-600 dark:text-emerald-400" />
        <StatCard label="Total Pages" value={stats.totalPages.toLocaleString()} icon={BookOpen} colorClass="text-accent-warm" />
        <StatCard label="Avg Pages/Book" value={stats.avgPages} icon={Hash} colorClass="text-stone-600 dark:text-stone-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <Card className="p-6">
          <h3 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-6">Genre Distribution</h3>
          <div className="max-w-xs mx-auto">
            <Pie data={genreChartData} options={{ plugins: { legend: { position: 'bottom' } } }} />
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-6">Monthly Activity</h3>
          <Bar data={activityChartData} options={{ 
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } 
          }} />
        </Card>
      </div>

      <Section title="Achievements" action="View All">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {ACHIEVEMENT_DEFINITIONS.map(ach => {
            const isUnlocked = ach.criteria(books)
            return (
              <motion.div 
                key={ach.id}
                whileHover={{ scale: 1.02 }}
                className={`
                  p-4 rounded-2xl border-2 transition-all flex flex-col items-center text-center gap-3
                  ${isUnlocked 
                    ? 'bg-white dark:bg-stone-800 border-accent-warm shadow-md' 
                    : 'bg-stone-50 dark:bg-stone-900/50 border-stone-200 dark:border-stone-700 opacity-60'}
                `}
              >
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-sm
                  ${isUnlocked ? 'bg-accent-warm text-white' : 'bg-stone-200 dark:bg-stone-700 text-stone-400'}
                `}>
                  {ach.icon}
                </div>
                <div>
                  <h4 className={`font-bold text-sm ${isUnlocked ? 'text-stone-800 dark:text-stone-100' : 'text-stone-400'}`}>
                    {ach.name}
                  </h4>
                  <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-1 leading-tight">
                    {ach.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </Section>
    </div>
  )
}

export default StatisticsPage
