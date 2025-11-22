<script lang="ts">
  import { onMount } from 'svelte'
  import { trackEvent } from '$lib/utils/analytics'

  onMount(() => {
    trackEvent('partners_b2b_viewed')
  })
</script>

<svelte:head>
  <title>Partners - Health Systems & RAEs | Metzler Cares</title>
  <meta
    name="description"
    content="Extend your continuum of care. Reduce readmissions and improve HEDIS scores with Colorado's most advanced tech-enabled peer support network."
  />
</svelte:head>

<div class="min-h-screen bg-white text-charcoal font-sans">
  <!-- Hero -->
  <section class="bg-white pt-20 pb-16 border-b border-gray-100">
    <div class="container mx-auto px-4 text-center">
      <h1 class="text-4xl md:text-6xl font-bold mb-6 text-charcoal">Extend Your <span class="text-green-600">Continuum of Care</span>.</h1>
      <p class="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
        Reduce readmissions and improve HEDIS scores with Colorado's most advanced peer support network. We handle the "warm handoff" so you can focus on clinical excellence.
      </p>
      <div class="flex justify-center gap-4">
        <button class="bg-green-600 text-white font-bold py-3 px-8 rounded hover:bg-green-700 transition shadow-lg shadow-green-200">Schedule Capability Briefing</button>
        <a href="/partners/facility-network" class="bg-white border border-gray-300 text-gray-600 font-bold py-3 px-8 rounded hover:bg-gray-50 transition">Housing Provider? Join Network</a>
      </div>
    </div>
  </section>

  <!-- The Solution Stack -->
  <section class="py-20">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- RAEs -->
        <div class="p-8 border border-gray-200 rounded-xl hover:shadow-xl transition">
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
            <span class="text-2xl font-bold text-green-600">R</span>
          </div>
          <h3 class="text-xl font-bold mb-3">For RAEs</h3>
          <p class="text-gray-600">We help you meet network adequacy standards and drive down the total cost of care for high-utilizer populations through proactive SDOH management.</p>
        </div>

        <!-- Rehabs -->
        <div class="p-8 border border-gray-200 rounded-xl hover:shadow-xl transition">
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
            <span class="text-2xl font-bold text-blue-600">H</span>
          </div>
          <h3 class="text-xl font-bold mb-3">For Rehab Centers</h3>
          <p class="text-gray-600">We provide a turnkey Alumni Program that increases your long-term outcomes data—marketing gold for your facility—while reducing your administrative overhead.</p>
        </div>

        <!-- Hospitals -->
        <div class="p-8 border border-gray-200 rounded-xl hover:shadow-xl transition">
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
            <span class="text-2xl font-bold text-purple-600">+</span>
          </div>
          <h3 class="text-xl font-bold mb-3">For Hospitals</h3>
          <p class="text-gray-600">We reduce ED recidivism by addressing the Social Determinants of Health (housing, food, transport) that drive "frequent flyers" back to the ER.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Tech Deep Dive: Referral Portal -->
  <section class="py-20 bg-charcoal text-white overflow-hidden relative">
    <div class="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center z-10 relative">
       <div>
          <h2 class="text-3xl font-bold mb-6">The Referral Partner Portal</h2>
          <p class="text-gray-300 mb-8 text-lg">
             Stop sending faxes and hoping for the best. Our dedicated portal gives your clinical team total visibility into the post-discharge journey.
          </p>
          
          <div class="space-y-6">
             <div class="flex items-start">
                <div class="bg-white/10 p-2 rounded mr-4">
                   <svg class="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                </div>
                <div>
                   <h4 class="font-bold text-lg">Instant Digital Intake</h4>
                   <p class="text-gray-400 text-sm">Submit referrals in under 60 seconds. Our automated routing engine matches patients with the ideal Peer Coach based on acuity and lived experience.</p>
                </div>
             </div>
             
             <div class="flex items-start">
                <div class="bg-white/10 p-2 rounded mr-4">
                   <svg class="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <div>
                   <h4 class="font-bold text-lg">Closed-Loop Reporting</h4>
                   <p class="text-gray-400 text-sm">Receive automated weekly digests on patient progress, attendance, and sobriety milestones. Data you need for your own grant reporting.</p>
                </div>
             </div>
             
             <div class="flex items-start">
                <div class="bg-white/10 p-2 rounded mr-4">
                   <svg class="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                </div>
                <div>
                   <h4 class="font-bold text-lg">Webhooks & API</h4>
                   <p class="text-gray-400 text-sm">Don't log in to check status. Our system pushes updates (e.g., 'Relapse Alert') directly to your team via secure email or API webhook.</p>
                </div>
             </div>
          </div>
       </div>
       
       <!-- Abstract Portal Visual -->
       <div class="bg-gray-800 rounded-lg p-1 border border-gray-700 shadow-2xl transform rotate-1 hover:rotate-0 transition duration-500">
          <div class="bg-gray-900 rounded h-96 p-6 font-mono text-sm overflow-hidden relative">
             <!-- Header -->
             <div class="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
                <span class="text-gray-500">PORTAL_DASHBOARD // v2.4.1</span>
                <div class="flex space-x-2">
                   <div class="w-3 h-3 rounded-full bg-red-500"></div>
                   <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
                   <div class="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
             </div>
             
             <!-- Code/Data lines -->
             <div class="space-y-2 text-green-400/80">
                <p><span class="text-blue-400">> GET</span> /api/v1/patient/status</p>
                <p><span class="text-gray-500">... Loading records ...</span></p>
                <p>[ { "id": "P-9921", "status": "ENGAGED", "days_sober": 42, "risk_score": "LOW" } ]</p>
                <p class="mt-4"><span class="text-blue-400">> WEBHOOK_EVENT</span>: "CHECK_IN_COMPLETED"</p>
                <p class="ml-4 text-gray-400">{ "timestamp": "2024-11-22T14:30:00Z", "sentiment": "POSITIVE" }</p>
             </div>
             
             <!-- Overlay Card -->
             <div class="absolute bottom-6 right-6 bg-gray-800 p-4 rounded border border-gray-700 shadow-lg max-w-xs">
                <div class="flex items-center gap-3 mb-2">
                   <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                   <span class="text-white font-bold">Live Integration Active</span>
                </div>
                <p class="text-xs text-gray-400">HL7 / FHIR Compatible Data Stream</p>
             </div>
          </div>
       </div>
    </div>
  </section>
  
  <!-- CFO Section -->
  <section class="py-20 bg-gray-50">
     <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl font-bold mb-4 text-charcoal">Fiscal Integrity & Compliance</h2>
        <p class="text-gray-600 max-w-2xl mx-auto mb-12">We handle the complexities of Medicaid billing so you don't have to. Zero clawback risk.</p>
        
        <div class="flex flex-wrap justify-center gap-4">
           <div class="bg-white px-6 py-3 rounded-full shadow-sm border border-gray-200 text-sm font-bold text-gray-700">
              H0038 Coding Precision
           </div>
           <div class="bg-white px-6 py-3 rounded-full shadow-sm border border-gray-200 text-sm font-bold text-gray-700">
              Medical Necessity Validation
           </div>
           <div class="bg-white px-6 py-3 rounded-full shadow-sm border border-gray-200 text-sm font-bold text-gray-700">
              Automated Supervision Logs
           </div>
           <div class="bg-white px-6 py-3 rounded-full shadow-sm border border-gray-200 text-sm font-bold text-gray-700">
              Audit-Proof Records
           </div>
        </div>
     </div>
  </section>
</div>
