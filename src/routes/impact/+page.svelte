<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/utils/supabase';
  import { Chart, registerables } from 'chart.js';
  import MetzlerBridgeLogo from '$lib/MetzlerBridgeLogo.svelte';

  Chart.register(...registerables);

  interface ImpactMetric {
    metric_type: 'clients_stabilized' | 'sober_living_funded' | 'snap_benefits_secured' | 'ids_obtained' | 'workforce_registrations';
    value: number;
    period_date: string;
  }

  let impactData: ImpactMetric[] = [];
  let loading = true;
  let chart: Chart | null = null;
  let chartCanvas: HTMLCanvasElement;

  const metricLabels = {
    clients_stabilized: 'Clients Stabilized',
    sober_living_funded: 'Sober Living Beds Funded',
    snap_benefits_secured: 'SNAP Benefits Secured',
    ids_obtained: 'State IDs Obtained',
    workforce_registrations: 'Workforce Registrations'
  };

  const metricIcons: Record<string, string> = {
    clients_stabilized: '👥',
    sober_living_funded: '🏠',
    snap_benefits_secured: '🍎',
    ids_obtained: '🆔',
    workforce_registrations: '💼'
  };

  const metricColors: Record<string, string> = {
    clients_stabilized: '#1a237e',
    sober_living_funded: '#00c853',
    snap_benefits_secured: '#f59e0b',
    ids_obtained: '#3b82f6',
    workforce_registrations: '#8b5cf6'
  };

  onMount(async () => {
    await loadImpactData();
    loading = false;
    
    if (chartCanvas) {
      createChart();
    }
  });

  async function loadImpactData() {
    const { data, error } = await supabase
      .from('impact_metrics')
      .select('*')
      .order('period_date', { ascending: false })
      .limit(30);

    if (error) {
      console.error('Error loading impact data:', error);
      return;
    }

    impactData = data || [];
  }

  function createChart() {
    if (!chartCanvas || impactData.length === 0) return;

    const ctx = chartCanvas.getContext('2d');
    if (!ctx) return;

    // Group data by metric type and calculate totals
    const totals = Object.keys(metricLabels).reduce((acc, key) => {
      acc[key] = impactData.filter(d => d.metric_type === key).reduce((sum, d) => sum + d.value, 0);
      return acc;
    }, {} as Record<string, number>);

    chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: Object.keys(metricLabels).map(key => metricLabels[key as keyof typeof metricLabels]),
        datasets: [{
          data: Object.keys(metricLabels).map(key => totals[key]),
          backgroundColor: Object.keys(metricLabels).map(key => metricColors[key as keyof typeof metricColors]),
          borderWidth: 0,
          hoverOffset: 10
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              usePointStyle: true,
              font: {
                family: 'Inter',
                size: 14
              }
            }
          },
          tooltip: {
            backgroundColor: '#1a237e',
            titleColor: '#ffffff',
            bodyColor: '#ffffff',
            cornerRadius: 12,
            displayColors: false,
            callbacks: {
              label: function(context) {
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = ((context.parsed / total) * 100).toFixed(1);
                return `${context.label}: ${context.parsed} (${percentage}%)`;
              }
            }
          }
        },
        cutout: '60%'
      }
    });
  }

  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  function getTotalImpact(): number {
    return impactData.reduce((sum, metric) => sum + metric.value, 0);
  }

  function getMetricTotal(type: keyof typeof metricLabels): number {
    return impactData.filter(d => d.metric_type === type).reduce((sum, d) => sum + d.value, 0);
  }

  function getCostPerOutcome(): number {
    // Assume $150 per outcome based on the blueprint
    return 150;
  }

  function getTotalFundingNeeded(): number {
    return getTotalImpact() * getCostPerOutcome();
  }
</script>

<svelte:head>
  <title>Our Impact - Live Dashboard | Metzler Cares</title>
  <meta name="description" content="See our real-time impact: clients stabilized, sober living beds funded, SNAP benefits secured, and more." />
</svelte:head>

<div class="min-h-screen bg-accent">
  <!-- Hero Section -->
  <section class="section gradient-primary relative overflow-hidden">
    <div class="absolute inset-0">
      <div class="absolute top-0 left-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 right-0 w-64 h-64 bg-secondary opacity-10 rounded-full blur-2xl"></div>
    </div>
    
    <div class="container relative z-10 text-center text-white">
      <div class="mb-8 animate-fade-in">
        <MetzlerBridgeLogo class="w-20 h-20 mx-auto mb-6 opacity-90" />
      </div>
      
      <h1 class="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight animate-fade-in" style="animation-delay: 0.1s;">
        We Don't Just Refer.
        <br />
        <span class="text-secondary">We Fulfill.</span>
      </h1>
      
      <p class="text-xl mb-8 opacity-90 max-w-3xl mx-auto leading-relaxed animate-fade-in" style="animation-delay: 0.2s;">
        Real-time transparency into our impact. Every dollar goes directly to stabilizing lives and funding recovery.
      </p>
    </div>
  </section>

  <!-- Live Metrics -->
  <section class="section bg-white">
    <div class="container">
      <div class="text-center mb-12">
        <h2 class="text-4xl font-extrabold text-primary mb-4 tracking-tight">Live Impact Dashboard</h2>
        <p class="text-lg text-gray-medium max-w-2xl mx-auto">
          See the real-time results of your support and the lives we're changing together.
        </p>
      </div>

      {#if loading}
        <div class="flex items-center justify-center h-64">
          <div class="text-gray-medium">Loading impact data...</div>
        </div>
      {:else}
        <!-- Key Metrics Grid -->
        <div class="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-16">
          {#each Object.entries(metricLabels) as [key, label]}
            <div class="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-6 text-center group hover:shadow-xl transition-all duration-300">
              <div class="text-4xl mb-3 group-hover:scale-110 transition-transform">
                {metricIcons[key]}
              </div>
              <div class="text-3xl font-bold text-primary mb-1">
                {getMetricTotal(key as keyof typeof metricLabels).toLocaleString()}
              </div>
              <div class="text-sm text-gray-medium font-medium">
                {label}
              </div>
              <div class="mt-3 h-1 w-12 mx-auto rounded-full" style="background-color: {metricColors[key]}"></div>
            </div>
          {/each}
        </div>

        <!-- Impact Chart -->
        <div class="bg-white rounded-2xl shadow-xl p-8 mb-16">
          <div class="text-center mb-8">
            <h3 class="text-2xl font-bold text-primary mb-2">Impact Distribution</h3>
            <p class="text-gray-medium">How your support is distributed across our programs</p>
          </div>
          
          <div class="max-w-2xl mx-auto h-96">
            <canvas bind:this={chartCanvas}></canvas>
          </div>
        </div>

        <!-- Funding Call to Action -->
        <div class="bg-gradient-to-r from-primary to-blue-900 rounded-2xl shadow-2xl p-8 text-white text-center">
          <h3 class="text-3xl font-extrabold mb-4">Fund a Bridge</h3>
          <p class="text-xl mb-6 opacity-90">
            ${getCostPerOutcome()} = 1 Fresh Start Kit
          </p>
          
          <div class="grid md:grid-cols-3 gap-6 mb-8">
            <div class="bg-soft-white rounded-xl p-6 border border-sage-200 shadow-soft">
              <div class="text-2xl font-bold mb-2">{getTotalImpact().toLocaleString()}</div>
              <div class="text-sm opacity-80">Total Outcomes</div>
            </div>
            <div class="bg-soft-white rounded-xl p-6 border border-sage-200 shadow-soft">
              <div class="text-2xl font-bold mb-2">{formatCurrency(getTotalFundingNeeded())}</div>
              <div class="text-sm opacity-80">Total Funding Needed</div>
            </div>
            <div class="bg-soft-white rounded-xl p-6 border border-sage-200 shadow-soft">
              <div class="text-2xl font-bold mb-2">100%</div>
              <div class="text-sm opacity-80">Goes to Programs</div>
            </div>
          </div>

          <button 
            on:click={() => alert('Donation integration coming soon!')}
            class="bg-secondary text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-green-600 transition-colors shadow-lg"
          >
            Fund a Fresh Start
          </button>
        </div>
      {/if}
    </div>
  </section>

  <!-- Transparency Section -->
  <section class="section bg-gray-light">
    <div class="container">
      <div class="text-center mb-12">
        <h2 class="text-4xl font-extrabold text-primary mb-4 tracking-tight">Complete Transparency</h2>
        <p class="text-lg text-gray-medium max-w-2xl mx-auto">
          Every outcome is tracked in real-time. See exactly where your support goes.
        </p>
      </div>

      <div class="grid md:grid-cols-3 gap-8">
        <div class="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div class="text-4xl mb-4">📊</div>
          <h3 class="text-xl font-bold text-primary mb-2">Real-Time Data</h3>
          <p class="text-gray-medium">Our dashboard updates instantly as outcomes are achieved.</p>
        </div>
        
        <div class="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div class="text-4xl mb-4">🔍</div>
          <h3 class="text-xl font-bold text-primary mb-2">Audit Trail</h3>
          <p class="text-gray-medium">Every action is logged for complete accountability.</p>
        </div>
        
        <div class="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div class="text-4xl mb-4">💎</div>
          <h3 class="text-xl font-bold text-primary mb-2">100% Direct</h3>
          <p class="text-gray-medium">No overhead. Your donation goes straight to outcomes.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Final CTA -->
  <section class="section gradient-primary text-center text-white">
    <div class="container">
      <h2 class="text-4xl font-extrabold mb-6 tracking-tight">
        Ready to Make an Impact?
      </h2>
      <p class="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
        Join us in creating lasting change. Every dollar directly funds life-stabilizing outcomes.
      </p>
      <button 
        on:click={() => alert('Donation integration coming soon!')}
        class="bg-secondary text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-green-600 transition-colors shadow-lg"
      >
        Start Funding Change
      </button>
    </div>
  </section>
</div>

<style>
  /* Enhanced animations */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fade-in {
    animation: fadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    opacity: 0;
  }

  .section {
    padding: 6rem 0;
  }

  .gradient-primary {
    background: linear-gradient(135deg, #1a237e 0%, #151d6d 100%);
  }

  /* Chart container */
  canvas {
    max-height: 400px;
  }

  /* Hover effects */
  .group:hover .group-hover\:scale-110 {
    transform: scale(1.1);
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .section {
      padding: 4rem 0;
    }
    
    .text-5xl {
      font-size: 2.5rem;
    }
  }
</style>
