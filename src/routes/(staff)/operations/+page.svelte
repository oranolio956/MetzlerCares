<script lang="ts">
  import type { KPIMetrics } from '$lib/types';
  import { invalidateAll } from '$app/navigation';
  export let data;
  let kpis: KPIMetrics | null = data.kpis || null;
  let loading = false;
  let error: string | null = data.error || null;
  let outcomes = data.outcomes || null;

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  function formatPercent(rate: number) {
    return `${rate.toFixed(1)}%`;
  }
</script>

<svelte:head>
launch the new code to video
  <title>Operations Dashboard - Staff Portal</title>
  <meta name="description" content="Professional analytics dashboard for monitoring operational metrics and organizational performance." />
</svelte:head>

<!-- Professional dashboard layout -->
<div class="min-h-screen bg-sage-50">
  <!-- Professional header -->
  <header class="bg-soft-white shadow-soft border-b border-sage-200">
    <div class="max-w-7xl mx-auto px-6 lg:px-8 py-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-headline-medium font-display text-deep-navy-900">Operations Dashboard</h1>
          <p class="text-body-medium text-deep-navy-700 mt-1">Real-time operational metrics and performance analytics</p>
        </div>
        <button 
          on:click={refreshData} 
          class="btn-secondary flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          Refresh Data
        </button>
      </div>
    </div>
  </header>

  <!-- Professional main content -->
  <main class="max-w-7xl mx-auto px-6 lg:px-8 py-8">
    {#if loading}
      <!-- Professional loading state -->
      <div class="flex justify-center items-center py-16" role="status" aria-live="polite">
        <div class="text-center space-y-4">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-600 mx-auto"></div>
          <p class="text-body-medium text-deep-navy-700">Loading operational metrics...</p>
        </div>
      </div>

    {:else if error}
      <!-- Professional error state -->
      <div class="card bg-error bg-opacity-5 border-error border-opacity-20" role="alert" aria-live="assertive">
        <div class="text-center space-y-4">
          <div class="w-16 h-16 bg-error bg-opacity-10 flex items-center justify-center mx-auto">
            <svg class="w-8 h-8 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 class="text-headline-small font-display text-error">Dashboard Error</h3>
          <p class="text-body-medium text-deep-navy-700 max-w-md mx-auto">{error}</p>
          <button on:click={refreshData} class="btn-primary">Try Again</button>
        </div>
      </div>

    {:else}
      <!-- Professional dashboard content -->
      <div class="space-y-8">
        <!-- Key Performance Indicators -->
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div class="card">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-sage-100 flex items-center justify-center">
                <svg class="w-6 h-6 text-sage-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
              </div>
              <span class="text-xs font-semibold text-sage-600 uppercase tracking-wide">Pending</span>
            </div>
            <h3 class="text-3xl font-semibold text-deep-navy-900 mb-1">
              {kpis?.applications_pending || 0}
            </h3>
            <p class="text-sm text-deep-navy-700">Applications require attention</p>
          </div>

          <div class="card">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-sage-200 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-sage-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                </svg>
              </div>
              <span class="text-xs font-semibold text-sage-600 uppercase tracking-wide">Housed</span>
            </div>
            <h3 class="text-3xl font-semibold text-deep-navy-900 mb-1">
              {kpis?.beneficiaries_housed || 0}
            </h3>
            <p class="text-sm text-deep-navy-700">Lives changed through our program</p>
          </div>

          <div class="card">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-success bg-opacity-10 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <span class="text-xs font-semibold text-sage-600 uppercase tracking-wide">Success Rate</span>
            </div>
            <h3 class="text-3xl font-semibold text-deep-navy-900 mb-1">
              {formatPercent(kpis?.['90_day_success_rate'] || 0)}
            </h3>
            <p class="text-sm text-deep-navy-700">90-day program completion</p>
          </div>

          <div class="card">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-sage-200 flex items-center justify-center">
                <svg class="w-6 h-6 text-sage-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <span class="text-xs font-semibold text-sage-600 uppercase tracking-wide">Balance</span>
            </div>
            <h3 class="text-3xl font-semibold text-deep-navy-900 mb-1">
              {formatCurrency(kpis?.net_operational_balance || 0)}
            </h3>
            <p class="text-sm text-deep-navy-700">Net operational balance (30 days)</p>
          </div>
        </div>

        <!-- Financial Performance -->
        <div class="card">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-headline-medium font-display text-deep-navy-900">Financial Performance</h2>
            <span class="text-sm font-semibold text-sage-600 bg-sage-100 px-3 py-1 rounded-full">Last 30 Days</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="text-center">
              <div class="w-16 h-16 bg-success bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                </svg>
              </div>
              <h3 class="text-display-small font-semibold text-success mb-2">
                {formatCurrency(kpis?.revenue_last_30d || 0)}
              </h3>
              <p class="text-body-medium text-deep-navy-700 font-medium">Total Revenue</p>
            </div>

            <div class="text-center">
              <div class="w-16 h-16 bg-error bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"/>
                </svg>
              </div>
              <h3 class="text-display-small font-semibold text-error mb-2">
                {formatCurrency(Math.abs(kpis?.expenses_last_30d || 0))}
              </h3>
              <p class="text-body-medium text-deep-navy-700 font-medium">Total Expenses</p>
            </div>

            <div class="text-center">
              <div class="w-16 h-16 bg-sage-100 flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-sage-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                </svg>
              </div>
              <h3 class="text-display-small font-semibold text-deep-navy-900 mb-2">
                {formatCurrency(kpis?.net_operational_balance || 0)}
              </h3>
              <p class="text-body-medium text-deep-navy-700 font-medium">Net Balance</p>
            </div>
          </div>

          <div class="mt-8 pt-6 border-t border-sage-200">
            <div class="flex items-center justify-between">
              <h3 class="text-headline-small font-display text-deep-navy-900">Outcome Tracking</h3>
              <a href="/staff/operations/outcomes.csv" class="btn-secondary flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                Export Data
              </a>
            </div>
            
            <div class="mt-6 space-y-4">
              {#each [30, 60, 90] as iv}
                <div class="flex items-center gap-4">
                  <div class="w-20 text-sm font-semibold text-deep-navy-800">{iv}-Day</div>
                  <div class="flex-1 bg-sage-100 rounded-lg h-3 overflow-hidden">
                    <div 
                      class="bg-sage-600 h-full transition-all duration-500"
                      style={`width: ${(outcomes?.completionRateByInterval?.[iv] || 0)}%`}
                    ></div>
                  </div>
                  <div class="w-16 text-right">
                    <span class="text-sm font-semibold text-deep-navy-900">{(outcomes?.completionRateByInterval?.[iv] || 0)}%</span>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        </div>

        <!-- Donor Engagement -->
        <div class="card">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-headline-medium font-display text-deep-navy-900">Donor Engagement</h2>
            <span class="text-sm font-semibold text-sage-700 bg-sage-100 px-3 py-1">This Month</span>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div class="text-center p-4 bg-sage-50 rounded-lg">
              <div class="text-display-small font-semibold text-deep-navy-900 mb-2">
                {kpis?.new_recurring_donors_month || 0}
              </div>
              <p class="text-body-small text-deep-navy-700 font-medium">New Recurring Donors</p>
            </div>

            <div class="text-center p-4 bg-sage-50 rounded-lg">
              <div class="text-display-small font-semibold text-deep-navy-900 mb-2">
                {formatPercent(kpis?.donor_retention_rate || 0)}
              </div>
              <p class="text-body-small text-deep-navy-700 font-medium">Retention Rate</p>
            </div>

            <div class="text-center p-4 bg-sage-50 rounded-lg">
              <div class="text-display-small font-semibold text-success mb-2">
                {formatCurrency(0)}
              </div>
              <p class="text-body-small text-deep-navy-700 font-medium">Average Gift Size</p>
            </div>

            <div class="text-center p-4 bg-sage-50 rounded-lg">
              <div class="text-display-small font-semibold text-deep-navy-900 mb-2">
                {formatPercent(0)}
              </div>
              <p class="text-body-small text-deep-navy-700 font-medium">Growth Rate</p>
            </div>
          </div>
        </div>

        <!-- System Status -->
        <div class="card">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-headline-medium font-display text-deep-navy-900">System Status</h2>
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 bg-success rounded-full animate-pulse"></div>
              <span class="text-sm font-semibold text-success">All Systems Operational</span>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="text-center p-6 bg-success bg-opacity-5 rounded-lg border border-success border-opacity-20">
              <div class="w-16 h-16 bg-success bg-opacity-10 flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 class="text-headline-small font-semibold text-success mb-2">Systems Online</h3>
              <p class="text-body-small text-deep-navy-700">All integrations active and responsive</p>
            </div>

            <div class="text-center p-6 bg-sage-50 rounded-lg border border-sage-200">
              <div class="w-16 h-16 bg-sage-200 flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-sage-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 class="text-headline-small font-semibold text-deep-navy-900 mb-2">Last Updated</h3>
              <p class="text-body-small text-deep-navy-700">{new Date().toLocaleTimeString()}</p>
            </div>

            <div class="text-center p-6 bg-sage-50 rounded-lg border border-sage-200">
              <div class="w-16 h-16 bg-sage-200 flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-sage-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 class="text-headline-small font-semibold text-deep-navy-900 mb-2">Data Sources</h3>
              <p class="text-body-small text-deep-navy-700">5 integrated systems reporting</p>
            </div>
          </div>
        </div>
      </div>
    {/if}
  </main>
</div>
  async function refreshData() {
    loading = true;
    error = null;
    try {
      await invalidateAll();
    } catch (e: any) {
      error = e?.message || 'Failed to refresh';
    } finally {
      loading = false;
    }
  }
