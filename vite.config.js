import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// GitHub Pages serves the site under /ShelfSpace/ (the repository name).
// `base` must match the repo name so built asset URLs resolve correctly.
// If you rename the repo, update this value to match.
// This only affects production builds; `npm run dev` ignores it.
const repoName = 'ShelfSpace'

export default defineConfig({
  // Base path for GitHub Pages. Trailing slash is required.
  base: `/${repoName}/`,
  plugins: [react(), tailwindcss()],
  build: {
    // Keep output small and predictable for a static site.
    outDir: 'dist',
    sourcemap: false,
  },
})
