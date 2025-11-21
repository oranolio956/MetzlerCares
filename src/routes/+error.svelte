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

<div class="min-h-screen bg-cream text-charcoal flex items-center justify-center px-4">
  <div class="max-w-md w-full text-center">
    <!-- Logo -->
    <div class="mb-8">
      <MetzlerBridgeLogo className="w-16 h-16 mx-auto text-forest-green" />
    </div>

    <!-- Error Status -->
    <div class="mb-6">
      <h1 class="text-6xl font-bold text-forest-green mb-2">
        {status}
      </h1>
      <h2 class="text-2xl font-semibold text-forest-green mb-4">
        {errorTitle}
      </h2>
      <p class="text-charcoal opacity-70 mb-8">
        {errorMessage}
      </p>
    </div>

    <!-- Actions -->
    <div class="space-y-4">
      <button on:click={() => goto('/')} class="w-full btn btn-primary"> Go Home </button>

      {#if status !== 404}
        <button on:click={() => window.location.reload()} class="w-full btn btn-secondary"> Try Again </button>
      {/if}

      <a href="/contact" class="block w-full btn btn-accent"> Contact Support </a>
    </div>

    <!-- Additional Help -->
    <div class="mt-8 pt-8 border-t border-forest-green border-opacity-10">
      <p class="text-sm text-charcoal opacity-60 mb-4">Need help? Here are some other options:</p>
      <div class="flex justify-center space-x-4 text-sm">
        <a href="/faq" class="text-forest-green hover:text-sunset-orange transition-colors"> FAQ </a>
        <span class="text-charcoal opacity-40">•</span>
        <a href="/resources/colorado" class="text-forest-green hover:text-sunset-orange transition-colors"> Resources </a>
        <span class="text-charcoal opacity-40">•</span>
        <a href="/privacy" class="text-forest-green hover:text-sunset-orange transition-colors"> Privacy </a>
      </div>
    </div>

    <!-- Error ID for debugging (only in development) -->
    {#if import.meta.env.DEV && error}
      <details class="mt-8 text-left">
        <summary class="cursor-pointer text-sm text-charcoal opacity-60 hover:text-charcoal"> Debug Information </summary>
        <pre class="mt-2 p-4 bg-forest-green bg-opacity-5 rounded text-xs overflow-auto">
          Status: {status}
          Message: {errorMessage}
          Time: {new Date().toISOString()}
        </pre>
      </details>
    {/if}
  </div>
</div>

<style>
  /* Use unified design system */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 500;
    transition: all 0.2s ease-in-out;
  }
  
  .btn-primary {
    background-color: #065f46;
    color: white;
  }
  
  .btn-primary:hover {
    background-color: #047857;
  }
  
  .btn-secondary {
    background-color: #1e40af;
    color: white;
  }
  
  .btn-secondary:hover {
    background-color: #1d4ed8;
  }
  
  .btn-accent {
    background-color: #ea580c;
    color: white;
  }
  
  .btn-accent:hover {
    background-color: #dc2626;
  }
</style>