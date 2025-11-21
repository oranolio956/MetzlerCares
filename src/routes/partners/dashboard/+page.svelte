<script lang="ts">
  import MetzlerBridgeLogo from '$lib/MetzlerBridgeLogo.svelte'
  import { goto } from '$app/navigation'
  import { supabase } from '$lib/utils/supabase'
  import { onMount } from 'svelte'
  import type { PageData } from './$types'
  import { LoadingSpinner, ErrorMessage } from '$lib'

  export let data: PageData

  let facilities: any[] = []
  let applications: any[] = []
  let occupancyStats = {
    totalBeds: 0,
    occupiedBeds: 0,
    availableBeds: 0,
    utilizationRate: 0
  }
  let recentPayments: any[] = []
  let loading = true
  let error: string | null = null

  onMount(async () => {
    await loadDashboardData()
  })

  async function loadDashboardData() {
    try {
      loading = true
      error = null

      // Load facilities for this partner
      const { data: facilitiesData, error: facilitiesError } = await supabase
        .from('sober_living_partners')
        .select('*')
        .eq('partner_id', data.user.partnerId)

      if (facilitiesError) throw facilitiesError
      facilities = facilitiesData || []

      // Calculate occupancy stats
      const allBeds = facilities.reduce((sum, facility) => sum + (facility.capacity || 0), 0)
      // In a real app, we'd track current occupancy from applications
      const occupiedBeds = applications.filter(app => app.status === 'funded' || app.status === 'approved').length

      occupancyStats = {
        totalBeds: allBeds,
        occupiedBeds,
        availableBeds: Math.max(0, allBeds - occupiedBeds),
        utilizationRate: allBeds > 0 ? Math.round((occupiedBeds / allBeds) * 100) : 0
      }

      // Load recent applications for partner's facilities
      const facilityIds = facilities.map(f => f.id)
      if (facilityIds.length > 0) {
        const { data: applicationsData, error: applicationsError } = await supabase
          .from('applications')
          .select(
            `
            *,
            beneficiaries:beneficiary_id (
              full_name,
              email
            )
          `
          )
          .in('facility_id', facilityIds)
          .order('created_at', { ascending: false })
          .limit(10)

        if (applicationsError) throw applicationsError
        applications = applicationsData || []
      }

      // Load recent payments (scholarships paid to facilities)
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('scholarship_payments')
        .select('*')
        .in('facility_id', facilityIds)
        .order('created_at', { ascending: false })
        .limit(5)

      if (paymentsError) {
        console.warn('Could not load payment data:', paymentsError)
        recentPayments = []
      } else {
        recentPayments = paymentsData || []
      }
    } catch (err) {
      console.error('Dashboard loading error:', err)
      error = 'Failed to load dashboard data'
    } finally {
      loading = false
    }
  }

  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  function getStatusColor(status: string): string {
    switch (status) {
      case 'funded':
        return 'bg-green-100 text-green-800'
      case 'approved':
        return 'bg-blue-100 text-blue-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }
</script>

<svelte:head>
  <title>Partner Dashboard - Metzler Foundations</title>
  <meta
    name="description"
    content="Manage your sober living facilities, track applications, and monitor occupancy through your partner dashboard."
  />
</svelte:head>

<div class="min-h-screen bg-white text-charcoal">
  <!-- Header -->
  <header class="bg-white border-b border-gray-200 sticky top-0 z-40">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div class="flex justify-between items-center">
        <button on:click={() => goto('/')} class="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <MetzlerBridgeLogo className="w-8 h-8 text-forest-green" />
          <span class="text-xl font-bold text-charcoal">Partner Portal</span>
        </button>

        <nav class="hidden md:flex items-center space-x-6">
          <a href="/partners/facilities" class="text-charcoal hover:text-forest-green transition-colors duration-200 font-medium">
            Facilities
          </a>
          <a
            href="/partners/applications"
            class="text-charcoal hover:text-forest-green transition-colors duration-200 font-medium"
          >
            Applications
          </a>
          <a href="/partners/reports" class="text-charcoal hover:text-forest-green transition-colors duration-200 font-medium">
            Reports
          </a>
        </nav>

        <div class="flex items-center space-x-4">
          <span class="text-sm text-gray-600">
            Welcome, {data.user.name}
          </span>
          <button on:click={() => supabase.auth.signOut().then(() => goto('/'))} class="btn-secondary text-sm">
            Sign Out
          </button>
        </div>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      {#if loading}
        <div class="flex justify-center items-center py-16">
          <LoadingSpinner size="lg" color="forest-green" />
          <span class="ml-3 text-gray-600">Loading dashboard...</span>
        </div>
      {:else if error}
        <ErrorMessage
          title="Dashboard Error"
          message={error}
          icon="exclamation"
          showRetry={true}
          onRetry={loadDashboardData}
        />
      {:else}
        <!-- Welcome Section -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-charcoal mb-2">Partner Dashboard</h1>
          <p class="text-lg text-gray-600">Manage your facilities and track resident support programs.</p>
        </div>

        <!-- Key Metrics -->
        <section class="mb-8">
          <h2 class="text-2xl font-bold text-charcoal mb-6">Overview</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <!-- Facilities -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-600">Active Facilities</p>
                  <p class="text-3xl font-bold text-charcoal">{facilities.length}</p>
                </div>
                <div class="w-12 h-12 bg-forest-green bg-opacity-20 rounded-full flex items-center justify-center">
                  <svg class="w-6 h-6 text-forest-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <!-- Total Capacity -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-600">Total Capacity</p>
                  <p class="text-3xl font-bold text-charcoal">{occupancyStats.totalBeds}</p>
                </div>
                <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg class="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <!-- Occupancy Rate -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-600">Occupancy Rate</p>
                  <p class="text-3xl font-bold text-charcoal">{occupancyStats.utilizationRate}%</p>
                  <p class="text-xs text-gray-500 mt-1">
                    {occupancyStats.occupiedBeds} of {occupancyStats.totalBeds} beds
                  </p>
                </div>
                <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg class="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <!-- Recent Payments -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-600">Scholarships This Month</p>
                  <p class="text-3xl font-bold text-charcoal">{recentPayments.length}</p>
                  <p class="text-xs text-gray-500 mt-1">
                    {formatCurrency(recentPayments.reduce((sum, payment) => sum + (payment.amount || 0), 0))}
                  </p>
                </div>
                <div class="w-12 h-12 bg-forest-green bg-opacity-20 rounded-full flex items-center justify-center">
                  <svg class="w-6 h-6 text-forest-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Facilities Overview -->
        <section class="mb-8">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-charcoal">Your Facilities</h2>
            <a href="/partners/facilities" class="btn-secondary">Manage Facilities</a>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {#each facilities as facility}
              <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div class="flex items-start justify-between mb-4">
                  <div>
                    <h3 class="font-semibold text-charcoal mb-1">{facility.facility_name}</h3>
                    <p class="text-sm text-gray-500">
                      {facility.address_city}, {facility.address_state}
                    </p>
                  </div>
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    {facility.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}"
                  >
                    {facility.verified ? 'Verified' : 'Pending'}
                  </span>
                </div>

                <div class="space-y-3">
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Capacity:</span>
                    <span class="font-medium">{facility.capacity || 0} beds</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Status:</span>
                    <span class="font-medium text-green-600">Active</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Last Updated:</span>
                    <span class="font-medium"
                      >{new Date(facility.updated_at || facility.created_at).toLocaleDateString()}</span
                    >
                  </div>
                </div>

                <div class="mt-4 pt-4 border-t border-gray-200">
                  <a href="/partners/facility/{facility.id}" class="text-forest-green hover:text-charcoal text-sm font-medium">
                    View Details →
                  </a>
                </div>
              </div>
            {/each}

            {#if facilities.length === 0}
              <div
                class="col-span-full bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center"
              >
                <svg
                  class="w-12 h-12 text-gray-400 mx-auto mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                <h3 class="text-lg font-medium text-charcoal mb-2">No Facilities Yet</h3>
                <p class="text-gray-600 mb-4">
                  Add your first facility to start receiving scholarship applications.
                </p>
                <a href="/partners/facilities/new" class="btn-primary">Add Facility</a>
              </div>
            {/if}
          </div>
        </section>

        <!-- Recent Applications -->
        <section class="mb-8">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-charcoal">Recent Applications</h2>
            <a href="/partners/applications" class="btn-secondary">View All</a>
          </div>

          <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {#if applications.length === 0}
              <div class="p-8 text-center text-gray-500">No applications received yet.</div>
            {:else}
              <div class="overflow-x-auto">
                <table class="w-full">
                  <thead class="bg-gray-100">
                    <tr>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-charcoal uppercase tracking-wider"
                        >Applicant</th
                      >
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-charcoal uppercase tracking-wider"
                        >Facility</th
                      >
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-charcoal uppercase tracking-wider"
                        >Status</th
                      >
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-charcoal uppercase tracking-wider"
                        >Date</th
                      >
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-charcoal uppercase tracking-wider"
                        >Actions</th
                      >
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200">
                    {#each applications as application}
                      <tr class="hover:bg-gray-50">
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="text-sm font-medium text-charcoal">
                            {application.beneficiaries?.[0]?.full_name || 'Unknown'}
                          </div>
                          <div class="text-sm text-gray-500">
                            {application.beneficiaries?.[0]?.email || ''}
                          </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-charcoal">
                          {facilities.find(f => f.id === application.facility_id)?.facility_name || 'Unknown'}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span
                            class="inline-flex px-2 py-1 text-xs font-semibold rounded-full {getStatusColor(
                              application.status
                            )}"
                          >
                            {application.status}
                          </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {new Date(application.created_at).toLocaleDateString()}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <a
                            href="/partners/application/{application.id}"
                            class="text-forest-green hover:text-charcoal transition-colors"
                          >
                            Review
                          </a>
                        </td>
                      </tr>
                    {/each}
                  </tbody>
                </table>
              </div>
            {/if}
          </div>
        </section>

        <!-- Recent Payments -->
        {#if recentPayments.length > 0}
          <section>
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-2xl font-bold text-charcoal">Recent Scholarship Payments</h2>
              <a href="/partners/payments" class="btn-secondary">View All Payments</a>
            </div>

            <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div class="overflow-x-auto">
                <table class="w-full">
                  <thead class="bg-gray-100">
                    <tr>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-charcoal uppercase tracking-wider"
                        >Amount</th
                      >
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-charcoal uppercase tracking-wider"
                        >Facility</th
                      >
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-charcoal uppercase tracking-wider"
                        >Date</th
                      >
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-charcoal uppercase tracking-wider"
                        >Status</th
                      >
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200">
                    {#each recentPayments as payment}
                      <tr class="hover:bg-gray-50">
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-charcoal">
                          {formatCurrency(payment.amount)}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-charcoal">
                          {facilities.find(f => f.id === payment.facility_id)?.facility_name || 'Unknown'}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {new Date(payment.created_at).toLocaleDateString()}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span
                            class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800"
                          >
                            Paid
                          </span>
                        </td>
                      </tr>
                    {/each}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        {/if}
      {/if}
    </div>
  </main>
</div>
