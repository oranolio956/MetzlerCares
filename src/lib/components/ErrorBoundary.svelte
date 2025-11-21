<script lang="ts">
  import { onMount } from 'svelte'
  
  export let error: Error | null = null
  let hasError = false
  let errorMessage = ''

  onMount(() => {
    if (error) {
      hasError = true
      errorMessage = error.message || 'An unexpected error occurred'
    }
  })

  function handleRetry() {
    hasError = false
    errorMessage = ''
    window.location.reload()
  }
</script>

{#if hasError}
  <div class="min-h-screen flex items-center justify-center bg-white px-4" role="alert">
    <div class="max-w-md w-full bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
      <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg
          class="w-8 h-8 text-red-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>
      <h2 class="text-2xl font-bold text-charcoal mb-4">Something went wrong</h2>
      <p class="text-gray-600 mb-6">{errorMessage}</p>
      <button
        on:click={handleRetry}
        class="px-6 py-3 bg-forest-green text-white rounded-lg font-semibold hover:bg-opacity-90 transition-all min-h-[44px]"
        aria-label="Retry loading the page"
      >
        Try Again
      </button>
    </div>
  </div>
{:else}
  <slot />
{/if}
