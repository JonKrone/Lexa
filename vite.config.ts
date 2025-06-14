import { crx } from '@crxjs/vite-plugin'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
// import Inspect from 'vite-plugin-inspect'
import manifest from './manifest.json'
// import { vitePluginInjectCss } from './vite-plugin-inject-css'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    crx({ manifest }),
    // vitePluginInjectCss(),
    // Inspect(),
  ],
  server: {
    host: 'localhost', // don't let --host sneak in
    port: 5173,
    strictPort: true, // Vite must stay here
    hmr: {
      port: 5173, // websocket server
      clientPort: 5173, // and what the client looks for
    },
  },
  build:
    mode === 'development'
      ? {
          rollupOptions: {
            output: {
              entryFileNames: 'assets/[name].js',
              chunkFileNames: 'assets/[name].js',
              assetFileNames: 'assets/[name].[ext]',
            },
          },
        }
      : {},
}))
