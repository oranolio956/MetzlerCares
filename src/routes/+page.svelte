<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { goto } from '$app/navigation';
  import PremiumTrustSignals from '$lib/components/premium/PremiumTrustSignals.svelte';
  
  let mounted = false;
  
  onMount(() => {
    mounted = true;
  });

  const features = [
    {
      title: "Instant Verification",
      description: "No more waiting weeks. Our automated system verifies eligibility in seconds.",
      icon: "⚡",
      color: "bg-electric-violet"
    },
    {
      title: "Dignified Housing",
      description: "Access our network of verified, high-quality sober living homes.",
      icon: "🏠",
      color: "bg-neon-mint"
    },
    {
      title: "Secure Funding",
      description: "Grants are paid directly to providers, ensuring transparency and trust.",
      icon: "🔒",
      color: "bg-hot-coral"
    }
  ];

  const stats = [
    { value: "$2.5M", label: "Aid Distributed" },
    { value: "1,200+", label: "Lives Impacted" },
    { value: "450+", label: "Partner Facilities" }
  ];
</script>

<svelte:head>
  <title>Metzler Foundations | The Modern Safety Net</title>
  <meta name="description" content="Instant aid, dignified housing, and a path forward. Metzler Foundations is rebuilding the safety net for recovery." />
</svelte:head>

<div class="min-h-screen flex flex-col">
  
  <!-- Hero Section -->
  <section class="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-warm-alabaster">
    <!-- Background Image -->
    <div class="absolute inset-0 z-0">
      <img 
        src="/assets/hero-bg.png" 
        alt="Abstract Background" 
        class="w-full h-full object-cover opacity-80"
      />
      <div class="absolute inset-0 bg-gradient-to-b from-white/50 to-warm-alabaster"></div>
    </div>

    <div class="container mx-auto px-4 z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <!-- Text Content -->
      <div class="text-center lg:text-left space-y-8">
        <div class="inline-flex items-center px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-electric-violet/20 shadow-sm">
          <span class="w-2 h-2 rounded-full bg-neon-mint mr-2 animate-pulse"></span>
          <span class="text-sm font-bold text-electric-violet tracking-wide uppercase">The Modern Safety Net</span>
        </div>
        
        <h1 class="text-5xl md:text-7xl font-bold text-gray-900 leading-tight tracking-tight">
          Recovery funding, <br />
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-electric-violet to-hot-coral">reimagined.</span>
        </h1>
        
        <p class="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
          We've replaced the red tape with technology. Get approved for housing grants in minutes, not months.
        </p>
        
        <div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
          <a 
            href="/get-aid/apply" 
            class="w-full sm:w-auto px-8 py-4 bg-electric-violet text-white rounded-xl font-bold text-lg shadow-lg shadow-electric-violet/30 hover:shadow-xl hover:translate-y-[-2px] transition-all flex items-center justify-center"
          >
            Get Aid Now
            <svg class="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </a>
          <a 
            href="/partners" 
            class="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 border-2 border-gray-200 rounded-xl font-bold text-lg hover:border-electric-violet hover:text-electric-violet transition-all flex items-center justify-center"
          >
            Partner with Us
          </a>
        </div>

        <div class="pt-8 flex items-center justify-center lg:justify-start space-x-4 text-sm text-gray-500 font-medium">
          <div class="flex -space-x-2">
            <div class="w-8 h-8 rounded-full bg-gray-200 border-2 border-white"></div>
            <div class="w-8 h-8 rounded-full bg-gray-300 border-2 border-white"></div>
            <div class="w-8 h-8 rounded-full bg-gray-400 border-2 border-white"></div>
          </div>
          <p>Trusted by 1,200+ individuals this month</p>
        </div>
      </div>

      <!-- Mascot / Visual -->
      <div class="relative hidden lg:block">
        {#if mounted}
          <div in:fly={{ y: 50, duration: 1000, delay: 200 }} class="relative z-10">
            <img 
              src="/assets/spark-mascot.png" 
              alt="Spark Mascot" 
              class="w-full max-w-md mx-auto drop-shadow-2xl animate-float"
            />
          </div>
        {/if}
        
        <!-- Decorative Elements -->
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-electric-violet/20 rounded-full blur-3xl filter mix-blend-multiply animate-pulse-slow"></div>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-neon-mint/20 rounded-full blur-3xl filter mix-blend-multiply animate-pulse-slow" style="animation-delay: 1s"></div>
      </div>
    </div>
  </section>

  <!-- Features Section -->
  <section class="py-24 bg-white relative overflow-hidden">
    <div class="container mx-auto px-4">
      <div class="text-center max-w-3xl mx-auto mb-16">
        <h2 class="text-4xl font-bold mb-6">The old way is broken. <br /> <span class="text-electric-violet">We fixed it.</span></h2>
        <p class="text-xl text-gray-600">Traditional aid is slow, confusing, and stigmatizing. We built a platform that treats you like a human, not a case number.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        {#each features as feature, i}
          <div class="group p-8 rounded-3xl bg-warm-alabaster border border-gray-100 hover:bg-white hover:shadow-xl hover:shadow-electric-violet/10 transition-all duration-300 relative overflow-hidden">
            <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-transparent to-gray-100 rounded-bl-full opacity-50 group-hover:scale-110 transition-transform"></div>
            
            <div class={`w-16 h-16 rounded-2xl ${feature.color} bg-opacity-10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300`}>
              <span class="text-3xl">{feature.icon}</span>
            </div>
            
            <h3 class="text-2xl font-bold mb-4">{feature.title}</h3>
            <p class="text-gray-600 leading-relaxed">{feature.description}</p>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- Impact Stats -->
  <section class="py-20 bg-gray-900 text-white relative overflow-hidden">
    <div class="absolute inset-0 bg-[url('/assets/hero-bg.png')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
    <div class="container mx-auto px-4 relative z-10">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
        {#each stats as stat}
          <div>
            <div class="text-5xl md:text-6xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-neon-mint to-electric-violet font-primary">
              {stat.value}
            </div>
            <div class="text-xl text-gray-400 font-medium">{stat.label}</div>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- Trust Signals -->
  <section class="py-16 bg-warm-alabaster border-t border-gray-200">
    <div class="container mx-auto px-4">
      <PremiumTrustSignals />
    </div>
  </section>

  <!-- CTA Section -->
  <section class="py-24 relative overflow-hidden">
    <div class="absolute inset-0 bg-electric-violet"></div>
    <div class="absolute inset-0 bg-gradient-to-br from-electric-violet to-indigo-900"></div>
    
    <div class="container mx-auto px-4 relative z-10 text-center">
      <h2 class="text-4xl md:text-5xl font-bold text-white mb-8">Ready to start your journey?</h2>
      <p class="text-xl text-white/80 max-w-2xl mx-auto mb-12">
        Join thousands of others who have found stability and hope through Metzler Foundations.
      </p>
      <a 
        href="/get-aid/apply" 
        class="inline-flex items-center px-10 py-5 bg-white text-electric-violet rounded-full font-bold text-xl shadow-2xl hover:shadow-white/20 hover:scale-105 transition-all"
      >
        Apply in 5 Minutes
        <svg class="w-6 h-6 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </a>
    </div>
  </section>

</div>

<style>
  .animate-float {
    animation: float 6s ease-in-out infinite;
  }
  
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
    100% { transform: translateY(0px); }
  }
</style>