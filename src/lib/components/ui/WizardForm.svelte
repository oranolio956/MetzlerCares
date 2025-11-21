<script lang="ts">
  import { createEventDispatcher, setContext } from 'svelte'
  import { writable } from 'svelte/store'
  import { fade, fly } from 'svelte/transition'
  import { cubicOut } from 'svelte/easing'

  export let title = ''
  export let subtitle = ''
  export let showProgress = true
  export let allowKeyboardNavigation = true

  const dispatch = createEventDispatcher()

  // Store for wizard state
  const currentStep = writable(0)
  const totalSteps = writable(0)
  const direction = writable(1) // 1 for forward, -1 for backward
  const steps = writable<any[]>([])

  setContext('wizard', {
    currentStep,
    totalSteps,
    direction,
    registerStep: (step: any) => {
      steps.update(s => [...s, step])
      totalSteps.update(n => (n || 0) + 1)
      return (get_store_value(totalSteps) || 1) - 1 // Return index
    }
  })

  // Helper to get store value synchronously (for initialization)
  function get_store_value(store: any) {
    let value
    store.subscribe((v: any) => (value = v))()
    return value
  }

  function nextStep() {
    if ($currentStep < $totalSteps - 1) {
      direction.set(1)
      currentStep.update(n => n + 1)
      dispatch('stepChange', { step: $currentStep + 1 })
    } else {
      dispatch('submit')
    }
  }

  function prevStep() {
    if ($currentStep > 0) {
      direction.set(-1)
      currentStep.update(n => n - 1)
      dispatch('stepChange', { step: $currentStep - 1 })
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (!allowKeyboardNavigation) return

    // Only navigate if not focusing on an input that needs these keys
    const target = event.target as HTMLElement
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return

    if (event.key === 'ArrowRight' || event.key === 'Enter') {
      // For Enter, we might want to be careful not to submit prematurely if validation fails
      // But for now, let's allow it and rely on validation logic in the parent
      // nextStep();
      // Actually, let's stick to arrows for nav to avoid accidental submissions
      if (event.key === 'ArrowRight') nextStep()
    } else if (event.key === 'ArrowLeft') {
      prevStep()
    }
  }

  $: progress = (($currentStep + 1) / $totalSteps) * 100
</script>

<div
  class="w-full max-w-3xl mx-auto bg-white rounded-3xl border border-[var(--color-border)] shadow-lg overflow-hidden flex flex-col min-h-[520px]"
  on:keydown={handleKeydown}
  role="form"
  aria-label={title}
  tabindex="-1"
>
  <!-- Header -->
  <div class="px-6 py-6 bg-white text-navy flex justify-between items-center z-10 border-b border-[var(--color-border)]">
    <div class="relative z-10 space-y-2">
      {#if title}
        <p class="text-xs font-semibold uppercase tracking-[0.3em] text-charcoal/50">Application progress</p>
        <h2 class="text-2xl font-bold font-primary tracking-tight">{title}</h2>
      {/if}
      {#if subtitle}
        <p class="text-charcoal/70 text-sm font-secondary">{subtitle}</p>
      {/if}
    </div>

    {#if showProgress}
      <div class="flex items-center space-x-3 relative z-10 text-sm text-charcoal/70">
        <span class="font-medium font-mono">
          Step {$currentStep + 1}/{$totalSteps}
        </span>
        <div class="w-28 h-2 rounded-full bg-cream/60 overflow-hidden">
          <div class="h-full bg-olive transition-all duration-500 ease-out" style="width: {progress}%"></div>
        </div>
      </div>
    {/if}
  </div>

  <!-- Content Area -->
  <div class="flex-1 relative overflow-hidden bg-cream/40">
    <slot />
  </div>

  <!-- Footer / Controls -->
  <div class="px-6 py-6 bg-white border-t border-[var(--color-border)] flex justify-between items-center z-10 relative">
    <button
      on:click={prevStep}
      class="btn-ghost px-6 py-3 border border-[var(--color-border)] text-sm disabled:opacity-30 disabled:cursor-not-allowed flex items-center"
      disabled={$currentStep === 0}
    >
      <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      Back
    </button>

      <div class="flex space-x-3">
      {#if $currentStep < $totalSteps - 1}
          <button on:click={nextStep} class="btn-primary px-8 py-3 text-sm flex items-center gap-2">
          Next
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      {:else}
          <button on:click={() => dispatch('submit')} class="btn-gold px-8 py-3 text-sm flex items-center gap-2">
            Submit application
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </button>
      {/if}
    </div>
  </div>
</div>

<style>
  /* Custom scrollbar for content area if needed */
  :global(.wizard-content::-webkit-scrollbar) {
    width: 8px;
  }
  :global(.wizard-content::-webkit-scrollbar-track) {
    background: transparent;
  }
  :global(.wizard-content::-webkit-scrollbar-thumb) {
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 4px;
  }
</style>
