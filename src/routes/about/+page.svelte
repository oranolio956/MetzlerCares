<script lang="ts">
  import { onMount } from 'svelte'
  import { fade, fly } from 'svelte/transition'
  import gsap from 'gsap'
  import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
  import RecoveryBackground from '$lib/components/RecoveryBackground.svelte'

  gsap.registerPlugin(ScrollTrigger);

  const leadership = [
    {
      name: 'Clinical Advisory Board',
      role: 'Oversight',
      description: 'Comprised of licensed LCSWs and LACs, our advisory board reviews all peer supervision protocols to ensure clinical integrity and prevent scope creep.',
      icon: '👁️'
    },
    {
      name: 'Lived Experience Council',
      role: 'Strategy',
      description: 'A rotating council of alumni and current peer specialists who guide our product roadmap, ensuring our technology remains human-centered.',
      icon: '🗣️'
    },
    {
      name: 'Compliance Office',
      role: 'Governance',
      description: 'Dedicated internal audit team focused on Medicaid H0038 documentation standards, 42 CFR Part 2 data privacy, and RSSO licensing requirements.',
      icon: '⚖️'
    }
  ]

  let visible = false
  onMount(() => {
    visible = true

    // Animate Trees/Cards
    gsap.utils.toArray('.grove-tree').forEach((tree: any, i) => {
      gsap.from(tree, {
        y: 100,
        opacity: 0,
        duration: 1,
        delay: i * 0.2,
        scrollTrigger: {
          trigger: tree,
          start: 'top 90%',
        }
      });
    });

    // Animate Mission
    gsap.from('.mission-text', {
      opacity: 0,
      scale: 0.9,
      duration: 1.5,
      scrollTrigger: {
        trigger: '.mission-section',
        start: 'top 70%',
      }
    });
  })
</script>

<svelte:head>
  <title>The Grove | Metzler Cares</title>
  <meta name="description" content="The roots of our recovery ecosystem. Licensed governance, clinical oversight, and lived experience." />
</svelte:head>

<RecoveryBackground />

<div class="min-h-screen text-recovery-slate font-body overflow-hidden bg-recovery-paper/90 selection:bg-recovery-clay selection:text-white pt-20">

  <!-- Hero Section: The Canopy -->
  <section class="relative py-24 md:py-32 overflow-hidden text-center px-6">
    <div class="relative z-10 max-w-4xl mx-auto">
      <span class="font-hand text-3xl text-recovery-clay block mb-4" in:fly="{{ y: 20, duration: 1000 }}">Our Roots & Canopy</span>
      <h1 class="font-heading text-5xl md:text-7xl font-bold text-recovery-moss mb-8 leading-tight" in:fly="{{ y: 20, duration: 1000, delay: 200 }}">
        Governance & <span class="italic text-recovery-clay">Mission</span>
      </h1>
      <p class="text-xl md:text-2xl text-recovery-slate/80 leading-relaxed" in:fly="{{ y: 20, duration: 1000, delay: 400 }}">
        We are not just a tech company. We are a licensed Recovery Support Services Organization (RSSO) cultivating the digital infrastructure for sustainable recovery.
      </p>
    </div>
    
    <!-- Decorative Background Elements -->
    <div class="absolute top-0 left-0 w-64 h-64 bg-recovery-moss/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
    <div class="absolute bottom-0 right-0 w-96 h-96 bg-recovery-sun/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none"></div>
  </section>

  <!-- Mission Section: The Soil -->
  <section class="mission-section py-24 relative">
    <!-- Wavy Divider Top -->
    <div class="absolute top-0 left-0 w-full overflow-hidden leading-none rotate-180 text-recovery-paper">
       <svg class="relative block w-[calc(100%+1.3px)] h-[50px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#F4F1DE" opacity="0.5"></path>
      </svg>
    </div>

    <div class="container mx-auto px-6 text-center relative z-10">
      <div class="max-w-5xl mx-auto mission-text bg-white/40 backdrop-blur-sm p-12 rounded-[3rem] shadow-forest border border-white/50">
        <h2 class="font-heading text-3xl md:text-4xl font-bold text-recovery-moss mb-8">Our Mandate</h2>
        <p class="text-2xl md:text-4xl text-recovery-clay font-hand leading-relaxed">
          "To bridge the gap between clinical treatment and long-term recovery through data-driven, human-centered infrastructure."
        </p>
      </div>
    </div>
  </section>

  <!-- Leadership: The Grove -->
  <section class="py-24 px-6">
    <div class="container mx-auto max-w-7xl">
      <h2 class="font-heading text-4xl md:text-5xl font-bold text-recovery-moss mb-16 text-center">The Grove Structure</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
        {#each leadership as leader}
          <div class="grove-tree group relative">
             <!-- Tree Trunk/Card -->
            <div class="bg-white rounded-[2rem] p-8 pt-16 h-full border border-recovery-moss/10 shadow-sm hover:shadow-forest transition-all duration-500 relative z-10 overflow-hidden">
              <!-- Leaf Decoration -->
              <div class="absolute top-0 right-0 w-32 h-32 bg-recovery-moss/5 rounded-bl-full -mr-8 -mt-8 transition-transform duration-500 group-hover:scale-125"></div>
              
              <div class="absolute -top-8 left-8 w-16 h-16 bg-recovery-paper border-2 border-recovery-moss rounded-2xl rotate-12 flex items-center justify-center text-3xl shadow-lg group-hover:rotate-0 transition-transform duration-300">
                {leader.icon}
              </div>

              <div class="font-bold text-sm uppercase tracking-wider mb-3 text-recovery-clay">{leader.role}</div>
              <h3 class="font-heading text-2xl font-bold text-recovery-moss mb-4">{leader.name}</h3>
              <p class="text-recovery-slate/70 leading-relaxed">{leader.description}</p>
            </div>
            
            <!-- Root Shadow -->
            <div class="absolute -bottom-4 left-4 right-4 h-8 bg-black/5 blur-xl rounded-full -z-10"></div>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- Compliance: The Guardians -->
  <section class="py-24 bg-recovery-moss/5 border-t border-recovery-moss/10 relative">
    <div class="container mx-auto px-6 text-center">
      <h2 class="font-heading text-3xl md:text-4xl font-bold text-recovery-moss mb-12">Regulatory Guardians</h2>
      
      <div class="flex flex-wrap justify-center gap-12 md:gap-24">
        <!-- RSSO -->
        <div class="flex flex-col items-center gap-6 group">
          <div class="w-24 h-24 rounded-full bg-recovery-paper border-2 border-recovery-moss flex items-center justify-center text-recovery-moss font-bold text-xl shadow-forest group-hover:scale-110 transition-transform duration-300 relative">
            RSSO
            <div class="absolute inset-0 border-4 border-recovery-clay/20 rounded-full animate-pulse-slow"></div>
          </div>
          <div class="text-recovery-moss font-bold font-heading text-xl">Licensed RSSO</div>
        </div>

        <!-- HIPAA -->
        <div class="flex flex-col items-center gap-6 group">
          <div class="w-24 h-24 rounded-full bg-recovery-paper border-2 border-recovery-moss flex items-center justify-center text-recovery-moss font-bold text-xl shadow-forest group-hover:scale-110 transition-transform duration-300 relative">
            HIPAA
             <div class="absolute inset-0 border-4 border-recovery-sun/20 rounded-full animate-pulse-slow" style="animation-delay: 0.5s;"></div>
          </div>
          <div class="text-recovery-moss font-bold font-heading text-xl">HIPAA Compliant</div>
        </div>

        <!-- H0038 -->
        <div class="flex flex-col items-center gap-6 group">
          <div class="w-24 h-24 rounded-full bg-recovery-paper border-2 border-recovery-moss flex items-center justify-center text-recovery-moss font-bold text-xl shadow-forest group-hover:scale-110 transition-transform duration-300 relative">
            H0038
             <div class="absolute inset-0 border-4 border-recovery-clay/20 rounded-full animate-pulse-slow" style="animation-delay: 1s;"></div>
          </div>
          <div class="text-recovery-moss font-bold font-heading text-xl">Medicaid Enrolled</div>
        </div>
      </div>
    </div>
  </section>

</div>
