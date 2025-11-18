<!-- Premium Hero Component with Immersive Experience -->
<script lang="ts">
  export let title: string = "Discover Dignified Recovery in Colorado – Your Concierge Path to Sober Living Starts Here.";
  export let subtitle: string = "Same-day approvals, personalized matches, and compassionate support for lasting change.";
  export let backgroundImage: string | null = null;
  export let backgroundGradient: string = 'linear-gradient(135deg, var(--color-brand-navy) 0%, var(--color-mountain-blue) 100%)';
  export let overlayOpacity: number = 0.4;
  export let textAlign: 'left' | 'center' | 'right' = 'center';
  export let minHeight: string = '100vh';
  export let showTrustIndicators: boolean = true;
  export let showScrollIndicator: boolean = true;
  export let particles: boolean = true;
  export let animation: 'fade-in' | 'slide-up' | 'bounce-in' = 'fade-in';
  export let animationDelay: number = 0;
  
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  
  let mounted = false;
  let scrollY = 0;
  let particleElements: HTMLElement[] = [];
  
  onMount(() => {
    mounted = true;
    
    // Initialize particles if enabled
    if (particles && typeof window !== 'undefined') {
      initializeParticles();
    }
    
    // Scroll handler for parallax effect
    const handleScroll = () => {
      scrollY = window.scrollY;
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });
  
  function initializeParticles() {
    // Create floating particles for immersive experience
    const particleContainer = document.querySelector('.hero-particles');
    if (!particleContainer) return;
    
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.className = 'hero-particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 4 + 's';
      particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
      particleContainer.appendChild(particle);
      particleElements.push(particle);
    }
  }
  
  function handleScrollClick() {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  }
  
  function getAnimationProps() {
    const baseDelay = animationDelay * 100;
    switch (animation) {
      case 'fade-in':
        return { delay: baseDelay, duration: 600 };
      case 'slide-up':
        return { delay: baseDelay, duration: 600, y: 30 };
      case 'bounce-in':
        return { delay: baseDelay, duration: 800 };
      default:
        return { delay: baseDelay, duration: 600 };
    }
  }
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
  <link href="https://fonts.googleapis.com/css2?family=Canela:wght@300;400;500;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</svelte:head>

<section 
  class="premium-hero"
  class:text-center={textAlign === 'center'}
  class:text-left={textAlign === 'left'}
  class:text-right={textAlign === 'right'}
  style="--hero-min-height: {minHeight}; --overlay-opacity: {overlayOpacity}; --background-gradient: {backgroundGradient};"
>
  <!-- Background Elements -->
  <div class="hero-background">
    {#if backgroundImage}
      <img src={backgroundImage} alt="" class="hero-background__image" />
    {/if}
    <div class="hero-background__gradient"></div>
    <div class="hero-background__overlay"></div>
  </div>
  
  <!-- Particle System -->
  {#if particles}
    <div class="hero-particles" aria-hidden="true"></div>
  {/if}
  
  <!-- Main Content -->
  <div class="hero-content" style="transform: translateY({scrollY * 0.3}px)">
    <div class="hero-content__container">
      {#if mounted}
        <!-- Primary Headline -->
        <h1 
          class="hero-title"
          in:fade={getAnimationProps()}
          style="--animation-delay: {animationDelay}s"
        >
          {title}
        </h1>
        
        <!-- Subtitle -->
        <p 
          class="hero-subtitle"
          in:fade={{ delay: (animationDelay + 0.2) * 100, duration: 600 }}
          style="--animation-delay: {animationDelay + 0.2}s"
        >
          {subtitle}
        </p>
        
        <!-- Action Area -->
        <div 
          class="hero-actions"
          in:fade={{ delay: (animationDelay + 0.4) * 100, duration: 600 }}
          style="--animation-delay: {animationDelay + 0.4}s"
        >
          <slot name="actions">
            <!-- Default actions can be provided here -->
          </slot>
        </div>
        
        <!-- Trust Indicators -->
        {#if showTrustIndicators}
          <div 
            class="hero-trust"
            in:fade={{ delay: (animationDelay + 0.6) * 100, duration: 600 }}
            style="--animation-delay: {animationDelay + 0.6}s"
          >
            <div class="trust-indicators">
              <div class="trust-item">
                <div class="trust-icon">🏥</div>
                <span>HIPAA Compliant</span>
              </div>
              <div class="trust-item">
                <div class="trust-icon">🛡️</div>
                <span>42 CFR Part 2</span>
              </div>
              <div class="trust-item">
                <div class="trust-icon">❤️</div>
                <span>Nonprofit</span>
              </div>
            </div>
          </div>
        {/if}
      {/if}
    </div>
  </div>
  
  <!-- Scroll Indicator -->
  {#if showScrollIndicator}
    <button 
      class="hero-scroll"
      on:click={handleScrollClick}
      aria-label="Scroll to content"
      in:fade={{ delay: (animationDelay + 1) * 100, duration: 600 }}
    >
      <span class="hero-scroll__text">Discover More</span>
      <span class="hero-scroll__icon">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 5v14M19 12l-7 7-7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>
    </button>
  {/if}
</section>

<style>
  /* Base Hero Styles */
  .premium-hero {
    position: relative;
    min-height: var(--hero-min-height, 100vh);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    isolation: isolate;
  }
  
  /* Background System */
  .hero-background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
  }
  
  .hero-background__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }
  
  .hero-background__gradient {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--background-gradient, linear-gradient(135deg, var(--color-forest-green, #2D5016) 0%, var(--color-mountain-blue, #4A90E2) 100%));
  }
  
  .hero-background__overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, var(--overlay-opacity, 0.4));
  }
  
  /* Particle System */
  .hero-particles {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 0;
    pointer-events: none;
  }
  
  .hero-particle {
    position: absolute;
    width: 4px;
    height: 4px;
    background: rgba(255, 255, 255, 0.6);
    border-radius: 50%;
    animation: particle-float 4s ease-in-out infinite;
  }
  
  /* Content System */
  .hero-content {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 1200px;
    padding: 0 2rem;
    text-align: center;
  }
  
  .hero-content__container {
    max-width: 800px;
    margin: 0 auto;
  }
  
  /* Typography */
  .hero-title {
    font-family: var(--font-primary, 'Inter', sans-serif);
    font-size: clamp(3rem, 6vw, 4rem);
    font-weight: 300;
    line-height: 1.1;
    color: white;
    margin: 0 0 1.5rem 0;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    animation: fade-in-up 1s ease-out var(--animation-delay, 0s) both;
  }
  
  .hero-subtitle {
    font-family: var(--font-secondary, 'Inter', sans-serif);
    font-size: clamp(1.125rem, 2vw, 1.5rem);
    font-weight: 400;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.9);
    margin: 0 0 2.5rem 0;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    animation: fade-in-up 1s ease-out calc(var(--animation-delay, 0s) + 0.2s) both;
  }
  
  /* Actions */
  .hero-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
    margin-bottom: 3rem;
    animation: fade-in-up 1s ease-out calc(var(--animation-delay, 0s) + 0.4s) both;
  }
  
  /* Trust Indicators */
  .hero-trust {
    animation: fade-in-up 1s ease-out calc(var(--animation-delay, 0s) + 0.6s) both;
  }
  
  .trust-indicators {
    display: flex;
    gap: 2rem;
    justify-content: center;
    flex-wrap: wrap;
    padding: 1.5rem;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(8px);
    border-radius: var(--radius-xl, 0.75rem);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  .trust-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    color: white;
    font-size: 0.875rem;
    font-weight: 500;
    text-align: center;
  }
  
  .trust-icon {
    font-size: 1.5rem;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  }
  
  /* Scroll Indicator */
  .hero-scroll {
    position: absolute;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    padding: 1rem;
    border-radius: var(--radius-lg, 0.5rem);
    transition: all 0.3s ease;
    animation: fade-in-up 1s ease-out calc(var(--animation-delay, 0s) + 1s) both;
  }
  
  .hero-scroll:hover {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(8px);
  }
  
  .hero-scroll__text {
    font-family: var(--font-secondary, 'Inter', sans-serif);
    font-size: 0.875rem;
    font-weight: 500;
    opacity: 0.8;
    transition: opacity 0.3s ease;
  }
  
  .hero-scroll:hover .hero-scroll__text {
    opacity: 1;
  }
  
  .hero-scroll__icon {
    width: 1.5rem;
    height: 1.5rem;
    animation: bounce 2s infinite;
  }
  
  .hero-scroll__icon svg {
    width: 100%;
    height: 100%;
  }
  
  /* Text Alignment */
  .premium-hero.text-left .hero-content__container {
    margin-left: 0;
    margin-right: auto;
  }
  
  .premium-hero.text-right .hero-content__container {
    margin-left: auto;
    margin-right: 0;
  }
  
  .premium-hero.text-left .hero-actions,
  .premium-hero.text-right .hero-actions {
    justify-content: flex-start;
  }
  
  .premium-hero.text-center .hero-actions {
    justify-content: center;
  }
  
  /* Responsive Design */
  @media (max-width: 768px) {
    .hero-content {
      padding: 0 1rem;
    }
    
    .hero-title {
      font-size: clamp(2rem, 8vw, 3rem);
    }
    
    .hero-subtitle {
      font-size: 1.125rem;
    }
    
    .hero-actions {
      flex-direction: column;
      align-items: center;
    }
    
    .trust-indicators {
      flex-direction: column;
      gap: 1rem;
    }
  }
  
  /* High Contrast Mode */
  @media (prefers-contrast: high) {
    .hero-background__overlay {
      background: rgba(0, 0, 0, 0.7);
    }
    
    .hero-title,
    .hero-subtitle {
      text-shadow: 0 2px 4px black;
    }
    
    .trust-indicators {
      background: rgba(0, 0, 0, 0.7);
      border: 2px solid white;
    }
  }
  
  /* Reduced Motion */
  @media (prefers-reduced-motion: reduce) {
    .hero-content {
      transform: none !important;
    }
    
    .hero-particle {
      animation: none;
    }
    
    .hero-scroll__icon {
      animation: none;
    }
    
    .hero-title,
    .hero-subtitle,
    .hero-actions,
    .hero-trust,
    .hero-scroll {
      animation: none;
    }
  }
  
  /* Animations */
  @keyframes fade-in-up {
    0% {
      opacity: 0;
      transform: translateY(20px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes particle-float {
    0%, 100% {
      transform: translateY(0px) translateX(0px);
      opacity: 0.6;
    }
    25% {
      transform: translateY(-20px) translateX(10px);
      opacity: 1;
    }
    50% {
      transform: translateY(10px) translateX(-10px);
      opacity: 0.8;
    }
    75% {
      transform: translateY(-10px) translateX(5px);
      opacity: 1;
    }
  }
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-10px);
    }
    60% {
      transform: translateY(-5px);
    }
  }
</style>