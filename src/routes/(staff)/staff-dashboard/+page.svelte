<script lang="ts">
  import { goto, invalidateAll } from '$app/navigation';
  import type { Application } from '$lib/types';
  import { Chart, LineElement, PointElement, LinearScale, CategoryScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js'
  Chart.register(LineElement, PointElement, LinearScale, CategoryScale, BarElement, ArcElement, Tooltip, Legend)
  let { data } = $props();
  let pendingApplications: Application[] = $state(data.pendingApplications || []);
  let disbursementsReady: Application[] = $state(data.disbursementsReady || []);
  let recentApplications: any[] = $state(data.recentApplications || [])
  let slaBreaches: number = $state(data.slaBreaches || 0)
  let loading = $state(false);
  let error: string | null = $state(null);
  let lastRefreshed: string | null = $state(null);

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString();
  }

  function viewApplication(id: string) {
    goto(`/staff/application/${id}`);
  }

  async function refreshQueue() {
    loading = true;
    error = null;
    try {
      await invalidateAll();
      lastRefreshed = new Date().toLocaleString();
    } catch (e: any) {
      error = e?.message || 'Failed to refresh';
    } finally {
      loading = false;
    }
  }

  function groupByDay(series: any[]) {
    const byDay: Record<string, { pending: number; approved: number; funded: number; amount: number }> = {}
    for (const a of series) {
      const d = new Date(a.created_at)
      const key = new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString()
      if (!byDay[key]) byDay[key] = { pending: 0, approved: 0, funded: 0, amount: 0 }
      const s = (a.status || '').toLowerCase()
      if (s.includes('pending')) byDay[key].pending++
      else if (s.includes('approved')) byDay[key].approved++
      else if (s.includes('fund')) byDay[key].funded++
      byDay[key].amount += Number(a.amount_requested || 0)
    }
    const keys = Object.keys(byDay).sort()
    return {
      labels: keys.map((k) => new Date(k).toLocaleDateString()),
      pending: keys.map((k) => byDay[k].pending),
      approved: keys.map((k) => byDay[k].approved),
      funded: keys.map((k) => byDay[k].funded),
      amounts: keys.map((k) => byDay[k].amount)
    }
  }

  const ts = groupByDay(recentApplications)
  const funnelCounts = {
    applied: recentApplications.length,
    verified: recentApplications.filter((a) => String(a.status).toLowerCase().includes('approved')).length,
    funded: recentApplications.filter((a) => String(a.status).toLowerCase().includes('fund')).length
  }

  let appsChartEl: HTMLCanvasElement | null = null
  let fundsChartEl: HTMLCanvasElement | null = null
  let funnelChartEl: HTMLCanvasElement | null = null

  $effect(() => {
    if (appsChartEl) {
      new Chart(appsChartEl, {
        type: 'line',
        data: {
          labels: ts.labels,
          datasets: [
            { label: 'Pending', data: ts.pending, borderColor: '#3A5270', backgroundColor: '#3A5270', tension: 0.3 },
            { label: 'Approved', data: ts.approved, borderColor: '#556B2F', backgroundColor: '#556B2F', tension: 0.3 },
            { label: 'Funded', data: ts.funded, borderColor: '#192A56', backgroundColor: '#192A56', tension: 0.3 }
          ]
        },
        options: { plugins: { legend: { display: true }, tooltip: { enabled: true } }, scales: { y: { beginAtZero: true } } }
      })
    }
    if (fundsChartEl) {
      new Chart(fundsChartEl, {
        type: 'bar',
        data: { labels: ts.labels, datasets: [{ label: 'Daily Requested Amount (USD)', data: ts.amounts, backgroundColor: '#B8934A' }] },
        options: { plugins: { legend: { display: true }, tooltip: { enabled: true } }, scales: { y: { beginAtZero: true } } }
      })
    }
    if (funnelChartEl) {
      new Chart(funnelChartEl, {
        type: 'doughnut',
        data: { labels: ['Applied', 'Approved', 'Funded'], datasets: [{ data: [funnelCounts.applied, funnelCounts.verified, funnelCounts.funded], backgroundColor: ['#8F9F85', '#556B2F', '#192A56'], borderWidth: 0 }] },
        options: { plugins: { legend: { display: true }, tooltip: { enabled: true } }, cutout: '60%' }
      })
    }
  })

  let filterText = $state('')
  let filterStatus = $state('all')
  let selectedPending: Record<string, boolean> = $state({})
  let selectedDisburse: Record<string, boolean> = $state({})
  function applyFilter(list: Application[]) {
    return list.filter((a) => {
      const t = filterText.trim().toLowerCase()
      const email = ((a as any).beneficiaries?.email || (a as any).sober_living_partners?.contact_email || '').toLowerCase()
      const matchesText = t === '' || email.includes(t) || a.id.toLowerCase().includes(t)
      const matchesStatus = filterStatus === 'all' || a.status === filterStatus
      return matchesText && matchesStatus
    })
  }
</script>

<svelte:head>
  <title>Application Queue - Staff Dashboard</title>
  <meta name="description" content="Review and manage beneficiary applications and disbursements." />
</svelte:head>

<div class="min-h-screen bg-warm-cream text-deep-navy-900">
  <header class="bg-deep-navy-700 text-soft-white shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-medium">Application Queue</h1>
          <p class="text-cream text-opacity-80">Human-in-the-Loop Command Center</p>
          {#if lastRefreshed}
            <p class="text-cream text-opacity-70 text-xs">Last refreshed: {lastRefreshed}</p>
          {/if}
        </div>
        <button onclick={refreshQueue} class="px-4 py-2 bg-sage-600 text-soft-white rounded-md hover:bg-sage-700 transition-colors">Refresh Queue</button>
      </div>
    </div>
  </header>

  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {#if slaBreaches > 0}
      <div class="card bg-warning bg-opacity-10 border border-warning border-opacity-20 p-4 mb-6" role="alert" aria-live="polite">
        <div class="flex items-start gap-3">
          <svg class="w-5 h-5 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div>
            <p class="text-sm text-deep-navy-900"><strong>{slaBreaches}</strong> applications have exceeded the 48-hour review SLA. Consider prioritizing these in the pending list.</p>
          </div>
        </div>
      </div>
    {/if}
    <section class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <div class="card p-6">
        <h2 class="text-lg font-semibold text-deep-navy-900 mb-3">Applications Over Time</h2>
        <canvas bind:this={appsChartEl} aria-label="Applications over time"></canvas>
      </div>
      <div class="card p-6">
        <h2 class="text-lg font-semibold text-deep-navy-900 mb-3">Funding Trend</h2>
        <canvas bind:this={fundsChartEl} aria-label="Funding trend"></canvas>
      </div>
      <div class="card p-6">
        <h2 class="text-lg font-semibold text-deep-navy-900 mb-3">Conversion Funnel</h2>
        <canvas bind:this={funnelChartEl} aria-label="Conversion funnel"></canvas>
      </div>
    </section>
    <div class="mb-6">
      <a href="/staff/staff-dashboard/applications.csv" class="btn-secondary">Export Applications (CSV)</a>
    </div>
    <section class="card p-4 mb-8">
      <div class="flex flex-wrap items-center gap-4">
        <div class="flex items-center gap-2">
          <label for="filter-text" class="text-sm font-medium text-deep-navy-900">Search</label>
          <input id="filter-text" type="text" bind:value={filterText} class="form-input max-w-xs" placeholder="email or id" />
        </div>
        <div class="flex items-center gap-2">
          <label for="filter-status" class="text-sm font-medium text-deep-navy-900">Status</label>
          <select id="filter-status" bind:value={filterStatus} class="form-input max-w-xs">
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="funded">Funded</option>
          </select>
        </div>
      </div>
    </section>
    {#if loading}
      <div class="space-y-8" role="status" aria-live="polite">
        <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 overflow-hidden">
          <div class="px-6 py-4 bg-navy bg-opacity-5 border-b border-navy border-opacity-10">
            <div class="h-4 w-48 bg-navy bg-opacity-10"></div>
          </div>
          <div class="p-6 space-y-3">
            {#each Array(5) as _, i}
              <div class="h-4 w-full bg-navy bg-opacity-5"></div>
            {/each}
          </div>
        </div>
        <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 overflow-hidden">
          <div class="px-6 py-4 bg-navy bg-opacity-5 border-b border-navy border-opacity-10">
            <div class="h-4 w-56 bg-navy bg-opacity-10"></div>
          </div>
          <div class="p-6 space-y-3">
            {#each Array(5) as _, i}
              <div class="h-4 w-full bg-navy bg-opacity-5"></div>
            {/each}
          </div>
        </div>
      </div>
    {:else if error}
      <div class="bg-red-50 border border-red-200 rounded-lg p-6" role="alert" aria-live="assertive">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Error Loading Applications</h3>
            <div class="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
            <div class="mt-4">
              <button onclick={refreshQueue} class="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200">Try Again</button>
            </div>
          </div>
        </div>
      </div>
    {:else}
      <div class="space-y-8">
        <div class="bg-soft-white rounded-lg shadow-sm border border-deep-navy-200 overflow-hidden">
          <div class="px-6 py-4 bg-deep-navy-900 bg-opacity-5 border-b border-deep-navy-200">
            <h2 class="text-xl font-medium text-deep-navy-900">Pending Verification</h2>
            <p class="text-sm text-deep-navy-700 mt-1">Applications awaiting automated verification review</p>
          </div>

          {#if pendingApplications.length === 0}
            <div class="px-6 py-12 text-center">
              <svg class="mx-auto h-12 w-12 text-navy text-opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 class="mt-2 text-sm font-medium text-navy">No pending applications</h3>
              <p class="mt-1 text-sm text-navy text-opacity-60">All applications have been processed.</p>
            </div>
          {:else}
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-navy divide-opacity-10">
                <thead class="bg-navy bg-opacity-5">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-deep-navy-900 uppercase tracking-wider">Select</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-deep-navy-900 uppercase tracking-wider">Applicant</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-navy uppercase tracking-wider">Email</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-navy uppercase tracking-wider">Date Submitted</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-navy uppercase tracking-wider">Status</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-navy uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-navy divide-opacity-10">
                  {#each applyFilter(pendingApplications) as application}
                    <tr class="hover:bg-navy hover:bg-opacity-5 transition-colors">
                      <td class="px-6 py-4 whitespace-nowrap"><input type="checkbox" bind:checked={selectedPending[application.id]} /></td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm font-medium text-navy">Applicant #{application.id.slice(-8).toUpperCase()}</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-navy text-opacity-80">{(application.beneficiaries as any)?.email || 'N/A'}</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-navy text-opacity-80">{formatDate(application.created_at)}</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          {application.status}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onclick={() => viewApplication(application.id)}
                          class="text-olive hover:text-navy transition-colors"
                        >
                          Review Application →
                        </button>
                      </td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
            <div class="px-6 py-3 border-t border-deep-navy-200 flex items-center gap-3">
              <button class="btn-secondary-outline" disabled={!Object.values(selectedPending).some(Boolean)}>Open Selected</button>
            </div>
          {/if}
        </div>

        <div class="bg-soft-white rounded-lg shadow-sm border border-deep-navy-200 overflow-hidden">
          <div class="px-6 py-4 bg-deep-navy-900 bg-opacity-5 border-b border-deep-navy-200">
            <h2 class="text-xl font-medium text-deep-navy-900">Ready for Disbursement</h2>
            <p class="text-sm text-deep-navy-700 mt-1">Approved applications ready for fund disbursement to partners</p>
          </div>

          {#if disbursementsReady.length === 0}
            <div class="px-6 py-12 text-center">
              <svg class="mx-auto h-12 w-12 text-navy text-opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              <h3 class="mt-2 text-sm font-medium text-navy">No disbursements ready</h3>
              <p class="mt-1 text-sm text-navy text-opacity-60">Approved applications will appear here when ready for payment.</p>
            </div>
          {:else}
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-navy divide-opacity-10">
                <thead class="bg-navy bg-opacity-5">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-deep-navy-900 uppercase tracking-wider">Select</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-deep-navy-900 uppercase tracking-wider">Applicant</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-navy uppercase tracking-wider">Facility</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-navy uppercase tracking-wider">Amount</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-navy uppercase tracking-wider">Approved Date</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-navy uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-navy divide-opacity-10">
                  {#each applyFilter(disbursementsReady) as application}
                    <tr class="hover:bg-navy hover:bg-opacity-5 transition-colors">
                      <td class="px-6 py-4 whitespace-nowrap"><input type="checkbox" bind:checked={selectedDisburse[application.id]} /></td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm font-medium text-navy">Applicant #{application.id.slice(-8)}</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-navy text-opacity-80">{(application.sober_living_partners as any)?.facility_name || 'N/A'}</div>
                        <div class="text-xs text-navy text-opacity-60">{(application.sober_living_partners as any)?.contact_email || 'N/A'}</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm font-medium text-navy">${application.amount_requested || 'TBD'}</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-navy text-opacity-80">{formatDate(application.created_at)}</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onclick={() => viewApplication(application.id)}
                          class="text-olive hover:text-navy transition-colors"
                        >
                          Process Payment →
                        </button>
                      </td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
            <div class="px-6 py-3 border-t border-deep-navy-200 flex items-center gap-3">
              <button class="btn-secondary-outline" disabled={!Object.values(selectedDisburse).some(Boolean)}>Open Selected</button>
            </div>
          {/if}
        </div>
      </div>
    {/if}

    <!-- Analytics Dashboard Links -->
    <div class="mt-8 bg-soft-white rounded-lg shadow-sm border border-deep-navy-200 overflow-hidden">
      <div class="px-6 py-4 bg-deep-navy-900 bg-opacity-5 border-b border-deep-navy-200">
        <h2 class="text-xl font-medium text-deep-navy-900">Analytics & Reporting</h2>
        <p class="text-sm text-deep-navy-700 mt-1">Comprehensive data analysis and performance metrics</p>
      </div>
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <a href="/staff/analytics/applications" class="block p-4 border border-deep-navy-200 rounded-lg hover:bg-navy hover:bg-opacity-5 transition-colors">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="h-6 w-6 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-deep-navy-900">Application Analytics</h3>
                <p class="text-xs text-navy text-opacity-60">Track application trends and conversion rates</p>
              </div>
            </div>
          </a>

          <a href="/staff/analytics/financial" class="block p-4 border border-deep-navy-200 rounded-lg hover:bg-navy hover:bg-opacity-5 transition-colors">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="h-6 w-6 text-sage-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-deep-navy-900">Financial Analytics</h3>
                <p class="text-xs text-navy text-opacity-60">Donation funnels and partner ROI metrics</p>
              </div>
            </div>
          </a>

          <a href="/staff/analytics/partners" class="block p-4 border border-deep-navy-200 rounded-lg hover:bg-navy hover:bg-opacity-5 transition-colors">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-deep-navy-900">Partner Performance</h3>
                <p class="text-xs text-navy text-opacity-60">Facility success rates and compliance tracking</p>
              </div>
            </div>
          </a>

          <a href="/staff/analytics/impact" class="block p-4 border border-deep-navy-200 rounded-lg hover:bg-navy hover:bg-opacity-5 transition-colors">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-deep-navy-900">Impact Measurement</h3>
                <p class="text-xs text-navy text-opacity-60">Program effectiveness and success stories</p>
              </div>
            </div>
          </a>

          <a href="/staff/analytics/security" class="block p-4 border border-deep-navy-200 rounded-lg hover:bg-navy hover:bg-opacity-5 transition-colors">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-deep-navy-900">Security Analytics</h3>
                <p class="text-xs text-navy text-opacity-60">Monitor threats, rate limiting, and security events</p>
              </div>
            </div>
          </a>

          <a href="/staff/blog" class="block p-4 border border-deep-navy-200 rounded-lg hover:bg-navy hover:bg-opacity-5 transition-colors">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-deep-navy-900">Blog Management</h3>
                <p class="text-xs text-navy text-opacity-60">Content creation, editorial workflow, and analytics</p>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  </main>
</div>
