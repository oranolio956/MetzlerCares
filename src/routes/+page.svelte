<script lang="ts">
  // Removed old component imports to avoid "dashboard" styling leakage
  // We will build the human-centric layout directly here or create new components if needed later.
  
  // Data and locale props are still passed from server, though we might ignore the old 'content' structure 
  // if it's tied to the B2B copy. For this refactor, we'll use the new copy directly.
  export let data: {
    locale: string
  }

  const { locale } = data
</script>

<svelte:head>
  <title>Metzler Cares | A Foundation for Lasting Recovery</title>
  <meta
    name="description"
    content="A safe, dignified path to recovery. We provide holistic support, housing assistance, and seamless care coordination for individuals and families in Colorado and West Virginia."
  />
</svelte:head>

<div class="min-h-screen bg-warm-white text-navy-800 font-sans selection:bg-sage-200 selection:text-navy-900">
  
  <!-- Hero Section -->
  <section class="relative bg-sand-50 pt-24 pb-16 sm:pt-32 sm:pb-24 overflow-hidden">
    <!-- Background Pattern (Subtle, Organic) -->
    <div class="absolute inset-0 opacity-30 pointer-events-none">
       <svg class="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0 100 C 20 0 50 0 100 100 Z" fill="#f5f1e8" fill-opacity="0.4" />
       </svg>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
      <h1 class="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-navy-900 leading-tight mb-6 opacity-0 animate-fade-in" style="animation-delay: 0.1s;">
        A Foundation for <br class="hidden sm:block" />
        <span class="text-sage-600">Lasting Recovery</span>
      </h1>
      
      <p class="max-w-2xl mx-auto text-lg sm:text-xl text-navy-600 mb-10 leading-relaxed opacity-0 animate-slide-up" style="animation-delay: 0.3s;">
        We bridge the gap between treatment and real life. Providing safe housing, holistic support, and a community that believes in your journey.
      </p>
      
      <div class="flex flex-col sm:flex-row justify-center items-center gap-4 opacity-0 animate-slide-up" style="animation-delay: 0.5s;">
        <a 
          href="/get-aid" 
          class="w-full sm:w-auto px-8 py-4 bg-sage-500 hover:bg-sage-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 text-lg"
        >
          Get Help Now
        </a>
        <a 
          href="/approach" 
          class="w-full sm:w-auto px-8 py-4 bg-white border border-sage-200 text-navy-700 font-medium rounded-full hover:bg-sage-50 transition-colors text-lg"
        >
          Our Approach
        </a>
      </div>
    </div>
  </section>

  <!-- Locations Section -->
  <section class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h2 class="text-3xl font-serif font-bold text-navy-900 mb-4">Our Communities</h2>
        <p class="text-navy-600 max-w-2xl mx-auto">
          Rooted in local communities, we offer safe havens where healing can happen.
        </p>
      </div>

      <div class="grid md:grid-cols-2 gap-8 lg:gap-12">
        
        <!-- West Virginia Card -->
        <div class="group relative overflow-hidden rounded-2xl bg-sand-50 border border-sand-100 shadow-sm hover:shadow-md transition-all duration-300">
          <div class="aspect-w-16 aspect-h-9 bg-sage-100 relative overflow-hidden">
             <!-- Placeholder for warm, community image -->
             <div class="absolute inset-0 bg-sage-200/50 flex items-center justify-center text-sage-700 opacity-50">
                [Image: West Virginia Community]
             </div>
          </div>
          <div class="p-8">
            <div class="flex items-center justify-between mb-4">
               <h3 class="text-2xl font-serif font-bold text-navy-800">West Virginia</h3>
               <span class="px-3 py-1 bg-sage-100 text-sage-800 text-xs font-bold uppercase tracking-wider rounded-full">Active</span>
            </div>
            <p class="text-navy-600 mb-6">
              Serving <strong class="text-navy-800">Cabell County</strong> with compassionate, community-led recovery housing and peer support networks.
            </p>
            <ul class="space-y-3 mb-8">
              <li class="flex items-center text-navy-700 text-sm">
                <svg class="w-5 h-5 text-sage-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                Safe, Dignified Housing
              </li>
              <li class="flex items-center text-navy-700 text-sm">
                <svg class="w-5 h-5 text-sage-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                Peer Recovery Coaching
              </li>
              <li class="flex items-center text-navy-700 text-sm">
                <svg class="w-5 h-5 text-sage-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                Seamless Insurance Coordination
              </li>
            </ul>
            <a href="/locations/west-virginia" class="inline-block text-sage-600 font-semibold hover:text-sage-800 transition-colors">
              Learn more &rarr;
            </a>
          </div>
        </div>

        <!-- Colorado Card -->
        <div class="group relative overflow-hidden rounded-2xl bg-sand-50 border border-sand-100 shadow-sm hover:shadow-md transition-all duration-300">
          <div class="aspect-w-16 aspect-h-9 bg-sage-100 relative overflow-hidden">
             <!-- Placeholder for warm, community image -->
             <div class="absolute inset-0 bg-sage-200/50 flex items-center justify-center text-sage-700 opacity-50">
                [Image: Colorado Mountains]
             </div>
          </div>
          <div class="p-8">
            <div class="flex items-center justify-between mb-4">
               <h3 class="text-2xl font-serif font-bold text-navy-800">Colorado</h3>
               <span class="px-3 py-1 bg-sage-100 text-sage-800 text-xs font-bold uppercase tracking-wider rounded-full">Active</span>
            </div>
            <p class="text-navy-600 mb-6">
              A network of licensed recovery residences providing stability and holistic care across the Front Range.
            </p>
            <ul class="space-y-3 mb-8">
              <li class="flex items-center text-navy-700 text-sm">
                <svg class="w-5 h-5 text-sage-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                Licensed Recovery Residences
              </li>
              <li class="flex items-center text-navy-700 text-sm">
                <svg class="w-5 h-5 text-sage-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                Daily Check-ins & Support
              </li>
              <li class="flex items-center text-navy-700 text-sm">
                <svg class="w-5 h-5 text-sage-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                Holistic Support for Real Life
              </li>
            </ul>
            <a href="/locations/colorado" class="inline-block text-sage-600 font-semibold hover:text-sage-800 transition-colors">
              Learn more &rarr;
            </a>
          </div>
        </div>

      </div>
    </div>
  </section>

  <!-- Trust / Standards Section -->
  <section class="py-16 bg-sage-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 class="text-2xl font-serif font-bold text-navy-800 mb-10">Trusted Standards of Care</h2>
      <div class="flex flex-wrap justify-center items-center gap-8 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
        <!-- Placeholders for Trust Badges (HIPAA, NARR, etc.) -->
        <div class="h-12 bg-navy-200/20 rounded w-32 flex items-center justify-center text-navy-400 text-sm font-bold">HIPAA Compliant</div>
        <div class="h-12 bg-navy-200/20 rounded w-32 flex items-center justify-center text-navy-400 text-sm font-bold">NARR Certified</div>
        <div class="h-12 bg-navy-200/20 rounded w-32 flex items-center justify-center text-navy-400 text-sm font-bold">State Licensed</div>
        <div class="h-12 bg-navy-200/20 rounded w-32 flex items-center justify-center text-navy-400 text-sm font-bold">Non-Profit</div>
      </div>
    </div>
  </section>

</div>
