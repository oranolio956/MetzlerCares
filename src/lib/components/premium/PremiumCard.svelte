<!-- Premium Card Component with Elevated Design -->
<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  export let variant: 'default' | 'highlighted' | 'interactive' | 'minimal' = 'default'
  export let elevation: 'sm' | 'md' | 'lg' | 'xl' = 'md'
  export let padding: 'none' | 'sm' | 'md' | 'lg' | 'xl' = 'md'
  export let border: boolean = true
  export let hover: boolean = false
  export let glow: boolean = false
  export let animated: boolean = true
  export let href: string | null = null
  export let external: boolean = false
  const dispatch = createEventDispatcher()

  $: componentClass = `
    premium-card
    premium-card--${variant}
    premium-card--${elevation}
    premium-card--padding-${padding}
    ${border ? 'premium-card--border' : ''}
    ${hover ? 'premium-card--hover' : ''}
    ${glow ? 'premium-card--glow' : ''}
    ${animated ? 'premium-card--animated' : ''}
  `

  // Handle class attribute from rest props
  let userClass = $$restProps.class || ''

  function handleClick(event: Event) {
    dispatch('click', event)
  }

  function handleMouseEnter(event: Event) {
    dispatch('mouseenter', event)
  }

  function handleMouseLeave(event: Event) {
    dispatch('mouseleave', event)
  }
</script>

{#if href}
  <a
    {href}
    class={`${componentClass} ${userClass}`}
    class:external
    target={external ? '_blank' : undefined}
    rel={external ? 'noopener noreferrer' : undefined}
    on:click={handleClick}
    on:mouseenter={handleMouseEnter}
    on:mouseleave={handleMouseLeave}
  >
    <div class="premium-card__content">
      <slot />
    </div>

    {#if glow}
      <div class="premium-card__glow" aria-hidden="true" />
    {/if}
  </a>
{:else if variant === 'interactive'}
  <button
    class={`${componentClass} ${userClass}`}
    on:click={handleClick}
    on:mouseenter={handleMouseEnter}
    on:mouseleave={handleMouseLeave}
    type="button"
  >
    <div class="premium-card__content">
      <slot />
    </div>

    {#if glow}
      <div class="premium-card__glow" aria-hidden="true" />
    {/if}
  </button>
{:else}
  <div
    class={`${componentClass} ${userClass}`}
    on:click={handleClick}
    on:mouseenter={handleMouseEnter}
    on:mouseleave={handleMouseLeave}
    role="presentation"
  >
    <div class="premium-card__content">
      <slot />
    </div>

    {#if glow}
      <div class="premium-card__glow" aria-hidden="true" />
    {/if}
  </div>
{/if}

<style>
  /* Base Premium Card Styles */
  .premium-card {
    position: relative;
    background: white;
    border-radius: var(--radius-xl, 0.75rem);
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    transform: translateZ(0);
    will-change: transform, box-shadow;
  }

  /* Elevation Variants */
  .premium-card--sm {
    box-shadow: var(--shadow-sm, 0 1px 2px 0 rgba(0, 0, 0, 0.05));
  }

  .premium-card--md {
    box-shadow: var(--shadow-md, 0 4px 6px -1px rgba(0, 0, 0, 0.1));
  }

  .premium-card--lg {
    box-shadow: var(--shadow-lg, 0 10px 15px -3px rgba(0, 0, 0, 0.1));
  }

  .premium-card--xl {
    box-shadow: var(--shadow-xl, 0 20px 25px -5px rgba(0, 0, 0, 0.1));
  }

  /* Variant Styles */
  .premium-card--highlighted {
    background: linear-gradient(135deg, #ffffff 0%, var(--color-warm-gray, #f5f4f2) 100%);
    border: 1px solid var(--color-sunset-orange, #ff6b35);
  }

  .premium-card--interactive {
    cursor: pointer;
    user-select: none;
  }

  .premium-card--minimal {
    background: transparent;
    box-shadow: none;
    border: 1px solid var(--color-warm-gray, #f5f4f2);
  }

  /* Padding Variants */
  .premium-card--padding-none .premium-card__content {
    padding: 0;
  }

  .premium-card--padding-sm .premium-card__content {
    padding: 1rem;
  }

  .premium-card--padding-md .premium-card__content {
    padding: 1.5rem;
  }

  .premium-card--padding-lg .premium-card__content {
    padding: 2rem;
  }

  .premium-card--padding-xl .premium-card__content {
    padding: 2.5rem;
  }

  /* Border Variant */
  .premium-card--border {
    border: 1px solid var(--color-warm-gray, #f5f4f2);
  }

  /* Hover Effects */
  .premium-card--hover:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-xl, 0 20px 25px -5px rgba(0, 0, 0, 0.1));
  }

  .premium-card--interactive:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg, 0 10px 15px -3px rgba(0, 0, 0, 0.1));
  }

  .premium-card--interactive:active {
    transform: translateY(0);
    box-shadow: var(--shadow-md, 0 4px 6px -1px rgba(0, 0, 0, 0.1));
  }

  /* Glow Effect */
  .premium-card--glow {
    position: relative;
  }

  .premium-card--glow::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(
      45deg,
      var(--color-sunset-orange, #ff6b35),
      var(--color-mountain-blue, #4a90e2),
      var(--color-forest-green, #2d5016)
    );
    border-radius: var(--radius-xl, 0.75rem);
    opacity: 0;
    z-index: -1;
    transition: opacity 0.3s ease;
    animation: glow-pulse 3s ease-in-out infinite;
  }

  .premium-card--glow:hover::before {
    opacity: 0.7;
  }

  .premium-card__glow {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      var(--color-sunset-orange, #ff6b35) 0%,
      var(--color-mountain-blue, #4a90e2) 100%
    );
    opacity: 0;
    border-radius: var(--radius-xl, 0.75rem);
    transition: opacity 0.3s ease;
    pointer-events: none;
  }

  .premium-card--glow:hover .premium-card__glow {
    opacity: 0.1;
  }

  /* Animation */
  .premium-card--animated {
    animation: card-enter 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  .premium-card--animated:nth-child(2) {
    animation-delay: 0.1s;
  }

  .premium-card--animated:nth-child(3) {
    animation-delay: 0.2s;
  }

  .premium-card--animated:nth-child(4) {
    animation-delay: 0.3s;
  }

  /* Content Container */
  .premium-card__content {
    position: relative;
    z-index: 1;
  }

  /* Ripple Effect for Interactive Cards */
  .premium-card--interactive::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
    z-index: 0;
  }

  .premium-card--interactive:active::before {
    width: 300px;
    height: 300px;
  }

  /* Focus Styles */
  .premium-card--interactive:focus-visible {
    outline: 3px solid var(--color-focus, #0066cc);
    outline-offset: 2px;
    box-shadow: var(--shadow-focus, 0 0 0 3px rgba(74, 144, 226, 0.3));
  }

  /* Link Styles */
  .premium-card[href] {
    text-decoration: none;
    color: inherit;
  }

  /* Dark Mode Support */
  @media (prefers-color-scheme: dark) {
    .premium-card {
      background: #1a1a1a;
      color: white;
    }

    .premium-card--highlighted {
      background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
      border-color: var(--color-sunset-orange, #ff8c5a);
    }

    .premium-card--minimal {
      background: transparent;
      border-color: #404040;
    }

    .premium-card--border {
      border-color: #404040;
    }
  }

  /* High Contrast Mode */
  @media (prefers-contrast: high) {
    .premium-card {
      border-width: 3px;
      border-color: black;
    }

    .premium-card--highlighted {
      border-color: var(--color-sunset-orange, #ff6b35);
    }
  }

  /* Reduced Motion */
  @media (prefers-reduced-motion: reduce) {
    .premium-card {
      transition: none;
    }

    .premium-card--animated {
      animation: none;
    }

    .premium-card--glow::before {
      animation: none;
    }

    .premium-card--hover:hover {
      transform: none;
    }

    .premium-card--interactive:hover {
      transform: none;
    }
  }

  /* Animations */
  @keyframes card-enter {
    0% {
      opacity: 0;
      transform: translateY(20px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes glow-pulse {
    0%,
    100% {
      opacity: 0.5;
    }
    50% {
      opacity: 0.8;
    }
  }
</style>
