import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [react({ jsxRuntime: 'classic' }), dts()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'useVideoControls',
      fileName: 'index',
    },
    rollupOptions: {
      external: ['react'],
    },
  },
})
