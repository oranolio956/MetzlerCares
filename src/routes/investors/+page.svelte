<script lang="ts">
  import { onMount } from 'svelte'
  import { trackEvent } from '$lib/utils/analytics'

  onMount(() => {
    trackEvent('investor_page_viewed')
  })
</script>

<svelte:head>
  <title>Investors - Metzler Cares</title>
  <meta
    name="description"
    content="Invest in the future of behavioral health infrastructure. Metzler Cares builds the scalable, tech-enabled operating system for recovery."
  />
</svelte:head>

<div class="min-h-screen bg-white text-charcoal font-sans">
  <!-- Hero -->
  <section class="bg-gradient-to-r from-charcoal to-gray-800 text-white py-24">
    <div class="container mx-auto px-4">
      <div class="max-w-4xl">
        <h1 class="text-4xl md:text-6xl font-bold mb-6 leading-tight">Invest in the Future of <br/><span class="text-green-400">Behavioral Health Infrastructure</span>.</h1>
        <p class="text-xl text-gray-300 mb-8">
          Metzler Cares is not just a service provider; we are a workforce development engine and a data aggregator. We are capitalizing on the rapid expansion of the Peer Support workforce to build the next generation of recovery care.
        </p>
        <div class="flex gap-4">
           <button class="bg-green-500 text-charcoal font-bold py-3 px-8 rounded hover:bg-green-400 transition">Request Pitch Deck</button>
        </div>
      </div>
    </div>
  </section>

  <!-- Key Metrics -->
  <section class="py-20">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
        <!-- TAM -->
        <div class="text-center">
          <div class="text-5xl font-bold text-green-600 mb-2">1 in 7</div>
          <h3 class="text-xl font-bold text-charcoal mb-2">Total Addressable Market</h3>
          <p class="text-gray-600 text-sm">Americans report substance use challenges, yet only 10% receive treatment. Tech-enabled peer support bridges this gap.</p>
        </div>
        
        <!-- Unit Economics -->
        <div class="text-center">
          <div class="text-5xl font-bold text-green-600 mb-2">+40%</div>
          <h3 class="text-xl font-bold text-charcoal mb-2">Unit Economics</h3>
          <p class="text-gray-600 text-sm">By utilizing group billing codes (H0038-HQ) and asynchronous digital support, we optimize revenue-per-peer significantly above industry average.</p>
        </div>

        <!-- Workforce -->
        <div class="text-center">
          <div class="text-5xl font-bold text-green-600 mb-2">$0</div>
          <h3 class="text-xl font-bold text-charcoal mb-2">CAC (Workforce)</h3>
          <p class="text-gray-600 text-sm">Leveraging Colorado Dept of Labor Apprenticeship Grants to subsidize training costs, turning workforce development into a competitive advantage.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Strategic Funding & Innovation -->
  <section class="py-20 bg-gray-50">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl font-bold mb-12 text-center">Hybrid Financial Model</h2>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
         <div>
            <h3 class="text-2xl font-bold mb-4">Non-Dilutive Capital Strategy</h3>
            <p class="text-gray-600 mb-6">
               We leverage a sophisticated mix of funding to de-risk early stage growth:
            </p>
            <ul class="space-y-4">
               <li class="flex items-start">
                  <span class="text-green-500 mr-2">✓</span>
                  <div>
                     <strong>OEDIT Advanced Industries Grants:</strong> Utilizing state-backed innovation funds for "Digital Health" platform development.
                  </div>
               </li>
               <li class="flex items-start">
                  <span class="text-green-500 mr-2">✓</span>
                  <div>
                     <strong>Fiscal Sponsorship:</strong> Partnering with CNDC/Trailhead to access philanthropic capital for health equity initiatives.
                  </div>
               </li>
               <li class="flex items-start">
                  <span class="text-green-500 mr-2">✓</span>
                  <div>
                     <strong>Bridge Financing:</strong> Utilizing the Nonprofit Bridge Loan Fund to manage Medicaid reimbursement cycles and maintain liquidity.
                  </div>
               </li>
            </ul>
         </div>
         
         <div class="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <h3 class="text-2xl font-bold mb-4">Technology Moat</h3>
            <p class="text-gray-600 mb-6">Our platform architecture is built for security and scale, creating high switching costs for partners.</p>
            <div class="space-y-4 text-sm">
               <div class="p-4 bg-gray-50 rounded border-l-4 border-green-500">
                  <strong>HIPAA & 42 CFR Part 2:</strong> Bank-grade encryption for all member data.
               </div>
               <div class="p-4 bg-gray-50 rounded border-l-4 border-blue-500">
                  <strong>API-First Design:</strong> Ready for integration with Epic, Cerner, and HIEs.
               </div>
            </div>
         </div>
      </div>
    </div>
  </section>
</div>
