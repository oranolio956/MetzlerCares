import { json } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import { VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';

export async function POST({ params, request }) {
  try {
    const supabase = createClient(
      VITE_SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY
    );
    
    const { name, date, signature } = await request.json();
    const consentId = params.id;

    // Validate signature data
    if (!name?.trim() || !date || !signature) {
      return json({ 
        success: false, 
        error: 'Missing required signature data' 
      }, { status: 400 });
    }

    // Update consent record with signature
    const { data: consent, error } = await supabase
      .from('consent_records')
      .update({
        status: 'completed',
        signed_at: new Date(),
        signature_data: {
          name: name.trim(),
          date,
          signature,
          ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
          user_agent: request.headers.get('user-agent')
        }
      })
      .eq('id', consentId)
      .select()
      .single();

    if (error) throw error;

    // Create audit log entry
    await supabase.from('audit_logs').insert({
      resource_type: 'consent_records',
      resource_id: consentId,
      action: 'CONSENT_SIGNED',
      user_id: consent.client_id,
      tenant_id: consent.tenant_id,
      changes: {
        consent_type: 'TPO',
        signed_by: name.trim(),
        signed_at: new Date()
      }
    });

    return json({
      success: true,
      consent_id: consent.id,
      expires_at: consent.expires_at
    });

  } catch (error) {
    return json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}