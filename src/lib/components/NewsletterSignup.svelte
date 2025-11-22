<script lang="ts">
  import { enhance } from '$app/forms'
  import { LoadingSpinner, ErrorMessage, SuccessMessage } from '$lib'
  import { trackEvent } from '$lib/utils/analytics'

  export let variant: 'hero' | 'footer' | 'inline' = 'inline'
  export let showDescription = true

  let isSubmitting = false
  let submitted = false
  let email = ''

  $: buttonText = submitted ? 'Subscribed!' : 'Subscribe'
  $: isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  function handleSubmit() {
    trackEvent('newsletter_signup_started', { variant })
  }
</script>

{#if variant === 'hero'}
  <!-- Hero variant for landing pages -->
  <div class="bg-white rounded-xl shadow-lg border border-navy border-opacity-10 p-8 text-center">
    <h3 class="text-2xl font-serif font-medium text-navy mb-4">Stay Connected</h3>
    <p class="text-navy text-opacity-70 mb-6 max-w-md mx-auto">
      Get updates on new recovery housing opportunities, success stories, and ways to support the cause.
    </p>

    <form
      method="POST"
      action="?/newsletter"
      use:enhance={() => {
        isSubmitting = true
        return async ({ update }) => {
          await update()
          isSubmitting = false
        }
      }}
      class="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
    >
      <input
        type="email"
        name="email"
        bind:value={email}
        placeholder="Enter your email"
        class="flex-1 px-4 py-3 border border-navy border-opacity-20 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive focus:border-olive"
        required
      />
      <button
        type="submit"
        disabled={isSubmitting || !isValidEmail}
        class="btn-primary whitespace-nowrap disabled:opacity-50 px-6 py-3"
      >
        {#if isSubmitting}
          <LoadingSpinner size="sm" color="white" />
        {:else}
          {buttonText}
        {/if}
      </button>
    </form>

    <p class="text-xs text-navy text-opacity-60 mt-4">We respect your privacy. Unsubscribe at any time.</p>
  </div>
{:else if variant === 'footer'}
  <!-- Footer variant for bottom of pages -->
  <div class="bg-cream bg-opacity-50 rounded-lg p-6 text-center border border-navy border-opacity-10">
    <h4 class="text-lg font-semibold text-navy mb-2">Join Our Newsletter</h4>
    {#if showDescription}
      <p class="text-navy text-opacity-70 text-sm mb-4">
        Get monthly updates on recovery housing success stories and partnership opportunities.
      </p>
    {/if}

    <form
      method="POST"
      action="?/newsletter"
      use:enhance={() => {
        isSubmitting = true
        return async ({ update }) => {
          await update()
          isSubmitting = false
        }
      }}
      class="flex flex-col sm:flex-row gap-3"
    >
      <input
        type="email"
        name="email"
        bind:value={email}
        placeholder="Your email address"
        class="flex-1 px-3 py-2 border border-navy border-opacity-20 rounded focus:outline-none focus:ring-2 focus:ring-olive focus:border-olive text-sm"
        required
      />
      <button
        type="submit"
        disabled={isSubmitting || !isValidEmail}
        class="btn-primary text-sm px-4 py-2 disabled:opacity-50"
      >
        {#if isSubmitting}
          <LoadingSpinner size="sm" color="white" />
        {:else}
          Subscribe
        {/if}
      </button>
    </form>
  </div>
{:else}
  <!-- Inline variant for sidebar or content areas -->
  <div class="bg-olive bg-opacity-10 rounded-lg p-6 border border-olive border-opacity-20">
    <div class="flex items-start space-x-4">
      <div class="w-10 h-10 bg-olive bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
        <svg class="w-5 h-5 text-olive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      </div>
      <div class="flex-1">
        <h4 class="font-semibold text-navy mb-2">Stay Informed</h4>
        {#if showDescription}
          <p class="text-navy text-opacity-70 text-sm mb-4">
            Get the latest updates on recovery housing opportunities and success stories.
          </p>
        {/if}

        <form
          method="POST"
          action="?/newsletter"
          use:enhance={() => {
            isSubmitting = true
            return async ({ update }) => {
              await update()
              isSubmitting = false
            }
          }}
          class="space-y-3"
        >
          <input
            type="email"
            name="email"
            bind:value={email}
            placeholder="Enter your email"
            class="w-full px-3 py-2 border border-navy border-opacity-20 rounded focus:outline-none focus:ring-2 focus:ring-olive focus:border-olive text-sm"
            required
          />
          <button
            type="submit"
            disabled={isSubmitting || !isValidEmail}
            class="w-full btn-primary text-sm disabled:opacity-50"
          >
            {#if isSubmitting}
              <div class="flex items-center justify-center space-x-2">
                <LoadingSpinner size="sm" color="white" />
                <span>Subscribing...</span>
              </div>
            {:else}
              Subscribe to Updates
            {/if}
          </button>
        </form>

        {#if submitted}
          <SuccessMessage
            title="Successfully subscribed!"
            message="Thank you for joining our newsletter."
            icon="check"
          />
        {/if}
      </div>
    </div>
  </div>
{/if}

