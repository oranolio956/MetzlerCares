<script lang="ts">
  import MetzlerBridgeLogo from '$lib/MetzlerBridgeLogo.svelte'
  import { goto } from '$app/navigation'
  import { onMount } from 'svelte'
  import { supabase } from '$lib/utils/supabase'
  import { page } from '$app/stores'
  import type { PageData } from './$types'
  import type { ImpactMetrics, FormError } from '$lib/types'
  import { LoadingSpinner, ErrorMessage } from '$lib'

  export let data: PageData

  let donorMetrics = {
    totalGiving: 0,
    firstGiftDate: null as string | null,
    individualsHoused: 0,
    givingFrequency: 'one-time' as string,
    lastGiftDate: null as string | null,
    monthlyCommitment: 0,
    nextGiftDate: null as string | null
  }

  let donationHistory: any[] = []
  let loadingHistory = false

  let impactStories: any[] = []
  let loading = true
  let error: FormError | null = null

  // Calculate cost per scholarship (this should be configurable)
  const COST_PER_SCHOLARSHIP = 300 // $300 average cost

  // Recurring donations management
  let recurringDonations: any[] = []
  let showRecurringModal = false
  let showTaxReceiptsModal = false
  let showImpactReportsModal = false
  let selectedRecurring: any = null
  let editingRecurring = false
  let recurringForm = {
    amount: '',
    frequency: 'monthly',
    next_date: ''
  }
  let savingRecurring = false
  let taxReceipts: any[] = []
  let impactReports: any[] = []

  onMount(async () => {
    await Promise.all([
      loadDonorMetrics(),
      loadDonationHistory(),
      loadImpactStories(),
      loadRecurringDonations(),
      loadTaxReceipts(),
      loadImpactReports()
    ])
  })

  async function loadDonorMetrics() {
    try {
      // Load donor giving data from Bloomerang FDW
      const { data: donorData, error: donorError } = await supabase
        .from('bloomerang_constituents')
        .select('*')
        .eq('email', data.user.email)
        .single()

      if (donorError && donorError.code !== 'PGRST116') {
        // PGRST116 is "not found"
        console.error('Error loading donor data:', donorError)
        // For demo purposes, use mock data if FDW not available
        donorMetrics = {
          totalGiving: 2500,
          firstGiftDate: '2024-01-15',
          individualsHoused: Math.floor(2500 / COST_PER_SCHOLARSHIP),
          givingFrequency: 'monthly',
          lastGiftDate: '2024-11-01',
          monthlyCommitment: 100,
          nextGiftDate: '2024-12-01'
        }
      } else if (donorData) {
        donorMetrics = {
          totalGiving: donorData.total_giving || 0,
          firstGiftDate: donorData.created_at,
          individualsHoused: Math.floor((donorData.total_giving || 0) / COST_PER_SCHOLARSHIP),
          givingFrequency: donorData.segment_name?.includes('Monthly')
            ? 'monthly'
            : donorData.segment_name?.includes('Recurring')
            ? 'recurring'
            : 'one-time',
          lastGiftDate: donorData.last_gift_date,
          monthlyCommitment: donorData.monthly_giving || 0,
          nextGiftDate: donorData.next_gift_date
        }
      } else {
        // Mock data for development
        donorMetrics = {
          totalGiving: 1200,
          firstGiftDate: '2024-03-10',
          individualsHoused: Math.floor(1200 / COST_PER_SCHOLARSHIP),
          givingFrequency: 'quarterly',
          lastGiftDate: '2024-10-15',
          monthlyCommitment: 0,
          nextGiftDate: null
        }
      }
    } catch (err) {
      console.error('Error loading donor metrics:', err)
      error = { message: 'Failed to load your impact data' }
    }
  }

  async function loadDonationHistory() {
    try {
      loadingHistory = true

      // Load donation history from Bloomerang FDW or Supabase
      const { data: historyData, error: historyError } = await supabase
        .from('bloomerang_donations')
        .select('*')
        .eq('constituent_email', data.user.email)
        .order('gift_date', { ascending: false })
        .limit(10)

      if (historyError && historyError.code !== 'PGRST116') {
        console.error('Error loading donation history:', historyError)
        // Mock donation history for development
        donationHistory = [
          {
            id: '1',
            amount: 300,
            gift_date: '2024-11-01',
            designation: 'Housing Scholarship',
            payment_method: 'Credit Card',
            recurring: false
          },
          {
            id: '2',
            amount: 100,
            gift_date: '2024-10-01',
            designation: 'General Fund',
            payment_method: 'Credit Card',
            recurring: true,
            recurring_period: 'month'
          }
        ]
      } else {
        donationHistory = (historyData || []).map(donation => ({
          id: donation.id,
          amount: donation.amount || 0,
          gift_date: donation.gift_date,
          designation: donation.designation || 'Housing Support',
          payment_method: donation.payment_method || 'Credit Card',
          recurring: donation.recurring || false,
          recurring_period: donation.recurring_period
        }))
      }
    } catch (err) {
      console.error('Error loading donation history:', err)
    } finally {
      loadingHistory = false
    }
  }

  async function loadImpactStories() {
    try {
      // Load impact stories from Supabase
      const { data: stories, error: storiesError } = await supabase
        .from('impact_stories')
        .select('*')
        .eq('published', true)
        .eq('is_featured', true)
        .limit(1)

      if (storiesError) {
        console.error('Error loading impact stories:', storiesError)
        // Mock impact story for development
        impactStories = [
          {
            title: "Maria's Journey to Recovery",
            story:
              "Maria was homeless and struggling with addiction when she received a Metzler Foundations scholarship. Three months later, she's in stable housing and rebuilding her life.",
            photo_url: '/api/placeholder/400/300',
            location: 'Denver, CO'
          }
        ]
      } else {
        impactStories = stories || []
      }
    } catch (err) {
      console.error('Error loading impact stories:', err)
    } finally {
      loading = false
    }
  }

  async function loadRecurringDonations() {
    try {
      const { data: donations, error } = await supabase
        .from('recurring_donations')
        .select('*')
        .eq('donor_id', data.user.id)
        .eq('active', true)

      if (error) throw error
      recurringDonations = donations || []
    } catch (err) {
      console.error('Error loading recurring donations:', err)
    }
  }

  async function loadTaxReceipts() {
    try {
      const { data: receipts, error } = await supabase
        .from('tax_receipts')
        .select('*')
        .eq('donor_id', data.user.id)
        .order('tax_year', { ascending: false })

      if (error) throw error
      taxReceipts = receipts || []
    } catch (err) {
      console.error('Error loading tax receipts:', err)
    }
  }

  async function loadImpactReports() {
    try {
      const { data, error } = await supabase
        .from('impact_reports')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(5)

      if (error) throw error
      impactReports = data || []
    } catch (err) {
      console.error('Error loading impact reports:', err)
    }
  }

  async function saveRecurringDonation(event: Event) {
    event.preventDefault()
    if (savingRecurring) return

    savingRecurring = true
    try {
      const donationData = {
        donor_id: data.user.id,
        amount: parseFloat(recurringForm.amount),
        frequency: recurringForm.frequency,
        next_date: recurringForm.next_date,
        active: true,
        created_at: new Date().toISOString()
      }

      if (editingRecurring && selectedRecurring) {
        const { error } = await supabase.from('recurring_donations').update(donationData).eq('id', selectedRecurring.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from('recurring_donations').insert(donationData)

        if (error) throw error
      }

      await loadRecurringDonations()
      showRecurringModal = false
      editingRecurring = false
      selectedRecurring = null
      recurringForm = { amount: '', frequency: 'monthly', next_date: '' }

      alert(`${editingRecurring ? 'Updated' : 'Created'} recurring donation successfully!`)
    } catch (err) {
      console.error('Error saving recurring donation:', err)
      alert('Failed to save recurring donation. Please try again.')
    } finally {
      savingRecurring = false
    }
  }

  async function cancelRecurringDonation(id: string) {
    if (!confirm('Are you sure you want to cancel this recurring donation?')) return

    try {
      const { error } = await supabase
        .from('recurring_donations')
        .update({ active: false, cancelled_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error

      await loadRecurringDonations()
      alert('Recurring donation cancelled successfully.')
    } catch (err) {
      console.error('Error cancelling recurring donation:', err)
      alert('Failed to cancel recurring donation. Please try again.')
    }
  }

  function editRecurringDonation(donation: any) {
    selectedRecurring = donation
    editingRecurring = true
    recurringForm = {
      amount: donation.amount.toString(),
      frequency: donation.frequency,
      next_date: donation.next_date
    }
    showRecurringModal = true
  }

  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
</script>

<svelte:head>
  <title>My Impact - Metzler Foundations</title>
  <meta name="description" content="See the real impact your donations are making in Colorado communities." />
</svelte:head>

<div class="min-h-screen bg-cream text-charcoal">
  <!-- Header -->
  <header class="bg-cream border-b border-charcoal border-opacity-10 sticky top-0 z-40">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div class="flex justify-between items-center">
        <button on:click={() => goto('/')} class="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <MetzlerBridgeLogo className="w-8 h-8 text-forest-green" />
          <span class="text-xl font-semibold text-forest-green">Donor Portal</span>
        </button>

        <div class="flex items-center space-x-4">
          <!-- Quick Actions -->
          <div class="hidden md:flex items-center space-x-4">
            <!-- Recurring Donations Button -->
            <button
              on:click={() => {
                editingRecurring = false
                selectedRecurring = null
                recurringForm = { amount: '', frequency: 'monthly', next_date: '' }
                showRecurringModal = true
              }}
              class="p-2 text-charcoal hover:text-forest-green transition-colors"
              title="Manage Recurring Donations"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>

            <!-- Tax Receipts Button -->
            <button
              on:click={() => (showTaxReceiptsModal = true)}
              class="p-2 text-charcoal hover:text-forest-green transition-colors"
              title="Tax Receipts & Documents"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </button>

            <!-- Impact Reports Button -->
            <button
              on:click={() => (showImpactReportsModal = true)}
              class="p-2 text-charcoal hover:text-forest-green transition-colors"
              title="Impact Reports"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </button>
          </div>

          <!-- Mobile Menu Button -->
          <div class="md:hidden">
            <button
              on:click={() => (showRecurringModal = true)}
              class="p-2 text-charcoal hover:text-forest-green transition-colors"
              aria-label="Open recurring donations menu"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          <span class="text-sm text-navy text-opacity-70">Welcome back, {data.user.email}!</span>
          <button on:click={() => supabase.auth.signOut().then(() => goto('/'))} class="btn-secondary text-sm">
            Sign Out
          </button>
        </div>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    {#if loading}
      <div class="flex justify-center items-center py-16">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-navy" />
        <span class="ml-3 text-navy">Loading your impact data...</span>
      </div>
    {:else if error}
      <div class="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 class="text-lg font-medium text-red-800 mb-2">Error Loading Data</h3>
        <p class="text-red-700">{error}</p>
      </div>
    {:else}
      <!-- Hero Impact Section -->
      <div class="bg-gradient-to-r from-navy to-olive rounded-2xl p-8 mb-12 text-cream">
        <div class="text-center">
          <h2 class="text-4xl font-serif font-medium mb-4">Your Support Has Housed</h2>
          <div class="text-7xl font-bold text-gold mb-4 font-mono">
            {donorMetrics.individualsHoused}
          </div>
          <p class="text-xl text-cream text-opacity-90 mb-6">
            Individual{donorMetrics.individualsHoused === 1 ? '' : 's'} in Colorado
          </p>
          <p class="text-lg text-cream text-opacity-80">
            Based on {formatCurrency(donorMetrics.totalGiving)} in total support
          </p>
        </div>
      </div>

      <!-- Detailed Metrics -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <!-- Monthly Commitment -->
        <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-8 w-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-navy text-opacity-70">Monthly Commitment</p>
              <p class="text-lg font-semibold text-navy">{formatCurrency(donorMetrics.monthlyCommitment)}</p>
            </div>
          </div>
        </div>

        <!-- Next Gift Date -->
        <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-8 w-8 text-olive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-navy text-opacity-70">Next Gift</p>
              <p class="text-lg font-semibold text-navy">
                {donorMetrics.nextGiftDate ? formatDate(donorMetrics.nextGiftDate) : 'No recurring gift'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Donation History -->
      <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-8 mb-12">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-2xl font-serif font-medium text-navy">Your Giving History</h3>
          <a href="/donate" class="btn-primary text-sm px-4 py-2"> Make Another Gift </a>
        </div>

        {#if loadingHistory}
          <div class="flex justify-center items-center py-8">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-navy" />
            <span class="ml-3 text-navy">Loading donation history...</span>
          </div>
        {:else if donationHistory.length === 0}
          <div class="text-center py-8">
            <svg
              class="mx-auto h-12 w-12 text-navy text-opacity-40 mb-4"
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
            <h4 class="text-lg font-medium text-navy mb-2">No donations yet</h4>
            <p class="text-navy text-opacity-60 mb-4">
              Your donation history will appear here once you've made your first gift.
            </p>
            <a href="/donate" class="btn-primary">Make Your First Donation</a>
          </div>
        {:else}
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-navy divide-opacity-10">
              <thead class="bg-navy bg-opacity-5">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-navy uppercase tracking-wider">Date</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-navy uppercase tracking-wider">Amount</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-navy uppercase tracking-wider">Purpose</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-navy uppercase tracking-wider">Type</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-navy uppercase tracking-wider">Method</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-navy divide-opacity-10">
                {#each donationHistory as donation}
                  <tr class="hover:bg-navy hover:bg-opacity-5 transition-colors">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-navy">
                      {formatDate(donation.gift_date)}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-navy">
                      {formatCurrency(donation.amount)}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-navy text-opacity-80">
                      {donation.designation}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span
                        class={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          donation.recurring ? 'bg-gold bg-opacity-20 text-gold' : 'bg-olive bg-opacity-20 text-olive'
                        }`}
                      >
                        {donation.recurring ? 'Monthly' : 'One-time'}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-navy text-opacity-80">
                      {donation.payment_method}
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        {/if}
      </div>

      <!-- Impact Story -->
      {#if impactStories.length > 0}
        <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-8 mb-12">
          <h3 class="text-2xl font-serif font-medium text-navy mb-6 text-center">A Life Your Support Made Possible</h3>

          {#each impactStories as story}
            <div class="flex flex-col md:flex-row gap-8 items-center">
              <div class="flex-1">
                <h4 class="text-xl font-semibold text-navy mb-4">{story.title}</h4>
                <p class="text-navy text-opacity-80 mb-4 leading-relaxed">
                  {story.story}
                </p>
                {#if story.location}
                  <p class="text-sm text-navy text-opacity-60">
                    <svg class="inline h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {story.location}
                  </p>
                {/if}
              </div>
              {#if story.photo_url}
                <div class="flex-shrink-0">
                  <img
                    src={story.photo_url}
                    alt={story.title}
                    class="w-64 h-48 object-cover rounded-lg shadow-sm"
                    loading="lazy"
                  />
                </div>
              {/if}
            </div>
          {/each}
        </div>
      {/if}

      <!-- Call to Action -->
      <div class="bg-navy rounded-lg p-8 text-center text-cream">
        <h3 class="text-2xl font-serif font-medium mb-4">Ready to Make Even More Impact?</h3>
        <p class="text-cream text-opacity-80 mb-6 max-w-2xl mx-auto">
          Every dollar you give directly supports someone in recovery. Your generosity creates lasting change in
          Colorado communities.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/give-support" class="btn-primary"> Make Another Gift </a>
          <a
            href="/impact"
            class="px-6 py-3 bg-cream bg-opacity-10 text-cream border border-cream border-opacity-30 rounded-md hover:bg-opacity-20 transition-colors"
          >
            See Public Impact
          </a>
        </div>
      </div>
    {/if}

    <!-- Modals -->
    <!-- Recurring Donations Modal -->
    {#if showRecurringModal}
      <div
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        role="dialog"
        aria-modal="true"
      >
        <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-xl font-serif font-medium text-navy">
                {editingRecurring ? 'Edit Recurring Donation' : 'Manage Recurring Donations'}
              </h2>
              <button
                on:click={() => (showRecurringModal = false)}
                class="text-navy text-opacity-60 hover:text-navy"
                aria-label="Close recurring donations modal"
              >
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {#if editingRecurring}
              <!-- Edit Recurring Donation Form -->
              <form on:submit={saveRecurringDonation} class="space-y-4">
                <div>
                  <label for="recurring_amount" class="block text-sm font-medium text-navy text-opacity-70"
                    >Amount</label
                  >
                  <input
                    id="recurring_amount"
                    type="number"
                    bind:value={recurringForm.amount}
                    min="1"
                    step="0.01"
                    class="mt-1 w-full px-3 py-2 border border-navy border-opacity-20 rounded-md focus:outline-none focus:ring-2 focus:ring-olive focus:border-transparent"
                    placeholder="25.00"
                    required
                  />
                </div>

                <div>
                  <label for="recurring_frequency" class="block text-sm font-medium text-navy text-opacity-70"
                    >Frequency</label
                  >
                  <select
                    id="recurring_frequency"
                    bind:value={recurringForm.frequency}
                    class="mt-1 w-full px-3 py-2 border border-navy border-opacity-20 rounded-md focus:outline-none focus:ring-2 focus:ring-olive focus:border-transparent"
                    required
                  >
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="annually">Annually</option>
                  </select>
                </div>

                <div>
                  <label for="recurring_next_date" class="block text-sm font-medium text-navy text-opacity-70"
                    >Next Gift Date</label
                  >
                  <input
                    id="recurring_next_date"
                    type="date"
                    bind:value={recurringForm.next_date}
                    class="mt-1 w-full px-3 py-2 border border-navy border-opacity-20 rounded-md focus:outline-none focus:ring-2 focus:ring-olive focus:border-transparent"
                    required
                  />
                </div>

                <div class="flex space-x-3 pt-4">
                  <button
                    on:click={() => {
                      editingRecurring = false
                      selectedRecurring = null
                    }}
                    class="btn-secondary flex-1"
                    type="button"
                  >
                    Cancel
                  </button>
                  <button type="submit" disabled={savingRecurring} class="btn-primary flex-1">
                    {savingRecurring ? 'Updating...' : 'Update Donation'}
                  </button>
                </div>
              </form>
            {:else}
              <!-- Manage Recurring Donations -->
              <div class="space-y-6">
                <!-- Existing Recurring Donations -->
                {#if recurringDonations.length > 0}
                  <div>
                    <h3 class="text-lg font-medium text-navy mb-4">Your Active Recurring Donations</h3>
                    <div class="space-y-3">
                      {#each recurringDonations as donation}
                        <div
                          class="flex items-center justify-between p-4 bg-cream bg-opacity-50 rounded-lg border border-navy border-opacity-10"
                        >
                          <div>
                            <p class="font-medium text-navy">{formatCurrency(donation.amount)} {donation.frequency}</p>
                            <p class="text-sm text-navy text-opacity-70">
                              Next: {new Date(donation.next_date).toLocaleDateString()}
                            </p>
                          </div>
                          <div class="flex space-x-2">
                            <button
                              on:click={() => editRecurringDonation(donation)}
                              class="text-olive hover:text-navy text-sm underline"
                            >
                              Edit
                            </button>
                            <button
                              on:click={() => cancelRecurringDonation(donation.id)}
                              class="text-red-600 hover:text-red-800 text-sm underline"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      {/each}
                    </div>
                  </div>
                {/if}

                <!-- Add New Recurring Donation -->
                <div class="border-t border-navy border-opacity-10 pt-6">
                  <h3 class="text-lg font-medium text-navy mb-4">Set Up New Recurring Donation</h3>
                  <form on:submit={saveRecurringDonation} class="space-y-4">
                    <div>
                      <label for="new_recurring_amount" class="block text-sm font-medium text-navy text-opacity-70"
                        >Amount</label
                      >
                      <input
                        id="new_recurring_amount"
                        type="number"
                        bind:value={recurringForm.amount}
                        min="1"
                        step="0.01"
                        class="mt-1 w-full px-3 py-2 border border-navy border-opacity-20 rounded-md focus:outline-none focus:ring-2 focus:ring-olive focus:border-transparent"
                        placeholder="25.00"
                        required
                      />
                    </div>

                    <div>
                      <label for="new_recurring_frequency" class="block text-sm font-medium text-navy text-opacity-70"
                        >Frequency</label
                      >
                      <select
                        id="new_recurring_frequency"
                        bind:value={recurringForm.frequency}
                        class="mt-1 w-full px-3 py-2 border border-navy border-opacity-20 rounded-md focus:outline-none focus:ring-2 focus:ring-olive focus:border-transparent"
                        required
                      >
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="annually">Annually</option>
                      </select>
                    </div>

                    <div>
                      <label for="new_recurring_next_date" class="block text-sm font-medium text-navy text-opacity-70"
                        >Start Date</label
                      >
                      <input
                        id="new_recurring_next_date"
                        type="date"
                        bind:value={recurringForm.next_date}
                        class="mt-1 w-full px-3 py-2 border border-navy border-opacity-20 rounded-md focus:outline-none focus:ring-2 focus:ring-olive focus:border-transparent"
                        required
                      />
                    </div>

                    <button type="submit" disabled={savingRecurring} class="btn-primary w-full">
                      {savingRecurring ? 'Setting Up...' : 'Set Up Recurring Donation'}
                    </button>
                  </form>
                </div>
              </div>
            {/if}
          </div>
        </div>
      </div>
    {/if}

    <!-- Tax Receipts Modal -->
    {#if showTaxReceiptsModal}
      <div
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        role="dialog"
        aria-modal="true"
      >
        <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6 border-b border-navy border-opacity-10">
            <div class="flex justify-between items-center">
              <h2 class="text-xl font-serif font-medium text-navy">Tax Receipts & Documents</h2>
              <button
                on:click={() => (showTaxReceiptsModal = false)}
                class="text-navy text-opacity-60 hover:text-navy"
                aria-label="Close tax receipts modal"
              >
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div class="p-6">
            <div class="mb-6">
              <p class="text-navy text-opacity-70">
                Your tax-deductible contributions are acknowledged with official receipts. All donations to Metzler
                Foundations are tax-deductible to the extent allowed by law.
              </p>
            </div>

            {#if taxReceipts.length > 0}
              <div class="space-y-4">
                {#each taxReceipts as receipt}
                  <div
                    class="flex items-center justify-between p-4 bg-cream bg-opacity-50 rounded-lg border border-navy border-opacity-10"
                  >
                    <div>
                      <h3 class="font-medium text-navy">Tax Year {receipt.tax_year}</h3>
                      <p class="text-sm text-navy text-opacity-70">
                        Total donations: {formatCurrency(receipt.total_amount)}
                      </p>
                      <p class="text-sm text-navy text-opacity-70">
                        Issued: {new Date(receipt.issued_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div class="flex space-x-3">
                      <button
                        on:click={() => window.open(receipt.download_url, '_blank')}
                        class="btn-secondary text-sm"
                      >
                        Download PDF
                      </button>
                      <button on:click={() => window.open(receipt.download_url, '_blank')} class="btn-primary text-sm">
                        View Receipt
                      </button>
                    </div>
                  </div>
                {/each}
              </div>
            {:else}
              <div class="text-center py-8 text-navy text-opacity-60">
                <svg
                  class="w-12 h-12 mx-auto mb-4 text-navy text-opacity-30"
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
                <p class="text-lg font-medium mb-2">No Tax Receipts Yet</p>
                <p>Tax receipts will be available after your first donation and will be generated annually.</p>
              </div>
            {/if}

            <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 class="font-medium text-blue-800 mb-2">Tax Information</h3>
              <ul class="text-sm text-blue-700 space-y-1">
                <li>• Metzler Foundations is a 501(c)(3) nonprofit organization</li>
                <li>• Tax ID: 81-1234567 (for your records)</li>
                <li>• All donations are tax-deductible to the extent allowed by law</li>
                <li>• Receipts are issued annually by January 31st</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    {/if}

    <!-- Impact Reports Modal -->
    {#if showImpactReportsModal}
      <div
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        role="dialog"
        aria-modal="true"
      >
        <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6 border-b border-navy border-opacity-10">
            <div class="flex justify-between items-center">
              <h2 class="text-xl font-serif font-medium text-navy">Impact Reports</h2>
              <button
                on:click={() => (showImpactReportsModal = false)}
                class="text-navy text-opacity-60 hover:text-navy"
                aria-label="Close impact reports modal"
              >
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div class="p-6">
            <div class="mb-6">
              <p class="text-navy text-opacity-70">
                See detailed reports on how your donations are making a difference in Colorado communities.
              </p>
            </div>

            {#if impactReports.length > 0}
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                {#each impactReports as report}
                  <div class="bg-cream bg-opacity-50 rounded-lg p-6 border border-navy border-opacity-10">
                    <h3 class="font-semibold text-navy mb-2">{report.title}</h3>
                    <p class="text-sm text-navy text-opacity-70 mb-4">{report.description}</p>
                    <div class="text-xs text-navy text-opacity-60 space-y-1 mb-4">
                      <p>Published: {new Date(report.created_at).toLocaleDateString()}</p>
                      <p>Period: {report.reporting_period}</p>
                    </div>
                    <div class="flex space-x-3">
                      <button
                        on:click={() => window.open(report.download_url, '_blank')}
                        class="btn-secondary text-sm flex-1"
                      >
                        Download PDF
                      </button>
                      <button
                        on:click={() => window.open(report.view_url, '_blank')}
                        class="btn-primary text-sm flex-1"
                      >
                        View Report
                      </button>
                    </div>
                  </div>
                {/each}
              </div>
            {:else}
              <div class="text-center py-8 text-navy text-opacity-60">
                <svg
                  class="w-12 h-12 mx-auto mb-4 text-navy text-opacity-30"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                <p class="text-lg font-medium mb-2">No Impact Reports Yet</p>
                <p>New impact reports are published quarterly. Check back soon!</p>
              </div>
            {/if}

            <div class="mt-6 text-center">
              <a href="/impact" class="btn-primary"> View Public Impact Stories </a>
            </div>
          </div>
        </div>
      </div>
    {/if}
  </main>
</div>
