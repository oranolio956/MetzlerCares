<script lang="ts">
  import { onMount } from 'svelte'
  import { fade, fly } from 'svelte/transition'

  const metrics = [
    { label: 'Total Addressable Market', value: '$42B', description: '1 in 7 Americans report substance use challenges, yet only 10% receive treatment.' },
    { label: 'Gross Margin', value: '45%+', description: 'Optimized revenue-per-peer via group billing codes (H0038-HQ) and asynchronous support.' },
    { label: 'Workforce Growth', value: '3x YoY', description: 'Leveraging DOL Apprenticeship Grants to subsidize training costs and reduce churn.' }
  ]

  let visible = false
  onMount(() => {
    visible = true
  })
</script>

<svelte:head>
  <title>Investors | Metzler Cares</title>
  <meta name="description" content="Invest in the future of behavioral health infrastructure. Metzler Cares is building the operating system for scalable, data-driven recovery." />
</svelte:head>

<div class="min-h-screen bg-tech-primary text-warm-gray font-sans selection:bg-tech-accent selection:text-white pt-20">

  <!-- Hero Section -->
  <section class="relative py-24 overflow-hidden">
    <div class="container mx-auto px-4 relative z-10 text-center">
      <div class="inline-flex items-center px-3 py-1 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 text-sm font-medium mb-6">
        Growth & Governance
      </div>
      <h1 class="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight max-w-5xl mx-auto">
        Invest in the Future of <br/>
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-tech-teal to-tech-accent">Behavioral Health Infrastructure</span>.
      </h1>
      <p class="text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
        Metzler Cares is not just a service provider; we are a workforce development engine and a data aggregator. We are building the infrastructure for the next generation of recovery care.
      </p>
      <div class="flex justify-center gap-4">
        <a href="/contact" class="px-8 py-4 bg-white text-tech-primary rounded-lg font-bold hover:bg-gray-100 transition-all">
          Request Pitch Deck
        </a>
      </div>
    </div>
    
    <!-- Background Grid -->
    <div class="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10 pointer-events-none"></div>
  </section>

  <!-- Key Metrics -->
  <section class="py-20 bg-tech-secondary/30 border-y border-gray-800">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
        {#each metrics as metric}
          <div class="text-center group">
            <div class="text-5xl font-bold text-white mb-4 group-hover:text-tech-accent transition-colors">{metric.value}</div>
            <div class="text-lg font-bold text-gray-300 mb-2">{metric.label}</div>
            <p class="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">{metric.description}</p>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- Tech Stack & IP -->
  <section class="py-24">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-6">Built for Security & Scale.</h2>
          <p class="text-gray-400 mb-8">
            Our platform architecture is designed to meet the rigorous standards of enterprise healthcare while remaining agile enough for rapid deployment.
          </p>
          
          <div class="space-y-6">
            <div class="flex gap-4">
              <div class="w-12 h-12 rounded-lg bg-tech-secondary border border-gray-700 flex items-center justify-center text-tech-accent flex-shrink-0">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
              <div>
                <h3 class="text-xl font-bold text-white mb-2">HIPAA & 42 CFR Part 2 Compliant</h3>
                <p class="text-gray-500 text-sm">Bank-grade encryption for all member data. We protect our most valuable asset: trust.</p>
              </div>
            </div>
            
            <div class="flex gap-4">
              <div class="w-12 h-12 rounded-lg bg-tech-secondary border border-gray-700 flex items-center justify-center text-tech-accent flex-shrink-0">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              </div>
              <div>
                <h3 class="text-xl font-bold text-white mb-2">API-First Design</h3>
                <p class="text-gray-500 text-sm">Ready for integration with major EHRs (Epic, Cerner) and HIEs. Built for the connected ecosystem.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="bg-tech-secondary rounded-2xl p-8 border border-gray-800 relative overflow-hidden">
          <div class="absolute top-0 right-0 w-64 h-64 bg-tech-accent/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
          <h3 class="text-2xl font-bold text-white mb-6">Financial Strategy</h3>
          <div class="space-y-4">
            <div class="p-4 bg-tech-primary rounded-lg border border-gray-700">
              <div class="text-tech-teal font-bold text-sm mb-1">Fiscal Sponsorship</div>
              <div class="text-white font-medium">Colorado Nonprofit Development Center (CNDC)</div>
              <div class="text-gray-500 text-xs mt-1">Immediate access to 501(c)(3) status for grant funding.</div>
            </div>
            <div class="p-4 bg-tech-primary rounded-lg border border-gray-700">
              <div class="text-tech-teal font-bold text-sm mb-1">Liquidity Management</div>
              <div class="text-white font-medium">Colorado Nonprofit Bridge Loan Fund</div>
              <div class="text-gray-500 text-xs mt-1">Secured credit line to bridge Medicaid reimbursement cycles.</div>
            </div>
            <div class="p-4 bg-tech-primary rounded-lg border border-gray-700">
              <div class="text-tech-teal font-bold text-sm mb-1">Innovation Grants</div>
              <div class="text-white font-medium">OEDIT Advanced Industries</div>
              <div class="text-gray-500 text-xs mt-1">Non-dilutive capital for digital health platform development.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

</div>
