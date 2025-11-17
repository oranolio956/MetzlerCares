<script lang="ts">
  import { LoadingSpinner } from '$lib'

  export let message = 'Loading...'
  export let size: 'sm' | 'md' | 'lg' = 'lg'
  export let showProgress = false
  export let progress = 0
</script>

<div class="min-h-screen bg-cream flex items-center justify-center px-4">
  <div class="text-center max-w-sm">
    <!-- Spinner -->
    <div class="mb-6">
      <LoadingSpinner {size} color="navy" />
    </div>

    <!-- Message -->
    <h2 class="text-xl font-serif font-medium text-navy mb-2">
      {message}
    </h2>

    <!-- Progress Bar (optional) -->
    {#if showProgress}
      <div class="mt-4 mb-2">
        <div class="w-full bg-navy bg-opacity-10 rounded-full h-2">
          <div
            class="bg-olive h-2 rounded-full transition-all duration-300 ease-out"
            style="width: {Math.min(100, Math.max(0, progress))}%"
          ></div>
        </div>
      </div>
      <p class="text-sm text-navy text-opacity-60">
        {Math.round(progress)}% complete
      </p>
    {/if}

    <!-- Loading dots animation -->
    <div class="mt-4 flex justify-center space-x-1">
      <div class="w-2 h-2 bg-navy bg-opacity-40 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
      <div class="w-2 h-2 bg-navy bg-opacity-40 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
      <div class="w-2 h-2 bg-navy bg-opacity-40 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
    </div>
  </div>
</div>

<style>
  @keyframes bounce {
    0%,
    80%,
    100% {
      transform: scale(0);
    }
    40% {
      transform: scale(1);
    }
  }

  .animate-bounce {
    animation: bounce 1.4s infinite ease-in-out both;
  }
</style>
