<script lang="ts">
  import { onMount } from 'svelte'
  import { trackEvent } from '$lib/utils/analytics'

  onMount(() => {
    trackEvent('solutions_page_viewed')
  })
</script>

<svelte:head>
  <title>Solutions - The Metzler Cares Platform</title>
  <meta
    name="description"
    content="Metzler Cares deploys a fully branded, white-label digital experience that keeps members connected, accountable, and supported between clinical sessions."
  />
</svelte:head>

<div class="min-h-screen bg-white text-charcoal font-sans">
  <!-- Hero -->
  <section class="bg-charcoal text-white py-20">
    <div class="container mx-auto px-4 text-center">
      <h1 class="text-4xl md:text-6xl font-bold mb-6">Recovery in Your Pocket.</h1>
      <p class="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
        Recovery doesn't happen in one hour a week. It happens in the 167 hours between sessions. 
        Our platform extends the therapeutic alliance beyond the clinic walls.
      </p>
    </div>
  </section>

  <!-- App Ecosystem -->
  <section class="py-20">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
        <div>
          <div class="inline-block px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-bold uppercase tracking-wide mb-4">The Product</div>
          <h2 class="text-3xl md:text-4xl font-bold mb-6">Integrated Recovery Architecture</h2>
          <p class="text-gray-600 text-lg mb-6">
            We don't just offer 'support'; we offer a continuum of care infrastructure. Metzler Cares deploys a white-label digital experience that keeps members connected, accountable, and supported.
          </p>
          <ul class="space-y-4">
            <li class="flex items-start">
              <svg class="w-6 h-6 text-green-500 mr-3 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
              <div>
                <h4 class="font-bold">Gamified Sobriety Tracking</h4>
                <p class="text-sm text-gray-600">Leveraging behavioral economics to increase dopamine response to positive behaviors.</p>
              </div>
            </li>
            <li class="flex items-start">
              <svg class="w-6 h-6 text-green-500 mr-3 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
              <div>
                <h4 class="font-bold">Geofencing & Risk Alerts</h4>
                <p class="text-sm text-gray-600">GPS-enabled high-risk zone alerts triggering immediate peer intervention protocols.</p>
              </div>
            </li>
            <li class="flex items-start">
              <svg class="w-6 h-6 text-green-500 mr-3 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
              <div>
                <h4 class="font-bold">Tele-Peer Support</h4>
                <p class="text-sm text-gray-600">Secure, HIPAA-compliant video and text messaging built directly into the platform.</p>
              </div>
            </li>
          </ul>
        </div>
        <div class="relative">
           <!-- App UI Placeholder -->
           <div class="w-64 mx-auto h-[500px] bg-gray-900 rounded-[2rem] border-8 border-gray-800 shadow-2xl overflow-hidden relative">
              <div class="absolute top-0 w-full h-8 bg-gray-800 flex justify-center"><div class="w-20 h-4 bg-black rounded-b-xl"></div></div>
              <div class="p-6 mt-8 text-white">
                 <div class="text-center mb-6">
                    <div class="text-4xl font-bold text-green-400">28</div>
                    <div class="text-xs uppercase tracking-widest">Days Sober</div>
                 </div>
                 <div class="space-y-3">
                    <div class="bg-white/10 p-3 rounded flex items-center gap-3">
                       <div class="w-8 h-8 bg-green-500 rounded-full"></div>
                       <div class="text-xs">Check-in Complete</div>
                    </div>
                    <div class="bg-white/10 p-3 rounded flex items-center gap-3">
                       <div class="w-8 h-8 bg-blue-500 rounded-full"></div>
                       <div class="text-xs">Meeting Logged</div>
                    </div>
                    <div class="mt-8 p-4 bg-green-600/20 rounded border border-green-500/50 text-center">
                       <div class="text-sm font-bold text-green-400">Peer Coach</div>
                       <div class="text-xs mt-1">"Great job on the streak, Alex! Let's chat at 2pm."</div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  </section>

  <!-- The Human In The Loop -->
  <section class="py-20 bg-gray-50">
    <div class="container mx-auto px-4 text-center max-w-4xl">
      <h2 class="text-3xl font-bold mb-8">Powered by Certified, Tech-Enabled Professionals</h2>
      <p class="text-lg text-gray-600 mb-12">
        Our Peer Support Professionals (PSPs) are not just mentors; they are certified data-literate recovery coaches.
        We bridge the gap between peer support and clinical care.
      </p>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
        <div class="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
          <h3 class="text-xl font-bold mb-4 text-charcoal">Credentialing & Training</h3>
          <p class="text-gray-600">All peers maintain Colorado Peer and Family Specialist (CPFS) credentials or are in active apprenticeship. We utilize the DOL Apprenticeship model to ensure standardized competency.</p>
        </div>
        <div class="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
          <h3 class="text-xl font-bold mb-4 text-charcoal">Proprietary Supervision</h3>
          <p class="text-gray-600">Our supervision dashboard tracks peer caseloads, burnout indicators, and clinical drift, ensuring strict adherence to RSSO licensing standards and preventing role confusion.</p>
        </div>
      </div>
    </div>
  </section>
  
  <!-- Compliance Footer -->
  <section class="bg-charcoal text-white py-12 text-center">
    <div class="container mx-auto px-4">
       <div class="flex justify-center gap-8 opacity-50 mb-4">
          <span class="font-mono">HIPAA Compliant</span>
          <span class="font-mono">42 CFR Part 2</span>
          <span class="font-mono">SOC2 Type II (Aspirational)</span>
       </div>
       <p class="text-sm text-gray-400">
         Metzler Cares is a licensed Recovery Support Services Organization (RSSO) in the State of Colorado.
       </p>
    </div>
  </section>
</div>
