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
        manualChunks: (id) => {
          // Split vendor libraries into separate chunks
          if (id.includes('node_modules')) {
            if (id.includes('@sveltejs')) return 'sveltekit'
            if (id.includes('svelte')) return 'svelte'
            if (id.includes('supabase')) return 'supabase'
            return 'vendor'
          }
          
          // Split application code by feature areas
          if (id.includes('/routes/')) {
            if (id.includes('/staff/')) return 'staff-pages'
            if (id.includes('/beneficiary/')) return 'beneficiary-pages'
            if (id.includes('/auth/')) return 'auth-pages'
            return 'pages'
          }
          
          if (id.includes('/lib/')) {
            if (id.includes('/components/')) return 'components'
            if (id.includes('/utils/')) return 'utils'
            if (id.includes('/stores/')) return 'stores'
            return 'lib'
          }
          
          return 'app'
        }
      }
    }
  },
  optimizeDeps: {
    include: [
      'svelte',
      '@sveltejs/kit',
      '@supabase/supabase-js'
    ]
  },
  server: {
    fs: {
      allow: ['..']
    }
  }
})
