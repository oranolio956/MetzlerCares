<script lang="ts">
  import IconLightning from '$lib/components/icons/IconLightning.svelte'
  import IconHome from '$lib/components/icons/IconHome.svelte'
  import IconLock from '$lib/components/icons/IconLock.svelte'
  import { onMount } from 'svelte'
  import { trackEvent } from '$lib/utils/analytics'

  onMount(() => {
    trackEvent('homepage_viewed', { type: 'tech_first_pivot' })
  })

  const features = [
    {
      title: 'Data-Driven Insights',
      headline: 'Real-Time Analytics',
      description: 'Our proprietary dashboard visualizes recovery capital growth, tracking engagement metrics and social determinants of health (SDOH) in real-time. Investors see growth; Partners see compliance.',
      icon: IconLightning
    },
    {
      title: 'EHR Interoperability',
      headline: 'Seamless Integration',
      description: 'We close the referral loop. Our platform integrates with major Electronic Health Records, pushing peer encounter notes and H0038 billing data directly to your workflow.',
      icon: IconHome
    },
    {
      title: '24/7 Engagement',
      headline: 'AI-Enhanced Support',
      description: 'Beyond the session. Our white-label app utilizes AI-driven sentiment analysis to detect relapse risks between scheduled visits, triggering immediate peer intervention protocols.',
      icon: IconLock // Using Lock for "Security/Support" metaphor
    },
    {
      title: 'Audit-Ready Governance',
      headline: 'Compliance Engine',
      description: 'Built on the Colorado RSSO framework. Every interaction is logged, supervised, and coded to Medicaid H0038 standards, ensuring 100% audit readiness and medical necessity validation.',
      icon: IconLock
    }
  ]
</script>

<svelte:head>
  <title>Metzler Cares | The Operating System for Sustainable Recovery</title>
  <meta
    name="description"
    content="Metzler Cares combines certified peer coaching with AI-driven engagement technology to deliver measurable outcomes for payers, providers, and patients. RSSO Licensed."
  />
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://metzlercares.com/" />
  <meta property="og:title" content="Metzler Cares | The Recovery Operating System" />
  <meta
    property="og:description"
    content="Scalable. Data-Driven. Human-Centered. The first tech-enabled Peer Recovery ecosystem in Colorado."
  />
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Metzler Cares | The Recovery Operating System" />
  <meta
    name="twitter:description"
    content="Scalable. Data-Driven. Human-Centered. The first tech-enabled Peer Recovery ecosystem in Colorado."
  />
  <link rel="canonical" href="https://metzlercares.com/" />
</svelte:head>

<div class="min-h-screen flex flex-col font-sans">
  <!-- Hero Section -->
  <section class="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-charcoal to-forest-green text-white">
    <!-- Abstract Tech Background Overlay -->
    <div class="absolute inset-0 opacity-10 bg-[url('/grid-pattern.svg')] bg-repeat"></div>
    
    <div class="container mx-auto px-4 z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pt-20">
      <!-- Text Content -->
      <div class="text-center lg:text-left space-y-8">
        <div class="inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-mono text-green-300 mb-4">
          v2.0: Tech-First Recovery Architecture
        </div>
        
        <h1 class="text-4xl md:text-6xl font-bold leading-tight tracking-tight mb-6">
          The Operating System for <span class="text-green-400">Sustainable Recovery</span>.
        </h1>

        <p class="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto lg:mx-0 leading-relaxed mb-8">
          Metzler Cares combines certified peer coaching with AI-driven engagement technology to deliver measurable outcomes for payers, providers, and patients.
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
          <a
            href="/partners"
            class="w-full sm:w-auto px-8 py-4 bg-green-500 text-charcoal rounded-lg font-bold text-base shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:bg-green-400 hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] transition-all flex items-center justify-center min-h-[44px]"
            aria-label="Request a demo for your facility"
          >
            Request a Demo
          </a>
          <a
            href="/impact"
            class="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/30 text-white rounded-lg font-semibold text-base hover:bg-white/10 hover:border-white transition-all flex items-center justify-center min-h-[44px]"
            aria-label="View our outcomes data"
          >
            View Outcomes Data
          </a>
        </div>
        
        <!-- Trust Signals (Hero Footer) -->
        <div class="pt-8 flex flex-wrap gap-6 justify-center lg:justify-start opacity-70 text-xs font-mono uppercase tracking-widest">
          <span class="flex items-center gap-2">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/><path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd"/></svg>
            RSSO Licensed
          </span>
          <span class="flex items-center gap-2">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
            HIPAA & 42 CFR Part 2
          </span>
          <span class="flex items-center gap-2">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/></svg>
            H0038 Billing
          </span>
        </div>
      </div>

      <!-- Hero Visual -->
      <div class="relative hidden lg:block">
        <!-- Placeholder for Split Screen Dashboard/App visual -->
        <div class="relative w-full aspect-video bg-white/5 rounded-xl border border-white/10 backdrop-blur-md shadow-2xl overflow-hidden p-1">
           <div class="absolute inset-0 flex items-center justify-center text-white/20 font-bold text-2xl">
              [Platform Dashboard Visualization]
           </div>
           <!-- Decorative Elements simulating UI -->
           <div class="h-full w-full bg-charcoal/80 rounded-lg grid grid-cols-3 gap-4 p-4">
              <div class="col-span-1 bg-white/5 rounded h-full flex flex-col gap-2 p-2">
                 <div class="h-2 w-1/2 bg-white/20 rounded"></div>
                 <div class="h-20 w-full bg-green-500/20 rounded mt-2 border border-green-500/30"></div>
                 <div class="h-20 w-full bg-white/10 rounded mt-2"></div>
              </div>
              <div class="col-span-2 bg-white/5 rounded h-full p-2">
                 <div class="h-8 w-full bg-white/10 rounded mb-4 flex items-center px-2">
                    <div class="h-2 w-2 rounded-full bg-red-500 mr-2"></div>
                    <div class="h-2 w-2 rounded-full bg-yellow-500 mr-2"></div>
                    <div class="h-2 w-2 rounded-full bg-green-500"></div>
                 </div>
                 <div class="grid grid-cols-2 gap-2">
                     <div class="h-24 bg-white/5 rounded border border-white/10"></div>
                     <div class="h-24 bg-white/5 rounded border border-white/10"></div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Value Proposition Grid -->
  <section class="py-20 bg-white relative overflow-hidden">
    <div class="container mx-auto px-4">
      <div class="text-center max-w-3xl mx-auto mb-16">
        <h2 class="text-sm font-bold text-green-600 uppercase tracking-widest mb-2">Capabilities</h2>
        <h3 class="text-3xl md:text-4xl font-bold mb-6 text-charcoal">
          Scalable. Data-Driven. Human-Centered.
        </h3>
        <p class="text-xl text-gray-600">
          We move beyond anecdotal success to quantifiable impact. Our ecosystem integrates human connection with the efficiency of digital tools.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {#each features as feature}
          <div
            class="group p-6 rounded-xl bg-gray-50 border border-gray-200 hover:border-green-500 hover:shadow-lg transition-all duration-300 flex flex-col h-full"
          >
            <div
              class="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mb-6 group-hover:bg-green-500 transition-colors duration-300"
            >
              <svelte:component this={feature.icon} className="w-6 h-6 text-green-700 group-hover:text-white transition-colors duration-300" aria-hidden="true" />
            </div>

            <h4 class="text-sm font-bold text-green-600 mb-1 uppercase tracking-wide">{feature.headline}</h4>
            <h3 class="text-xl font-bold mb-3 text-charcoal">{feature.title}</h3>
            <p class="text-gray-600 leading-relaxed text-sm flex-grow">{feature.description}</p>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- Social Proof / Case Study Teaser -->
  <section class="py-20 bg-charcoal text-white">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <h2 class="text-3xl md:text-4xl font-bold mb-6">
            Trusted by Colorado's Leading Health Systems
          </h2>
          <p class="text-lg text-gray-300 mb-8">
            Partners and investors trust data. We reduce readmission rates and improve HEDIS scores through active management.
          </p>
          
          <div class="space-y-6">
             <div class="border-l-4 border-green-500 pl-6 py-2">
                <div class="text-4xl font-bold text-white mb-1">14%</div>
                <div class="text-gray-400">Reduction in 30-day readmission rates</div>
             </div>
             <div class="border-l-4 border-green-500 pl-6 py-2">
                <div class="text-4xl font-bold text-white mb-1">95%</div>
                <div class="text-gray-400">Engagement rate via Mobile App vs 40% industry standard</div>
             </div>
          </div>

          <div class="mt-10">
             <a href="/partners" class="text-green-400 font-bold hover:text-green-300 flex items-center gap-2">
                View Case Studies <span aria-hidden="true">→</span>
             </a>
          </div>
        </div>
        
        <div class="grid grid-cols-2 gap-4 opacity-50">
           <!-- Placeholders for Partner Logos -->
           <div class="h-24 bg-white/10 rounded flex items-center justify-center font-bold">Colorado Access</div>
           <div class="h-24 bg-white/10 rounded flex items-center justify-center font-bold">RMHP</div>
           <div class="h-24 bg-white/10 rounded flex items-center justify-center font-bold">BHA</div>
           <div class="h-24 bg-white/10 rounded flex items-center justify-center font-bold">HCPF</div>
        </div>
      </div>
    </div>
  </section>

  <!-- CTA Section (Split Audience) -->
  <section class="py-24 bg-gray-50">
    <div class="container mx-auto px-4 text-center">
      <h2 class="text-3xl md:text-4xl font-bold text-charcoal mb-12">Join the Ecosystem</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
         <!-- Partners -->
         <div class="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200">
            <h3 class="text-xl font-bold text-charcoal mb-4">For Providers</h3>
            <p class="text-gray-600 mb-6 text-sm">Integrate peer support into your clinical workflow and reduce readmissions.</p>
            <a href="/partners" class="inline-block w-full py-3 px-4 bg-charcoal text-white rounded font-bold text-sm hover:bg-gray-800">Partner With Us</a>
         </div>

         <!-- Investors -->
         <div class="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200">
            <h3 class="text-xl font-bold text-charcoal mb-4">For Investors</h3>
            <p class="text-gray-600 mb-6 text-sm">Invest in the infrastructure of the next generation of recovery care.</p>
            <a href="/investors" class="inline-block w-full py-3 px-4 border border-charcoal text-charcoal rounded font-bold text-sm hover:bg-gray-50">View Investment Data</a>
         </div>

         <!-- Workforce -->
         <div class="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200">
            <h3 class="text-xl font-bold text-charcoal mb-4">For Peers</h3>
            <p class="text-gray-600 mb-6 text-sm">Join our DOL Apprenticeship program and build a certified career.</p>
            <a href="/careers" class="inline-block w-full py-3 px-4 border border-charcoal text-charcoal rounded font-bold text-sm hover:bg-gray-50">Join the Team</a>
         </div>
      </div>
      
      <div class="mt-12 pt-12 border-t border-gray-200 text-sm text-gray-500">
         <p>Looking for individual support? <a href="/get-aid" class="text-green-600 hover:underline">Apply for aid here.</a></p>
      </div>
    </div>
  </section>
</div>
