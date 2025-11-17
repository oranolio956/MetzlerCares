<script lang="ts">
  import { onMount } from 'svelte'
  import { supabase } from '$lib/utils/supabase'
  import { goto } from '$app/navigation'
  import type { Application, FormError } from '$lib/types'

  // Type for applications with joined beneficiary and partner data
  type ApplicationWithJoins = {
    id: any
    status: any
    created_at: any
    amount_requested: any
    special_requirements: any
    beneficiaries: { full_name: any; email: any; phone: any }[]
    sober_living_partners: { facility_name: any; address_city: any; address_state: any }[] | null
  }

  let pendingApplications: ApplicationWithJoins[] = []
  let disbursementsReady: Application[] = []
  let approvedApplications: Application[] = []
  let rejectedApplications: Application[] = []
  let loading = true
  let error: FormError | null = null
  let activeTab = 'pending'
  let selectedApplication: Application | null = null
  let showReviewModal = false

  onMount(async () => {
    await loadApplications()
  })

  async function loadApplications() {
    try {
      loading = true
      error = null

      // Load pending applications
      const { data: pendingData, error: pendingError } = await supabase
        .from('applications')
        .select(
          `
          id,
          status,
          created_at,
          amount_requested,
          special_requirements,
          beneficiaries!inner(full_name, email, phone),
          sober_living_partners(facility_name, address_city, address_state)
        `
        )
        .eq('status', 'pending')
        .order('created_at', { ascending: false })

      if (pendingError) {
        console.error('Error loading pending applications:', pendingError)
        error = { message: 'Failed to load pending applications' }
      } else {
        pendingApplications = (pendingData as ApplicationWithJoins[]) || []
      }

      // Load approved applications ready for disbursement
      const { data: disbursementData, error: disbursementError } = await supabase
        .from('applications')
        .select(
          `
          id,
          status,
          created_at,
          amount_requested,
          payment_date,
          beneficiaries!inner(full_name, email),
          sober_living_partners!inner(facility_name, contact_email, address_city, address_state)
        `
        )
        .eq('status', 'approved')
        .is('payment_date', null)
        .order('created_at', { ascending: false })

      if (disbursementError) {
        console.error('Error loading disbursement applications:', disbursementError)
      } else {
        disbursementsReady = (disbursementData as unknown as Application[]) || []
      }

      // Load recently approved applications
      const { data: approvedData, error: approvedError } = await supabase
        .from('applications')
        .select(
          `
          id,
          status,
          created_at,
          amount_requested,
          payment_date,
          beneficiaries!inner(full_name),
          sober_living_partners!inner(facility_name)
        `
        )
        .eq('status', 'approved')
        .not('payment_date', 'is', null)
        .order('created_at', { ascending: false })
        .limit(10)

      if (approvedError) {
        console.error('Error loading approved applications:', approvedError)
      } else {
        approvedApplications = (approvedData as unknown as Application[]) || []
      }

      // Load rejected applications
      const { data: rejectedData, error: rejectedError } = await supabase
        .from('applications')
        .select(
          `
          id,
          status,
          created_at,
          rejection_reason,
          beneficiaries!inner(full_name, email)
        `
        )
        .eq('status', 'rejected')
        .order('created_at', { ascending: false })
        .limit(10)

      if (rejectedError) {
        console.error('Error loading rejected applications:', rejectedError)
      } else {
        rejectedApplications = (rejectedData as unknown as Application[]) || []
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      error = { message: 'An unexpected error occurred' }
    } finally {
      loading = false
    }
  }

  function openReviewModal(application: Application) {
    selectedApplication = application
    showReviewModal = true
  }

  async function approveApplication(applicationId: string, amount: number, partnerId?: string) {
    try {
      const { error: updateError } = await supabase
        .from('applications')
        .update({
          status: 'approved',
          amount_requested: amount,
          partner_id: partnerId,
          approved_at: new Date().toISOString(),
          approved_by: 'staff' // In real app, get from auth
        })
        .eq('id', applicationId)

      if (updateError) {
        console.error('Error approving application:', updateError)
        error = { message: 'Failed to approve application' }
      } else {
        showReviewModal = false
        selectedApplication = null
        await loadApplications() // Refresh data
      }
    } catch (err) {
      console.error('Error in approveApplication:', err)
      error = { message: 'An unexpected error occurred' }
    }
  }

  async function rejectApplication(applicationId: string, reason: string) {
    try {
      const { error: updateError } = await supabase
        .from('applications')
        .update({
          status: 'rejected',
          rejection_reason: reason,
          rejected_at: new Date().toISOString(),
          rejected_by: 'staff' // In real app, get from auth
        })
        .eq('id', applicationId)

      if (updateError) {
        console.error('Error rejecting application:', updateError)
        error = { message: 'Failed to reject application' }
      } else {
        showReviewModal = false
        selectedApplication = null
        await loadApplications() // Refresh data
      }
    } catch (err) {
      console.error('Error in rejectApplication:', err)
      error = { message: 'An unexpected error occurred' }
    }
  }

  async function processPayment(applicationId: string) {
    try {
      const { error: updateError } = await supabase
        .from('applications')
        .update({
          status: 'funded',
          payment_date: new Date().toISOString(),
          payment_processed_by: 'staff' // In real app, get from auth
        })
        .eq('id', applicationId)

      if (updateError) {
        console.error('Error processing payment:', updateError)
        error = { message: 'Failed to process payment' }
      } else {
        await loadApplications() // Refresh data
      }
    } catch (err) {
      console.error('Error in processPayment:', err)
      error = { message: 'An unexpected error occurred' }
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString()
  }

  function viewApplication(id: string) {
    goto(`/staff/application/${id}`)
  }
</script>

<svelte:head>
  <title>Application Queue - Staff Dashboard</title>
  <meta name="description" content="Review and manage beneficiary applications and disbursements." />
</svelte:head>

<div class="min-h-screen bg-cream text-navy">
  <header class="bg-navy text-cream shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-medium">Application Queue</h1>
          <p class="text-cream text-opacity-80">Human-in-the-Loop Command Center</p>
        </div>
        <button
          onclick={loadApplications}
          class="px-4 py-2 bg-olive text-cream rounded-md hover:bg-opacity-90 transition-colors"
        >
          Refresh Queue
        </button>
      </div>
    </div>
  </header>

  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {#if loading}
      <div class="flex justify-center items-center py-16">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-navy"></div>
        <span class="ml-3 text-navy">Loading application queue...</span>
      </div>
    {:else if error}
      <div class="bg-red-50 border border-red-200 rounded-lg p-6">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Error Loading Applications</h3>
            <div class="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
            <div class="mt-4">
              <button
                onclick={loadApplications}
                class="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    {:else}
      <!-- Dashboard Overview -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-navy text-opacity-70">Pending Review</p>
              <p class="text-2xl font-bold text-navy">{pendingApplications.length}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-navy text-opacity-70">Ready for Payment</p>
              <p class="text-2xl font-bold text-navy">{disbursementsReady.length}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-navy text-opacity-70">Funded Today</p>
              <p class="text-2xl font-bold text-navy">
                {approvedApplications.filter(
                  app => app.payment_date && new Date(app.payment_date).toDateString() === new Date().toDateString()
                ).length}
              </p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-navy text-opacity-70">Rejected</p>
              <p class="text-2xl font-bold text-navy">{rejectedApplications.length}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Navigation -->
      <div class="mb-8">
        <nav class="flex space-x-8" aria-label="Tabs">
          <button
            onclick={() => (activeTab = 'pending')}
            class="whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm {activeTab === 'pending'
              ? 'border-navy text-navy'
              : 'border-transparent text-navy text-opacity-60 hover:text-navy hover:border-navy'}"
          >
            Pending Review ({pendingApplications.length})
          </button>
          <button
            onclick={() => (activeTab = 'disbursements')}
            class="whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm {activeTab === 'disbursements'
              ? 'border-navy text-navy'
              : 'border-transparent text-navy text-opacity-60 hover:text-navy hover:border-navy'}"
          >
            Ready for Payment ({disbursementsReady.length})
          </button>
          <button
            onclick={() => (activeTab = 'approved')}
            class="whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm {activeTab === 'approved'
              ? 'border-navy text-navy'
              : 'border-transparent text-navy text-opacity-60 hover:text-navy hover:border-navy'}"
          >
            Recently Funded ({approvedApplications.length})
          </button>
          <button
            onclick={() => (activeTab = 'rejected')}
            class="whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm {activeTab === 'rejected'
              ? 'border-navy text-navy'
              : 'border-transparent text-navy text-opacity-60 hover:text-navy hover:border-navy'}"
          >
            Rejected ({rejectedApplications.length})
          </button>
        </nav>
      </div>

      <!-- Tab Content -->
      {#if activeTab === 'pending'}
        <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 overflow-hidden">
          <div class="px-6 py-4 bg-navy bg-opacity-5 border-b border-navy border-opacity-10">
            <h2 class="text-xl font-medium text-navy">Pending Verification</h2>
            <p class="text-sm text-navy text-opacity-70 mt-1">Applications awaiting review and approval</p>
          </div>

          {#if pendingApplications.length === 0}
            <div class="px-6 py-12 text-center">
              <svg
                class="mx-auto h-12 w-12 text-navy text-opacity-40"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 class="mt-2 text-sm font-medium text-navy">No pending applications</h3>
              <p class="mt-1 text-sm text-navy text-opacity-60">All applications have been processed.</p>
            </div>
          {:else}
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-navy divide-opacity-10">
                <thead class="bg-navy bg-opacity-5">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-navy uppercase tracking-wider">Applicant</th
                    >
                    <th class="px-6 py-3 text-left text-xs font-medium text-navy uppercase tracking-wider">Contact</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-navy uppercase tracking-wider"
                      >Date Submitted</th
                    >
                    <th class="px-6 py-3 text-left text-xs font-medium text-navy uppercase tracking-wider">Amount</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-navy uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-navy divide-opacity-10">
                  {#each pendingApplications as application}
                    <tr class="hover:bg-navy hover:bg-opacity-5 transition-colors">
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm font-medium text-navy">
                          {(application.beneficiaries as any)?.full_name || 'N/A'}
                        </div>
                        <div class="text-xs text-navy text-opacity-60">
                          ID: {application.id.slice(-8).toUpperCase()}
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-navy text-opacity-80">
                          {(application.beneficiaries as any)?.email || 'N/A'}
                        </div>
                        <div class="text-xs text-navy text-opacity-60">
                          {(application.beneficiaries as any)?.phone || ''}
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-navy text-opacity-80">{formatDate(application.created_at)}</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm font-medium text-navy">${application.amount_requested || 'TBD'}</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onclick={() => openReviewModal(application as unknown as Application)}
                          class="text-olive hover:text-navy transition-colors mr-4"
                        >
                          Review
                        </button>
                        <button
                          onclick={() => viewApplication(application.id)}
                          class="text-navy hover:text-olive transition-colors"
                        >
                          Details →
                        </button>
                      </td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
          {/if}
        </div>
      {:else if activeTab === 'disbursements'}
        <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 overflow-hidden">
          <div class="px-6 py-4 bg-navy bg-opacity-5 border-b border-navy border-opacity-10">
            <h2 class="text-xl font-medium text-navy">Ready for Disbursement</h2>
            <p class="text-sm text-navy text-opacity-70 mt-1">
              Approved applications ready for fund disbursement to partners
            </p>
          </div>

          {#if disbursementsReady.length === 0}
            <div class="px-6 py-12 text-center">
              <svg
                class="mx-auto h-12 w-12 text-navy text-opacity-40"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
              <h3 class="mt-2 text-sm font-medium text-navy">No disbursements ready</h3>
              <p class="mt-1 text-sm text-navy text-opacity-60">
                Approved applications will appear here when ready for payment.
              </p>
            </div>
          {:else}
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-navy divide-opacity-10">
                <thead class="bg-navy bg-opacity-5">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-navy uppercase tracking-wider">Applicant</th
                    >
                    <th class="px-6 py-3 text-left text-xs font-medium text-navy uppercase tracking-wider">Facility</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-navy uppercase tracking-wider">Amount</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-navy uppercase tracking-wider"
                      >Approved Date</th
                    >
                    <th class="px-6 py-3 text-left text-xs font-medium text-navy uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-navy divide-opacity-10">
                  {#each disbursementsReady as application}
                    <tr class="hover:bg-navy hover:bg-opacity-5 transition-colors">
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm font-medium text-navy">
                          {(application.beneficiaries as any)?.full_name || 'N/A'}
                        </div>
                        <div class="text-xs text-navy text-opacity-60">ID: {application.id.slice(-8)}</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-navy text-opacity-80">
                          {(application.sober_living_partners as any)?.facility_name || 'N/A'}
                        </div>
                        <div class="text-xs text-navy text-opacity-60">
                          {(application.sober_living_partners as any)?.contact_email || 'N/A'}
                        </div>
                        <div class="text-xs text-navy text-opacity-60">
                          {(application.sober_living_partners as any)?.address_city}, {(
                            application.sober_living_partners as any
                          )?.address_state}
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm font-medium text-navy">${application.amount_requested || 'TBD'}</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-navy text-opacity-80">{formatDate(application.created_at)}</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onclick={() => processPayment(application.id)}
                          class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium hover:bg-green-200 transition-colors mr-2"
                        >
                          Process Payment
                        </button>
                        <button
                          onclick={() => viewApplication(application.id)}
                          class="text-navy hover:text-olive transition-colors"
                        >
                          Details →
                        </button>
                      </td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
          {/if}
        </div>
      {:else if activeTab === 'approved'}
        <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 overflow-hidden">
          <div class="px-6 py-4 bg-navy bg-opacity-5 border-b border-navy border-opacity-10">
            <h2 class="text-xl font-medium text-navy">Recently Funded</h2>
            <p class="text-sm text-navy text-opacity-70 mt-1">Applications that have been funded and paid out</p>
          </div>

          {#if approvedApplications.length === 0}
            <div class="px-6 py-12 text-center">
              <svg
                class="mx-auto h-12 w-12 text-navy text-opacity-40"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
              <h3 class="mt-2 text-sm font-medium text-navy">No recent funding</h3>
              <p class="mt-1 text-sm text-navy text-opacity-60">Funded applications will appear here.</p>
            </div>
          {:else}
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-navy divide-opacity-10">
                <thead class="bg-navy bg-opacity-5">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-navy uppercase tracking-wider">Applicant</th
                    >
                    <th class="px-6 py-3 text-left text-xs font-medium text-navy uppercase tracking-wider">Facility</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-navy uppercase tracking-wider">Amount</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-navy uppercase tracking-wider"
                      >Payment Date</th
                    >
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-navy divide-opacity-10">
                  {#each approvedApplications as application}
                    <tr class="hover:bg-navy hover:bg-opacity-5 transition-colors">
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm font-medium text-navy">
                          {(application.beneficiaries as any)?.full_name || 'N/A'}
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-navy text-opacity-80">
                          {(application.sober_living_partners as any)?.facility_name || 'N/A'}
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm font-medium text-navy">${application.amount_requested || 'TBD'}</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-navy text-opacity-80">
                          {application.payment_date ? formatDate(application.payment_date) : 'Pending'}
                        </div>
                      </td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
          {/if}
        </div>
      {:else if activeTab === 'rejected'}
        <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 overflow-hidden">
          <div class="px-6 py-4 bg-navy bg-opacity-5 border-b border-navy border-opacity-10">
            <h2 class="text-xl font-medium text-navy">Rejected Applications</h2>
            <p class="text-sm text-navy text-opacity-70 mt-1">Applications that were not approved for funding</p>
          </div>

          {#if rejectedApplications.length === 0}
            <div class="px-6 py-12 text-center">
              <svg
                class="mx-auto h-12 w-12 text-navy text-opacity-40"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <h3 class="mt-2 text-sm font-medium text-navy">No rejected applications</h3>
              <p class="mt-1 text-sm text-navy text-opacity-60">Rejected applications will appear here.</p>
            </div>
          {:else}
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-navy divide-opacity-10">
                <thead class="bg-navy bg-opacity-5">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-navy uppercase tracking-wider">Applicant</th
                    >
                    <th class="px-6 py-3 text-left text-xs font-medium text-navy uppercase tracking-wider">Contact</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-navy uppercase tracking-wider">Date</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-navy uppercase tracking-wider">Reason</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-navy divide-opacity-10">
                  {#each rejectedApplications as application}
                    <tr class="hover:bg-navy hover:bg-opacity-5 transition-colors">
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm font-medium text-navy">
                          {(application.beneficiaries as any)?.full_name || 'N/A'}
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-navy text-opacity-80">
                          {(application.beneficiaries as any)?.email || 'N/A'}
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-navy text-opacity-80">{formatDate(application.created_at)}</div>
                      </td>
                      <td class="px-6 py-4">
                        <div class="text-sm text-navy text-opacity-80">
                          {(application as any).rejection_reason || 'Not specified'}
                        </div>
                      </td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
          {/if}
        </div>
      {/if}
    {/if}

    <!-- Review Modal -->
    {#if showReviewModal && selectedApplication}
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div class="px-6 py-4 border-b border-navy border-opacity-10">
            <h3 class="text-lg font-medium text-navy">Review Application</h3>
            <p class="text-sm text-navy text-opacity-70 mt-1">
              Applicant: {(selectedApplication.beneficiaries as any)?.full_name}
            </p>
          </div>

          <div class="p-6 space-y-6">
            <!-- Applicant Details -->
            <div class="bg-cream bg-opacity-50 rounded-lg p-4">
              <h4 class="font-medium text-navy mb-3">Applicant Information</h4>
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span class="text-navy text-opacity-70">Name:</span>
                  <span class="ml-2 text-navy">{(selectedApplication.beneficiaries as any)?.full_name}</span>
                </div>
                <div>
                  <span class="text-navy text-opacity-70">Email:</span>
                  <span class="ml-2 text-navy">{(selectedApplication.beneficiaries as any)?.email}</span>
                </div>
                <div>
                  <span class="text-navy text-opacity-70">Phone:</span>
                  <span class="ml-2 text-navy"
                    >{(selectedApplication.beneficiaries as any)?.phone || 'Not provided'}</span
                  >
                </div>
                <div>
                  <span class="text-navy text-opacity-70">Submitted:</span>
                  <span class="ml-2 text-navy">{formatDate(selectedApplication.created_at)}</span>
                </div>
              </div>
            </div>

            <!-- Facility Selection -->
            <div>
              <label for="facility-select" class="block text-sm font-medium text-navy mb-2">Assign to Facility</label>
              <select class="form-input" id="facility-select">
                <option value="">Select a facility...</option>
                <!-- In real app, populate with available facilities -->
                <option value="facility-1">Hope Recovery Center</option>
                <option value="facility-2">Safe Harbor Sober Living</option>
                <option value="facility-3">Evergreen Recovery House</option>
              </select>
            </div>

            <!-- Scholarship Amount -->
            <div>
              <label for="amount-input" class="block text-sm font-medium text-navy mb-2">Scholarship Amount</label>
              <input type="number" class="form-input" placeholder="300" id="amount-input" />
              <p class="text-xs text-navy text-opacity-60 mt-1">Standard amount is $300 (one month's housing)</p>
            </div>

            <!-- Action Buttons -->
            <div class="flex space-x-3 pt-4 border-t border-navy border-opacity-10">
              <button
                onclick={() => (showReviewModal = false)}
                class="flex-1 px-4 py-2 text-sm font-medium text-navy bg-white border border-navy border-opacity-20 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onclick={() =>
                  selectedApplication &&
                  rejectApplication(selectedApplication.id, 'Does not meet eligibility criteria')}
                class="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
              >
                Reject Application
              </button>
              <button
                onclick={() => {
                  const facility = (document.getElementById('facility-select') as HTMLSelectElement)?.value
                  const amount = parseInt((document.getElementById('amount-input') as HTMLInputElement)?.value || '300')
                  if (selectedApplication && facility) {
                    approveApplication(selectedApplication.id, amount, facility)
                  } else {
                    alert('Please select a facility')
                  }
                }}
                class="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700"
              >
                Approve & Assign
              </button>
            </div>
          </div>
        </div>
      </div>
    {/if}
  </main>
</div>
