<script lang="ts">
  export let title = 'Something went wrong'
  export let message = 'Please try again later.'
  export let icon = 'exclamation'
  export let showRetry = true
  export let onRetry: (() => void) | null = null

  const iconSvg: Record<string, string> = {
    exclamation: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />`,
    warning: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />`,
    x: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />`
  }
</script>

<div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center" role="alert">
  <div class="flex items-center justify-center mb-4">
    <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
      <svg class="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        {@html iconSvg[icon]}
      </svg>
    </div>
  </div>

  <h3 class="text-lg font-medium text-red-800 mb-2">{title}</h3>
  <p class="text-red-700 mb-6 max-w-md mx-auto">{message}</p>

  {#if showRetry && onRetry}
    <button
      onclick={onRetry}
      class="bg-red-100 px-4 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
      type="button"
    >
      Try Again
    </button>
  {/if}
</div>
