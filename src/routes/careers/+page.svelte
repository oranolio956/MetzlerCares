<script lang="ts">
  import { onMount } from 'svelte'
  import { fade, fly } from 'svelte/transition'
  import gsap from 'gsap'
  import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
  import RecoveryBackground from '$lib/components/RecoveryBackground.svelte'

  gsap.registerPlugin(ScrollTrigger);

  const benefits = [
    {
      title: 'Earn While You Learn',
      description: 'We utilize the QUEST Dislocated Worker Grant and other workforce funding streams to offer paid apprenticeships. You don\'t have to choose between education and income.',
      icon: '🎓',
      color: '#F2CC8F'
    },
    {
      title: 'Career Ladder',
      description: 'Move from Apprentice to Peer Professional to Peer Supervisor. We fund your CPFS certification and ongoing education. We invest in your future.',
      icon: '🪜',
      color: '#E07A5F'
    },
    {
      title: 'Meaningful Impact',
      description: 'Use your lived experience to help others navigate the path to recovery. Turn your past challenges into your greatest professional asset.',
      icon: '❤️',
      color: '#F4F1DE'
    }
  ]

  onMount(() => {
    gsap.from('.career-hero', {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power2.out'
    })

    gsap.utils.toArray('.benefit-card').forEach((card: any, i) => {
      gsap.from(card, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: i * 0.2,
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
        }
      })
    })
  })
</script>

<svelte:head>
  <title>Careers | Metzler Cares</title>
  <meta name="description" content="Get paid to train as a Peer Support Specialist. Join our DOL Registered Apprenticeship program and build a career in behavioral health." />
</svelte:head>

<RecoveryBackground />

<div class="min-h-screen bg-recovery-paper/90 text-recovery-slate font-body pt-24 px-6">

  <!-- Hero Section -->
  <section class="career-hero relative py-24 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-16">
    <div>
      <div class="inline-flex items-center px-4 py-1 rounded-full border border-recovery-moss/30 bg-recovery-moss/5 text-recovery-moss text-sm font-bold mb-6">
        DOL Registered Apprenticeship
      </div>
      <h1 class="font-heading text-5xl md:text-7xl font-bold text-recovery-moss mb-8 leading-tight">
        Get Paid to Train. <br/>
        <span class="italic text-recovery-clay">Grow a Career.</span>
      </h1>
      <p class="text-xl text-recovery-slate/80 mb-8 leading-relaxed">
        Metzler Cares is a proud partner of the Colorado Department of Labor's Registered Apprenticeship Program. We turn workforce development into a competitive advantage.
      </p>
      <div class="flex flex-col sm:flex-row gap-4">
        <a href="/contact" class="px-8 py-4 bg-recovery-moss text-white rounded-full font-bold hover:bg-recovery-clay transition-all shadow-forest hover:shadow-sunset text-center">
          Apply for Apprenticeship
        </a>
      </div>
    </div>
    
    <!-- Visual: Career Tree -->
    <div class="relative hidden lg:block">
      <div class="bg-white rounded-[3rem] p-8 border border-recovery-moss/10 shadow-xl relative overflow-hidden">
         <div class="absolute inset-0 bg-[url('/tree-rings.svg')] opacity-5"></div>
         <div class="relative z-10 space-y-12 pl-8 border-l-4 border-recovery-moss/20 ml-8 py-4">
            <!-- Step 1 -->
            <div class="relative">
               <div class="absolute -left-[42px] top-0 w-6 h-6 rounded-full bg-recovery-paper border-4 border-recovery-moss"></div>
               <h3 class="font-heading text-2xl font-bold text-recovery-moss">Apprentice Peer Coach</h3>
               <p class="text-recovery-slate/70 text-sm mt-1">Paid on-the-job training (2,000 hours).</p>
            </div>
            
            <!-- Step 2 -->
            <div class="relative">
               <div class="absolute -left-[42px] top-0 w-6 h-6 rounded-full bg-recovery-sun border-4 border-recovery-moss"></div>
               <h3 class="font-heading text-2xl font-bold text-recovery-moss">Certified Peer Specialist</h3>
               <p class="text-recovery-slate/70 text-sm mt-1">State credentialed (CPFS).</p>
            </div>

            <!-- Step 3 -->
            <div class="relative">
               <div class="absolute -left-[42px] top-0 w-6 h-6 rounded-full bg-recovery-clay border-4 border-recovery-moss"></div>
               <h3 class="font-heading text-2xl font-bold text-recovery-moss">Peer Supervisor</h3>
               <p class="text-recovery-slate/70 text-sm mt-1">Clinical oversight & leadership.</p>
            </div>
         </div>
      </div>
    </div>
  </section>

  <!-- Benefits Grid -->
  <section class="py-24">
    <div class="container mx-auto max-w-6xl">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
        {#each benefits as benefit}
          <div class="benefit-card p-8 bg-white border border-recovery-moss/10 rounded-[2rem] hover:shadow-forest transition-all group relative overflow-hidden">
            <div class="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl opacity-20 -mr-10 -mt-10" style="background-color: {benefit.color}"></div>
            
            <div class="w-16 h-16 bg-recovery-paper rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm group-hover:scale-110 transition-transform">
              {benefit.icon}
            </div>
            <h3 class="font-heading text-2xl font-bold text-recovery-moss mb-4">{benefit.title}</h3>
            <p class="text-recovery-slate/70 leading-relaxed">{benefit.description}</p>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- Partners -->
  <section class="py-24 text-center border-t border-recovery-moss/10">
    <p class="text-sm font-bold text-recovery-clay uppercase tracking-wider mb-12">Supported By</p>
    <div class="flex flex-wrap justify-center gap-12 md:gap-24 opacity-60">
       <span class="text-xl font-heading font-bold text-recovery-moss">Colorado Dept of Labor</span>
       <span class="text-xl font-heading font-bold text-recovery-moss">QUEST Grant</span>
       <span class="text-xl font-heading font-bold text-recovery-moss">WIOA</span>
    </div>
  </section>

</div>
