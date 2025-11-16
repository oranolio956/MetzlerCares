<script lang="ts">
  export let error;
  export let status;
  import { onMount } from 'svelte'
  onMount(() => {
    try {
      const payload = {
        level: 'error',
        category: 'system',
        message: `Client error on ${window.location.pathname}`,
        details: { status, error: error?.message }
      }
      fetch('/api/security/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(() => {})
    } catch {}
  })
</script>

<svelte:head>
  <title>{status === 404 ? 'Page Not Found' : status === 500 ? 'Server Error' : status === 503 ? 'Service Unavailable' : 'Error'} - Metzler Foundations</title>
  <meta name="description" content="We couldn't complete your request. Please try again or contact support." />
</svelte:head>

<div class="min-h-screen bg-warm-cream text-deep-navy-900 flex items-center justify-center px-4">
  <div class="max-w-md w-full text-center">
    <div class="w-16 h-16 bg-sage-600 rounded-full flex items-center justify-center mx-auto mb-6">
      <svg class="w-8 h-8 text-soft-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
    <h1 class="text-3xl font-display font-medium mb-2">
      {status === 404 ? 'Page Not Found' : status === 500 ? 'Server Error' : status === 503 ? 'Service Unavailable' : 'Error'}
    </h1>
    <p class="text-deep-navy-800 mb-6">
      {error?.message || 'Please try again later. If the issue persists, contact '}<a href="mailto:support@metzlerfoundations.org" class="underline decoration-sage-600">support@metzlerfoundations.org</a>.
    </p>
    <a href="/" class="btn-primary" aria-label="Return to Home">Return to Home</a>
  </div>
</div>