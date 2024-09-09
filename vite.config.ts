import { crx } from '@crxjs/vite-plugin'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
// import Inspect from 'vite-plugin-inspect'
import manifest from './manifest.json'
// import { vitePluginInjectCss } from './vite-plugin-inject-css'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    crx({ manifest }),
    // vitePluginInjectCss(),
    // Inspect(),
  ],
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173,
    },
  },
})
