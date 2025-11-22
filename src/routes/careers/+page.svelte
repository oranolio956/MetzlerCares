<script lang="ts">
  import { onMount } from 'svelte'
  import { fade, fly } from 'svelte/transition'

  const benefits = [
    {
      title: 'Earn While You Learn',
      description: 'We utilize the QUEST Dislocated Worker Grant and other workforce funding streams to offer paid apprenticeships. You don\'t have to choose between education and income.',
      icon: 'currency-dollar'
    },
    {
      title: 'Career Ladder',
      description: 'Move from Apprentice to Peer Professional to Peer Supervisor. We fund your CPFS certification and ongoing education. We invest in your future.',
      icon: 'trending-up'
    },
    {
      title: 'Meaningful Impact',
      description: 'Use your lived experience to help others navigate the path to recovery. Turn your past challenges into your greatest professional asset.',
      icon: 'heart'
    }
  ]

  let visible = false
  onMount(() => {
    visible = true
  })
</script>

<svelte:head>
  <title>Careers | Metzler Cares</title>
  <meta name="description" content="Get paid to train as a Peer Support Specialist. Join our DOL Registered Apprenticeship program and build a career in behavioral health." />
</svelte:head>

<div class="min-h-screen bg-tech-primary text-warm-gray font-sans selection:bg-tech-accent selection:text-white pt-20">

  <!-- Hero Section -->
  <section class="relative py-24 overflow-hidden">
    <div class="container mx-auto px-4 relative z-10">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <div class="inline-flex items-center px-3 py-1 rounded-full border border-tech-accent/30 bg-tech-accent/10 text-tech-accent text-sm font-medium mb-6">
            DOL Registered Apprenticeship
          </div>
          <h1 class="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Get Paid to Train. <br/>
            Become a <span class="text-tech-teal">Certified Professional</span>.
          </h1>
          <p class="text-xl text-gray-400 mb-8 leading-relaxed">
            Metzler Cares is a proud partner of the Colorado Department of Labor's Registered Apprenticeship Program. We turn workforce development into a competitive advantage.
          </p>
          <div class="flex flex-col sm:flex-row gap-4">
            <a href="/contact" class="px-8 py-4 bg-tech-accent text-white rounded-lg font-bold hover:bg-blue-600 transition-all text-center">
              Apply for Apprenticeship
            </a>
          </div>
        </div>
        
        <!-- Visual -->
        <div class="relative">
          <div class="absolute inset-0 bg-gradient-to-r from-tech-accent to-purple-600 rounded-2xl transform rotate-3 opacity-20 blur-lg"></div>
          <div class="relative bg-tech-secondary border border-gray-700 rounded-2xl p-8 shadow-2xl">
            <div class="flex items-center gap-4 mb-8 border-b border-gray-700 pb-6">
              <div class="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center text-2xl">👨‍🏫</div>
              <div>
                <div class="text-white font-bold text-lg">Certified Peer Specialist</div>
                <div class="text-tech-accent font-medium">Career Pathway</div>
              </div>
            </div>
            
            <div class="space-y-8 relative">
              <div class="absolute left-3.5 top-2 bottom-2 w-0.5 bg-gray-700"></div>
              
              <div class="relative pl-10">
                <div class="absolute left-0 top-1 w-8 h-8 bg-tech-primary border-2 border-tech-accent rounded-full flex items-center justify-center text-xs font-bold text-white z-10">1</div>
                <h3 class="text-white font-bold mb-1">Apprentice Peer Coach</h3>
                <p class="text-gray-500 text-sm">Paid on-the-job training (2,000 hours). Supervision & mentorship.</p>
              </div>
              
              <div class="relative pl-10">
                <div class="absolute left-0 top-1 w-8 h-8 bg-tech-primary border-2 border-tech-accent rounded-full flex items-center justify-center text-xs font-bold text-white z-10">2</div>
                <h3 class="text-white font-bold mb-1">Certified Peer Specialist (CPFS)</h3>
                <p class="text-gray-500 text-sm">State credentialed. Independent caseload management.</p>
              </div>
              
              <div class="relative pl-10">
                <div class="absolute left-0 top-1 w-8 h-8 bg-tech-primary border-2 border-tech-accent rounded-full flex items-center justify-center text-xs font-bold text-white z-10">3</div>
                <h3 class="text-white font-bold mb-1">Peer Supervisor</h3>
                <p class="text-gray-500 text-sm">Clinical oversight training. Team leadership.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Benefits Grid -->
  <section class="py-24 bg-tech-secondary/30 border-y border-gray-800">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        {#each benefits as benefit}
          <div class="p-8 bg-tech-secondary border border-gray-800 rounded-xl hover:border-tech-accent transition-colors group">
            <div class="w-12 h-12 bg-tech-primary rounded-lg flex items-center justify-center mb-6 text-tech-accent group-hover:scale-110 transition-transform">
              {#if benefit.icon === 'currency-dollar'}
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {:else if benefit.icon === 'trending-up'}
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              {:else}
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              {/if}
            </div>
            <h3 class="text-xl font-bold text-white mb-3">{benefit.title}</h3>
            <p class="text-gray-400 leading-relaxed">{benefit.description}</p>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- Funding Partners -->
  <section class="py-20">
    <div class="container mx-auto px-4 text-center">
      <p class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-8">Supported By</p>
      <div class="flex flex-wrap justify-center items-center gap-12 opacity-60 grayscale hover:grayscale-0 transition-all">
        <div class="text-xl font-bold text-white">Colorado Dept of Labor & Employment</div>
        <div class="text-xl font-bold text-white">QUEST Grant</div>
        <div class="text-xl font-bold text-white">WIOA</div>
      </div>
    </div>
  </section>

</div>
