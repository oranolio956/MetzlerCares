// Supabase client configuration

import { createClient } from '@supabase/supabase-js'

// Supabase project credentials from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper functions for common Supabase operations will be added here
// - User authentication
// - Beneficiary data management
// - Application logic queries
