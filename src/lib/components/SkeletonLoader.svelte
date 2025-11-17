<script lang="ts">
  export let lines = 3
  export let showAvatar = false
  export let showImage = false
  export let className = ''
</script>

<div class="{className} animate-pulse">
  {#if showImage}
    <!-- Image skeleton -->
    <div class="bg-navy bg-opacity-10 rounded-lg mb-4" style="height: 200px;"></div>
  {/if}

  {#if showAvatar}
    <!-- Avatar skeleton -->
    <div class="flex items-center space-x-4 mb-4">
      <div class="w-12 h-12 bg-navy bg-opacity-10 rounded-full"></div>
      <div class="flex-1 space-y-2">
        <div class="h-4 bg-navy bg-opacity-10 rounded w-3/4"></div>
        <div class="h-3 bg-navy bg-opacity-10 rounded w-1/2"></div>
      </div>
    </div>
  {/if}

  <!-- Text lines skeleton -->
  <div class="space-y-3">
    {#each Array(lines) as _, i}
      <div class="h-4 bg-navy bg-opacity-10 rounded" style="width: {100 - i * 10}%"></div>
    {/each}
  </div>

  <!-- Action buttons skeleton -->
  <div class="flex space-x-3 mt-6">
    <div class="h-10 bg-navy bg-opacity-10 rounded w-24"></div>
    <div class="h-10 bg-navy bg-opacity-10 rounded w-20"></div>
  </div>
</div>

<style>
  .animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
</style>
