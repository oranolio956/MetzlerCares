<script lang="ts">
  export let lines = 3
  export let className = ''
</script>

<div class="animate-pulse space-y-3 {className}">
  {#each Array(lines) as _, i}
    <div
      class="h-4 bg-gray-200 rounded"
      style="width: {i === lines - 1 ? '75%' : '100%'}"
      aria-hidden="true"
    />
  {/each}
</div>
