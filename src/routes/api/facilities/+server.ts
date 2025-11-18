import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || ''
const supabaseAnon = process.env.PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || ''
const supabase = supabaseUrl && supabaseAnon ? createClient(supabaseUrl, supabaseAnon) : null

export const GET: RequestHandler = async ({ url }) => {
  try {
    const searchParams = url.searchParams;
    const type = searchParams.get('type');
    const urgency = searchParams.get('urgency');
    const limit = parseInt(searchParams.get('limit') || '10');
    const acceptsMedicaid = searchParams.get('accepts_medicaid');
    const acceptsMedicare = searchParams.get('accepts_medicare');
    const city = searchParams.get('city');
    const state = searchParams.get('state') || 'CO';
    
    // If database not configured, return empty result set gracefully
    if (!supabase) {
      return json({ facilities: [], message: 'Database not configured in this environment' })
    }
    // Build query
    let query = supabase
      .from('facilities')
      .select(`
        *,
        bed_availability!inner(
          available_beds,
          total_beds,
          last_updated
        )
      `)
      .eq('is_active', true)
      .limit(limit);
    
    // Apply filters
    if (type) {
      query = query.eq('facility_type', type);
    }
    
    if (city) {
      query = query.ilike('city', city);
    }
    
    if (state) {
      query = query.eq('state', state);
    }
    
    if (acceptsMedicaid === 'true') {
      query = query.eq('accepts_medicaid', true);
    }
    
    if (acceptsMedicare === 'true') {
      query = query.eq('accepts_medicare', true);
    }
    
    // Apply urgency-based ordering
    if (urgency === 'high') {
      query = query
        .order('current_availability', { ascending: true })
        .order('average_wait_time_days', { ascending: true });
    } else {
      query = query.order('name', { ascending: true });
    }
    
    const { data, error: dbError } = await query;
    
    if (dbError) {
      throw new Error(`Database error: ${dbError.message}`);
    }
    
    // Transform data to match expected format
    const facilities = data.map(facility => ({
      id: facility.id,
      name: facility.name,
      facility_type: facility.facility_type,
      address: facility.address,
      city: facility.city,
      state: facility.state,
      zip_code: facility.zip_code,
      phone: facility.phone,
      website: facility.website,
      email: facility.email,
      accepts_medicaid: facility.accepts_medicaid,
      accepts_medicare: facility.accepts_medicare,
      private_insurance_accepted: facility.private_insurance_accepted,
      accreditation: facility.accreditation,
      specialties: facility.specialties,
      amenities: facility.amenities,
      success_rate: facility.success_rate,
      average_cost_range: facility.average_cost_range,
      bed_capacity: facility.bed_capacity,
      current_availability: facility.bed_availability?.[0]?.available_beds || 0,
      total_beds: facility.bed_availability?.[0]?.total_beds || facility.bed_capacity,
      average_wait_time_days: facility.average_wait_time_days,
      is_active: facility.is_active,
      created_at: facility.created_at,
      updated_at: facility.updated_at
    }));
    
    // Track facility search
    await trackFacilitySearch({
      type,
      urgency,
      accepts_medicaid: acceptsMedicaid === 'true',
      accepts_medicare: acceptsMedicare === 'true',
      city,
      state,
      result_count: facilities.length
    });
    
    return json(facilities);
    
  } catch (err) {
    console.error('Error fetching facilities:', err);
    
    return json({ 
      error: 'Failed to fetch facilities',
      message: err instanceof Error ? err.message : 'Unknown error'
    }, { status: 500 });
  }
};

async function trackFacilitySearch(searchParams: any) {
  try {
    if (!supabase) return
    await supabase.from('conversion_events').insert({
      event_type: 'facility_search',
      persona: 'unknown',
      metadata: searchParams,
      created_at: new Date().toISOString()
    });
  } catch (err) {
    console.error('Error tracking facility search:', err);
  }
}

// Get single facility with availability
export const GET_SINGLE: RequestHandler = async ({ params }) => {
  try {
    if (!supabase) {
      return json({ error: 'Database not configured' }, { status: 500 })
    }
    const { id } = (params as Record<string, string>);
    
    const { data, error: dbError } = await supabase
      .from('facilities')
      .select(`
        *,
        bed_availability!inner(*)
      `)
      .eq('id', id)
      .eq('is_active', true)
      .single();
    
    if (dbError) {
      if (dbError.code === 'PGRST116') {
        return json({ error: 'Facility not found' }, { status: 404 });
      }
      throw new Error(`Database error: ${dbError.message}`);
    }
    
    return json(data);
    
  } catch (err) {
    console.error('Error fetching facility:', err);
    
    return json({ 
      error: 'Failed to fetch facility',
      message: err instanceof Error ? err.message : 'Unknown error'
    }, { status: 500 });
  }
};

// Create new facility (admin only)
export const POST: RequestHandler = async ({ request }) => {
  try {
    if (!supabase) {
      return json({ error: 'Database not configured' }, { status: 500 })
    }
    // Verify admin authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !await verifyAdminAuth(authHeader)) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const facilityData = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'facility_type', 'city', 'state', 'phone'];
    for (const field of requiredFields) {
      if (!facilityData[field]) {
        return json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }
    
    // Insert facility
    const { data, error: dbError } = await supabase
      .from('facilities')
      .insert([facilityData])
      .select()
      .single();
    
    if (dbError) {
      throw new Error(`Database error: ${dbError.message}`);
    }
    
    // Create initial bed availability record
    await supabase.from('bed_availability').insert({
      facility_id: data.id,
      facility_type: facilityData.facility_type,
      total_beds: facilityData.bed_capacity || 0,
      available_beds: facilityData.bed_capacity || 0,
      occupied_beds: 0,
      reserved_beds: 0
    });
    
    return json(data, { status: 201 });
    
  } catch (err) {
    console.error('Error creating facility:', err);
    
    return json({ 
      error: 'Failed to create facility',
      message: err instanceof Error ? err.message : 'Unknown error'
    }, { status: 500 });
  }
};

async function verifyAdminAuth(authHeader: string): Promise<boolean> {
  // Implement admin authentication verification
  // This is a placeholder - implement proper admin auth
  return authHeader.startsWith('Bearer admin_');
}