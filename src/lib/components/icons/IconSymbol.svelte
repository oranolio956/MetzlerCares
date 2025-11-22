<script lang="ts">
  type IconName = 'shield' | 'chip' | 'lock' | 'pulse' | 'chart' | 'network' | 'cpu'

  export let name: IconName = 'shield'
  export let sizeClass = 'w-5 h-5'
  export let strokeWidth = 2

  const paths: Record<IconName, string> = {
    shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
    chip: 'M9 3h6M9 21h6M3 9v6M21 9v6M7 9h10v6H7z',
    lock: 'M12 17a1 1 0 001-1v-2a1 1 0 10-2 0v2a1 1 0 001 1zm6-4h-1V9a5 5 0 00-10 0v4H6a2 2 0 00-2 2v4a2 2 0 002 2h12a2 2 0 002-2v-4a2 2 0 00-2-2z',
    pulse: 'M4 6h4l2 5-2 5H4l-2-5 2-5zm12 0h4l2 5-2 5h-4l-2-5 2-5zm-6 5h4',
    chart: 'M5 3v18M19 21V8M12 21V13',
    network: 'M7 7h10v10H7z M4 4h3v3H4z M17 4h3v3h-3z M4 17h3v3H4z M17 17h3v3h-3z',
    cpu: 'M9 3h6M9 21h6M3 9v6M21 9v6M7 9h10v6H7z'
  }
</script>

<svg class={sizeClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={strokeWidth} aria-hidden="true">
  {#if name === 'network'}
    <path stroke-linecap="round" stroke-linejoin="round" d={paths.network} />
  {:else}
    <path stroke-linecap="round" stroke-linejoin="round" d={paths[name] ?? paths.shield} />
  {/if}
</svg>
