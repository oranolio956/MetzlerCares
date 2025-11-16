<script lang="ts">
  import MetzlerBridgeLogo from '$lib/MetzlerBridgeLogo.svelte';
  import { goto } from '$app/navigation';
  import { supabase } from '$lib/utils/supabase';
  import { onMount } from 'svelte';
  import type { Application, Beneficiary, FormError } from '$lib/types';

  let application: Application | null = null;
  let beneficiary: Beneficiary | null = null;
  let loading = true;
  let error: FormError | null = null;

  onMount(async () => {
    await loadApplicationStatus();
  });

  async function loadApplicationStatus() {
    try {
      loading = true;
      error = null;

      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        goto('/auth/login');
        return;
      }

      // Load beneficiary profile
      const { data: beneficiaryData, error: beneficiaryError } = await supabase
        .from('beneficiaries')
        .select('*')
        .eq('id', user.id)
        .single();

      if (beneficiaryError) {
        error = { message: 'Beneficiary profile not found' };
        return;
      }

      beneficiary = beneficiaryData;

      // Load most recent application
      const { data: applicationData, error: appError } = await supabase
        .from('applications')
        .select(`
          *,
          sober_living_partners (
            facility_name,
            contact_email,
            address_city,
            address_state
          )
        `)
        .eq('beneficiary_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (appError && appError.code !== 'PGRST116') {
        error = { message: 'Failed to load application status' };
        return;
      }

      application = applicationData || null;

    } catch (err) {
      console.error('Error loading status:', err);
      error = { message: 'An unexpected error occurred' };
    } finally {
      loading = false;
    }
  }

  function getStatusStep(status: string): number {
    switch (status) {
      case 'draft':
      case 'pending':
        return 1;
      case 'approved':
        return 2;
      case 'funded':
        return 3;
      default:
        return 1;
    }
  }

  function getStatusMessage(status: string) {
    switch (status) {
      case 'pending':
        return {
          headline: "We're On It.",
          body: "Your application has been submitted and is in our automated verification queue. This process is usually completed in under 15 minutes. Please check back soon."
        };
      case 'approved':
        return {
          headline: "You're Approved.",
          body: `Your scholarship is approved. We are now processing the payment directly to ${application?.sober_living_partners?.facility_name || 'your facility'}. You do not need to do anything else. A confirmation email has been sent to you.`
        };
      case 'funded':
        return {
          headline: "Your Scholarship Has Been Paid.",
          body: `Your scholarship has been successfully paid to ${application?.sober_living_partners?.facility_name || 'your facility'}. We are honored to be a part of your recovery journey.`
        };
      default:
        return {
          headline: "Application Submitted",
          body: "Your application is being processed. We'll update you as soon as we have more information."
        };
    }
  }
</script>

<svelte:head>
  <title>My Application Status - Metzler Foundations</title>
  <meta name="description" content="Check your application status and track your scholarship progress." />
</svelte:head>

<div class="min-h-screen bg-warm-cream text-deep-navy-900">
  <!-- Header -->
  <header class="bg-warm-cream border-b border-deep-navy-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div class="flex justify-between items-center">
        <button on:click={() => goto('/')} class="flex items-center space-x-2">
          <MetzlerBridgeLogo class="w-8 h-8 text-deep-navy-700" />
          <span class="text-xl font-medium text-deep-navy-900">Metzler Foundations</span>
        </button>

        <div class="flex items-center space-x-4">
            <span class="text-sm text-deep-navy-700">Welcome back</span>
          <button
            on:click={() => supabase.auth.signOut().then(() => goto('/'))}
            class="text-deep-navy-900 hover:text-sage-700 transition-colors text-sm"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    {#if loading}
      <!-- Loading State -->
      <div class="flex justify-center items-center py-16">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-navy"></div>
        <span class="ml-3 text-navy">Loading your application status...</span>
      </div>

    {:else if error}
      <!-- Error State -->
      <div class="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
        <svg class="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <h3 class="text-lg font-medium text-red-800 mb-2">Unable to Load Status</h3>
        <p class="text-red-700 mb-6">{error}</p>
        <button
          on:click={loadApplicationStatus}
          class="bg-red-100 px-4 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200"
        >
          Try Again
        </button>
      </div>

    {:else if !application}
      <!-- No Application Found -->
      <div class="text-center py-16">
        <svg class="mx-auto h-12 w-12 text-navy text-opacity-40 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h1 class="text-3xl font-medium text-navy mb-4">No Application Found</h1>
        <p class="text-navy text-opacity-70 mb-8 max-w-2xl mx-auto">
          We don't have an application on file for your account. If you've recently applied,
          please allow a few minutes for processing. Otherwise, you can start a new application below.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            on:click={loadApplicationStatus}
            class="btn-primary"
          >
            Check Status Again
          </button>
          <button
            on:click={() => goto('/get-aid')}
            class="btn-secondary"
          >
            Start New Application
          </button>
        </div>
      </div>

    {:else}
      <!-- Application Status Display -->
      <div class="space-y-8">
        <!-- Progress Tracker -->
          <div class="bg-soft-white rounded-lg shadow-sm border border-deep-navy-200 p-8">
          <h1 class="text-2xl font-medium text-navy mb-8 text-center">My Application Status</h1>

          <!-- Visual Progress Bar -->
          <div class="mb-8">
            <div class="flex items-center justify-center space-x-8 mb-4">
              <div class="flex flex-col items-center">
                <div class={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium mb-2 ${
                  getStatusStep(application.status) >= 1 ? 'bg-navy text-cream' : 'bg-gray-200 text-gray-600'
                }`}>
                  1
                </div>
                <span class="text-xs text-center text-navy text-opacity-70">Application<br>Submitted</span>
              </div>

              <div class="w-16 h-0.5 bg-gray-200"></div>

              <div class="flex flex-col items-center">
                <div class={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium mb-2 ${
                  getStatusStep(application.status) >= 2 ? 'bg-navy text-cream' : 'bg-gray-200 text-gray-600'
                }`}>
                  2
                </div>
                <span class="text-xs text-center text-navy text-opacity-70">Application<br>Approved</span>
              </div>

              <div class="w-16 h-0.5 bg-gray-200"></div>

              <div class="flex flex-col items-center">
                <div class={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium mb-2 ${
                  getStatusStep(application.status) >= 3 ? 'bg-navy text-cream' : 'bg-gray-200 text-gray-600'
                }`}>
                  3
                </div>
                <span class="text-xs text-center text-navy text-opacity-70">Scholarship<br>Funded</span>
              </div>
            </div>
          </div>

          <!-- Status Message -->
          <div class="text-center">
            <h2 class="text-2xl font-medium text-navy mb-4">{getStatusMessage(application.status).headline}</h2>
            <p class="text-navy text-opacity-80 max-w-2xl mx-auto">{getStatusMessage(application.status).body}</p>
          </div>
        </div>

        <!-- Application Details -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Beneficiary Information -->
          <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-6">
            <h2 class="text-xl font-medium text-navy mb-6">Application Details</h2>

            <div class="space-y-4">
              <div>
                <p class="block text-sm font-medium text-navy text-opacity-70 mb-1">Application ID</p>
                <p class="text-deep-navy-900">{application.id.slice(-8).toUpperCase()}</p>
              </div>

              <div>
                <p class="block text-sm font-medium text-navy text-opacity-70 mb-1">Submitted</p>
                <p class="text-deep-navy-900">{new Date(application.created_at).toLocaleDateString()}</p>
              </div>

              <div>
                <p class="block text-sm font-medium text-navy text-opacity-70 mb-1">Status</p>
                <span class={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  application.status === 'approved' ? 'bg-success bg-opacity-10 text-success' :
                  application.status === 'pending' ? 'bg-warning bg-opacity-10 text-warning' :
                  application.status === 'funded' ? 'bg-info bg-opacity-10 text-info' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {application.status.replace(/_/g, ' ')}
                </span>
              </div>

              {#if application.amount_requested}
                <div>
                  <p class="block text-sm font-medium text-deep-navy-700 mb-1">Requested Amount</p>
                  <p class="text-deep-navy-900">${application.amount_requested}</p>
                </div>
              {/if}

              {#if application.status === 'funded' && application.payment_date}
                <div>
                  <p class="block text-sm font-medium text-navy text-opacity-70 mb-1">Payment Date</p>
                  <p class="text-navy">{new Date(application.payment_date).toLocaleDateString()}</p>
                </div>
              {/if}
            </div>
          </div>

          <!-- Facility Information -->
          <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-6">
            <h2 class="text-xl font-medium text-navy mb-6">Assigned Facility</h2>

            {#if application.sober_living_partners}
              <div class="space-y-4">
                <div>
                  <p class="block text-sm font-medium text-navy text-opacity-70 mb-1">Facility Name</p>
                  <p class="text-navy">{application.sober_living_partners.facility_name}</p>
                </div>

                <div>
                  <p class="block text-sm font-medium text-navy text-opacity-70 mb-1">Location</p>
                  <p class="text-navy">
                    {application.sober_living_partners.address_city}, {application.sober_living_partners.address_state}
                  </p>
                </div>

                <div>
                  <p class="block text-sm font-medium text-navy text-opacity-70 mb-1">Contact</p>
                  <p class="text-navy">{application.sober_living_partners.contact_email}</p>
                </div>

                {#if application.status === 'funded'}
                  <div class="mt-6 p-4 bg-sage-50 border border-sage-200 rounded-lg">
                    <div class="flex items-start">
                      <svg class="w-5 h-5 text-sage-400 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <div>
                        <h3 class="text-sm font-medium text-sage-800">Payment Processed</h3>
                        <p class="text-sm text-sage-700 mt-1">
                          Your scholarship has been paid directly to this facility. They will contact you soon to arrange move-in.
                        </p>
                      </div>
                    </div>
                  </div>
                {:else if application.status === 'approved'}
                  <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div class="flex items-start">
                      <svg class="w-5 h-5 text-blue-400 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <h3 class="text-sm font-medium text-blue-800">Payment Processing</h3>
                        <p class="text-sm text-blue-700 mt-1">
                          Your scholarship is approved and payment is being processed. This usually takes 1-2 business days.
                        </p>
                      </div>
                    </div>
                  </div>
                {/if}
              </div>
            {:else}
              <div class="text-center py-8">
                <svg class="mx-auto h-8 w-8 text-navy text-opacity-40 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <p class="text-deep-navy-700">Facility assignment pending</p>
              </div>
            {/if}
          </div>
        </div>

        <!-- Support Information -->
        <div class="bg-soft-white rounded-lg shadow-sm border border-deep-navy-200 p-8">
          <h2 class="text-xl font-medium text-navy mb-6 text-center">Need Help?</h2>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="text-center">
              <svg class="mx-auto h-8 w-8 text-olive mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <h3 class="font-medium text-deep-navy-900 mb-2">Call Support</h3>
              <p class="text-sm text-deep-navy-700">Have questions about your application?</p>
              <a href="tel:+15551234567" class="text-sage-700 hover:text-deep-navy-900 text-sm font-medium mt-2 inline-block">
                (555) 123-4567
              </a>
            </div>

            <div class="text-center">
              <svg class="mx-auto h-8 w-8 text-olive mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h3 class="font-medium text-deep-navy-900 mb-2">Email Updates</h3>
              <p class="text-sm text-deep-navy-700">We'll send you updates at your email address.</p>
            </div>

            <div class="text-center">
              <svg class="mx-auto h-8 w-8 text-olive mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 class="font-medium text-deep-navy-900 mb-2">FAQs</h3>
              <p class="text-sm text-deep-navy-700">Common questions about the process.</p>
              <a href="/faqs" class="text-olive hover:text-navy text-sm font-medium mt-2 inline-block">
                View FAQs →
              </a>
            </div>
          </div>
        </div>
      </div>
    {/if}
  </main>
</div>
