<script lang="ts">
  import { onMount } from 'svelte'
  import type { ImpactMetrics } from '$lib/types'
  import type { PageData } from './$types'
  import gsap from 'gsap'
  import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
  import RecoveryBackground from '$lib/components/RecoveryBackground.svelte'

  gsap.registerPlugin(ScrollTrigger);

  export let data: PageData

  let metrics: ImpactMetrics | null = null
  let stories: any[] = []
  let loading = true
  
  // Stars canvas
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  onMount(async () => {
    metrics = data.metrics
    stories = data.stories || []
    loading = false

    // Draw Constellations
    if (canvas) {
      ctx = canvas.getContext('2d')!;
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);
      drawStars();
    }

    // Animate Metrics (Stars)
    gsap.utils.toArray('.star-metric').forEach((star: any, i) => {
      gsap.from(star, {
        scale: 0,
        opacity: 0,
        duration: 1.5,
        delay: i * 0.2,
        ease: 'elastic.out(1, 0.5)',
        scrollTrigger: {
          trigger: star,
          start: 'top 85%',
        }
      });
    });

    // Animate Stories (Lanterns)
    gsap.utils.toArray('.lantern-story').forEach((lantern: any, i) => {
      gsap.from(lantern, {
        y: 50,
        opacity: 0,
        duration: 1,
        delay: i * 0.3,
        scrollTrigger: {
          trigger: lantern,
          start: 'top 80%',
        }
      });
    });
  })

  function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function drawStars() {
    if (!ctx || !canvas) return;
    const stars = Array(100).fill(0).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2,
      alpha: Math.random()
    }));

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      stars.forEach(star => {
        star.alpha += (Math.random() - 0.5) * 0.05;
        if (star.alpha < 0) star.alpha = 0;
        if (star.alpha > 1) star.alpha = 1;
        
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(animate);
    }
    animate();
  }

  function formatNumber(num: number) {
    return new Intl.NumberFormat('en-US').format(num)
  }

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }
</script>

<svelte:head>
  <title>Constellations of Impact | Metzler Cares</title>
  <meta name="description" content="See how our community is shining. Real numbers, real stories, real recovery." />
</svelte:head>

<!-- Darker Atmosphere for Impact (Night Sky) -->
<div class="fixed inset-0 -z-10 bg-[#1a2f0d] overflow-hidden">
    <canvas bind:this={canvas} class="absolute inset-0 w-full h-full opacity-50"></canvas>
    <div class="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-recovery-moss to-transparent opacity-80"></div>
</div>

<div class="min-h-screen font-body text-recovery-paper pt-24 px-6 overflow-x-hidden">

  <!-- Hero -->
  <section class="text-center max-w-4xl mx-auto mb-24">
    <span class="font-hand text-3xl text-recovery-sun block mb-4 animate-pulse-slow">Finding Light</span>
    <h1 class="font-heading text-5xl md:text-7xl font-bold text-white mb-8">Constellations of Impact</h1>
    <p class="text-xl text-white/70 leading-relaxed">
      Each data point is a person finding their way. Every number represents a life reignited.
    </p>
  </section>

  {#if loading}
    <div class="flex justify-center py-32">
       <div class="w-12 h-12 border-4 border-recovery-sun border-t-transparent rounded-full animate-spin"></div>
    </div>
  {:else if metrics}
    
    <!-- Main Star: Beneficiaries -->
    <section class="mb-32 text-center relative">
       <div class="star-metric inline-flex flex-col items-center justify-center w-80 h-80 rounded-full bg-recovery-sun/10 border-4 border-recovery-sun/30 backdrop-blur-md shadow-[0_0_60px_rgba(242,204,143,0.3)] relative z-10">
          <span class="text-6xl md:text-7xl font-bold text-recovery-sun mb-2">{formatNumber(metrics.total_beneficiaries_served ?? 0)}</span>
          <span class="text-xl font-heading text-white">Lives Housed</span>
          <div class="absolute inset-0 rounded-full border border-recovery-sun/20 scale-110 animate-pulse-slow"></div>
       </div>
    </section>

    <!-- Constellation Grid -->
    <section class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-32 relative">
        <!-- Connecting Lines (CSS/SVG could be added here for true constellation feel) -->
        
        <!-- Star 1 -->
        <div class="star-metric text-center">
            <div class="w-4 h-4 bg-white rounded-full mx-auto mb-6 shadow-[0_0_20px_white]"></div>
            <div class="text-4xl font-bold text-white mb-2">{formatCurrency(metrics.total_funds_disbursed_usd ?? 0)}</div>
            <div class="text-recovery-sun font-hand text-xl">Scholarships Deployed</div>
        </div>

        <!-- Star 2 -->
        <div class="star-metric text-center mt-12 lg:mt-24">
            <div class="w-4 h-4 bg-recovery-clay rounded-full mx-auto mb-6 shadow-[0_0_20px_#E07A5F]"></div>
            <div class="text-4xl font-bold text-white mb-2">{metrics.success_rate_percentage}%</div>
            <div class="text-recovery-clay font-hand text-xl">Success Rate</div>
        </div>

        <!-- Star 3 -->
        <div class="star-metric text-center">
             <div class="w-4 h-4 bg-recovery-sun rounded-full mx-auto mb-6 shadow-[0_0_20px_#F2CC8F]"></div>
            <div class="text-4xl font-bold text-white mb-2">{metrics.average_approval_time_minutes} min</div>
            <div class="text-recovery-sun font-hand text-xl">Avg Approval Time</div>
        </div>

        <!-- Star 4 -->
        <div class="star-metric text-center mt-12 lg:mt-24">
            <div class="w-4 h-4 bg-white rounded-full mx-auto mb-6 shadow-[0_0_20px_white]"></div>
            <div class="text-4xl font-bold text-white mb-2">{metrics.total_applications_processed}</div>
            <div class="text-recovery-sun font-hand text-xl">Applications Processed</div>
        </div>
    </section>

    <!-- Lantern Stories -->
    <section class="max-w-6xl mx-auto pb-24">
        <h2 class="font-heading text-4xl text-white text-center mb-16">Stories from the Dark</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            {#if stories.length > 0}
                {#each stories as story}
                    <div class="lantern-story bg-black/40 border border-white/10 p-8 rounded-t-[3rem] rounded-b-[1rem] backdrop-blur-md hover:bg-white/5 transition-colors relative overflow-hidden group">
                        <!-- Lantern Glow -->
                        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-recovery-sun/20 blur-[50px] rounded-full group-hover:bg-recovery-sun/30 transition-colors"></div>
                        
                        <h3 class="text-2xl font-heading text-recovery-sun mb-4 relative z-10">{story.title}</h3>
                        <p class="text-white/70 mb-6 leading-relaxed relative z-10 line-clamp-4">{story.story}</p>
                        
                        <div class="flex items-center gap-2 text-sm text-recovery-clay relative z-10">
                            <span>📍 {story.location}</span>
                        </div>
                    </div>
                {/each}
            {:else}
                 <div class="col-span-full text-center text-white/50 italic">
                    Stories are being gathered...
                 </div>
            {/if}
        </div>
    </section>

  {/if}

</div>
