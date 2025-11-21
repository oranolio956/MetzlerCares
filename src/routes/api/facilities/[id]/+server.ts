import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || ''
const supabaseAnon = process.env.PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || ''
const supabase = supabaseUrl && supabaseAnon ? createClient(supabaseUrl, supabaseAnon) : null

export const GET: RequestHandler = async ({ params }) => {
  try {
    if (!supabase) {
      return json({ error: 'Database not configured' }, { status: 500 })
    }

    const { id } = params

    const { data, error: dbError } = await supabase
      .from('facilities')
      .select(
        `
        *,
        bed_availability!inner(*)
      `
      )
      .eq('id', id)
      .eq('is_active', true)
      .single()

    if (dbError) {
      if (dbError.code === 'PGRST116') {
        return json({ error: 'Facility not found' }, { status: 404 })
      }
      throw new Error(`Database error: ${dbError.message}`)
    }

    return json(data)
  } catch (err) {
    console.error('Error fetching facility:', err)

    return json(
      {
        error: 'Failed to fetch facility',
        message: err instanceof Error ? err.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
