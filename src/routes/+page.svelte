<script lang="ts">
  import { onMount } from 'svelte';
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
  import RecoveryBackground from '$lib/components/RecoveryBackground.svelte';

  gsap.registerPlugin(ScrollTrigger);

  let seedElement: HTMLElement;
  let vinePath: SVGPathElement;
  let ecosystemSection: HTMLElement;

  onMount(() => {
    // Hero Animation: Seed Growing
    const tl = gsap.timeline();

    tl.from(seedElement, {
      scale: 0,
      opacity: 0,
      duration: 1.5,
      ease: 'elastic.out(1, 0.3)',
      delay: 0.5
    })
    .to(seedElement, {
      boxShadow: '0 0 30px rgba(242, 204, 143, 0.6)', // Glow effect
      duration: 2,
      repeat: -1,
      yoyo: true
    });

    // Scroll Trigger for Vine
    // Simulating a vine growing down the page
    gsap.fromTo(vinePath, 
      { strokeDasharray: 1000, strokeDashoffset: 1000 },
      {
        strokeDashoffset: 0,
        scrollTrigger: {
          trigger: ecosystemSection,
          start: 'top center',
          end: 'bottom bottom',
          scrub: 1,
        }
      }
    );

    // Animate sections on scroll
    gsap.utils.toArray('.story-node').forEach((node: any) => {
      gsap.from(node, {
        y: 50,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: node,
          start: 'top 80%',
        }
      });
    });
  });
</script>

<svelte:head>
  <title>Metzler Cares | The Recovery Ecosystem</title>
  <meta name="description" content="Planting the seeds of lasting recovery. A digital ecosystem for behavioral health." />
</svelte:head>

<!-- Background 3D Elements -->
<RecoveryBackground />

<!-- Main Container -->
<div class="min-h-screen text-recovery-slate font-body overflow-x-hidden bg-recovery-paper/90 selection:bg-recovery-clay selection:text-white">
  
  <!-- Navigation (Organic Floating Menu) -->
  <nav class="fixed top-6 right-6 z-50">
    <button class="group relative w-14 h-14 bg-recovery-moss rounded-full shadow-forest flex items-center justify-center hover:scale-110 transition-transform duration-300">
      <span class="sr-only">Open Menu</span>
      <div class="space-y-1.5">
        <span class="block w-6 h-0.5 bg-recovery-paper group-hover:rotate-45 transition-transform origin-center"></span>
        <span class="block w-6 h-0.5 bg-recovery-paper group-hover:opacity-0 transition-opacity"></span>
        <span class="block w-6 h-0.5 bg-recovery-paper group-hover:-rotate-45 transition-transform origin-center"></span>
      </div>
      <!-- Hover Bloom Effect (CSS only for simplicity here) -->
      <div class="absolute inset-0 bg-recovery-sun rounded-full -z-10 scale-0 group-hover:scale-150 opacity-0 group-hover:opacity-30 transition-all duration-500"></div>
    </button>
  </nav>

  <!-- HERO SECTION -->
  <section class="relative min-h-screen flex flex-col items-center justify-center text-center px-6">
    
    <!-- The Seed -->
    <div 
      bind:this={seedElement}
      class="w-6 h-6 md:w-8 md:h-8 rounded-full bg-recovery-moss mb-12 relative z-10 cursor-pointer"
      role="button"
      aria-label="Begin the journey"
      tabindex="0"
    ></div>

    <!-- Hero Text -->
    <h1 class="font-heading text-5xl md:text-7xl lg:text-8xl font-bold text-recovery-moss mb-6 tracking-tight">
      The Seed of <span class="italic text-recovery-clay">Recovery</span>
    </h1>

    <p class="max-w-2xl text-xl md:text-2xl text-recovery-slate/80 font-light leading-relaxed mb-12">
      Metzler Cares cultivates a world where certified peer support and technology grow together to heal lives.
    </p>

    <div class="flex flex-col sm:flex-row gap-6">
      <a href="/connect" class="px-8 py-4 bg-recovery-clay text-white rounded-full font-heading text-xl hover:bg-recovery-moss transition-colors shadow-sunset hover:shadow-forest">
        Plant Your Seed
      </a>
      <a href="/about" class="px-8 py-4 border border-recovery-moss/30 text-recovery-moss rounded-full font-heading text-xl hover:bg-recovery-moss/5 transition-colors">
        Explore the Ecosystem
      </a>
    </div>

    <!-- Scroll Indicator -->
    <div class="absolute bottom-10 animate-bounce text-recovery-moss/50">
      <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    </div>
  </section>

  <!-- ECOSYSTEM / JOURNEY SECTION -->
  <section 
    bind:this={ecosystemSection} 
    class="relative py-32 px-6 max-w-7xl mx-auto"
  >
    <!-- The Vine (SVG Path) -->
    <div class="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 -ml-0.5 h-full -z-10 hidden md:block">
      <svg class="w-full h-full overflow-visible" preserveAspectRatio="none">
        <path 
          bind:this={vinePath}
          d="M 0,0 Q -50,200 50,400 T 0,800" 
          fill="none" 
          stroke="#2D4F1E" 
          stroke-width="2"
          vector-effect="non-scaling-stroke"
        />
      </svg>
    </div>

    <!-- Mobile Vertical Line -->
    <div class="absolute left-8 top-0 bottom-0 w-0.5 bg-recovery-moss/20 md:hidden"></div>

    <div class="space-y-40">
      
      <!-- Node 1: The Roots (Integration) -->
      <div class="story-node grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative">
        <div class="md:text-right order-2 md:order-1">
          <span class="font-hand text-recovery-clay text-2xl block mb-2">Step 1: The Roots</span>
          <h2 class="font-heading text-4xl md:text-5xl text-recovery-moss mb-6">Deep Integration</h2>
          <p class="text-lg leading-relaxed">
            Just as roots stabilize a tree, we connect deeply with your existing EHR systems. 
            We provide the stable foundation necessary for growth, ensuring every referral is grounded in data.
          </p>
        </div>
        <div class="relative order-1 md:order-2 pl-12 md:pl-0">
          <!-- Abstract Illustration Placeholder -->
          <div class="w-full aspect-square rounded-full bg-recovery-moss/10 border border-recovery-moss/20 flex items-center justify-center overflow-hidden shadow-forest relative">
             <div class="absolute inset-0 bg-[url('/roots-texture.png')] opacity-20 mix-blend-multiply"></div> <!-- Placeholder texture -->
             <svg class="w-32 h-32 text-recovery-moss" viewBox="0 0 24 24" fill="currentColor">
               <!-- Simple root icon -->
               <path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z" /> 
             </svg>
          </div>
          <!-- Connection Dot -->
          <div class="absolute left-0 md:left-[-3rem] top-1/2 w-4 h-4 bg-recovery-moss rounded-full -translate-x-1/2 -translate-y-1/2 shadow-lg"></div>
        </div>
      </div>

      <!-- Node 2: The Stem (Support) -->
      <div class="story-node grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative">
        <div class="relative pl-12 md:pl-0">
          <div class="w-full aspect-square rounded-full bg-recovery-sun/20 border border-recovery-sun/40 flex items-center justify-center shadow-sunset">
             <span class="text-6xl">🌱</span>
          </div>
           <!-- Connection Dot -->
           <div class="absolute left-0 md:right-[-3rem] top-1/2 w-4 h-4 bg-recovery-sun rounded-full -translate-x-1/2 md:translate-x-1/2 -translate-y-1/2 shadow-lg"></div>
        </div>
        <div>
          <span class="font-hand text-recovery-clay text-2xl block mb-2">Step 2: The Stem</span>
          <h2 class="font-heading text-4xl md:text-5xl text-recovery-moss mb-6">Structural Support</h2>
          <p class="text-lg leading-relaxed">
            Our certified peer coaches provide the strength and structure for daily growth. 
            Like a stem supporting leaves towards the sun, we guide patients through the crucial early stages of recovery.
          </p>
        </div>
      </div>

      <!-- Node 3: The Bloom (Outcomes) -->
      <div class="story-node grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative">
        <div class="md:text-right order-2 md:order-1">
          <span class="font-hand text-recovery-clay text-2xl block mb-2">Step 3: The Bloom</span>
          <h2 class="font-heading text-4xl md:text-5xl text-recovery-moss mb-6">Visible Outcomes</h2>
          <p class="text-lg leading-relaxed">
            Watch your community thrive. With a 14% reduction in readmissions, the results aren't just numbers—they are lives blooming anew.
          </p>
          <a href="/impact" class="inline-block mt-6 text-recovery-clay border-b-2 border-recovery-clay hover:text-recovery-moss hover:border-recovery-moss transition-all font-heading text-xl">
            View Impact Stories &rarr;
          </a>
        </div>
        <div class="relative order-1 md:order-2 pl-12 md:pl-0">
          <div class="w-full aspect-square rounded-full bg-recovery-clay/10 border border-recovery-clay/20 flex items-center justify-center shadow-forest">
             <span class="text-6xl">🌸</span>
          </div>
          <!-- Connection Dot -->
          <div class="absolute left-0 md:left-[-3rem] top-1/2 w-4 h-4 bg-recovery-clay rounded-full -translate-x-1/2 -translate-y-1/2 shadow-lg"></div>
        </div>
      </div>

    </div>
  </section>

  <!-- FOOTER / FOREST FLOOR -->
  <section class="bg-recovery-moss text-recovery-paper py-24 px-6 relative overflow-hidden">
    <div class="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>
    
    <div class="max-w-4xl mx-auto text-center relative z-10">
      <h2 class="font-heading text-4xl md:text-6xl mb-8">Join the Ecosystem</h2>
      <p class="text-xl text-recovery-paper/80 mb-12 max-w-2xl mx-auto">
        Recovery is natural, but it requires the right environment. Let's build it together.
      </p>
      <a href="/contact" class="px-10 py-5 bg-recovery-paper text-recovery-moss rounded-full font-bold text-xl hover:bg-recovery-sun hover:scale-105 transition-all shadow-lg">
        Start the Conversation
      </a>
    </div>
  </section>

</div>

<style>
  /* Custom Scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }
  ::-webkit-scrollbar-track {
    background: #F4F1DE;
  }
  ::-webkit-scrollbar-thumb {
    background: #2D4F1E;
    border-radius: 4px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #E07A5F;
  }
</style>
