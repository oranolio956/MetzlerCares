<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import { Chart, registerables } from 'chart.js';
  import { onMount } from 'svelte';
  
  Chart.register(...registerables);
  
  export let data;
  let partners = data.partners || [];
  let outcomes = data.outcomes || [];
  let loading = false;
  let error: string | null = data.error || null;
  
  let performanceChartEl: HTMLCanvasElement | null = null;
  let successRateChartEl: HTMLCanvasElement | null = null;
  
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
  
  function calculatePartnerMetrics() {
    return partners.map(partner => {
      const partnerOutcomes = outcomes.filter(o => o.sober_living_partner_id === partner.id);
      const totalApplications = partnerOutcomes.length;
      const completedApplications = partnerOutcomes.filter(o => o.status === 'completed').length;
      const successRate = totalApplications > 0 ? (completedApplications / totalApplications) * 100 : 0;
      const avgStayDuration = partnerOutcomes.length > 0 
        ? partnerOutcomes.reduce((sum, o) => sum + (o.length_of_stay_days || 0), 0) / partnerOutcomes.length 
        : 0;
      
      return {
        ...partner,
        totalApplications,
        completedApplications,
        successRate,
        avgStayDuration
      };
    });
  }
  
  function getTopPerformers() {
    const metrics = calculatePartnerMetrics();
    return metrics.sort((a, b) => b.successRate - a.successRate).slice(0, 5);
  }
  
  function getNeedsAttention() {
    const metrics = calculatePartnerMetrics();
    return metrics.filter(p => p.successRate < 70 && p.totalApplications > 0).slice(0, 5);
  }
  
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
  
  onMount(() => {
    if (partners.length > 0 && outcomes.length > 0) {
      // Performance Chart
      if (performanceChartEl) {
        const perfCtx = performanceChartEl.getContext('2d');
        if (perfCtx) {
          const topPerformers = getTopPerformers();
          
          new Chart(perfCtx, {
            type: 'bar',
            data: {
              labels: topPerformers.map(p => p.facility_name),
              datasets: [
                {
                  label: 'Total Applications',
                  data: topPerformers.map(p => p.totalApplications),
                  backgroundColor: 'rgba(122, 138, 111, 0.8)',
                  borderColor: 'rgba(122, 138, 111, 1)',
                  borderWidth: 1
                },
                {
                  label: 'Completed',
                  data: topPerformers.map(p => p.completedApplications),
                  backgroundColor: 'rgba(76, 175, 80, 0.8)',
                  borderColor: 'rgba(76, 175, 80, 1)',
                  borderWidth: 1
                }
              ]
            },
            options: {
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: 'Top Partner Performance'
                }
              },
              scales: {
                y: {
                  beginAtZero: true
                }
              }
            }
          });
        }
      }
      
      // Success Rate Chart
      if (successRateChartEl) {
        const successCtx = successRateChartEl.getContext('2d');
        if (successCtx) {
          const topPerformers = getTopPerformers();
          
          new Chart(successCtx, {
            type: 'doughnut',
            data: {
              labels: topPerformers.map(p => p.facility_name),
              datasets: [{
                label: 'Success Rate (%)',
                data: topPerformers.map(p => p.successRate),
                backgroundColor: [
                  'rgba(76, 175, 80, 0.8)',
                  'rgba(74, 101, 136, 0.8)',
                  'rgba(201, 164, 92, 0.8)',
                  'rgba(122, 138, 111, 0.8)',
                  'rgba(90, 104, 83, 0.8)'
                ],
                borderColor: [
                  'rgba(76, 175, 80, 1)',
                  'rgba(74, 101, 136, 1)',
                  'rgba(201, 164, 92, 1)',
                  'rgba(122, 138, 111, 1)',
                  'rgba(90, 104, 83, 1)'
                ],
                borderWidth: 1
              }]
            },
            options: {
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: 'Partner Success Rates'
                }
              }
            }
          });
        }
      }
    }
  });
</script>

<svelte:head>
  <title>Partner Performance - Staff Analytics</title>
  <meta name="description" content="Comprehensive partner facility performance analytics and compliance tracking." />
</svelte:head>

<div class="min-h-screen bg-warm-cream">
  <!-- Professional header -->
  <header class="bg-soft-white shadow-soft border-b border-sage-200">
    <div class="max-w-7xl mx-auto px-6 lg:px-8 py-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-headline-medium font-display text-deep-navy-900">Partner Performance</h1>
          <p class="text-body-medium text-deep-navy-700 mt-1">Facility analytics, success rates, and compliance tracking</p>
        </div>
        <button 
          onclick={refreshData} 
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

  <!-- Main content -->
  <main class="max-w-7xl mx-auto px-6 lg:px-8 py-8">
    {#if loading}
      <div class="flex justify-center items-center py-16" role="status" aria-live="polite">
        <div class="text-center space-y-4">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-600 mx-auto"></div>
          <p class="text-body-medium text-deep-navy-700">Loading partner data...</p>
        </div>
      </div>

    {:else if error}
      <div class="card bg-error bg-opacity-5 border-error border-opacity-20" role="alert" aria-live="assertive">
        <div class="text-center space-y-4">
          <div class="w-16 h-16 bg-error bg-opacity-10 flex items-center justify-center mx-auto">
            <svg class="w-8 h-8 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 class="text-headline-small font-display text-error">Partner Data Error</h3>
          <p class="text-body-medium text-deep-navy-700 max-w-md mx-auto">{error}</p>
          <button onclick={refreshData} class="btn-primary">Try Again</button>
        </div>
      </div>

    {:else}
      <div class="space-y-8">
        <!-- Key Metrics -->
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div class="card">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-sage-100 flex items-center justify-center">
                <svg class="w-6 h-6 text-sage-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
              </div>
              <span class="text-xs font-semibold text-sage-600 uppercase tracking-wide">Partners</span>
            </div>
            <h3 class="text-3xl font-semibold text-deep-navy-900 mb-1">
              {partners.length}
            </h3>
            <p class="text-sm text-deep-navy-700">Active facilities</p>
          </div>

          <div class="card">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-success bg-opacity-10 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <span class="text-xs font-semibold text-sage-600 uppercase tracking-wide">Avg Success</span>
            </div>
            <h3 class="text-3xl font-semibold text-deep-navy-900 mb-1">
              {formatPercent(calculatePartnerMetrics().reduce((sum, p) => sum + p.successRate, 0) / partners.length)}
            </h3>
            <p class="text-sm text-deep-navy-700">Average success rate</p>
          </div>

          <div class="card">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-accent-gold bg-opacity-10 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-accent-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                </svg>
              </div>
              <span class="text-xs font-semibold text-sage-600 uppercase tracking-wide">Avg Stay</span>
            </div>
            <h3 class="text-3xl font-semibold text-deep-navy-900 mb-1">
              {(calculatePartnerMetrics().reduce((sum, p) => sum + p.avgStayDuration, 0) / partners.length).toFixed(0)}d
            </h3>
            <p class="text-sm text-deep-navy-700">Average stay duration</p>
          </div>

          <div class="card">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-sage-200 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-sage-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
              </div>
              <span class="text-xs font-semibold text-sage-600 uppercase tracking-wide">Total Apps</span>
            </div>
            <h3 class="text-3xl font-semibold text-deep-navy-900 mb-1">
              {outcomes.length}
            </h3>
            <p class="text-sm text-deep-navy-700">Total applications</p>
          </div>
        </div>

        <!-- Charts -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Performance Chart -->
          <div class="card">
            <h2 class="text-headline-medium font-display text-deep-navy-900 mb-6">Top Partner Performance</h2>
            <div class="h-80">
              <canvas bind:this={performanceChartEl} aria-label="Partner performance comparison chart"></canvas>
            </div>
          </div>

          <!-- Success Rate Chart -->
          <div class="card">
            <h2 class="text-headline-medium font-display text-deep-navy-900 mb-6">Success Rate Distribution</h2>
            <div class="h-80">
              <canvas bind:this={successRateChartEl} aria-label="Partner success rate distribution chart"></canvas>
            </div>
          </div>
        </div>

        <!-- Top Performers -->
        <div class="card">
          <h2 class="text-headline-medium font-display text-deep-navy-900 mb-6">Top Performing Partners</h2>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-sage-200">
              <thead class="bg-sage-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-deep-navy-700 uppercase tracking-wider">Facility</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-deep-navy-700 uppercase tracking-wider">Applications</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-deep-navy-700 uppercase tracking-wider">Success Rate</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-deep-navy-700 uppercase tracking-wider">Avg Stay</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-deep-navy-700 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody class="bg-soft-white divide-y divide-sage-200">
                {#each getTopPerformers() as partner}
                  <tr class="hover:bg-sage-50 transition-colors">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-medium text-deep-navy-900">{partner.facility_name}</div>
                      <div class="text-sm text-deep-navy-600">{partner.city}, {partner.state}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-deep-navy-900">{partner.totalApplications}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-semibold text-deep-navy-900">{formatPercent(partner.successRate)}</div>
                      <div class="w-full bg-sage-100 rounded-full h-2 mt-1">
                        <div 
                          class="bg-success h-2 rounded-full"
                          style="width: {partner.successRate}%"
                        ></div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-deep-navy-900">{partner.avgStayDuration.toFixed(0)} days</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full {partner.successRate >= 80 ? 'bg-success bg-opacity-10 text-success' : partner.successRate >= 60 ? 'bg-warning bg-opacity-10 text-warning' : 'bg-error bg-opacity-10 text-error'}">
                        {partner.successRate >= 80 ? 'Excellent' : partner.successRate >= 60 ? 'Good' : 'Needs Attention'}
                      </span>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Partners Needing Attention -->
        {#if getNeedsAttention().length > 0}
          <div class="card border-l-4 border-l-warning">
            <h2 class="text-headline-medium font-display text-deep-navy-900 mb-6">Partners Needing Attention</h2>
            <div class="space-y-4">
              {#each getNeedsAttention() as partner}
                <div class="flex items-center justify-between p-4 bg-warning bg-opacity-5 rounded-lg">
                  <div>
                    <h3 class="text-body-large font-semibold text-deep-navy-900">{partner.facility_name}</h3>
                    <p class="text-body-small text-deep-navy-600">{partner.city}, {partner.state}</p>
                    <p class="text-body-small text-deep-navy-600 mt-1">
                      {partner.totalApplications} applications, {partner.avgStayDuration.toFixed(0)} day avg stay
                    </p>
                  </div>
                  <div class="text-right">
                    <div class="text-display-small font-bold text-warning">
                      {formatPercent(partner.successRate)}
                    </div>
                    <div class="text-body-small text-deep-navy-600">Success Rate</div>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        {/if}
      </div>
    {/if}
  </main>
</div>