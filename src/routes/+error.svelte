<script lang="ts">
  import { page } from '$app/stores'
  import MetzlerBridgeLogo from '$lib/MetzlerBridgeLogo.svelte'
  import { goto } from '$app/navigation'

  $: status = $page.status
  $: error = $page.error

  $: errorMessage =
    status === 404
      ? "The page you're looking for doesn't exist."
      : status === 500
        ? 'Something went wrong on our end. Please try again.'
        : error?.message || 'An unexpected error occurred.'

  $: errorTitle = status === 404 ? 'Page Not Found' : status === 500 ? 'Server Error' : 'Something Went Wrong'
</script>

<svelte:head>
  <title>{errorTitle} - Metzler Foundations</title>
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="min-h-screen bg-cream text-navy flex items-center justify-center px-4">
  <div class="max-w-md w-full text-center">
    <!-- Logo -->
    <div class="mb-8">
      <MetzlerBridgeLogo className="w-16 h-16 mx-auto text-navy" />
    </div>

    <!-- Error Status -->
    <div class="mb-6">
      <h1 class="text-6xl font-serif font-medium text-navy mb-2">
        {status}
      </h1>
      <h2 class="text-2xl font-serif font-medium text-navy mb-4">
        {errorTitle}
      </h2>
      <p class="text-navy text-opacity-70 mb-8">
        {errorMessage}
      </p>
    </div>

    <!-- Actions -->
    <div class="space-y-4">
      <button on:click={() => goto('/')} class="w-full btn-primary"> Go Home </button>

      {#if status !== 404}
        <button on:click={() => window.location.reload()} class="w-full btn-secondary"> Try Again </button>
      {/if}

      <a href="/contact" class="block w-full btn-gold text-center"> Contact Support </a>
    </div>

    <!-- Additional Help -->
    <div class="mt-8 pt-8 border-t border-navy border-opacity-10">
      <p class="text-sm text-navy text-opacity-60 mb-4">Need help? Here are some other options:</p>
      <div class="flex justify-center space-x-4 text-sm">
        <a href="/faq" class="text-olive hover:text-navy transition-colors"> FAQ </a>
        <span class="text-navy text-opacity-40">•</span>
        <a href="/resources/colorado" class="text-olive hover:text-navy transition-colors"> Resources </a>
        <span class="text-navy text-opacity-40">•</span>
        <a href="/privacy" class="text-olive hover:text-navy transition-colors"> Privacy </a>
      </div>
    </div>

    <!-- Error ID for debugging (only in development) -->
    {#if import.meta.env.DEV && error}
      <details class="mt-8 text-left">
        <summary class="cursor-pointer text-sm text-navy text-opacity-60 hover:text-navy"> Debug Information </summary>
        <pre class="mt-2 p-4 bg-navy bg-opacity-5 rounded text-xs overflow-auto">
{JSON.stringify(
            {
              status,
              message: error.message,
              stack: error.stack ? error.stack.split('\n').slice(0, 5).join('\n') : 'No stack trace available',
              timestamp: new Date().toISOString()
            },
            null,
            2
          )}
        </pre>
      </details>
    {/if}
  </div>
</div>
