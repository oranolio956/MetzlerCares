<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { trackCustomError } from '$lib/utils/monitoring'
  import { ErrorMessage } from '$lib'

  export let fallback: any = null
  export let onError: ((error: Error, errorInfo: any) => void) | null = null

  let error: Error | null = null
  let errorInfo: any = null
  let hasError = false

  // Handle errors in child components
  function handleError(event: CustomEvent) {
    event.preventDefault()
    error = event.detail.error
    errorInfo = event.detail.errorInfo || {}
    hasError = true

    // Track the error
    if (error) {
      trackCustomError(error, {
        component: 'ErrorBoundary',
        errorInfo,
        userAgent: navigator.userAgent,
        url: window.location.href
      })
    }

    // Call custom error handler if provided
    if (onError && error) {
      onError(error, errorInfo)
    }
  }

  // Reset error state
  function resetError() {
    error = null
    errorInfo = null
    hasError = false
  }

  onMount(() => {
    // Listen for unhandled errors in child components
    window.addEventListener('error', handleError as any)
    window.addEventListener('unhandledrejection', event => {
      handleError(
        new CustomEvent('error', {
          detail: { error: new Error(event.reason), errorInfo: { type: 'unhandledrejection' } }
        })
      )
    })
  })

  onDestroy(() => {
    window.removeEventListener('error', handleError as any)
    window.removeEventListener('unhandledrejection', handleError as any)
  })
</script>

{#if hasError}
  {#if fallback}
    <!-- Custom fallback content -->
    <svelte:component this={fallback} {error} {errorInfo} {resetError} />
  {:else}
    <!-- Default error UI -->
    <div class="min-h-[400px] flex items-center justify-center p-4">
      <div class="max-w-md w-full">
        <ErrorMessage
          title="Something went wrong"
          message={error?.message || 'An unexpected error occurred. Please try refreshing the page.'}
          icon="exclamation"
          showRetry={true}
          onRetry={resetError}
        />

        <!-- Debug info for development -->
        {#if import.meta.env.DEV && error}
          <details class="mt-6 p-4 bg-navy bg-opacity-5 rounded-lg border border-navy border-opacity-10">
            <summary class="cursor-pointer text-sm text-navy text-opacity-70 hover:text-navy font-medium">
              Debug Information (Development Only)
            </summary>
            <div class="mt-3 space-y-2">
              <div>
                <strong class="text-xs text-navy">Error:</strong>
                <pre class="text-xs bg-white p-2 rounded mt-1 overflow-auto">{error.message}</pre>
              </div>
              {#if error.stack}
                <div>
                  <strong class="text-xs text-navy">Stack Trace:</strong>
                  <pre class="text-xs bg-white p-2 rounded mt-1 overflow-auto max-h-32">{error.stack}</pre>
                </div>
              {/if}
              {#if errorInfo}
                <div>
                  <strong class="text-xs text-navy">Additional Info:</strong>
                  <pre class="text-xs bg-white p-2 rounded mt-1 overflow-auto">{JSON.stringify(
                      errorInfo,
                      null,
                      2
                    )}</pre>
                </div>
              {/if}
            </div>
          </details>
        {/if}

        <!-- Recovery actions -->
        <div class="mt-6 flex justify-center space-x-4">
          <button onclick={resetError} class="btn-secondary"> Try Again </button>
          <a href="/" class="btn-primary"> Go Home </a>
        </div>
      </div>
    </div>
  {/if}
{:else}
  <!-- Render children normally -->
  <slot />
{/if}
