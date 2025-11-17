<script lang="ts">
  import { enhance } from '$app/forms'
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import MetzlerBridgeLogo from '$lib/MetzlerBridgeLogo.svelte'
  import { LoadingSpinner, ErrorMessage, SuccessMessage } from '$lib'
  import { onMount } from 'svelte'

  export let form

  let isSubmitting = false
  let passwordReset = false
  let password = ''
  let confirmPassword = ''
  let showPassword = false
  let showConfirmPassword = false

  // Password strength indicators
  $: passwordStrength = calculatePasswordStrength(password)
  $: passwordsMatch = password === confirmPassword && password.length > 0
  $: canSubmit = password.length >= 8 && passwordStrength.score >= 3 && passwordsMatch

  function calculatePasswordStrength(password: string) {
    let score = 0
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      numbers: /\d/.test(password),
      special: /[^A-Za-z0-9]/.test(password)
    }

    score = Object.values(checks).filter(Boolean).length

    return {
      score,
      checks,
      label: score < 2 ? 'Weak' : score < 4 ? 'Fair' : 'Strong',
      color: score < 2 ? 'text-red-600' : score < 4 ? 'text-yellow-600' : 'text-green-600'
    }
  }

  onMount(() => {
    // Check for access token in URL (from email link)
    const url = new URL(window.location.href)
    const accessToken = url.searchParams.get('access_token')
    const refreshToken = url.searchParams.get('refresh_token')

    if (accessToken && refreshToken) {
      // Handle the reset flow - this would typically be done server-side
      console.log('Password reset tokens detected')
    }
  })
</script>

<svelte:head>
  <title>Set New Password - Metzler Foundations</title>
  <meta name="description" content="Create a new password for your Metzler Foundations account." />
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
      {#if passwordReset}
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

          <h1 class="text-2xl font-serif font-medium text-navy mb-4">Password Updated!</h1>

          <p class="text-navy text-opacity-70 mb-6">
            Your password has been successfully updated. You can now log in with your new password.
          </p>

          <a href="/auth/login" class="btn-primary w-full block text-center"> Continue to Login </a>
        </div>
      {:else}
        <!-- Password Reset Form -->
        <div class="text-center mb-6">
          <h1 class="text-2xl font-serif font-medium text-navy mb-2">Set New Password</h1>
          <p class="text-navy text-opacity-70">Choose a strong password for your account.</p>
        </div>

        <form
          method="POST"
          action="?/update"
          use:enhance={() => {
            isSubmitting = true
            return async ({ update }) => {
              await update()
              isSubmitting = false
            }
          }}
          class="space-y-6"
        >
          <!-- New Password -->
          <div>
            <label for="password" class="form-label">New Password</label>
            <div class="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                bind:value={password}
                class="form-input pr-12"
                placeholder="Enter your new password"
                minlength="8"
              />
              <button
                type="button"
                onclick={() => (showPassword = !showPassword)}
                class="absolute right-3 top-3 text-navy text-opacity-60 hover:text-navy transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {#if showPassword}
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                    />
                  </svg>
                {:else}
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                {/if}
              </button>
            </div>

            <!-- Password Strength -->
            {#if password}
              <div class="mt-2">
                <div class="flex items-center justify-between text-sm mb-1">
                  <span class="text-navy text-opacity-70">Password strength:</span>
                  <span class={passwordStrength.color}>{passwordStrength.label}</span>
                </div>
                <div class="w-full bg-navy bg-opacity-10 rounded-full h-2">
                  <div
                    class="h-2 rounded-full transition-all duration-300 {passwordStrength.score < 2
                      ? 'bg-red-500'
                      : passwordStrength.score < 4
                        ? 'bg-yellow-500'
                        : 'bg-green-500'}"
                    style="width: {Math.min(100, (passwordStrength.score / 5) * 100)}%"
                  ></div>
                </div>
                <div class="mt-2 space-y-1">
                  {#each Object.entries(passwordStrength.checks) as [check, passed]}
                    <div class="flex items-center space-x-2 text-xs">
                      <svg
                        class="w-3 h-3 {passed ? 'text-green-600' : 'text-navy text-opacity-40'}"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        {#if passed}
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        {:else}
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        {/if}
                      </svg>
                      <span class={passed ? 'text-green-700' : 'text-navy text-opacity-60'}>
                        {#if check === 'length'}At least 8 characters
                        {:else if check === 'uppercase'}One uppercase letter
                        {:else if check === 'lowercase'}One lowercase letter
                        {:else if check === 'numbers'}One number
                        {:else if check === 'special'}One special character
                        {/if}
                      </span>
                    </div>
                  {/each}
                </div>
              </div>
            {/if}
          </div>

          <!-- Confirm Password -->
          <div>
            <label for="confirmPassword" class="form-label">Confirm New Password</label>
            <div class="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                bind:value={confirmPassword}
                class="form-input pr-12"
                placeholder="Confirm your new password"
                minlength="8"
              />
              <button
                type="button"
                onclick={() => (showConfirmPassword = !showConfirmPassword)}
                class="absolute right-3 top-3 text-navy text-opacity-60 hover:text-navy transition-colors"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {#if showConfirmPassword}
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                    />
                  </svg>
                {:else}
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                {/if}
              </button>
            </div>

            <!-- Password Match Indicator -->
            {#if confirmPassword}
              <div class="mt-2 flex items-center space-x-2 text-sm">
                <svg
                  class="w-4 h-4 {passwordsMatch ? 'text-green-600' : 'text-red-600'}"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {#if passwordsMatch}
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  {:else}
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  {/if}
                </svg>
                <span class={passwordsMatch ? 'text-green-700' : 'text-red-700'}>
                  {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
                </span>
              </div>
            {/if}
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            disabled={isSubmitting || !canSubmit}
            class="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:cursor-not-allowed"
          >
            {#if isSubmitting}
              <div class="flex items-center justify-center space-x-2">
                <LoadingSpinner size="sm" color="white" />
                <span>Updating Password...</span>
              </div>
            {:else}
              Update Password
            {/if}
          </button>
        </form>

        <!-- Form Errors -->
        {#if form?.errors}
          <div class="mt-6">
            <ErrorMessage title="Password Update Failed" message={Object.values(form.errors).join(', ')} />
          </div>
        {/if}

        <!-- Security Requirements -->
        <div class="mt-6 p-4 bg-navy bg-opacity-5 rounded-lg border border-navy border-opacity-10">
          <h3 class="text-sm font-semibold text-navy mb-2">Password Requirements:</h3>
          <ul class="text-xs text-navy text-opacity-70 space-y-1">
            <li>• Minimum 8 characters</li>
            <li>• At least one uppercase letter</li>
            <li>• At least one lowercase letter</li>
            <li>• At least one number</li>
            <li>• At least one special character</li>
          </ul>
        </div>
      {/if}
    </div>

    <!-- Links -->
    <div class="mt-6 text-center">
      <a href="/auth/login" class="text-olive hover:text-navy transition-colors"> Back to Login </a>
    </div>
  </div>
</div>
