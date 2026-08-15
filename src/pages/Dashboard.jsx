import React, { useState } from "react";
import {
  BookOpen,
  CheckCircle,
  Clock,
  Star,
  Bookmark,
  Book as BookIcon,
  TrendingUp,
  ChevronRight,
} from "lucide-react";
import { StatCard, Section, Card } from "../components/ui/DashboardUI";
import { useLibrary } from "../context/LibraryContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import BookDetailModal from "../components/bookshelf/BookDetailModal";

const Dashboard = () => {
  const { books } = useLibrary();
  const navigate = useNavigate();

  const [selectedBook, setSelectedBook] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenBook = (book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const stats = {
    totalBooks: books.length,
    booksRead: books.filter((b) => b.status === "Finished").length,
    currentlyReading: books.filter((b) => b.status === "Currently Reading")
      .length,
    wantToRead: books.filter((b) => b.status === "Want to Read").length,
    favorites: books.filter((b) => b.isFavorite).length,
    avgRating: books.filter((b) => b.rating > 0).length
      ? (
          books.filter((b) => b.rating > 0).reduce((a, b) => a + b.rating, 0) /
          books.filter((b) => b.rating > 0).length
        ).toFixed(1)
      : "—",
    pagesRead: books.reduce(
      (a, b) =>
        a + (b.status === "Finished" ? b.pages || 0 : b.currentPage || 0),
      0,
    ),
    completedThisYear: books.filter((b) => {
      if (!b.dateFinished) return false;
      return (
        new Date(b.dateFinished).getFullYear() === new Date().getFullYear()
      );
    }).length,
  };

  const continueReading = books.filter((b) => b.status === "Currently Reading");
  const recentlyAdded = [...books]
    .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
    .slice(0, 4);
  const recentlyFinished = [...books]
    .filter((b) => b.status === "Finished")
    .sort(
      (a, b) =>
        new Date(b.dateFinished || b.dateAdded) -
        new Date(a.dateFinished || a.dateAdded),
    )
    .slice(0, 4);

  const GOAL = 10;
  const goalPct = Math.min(
    100,
    Math.round((stats.completedThisYear / GOAL) * 100),
  );

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <header className="mb-10">
        <motion.h1
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-extrabold text-stone-800 dark:text-[#e8ddd3] tracking-tight"
        >
          Good {getGreeting()}, Reader
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-stone-500 dark:text-stone-500 mt-1"
        >
          Your library is looking wonderful today.
        </motion.p>
      </header>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-10">
        <StatCard
          label="Total Books"
          value={stats.totalBooks}
          icon={BookIcon}
          subValue="In your library"
        />
        <StatCard
          label="Books Read"
          value={stats.booksRead}
          icon={CheckCircle}
          colorClass="text-emerald-600 dark:text-emerald-400"
          subValue={
            stats.totalBooks
              ? `${((stats.booksRead / stats.totalBooks) * 100).toFixed(0)}% of library`
              : "—"
          }
        />
        <StatCard
          label="Reading Now"
          value={stats.currentlyReading}
          icon={Clock}
          colorClass="text-blue-500 dark:text-blue-400"
          subValue="In progress"
        />
        <StatCard
          label="Avg Rating"
          value={stats.avgRating}
          icon={Star}
          colorClass="text-amber-500 dark:text-amber-400"
          subValue="Out of 5 stars"
        />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── Left column ── */}
        <div className="lg:col-span-2 space-y-10">
          {/* Continue Reading */}
          <Section
            title="Continue Reading"
            action="Go to Shelf"
            onAction={() => navigate("/bookshelf")}
          >
            {continueReading.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {continueReading.map((book) => {
                  const pct =
                    book.pages > 0
                      ? Math.min(
                          100,
                          Math.round(
                            ((book.currentPage || 0) / book.pages) * 100,
                          ),
                        )
                      : 0;
                  return (
                    <div
                      key={book.id}
                      onClick={() => handleOpenBook(book)}
                      className="flex gap-4 p-4 bg-white dark:bg-[#1f1a15] border border-stone-200 dark:border-[#2e2720] rounded-2xl shadow-sm hover:shadow-md dark:hover:shadow-black/30 cursor-pointer group transition-all"
                    >
                      <div className="w-14 h-20 rounded-lg overflow-hidden shrink-0 shadow bg-stone-200 dark:bg-[#2a221a]">
                        {book.coverImage ? (
                          <img
                            src={book.coverImage}
                            alt={book.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-stone-400">
                            <BookOpen size={20} />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col justify-between flex-1 min-w-0">
                        <div>
                          <h3 className="font-bold text-sm text-stone-800 dark:text-[#e8ddd3] line-clamp-1 group-hover:text-accent-warm transition-colors">
                            {book.title}
                          </h3>
                          <p className="text-xs text-stone-500 dark:text-stone-500 mt-0.5">
                            {book.author}
                          </p>
                        </div>
                        <div>
                          <div className="flex justify-between text-[10px] text-stone-400 dark:text-stone-600 mb-1">
                            <span>{pct}% complete</span>
                            <span>
                              {book.currentPage || 0} / {book.pages || "?"} pg
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-stone-100 dark:bg-[#2a221a] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-accent-warm rounded-full transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState message="No books in progress. Start reading something from your shelf!" />
            )}
          </Section>

          {/* Recently Added */}
          <Section
            title="Recently Added"
            action="View Shelf"
            onAction={() => navigate("/bookshelf")}
          >
            {recentlyAdded.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {recentlyAdded.map((book) => (
                  <BookThumb
                    key={book.id}
                    book={book}
                    onClick={() => handleOpenBook(book)}
                  />
                ))}
              </div>
            ) : (
              <EmptyState message="No books added yet. Click '+ Add Book' to get started!" />
            )}
          </Section>

          {/* Recently Finished */}
          {recentlyFinished.length > 0 && (
            <Section
              title="Recently Finished"
              action="View All"
              onAction={() => navigate("/bookshelf")}
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {recentlyFinished.map((book) => (
                  <BookThumb
                    key={book.id}
                    book={book}
                    badge="✓"
                    onClick={() => handleOpenBook(book)}
                  />
                ))}
              </div>
            </Section>
          )}
        </div>

        {/* ── Right column ── */}
        <div className="space-y-6">
          {/* Annual Goal */}
          <Card className="p-6 text-center">
            <h3 className="font-bold text-stone-700 dark:text-[#e8ddd3] mb-4">
              2026 Reading Goal
            </h3>
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="rotate-[-90deg]" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="10"
                  className="text-stone-100 dark:text-[#2a221a]"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#c9956a"
                  strokeWidth="10"
                  strokeDasharray={`${2 * Math.PI * 50}`}
                  strokeDashoffset={`${2 * Math.PI * 50 * (1 - goalPct / 100)}`}
                  strokeLinecap="round"
                  className="transition-all duration-700"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-extrabold text-stone-800 dark:text-[#e8ddd3]">
                  {stats.completedThisYear}
                </span>
                <span className="text-[10px] text-stone-400 dark:text-stone-600 uppercase tracking-wider">
                  of {GOAL}
                </span>
              </div>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-500">
              {goalPct}% toward your annual goal
            </p>
          </Card>

          {/* Quick stats */}
          <Card className="p-6 space-y-4">
            <h3 className="font-bold text-stone-700 dark:text-[#e8ddd3] text-sm">
              Library Snapshot
            </h3>
            {[
              {
                icon: Bookmark,
                label: "Want to read",
                value: stats.wantToRead,
              },
              { icon: Star, label: "Favorites", value: stats.favorites },
              {
                icon: BookOpen,
                label: "Pages read",
                value: stats.pagesRead.toLocaleString(),
              },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-stone-500 dark:text-stone-500">
                  <Icon
                    size={15}
                    className="text-stone-400 dark:text-stone-600"
                  />
                  {label}
                </div>
                <span className="font-bold text-stone-800 dark:text-[#e8ddd3] text-sm">
                  {value}
                </span>
              </div>
            ))}
          </Card>

          {/* Progress hint */}
          <div
            onClick={() => navigate("/stats")}
            className="cursor-pointer flex items-center justify-between p-4 bg-accent-warm/8 dark:bg-accent-warm/5 border border-accent-warm/20 dark:border-accent-warm/15 rounded-2xl hover:bg-accent-warm/12 dark:hover:bg-accent-warm/8 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent-warm/15 rounded-xl text-accent-warm">
                <TrendingUp size={18} />
              </div>
              <div>
                <p className="font-semibold text-sm text-stone-800 dark:text-[#e8ddd3]">
                  View Statistics
                </p>
                <p className="text-xs text-stone-400 dark:text-stone-600">
                  Charts, achievements & streaks
                </p>
              </div>
            </div>
            <ChevronRight
              size={18}
              className="text-stone-400 group-hover:text-accent-warm group-hover:translate-x-0.5 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Book Detail Modal on Dashboard */}
      <BookDetailModal
        book={selectedBook}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

// ── Helpers ──
const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
};

const BookThumb = ({ book, badge, onClick }) => (
  <div onClick={onClick} className="group cursor-pointer">
    <div className="aspect-[2/3] overflow-hidden rounded-2xl shadow-sm mb-2 relative bg-stone-200 dark:bg-[#2a221a] border border-stone-200/50 dark:border-[#2e2720]/50">
      {book.coverImage ? (
        <img
          src={book.coverImage}
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-stone-400">
          <BookOpen size={24} />
        </div>
      )}
      {badge && (
        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shadow-md">
          {badge}
        </div>
      )}
    </div>
    <h3 className="font-semibold text-xs text-stone-800 dark:text-[#e8ddd3] line-clamp-1 group-hover:text-accent-warm transition-colors">
      {book.title}
    </h3>
    <p className="text-[10px] text-stone-400 dark:text-stone-600 truncate">
      {book.author}
    </p>
  </div>
);

const EmptyState = ({ message }) => (
  <div className="text-center py-10 rounded-2xl bg-stone-50/50 dark:bg-[#16120e]/50 border border-dashed border-stone-200 dark:border-[#2e2720]">
    <p className="text-sm text-stone-400 dark:text-stone-600">{message}</p>
  </div>
);

export default Dashboard;
