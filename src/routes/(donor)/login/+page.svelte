<script lang="ts">
  import { supabase } from '$lib/utils/supabase'
  import { goto } from '$app/navigation'

  let email = ''
  let loading = false
  let message = ''
  let isSuccess = false

  async function sendMagicLink(event: Event) {
    event.preventDefault()
    if (!email) {
      message = 'Please enter your email address'
      return
    }

    try {
      loading = true
      message = ''

      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/donor/donor-dashboard`
        }
      })

      if (error) throw error

      message = 'Check your email for a secure login link!'
      isSuccess = true
      email = ''
    } catch (error) {
      console.error('Error sending magic link:', error)
      message = 'Failed to send login link. Please try again.'
      isSuccess = false
    } finally {
      loading = false
    }
  }
</script>

<svelte:head>
  <title>Donor Portal Login - Metzler Foundations</title>
  <meta name="description" content="Access your personalized donor impact dashboard." />
</svelte:head>

<div class="min-h-screen bg-cream text-navy flex items-center justify-center px-4">
  <div class="max-w-md w-full">
    <!-- Header -->
    <div class="text-center mb-8">
      <h1 class="text-3xl font-serif font-medium text-navy mb-2">Donor Portal</h1>
      <p class="text-navy text-opacity-70">Access your personalized impact dashboard</p>
    </div>

    <!-- Login Form -->
    <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-8">
      <form on:submit={sendMagicLink}>
        <div class="mb-6">
          <label for="email" class="block text-sm font-medium text-navy mb-2"> Email Address </label>
          <input
            id="email"
            type="email"
            bind:value={email}
            required
            class="w-full px-3 py-2 border border-navy border-opacity-20 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy"
            placeholder="your.email@example.com"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          class="w-full bg-navy text-cream font-medium py-3 px-4 rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-navy focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {#if loading}
            <div class="flex items-center justify-center">
              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-cream mr-2" />
              Sending Link...
            </div>
          {:else}
            Send Secure Login Link
          {/if}
        </button>
      </form>

      {#if message}
        <div
          class="mt-4 p-4 rounded-md {isSuccess
            ? 'bg-green-50 border border-green-200 text-green-700'
            : 'bg-red-50 border border-red-200 text-red-700'}"
        >
          {message}
        </div>
      {/if}

      <div class="mt-6 text-center">
        <p class="text-sm text-navy text-opacity-60">
          Don't have a donor account yet?
          <a href="/give-support" class="text-navy underline hover:text-olive"> Make your first donation </a>
        </p>
      </div>
    </div>

    <!-- Back Link -->
    <div class="text-center mt-8">
      <a href="/" class="text-navy text-opacity-60 hover:text-navy underline"> ← Back to Home </a>
    </div>
  </div>
</div>
