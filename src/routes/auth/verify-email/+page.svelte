<script lang="ts">
  import { onMount } from 'svelte'
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import MetzlerBridgeLogo from '$lib/MetzlerBridgeLogo.svelte'
  import { LoadingSpinner, ErrorMessage, SuccessMessage } from '$lib'
  import { supabase } from '$lib/utils/supabase'

  let isVerifying = true
  let verificationStatus: 'success' | 'error' | 'expired' | null = null
  let errorMessage = ''
  let canResend = false
  let resendCooldown = 60
  let resending = false

  onMount(async () => {
    // Check for verification tokens in URL
    const url = new URL(window.location.href)
    const token = url.searchParams.get('token')
    const type = url.searchParams.get('type')

    if (token && type === 'email_confirmation') {
      await verifyEmail(token)
    } else {
      // No valid token, show resend option
      isVerifying = false
      canResend = true
    }
  })

  async function verifyEmail(token: string) {
    try {
      const { error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'email'
      })

      if (error) {
        if (error.message.includes('expired')) {
          verificationStatus = 'expired'
        } else {
          verificationStatus = 'error'
          errorMessage = error.message
        }
      } else {
        verificationStatus = 'success'
        // Redirect to dashboard after short delay
        setTimeout(() => {
          goto('/app/dashboard')
        }, 3000)
      }
    } catch (err) {
      verificationStatus = 'error'
      errorMessage = 'Verification failed. Please try again.'
    } finally {
      isVerifying = false
    }
  }

  async function resendVerification() {
    try {
      resending = true
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser()

      if (userError || !user) {
        errorMessage = 'Unable to find your account. Please log in again.'
        return
      }

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email!
      })

      if (error) {
        errorMessage = error.message
      } else {
        canResend = false
        resendCooldown = 60

        // Start cooldown timer
        const timer = setInterval(() => {
          resendCooldown--
          if (resendCooldown <= 0) {
            canResend = true
            clearInterval(timer)
          }
        }, 1000)
      }
    } catch (err) {
      errorMessage = 'Failed to resend verification email.'
    } finally {
      resending = false
    }
  }
</script>

<svelte:head>
  <title>Verify Email - Metzler Foundations</title>
  <meta name="description" content="Verify your email address to complete your Metzler Foundations account setup." />
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="min-h-screen bg-cream text-navy flex items-center justify-center px-4 py-12">
  <div class="max-w-md w-full">
    <!-- Logo -->
    <div class="text-center mb-8">
      <button on:click={() => goto('/')} class="inline-flex items-center space-x-2 hover:opacity-80 transition-opacity">
        <MetzlerBridgeLogo className="w-8 h-8 text-navy" />
        <span class="text-xl font-serif font-medium text-navy">Metzler Foundations</span>
      </button>
    </div>

    <!-- Content Container -->
    <div class="bg-white rounded-xl shadow-lg border border-navy border-opacity-10 p-8 text-center">
      {#if isVerifying}
        <!-- Loading State -->
        <div class="mb-6">
          <LoadingSpinner size="lg" color="navy" />
        </div>
        <h1 class="text-2xl font-serif font-medium text-navy mb-4">Verifying Your Email</h1>
        <p class="text-navy text-opacity-70">Please wait while we verify your email address...</p>
      {:else if verificationStatus === 'success'}
        <!-- Success State -->
        <div class="mb-6">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <svg class="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        <h1 class="text-2xl font-serif font-medium text-navy mb-4">Email Verified!</h1>

        <p class="text-navy text-opacity-70 mb-6">
          Thank you for verifying your email address. You're now ready to access your account.
        </p>

        <p class="text-sm text-navy text-opacity-60">Redirecting you to your dashboard...</p>
      {:else if verificationStatus === 'expired'}
        <!-- Expired Link -->
        <div class="mb-6">
          <div class="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
            <svg class="w-8 h-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
        </div>

        <h1 class="text-2xl font-serif font-medium text-navy mb-4">Verification Link Expired</h1>

        <p class="text-navy text-opacity-70 mb-6">
          Your verification link has expired. Don't worry - you can request a new one.
        </p>

        <button on:click={resendVerification} disabled={resending || !canResend} class="btn-primary w-full">
          {#if resending}
            <div class="flex items-center justify-center space-x-2">
              <LoadingSpinner size="sm" color="white" />
              <span>Sending...</span>
            </div>
          {:else if !canResend}
            Resend in {resendCooldown}s
          {:else}
            Send New Verification Email
          {/if}
        </button>
      {:else}
        <!-- Error or Resend Option -->
        <div class="mb-6">
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <svg class="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </div>

        <h1 class="text-2xl font-serif font-medium text-navy mb-4">Verification Failed</h1>

        <p class="text-navy text-opacity-70 mb-6">
          {errorMessage || "We couldn't verify your email address. Please try again or contact support."}
        </p>

        {#if canResend}
          <div class="space-y-4">
            <button on:click={resendVerification} disabled={resending} class="btn-primary w-full">
              {#if resending}
                <div class="flex items-center justify-center space-x-2">
                  <LoadingSpinner size="sm" color="white" />
                  <span>Sending...</span>
                </div>
              {:else}
                Send New Verification Email
              {/if}
            </button>

            <a href="/contact" class="btn-secondary w-full block text-center"> Contact Support </a>
          </div>
        {:else}
          <p class="text-sm text-navy text-opacity-60">
            Please wait {resendCooldown} seconds before requesting another email.
          </p>
        {/if}
      {/if}

      <!-- Links -->
      {#if !isVerifying}
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
        Email verification helps keep your account secure and ensures we can communicate important updates.
      </p>
    </div>
  </div>
</div>
