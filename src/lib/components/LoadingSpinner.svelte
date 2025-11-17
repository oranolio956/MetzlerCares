<script lang="ts">
  export let size = 'md'
  export let color = 'navy'

  const sizeClasses: Record<string, string> = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  const colorClasses: Record<string, string> = {
    navy: 'border-navy',
    olive: 'border-olive',
    gold: 'border-gold',
    white: 'border-white'
  }
</script>

<div class="flex items-center justify-center">
  <div
    class="{sizeClasses[size]} {colorClasses[color]} border-4 border-t-transparent rounded-full animate-spin"
    role="status"
    aria-label="Loading"
  >
    <span class="sr-only">Loading...</span>
  </div>
</div>
