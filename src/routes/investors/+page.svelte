<script lang="ts">
  import { onMount } from 'svelte'
  import { fade, fly } from 'svelte/transition'
  import gsap from 'gsap'
  import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
  import RecoveryBackground from '$lib/components/RecoveryBackground.svelte'

  gsap.registerPlugin(ScrollTrigger);

  const metrics = [
    { label: 'Total Addressable Market', value: '$42B', description: '1 in 7 Americans report substance use challenges, yet only 10% receive treatment.' },
    { label: 'Gross Margin', value: '45%+', description: 'Optimized revenue-per-peer via group billing codes (H0038-HQ) and asynchronous support.' },
    { label: 'Workforce Growth', value: '3x YoY', description: 'Leveraging DOL Apprenticeship Grants to subsidize training costs and reduce churn.' }
  ]

  onMount(() => {
    gsap.from('.investor-hero', {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power2.out'
    })

    gsap.utils.toArray('.metric-card').forEach((card: any, i) => {
      gsap.from(card, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: i * 0.2,
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
        }
      })
    })
  })
</script>

<svelte:head>
  <title>Investors | Metzler Cares</title>
  <meta name="description" content="Invest in the future of behavioral health infrastructure. Building the ecosystem for scalable, data-driven recovery." />
</svelte:head>

<RecoveryBackground />

<div class="min-h-screen bg-recovery-paper/90 text-recovery-slate font-body pt-24 px-6">

  <!-- Hero Section -->
  <section class="investor-hero relative py-24 text-center max-w-5xl mx-auto">
    <div class="inline-flex items-center px-4 py-1 rounded-full border border-recovery-moss/30 bg-recovery-moss/5 text-recovery-moss text-sm font-bold mb-8">
      Growth & Governance
    </div>
    <h1 class="font-heading text-5xl md:text-7xl font-bold text-recovery-moss mb-8 leading-tight">
      Invest in the Future of <br/>
      <span class="italic text-recovery-clay">Behavioral Health Infrastructure</span>
    </h1>
    <p class="text-xl text-recovery-slate/80 mb-12 max-w-3xl mx-auto leading-relaxed">
      Metzler Cares is not just a service provider; we are a workforce development engine and a data aggregator. We are building the fertile soil for the next generation of recovery care.
    </p>
    <div class="flex justify-center gap-4">
      <a href="/contact" class="px-8 py-4 bg-recovery-moss text-white rounded-full font-bold hover:bg-recovery-clay transition-all shadow-forest hover:shadow-sunset">
        Request Pitch Deck
      </a>
    </div>
  </section>

  <!-- Key Metrics: The Harvest -->
  <section class="py-20 border-y border-recovery-moss/10 bg-white/40 backdrop-blur-sm rounded-[3rem] mb-24">
    <div class="container mx-auto px-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
        {#each metrics as metric}
          <div class="metric-card text-center group">
            <div class="text-5xl md:text-6xl font-heading font-bold text-recovery-moss mb-4 group-hover:text-recovery-clay transition-colors">{metric.value}</div>
            <div class="text-xl font-bold text-recovery-slate mb-3 font-heading">{metric.label}</div>
            <p class="text-recovery-slate/70 text-sm leading-relaxed max-w-xs mx-auto">{metric.description}</p>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- Tech Stack & Strategy -->
  <section class="py-24 max-w-7xl mx-auto">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      <div>
        <h2 class="font-heading text-4xl md:text-5xl font-bold text-recovery-moss mb-8">Built for Security & Scale.</h2>
        <p class="text-lg text-recovery-slate/80 mb-12 leading-relaxed">
          Our platform architecture is designed to meet the rigorous standards of enterprise healthcare while remaining agile enough for rapid deployment.
        </p>
        
        <div class="space-y-8">
          <div class="flex gap-6 group">
            <div class="w-16 h-16 rounded-2xl bg-recovery-paper border border-recovery-moss/20 flex items-center justify-center text-3xl shadow-sm group-hover:shadow-forest transition-all">
              🛡️
            </div>
            <div>
              <h3 class="text-2xl font-heading font-bold text-recovery-moss mb-2">HIPAA & 42 CFR Part 2</h3>
              <p class="text-recovery-slate/70">Bank-grade encryption for all member data. We protect our most valuable asset: trust.</p>
            </div>
          </div>
          
          <div class="flex gap-6 group">
            <div class="w-16 h-16 rounded-2xl bg-recovery-paper border border-recovery-moss/20 flex items-center justify-center text-3xl shadow-sm group-hover:shadow-forest transition-all">
              🔌
            </div>
            <div>
              <h3 class="text-2xl font-heading font-bold text-recovery-moss mb-2">API-First Design</h3>
              <p class="text-recovery-slate/70">Ready for integration with major EHRs (Epic, Cerner) and HIEs. Built for the connected ecosystem.</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-[3rem] p-10 border border-recovery-moss/10 shadow-xl relative overflow-hidden">
        <div class="absolute top-0 right-0 w-64 h-64 bg-recovery-sun/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <h3 class="text-3xl font-heading font-bold text-recovery-moss mb-8 relative z-10">Financial Strategy</h3>
        <div class="space-y-6 relative z-10">
          <div class="p-6 bg-recovery-paper rounded-2xl border border-recovery-moss/10 hover:border-recovery-moss/30 transition-colors">
            <div class="text-recovery-clay font-bold text-sm mb-2 uppercase tracking-wider">Fiscal Sponsorship</div>
            <div class="text-recovery-moss font-bold text-lg">Colorado Nonprofit Development Center (CNDC)</div>
            <div class="text-recovery-slate/60 text-sm mt-2">Immediate access to 501(c)(3) status for grant funding.</div>
          </div>
          <div class="p-6 bg-recovery-paper rounded-2xl border border-recovery-moss/10 hover:border-recovery-moss/30 transition-colors">
            <div class="text-recovery-clay font-bold text-sm mb-2 uppercase tracking-wider">Liquidity Management</div>
            <div class="text-recovery-moss font-bold text-lg">Colorado Nonprofit Bridge Loan Fund</div>
            <div class="text-recovery-slate/60 text-sm mt-2">Secured credit line to bridge Medicaid reimbursement cycles.</div>
          </div>
          <div class="p-6 bg-recovery-paper rounded-2xl border border-recovery-moss/10 hover:border-recovery-moss/30 transition-colors">
            <div class="text-recovery-clay font-bold text-sm mb-2 uppercase tracking-wider">Innovation Grants</div>
            <div class="text-recovery-moss font-bold text-lg">OEDIT Advanced Industries</div>
            <div class="text-recovery-slate/60 text-sm mt-2">Non-dilutive capital for digital health platform development.</div>
          </div>
        </div>
      </div>
    </div>
  </section>

</div>
