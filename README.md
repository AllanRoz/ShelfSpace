# ShelfSpace

<a id="readme-top"></a>

<br />
<div align="center">
  <a href="https://github.com/AllanRoz/ShelfSpace">
    <img src="https://img.icons8.com/fluency/96/book-shelf.png" alt="ShelfSpace Logo" width="80" height="80">
  </a>

  <h3 align="center">ShelfSpace</h3>

  <p align="center">
    A beautiful personal digital library to organize, track, and explore your books.
    <br />
    <br />
    <a href="https://allanroz.github.io/ShelfSpace/">View Demo</a>
    &middot;
    <a href="https://github.com/AllanRoz/ShelfSpace/issues/new?labels=bug">Report Bug</a>
    &middot;
    <a href="https://github.com/AllanRoz/ShelfSpace/issues/new?labels=enhancement">Request Feature</a>
  </p>
</div>

<!-- ABOUT THE PROJECT -->

## About The Project

**ShelfSpace** is a modern web application that lets you build and manage your personal digital library entirely in the browser. Add books, track what you're reading, rate your favorites, organize collections, and visualize your reading habits — all without an account or a backend.

Built as a fully static React application, all data is stored locally using LocalStorage, making it fast, private, and perfectly suited for hosting on GitHub Pages.

### Key Features

- **Interactive Visual Bookshelf:** Your books are displayed as realistic, animated book spines on a wooden shelf. Hover over any book to "pick it up" with a smooth Framer Motion spring animation.
- **Full Book Management:** Add, edit, and delete books with detailed metadata including title, author, ISBN, genre, pages, publication year, cover image, description, and reading dates.
- **Reading Progress Tracking:** Track your current page and see a live progress bar for every book you're actively reading.
- **5-Star Rating System:** Rate every book and see your average rating calculated automatically across your entire library.
- **Favorites:** Mark books as favorites and surface them instantly across the dashboard.
- **Custom Collections:** Create, manage, and populate custom collections to group books however you like — by mood, theme, or reading goal.
- **Powerful Search & Filters:** Search your entire library by title, author, genre, ISBN, or personal notes. Filter by genre, status, and sort by any metadata field.
- **Reading Statistics:** A dedicated statistics page with interactive Chart.js charts showing genre distribution, monthly reading activity, and more.
- **Achievement System:** Unlock achievements automatically as you read — First Book, Bookworm, 5,000 Pages, and more.
- **Dark Mode:** A warm, library-inspired dark theme that persists across sessions.
- **Import / Export:** Back up your entire library as a JSON file and restore it at any time.
- **No backend, no accounts, no data ever leaves your browser.**

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

- [![React][React.js]][React-url]
- [![Vite][Vite.dev]][Vite-url]
- [![TailwindCSS][Tailwind.css]][Tailwind-url]
- [![Framer Motion][Framer.motion]][Framer-url]
- [![Chart.js][Chart.js]][Chart-url]
- [![React Router][ReactRouter.js]][ReactRouter-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

Follow these steps to run a local copy of ShelfSpace on your machine.

### Prerequisites

- npm

  ```sh
  npm install npm@latest -g
  ```

### Installation and Running Locally

1. Clone the repository

   ```sh
   git clone https://github.com/AllanRoz/ShelfSpace.git
   ```

2. Navigate into the project directory

   ```sh
   cd ShelfSpace
   ```

3. Install project dependencies

   ```sh
   npm install
   ```

4. Start the development server

   ```sh
   npm run dev
   ```

5. Build for production

   ```sh
   npm run build
   ```

6. Preview the production build locally

   ```sh
   npm run preview
   ```

7. Deploy to GitHub Pages

   ```sh
   npm run deploy
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- FEATURES -->

## Features

### 📚 Interactive Bookshelf

Your entire library is displayed as a visual, wooden bookshelf:

- Each book renders as a realistic spine with its title, varied heights, widths, and colors
- Hovering a book lifts it off the shelf with a smooth spring animation
- Click any book to open a full detail panel with cover art, metadata, notes, and actions
- Books are automatically arranged into multiple shelf rows as your library grows

### 🏠 Dashboard

A rich home screen that updates in real time as your library changes:

- Total books, books read, currently reading, want to read
- Average rating, pages read, favorites count
- Circular progress ring for your annual reading goal
- Continue Reading section with inline progress bars
- Recently Added and Recently Finished book grids
- Time-aware greeting and quick link to Statistics

### 📖 Add & Edit Books

A polished form supporting all metadata fields:

- Title, Author, ISBN, Genre, Pages, Publication Year
- Cover image URL, Description, Reading Status
- Personal Notes with full text support
- Status options: Want to Read, Currently Reading, Finished, DNF

### 🔎 Search & Filtering

- Instant full-text search across title, author, genre, ISBN, and personal notes
- Filter by genre and reading status simultaneously
- Sort by date added, title, author, rating, publication year, or pages

### 🏷️ Collections

- Create unlimited named collections
- Add books to collections directly from the book detail panel
- Visual cover strip preview inside each collection card
- Delete collections without affecting the books themselves

### 📊 Statistics & Achievements

- Books read this year and this month
- Total pages read and average pages per book
- Genre distribution pie chart
- Monthly reading activity bar chart
- 8 unlockable achievements based on real library data (First Book, Bibliophile, Literary Giant, and more)
- Locked achievements appear muted; unlocked achievements are highlighted

### 🌙 Dark Mode

- Warm amber-dark palette — not a generic grey dark mode
- Toggles instantly via the sidebar button
- Theme preference persists using LocalStorage

### 💾 Data & Privacy

- Everything is stored in `localStorage` — no accounts, no cloud, no tracking
- Export your full library (books + collections) as a JSON backup file
- Import a JSON backup to restore your library on any device
- Imported data is validated before being accepted

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the GPL-3.0 License. See the `LICENSE` file for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

Allan Rozario - [arozadev@gmail.com](mailto:arozadev@gmail.com)

Project Link: https://github.com/AllanRoz/ShelfSpace

Live Demo: https://allanroz.github.io/ShelfSpace/

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->

[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://react.dev/
[Vite.dev]: https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white
[Vite-url]: https://vite.dev/
[Tailwind.css]: https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white
[Tailwind-url]: https://tailwindcss.com/
[Framer.motion]: https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white
[Framer-url]: https://www.framer.com/motion/
[Chart.js]: https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white
[Chart-url]: https://www.chartjs.org/
[ReactRouter.js]: https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white
[ReactRouter-url]: https://reactrouter.com/
