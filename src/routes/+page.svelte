<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import MetzlerBridgeLogo from '$lib/MetzlerBridgeLogo.svelte';

  let mounted = false;
  let mousePosition = { x: 0, y: 0 };

  onMount(() => {
    mounted = true;
    
    // Add mouse move listener for premium parallax effect
    const handleMouseMove = (event: MouseEvent) => {
      mousePosition = { x: event.clientX, y: event.clientY };
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  });

  const navigationCards = [
    {
      id: 'get-help',
      title: 'GET HELP NOW',
      description: 'For Clients & Families',
      icon: '🤝',
      href: '/get-help',
      color: 'primary'
    },
    {
      id: 'partners',
      title: 'OUR PARTNERS',
      description: 'For Rehabs & Treatment Centers',
      icon: '🏢',
      href: '/partners',
      color: 'secondary'
    },
    {
      id: 'impact',
      title: 'OUR IMPACT',
      description: 'For Donors & Supporters',
      icon: '💚',
      href: '/impact',
      color: 'accent'
    }
  ];

  function handleCardClick(href: string) {
    goto(href);
  }
</script>

<svelte:head>
  <title>The Bridge to Recovery | Metzler Cares</title>
  <meta name="description" content="Metzler Cares - The Bridge to Recovery. Tech-enabled healthcare services for life stabilization." />
</svelte:head>

<div class="min-h-screen bg-accent flex flex-col items-center justify-center relative overflow-hidden">
  <!-- Premium background gradient -->
  <div class="absolute inset-0 bg-gradient-to-br from-gray-light via-accent to-gray-light opacity-60"></div>
  
  <!-- Animated background elements with parallax -->
  <div class="absolute inset-0">
    <div 
      class="absolute top-20 left-20 w-64 h-64 bg-primary opacity-5 rounded-full blur-3xl animate-pulse transition-transform duration-300"
      style="transform: translate({(mousePosition.x - window.innerWidth/2) * 0.02}px, {(mousePosition.y - window.innerHeight/2) * 0.02}px)"
    ></div>
    <div 
      class="absolute bottom-20 right-20 w-96 h-96 bg-secondary opacity-5 rounded-full blur-3xl animate-pulse transition-transform duration-300"
      style="animation-delay: 1s; transform: translate({(mousePosition.x - window.innerWidth/2) * -0.03}px, {(mousePosition.y - window.innerHeight/2) * -0.03}px)"
    ></div>
  </div>

  <!-- Main content -->
  <div class="relative z-10 text-center px-6 max-w-6xl mx-auto">
    <!-- Logo -->
    <div class="mb-12 animate-fade-in" style="animation-delay: 0.1s;">
      <MetzlerBridgeLogo class="w-32 h-32 mx-auto mb-6" />
    </div>

    <!-- Headline -->
    <div class="mb-16 animate-fade-in" style="animation-delay: 0.2s;">
      <h1 class="text-6xl font-extrabold text-primary mb-6 tracking-tight leading-tight">
        The Bridge to Recovery
      </h1>
      <p class="text-xl text-gray-medium max-w-2xl mx-auto leading-relaxed">
        Tech-enabled healthcare services that partner with rehabs to manage client life-stabilization before discharge.
      </p>
    </div>

    <!-- Navigation Cards -->
    <div class="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
      {#each navigationCards as card, index}
        <div 
          class="card cursor-pointer group transform transition-all duration-500 hover:scale-105 animate-fade-in powerhouse-card"
          style="animation-delay: {0.3 + (index * 0.1)}s;"
          on:click={() => handleCardClick(card.href)}
          on:keydown={(e) => e.key === 'Enter' && handleCardClick(card.href)}
          tabindex="0"
          role="button"
          aria-label="{card.title} - {card.description}"
        >
          <div class="text-center">
            <!-- Icon -->
            <div class="text-5xl mb-6 transform transition-transform duration-300 group-hover:scale-110">
              {card.icon}
            </div>
            
            <!-- Title -->
            <h2 class="text-2xl font-bold text-primary mb-3 tracking-wide">
              {card.title}
            </h2>
            
            <!-- Description -->
            <p class="text-gray-medium font-medium">
              {card.description}
            </p>
            
            <!-- Hover indicator -->
            <div class="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div class="w-8 h-1 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto"></div>
            </div>
          </div>
        </div>
      {/each}
    </div>

    <!-- Subtle footer -->
    <div class="mt-24 animate-fade-in" style="animation-delay: 0.6s;">
      <div class="text-center mb-6">
        <h2 class="text-2xl font-bold text-primary mb-3">Scholarships & FAQ</h2>
        <p class="text-gray-medium">Explore sober living scholarships and answers to common questions</p>
      </div>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <a href="/scholarships" class="bg-primary text-white px-6 py-3 rounded-md hover:bg-secondary transition-colors font-semibold">Sober Living Scholarships</a>
        <a href="/faq/sober-living" class="border-2 border-primary text-primary px-6 py-3 rounded-md hover:bg-gray-light transition-colors font-semibold">Sober Living FAQ</a>
      </div>
      <div class="text-center mt-10">
        <p class="text-sm text-gray-medium">
          HIPAA Compliant • 42 CFR Part 2 Compliant • Multi-Tenant Secure Platform
        </p>
      </div>
    </div>
  </div>
</div>

<style>
  /* Enhanced animations for premium feel */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fade-in {
    animation: fadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    opacity: 0;
  }

  /* Premium card styles */
  .card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 24px;
    padding: 2.5rem;
    box-shadow: 
      0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06),
      0 0 0 1px rgba(255, 255, 255, 0.5) inset;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .card:hover {
    box-shadow: 
      0 20px 25px -5px rgba(0, 0, 0, 0.1),
      0 10px 10px -5px rgba(0, 0, 0, 0.04),
      0 0 0 1px rgba(255, 255, 255, 0.5) inset;
    transform: translateY(-8px);
  }

  .card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(26, 35, 126, 0.03) 0%, rgba(0, 200, 83, 0.03) 100%);
    border-radius: 24px;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }

  .card:hover::before {
    opacity: 1;
  }

  /* Focus styles for accessibility */
  .card:focus {
    outline: 2px solid var(--color-primary);
    outline-offset: 4px;
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .text-6xl {
      font-size: 3rem;
      line-height: 1.1;
    }
    
    .card {
      padding: 2rem;
    }
  }
</style>