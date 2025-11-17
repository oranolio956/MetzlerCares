<script lang="ts">
  import { enhance } from '$app/forms'
  let form
</script>

<svelte:head>
  <title>Login - Metzler Foundations</title>
  <meta name="description" content="Secure login to access protected areas." />
</svelte:head>

<div class="min-h-screen bg-cream text-navy flex items-center justify-center px-4">
  <div class="max-w-md w-full bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-8">
    <h1 class="text-2xl font-serif font-medium mb-6">Secure Login</h1>
    <form method="POST" action="?/login" use:enhance class="space-y-4">
      <div>
        <label for="email" class="block text-sm font-medium mb-1">Email</label>
        <input id="email" name="email" type="email" required class="form-input" placeholder="you@example.com" />
      </div>
      <div>
        <label for="password" class="block text-sm font-medium mb-1">Password</label>
        <input id="password" name="password" type="password" required class="form-input" placeholder="Your password" />
      </div>
      {#if (form as any)?.error}
        <div class="bg-red-50 border border-red-200 rounded-md p-3 text-sm">
          {(form as any).error.message || 'An error occurred'}
        </div>
      {/if}
      <button type="submit" class="btn-primary w-full">Login</button>
    </form>
    <div class="mt-6 text-sm text-navy text-opacity-70">
      Donor? <a href="/donor/login" class="underline">Get a secure magic link</a>
    </div>
  </div>
</div>
