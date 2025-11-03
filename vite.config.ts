import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            // Suppress abort errors in development - these are normal when HMR reloads
            const nodeErr = err as NodeJS.ErrnoException
            if (err.message?.includes('aborted') || nodeErr.code === 'ECONNRESET') {
              return
            }
            console.log('proxy error', err)
          })
        }
      }
    }
  }
})
