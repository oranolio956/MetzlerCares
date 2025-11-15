<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/utils/supabase';
  import type { Consent } from '$lib/types';

  let consents: Consent[] = [];
  let loading = true;
  let revokingConsent: string | null = null;

  onMount(async () => {
    await loadConsents();
  });

  async function loadConsents() {
    try {
      const { data, error } = await supabase
        .from('consents')
        .select('*')
        .eq('beneficiary_id', (await supabase.auth.getUser()).data.user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      consents = data || [];
    } catch (error) {
      console.error('Error loading consents:', error);
      consents = [];
    } finally {
      loading = false;
    }
  }

  async function revokeConsent(consentId: string) {
    revokingConsent = consentId;
    try {
      // Call the revoke-consent Edge Function
      const { data, error } = await supabase.functions.invoke('revoke-consent', {
        body: { consent_id: consentId }
      });

      if (error) throw error;

      // Reload consents to show updated status
      await loadConsents();
    } catch (error) {
      console.error('Error revoking consent:', error);
      alert('Failed to revoke consent. Please try again.');
    } finally {
      revokingConsent = null;
    }
  }

  function getConsentTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      'TPO': 'Treatment, Payment, & Operations',
      'Fundraising_Contact': 'Fundraising Communications',
      'Research': 'Research & Data Analysis',
      'Emergency_Contact': 'Emergency Contact & Support'
    };
    return labels[type] || type;
  }

  async function requestDataAccess() {
    try {
      const { data, error } = await supabase.functions.invoke('request-data-access', {
        body: {
          request_type: 'data_access',
          beneficiary_id: (await supabase.auth.getUser()).data.user?.id
        }
      });

      if (error) throw error;

      alert('Your data access request has been submitted. You will receive an email within 30 days with your data.');
    } catch (error) {
      console.error('Error requesting data access:', error);
      alert('Failed to submit data access request. Please contact support.');
    }
  }

  async function requestDataDeletion() {
    if (!confirm('Are you sure you want to request data deletion? This action cannot be undone and may affect your ability to receive services.')) {
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('request-data-access', {
        body: {
          request_type: 'data_deletion',
          beneficiary_id: (await supabase.auth.getUser()).data.user?.id
        }
      });

      if (error) throw error;

      alert('Your data deletion request has been submitted. A team member will review your request and contact you within 30 days.');
    } catch (error) {
      console.error('Error requesting data deletion:', error);
      alert('Failed to submit data deletion request. Please contact support.');
    }
  }
</script>

<svelte:head>
  <title>Privacy & Data Rights - Metzler Foundations</title>
  <meta name="description" content="Manage your privacy settings and exercise your data rights under the Colorado Privacy Act." />
</svelte:head>

<div class="min-h-screen bg-cream text-navy">
  <!-- Header -->
  <header class="bg-cream border-b border-navy border-opacity-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div class="flex justify-between items-center">
        <div class="flex items-center space-x-4">
          <button
            on:click={() => window.history.back()}
            class="text-navy hover:text-olive transition-colors"
          >
            ← Back to Portal
          </button>
          <span class="text-xl font-medium text-navy">Privacy & Data Rights</span>
        </div>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- My Active Consents -->
    <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-6 mb-8">
      <h2 class="text-2xl font-medium text-navy mb-6">My Active Consents</h2>

      {#if loading}
        <div class="flex justify-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-navy"></div>
        </div>
      {:else if consents.length === 0}
        <div class="text-center py-8">
          <svg class="mx-auto h-12 w-12 text-navy text-opacity-40 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-navy text-opacity-60">No active consents found.</p>
        </div>
      {:else}
        <div class="space-y-4">
          {#each consents as consent}
            <div class="border border-navy border-opacity-20 rounded-lg p-4">
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <h3 class="font-medium text-navy">
                    Consent for: {getConsentTypeLabel(consent.consent_type || '')}
                  </h3>
                  <p class="text-sm text-navy text-opacity-70 mt-1">
                    Status: <span class={`font-medium ${
                      consent.status === 'active' ? 'text-olive' :
                      consent.status === 'revoked' ? 'text-red-600' :
                      'text-gray-600'
                    }`}>
                      {(consent.status || 'unknown').replace(/_/g, ' ')}
                    </span>
                  </p>
                  <p class="text-sm text-navy text-opacity-60 mt-1">
                    Granted: {new Date(consent.created_at).toLocaleDateString()}
                    {#if consent.expiration_date}
                      | Expires: {new Date(consent.expiration_date).toLocaleDateString()}
                    {/if}
                  </p>
                </div>

                {#if consent.status === 'active'}
                  <button
                    on:click={() => revokeConsent(consent.id)}
                    disabled={revokingConsent === consent.id}
                    class="px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-md hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {#if revokingConsent === consent.id}
                      Revoking...
                    {:else}
                      Revoke Consent
                    {/if}
                  </button>
                {/if}
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>

    <!-- Data Rights -->
    <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-6">
      <h2 class="text-2xl font-medium text-navy mb-6">Your Data Rights (Colorado Privacy Act)</h2>

      <div class="prose prose-sm max-w-none text-navy text-opacity-80 mb-8">
        <p>
          Under the Colorado Privacy Act, you have the right to request a copy of your data or request the deletion of your personal data.
          Please note that for legal and medical compliance, we are required to retain some records for a set period, but we will delete all non-essential data upon your request.
        </p>
        <p>
          All requests will be reviewed by our compliance team and processed within 30 days. You will receive email confirmation of your request and its completion.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          on:click={requestDataAccess}
          class="bg-navy text-cream py-4 px-6 rounded-md font-medium hover:bg-opacity-90 transition-colors"
        >
          Request My Data
        </button>

        <button
          on:click={requestDataDeletion}
          class="bg-navy text-cream py-4 px-6 rounded-md font-medium hover:bg-opacity-90 transition-colors"
        >
          Request Data Deletion
        </button>
      </div>

      <div class="mt-6 p-4 bg-navy bg-opacity-5 rounded-lg">
        <h3 class="font-medium text-navy mb-2">Need Help?</h3>
        <p class="text-sm text-navy text-opacity-70">
          If you have questions about your privacy rights or need assistance with these requests,
          please contact our privacy officer at <a href="mailto:privacy@metzlerfoundations.org" class="text-olive hover:text-navy">privacy@metzlerfoundations.org</a>
        </p>
      </div>
    </div>
  </main>
</div>
