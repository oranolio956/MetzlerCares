<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import { Chart, registerables } from 'chart.js';
  import { onMount } from 'svelte';
  import type { Application } from '$lib/types';
  
  Chart.register(...registerables);
  
  export let data;
  let applications: Application[] = data.applications || [];
  let loading = false;
  let error: string | null = data.error || null;
  
  let funnelChartEl: HTMLCanvasElement | null = null;
  let trendChartEl: HTMLCanvasElement | null = null;
  let geoChartEl: HTMLCanvasElement | null = null;
  
  function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }
  
  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString();
  }
  
  function formatPercent(rate: number) {
    return `${rate.toFixed(1)}%`;
  }
  
  function calculateFunnelMetrics() {
    const total = applications.length;
    const submitted = applications.filter(a => a.status !== 'draft').length;
    const verified = applications.filter(a => ['pending', 'approved', 'funded'].includes(a.status)).length;
    const approved = applications.filter(a => ['approved', 'funded'].includes(a.status)).length;
    const funded = applications.filter(a => a.status === 'funded').length;
    
    return {
      submitted: (submitted / total) * 100,
      verified: (verified / total) * 100,
      approved: (approved / total) * 100,
      funded: (funded / total) * 100
    };
  }
  
  function calculateTimeToDecision() {
    const approvedApps = applications.filter(a => ['approved', 'funded'].includes(a.status));
    const times = approvedApps.map(app => {
      const created = new Date(app.created_at || Date.now()).getTime();
      const updated = new Date(app.updated_at || Date.now()).getTime();
      return (updated - created) / (1000 * 60 * 60); // hours
    });
    
    const avg = times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0;
    return avg;
  }
  
  function calculateGeographicDistribution() {
    const distribution: Record<string, number> = {};
    applications.forEach(app => {
      const city = (app.beneficiaries as any)?.city || 'Unknown';
      distribution[city] = (distribution[city] || 0) + 1;
    });
    return distribution;
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
    if (applications.length > 0) {
      // Funnel Chart
      if (funnelChartEl) {
        const funnelCtx = funnelChartEl.getContext('2d');
        if (funnelCtx) {
          const metrics = calculateFunnelMetrics();
          new Chart(funnelCtx, {
            type: 'bar',
            data: {
              labels: ['Submitted', 'Verified', 'Approved', 'Funded', 'Completed'],
              datasets: [{
                label: 'Conversion Rate (%)',
                data: [metrics.submitted, metrics.verified, metrics.approved, metrics.funded, metrics.completed],
                backgroundColor: [
                  'rgba(122, 138, 111, 0.8)',
                  'rgba(90, 104, 83, 0.8)',
                  'rgba(74, 101, 136, 0.8)',
                  'rgba(201, 164, 92, 0.8)',
                  'rgba(76, 175, 80, 0.8)'
                ],
                borderColor: [
                  'rgba(122, 138, 111, 1)',
                  'rgba(90, 104, 83, 1)',
                  'rgba(74, 101, 136, 1)',
                  'rgba(201, 164, 92, 1)',
                  'rgba(76, 175, 80, 1)'
                ],
                borderWidth: 1
              }]
            },
            options: {
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: 'Application Conversion Funnel'
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  max: 100,
                  ticks: {
                    callback: function(value) {
                      return value + '%';
                    }
                  }
                }
              }
            }
          });
        }
      }
      
      // Trend Chart
      if (trendChartEl) {
        const trendCtx = trendChartEl.getContext('2d');
        if (trendCtx) {
          const last30Days = Array.from({ length: 30 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (29 - i));
            return date.toISOString().split('T')[0];
          });
          
          const trendData = last30Days.map(date => {
            const dayApps = applications.filter(app => 
              app.created_at.startsWith(date)
            );
            return {
              date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              submitted: dayApps.length,
              approved: dayApps.filter(a => ['approved', 'funded', 'completed'].includes(a.status)).length,
              funded: dayApps.filter(a => ['funded', 'completed'].includes(a.status)).length
            };
          });
          
          new Chart(trendCtx, {
            type: 'line',
            data: {
              labels: trendData.map(d => d.date),
              datasets: [
                {
                  label: 'Submitted',
                  data: trendData.map(d => d.submitted),
                  borderColor: 'rgba(122, 138, 111, 1)',
                  backgroundColor: 'rgba(122, 138, 111, 0.1)',
                  tension: 0.1
                },
                {
                  label: 'Approved',
                  data: trendData.map(d => d.approved),
                  borderColor: 'rgba(74, 101, 136, 1)',
                  backgroundColor: 'rgba(74, 101, 136, 0.1)',
                  tension: 0.1
                },
                {
                  label: 'Funded',
                  data: trendData.map(d => d.funded),
                  borderColor: 'rgba(201, 164, 92, 1)',
                  backgroundColor: 'rgba(201, 164, 92, 0.1)',
                  tension: 0.1
                }
              ]
            },
            options: {
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: 'Application Trends (Last 30 Days)'
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
    }
  });
</script>

<svelte:head>
  <title>Applications Analytics - Staff Portal</title>
  <meta name="description" content="Comprehensive analytics and insights for beneficiary applications and conversion metrics." />
</svelte:head>

<div class="min-h-screen bg-warm-cream">
  <!-- Professional header -->
  <header class="bg-soft-white shadow-soft border-b border-sage-200">
    <div class="max-w-7xl mx-auto px-6 lg:px-8 py-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-headline-medium font-display text-deep-navy-900">Applications Analytics</h1>
          <p class="text-body-medium text-deep-navy-700 mt-1">Comprehensive insights into application patterns and conversion metrics</p>
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
          <p class="text-body-medium text-deep-navy-700">Loading analytics data...</p>
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
          <h3 class="text-headline-small font-display text-error">Analytics Error</h3>
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
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
              </div>
              <span class="text-xs font-semibold text-sage-600 uppercase tracking-wide">Total</span>
            </div>
            <h3 class="text-3xl font-semibold text-deep-navy-900 mb-1">
              {applications.length}
            </h3>
            <p class="text-sm text-deep-navy-700">Applications submitted</p>
          </div>

          <div class="card">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-success bg-opacity-10 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <span class="text-xs font-semibold text-sage-600 uppercase tracking-wide">Approved</span>
            </div>
            <h3 class="text-3xl font-semibold text-deep-navy-900 mb-1">
              {applications.filter(a => ['approved', 'funded', 'completed'].includes(a.status)).length}
            </h3>
            <p class="text-sm text-deep-navy-700">Applications approved</p>
          </div>

          <div class="card">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-accent-gold bg-opacity-10 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-accent-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                </svg>
              </div>
              <span class="text-xs font-semibold text-sage-600 uppercase tracking-wide">Avg Time</span>
            </div>
            <h3 class="text-3xl font-semibold text-deep-navy-900 mb-1">
              {calculateTimeToDecision().toFixed(1)}h
            </h3>
            <p class="text-sm text-deep-navy-700">Average time to decision</p>
          </div>

          <div class="card">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-sage-200 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-sage-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
              </div>
              <span class="text-xs font-semibold text-sage-600 uppercase tracking-wide">Conversion</span>
            </div>
            <h3 class="text-3xl font-semibold text-deep-navy-900 mb-1">
              {formatPercent(calculateFunnelMetrics().completed)}
            </h3>
            <p class="text-sm text-deep-navy-700">Completion rate</p>
          </div>
        </div>

        <!-- Charts -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Funnel Chart -->
          <div class="card">
            <h2 class="text-headline-medium font-display text-deep-navy-900 mb-6">Conversion Funnel</h2>
            <div class="h-80">
              <canvas bind:this={funnelChartEl} aria-label="Application conversion funnel chart"></canvas>
            </div>
          </div>

          <!-- Trend Chart -->
          <div class="card">
            <h2 class="text-headline-medium font-display text-deep-navy-900 mb-6">Application Trends</h2>
            <div class="h-80">
              <canvas bind:this={trendChartEl} aria-label="Application trends over time chart"></canvas>
            </div>
          </div>
        </div>

        <!-- Geographic Distribution -->
        <div class="card">
          <h2 class="text-headline-medium font-display text-deep-navy-900 mb-6">Geographic Distribution</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 class="text-headline-small font-semibold text-deep-navy-900 mb-4">Top Cities</h3>
              <div class="space-y-3">
                {#each Object.entries(calculateGeographicDistribution()).sort(([,a], [,b]) => b - a).slice(0, 10) as [city, count]}
                  <div class="flex items-center justify-between">
                    <span class="text-body-medium text-deep-navy-700">{city}</span>
                    <div class="flex items-center gap-3">
                      <div class="w-24 bg-sage-100 rounded-full h-2">
                        <div 
                          class="bg-sage-600 h-2 rounded-full"
                          style="width: {(count / applications.length) * 100}%"
                        ></div>
                      </div>
                      <span class="text-sm font-semibold text-deep-navy-900 w-8">{count}</span>
                    </div>
                  </div>
                {/each}
              </div>
            </div>
            <div>
              <h3 class="text-headline-small font-semibold text-deep-navy-900 mb-4">Distribution Map</h3>
              <div class="h-64 bg-sage-50 rounded-lg flex items-center justify-center border border-sage-200">
                <div class="text-center">
                  <svg class="w-16 h-16 text-sage-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  <p class="text-sm text-sage-600">Interactive map visualization</p>
                  <p class="text-xs text-sage-500 mt-1">Coming soon with detailed geographic insights</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    {/if}
  </main>
</div>