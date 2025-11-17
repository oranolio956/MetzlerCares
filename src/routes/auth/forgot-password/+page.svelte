<script lang="ts">
  import { enhance } from '$app/forms'
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import MetzlerBridgeLogo from '$lib/MetzlerBridgeLogo.svelte'
  import { LoadingSpinner, ErrorMessage, SuccessMessage } from '$lib'

  export let form

  let isSubmitting = false
  let emailSent = false

  $: if (form?.success && !emailSent) {
    emailSent = true
  }
</script>

<svelte:head>
  <title>Reset Password - Metzler Foundations</title>
  <meta name="description" content="Reset your password to access your Metzler Foundations account." />
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="min-h-screen bg-cream text-navy flex items-center justify-center px-4 py-12">
  <div class="max-w-md w-full">
    <!-- Logo -->
    <div class="text-center mb-8">
      <button onclick={() => goto('/')} class="inline-flex items-center space-x-2 hover:opacity-80 transition-opacity">
        <MetzlerBridgeLogo className="w-8 h-8 text-navy" />
        <span class="text-xl font-serif font-medium text-navy">Metzler Foundations</span>
      </button>
    </div>

    <!-- Form Container -->
    <div class="bg-white rounded-xl shadow-lg border border-navy border-opacity-10 p-8">
      {#if emailSent}
        <!-- Success State -->
        <div class="text-center">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <h1 class="text-2xl font-serif font-medium text-navy mb-4">Check Your Email</h1>

          <p class="text-navy text-opacity-70 mb-6">
            We've sent password reset instructions to your email address. Please check your inbox and follow the link to
            reset your password.
          </p>

          <p class="text-sm text-navy text-opacity-60 mb-8">
            Didn't receive the email? Check your spam folder or
            <button onclick={() => (emailSent = false)} class="text-olive hover:text-navy underline ml-1">
              try again
            </button>
          </p>

          <a href="/auth/login" class="btn-primary w-full block text-center"> Back to Login </a>
        </div>
      {:else}
        <!-- Reset Form -->
        <div class="text-center mb-6">
          <h1 class="text-2xl font-serif font-medium text-navy mb-2">Reset Your Password</h1>
          <p class="text-navy text-opacity-70">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <form
          method="POST"
          action="?/reset"
          use:enhance={() => {
            isSubmitting = true
            return async ({ update }) => {
              await update()
              isSubmitting = false
            }
          }}
          class="space-y-6"
        >
          <!-- Email -->
          <div>
            <label for="email" class="form-label">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              class="form-input"
              placeholder="your.email@example.com"
              value={form?.data?.email || ''}
            />
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            disabled={isSubmitting}
            class="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {#if isSubmitting}
              <div class="flex items-center justify-center space-x-2">
                <LoadingSpinner size="sm" color="white" />
                <span>Sending Reset Link...</span>
              </div>
            {:else}
              Send Reset Link
            {/if}
          </button>
        </form>

        <!-- Form Errors -->
        {#if form?.errors}
          <div class="mt-6">
            <ErrorMessage title="Unable to Send Reset Link" message={Object.values(form.errors).join(', ')} />
          </div>
        {/if}

        <!-- Links -->
        <div class="mt-8 pt-6 border-t border-navy border-opacity-10">
          <div class="flex justify-center space-x-4 text-sm">
            <a href="/auth/login" class="text-olive hover:text-navy transition-colors"> Back to Login </a>
            <span class="text-navy text-opacity-40">•</span>
            <a href="/contact" class="text-olive hover:text-navy transition-colors"> Need Help? </a>
          </div>
        </div>
      {/if}
    </div>

    <!-- Security Notice -->
    <div class="mt-6 text-center">
      <p class="text-xs text-navy text-opacity-60">
        For security reasons, password reset links expire after 1 hour. Never share your reset link with anyone.
      </p>
    </div>
  </div>
</div>
