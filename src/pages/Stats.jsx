import React, { useMemo } from 'react'
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement,
  Title, Tooltip, Legend, ArcElement
} from 'chart.js'
import { Bar, Pie } from 'react-chartjs-2'
import { useLibrary } from '../context/LibraryContext'
import { StatCard, Section, Card } from '../components/ui/DashboardUI'
import { BookOpen, Calendar, Hash, Clock, Flame, TrendingUp } from 'lucide-react'
import { ACHIEVEMENT_DEFINITIONS } from '../data/achievements'
import { motion } from 'framer-motion'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

const isDark = () => document.documentElement.classList.contains('dark')

const CHART_COLORS = [
  '#c9956a','#a97a52','#d4b896','#7c6a5a',
  '#e8c9a0','#b08060','#6b8e7a','#8b7355','#c4956a','#9e7b5c','#d2a87a'
]

// ── Reading Streak Calculator ──
const calcStreak = (books) => {
  const finishDates = new Set(
    books
      .filter(b => b.status === 'Finished' && b.dateFinished)
      .map(b => new Date(b.dateFinished).toDateString())
  )
  let current = 0
  let longest = 0
  let d = new Date()
  while (finishDates.has(d.toDateString())) {
    current++
    d.setDate(d.getDate() - 1)
  }
  // If today didn't have a finish, check yesterday
  if (current === 0) {
    d = new Date()
    d.setDate(d.getDate() - 1)
    while (finishDates.has(d.toDateString())) {
      current++
      d.setDate(d.getDate() - 1)
    }
  }
  // Longest streak
  const sorted = [...finishDates].map(s => new Date(s)).sort((a, b) => a - b)
  let run = sorted.length ? 1 : 0
  for (let i = 1; i < sorted.length; i++) {
    const diff = (sorted[i] - sorted[i - 1]) / 86400000
    run = diff === 1 ? run + 1 : 1
    longest = Math.max(longest, run)
  }
  longest = Math.max(longest, run)
  return { current, longest }
}

// ── Calendar Heatmap (last 52 weeks) ──
const CalendarHeatmap = ({ books }) => {
  const dark = isDark()
  const dateMap = useMemo(() => {
    const map = {}
    books
      .filter(b => b.status === 'Finished' && b.dateFinished)
      .forEach(b => {
        const key = new Date(b.dateFinished).toDateString()
        map[key] = (map[key] || 0) + 1
      })
    return map
  }, [books])

  // Build 52 weeks of days (364 days back from today, padded so week starts on Sun)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const startDay = new Date(today)
  startDay.setDate(today.getDate() - 364)
  // Snap to Sunday
  startDay.setDate(startDay.getDate() - startDay.getDay())

  const weeks = []
  let d = new Date(startDay)
  while (d <= today) {
    const week = []
    for (let i = 0; i < 7; i++) {
      week.push(new Date(d))
      d.setDate(d.getDate() + 1)
    }
    weeks.push(week)
  }

  const cellColor = (count) => {
    if (!count) return dark ? '#27211a' : '#f5f5f4'
    if (count === 1) return dark ? '#7c4a2a' : '#fcd9b8'
    if (count === 2) return dark ? '#a96030' : '#f4a460'
    return dark ? '#c9956a' : '#c9956a'
  }

  const monthLabels = []
  weeks.forEach((week, wi) => {
    const first = week[0]
    if (first.getDate() <= 7) {
      monthLabels.push({ wi, label: first.toLocaleString('default', { month: 'short' }) })
    }
  })

  return (
    <div>
      {/* Month labels */}
      <div className="flex gap-1 mb-1 ml-0" style={{ paddingLeft: 0 }}>
        {weeks.map((_, wi) => {
          const lbl = monthLabels.find(m => m.wi === wi)
          return (
            <div key={wi} className="w-3 shrink-0 text-[8px] text-stone-400 dark:text-stone-600">
              {lbl ? lbl.label : ''}
            </div>
          )
        })}
      </div>
      {/* Grid */}
      <div className="flex gap-1 overflow-x-auto pb-2">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((day, di) => {
              const key = day.toDateString()
              const count = dateMap[key] || 0
              const isFuture = day > today
              return (
                <div
                  key={di}
                  title={`${key}${count ? ` — ${count} book${count > 1 ? 's' : ''} finished` : ''}`}
                  className="w-3 h-3 rounded-sm transition-colors"
                  style={{ backgroundColor: isFuture ? 'transparent' : cellColor(count) }}
                />
              )
            })}
          </div>
        ))}
      </div>
      {/* Legend */}
      <div className="flex items-center gap-2 mt-2 text-[10px] text-stone-400 dark:text-stone-600">
        <span>Less</span>
        {[0, 1, 2, 3].map(n => (
          <div key={n} className="w-3 h-3 rounded-sm" style={{ backgroundColor: cellColor(n) }} />
        ))}
        <span>More</span>
      </div>
    </div>
  )
}

const StatisticsPage = () => {
  const { books } = useLibrary()
  const dark = isDark()

  const gridColor  = dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)'
  const tickColor  = dark ? '#6b5f52' : '#a8a29e'
  const labelColor = dark ? '#a09080' : '#78716c'

  const stats = useMemo(() => {
    const now          = new Date()
    const currentYear  = now.getFullYear()
    const currentMonth = now.getMonth()
    const finished     = books.filter(b => b.status === 'Finished')

    const booksThisYear  = finished.filter(b => b.dateFinished && new Date(b.dateFinished).getFullYear() === currentYear).length
    const booksThisMonth = finished.filter(b => {
      if (!b.dateFinished) return false
      const d = new Date(b.dateFinished)
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear
    }).length
    const totalPages = finished.reduce((a, b) => a + (b.pages || 0), 0)
    const avgPages   = finished.length ? Math.round(totalPages / finished.length) : 0
    const avgRating  = finished.filter(b => b.rating > 0).length
      ? (finished.filter(b => b.rating > 0).reduce((a, b) => a + b.rating, 0) / finished.filter(b => b.rating > 0).length).toFixed(1)
      : '—'

    const genreCounts = {}
    books.forEach(b => { genreCounts[b.genre] = (genreCounts[b.genre] || 0) + 1 })

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

    const { current: streakCurrent, longest: streakLongest } = calcStreak(books)

    return { booksThisYear, booksThisMonth, totalPages, avgPages, avgRating, genreCounts, monthlyData, monthNames, streakCurrent, streakLongest }
  }, [books])

  const pieOptions = {
    plugins: {
      legend: { position: 'bottom', labels: { color: labelColor, font: { size: 11 }, padding: 16, boxWidth: 12 } },
      tooltip: { backgroundColor: dark ? '#1f1a15' : '#fff', titleColor: dark ? '#e8ddd3' : '#1c1917', bodyColor: dark ? '#a09080' : '#78716c', borderColor: dark ? '#2e2720' : '#e7e5e4', borderWidth: 1 }
    }
  }

  const barOptions = {
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: dark ? '#1f1a15' : '#fff', titleColor: dark ? '#e8ddd3' : '#1c1917', bodyColor: dark ? '#a09080' : '#78716c', borderColor: dark ? '#2e2720' : '#e7e5e4', borderWidth: 1 }
    },
    scales: {
      x: { grid: { color: gridColor }, ticks: { color: tickColor, font: { size: 11 } }, border: { color: gridColor } },
      y: { beginAtZero: true, ticks: { stepSize: 1, color: tickColor, font: { size: 11 } }, grid: { color: gridColor }, border: { color: gridColor } }
    }
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold text-stone-800 dark:text-[#e8ddd3]">Reading Statistics</h1>
        <p className="text-stone-500 dark:text-stone-500 mt-2">Visualizing your journey through the pages.</p>
      </header>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard label="Read This Year"  value={stats.booksThisYear}               icon={Calendar} colorClass="text-blue-500 dark:text-blue-400" />
        <StatCard label="Read This Month" value={stats.booksThisMonth}              icon={Clock}    colorClass="text-emerald-500 dark:text-emerald-400" />
        <StatCard label="Total Pages"     value={stats.totalPages.toLocaleString()} icon={BookOpen} colorClass="text-accent-warm" />
        <StatCard label="Avg Pages/Book"  value={stats.avgPages}                    icon={Hash}     colorClass="text-stone-500 dark:text-stone-400" />
      </div>

      {/* Streak cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        <Card className="p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-orange-100 dark:bg-orange-900/20 text-orange-500 dark:text-orange-400">
            <Flame size={24} />
          </div>
          <div>
            <p className="text-sm text-stone-500 dark:text-stone-500">Current Reading Streak</p>
            <h3 className="text-2xl font-extrabold text-stone-900 dark:text-[#e8ddd3]">
              {stats.streakCurrent} <span className="text-sm font-normal text-stone-400">day{stats.streakCurrent !== 1 ? 's' : ''}</span>
            </h3>
          </div>
        </Card>
        <Card className="p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/20 text-purple-500 dark:text-purple-400">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm text-stone-500 dark:text-stone-500">Longest Streak Ever</p>
            <h3 className="text-2xl font-extrabold text-stone-900 dark:text-[#e8ddd3]">
              {stats.streakLongest} <span className="text-sm font-normal text-stone-400">day{stats.streakLongest !== 1 ? 's' : ''}</span>
            </h3>
          </div>
        </Card>
      </div>

      {/* Calendar Heatmap */}
      <Section title="Reading Activity — Last 52 Weeks">
        <Card className="p-5 overflow-x-auto">
          <CalendarHeatmap books={books} />
        </Card>
      </Section>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        <Card className="p-6">
          <h3 className="text-base font-bold text-stone-800 dark:text-[#e8ddd3] mb-5">Genre Distribution</h3>
          {Object.keys(stats.genreCounts).length > 0 ? (
            <div className="max-w-xs mx-auto">
              <Pie data={{
                labels: Object.keys(stats.genreCounts),
                datasets: [{ data: Object.values(stats.genreCounts), backgroundColor: CHART_COLORS, borderWidth: 0 }]
              }} options={pieOptions} />
            </div>
          ) : (
            <p className="text-center text-stone-400 dark:text-stone-600 py-12 text-sm">Add books to see genre distribution.</p>
          )}
        </Card>
        <Card className="p-6">
          <h3 className="text-base font-bold text-stone-800 dark:text-[#e8ddd3] mb-5">Books Completed — Last 6 Months</h3>
          <Bar data={{
            labels: stats.monthNames,
            datasets: [{
              label: 'Books Completed', data: stats.monthlyData,
              backgroundColor: dark ? 'rgba(201,149,106,0.3)' : 'rgba(201,149,106,0.55)',
              borderColor: '#c9956a', borderWidth: 2, borderRadius: 8,
            }]
          }} options={barOptions} />
        </Card>
      </div>

      {/* Achievements */}
      <Section title="Achievements">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {ACHIEVEMENT_DEFINITIONS.map(ach => {
            const unlocked = ach.criteria(books)
            return (
              <motion.div key={ach.id} whileHover={{ scale: 1.03 }}
                className={`p-4 rounded-2xl border-2 flex flex-col items-center text-center gap-3 transition-all
                  ${unlocked
                    ? 'bg-white dark:bg-[#1f1a15] border-accent-warm/40 dark:border-accent-warm/30 shadow-md dark:shadow-black/30'
                    : 'bg-stone-50 dark:bg-[#16120e] border-stone-200 dark:border-[#2e2720] opacity-50'}`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl
                  ${unlocked ? 'bg-accent-warm/15 dark:bg-accent-warm/10 ring-2 ring-accent-warm/30' : 'bg-stone-100 dark:bg-[#2a221a]'}`}>
                  {ach.icon}
                </div>
                <div>
                  <h4 className={`font-bold text-sm leading-tight ${unlocked ? 'text-stone-800 dark:text-[#e8ddd3]' : 'text-stone-400 dark:text-stone-700'}`}>
                    {ach.name}
                  </h4>
                  <p className="text-[10px] text-stone-400 dark:text-stone-600 mt-1 leading-snug">{ach.description}</p>
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
