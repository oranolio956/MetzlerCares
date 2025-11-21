<script lang="ts">
  import { getContext, onMount } from 'svelte'
  import { fly, fade } from 'svelte/transition'
  import { cubicOut } from 'svelte/easing'

  export let title = ''
  export let description = ''

  const { currentStep, registerStep, direction } = getContext('wizard')

  const stepIndex = registerStep({})

  // Transition params
  const duration = 400
  const distance = 50

  $: isActive = $currentStep === stepIndex
  $: isPast = $currentStep > stepIndex

  // Calculate transition based on direction
  $: inParams = {
    x: $direction * distance,
    duration,
    easing: cubicOut,
    delay: duration * 0.4 // Slight delay for incoming
  }

  $: outParams = {
    x: $direction * -distance,
    duration,
    easing: cubicOut
  }
</script>

{#if isActive}
  <div
    class="absolute inset-0 w-full h-full p-8 md:p-12 overflow-y-auto wizard-content"
    in:fly={inParams}
    out:fly={outParams}
  >
    <div class="max-w-2xl mx-auto h-full flex flex-col justify-center">
      {#if title}
        <h3 class="text-3xl font-bold text-navy mb-4 leading-tight">{title}</h3>
      {/if}

      {#if description}
        <p class="text-lg text-gray-600 mb-8 leading-relaxed">{description}</p>
      {/if}

      <div class="space-y-6">
        <slot />
      </div>
    </div>
  </div>
{/if}
