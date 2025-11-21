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

<div class="min-h-screen bg-white text-charcoal flex items-center justify-center px-4 py-12">
  <div class="max-w-lg w-full text-center">
    <!-- Logo -->
    <div class="mb-8">
      <MetzlerBridgeLogo className="w-20 h-20 mx-auto text-forest-green" />
    </div>

    <!-- Error Status -->
    <div class="mb-8">
      <h1 class="text-8xl font-bold text-forest-green mb-4">
        {status}
      </h1>
      <h2 class="text-3xl font-bold text-charcoal mb-4">
        {errorTitle}
      </h2>
      <p class="text-lg text-gray-600 mb-8">
        {errorMessage}
      </p>
    </div>

    <!-- Actions -->
    <div class="space-y-3 mb-8">
      <a href="/" class="block w-full px-6 py-3 bg-forest-green text-white rounded-lg font-semibold hover:bg-opacity-90 transition-all">
        Go Home
      </a>

      {#if status !== 404}
        <button on:click={() => window.location.reload()} class="w-full px-6 py-3 bg-mountain-blue text-white rounded-lg font-semibold hover:bg-opacity-90 transition-all">
          Try Again
        </button>
      {/if}

      <a href="/contact" class="block w-full px-6 py-3 bg-white text-charcoal border border-gray-300 rounded-lg font-semibold hover:border-forest-green hover:text-forest-green transition-all">
        Contact Support
      </a>
    </div>

    <!-- Quick Links -->
    <div class="pt-8 border-t border-gray-200">
      <p class="text-sm text-gray-600 mb-4">Quick links:</p>
      <div class="flex flex-wrap justify-center gap-4 text-sm">
        <a href="/get-aid" class="text-forest-green hover:text-forest-green hover:underline transition-colors">
          Get Aid
        </a>
        <span class="text-gray-300">•</span>
        <a href="/resources/colorado" class="text-forest-green hover:text-forest-green hover:underline transition-colors">
          Resources
        </a>
        <span class="text-gray-300">•</span>
        <a href="/faq" class="text-forest-green hover:text-forest-green hover:underline transition-colors">
          FAQ
        </a>
        <span class="text-gray-300">•</span>
        <a href="/impact" class="text-forest-green hover:text-forest-green hover:underline transition-colors">
          Our Impact
        </a>
      </div>
    </div>

    <!-- Error ID for debugging (only in development) -->
    {#if import.meta.env.DEV && error}
      <details class="mt-8 text-left">
        <summary class="cursor-pointer text-sm text-charcoal opacity-60 hover:text-charcoal">
          Debug Information
        </summary>
        <pre class="mt-2 p-4 bg-forest-green bg-opacity-5 rounded text-xs overflow-auto">
          Status: {status}
          Message: {errorMessage}
          Time: {new Date().toISOString()}
        </pre>
      </details>
    {/if}
  </div>
</div>

