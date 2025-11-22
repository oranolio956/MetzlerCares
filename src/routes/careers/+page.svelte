<script lang="ts">
  import { onMount } from 'svelte'
  import { trackEvent } from '$lib/utils/analytics'

  onMount(() => {
    trackEvent('careers_page_viewed')
  })
</script>

<svelte:head>
  <title>Careers & Apprenticeship - Metzler Cares</title>
  <meta
    name="description"
    content="Start your career as a Certified Peer Support Professional. Get paid to train through our Department of Labor Registered Apprenticeship."
  />
</svelte:head>

<div class="min-h-screen bg-white text-charcoal font-sans">
  <!-- Hero -->
  <section class="bg-charcoal text-white py-20">
    <div class="container mx-auto px-4 text-center">
      <h1 class="text-4xl md:text-6xl font-bold mb-6">Get Paid to Train. <br/>Become a <span class="text-green-400">Certified Professional</span>.</h1>
      <p class="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
        We are a proud partner of the Colorado Department of Labor's Registered Apprenticeship Program. Don't choose between education and income.
      </p>
      <a href="#apply" class="inline-block bg-green-500 text-charcoal font-bold py-3 px-8 rounded hover:bg-green-400 transition">Apply Now</a>
    </div>
  </section>

  <!-- Apprenticeship Value Prop -->
  <section class="py-20">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
         <div>
            <h2 class="text-3xl font-bold mb-6">The Metzler Apprenticeship</h2>
            <p class="text-lg text-gray-600 mb-6">
               Unlike agencies that rely on variable volunteer labor, Metzler Cares invests in your future. We utilize the QUEST Dislocated Worker Grant and other workforce funding streams to offer paid apprenticeships.
            </p>
            
            <div class="space-y-6">
               <div class="flex">
                  <div class="flex-shrink-0 h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-xl">1</div>
                  <div class="ml-4">
                     <h3 class="text-xl font-bold text-charcoal">Earn While You Learn</h3>
                     <p class="text-gray-600">Receive a competitive hourly wage while completing your 2,000 hours of on-the-job training.</p>
                  </div>
               </div>
               <div class="flex">
                  <div class="flex-shrink-0 h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-xl">2</div>
                  <div class="ml-4">
                     <h3 class="text-xl font-bold text-charcoal">Full Certification Funding</h3>
                     <p class="text-gray-600">We cover the costs of your CPFS certification and ongoing continuing education units.</p>
                  </div>
               </div>
               <div class="flex">
                  <div class="flex-shrink-0 h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-xl">3</div>
                  <div class="ml-4">
                     <h3 class="text-xl font-bold text-charcoal">Defined Career Ladder</h3>
                     <p class="text-gray-600">Move from Apprentice to Peer Professional to Peer Supervisor. We promote from within.</p>
                  </div>
               </div>
            </div>
         </div>
         
         <div class="bg-gray-100 rounded-2xl p-8 border border-gray-200">
            <h3 class="text-2xl font-bold mb-6">Current Openings</h3>
            <div class="space-y-4">
               <div class="bg-white p-4 rounded shadow-sm hover:shadow-md transition cursor-pointer">
                  <div class="flex justify-between items-start">
                     <div>
                        <h4 class="font-bold text-lg text-charcoal">Peer Support Apprentice</h4>
                        <p class="text-sm text-gray-500">Denver Metro • Full-Time</p>
                     </div>
                     <span class="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">Accepting</span>
                  </div>
               </div>
               <div class="bg-white p-4 rounded shadow-sm hover:shadow-md transition cursor-pointer">
                  <div class="flex justify-between items-start">
                     <div>
                        <h4 class="font-bold text-lg text-charcoal">Bilingual Peer Specialist</h4>
                        <p class="text-sm text-gray-500">Remote / Hybrid • Part-Time</p>
                     </div>
                     <span class="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">Accepting</span>
                  </div>
               </div>
               <div class="bg-white p-4 rounded shadow-sm hover:shadow-md transition cursor-pointer opacity-75">
                  <div class="flex justify-between items-start">
                     <div>
                        <h4 class="font-bold text-lg text-charcoal">Clinical Supervisor (LCSW/LPC)</h4>
                        <p class="text-sm text-gray-500">Denver • Contract</p>
                     </div>
                     <span class="bg-gray-200 text-gray-600 text-xs font-bold px-2 py-1 rounded">Waitlist</span>
                  </div>
               </div>
            </div>
            
            <div class="mt-8 text-center">
               <p class="text-xs text-gray-500 mb-4">
                  Metzler Cares is an Equal Opportunity Employer. We value lived experience.
               </p>
               <button class="w-full bg-charcoal text-white font-bold py-3 rounded hover:bg-gray-800">View Application Portal</button>
            </div>
         </div>
      </div>
    </div>
  </section>
</div>
