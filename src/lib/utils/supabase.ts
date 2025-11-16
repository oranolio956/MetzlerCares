// Supabase client configuration

import { createClient } from '@supabase/supabase-js'

// Supabase project credentials from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder_anon_key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side Supabase client for server-side operations
export function createSupabaseServerClient() {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  })
}

// Helper functions for common Supabase operations will be added here
// - User authentication
// - Beneficiary data management
// - Application logic queries
