import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// Note: Removed the @tailwindcss/vite plugin to use the PostCSS Tailwind plugin
// (configured in postcss.config.cjs) which matches Tailwind v4 packaging.
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
