<script lang="ts">
  import { page } from '$app/stores'
  import MetzlerBridgeLogo from '$lib/MetzlerBridgeLogo.svelte'
  import { onMount } from 'svelte'
  import { logClientError } from '$lib/utils/security'

  $: status = $page.status
  $: error = $page.error

  let errorTitle = ''
  let errorMessage = ''
  let helpfulLinks = [
    { label: 'Get Aid', href: '/get-aid' },
    { label: 'Resources', href: '/resources/colorado' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Our Impact', href: '/impact' }
  ]

  $: {
    if (status === 404) {
      errorTitle = 'Page Not Found'
      errorMessage = "The page you're looking for doesn't exist or has been moved."
    } else if (status === 503) {
      errorTitle = 'Service Unavailable'
      errorMessage = 'We are currently performing maintenance. Please check back shortly.'
    } else if (status === 500) {
      errorTitle = 'Server Error'
      errorMessage = 'Something went wrong on our end. Our team has been notified.'
    } else {
      errorTitle = 'Something Went Wrong'
      errorMessage = error?.message || 'An unexpected error occurred.'
    }
  }

  onMount(() => {
    // Log the error for telemetry
    if (error || status >= 400) {
      logClientError({
        type: 'frontend_error',
        status,
        url: $page.url.href,
        error: error,
        context: {
          referrer: document.referrer
        }
      })
    }
  })
</script>

<svelte:head>
  <title>{errorTitle} - Metzler Cares</title>
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="min-h-screen bg-[var(--surface-night)] text-[var(--text-primary)] flex items-center justify-center px-4 py-12 font-[family-name:var(--font-secondary)]">
  <div class="max-w-lg w-full text-center space-y-8">
    <!-- Logo -->
    <div class="flex justify-center">
      <MetzlerBridgeLogo className="w-24 h-24 text-[var(--color-accent)]" />
    </div>

    <!-- Error Status -->
    <div class="space-y-4">
      <h1 class="text-7xl font-bold text-[var(--color-accent)] font-[family-name:var(--font-primary)]">
        {status}
      </h1>
      <h2 class="text-3xl font-bold text-white font-[family-name:var(--font-primary)]">
        {errorTitle}
      </h2>
      <p class="text-lg text-[var(--text-muted)]">
        {errorMessage}
      </p>
    </div>

    <!-- Actions -->
    <div class="space-y-4 pt-4">
      <a
        href="/"
        class="inline-block w-full px-8 py-4 bg-[var(--color-accent)] text-[var(--surface-night)] rounded-lg font-semibold hover:bg-[var(--color-accent-strong)] transition-colors shadow-lg shadow-[var(--color-accent)]/20"
        aria-label="Return to Homepage"
      >
        Return to Home
      </a>

      {#if status !== 404}
        <button
          on:click={() => window.location.reload()}
          class="w-full px-8 py-4 bg-[var(--surface-card)] border border-[var(--surface-border)] text-[var(--text-primary)] rounded-lg font-semibold hover:bg-[var(--surface-glass)] transition-colors"
        >
          Try Again
        </button>
      {/if}

      <a
        href="mailto:support@metzlercares.com"
        class="block w-full px-8 py-4 text-[var(--text-muted)] hover:text-[var(--color-accent)] transition-colors text-sm font-medium"
      >
        Contact Support
      </a>
    </div>

    <!-- Quick Links -->
    <div class="pt-8 border-t border-[var(--surface-border)]">
      <p class="text-sm text-[var(--text-muted)] mb-4 uppercase tracking-wider text-xs font-semibold">Helpful Links</p>
      <div class="flex flex-wrap justify-center gap-x-6 gap-y-2">
        {#each helpfulLinks as link}
          <a
            href={link.href}
            class="text-[var(--text-secondary)] hover:text-[var(--color-accent)] transition-colors text-sm"
          >
            {link.label}
          </a>
        {/each}
      </div>
    </div>

    <!-- Debug Info (Dev Only) -->
    {#if import.meta.env.DEV && error}
      <details class="mt-8 text-left bg-[var(--surface-card)] rounded-lg p-4 border border-[var(--surface-border)]">
        <summary class="cursor-pointer text-xs text-[var(--text-muted)] hover:text-white font-mono uppercase tracking-wider">
          Debug Information
        </summary>
        <pre class="mt-4 text-xs text-[var(--text-secondary)] overflow-auto whitespace-pre-wrap font-mono">
Status: {status}
Message: {errorMessage}
Time: {new Date().toISOString()}
Stack: {error && typeof error === 'object' && 'stack' in error ? error.stack : 'N/A'}
        </pre>
      </details>
    {/if}
  </div>
</div>
