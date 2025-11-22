<script lang="ts">
  import { createEventDispatcher, setContext, onMount } from 'svelte'
  import { writable } from 'svelte/store'
  import { fade, fly } from 'svelte/transition'
  import { cubicOut } from 'svelte/easing'

  export let title = ''
  export let subtitle = ''
  export let showProgress = true
  export let allowKeyboardNavigation = true
  let shellElement: HTMLElement | null = null

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

  onMount(() => {
    const listener = (event: KeyboardEvent) => {
      if (!allowKeyboardNavigation) return
      if (!shellElement || !shellElement.contains(event.target as Node)) return
      handleKeydown(event)
    }
    window.addEventListener('keydown', listener)
    return () => window.removeEventListener('keydown', listener)
  })
</script>

<form
  class="w-full max-w-3xl mx-auto"
  aria-label={title}
  novalidate
  on:submit|preventDefault={() => dispatch('submit')}
>
  <div class="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col min-h-[600px]" bind:this={shellElement}>
    <!-- Header -->
    <div
      class="px-8 py-6 bg-electric-violet text-white flex justify-between items-center z-10 relative overflow-hidden"
    >
      <!-- Mascot Decoration -->
      <div class="absolute -right-6 -top-6 w-24 h-24 opacity-20 rotate-12">
        <img src="/assets/spark-mascot.png" alt="Spark" class="w-full h-full object-contain" loading="lazy" width="96" height="96" />
      </div>

      <div class="relative z-10">
        {#if title}
          <h2 class="text-2xl font-bold font-primary tracking-wide">{title}</h2>
        {/if}
        {#if subtitle}
          <p class="text-white text-opacity-80 text-sm mt-1 font-secondary">{subtitle}</p>
        {/if}
      </div>

      {#if showProgress}
        <div class="flex items-center space-x-3 relative z-10">
          <span class="text-sm font-medium text-white text-opacity-90 font-mono">
            Step {$currentStep + 1}/{$totalSteps}
          </span>
          <div class="w-24 h-2 bg-black bg-opacity-20 rounded-full overflow-hidden backdrop-blur-sm">
            <div
              class="h-full bg-neon-mint shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-500 ease-out"
              style="width: {progress}%"
            />
          </div>
        </div>
      {/if}
    </div>

    <!-- Content Area -->
    <div class="flex-1 relative overflow-hidden bg-gray-50">
      <slot />
    </div>

    <!-- Footer / Controls -->
    <div class="px-8 py-6 bg-white border-t border-gray-100 flex justify-between items-center z-10 relative">
      <button
        on:click={prevStep}
        class="px-6 py-3 rounded-lg text-charcoal font-medium hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center"
        disabled={$currentStep === 0}
        type="button"
      >
        <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <div class="flex space-x-4">
        {#if $currentStep < $totalSteps - 1}
          <button
            on:click={nextStep}
            type="button"
            class="px-8 py-3 bg-forest-green text-white rounded-lg font-bold shadow-lg hover:bg-opacity-90 hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center"
          >
            Next
            <svg class="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        {:else}
          <button
            on:click={() => dispatch('submit')}
            type="button"
            class="px-8 py-3 bg-forest-green text-white rounded-lg font-bold shadow-lg hover:bg-opacity-90 hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center"
          >
            Submit Application
            <svg class="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </button>
        {/if}
      </div>
    </div>
  </div>
</form>

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
