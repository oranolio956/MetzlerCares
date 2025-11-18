<script lang="ts">
  import { onMount } from 'svelte'
  import { supabase } from '$lib/utils/supabase'
  import { goto } from '$app/navigation'
  import type { User, Beneficiary, Consent, Application } from '$lib/types'

  let user: User | null = null
  let beneficiary: Beneficiary | null = null
  let consents: Consent[] = []
  let applications: Application[] = []
  let loading = true

  onMount(async () => {
    // Check authentication
    const {
      data: { user: authUser },
      error: authError
    } = await supabase.auth.getUser()

    if (authError || !authUser) {
      goto('/auth/login')
      return
    }

    user = authUser as any

    // Load beneficiary data
    const { data: beneficiaryData, error: beneficiaryError } = await supabase
      .from('beneficiaries')
      .select('*')
      .eq('id', user?.id)
      .single()

    if (beneficiaryError && beneficiaryError.code !== 'PGRST116') {
      console.error('Error loading beneficiary:', beneficiaryError)
    } else {
      beneficiary = beneficiaryData
    }

    // Load consents
    const { data: consentsData, error: consentsError } = await supabase
      .from('consents')
      .select('*')
      .eq('beneficiary_id', (user as any)?.id)
      .order('granted_at', { ascending: false })

    if (consentsError) {
      console.error('Error loading consents:', consentsError)
    } else {
      consents = consentsData || []
    }

    // Load applications
    const { data: applicationsData, error: applicationsError } = await supabase
      .from('applications')
      .select(
        `
        *,
        partner:sober_living_partners(facility_name, contact_email)
      `
      )
      .eq('beneficiary_id', (user as any)?.id)
      .order('created_at', { ascending: false })

    if (applicationsError) {
      console.error('Error loading applications:', applicationsError)
    } else {
      applications = applicationsData || []
    }

    loading = false
  })

  function getConsentStatusColor(status: string) {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'revoked':
        return 'bg-red-100 text-red-800'
      case 'expired':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  function getApplicationStatusColor(status: string) {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'denied':
        return 'bg-red-100 text-red-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'under_review':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }
</script>

<svelte:head>
  <title>Dashboard - Metzler Foundations</title>
  <meta name="description" content="Your personal dashboard for managing applications and consents." />
</svelte:head>

<div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
  <div class="max-w-4xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Your Dashboard</h1>
      <p class="text-gray-600 mt-2">Manage your applications and consent preferences</p>
    </div>

    {#if loading}
      <!-- Loading State -->
      <div class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span class="ml-3 text-gray-600">Loading your information...</span>
      </div>
    {:else}
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Profile Section -->
        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Profile Information</h2>

          {#if beneficiary}
            <div class="space-y-3">
              <div>
                <div class="text-sm font-medium text-gray-500">Name</div>
                <p class="text-gray-900">{beneficiary.full_name}</p>
              </div>
              <div>
                <div class="text-sm font-medium text-gray-500">Email</div>
                <p class="text-gray-900">{beneficiary.email}</p>
              </div>
              <div>
                <div class="text-sm font-medium text-gray-500">Phone</div>
                <p class="text-gray-900">{beneficiary.phone || 'Not provided'}</p>
              </div>
              <div>
                <div class="text-sm font-medium text-gray-500">Member Since</div>
                <p class="text-gray-900">{new Date(beneficiary.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          {:else}
            <div class="text-center py-8">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">No profile found</h3>
              <p class="mt-1 text-sm text-gray-500">Complete your application to create your profile.</p>
              <div class="mt-6">
                <a href="/app/apply" class="text-blue-600 hover:text-blue-500 text-sm font-medium">
                  Start Application →
                </a>
              </div>
            </div>
          {/if}
        </div>

        <!-- Consents Section -->
        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Your Consents</h2>

          {#if consents.length > 0}
            <div class="space-y-4">
              {#each consents as consent}
                <div class="border border-gray-200 rounded-md p-4">
                  <div class="flex items-center justify-between mb-2">
                    <h3 class="text-sm font-medium text-gray-900">
                      {consent.consent_type?.replace(/_/g, ' ') || consent.type.replace(/_/g, ' ')}
                    </h3>
                    <span
                      class={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getConsentStatusColor(consent.status || (consent.granted ? 'granted' : 'revoked'))}`}
                    >
                      {consent.status || (consent.granted ? 'granted' : 'revoked')}
                    </span>
                  </div>
                  <p class="text-sm text-gray-600 mb-2">{consent.purpose || 'Research and data analysis'}</p>
                  <div class="text-xs text-gray-500">
                    Granted: {consent.granted_at ? new Date(consent.granted_at).toLocaleDateString() : 'Unknown'}
                    {#if consent.expires_at}
                      <br />Expires: {new Date(consent.expires_at).toLocaleDateString()}
                    {/if}
                  </div>
                </div>
              {/each}
            </div>
          {:else}
            <div class="text-center py-8">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">No consents found</h3>
              <p class="mt-1 text-sm text-gray-500">Complete your application to set up consent agreements.</p>
            </div>
          {/if}
        </div>

        <!-- Applications Section -->
        <div class="bg-white shadow rounded-lg p-6 lg:col-span-2">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Your Applications</h2>

          {#if applications.length > 0}
            <div class="space-y-4">
              {#each applications as application}
                <div class="border border-gray-200 rounded-md p-4">
                  <div class="flex items-center justify-between mb-3">
                    <h3 class="text-lg font-medium text-gray-900">
                      {application.partner?.facility_name ||
                        application.partner?.organization_name ||
                        'Unknown Facility'}
                    </h3>
                    <span
                      class={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getApplicationStatusColor(application.status)}`}
                    >
                      {application.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <div class="text-gray-500">Applied</div>
                      <p class="text-gray-900">{new Date(application.created_at).toLocaleDateString()}</p>
                    </div>
                    {#if application.preferred_start_date}
                      <div>
                        <div class="text-gray-500">Preferred Start</div>
                        <p class="text-gray-900">{new Date(application.preferred_start_date).toLocaleDateString()}</p>
                      </div>
                    {/if}
                    {#if application.partner?.contact_email}
                      <div>
                        <div class="text-gray-500">Contact</div>
                        <p class="text-gray-900">{application.partner.contact_email}</p>
                      </div>
                    {/if}
                  </div>

                  {#if application.special_requirements}
                    <div class="mt-3 pt-3 border-t border-gray-200">
                      <div class="text-sm text-gray-500">Special Requirements</div>
                      <p class="text-sm text-gray-900">{application.special_requirements}</p>
                    </div>
                  {/if}
                </div>
              {/each}
            </div>
          {:else}
            <div class="text-center py-12">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">No applications yet</h3>
              <p class="mt-1 text-sm text-gray-500">Apply to sober living facilities to get started.</p>
              <div class="mt-6">
                <a href="/app/apply" class="text-blue-600 hover:text-blue-500 text-sm font-medium">
                  Start New Application →
                </a>
              </div>
            </div>
          {/if}
        </div>
      </div>
    {/if}
  </div>
</div>
