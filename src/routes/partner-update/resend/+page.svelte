<script lang="ts">
  import { enhance } from '$app/forms'
  let form
</script>

<svelte:head>
  <title>Resend Outcome Link - Metzler Foundations</title>
  <meta name="description" content="Resend partner outcome update link." />
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="min-h-screen bg-cream text-navy">
  <div class="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <h1 class="text-2xl font-serif font-medium mb-6">Resend Outcome Link</h1>
    <form
      method="POST"
      action="?/request"
      use:enhance
      bind:this={form}
      class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-6 space-y-4"
    >
      <label class="form-label" for="outcome_id">Outcome ID</label>
      <input id="outcome_id" name="outcome_id" class="form-input" required />
      <button class="btn-primary w-full" type="submit">Generate Link</button>
      {#if form?.token}
        <div class="mt-4 p-3 border border-navy border-opacity-20 rounded">
          <div class="text-sm">Token:</div>
          <code class="break-all text-xs">{form.token}</code>
        </div>
      {/if}
      {#if form?.error}
        <div class="mt-3 text-sm text-red-700">{form.error}</div>
      {/if}
      {#if form?.success}
        <div class="mt-3 text-sm text-olive">Link generated successfully</div>
      {/if}
    </form>
  </div>
</div>
