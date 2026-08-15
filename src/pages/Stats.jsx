import React, { useMemo } from 'react'
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement,
  Title, Tooltip, Legend, ArcElement
} from 'chart.js'
import { Bar, Pie } from 'react-chartjs-2'
import { useLibrary } from '../context/LibraryContext'
import { StatCard, Section, Card } from '../components/ui/DashboardUI'
import { BookOpen, Calendar, Hash, Clock } from 'lucide-react'
import { ACHIEVEMENT_DEFINITIONS } from '../data/achievements'
import { motion } from 'framer-motion'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

// Detect dark mode from the <html> element at render time
const isDark = () => document.documentElement.classList.contains('dark')

const CHART_COLORS = [
  '#c9956a', '#a97a52', '#d4b896', '#7c6a5a',
  '#e8c9a0', '#b08060', '#6b8e7a', '#8b7355',
  '#c4956a', '#9e7b5c', '#d2a87a'
]

const StatisticsPage = () => {
  const { books } = useLibrary()
  const dark = isDark()

  const gridColor  = dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)'
  const tickColor  = dark ? '#6b5f52' : '#a8a29e'
  const labelColor = dark ? '#a09080' : '#78716c'

  const stats = useMemo(() => {
    const now = new Date()
    const currentYear  = now.getFullYear()
    const currentMonth = now.getMonth()

    const finished = books.filter(b => b.status === 'Finished')

    const booksThisYear  = finished.filter(b => b.dateFinished && new Date(b.dateFinished).getFullYear() === currentYear).length
    const booksThisMonth = finished.filter(b => {
      if (!b.dateFinished) return false
      const d = new Date(b.dateFinished)
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear
    }).length
    const totalPages = finished.reduce((acc, b) => acc + (b.pages || 0), 0)
    const avgPages   = finished.length ? Math.round(totalPages / finished.length) : 0
    const avgRating  = finished.length
      ? (finished.reduce((acc, b) => acc + (b.rating || 0), 0) / finished.length).toFixed(1)
      : '0.0'

    // Genre distribution (all books)
    const genreCounts = {}
    books.forEach(b => { genreCounts[b.genre] = (genreCounts[b.genre] || 0) + 1 })

    // Monthly activity (last 6 months)
    const monthlyData = new Array(6).fill(0)
    const monthNames  = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date()
      d.setMonth(now.getMonth() - i)
      monthNames.push(d.toLocaleString('default', { month: 'short' }))
    }
    finished.forEach(b => {
      if (!b.dateFinished) return
      const d    = new Date(b.dateFinished)
      const diff = (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth())
      if (diff >= 0 && diff < 6) monthlyData[5 - diff]++
    })

    return { booksThisYear, booksThisMonth, totalPages, avgPages, avgRating, genreCounts, monthlyData, monthNames }
  }, [books])

  const genreChartData = {
    labels: Object.keys(stats.genreCounts),
    datasets: [{
      data: Object.values(stats.genreCounts),
      backgroundColor: CHART_COLORS,
      borderWidth: 0,
    }]
  }

  const activityChartData = {
    labels: stats.monthNames,
    datasets: [{
      label: 'Books Completed',
      data: stats.monthlyData,
      backgroundColor: dark ? 'rgba(201,149,106,0.3)' : 'rgba(201,149,106,0.55)',
      borderColor: '#c9956a',
      borderWidth: 2,
      borderRadius: 8,
    }]
  }

  const pieOptions = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: labelColor, font: { size: 11 }, padding: 16, boxWidth: 12 }
      },
      tooltip: {
        backgroundColor: dark ? '#1f1a15' : '#fff',
        titleColor: dark ? '#e8ddd3' : '#1c1917',
        bodyColor:  dark ? '#a09080' : '#78716c',
        borderColor: dark ? '#2e2720' : '#e7e5e4',
        borderWidth: 1,
      }
    }
  }

  const barOptions = {
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: dark ? '#1f1a15' : '#fff',
        titleColor: dark ? '#e8ddd3' : '#1c1917',
        bodyColor:  dark ? '#a09080' : '#78716c',
        borderColor: dark ? '#2e2720' : '#e7e5e4',
        borderWidth: 1,
      }
    },
    scales: {
      x: {
        grid:  { color: gridColor },
        ticks: { color: tickColor, font: { size: 11 } },
        border: { color: gridColor }
      },
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1, color: tickColor, font: { size: 11 } },
        grid:  { color: gridColor },
        border: { color: gridColor }
      }
    }
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-stone-800 dark:text-[#e8ddd3]">Reading Statistics</h1>
        <p className="text-stone-500 dark:text-stone-500 mt-2">Visualizing your journey through the pages.</p>
      </header>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard label="Read This Year"  value={stats.booksThisYear}               icon={Calendar} colorClass="text-blue-500 dark:text-blue-400" />
        <StatCard label="Read This Month" value={stats.booksThisMonth}              icon={Clock}    colorClass="text-emerald-500 dark:text-emerald-400" />
        <StatCard label="Total Pages"     value={stats.totalPages.toLocaleString()} icon={BookOpen} colorClass="text-accent-warm" />
        <StatCard label="Avg Pages/Book"  value={stats.avgPages}                    icon={Hash}     colorClass="text-stone-500 dark:text-stone-400" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        <Card className="p-6">
          <h3 className="text-base font-bold text-stone-800 dark:text-[#e8ddd3] mb-5">Genre Distribution</h3>
          {Object.keys(stats.genreCounts).length > 0 ? (
            <div className="max-w-xs mx-auto">
              <Pie data={genreChartData} options={pieOptions} />
            </div>
          ) : (
            <p className="text-center text-stone-400 dark:text-stone-600 py-12 text-sm">Add books to see genre distribution.</p>
          )}
        </Card>

        <Card className="p-6">
          <h3 className="text-base font-bold text-stone-800 dark:text-[#e8ddd3] mb-5">Books Completed — Last 6 Months</h3>
          <Bar data={activityChartData} options={barOptions} />
        </Card>
      </div>

      {/* Achievements */}
      <Section title="Achievements">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {ACHIEVEMENT_DEFINITIONS.map(ach => {
            const unlocked = ach.criteria(books)
            return (
              <motion.div
                key={ach.id}
                whileHover={{ scale: 1.03 }}
                className={`
                  p-4 rounded-2xl border-2 flex flex-col items-center text-center gap-3 transition-all
                  ${unlocked
                    ? 'bg-white dark:bg-[#1f1a15] border-accent-warm/40 dark:border-accent-warm/30 shadow-md dark:shadow-black/30'
                    : 'bg-stone-50 dark:bg-[#16120e] border-stone-200 dark:border-[#2e2720] opacity-50'}
                `}
              >
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center text-2xl
                  ${unlocked ? 'bg-accent-warm/15 dark:bg-accent-warm/10 ring-2 ring-accent-warm/30' : 'bg-stone-100 dark:bg-[#2a221a]'}
                `}>
                  {ach.icon}
                </div>
                <div>
                  <h4 className={`font-bold text-sm leading-tight ${unlocked ? 'text-stone-800 dark:text-[#e8ddd3]' : 'text-stone-400 dark:text-stone-700'}`}>
                    {ach.name}
                  </h4>
                  <p className="text-[10px] text-stone-400 dark:text-stone-600 mt-1 leading-snug">
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
