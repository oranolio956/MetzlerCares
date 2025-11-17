import { json } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import { VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';

export async function POST({ request, url }) {
  try {
    const supabase = createClient(
      VITE_SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY
    );
    
    const { client_id, partner_id, consent_data } = await request.json();

    // Create consent record with 42 CFR Part 2 compliance
    const { data: consent, error } = await supabase
      .from('consent_records')
      .insert({
        client_id,
        partner_id,
        consent_type: 'TPO', // Treatment, Payment, Operations
        consent_data,
        status: 'pending',
        expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        created_at: new Date()
      })
      .select()
      .single();

    if (error) throw error;

    // Generate secure signing URL
    const signingUrl = `${url.origin}/esign/${consent.id}`;

    return json({
      success: true,
      consent_id: consent.id,
      signing_url: signingUrl,
      expires_at: consent.expires_at
    });

  } catch (error) {
    return json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

export async function GET({ url }) {
  try {
    const consentId = url.searchParams.get('id');
    const supabase = createClient(
      VITE_SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY
    );
    
    const { data: consent, error } = await supabase
      .from('consent_records')
      .select(`
        *,
        clients!inner(name, date_of_birth),
        partners!inner(name)
      `)
      .eq('id', consentId)
      .single();

    if (error) throw error;

    return json({
      success: true,
      consent: {
        id: consent.id,
        client_name: consent.clients.name,
        client_dob: consent.clients.date_of_birth,
        partner_name: consent.partners.name,
        consent_data: consent.consent_data,
        status: consent.status,
        expires_at: consent.expires_at
      }
    });

  } catch (error) {
    return json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}