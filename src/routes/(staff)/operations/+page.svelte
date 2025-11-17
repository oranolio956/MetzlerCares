<script lang="ts">
  import MetzlerBridgeLogo from '$lib/MetzlerBridgeLogo.svelte'
  import { goto } from '$app/navigation'
  import { supabase } from '$lib/utils/supabase'
  import { onMount } from 'svelte'
  import type { KPIMetrics, Application, FormError } from '$lib/types'
  import { LoadingSpinner, ErrorMessage } from '$lib'

  let kpis: KPIMetrics | null = null
  let applications: Application[] = []
  let filteredApplications: Application[] = []
  let selectedApplications: string[] = []
  let loading = true
  let error: FormError | null = null
  let bulkActionLoading = false
  let showFilters = false

  // Filter states
  let statusFilter = 'all'
  let dateRange = '30'
  let facilityFilter = 'all'
  let searchQuery = ''
  let facilities: any[] = []

  onMount(async () => {
    await Promise.all([loadKPIs(), loadApplications(), loadFacilities()])
  })

  async function loadKPIs() {
    try {
      const { data, error: kpiError } = await supabase.rpc('get_full_organization_kpis')
      if (kpiError) throw kpiError
      kpis = data
    } catch (err) {
      console.error('Error loading KPIs:', err)
      error = { message: 'Failed to load dashboard metrics' }
    }
  }

  async function loadApplications() {
    try {
      const { data, error: appsError } = await supabase
        .from('applications')
        .select(
          `
          *,
          beneficiaries:beneficiary_id (
            full_name,
            email,
            phone
          ),
          sober_living_partners (
            facility_name,
            address_city,
            address_state
          )
        `
        )
        .order('created_at', { ascending: false })
        .limit(200)

      if (appsError) throw appsError
      applications = data || []
      filteredApplications = [...applications]
    } catch (err) {
      console.error('Error loading applications:', err)
    }
  }

  async function loadFacilities() {
    try {
      const { data, error: facilitiesError } = await supabase.from('sober_living_partners').select('id, facility_name')

      if (facilitiesError) throw facilitiesError
      facilities = data || []
    } catch (err) {
      console.error('Error loading facilities:', err)
    }
  }

  function applyFilters() {
    filteredApplications = applications.filter(app => {
      // Status filter
      if (statusFilter !== 'all' && app.status !== statusFilter) return false

      // Facility filter
      if (facilityFilter !== 'all' && app.facility_id !== facilityFilter) return false

      // Date range filter
      if (dateRange !== 'all') {
        const days = parseInt(dateRange)
        const cutoffDate = new Date()
        cutoffDate.setDate(cutoffDate.getDate() - days)
        const appDate = new Date(app.created_at)
        if (appDate < cutoffDate) return false
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        const beneficiaryName = app.beneficiaries?.[0]?.full_name?.toLowerCase() || ''
        const beneficiaryEmail = app.beneficiaries?.[0]?.email?.toLowerCase() || ''
        const facilityName = app.sober_living_partners?.facility_name?.toLowerCase() || ''

        if (!beneficiaryName.includes(query) && !beneficiaryEmail.includes(query) && !facilityName.includes(query)) {
          return false
        }
      }

      return true
    })
  }

  $: if (applications.length > 0) applyFilters()

  async function executeBulkAction(action: string) {
    if (selectedApplications.length === 0) return

    bulkActionLoading = true
    try {
      const updates = selectedApplications.map(id => ({
        id,
        status: action,
        updated_at: new Date().toISOString()
      }))

      const { error: updateError } = await supabase.from('applications').upsert(updates)

      if (updateError) throw updateError

      // Reload applications
      await loadApplications()
      selectedApplications = []

      // Show success message
      alert(`Successfully ${action}d ${updates.length} application${updates.length > 1 ? 's' : ''}`)
    } catch (err) {
      console.error('Bulk action error:', err)
      alert('Failed to execute bulk action. Please try again.')
    } finally {
      bulkActionLoading = false
    }
  }

  function selectAllApplications() {
    if (selectedApplications.length === filteredApplications.length) {
      selectedApplications = []
    } else {
      selectedApplications = filteredApplications.map(app => app.id)
    }
  }

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  function formatPercent(rate: number) {
    return `${rate.toFixed(1)}%`
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
  <title>Operations Dashboard - Staff Portal</title>
  <meta name="description" content="Internal KPI dashboard for monitoring operational metrics and performance." />
</svelte:head>

<div class="min-h-screen bg-cream text-navy">
  <!-- Header -->
  <header class="bg-cream border-b border-navy border-opacity-10 sticky top-0 z-40">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div class="flex justify-between items-center">
        <button onclick={() => goto('/')} class="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <MetzlerBridgeLogo className="w-8 h-8 text-navy" />
          <span class="text-xl font-serif font-medium text-navy">Operations Dashboard</span>
        </button>

        <div class="flex items-center space-x-4">
          <span class="text-sm text-navy text-opacity-70">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
          <button onclick={() => Promise.all([loadKPIs(), loadApplications()])} class="btn-secondary text-sm">
            Refresh Data
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
          <LoadingSpinner size="lg" color="navy" />
          <span class="ml-3 text-navy">Loading operations dashboard...</span>
        </div>
      {:else if error}
        <ErrorMessage
          title="Dashboard Error"
          message={error.message}
          icon="exclamation"
          showRetry={true}
          onRetry={() => Promise.all([loadKPIs(), loadApplications()])}
        />
      {:else}
        <!-- Welcome Section -->
        <div class="mb-8">
          <h1 class="text-3xl font-serif font-medium text-navy mb-2">Operations Dashboard</h1>
          <p class="text-lg text-navy text-opacity-70">
            Monitor key metrics, manage applications, and oversee operations.
          </p>
        </div>

        <!-- Key Metrics Overview -->
        <section class="mb-8">
          <h2 class="text-2xl font-serif font-medium text-navy mb-6">Key Performance Indicators</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-navy text-opacity-70">Applications Pending</p>
                  <p class="text-3xl font-bold text-navy">{kpis?.applications_pending || 0}</p>
                  <p class="text-xs text-navy text-opacity-60 mt-1">Require attention</p>
                </div>
                <div class="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <svg class="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-navy text-opacity-70">Beneficiaries Housed</p>
                  <p class="text-3xl font-bold text-navy">{kpis?.beneficiaries_housed || 0}</p>
                  <p class="text-xs text-olive mt-1">Lives changed</p>
                </div>
                <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg class="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-navy text-opacity-70">90-Day Success Rate</p>
                  <p class="text-3xl font-bold text-navy">{formatPercent(kpis?.['90_day_success_rate'] || 0)}</p>
                  <p class="text-xs text-navy text-opacity-60 mt-1">Long-term outcomes</p>
                </div>
                <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg class="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

            <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-navy text-opacity-70">Net Balance (30d)</p>
                  <p class="text-3xl font-bold text-navy">{formatCurrency(kpis?.net_operational_balance || 0)}</p>
                  <p class="text-xs text-navy text-opacity-60 mt-1">Financial health</p>
                </div>
                <div class="w-12 h-12 bg-olive bg-opacity-20 rounded-full flex items-center justify-center">
                  <svg class="w-6 h-6 text-olive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

        <!-- Application Management -->
        <section class="mb-8">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-serif font-medium text-navy">Application Management</h2>
            <div class="flex items-center space-x-4">
              <button onclick={() => (showFilters = !showFilters)} class="btn-secondary text-sm">
                {showFilters ? 'Hide' : 'Show'} Filters
              </button>
            </div>
          </div>

          <!-- Filters Panel -->
          {#if showFilters}
            <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-6 mb-6">
              <h3 class="text-lg font-medium text-navy mb-4">Filter Applications</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label for="statusFilter" class="block text-sm font-medium text-navy text-opacity-70 mb-1"
                    >Status</label
                  >
                  <select
                    id="statusFilter"
                    bind:value={statusFilter}
                    class="w-full px-3 py-2 border border-navy border-opacity-20 rounded-md focus:outline-none focus:ring-2 focus:ring-olive focus:border-transparent"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="funded">Funded</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label for="facilityFilter" class="block text-sm font-medium text-navy text-opacity-70 mb-1"
                    >Facility</label
                  >
                  <select
                    id="facilityFilter"
                    bind:value={facilityFilter}
                    class="w-full px-3 py-2 border border-navy border-opacity-20 rounded-md focus:outline-none focus:ring-2 focus:ring-olive focus:border-transparent"
                  >
                    <option value="all">All Facilities</option>
                    {#each facilities as facility}
                      <option value={facility.id}>{facility.facility_name}</option>
                    {/each}
                  </select>
                </div>

                <div>
                  <label for="dateRange" class="block text-sm font-medium text-navy text-opacity-70 mb-1"
                    >Date Range</label
                  >
                  <select
                    id="dateRange"
                    bind:value={dateRange}
                    class="w-full px-3 py-2 border border-navy border-opacity-20 rounded-md focus:outline-none focus:ring-2 focus:ring-olive focus:border-transparent"
                  >
                    <option value="all">All Time</option>
                    <option value="7">Last 7 days</option>
                    <option value="30">Last 30 days</option>
                    <option value="90">Last 90 days</option>
                  </select>
                </div>

                <div>
                  <label for="searchQuery" class="block text-sm font-medium text-navy text-opacity-70 mb-1"
                    >Search</label
                  >
                  <input
                    id="searchQuery"
                    type="text"
                    bind:value={searchQuery}
                    placeholder="Name, email, or facility..."
                    class="w-full px-3 py-2 border border-navy border-opacity-20 rounded-md focus:outline-none focus:ring-2 focus:ring-olive focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          {/if}

          <!-- Bulk Actions -->
          {#if selectedApplications.length > 0}
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                  <span class="text-sm font-medium text-blue-800">
                    {selectedApplications.length} application{selectedApplications.length > 1 ? 's' : ''} selected
                  </span>
                  <button onclick={selectAllApplications} class="text-xs text-blue-600 hover:text-blue-800 underline">
                    {selectedApplications.length === filteredApplications.length ? 'Deselect all' : 'Select all'}
                  </button>
                </div>

                <div class="flex items-center space-x-3">
                  <button
                    onclick={() => executeBulkAction('approved')}
                    disabled={bulkActionLoading}
                    class="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    {bulkActionLoading ? 'Processing...' : 'Approve Selected'}
                  </button>
                  <button
                    onclick={() => executeBulkAction('rejected')}
                    disabled={bulkActionLoading}
                    class="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:opacity-50"
                  >
                    {bulkActionLoading ? 'Processing...' : 'Reject Selected'}
                  </button>
                </div>
              </div>
            </div>
          {/if}

          <!-- Applications Table -->
          <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 overflow-hidden">
            {#if filteredApplications.length === 0}
              <div class="p-8 text-center text-navy text-opacity-60">
                {#if applications.length === 0}
                  No applications found.
                {:else}
                  No applications match your current filters.
                {/if}
              </div>
            {:else}
              <div class="overflow-x-auto">
                <table class="w-full">
                  <thead class="bg-navy bg-opacity-5">
                    <tr>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-navy text-opacity-70 uppercase tracking-wider"
                      >
                        <input
                          type="checkbox"
                          checked={selectedApplications.length === filteredApplications.length &&
                            filteredApplications.length > 0}
                          onchange={selectAllApplications}
                          class="rounded border-navy border-opacity-20"
                        />
                      </th>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-navy text-opacity-70 uppercase tracking-wider"
                        >Applicant</th
                      >
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-navy text-opacity-70 uppercase tracking-wider"
                        >Facility</th
                      >
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-navy text-opacity-70 uppercase tracking-wider"
                        >Amount</th
                      >
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-navy text-opacity-70 uppercase tracking-wider"
                        >Status</th
                      >
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-navy text-opacity-70 uppercase tracking-wider"
                        >Date</th
                      >
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-navy text-opacity-70 uppercase tracking-wider"
                        >Actions</th
                      >
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-navy divide-opacity-10">
                    {#each filteredApplications as application}
                      <tr class="hover:bg-cream hover:bg-opacity-50">
                        <td class="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedApplications.includes(application.id)}
                            onchange={e => {
                              const target = e.target as HTMLInputElement
                              if (target.checked) {
                                selectedApplications = [...selectedApplications, application.id]
                              } else {
                                selectedApplications = selectedApplications.filter(id => id !== application.id)
                              }
                            }}
                            class="rounded border-navy border-opacity-20"
                          />
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="text-sm font-medium text-navy">
                            {application.beneficiaries?.[0]?.full_name || 'Unknown'}
                          </div>
                          <div class="text-sm text-navy text-opacity-60">
                            {application.beneficiaries?.[0]?.email || ''}
                          </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-navy">
                          {application.sober_living_partners?.facility_name || 'Not assigned'}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-navy">
                          {formatCurrency(application.amount_requested || 0)}
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
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-navy text-opacity-70">
                          {new Date(application.created_at).toLocaleDateString()}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <a
                            href="/staff/application/{application.id}"
                            class="text-olive hover:text-navy transition-colors"
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

          <div class="mt-4 text-sm text-navy text-opacity-60">
            Showing {filteredApplications.length} of {applications.length} applications
          </div>
        </section>

        <!-- System Health & Notifications -->
        <section class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- System Status -->
          <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-6">
            <h2 class="text-xl font-medium text-navy mb-6">System Health</h2>

            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span class="text-sm text-navy">Database</span>
                </div>
                <span class="text-sm text-green-600">Online</span>
              </div>

              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span class="text-sm text-navy">Payment Processing</span>
                </div>
                <span class="text-sm text-green-600">Active</span>
              </div>

              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span class="text-sm text-navy">Email Notifications</span>
                </div>
                <span class="text-sm text-green-600">Working</span>
              </div>

              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span class="text-sm text-navy">External APIs</span>
                </div>
                <span class="text-sm text-yellow-600">Partial</span>
              </div>
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-6">
            <h2 class="text-xl font-medium text-navy mb-6">Recent Activity</h2>

            <div class="space-y-4">
              <div class="flex items-start space-x-3">
                <div class="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div class="flex-1">
                  <p class="text-sm text-navy">
                    <span class="font-medium">New application</span> submitted for Sarah Johnson
                  </p>
                  <p class="text-xs text-navy text-opacity-60">2 minutes ago</p>
                </div>
              </div>

              <div class="flex items-start space-x-3">
                <div class="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div class="flex-1">
                  <p class="text-sm text-navy">
                    <span class="font-medium">Payment processed</span> for Michael Chen - $300
                  </p>
                  <p class="text-xs text-navy text-opacity-60">15 minutes ago</p>
                </div>
              </div>

              <div class="flex items-start space-x-3">
                <div class="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div class="flex-1">
                  <p class="text-sm text-navy">
                    <span class="font-medium">Application review</span> needed for David Wilson
                  </p>
                  <p class="text-xs text-navy text-opacity-60">1 hour ago</p>
                </div>
              </div>

              <div class="flex items-start space-x-3">
                <div class="w-2 h-2 bg-olive rounded-full mt-2"></div>
                <div class="flex-1">
                  <p class="text-sm text-navy">
                    <span class="font-medium">Donation received</span> from recurring donor - $100
                  </p>
                  <p class="text-xs text-navy text-opacity-60">2 hours ago</p>
                </div>
              </div>
            </div>

            <div class="mt-6 pt-6 border-t border-navy border-opacity-10">
              <a href="/staff/audit-log" class="text-olive hover:text-navy text-sm font-medium">
                View full activity log →
              </a>
            </div>
          </div>
        </section>
      {/if}
    </div>
  </main>
</div>
