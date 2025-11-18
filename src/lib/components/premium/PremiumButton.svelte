<!-- Premium Button Component with Micro-interactions -->
<script lang="ts">
  export let variant: 'primary' | 'secondary' | 'accent' | 'ghost' = 'primary';
  export let size: 'xs' | 'sm' | 'md' | 'lg' | 'icon' = 'md';
  export let loading: boolean = false;
  export let disabled: boolean = false;
  export let fullWidth: boolean = false;
  export let icon: string | null = null;
  export let iconPosition: 'left' | 'right' = 'left';
  export let href: string | null = null;
  export let external: boolean = false;
  export let ariaLabel: string | null = null;
  export let type: 'button' | 'submit' | 'reset' = 'button';
  
  
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  const { class: userClass = '', ...restProps } = ($$restProps as Record<string, any>);
  
  $: componentClass = `
    premium-btn
    premium-btn--${variant}
    premium-btn--${size}
    ${fullWidth ? 'premium-btn--full-width' : ''}
    ${loading ? 'premium-btn--loading' : ''}
    ${disabled ? 'premium-btn--disabled' : ''}
  `;
  $: finalClass = `${componentClass}${userClass ? ' ' + userClass : ''}`;
  
  function handleClick(event: Event) {
    if (!disabled && !loading) {
      dispatch('click', event);
    }
  }
</script>

{#if href}
  <a
    {href}
    class={finalClass}
    class:external
    target={external ? '_blank' : undefined}
    rel={external ? 'noopener noreferrer' : undefined}
    aria-label={ariaLabel}
    on:click={handleClick}
    {...restProps}
  >
    <span class="premium-btn__content">
      {#if icon && iconPosition === 'left'}
        <span class="premium-btn__icon premium-btn__icon--left">
          {@html icon}
        </span>
      {/if}
      
      <span class="premium-btn__text">
        <slot />
      </span>
      
      {#if icon && iconPosition === 'right'}
        <span class="premium-btn__icon premium-btn__icon--right">
          {@html icon}
        </span>
      {/if}
    </span>
    
    {#if loading}
      <span class="premium-btn__spinner" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </span>
    {/if}
  </a>
{:else}
  <button
    class={finalClass}
    {disabled}
    aria-label={ariaLabel}
    aria-busy={loading}
    aria-disabled={disabled}
    on:click={handleClick}
    type={type}
    {...restProps}
  >
    <span class="premium-btn__content">
      {#if icon && iconPosition === 'left'}
        <span class="premium-btn__icon premium-btn__icon--left">
          {@html icon}
        </span>
      {/if}
      
      <span class="premium-btn__text">
        <slot />
      </span>
      
      {#if icon && iconPosition === 'right'}
        <span class="premium-btn__icon premium-btn__icon--right">
          {@html icon}
        </span>
      {/if}
    </span>
    
    {#if loading}
      <span class="premium-btn__spinner" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </span>
    {/if}
  </button>
{/if}

<style>
  /* Base Premium Button Styles */
  .premium-btn {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-secondary, 'Inter', sans-serif);
    font-weight: 500;
    border-radius: var(--radius-lg, 0.5rem);
    border: 2px solid transparent;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
    transform: translateZ(0);
    will-change: transform, box-shadow;
  }
  
  /* Size Variants */
  .premium-btn--sm {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    min-height: 2.25rem;
  }
  
  .premium-btn--md {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    line-height: 1.5rem;
    min-height: 3rem;
  }
  
  .premium-btn--lg {
    padding: 1rem 2rem;
    font-size: 1.125rem;
    line-height: 1.75rem;
    min-height: 3.5rem;
  }
  
  /* Color Variants */
  .premium-btn--primary {
    background: linear-gradient(135deg, var(--color-forest-green, #2D5016) 0%, var(--color-sage-green, #7A8471) 100%);
    color: white;
    box-shadow: var(--shadow-md, 0 4px 6px -1px rgba(0, 0, 0, 0.1));
  }
  
  .premium-btn--primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg, 0 10px 15px -3px rgba(0, 0, 0, 0.1)), var(--shadow-forest, 0 4px 20px rgba(45, 80, 22, 0.15));
  }
  
  .premium-btn--primary:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: var(--shadow-base, 0 1px 3px 0 rgba(0, 0, 0, 0.1));
  }
  
  .premium-btn--secondary {
    background: linear-gradient(135deg, var(--color-mountain-blue, #4A90E2) 0%, var(--color-sky-blue, #87CEEB) 100%);
    color: white;
    box-shadow: var(--shadow-md, 0 4px 6px -1px rgba(0, 0, 0, 0.1));
  }
  
  .premium-btn--secondary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg, 0 10px 15px -3px rgba(0, 0, 0, 0.1)), var(--shadow-mountain, 0 12px 40px rgba(74, 144, 226, 0.15));
  }
  
  .premium-btn--accent {
    background: linear-gradient(135deg, var(--color-sunset-orange, #FF6B35) 0%, var(--color-gold-milestone, #F4D03F) 100%);
    color: white;
    box-shadow: var(--shadow-md, 0 4px 6px -1px rgba(0, 0, 0, 0.1));
  }
  
  .premium-btn--accent:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg, 0 10px 15px -3px rgba(0, 0, 0, 0.1)), var(--shadow-sunset, 0 8px 32px rgba(255, 107, 53, 0.2));
  }
  
  .premium-btn--ghost {
    background: transparent;
    color: var(--color-forest-green, #2D5016);
    border: 2px solid var(--color-forest-green, #2D5016);
    box-shadow: none;
  }
  
  .premium-btn--ghost:hover:not(:disabled) {
    background: var(--color-forest-green, #2D5016);
    color: white;
    transform: translateY(-1px);
  }
  
  /* State Variants */
  .premium-btn--disabled,
  .premium-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }
  
  .premium-btn--loading {
    cursor: wait;
  }
  
  .premium-btn--full-width {
    width: 100%;
  }
  
  /* Content Layout */
  .premium-btn__content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    position: relative;
    z-index: 1;
  }
  
  .premium-btn__text {
    font-weight: 500;
    position: relative;
  }
  
  .premium-btn__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.25rem;
    height: 1.25rem;
    transition: transform 0.2s ease;
  }
  
  .premium-btn:hover .premium-btn__icon {
    transform: scale(1.1);
  }
  
  /* Loading Spinner */
  .premium-btn__spinner {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 1.25rem;
    height: 1.25rem;
    color: currentColor;
    opacity: 0;
    transition: opacity 0.2s ease;
  }
  
  .premium-btn--loading .premium-btn__content {
    opacity: 0;
  }
  
  .premium-btn--loading .premium-btn__spinner {
    opacity: 1;
    animation: spin 1s linear infinite;
  }
  
  .premium-btn__spinner svg {
    width: 100%;
    height: 100%;
    stroke-dasharray: 64;
    stroke-dashoffset: 0;
    animation: dash 1.5s ease-in-out infinite;
  }
  
  /* Ripple Effect */
  .premium-btn::before {
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
  }
  
  .premium-btn:active::before {
    width: 300px;
    height: 300px;
  }
  
  /* Focus Styles */
  .premium-btn:focus-visible {
    outline: 3px solid var(--color-focus, #0066CC);
    outline-offset: 2px;
    box-shadow: var(--shadow-focus, 0 0 0 3px rgba(74, 144, 226, 0.3));
  }
  
  /* High Contrast Mode Support */
  @media (prefers-contrast: high) {
    .premium-btn {
      border-width: 3px;
    }
    
    .premium-btn--ghost {
      background: white;
      color: black;
      border-color: black;
    }
  }
  
  /* Reduced Motion Support */
  @media (prefers-reduced-motion: reduce) {
    .premium-btn {
      transition: none;
    }
    
    .premium-btn:hover:not(:disabled) {
      transform: none;
    }
    
    .premium-btn__spinner {
      animation: none;
    }
    
    .premium-btn::before {
      transition: none;
    }
  }
  
  /* Animations */
  @keyframes spin {
    to {
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }
  
  @keyframes dash {
    0% {
      stroke-dashoffset: 64;
    }
    50% {
      stroke-dashoffset: 16;
    }
    100% {
      stroke-dashoffset: 64;
    }
  }
</style>