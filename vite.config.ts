import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [sveltekit()],
  build: {
    target: 'es2020',
    minify: 'esbuild',
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: id => {
          // Split vendor libraries into separate chunks for better caching
          if (id.includes('node_modules')) {
            if (id.includes('@sveltejs')) return 'sveltekit'
            if (id.includes('svelte')) return 'svelte'
            if (id.includes('supabase')) return 'supabase'
            if (id.includes('chart.js')) return 'chartjs'
            // return 'vendor' // Let other vendors split naturally
          }
        }
      }
    }
  },
  optimizeDeps: {
    include: ['svelte', '@sveltejs/kit', '@supabase/supabase-js']
  },
  server: {
    fs: {
      allow: ['..']
    }
  }
})
