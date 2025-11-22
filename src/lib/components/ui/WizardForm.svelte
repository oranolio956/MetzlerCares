<script lang="ts">
  import { createEventDispatcher, setContext } from 'svelte'
  import { writable } from 'svelte/store'
  
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

    if (event.key === 'ArrowRight') {
      nextStep()
    } else if (event.key === 'ArrowLeft') {
      prevStep()
    }
  }

  $: progress = (($currentStep + 1) / $totalSteps) * 100
</script>

<div
  class="w-full max-w-3xl mx-auto bg-recovery-paper rounded-3xl shadow-forest overflow-hidden flex flex-col min-h-[600px] border border-recovery-moss/10"
  on:keydown={handleKeydown}
  role="form"
  aria-label={title}
  tabindex="-1"
>
  <!-- Header -->
  <div class="px-8 py-6 bg-recovery-moss text-white flex justify-between items-center z-10 relative overflow-hidden">
    <div class="relative z-10">
      {#if title}
        <h2 class="text-2xl font-heading font-bold tracking-wide">{title}</h2>
      {/if}
      {#if subtitle}
        <p class="text-white/80 text-sm mt-1 font-body">{subtitle}</p>
      {/if}
    </div>

    {#if showProgress}
      <div class="flex items-center space-x-3 relative z-10">
        <span class="text-sm font-medium text-white/90 font-mono">
          Step {$currentStep + 1}/{$totalSteps}
        </span>
        <div class="w-24 h-2 bg-black/20 rounded-full overflow-hidden backdrop-blur-sm">
          <div
            class="h-full bg-recovery-sun shadow-[0_0_10px_rgba(242,204,143,0.5)] transition-all duration-500 ease-out"
            style="width: {progress}%"
          />
        </div>
      </div>
    {/if}
  </div>

  <!-- Content Area -->
  <div class="flex-1 relative overflow-hidden bg-recovery-paper">
    <slot />
  </div>

  <!-- Footer / Controls -->
  <div class="px-8 py-6 bg-white/50 border-t border-recovery-moss/10 flex justify-between items-center z-10 relative">
    <button
      on:click={prevStep}
      class="px-6 py-3 rounded-full text-recovery-slate font-medium hover:bg-recovery-moss/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center font-heading"
      disabled={$currentStep === 0}
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
          class="px-8 py-3 bg-recovery-moss text-white rounded-full font-bold shadow-lg hover:bg-recovery-clay hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center font-heading"
        >
          Next
          <svg class="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      {:else}
        <button
          on:click={() => dispatch('submit')}
          class="px-8 py-3 bg-recovery-moss text-white rounded-full font-bold shadow-lg hover:bg-recovery-clay hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center font-heading"
        >
          Plant Application
          <svg class="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </button>
      {/if}
    </div>
  </div>
</div>
