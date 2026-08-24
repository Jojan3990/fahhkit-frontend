import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// Netlify serves from the domain root, GitHub Pages serves from /fahhkit/ —
// only apply the GH Pages base when explicitly building for that deploy.
export default defineConfig({
  base: process.env.GH_PAGES ? "/fahhkit/" : "/",
  plugins: [react()],
  assetsInclude: ['**/*.jfif'],
})
