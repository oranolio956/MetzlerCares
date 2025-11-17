import '@testing-library/jest-dom'
import { vi, afterEach } from 'vitest'

// Mock SvelteKit stores
import { readable } from 'svelte/store'

vi.mock('$app/stores', () => ({
  page: readable({
    url: new URL('http://localhost:3000'),
    params: {},
    route: { id: '/' },
    status: 200,
    error: null,
    data: {},
    form: undefined
  }),
  navigating: readable(null),
  updated: readable(false)
}))

vi.mock('$app/navigation', () => ({
  goto: vi.fn(),
  invalidate: vi.fn(),
  invalidateAll: vi.fn(),
  preloadData: vi.fn(),
  preloadCode: vi.fn()
}))

vi.mock('$app/environment', () => ({
  browser: false,
  dev: true,
  building: false,
  version: '1.0.0'
}))

// Mock Supabase
vi.mock('$lib/utils/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } }))
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis()
    }))
  }
}))

// Global test utilities
global.fetch = vi.fn()

// Cleanup after each test
afterEach(() => {
  vi.clearAllMocks()
})
