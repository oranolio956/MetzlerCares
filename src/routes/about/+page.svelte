<script lang="ts">
  import { onMount } from 'svelte'
  import { trackEvent } from '$lib/utils/analytics'

  onMount(() => {
    trackEvent('about_governance_viewed')
  })
</script>

<svelte:head>
  <title>Governance & Leadership - Metzler Cares</title>
  <meta
    name="description"
    content="Metzler Cares is a licensed Recovery Support Services Organization (RSSO). Learn about our clinical supervision, data privacy, and compliance frameworks."
  />
</svelte:head>

<div class="min-h-screen bg-white text-charcoal font-sans">
  <!-- Hero -->
  <section class="bg-white py-20 border-b border-gray-100">
    <div class="container mx-auto px-4 text-center">
      <h1 class="text-4xl md:text-5xl font-bold mb-6 text-charcoal">Built on a Foundation of <span class="text-green-600">Integrity</span>.</h1>
      <p class="text-xl text-gray-600 max-w-3xl mx-auto">
        We bridge the gap between community support and clinical healthcare. Our governance structure ensures that every interaction is safe, supervised, and effective.
      </p>
    </div>
  </section>

  <!-- Core Compliance Pillars -->
  <section class="py-20">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="p-8 bg-gray-50 rounded-xl border border-gray-100">
           <h3 class="text-xl font-bold mb-4 text-charcoal">Supervision Hierarchy</h3>
           <p class="text-gray-600 text-sm">
              We utilize the BHA-mandated supervision structure. Every peer has a clinical supervisor and an administrative manager. We enforce a strict "Co-Supervision" model to prevent role drift.
           </p>
        </div>
        <div class="p-8 bg-gray-50 rounded-xl border border-gray-100">
           <h3 class="text-xl font-bold mb-4 text-charcoal">Data Privacy</h3>
           <p class="text-gray-600 text-sm">
              Full compliance with HIPAA Security Rules and 42 CFR Part 2 (Confidentiality of Substance Use Disorder Patient Records). We protect our most valuable asset: trust.
           </p>
        </div>
        <div class="p-8 bg-gray-50 rounded-xl border border-gray-100">
           <h3 class="text-xl font-bold mb-4 text-charcoal">Billing Ethics</h3>
           <p class="text-gray-600 text-sm">
              Automated audits of all H0038 claims ensure medical necessity documentation matches billed units. We maintain zero tolerance for waste, fraud, and abuse.
           </p>
        </div>
      </div>
    </div>
  </section>

  <!-- Leadership / Team -->
  <section class="py-20 bg-white">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl font-bold mb-12 text-center">Leadership Team</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
         <!-- Clinical -->
         <div class="text-center">
            <div class="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center text-gray-400 text-4xl font-serif">CD</div>
            <h3 class="text-xl font-bold text-charcoal">Clinical Director</h3>
            <div class="text-green-600 text-sm font-bold mb-4">LCSW / LAC</div>
            <p class="text-gray-600 text-sm">
               Oversees all clinical supervision and medical necessity determinations. Ensures peer interventions align with treatment plans.
            </p>
         </div>

         <!-- Tech -->
         <div class="text-center">
            <div class="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center text-gray-400 text-4xl font-serif">CTO</div>
            <h3 class="text-xl font-bold text-charcoal">Chief Technology Advisor</h3>
            <div class="text-green-600 text-sm font-bold mb-4">Digital Health & Security</div>
            <p class="text-gray-600 text-sm">
               Architects the "ConnectRecovery" platform. Focused on interoperability, data security, and scalable infrastructure.
            </p>
         </div>

         <!-- Compliance -->
         <div class="text-center">
            <div class="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center text-gray-400 text-4xl font-serif">CO</div>
            <h3 class="text-xl font-bold text-charcoal">Compliance Officer</h3>
            <div class="text-green-600 text-sm font-bold mb-4">RSSO & Medicaid Policy</div>
            <p class="text-gray-600 text-sm">
               Manages state licensure, Medicaid audits, and 42 CFR Part 2 adherence. The guardian of our regulatory standing.
            </p>
         </div>
      </div>
    </div>
  </section>
  
  <!-- Legal Disclaimers -->
  <section class="py-12 bg-gray-100 border-t border-gray-200">
     <div class="container mx-auto px-4 text-sm text-gray-500">
        <h4 class="font-bold text-gray-700 mb-2">Important Disclaimers</h4>
        <p class="mb-4">
           <strong>Not Medical Advice:</strong> Peer Support Professionals (PSPs) provide non-clinical recovery coaching and mentorship. They do not provide medical diagnosis, psychotherapy, or clinical treatment. All services are non-clinical in nature, though they may be supervised by licensed clinicians for billing purposes.
        </p>
        <p>
           <strong>Emergency Services:</strong> Metzler Cares is not a crisis response agency. If you or someone you know is experiencing a medical or psychiatric emergency, please dial 911 or the Colorado Crisis Services line at 988 immediately.
        </p>
     </div>
  </section>
</div>
