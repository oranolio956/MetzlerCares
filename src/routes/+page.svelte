<script lang="ts">
  import { onMount } from 'svelte'
  import { fade, fly } from 'svelte/transition'

  // Tech-First Pillars Data
  const pillars = [
    {
      title: 'Data-Driven Insights',
      description: 'Our proprietary dashboard visualizes recovery capital growth, tracking engagement metrics and social determinants of health (SDOH) in real-time.',
      icon: 'chart'
    },
    {
      title: 'EHR Interoperability',
      description: 'We close the referral loop. Our platform integrates with major Electronic Health Records, pushing peer encounter notes and H0038 billing data directly to your workflow.',
      icon: 'network'
    },
    {
      title: '24/7 AI Engagement',
      description: 'Beyond the session. Our white-label app utilizes AI-driven sentiment analysis to detect relapse risks between scheduled visits, triggering immediate peer intervention.',
      icon: 'cpu'
    },
    {
      title: 'Audit-Ready Governance',
      description: 'Built on the Colorado RSSO framework. Every interaction is logged, supervised, and coded to Medicaid H0038 standards, ensuring 100% audit readiness.',
      icon: 'shield'
    }
  ]

  // Case Studies Data
  const stats = [
    { value: '14%', label: 'Reduction in 30-day Readmission Rates', context: 'for Partner Clinic X' },
    { value: '95%', label: 'Engagement Rate via Mobile App', context: 'vs 40% Industry Standard' },
    { value: '100%', label: 'Audit Compliance Score', context: 'across all Medicaid claims' }
  ]

  let visible = false
  onMount(() => {
    visible = true
  })
</script>

<svelte:head>
  <title>Metzler Cares | The Operating System for Sustainable Recovery</title>
  <meta
    name="description"
    content="Metzler Cares combines certified peer coaching with AI-driven engagement technology to deliver measurable outcomes for payers, providers, and patients."
  />
</svelte:head>

<div class="min-h-screen bg-tech-primary text-warm-gray font-sans selection:bg-tech-accent selection:text-white">
  
  <!-- Hero Section -->
  <section class="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
    <!-- Abstract Tech Background -->
    <div class="absolute inset-0 z-0 opacity-20">
      <div class="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-tech-secondary via-tech-primary to-black"></div>
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-tech-accent rounded-full blur-[128px] opacity-20 animate-pulse-slow"></div>
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-tech-purple rounded-full blur-[128px] opacity-20 animate-pulse-slow" style="animation-delay: 1s;"></div>
    </div>

    <div class="container mx-auto px-4 z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      
      <!-- Text Content -->
      <div class="text-center lg:text-left space-y-8" in:fly="{{ y: 20, duration: 800, delay: 200 }}">
        <div class="inline-flex items-center px-3 py-1 rounded-full border border-tech-accent/30 bg-tech-accent/10 text-tech-accent text-sm font-medium mb-4">
          <span class="w-2 h-2 rounded-full bg-tech-accent mr-2 animate-pulse"></span>
          RSSO Licensed & HIPAA Compliant
        </div>
        
        <h1 class="text-5xl md:text-7xl font-bold text-white leading-tight tracking-tight">
          The Operating System for <span class="text-transparent bg-clip-text bg-gradient-to-r from-tech-accent to-tech-teal">Sustainable Recovery</span>.
        </h1>

        <p class="text-xl text-gray-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
          Metzler Cares combines certified peer coaching with AI-driven engagement technology to deliver measurable outcomes for payers, providers, and patients.
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
          <a
            href="/contact"
            class="w-full sm:w-auto px-8 py-4 bg-tech-accent text-white rounded-lg font-semibold text-lg shadow-lg shadow-tech-accent/25 hover:bg-blue-600 hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center"
          >
            Request a Demo
            <svg class="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </a>
          <a
            href="/impact"
            class="w-full sm:w-auto px-8 py-4 bg-transparent border border-gray-700 text-gray-300 rounded-lg font-semibold text-lg hover:border-tech-accent hover:text-white transition-all flex items-center justify-center"
          >
            View Outcomes Data
          </a>
        </div>
      </div>

      <!-- Visual: Dashboard/App Mockup -->
      <div class="relative hidden lg:block" in:fly="{{ x: 20, duration: 800, delay: 400 }}">
        <!-- Abstract Device Frame -->
        <div class="relative z-10 bg-tech-secondary border border-gray-800 rounded-2xl shadow-2xl p-2 transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
          <div class="bg-tech-primary rounded-xl overflow-hidden aspect-[4/3] relative">
            <!-- Mock UI Header -->
            <div class="h-12 bg-gray-900 border-b border-gray-800 flex items-center px-4 space-x-2">
              <div class="w-3 h-3 rounded-full bg-red-500"></div>
              <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div class="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <!-- Mock UI Content -->
            <div class="p-6 grid grid-cols-3 gap-4">
              <div class="col-span-2 space-y-4">
                <div class="h-32 bg-gray-800/50 rounded-lg animate-pulse"></div>
                <div class="h-48 bg-gray-800/50 rounded-lg"></div>
              </div>
              <div class="space-y-4">
                <div class="h-20 bg-tech-accent/20 rounded-lg border border-tech-accent/30"></div>
                <div class="h-20 bg-gray-800/50 rounded-lg"></div>
                <div class="h-32 bg-gray-800/50 rounded-lg"></div>
              </div>
            </div>
            <!-- Floating Badge -->
            <div class="absolute bottom-6 right-6 bg-tech-secondary border border-gray-700 p-4 rounded-lg shadow-xl flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
              </div>
              <div>
                <div class="text-xs text-gray-400">H0038 Claim</div>
                <div class="text-sm font-bold text-white">Validated</div>
              </div>
            </div>
          </div>
        </div>
        <!-- Background Glow -->
        <div class="absolute -inset-4 bg-gradient-to-r from-tech-accent to-tech-purple opacity-30 blur-2xl -z-10 rounded-full"></div>
      </div>
    </div>
  </section>

  <!-- Trusted By Section -->
  <section class="py-12 border-y border-gray-800 bg-tech-secondary/30">
    <div class="container mx-auto px-4">
      <p class="text-center text-sm font-semibold text-gray-500 uppercase tracking-wider mb-8">Trusted by Colorado's Leading Health Systems</p>
      <div class="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
        <!-- Placeholder Logos -->
        <div class="text-xl font-bold text-white flex items-center gap-2"><span class="w-8 h-8 bg-blue-500 rounded"></span> Colorado Access</div>
        <div class="text-xl font-bold text-white flex items-center gap-2"><span class="w-8 h-8 bg-green-600 rounded"></span> RMHP</div>
        <div class="text-xl font-bold text-white flex items-center gap-2"><span class="w-8 h-8 bg-purple-600 rounded"></span> Signal</div>
        <div class="text-xl font-bold text-white flex items-center gap-2"><span class="w-8 h-8 bg-red-500 rounded"></span> Health First</div>
      </div>
    </div>
  </section>

  <!-- Value Grid (Tech Pillars) -->
  <section class="py-24 relative">
    <div class="container mx-auto px-4">
      <div class="text-center max-w-3xl mx-auto mb-20">
        <h2 class="text-3xl md:text-5xl font-bold mb-6 text-white">
          Infrastructure, not just intervention.
        </h2>
        <p class="text-xl text-gray-400">
          We move beyond anecdotal success to quantifiable impact. Our platform provides the plumbing for scalable, compliant peer support.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {#each pillars as pillar}
          <div class="group p-8 rounded-2xl bg-tech-secondary border border-gray-800 hover:border-tech-accent/50 hover:bg-gray-800 transition-all duration-300 relative overflow-hidden">
            <div class="absolute top-0 right-0 w-24 h-24 bg-tech-accent/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-150"></div>
            
            <div class="w-12 h-12 rounded-lg bg-tech-primary border border-gray-700 flex items-center justify-center mb-6 text-tech-accent group-hover:text-white group-hover:bg-tech-accent transition-colors">
              {#if pillar.icon === 'chart'}
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              {:else if pillar.icon === 'network'}
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
              {:else if pillar.icon === 'cpu'}
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>
              {:else}
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              {/if}
            </div>

            <h3 class="text-xl font-bold mb-3 text-white">{pillar.title}</h3>
            <p class="text-gray-400 text-sm leading-relaxed">{pillar.description}</p>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- Outcomes / Case Studies -->
  <section class="py-24 bg-tech-secondary border-t border-gray-800">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <h2 class="text-3xl md:text-4xl font-bold mb-6 text-white">
            Trusted by Colorado's Leading Health Systems.
          </h2>
          <p class="text-lg text-gray-400 mb-8">
            Partners and investors trust data. We provide verifiable evidence of impact, quantifying success in the language of administrators and CFOs.
          </p>
          <a href="/impact" class="text-tech-accent font-semibold hover:text-white flex items-center group">
            Read full case studies 
            <svg class="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </a>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {#each stats as stat}
            <div class="bg-tech-primary p-6 rounded-xl border border-gray-800">
              <div class="text-4xl font-bold text-white mb-2">{stat.value}</div>
              <div class="text-tech-accent font-medium mb-1">{stat.label}</div>
              <div class="text-sm text-gray-500">{stat.context}</div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </section>

  <!-- CTA Section -->
  <section class="py-24 relative overflow-hidden">
    <div class="absolute inset-0 bg-tech-accent/10"></div>
    <div class="container mx-auto px-4 text-center relative z-10">
      <h2 class="text-4xl md:text-5xl font-bold text-white mb-6">Ready to modernize your recovery network?</h2>
      <p class="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
        Join the platform that is redefining behavioral health infrastructure in Colorado.
      </p>
      <div class="flex flex-col sm:flex-row justify-center gap-4">
        <a
          href="/contact"
          class="px-8 py-4 bg-white text-tech-primary rounded-lg font-bold text-lg shadow-lg hover:bg-gray-100 transition-all"
        >
          Schedule a Briefing
        </a>
        <a
          href="/partner-portal"
          class="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-bold text-lg hover:bg-white/10 transition-all"
        >
          Access Partner Portal
        </a>
      </div>
    </div>
  </section>

</div>
