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

[![Product Screenshot][product-screenshot]](https://allanroz.github.io/ShelfSpace/)

**ShelfSpace** is a modern web application that lets you build and manage your personal digital library entirely in the browser. Add books, track what you're reading, rate your favorites, organize collections, manage reading lists, and visualize your reading habits — all without an account or a backend.

Built as an offline-first PWA and static React application, all data is stored locally using LocalStorage, making it fast, private, and perfectly suited for hosting on GitHub Pages.

### Key Features

- **Interactive Visual Bookshelf:** Your books are displayed as realistic, animated book spines on a wooden shelf with randomized spine heights, widths, and leather-texture overlays. Hover over any book to "pick it up" with a smooth Framer Motion spring animation.
- **Full In-App Book Editing:** Dedicated edit form accessible directly from any book's detail modal, pre-populated with all current metadata.
- **Open Library Integration:** Search by title or author inside the Add/Edit form to auto-fill title, author, ISBN, publication year, median page count, and high-resolution cover art with one click.
- **Reading Streak & Heatmap:** A 52-week calendar contribution heatmap on the Statistics page showing daily reading activity alongside your current and all-time longest streaks.
- **Favorite Quotes Management:** Save, view, and delete memorable quotes per book inside a dedicated modal tab.
- **Reading Lists:** Create ordered, goal-oriented reading lists (e.g. "2026 Reading Challenge") separate from collections, complete with per-list progress tracking.
- **Author Pages:** Dedicated view grouping all books by author with counts, finished totals, average ratings, and full book listings.
- **Progressive Web App (PWA):** Installable on desktop and mobile with offline caching for all assets and Open Library covers.
- **Advanced Sorting:** Sort your library by Date Added, Title, Author, Rating, Publication Year, or Pages with a one-click Ascending/Descending toggle.
- **Custom Collections:** Group books into named collections with visual cover strips.
- **Statistics & Charts:** Interactive Chart.js charts for genre distribution and monthly reading activity, plus 8 milestone achievements.
- **Warm Dark Mode:** A library-inspired dark theme persisted via LocalStorage.
- **Import / Export:** Full JSON backup and restore with schema validation.
- **100% Private:** No backend, no accounts, no analytics — runs entirely in the browser.

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

Your entire library rendered as a physical bookshelf:

- Realistic spines with vertical titles, varied heights, widths, and palette colors
- Framer Motion "pick up" spring animation on hover
- Click any book to open the detail panel
- Staggered entrance animation on load
- Multi-row wooden shelf boards that grow with your collection
- Ascending / Descending sorting toggle

### 📖 Add & Edit Books + Open Library Auto-Fill

- Dedicated Add and Edit forms with full validation
- Built-in **Open Library API search** — search any title/author to auto-populate title, author, ISBN, pages, year, and cover image in one click
- Custom cover image URL support with live preview
- Statuses: Want to Read, Currently Reading, Finished, DNF

### 🔥 Reading Streak & 52-Week Heatmap

- Tracks your active daily reading streak and all-time longest streak
- GitHub-style 52-week contribution heatmap displaying reading frequency
- Filterable monthly completion charts and genre breakdown pie chart

### 💬 Favorite Quotes

- Dedicated Quotes tab on every book's detail modal
- Add and remove quotes with one click
- Beautiful parchment-styled quote cards

### 📋 Reading Lists vs 🏷️ Collections

- **Collections:** Category-based grouping (e.g. "Sci-Fi Favorites", "Finance")
- **Reading Lists:** Goal-oriented, ordered lists (e.g. "Summer 2026", "Must-Reads Before 30") with visual reading progress bars and book reordering

### ✍️ Author Pages

- Automatic grouping of all books in your library by author
- Author overview cards showing book counts, finished counts, and average star rating
- Click any author to view their full bibliography in your collection

### 📱 Progressive Web App (PWA)

- Installable on iOS, Android, macOS, and Windows
- Service worker precaches all application assets for offline access
- Runtime caching for Open Library covers and external book images

### 🌙 Dark Mode

- Warm amber-dark palette (`#16120e` / `#1f1a15`) — not flat grey
- Toggles instantly from the sidebar; persists via LocalStorage

### 💾 Data & Privacy

- Full JSON export (books, collections, reading lists)
- Validated JSON import with overwrite protection
- Wipe library option with safety confirmation

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- FUTURE IMPROVEMENTS -->

## Future Improvements

Planned features include:

- Barcode / ISBN camera scanner for mobile devices
- Reading pace estimator (estimated days to finish based on reading speed)
- CSV export for Goodreads / StoryGraph compatibility
- Shareable book cards generated as downloadable PNG images
- Reading timer with ambient soundscapes

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

[product-screenshot]: public/shelfspace.png
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
