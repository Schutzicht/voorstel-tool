import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Relative asset paths so the bundle works both as:
  //  - standalone Vercel deploy at /
  //  - embedded into the Agensea Hub at /tools/voorstel/
  //  - served via the hub's /v/:id Astro route (which injects a <base>)
  base: './',
})
