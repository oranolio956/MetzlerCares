<script lang="ts">
  import { toasts, dismiss, type ToastItem } from '$lib/stores/toast'
  import { derived } from 'svelte/store'
  const items = derived(toasts, $t => $t)
  function bg(type: ToastItem['type']) {
    if (type === 'success') return 'bg-green-600'
    if (type === 'error') return 'bg-red-600'
    return 'bg-navy'
  }
  function sr(type: ToastItem['type']) {
    if (type === 'success') return 'Success'
    if (type === 'error') return 'Error'
    return 'Notice'
  }
</script>

<div class="fixed top-4 right-4 z-[100] space-y-3" role="region" aria-label="Notifications">
  {#each $items as t (t.id)}
    <div
      class={`text-cream rounded-md shadow-md px-4 py-3 flex items-start gap-3 ${bg(t.type)}`}
      role="status"
      aria-live="polite"
    >
      <span class="sr-only">{sr(t.type)}:</span>
      <div class="flex-1">{t.message}</div>
      <button class="text-cream text-opacity-80 hover:text-cream" aria-label="Dismiss" on:click={() => dismiss(t.id)}
        >✕</button
      >
    </div>
  {/each}
</div>
