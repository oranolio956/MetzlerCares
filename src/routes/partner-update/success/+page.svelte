<script lang="ts">
  import { goto } from '$app/navigation'
</script>

<svelte:head>
  <title>Outcome Submitted - Metzler Foundations</title>
  <meta name="description" content="Thank you for submitting the outcome update." />
</svelte:head>

<div class="min-h-screen bg-cream text-navy">
  <div class="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
    <div class="w-16 h-16 bg-olive rounded-full flex items-center justify-center mx-auto mb-6">
      <svg class="w-8 h-8 text-cream" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>
    <h1 class="text-3xl font-serif font-medium mb-2">Outcome Submitted</h1>
    <p class="text-navy text-opacity-70 mb-8">Thank you. Your update has been logged successfully.</p>
    <button on:click={() => goto('/')} class="btn-primary">Return to Home</button>
  </div>
</div>
