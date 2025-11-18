<script lang="ts">
  export let title = 'Success!'
  export let message = 'Your action was completed successfully.'
  export let icon = 'check'
  export let showAction = false
  export let actionText = 'Continue'
  export let onAction: (() => void) | null = null

  const iconSvg: Record<string, string> = {
    check: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />`,
    star: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />`
  }
</script>

<div class="bg-green-50 border border-green-200 rounded-lg p-6 text-center" role="status">
  <div class="flex items-center justify-center mb-4">
    <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
      <svg class="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        {@html iconSvg[icon]}
      </svg>
    </div>
  </div>

  <h3 class="text-lg font-medium text-green-800 mb-2">{title}</h3>
  <p class="text-green-700 mb-6 max-w-md mx-auto">{message}</p>

  {#if showAction && onAction}
    <button
      on:click={onAction}
      class="bg-green-100 px-4 py-2 rounded-md text-sm font-medium text-green-800 hover:bg-green-200 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
      type="button"
    >
      {actionText}
    </button>
  {/if}
</div>
