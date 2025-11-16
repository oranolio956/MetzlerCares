<script lang="ts">
  export let error;
  export let status;
</script>

<svelte:head>
  <title>{status === 404 ? 'Page Not Found' : 'Something went wrong'} - Metzler Foundations</title>
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
      {status === 404 ? 'Page Not Found' : 'Something went wrong'}
    </h1>
    <p class="text-deep-navy-800 mb-6">
      {error?.message || 'Please try again later. If the issue persists, contact support@metzlerfoundations.org.'}
    </p>
    <a href="/" class="btn-primary">Return to Home</a>
  </div>
</div>