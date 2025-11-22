<script lang="ts">
  import { onMount } from 'svelte'
  import { fade, fly } from 'svelte/transition'
  import gsap from 'gsap'
  import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
  import RecoveryBackground from '$lib/components/RecoveryBackground.svelte'

  gsap.registerPlugin(ScrollTrigger);

  const features = [
    {
      title: 'Gamified Sobriety Tracking',
      description: 'Leveraging behavioral economics, our app uses point systems, streaks, and badges to gamify the early stages of recovery. This increases dopamine response to positive behaviors, improving retention rates.',
      icon: '🌱',
      color: '#F2CC8F'
    },
    {
      title: 'Geofencing & Risk Alerts',
      description: 'Optional GPS-enabled features allow members to identify "high-risk" zones. If a boundary is breached, the app prompts a check-in or alerts the assigned Peer Coach for immediate outreach.',
      icon: '📍',
      color: '#E07A5F'
    },
    {
      title: 'Tele-Peer Support',
      description: 'Secure, HIPAA-compliant video and text messaging built directly into the platform. This allows for billing of synchronous telehealth codes where applicable and ensures rural access.',
      icon: '💬',
      color: '#F4F1DE'
    },
    {
      title: 'Asynchronous Learning',
      description: 'On-demand access to CBT-based exercises, mindfulness modules, and recovery literature. Usage data is tracked to demonstrate member engagement to clinical partners.',
      icon: '📖',
      color: '#2D4F1E'
    }
  ]

  let pathLine: SVGPathElement;

  onMount(() => {
    // Animate the path
    gsap.fromTo(pathLine, 
      { strokeDasharray: 2000, strokeDashoffset: 2000 },
      {
        strokeDashoffset: 0,
        scrollTrigger: {
          trigger: '.growth-path',
          start: 'top center',
          end: 'bottom bottom',
          scrub: 1,
        }
      }
    );

    // Animate blooms
    gsap.utils.toArray('.bloom-feature').forEach((bloom: any) => {
      gsap.from(bloom, {
        scale: 0.8,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: bloom,
          start: 'top 80%',
        }
      });
    });
  })
</script>

<svelte:head>
  <title>The Growth Path | Metzler Cares</title>
  <meta name="description" content="Recovery in your pocket. A digital ecosystem that grows with you." />
</svelte:head>

<RecoveryBackground />

<div class="min-h-screen font-body text-recovery-slate bg-recovery-paper/90 pt-24 px-6 overflow-hidden">
  
  <!-- Hero -->
  <section class="text-center max-w-4xl mx-auto mb-32 relative z-10">
    <span class="font-hand text-3xl text-recovery-moss block mb-4">Your Digital Companion</span>
    <h1 class="font-heading text-5xl md:text-7xl font-bold text-recovery-moss mb-8">Recovery in Your Pocket</h1>
    <p class="text-xl text-recovery-slate/80 leading-relaxed max-w-2xl mx-auto">
      Recovery doesn't happen in one hour a week. It happens in the 167 hours between sessions. We deploy a living, breathing digital experience that keeps members connected.
    </p>
  </section>

  <!-- The Growth Path -->
  <section class="growth-path relative max-w-6xl mx-auto pb-32">
    
    <!-- The Central Vine (SVG) -->
    <div class="absolute left-1/2 top-0 bottom-0 w-1 -ml-0.5 h-full -z-10 hidden md:block">
      <svg class="w-full h-full overflow-visible" preserveAspectRatio="none">
        <path 
          bind:this={pathLine}
          d="M 0,0 Q 100,200 -100,400 T 0,800 T 0,1200" 
          fill="none" 
          stroke="#2D4F1E" 
          stroke-width="3"
          stroke-linecap="round"
          vector-effect="non-scaling-stroke"
          class="opacity-30"
        />
      </svg>
    </div>

    <div class="space-y-32">
      {#each features as feature, i}
        <div class="bloom-feature grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative {i % 2 === 0 ? '' : 'md:text-right'}">
          
          <div class="{i % 2 === 0 ? 'md:order-1' : 'md:order-2'}">
            <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-forest text-4xl mb-6 border-2" style="border-color: {feature.color}">
              {feature.icon}
            </div>
            <h3 class="font-heading text-3xl md:text-4xl font-bold text-recovery-moss mb-4">{feature.title}</h3>
            <p class="text-lg text-recovery-slate/80 leading-relaxed">{feature.description}</p>
          </div>
          
          <!-- Visual Representation (Abstract Plant/Orb) -->
          <div class="{i % 2 === 0 ? 'md:order-2 justify-start' : 'md:order-1 justify-end'} flex">
            <div class="w-64 h-64 rounded-full opacity-80 blur-xl animate-pulse-slow" style="background-color: {feature.color}"></div>
             <!-- Connect Dot -->
             <div class="absolute left-1/2 top-1/2 w-4 h-4 bg-recovery-moss rounded-full -translate-x-1/2 -translate-y-1/2 hidden md:block shadow-lg"></div>
          </div>

        </div>
      {/each}
    </div>
  </section>

  <!-- Mobile App Mockup Section -->
  <section class="py-32 relative">
    <div class="absolute inset-0 bg-recovery-moss/5 -skew-y-3 -z-10"></div>
    
    <div class="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      <div>
        <h2 class="font-heading text-4xl md:text-5xl font-bold text-recovery-moss mb-8">Powered by Human Connection</h2>
        <p class="text-lg text-recovery-slate/80 mb-8 leading-relaxed">
          Our Peer Support Professionals (PSPs) are not just mentors; they are certified data-literate recovery coaches.
        </p>
        
        <div class="space-y-6">
           <div class="flex gap-4">
              <div class="w-12 h-12 rounded-full bg-recovery-clay/20 text-recovery-clay flex items-center justify-center text-xl">✓</div>
              <div>
                 <h3 class="font-bold text-recovery-moss text-xl">Credentialed</h3>
                 <p class="text-recovery-slate/70">All peers maintain Colorado Peer and Family Specialist credentials.</p>
              </div>
           </div>
           <div class="flex gap-4">
              <div class="w-12 h-12 rounded-full bg-recovery-sun/20 text-recovery-moss flex items-center justify-center text-xl">♥</div>
              <div>
                 <h3 class="font-bold text-recovery-moss text-xl">Supervised</h3>
                 <p class="text-recovery-slate/70">Strict adherence to RSSO licensing standards and clinical oversight.</p>
              </div>
           </div>
        </div>
      </div>

      <!-- Organic Phone Mockup -->
      <div class="relative flex justify-center">
        <!-- Stone Base -->
        <div class="absolute bottom-0 w-64 h-20 bg-gray-300 rounded-[50%] blur-sm z-0 opacity-50"></div>
        
        <div class="relative z-10 bg-recovery-slate rounded-[3rem] p-3 shadow-2xl border-4 border-recovery-moss w-[300px]">
          <div class="bg-recovery-paper rounded-[2.5rem] overflow-hidden h-[600px] relative">
             <!-- Mock App Header -->
             <div class="bg-recovery-moss h-32 p-6 rounded-b-[2rem] relative">
                <div class="text-white/80 text-sm mb-1">Good Morning,</div>
                <div class="text-white font-heading text-2xl">Jamie</div>
                <div class="absolute bottom-4 right-6 w-12 h-12 bg-white/20 rounded-full backdrop-blur-sm flex items-center justify-center text-white">
                  ☀️
                </div>
             </div>
             
             <!-- Mock App Body -->
             <div class="p-6 space-y-4">
                <div class="bg-white p-4 rounded-2xl shadow-sm border border-recovery-moss/10">
                   <div class="text-xs text-recovery-clay uppercase font-bold tracking-wider mb-2">Current Streak</div>
                   <div class="flex items-baseline gap-2">
                      <span class="text-4xl font-heading font-bold text-recovery-moss">42</span>
                      <span class="text-recovery-slate/50">Days</span>
                   </div>
                </div>
                
                <div class="bg-recovery-sun/20 p-4 rounded-2xl flex items-center gap-4">
                   <div class="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl shadow-sm">💬</div>
                   <div>
                      <div class="font-bold text-recovery-moss">Coach Sarah</div>
                      <div class="text-xs text-recovery-moss/70">Checking in...</div>
                   </div>
                </div>

                <div class="h-32 bg-recovery-moss/5 rounded-2xl border-2 border-dashed border-recovery-moss/20 flex items-center justify-center text-recovery-moss/40">
                   Journal Entry
                </div>
             </div>

             <!-- Mock Nav -->
             <div class="absolute bottom-0 left-0 w-full h-20 bg-white border-t border-gray-100 flex justify-around items-center text-2xl text-recovery-slate/30">
                <div class="text-recovery-moss">🏠</div>
                <div>📅</div>
                <div>👤</div>
             </div>
          </div>
        </div>
      </div>

    </div>
  </section>

</div>
