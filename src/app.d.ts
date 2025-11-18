declare global {
  interface Window {
    gtag?: (...args: any[]) => void
  }

  namespace App {
    import type { SupabaseClient, Session } from '@supabase/supabase-js'
    interface Locals {
      supabase: SupabaseClient
      getSession: () => Promise<Session | null>
      csrfToken?: string
      requestId?: string
      user?: { id: string } | null
      session?: Session | null
      cspNonce?: string
    }
  }
}

export {}
