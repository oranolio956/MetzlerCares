<script lang="ts">
  import { enhance } from '$app/forms'
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import { onMount } from 'svelte'
  import { supabase } from '$lib/utils/supabase'
  import { LoadingSpinner, ErrorMessage, SuccessMessage } from '$lib'

  export let form

  let step = 1 // 1: Enable/Disable, 2: Setup, 3: Verify
  let mfaEnabled = false
  let qrCodeUrl = ''
  let secret = ''
  let verificationCode = ''
  let backupCodes: string[] = []
  let loading = true
  let submitting = false
  let showBackupCodes = false

  onMount(async () => {
    await loadMFAStatus()
  })

  async function loadMFAStatus() {
    try {
      const {
        data: { user }
      } = await supabase.auth.getUser()
      if (!user) {
        goto('/auth/login')
        return
      }

      // Check if MFA is already enabled
      // This would typically check a user profile or MFA enrollment status
      mfaEnabled = false // Default to disabled for demo
    } catch (error) {
      console.error('Error loading MFA status:', error)
    } finally {
      loading = false
    }
  }

  async function startMFASetup() {
    try {
      submitting = true

      // Generate TOTP secret (in a real app, this would be done server-side)
      // For demo purposes, we'll use a placeholder
      secret = 'JBSWY3DPEHPK3PXP' // This would be generated securely

      // Generate QR code URL for authenticator apps
      const issuer = 'Metzler Foundations'
      const account = 'user@metzlerfoundations.org' // Would be user's email
      qrCodeUrl = `otpauth://totp/${issuer}:${account}?secret=${secret}&issuer=${issuer}`

      step = 2
    } catch (error) {
      console.error('Error starting MFA setup:', error)
    } finally {
      submitting = false
    }
  }

  async function verifyMFASetup() {
    try {
      submitting = true

      // Verify the TOTP code
      // This would typically verify against the server
      const isValid = verificationCode.length === 6 && /^\d{6}$/.test(verificationCode)

      if (!isValid) {
        return {
          errors: { verificationCode: 'Invalid verification code' }
        }
      }

      // Generate backup codes (server-side in production)
      backupCodes = ['1234-5678-9012', '3456-7890-1234', '5678-9012-3456', '7890-1234-5678', '9012-3456-7890']

      step = 3
      return { success: true }
    } catch (error) {
      console.error('Error verifying MFA setup:', error)
      return {
        errors: { general: 'Failed to verify MFA setup' }
      }
    } finally {
      submitting = false
    }
  }

  async function disableMFA() {
    try {
      submitting = true

      // This would disable MFA on the server
      mfaEnabled = false
      step = 1

      return { success: true }
    } catch (error) {
      console.error('Error disabling MFA:', error)
      return {
        errors: { general: 'Failed to disable MFA' }
      }
    } finally {
      submitting = false
    }
  }

  function copyBackupCodes() {
    const codesText = backupCodes.join('\n')
    navigator.clipboard.writeText(codesText)
    // Could show a toast notification here
  }

  function printBackupCodes() {
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>MFA Backup Codes - Metzler Foundations</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .code { font-family: monospace; font-size: 18px; margin: 10px 0; padding: 10px; background: #f5f5f5; border-radius: 4px; }
              .warning { color: #d32f2f; font-weight: bold; margin: 20px 0; }
            </style>
          </head>
          <body>
            <h1>MFA Backup Codes</h1>
            <p>Keep these codes in a safe place. You can use them to access your account if you lose your authenticator device.</p>
            <div class="warning">⚠️ Each code can only be used once. Store them securely.</div>
            ${backupCodes.map(code => `<div class="code">${code}</div>`).join('')}
            <p><small>Generated on ${new Date().toLocaleDateString()}</small></p>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }
</script>

<svelte:head>
  <title>Multi-Factor Authentication - Metzler Foundations</title>
  <meta name="description" content="Set up multi-factor authentication to secure your Metzler Foundations account." />
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="min-h-screen bg-cream text-navy">
  <!-- Header -->
  <section class="py-8 px-4 sm:px-6 lg:px-8 border-b border-navy border-opacity-10">
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-serif font-medium text-navy">Multi-Factor Authentication</h1>
          <p class="text-navy text-opacity-70 mt-1">Add an extra layer of security to your account</p>
        </div>
        <a href="/account" class="btn-secondary"> ← Back to Account </a>
      </div>
    </div>
  </section>

  <!-- Content -->
  <section class="py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-2xl mx-auto">
      {#if loading}
        <!-- Loading State -->
        <div class="text-center py-12">
          <LoadingSpinner size="lg" color="navy" />
          <p class="text-navy text-opacity-70 mt-4">Loading MFA settings...</p>
        </div>
      {:else if step === 1}
        <!-- MFA Status & Enable/Disable -->
        <div class="bg-white rounded-xl shadow-sm border border-navy border-opacity-10 p-8">
          <div class="text-center mb-8">
            <div
              class="w-16 h-16 {mfaEnabled
                ? 'bg-green-100'
                : 'bg-gray-100'} rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <svg
                class="w-8 h-8 {mfaEnabled ? 'text-green-600' : 'text-gray-600'}"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {#if mfaEnabled}
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                {:else}
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                {/if}
              </svg>
            </div>

            <h2 class="text-xl font-serif font-medium text-navy mb-2">
              {mfaEnabled ? 'Multi-Factor Authentication Enabled' : 'Multi-Factor Authentication Disabled'}
            </h2>

            <p class="text-navy text-opacity-70">
              {mfaEnabled
                ? 'Your account is protected with an additional security layer.'
                : 'Add an authenticator app to secure your account with two-factor authentication.'}
            </p>
          </div>

          <!-- Security Benefits -->
          <div class="bg-cream bg-opacity-50 rounded-lg p-6 mb-8">
            <h3 class="font-semibold text-navy mb-3">Why enable MFA?</h3>
            <ul class="space-y-2 text-sm text-navy text-opacity-80">
              <li class="flex items-start space-x-2">
                <svg
                  class="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Protects against unauthorized access even if your password is compromised</span>
              </li>
              <li class="flex items-start space-x-2">
                <svg
                  class="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Uses time-based one-time passwords (TOTP) for secure authentication</span>
              </li>
              <li class="flex items-start space-x-2">
                <svg
                  class="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Backup codes provided for account recovery</span>
              </li>
            </ul>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-center">
            {#if mfaEnabled}
              <form method="POST" action="?/disable" use:enhance>
                <button
                  type="submit"
                  disabled={submitting}
                  class="btn-secondary bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                >
                  {#if submitting}
                    <div class="flex items-center space-x-2">
                      <LoadingSpinner size="sm" color="red" />
                      <span>Disabling...</span>
                    </div>
                  {:else}
                    Disable MFA
                  {/if}
                </button>
              </form>
            {:else}
              <button on:click={startMFASetup} disabled={submitting} class="btn-primary">
                {#if submitting}
                  <div class="flex items-center space-x-2">
                    <LoadingSpinner size="sm" color="white" />
                    <span>Setting up...</span>
                  </div>
                {:else}
                  Enable MFA
                {/if}
              </button>
            {/if}
          </div>
        </div>
      {:else if step === 2}
        <!-- MFA Setup -->
        <div class="bg-white rounded-xl shadow-sm border border-navy border-opacity-10 p-8">
          <h2 class="text-xl font-serif font-medium text-navy mb-6">Set Up Authenticator App</h2>

          <!-- Instructions -->
          <div class="space-y-4 mb-8">
            <div class="flex items-start space-x-3">
              <div
                class="w-6 h-6 bg-olive bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
              >
                <span class="text-xs font-semibold text-olive">1</span>
              </div>
              <div>
                <h3 class="font-medium text-navy">Download an authenticator app</h3>
                <p class="text-sm text-navy text-opacity-70">
                  Install an authenticator app like Google Authenticator, Authy, or Microsoft Authenticator on your
                  phone.
                </p>
              </div>
            </div>

            <div class="flex items-start space-x-3">
              <div
                class="w-6 h-6 bg-olive bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
              >
                <span class="text-xs font-semibold text-olive">2</span>
              </div>
              <div>
                <h3 class="font-medium text-navy">Scan the QR code</h3>
                <p class="text-sm text-navy text-opacity-70">
                  Open your authenticator app and scan the QR code below, or manually enter the secret key.
                </p>
              </div>
            </div>

            <div class="flex items-start space-x-3">
              <div
                class="w-6 h-6 bg-olive bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
              >
                <span class="text-xs font-semibold text-olive">3</span>
              </div>
              <div>
                <h3 class="font-medium text-navy">Enter verification code</h3>
                <p class="text-sm text-navy text-opacity-70">
                  Enter the 6-digit code from your authenticator app to complete setup.
                </p>
              </div>
            </div>
          </div>

          <!-- QR Code -->
          <div class="bg-gray-50 rounded-lg p-6 mb-6">
            <div class="text-center">
              <h3 class="font-medium text-navy mb-4">Scan QR Code</h3>
              {#if qrCodeUrl}
                <!-- In a real app, you'd generate an actual QR code image -->
                <div
                  class="w-48 h-48 bg-white border-2 border-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center"
                >
                  <div class="text-center text-gray-500">
                    <svg class="w-12 h-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M6 12h2m6 0h2m-6 0h-2v4m0-11v3m0 0h.01M12 4v1"
                      />
                    </svg>
                    <p class="text-xs">QR Code Placeholder</p>
                  </div>
                </div>
              {/if}

              <div class="text-center">
                <p class="text-sm text-navy text-opacity-70 mb-2">Or enter this code manually:</p>
                <code class="bg-gray-200 px-3 py-1 rounded text-sm font-mono">{secret}</code>
              </div>
            </div>
          </div>

          <!-- Verification Form -->
          <form method="POST" action="?/verify" use:enhance>
            <div class="mb-6">
              <label for="verificationCode" class="form-label"> Verification Code </label>
              <input
                id="verificationCode"
                name="verificationCode"
                type="text"
                inputmode="numeric"
                pattern="[0-9]{6}"
                maxlength="6"
                bind:value={verificationCode}
                class="form-input text-center text-2xl tracking-widest"
                placeholder="000000"
                required
              />
              <p class="text-xs text-navy text-opacity-60 mt-1">Enter the 6-digit code from your authenticator app</p>
            </div>

            <div class="flex space-x-4">
              <button type="button" on:click={() => (step = 1)} class="btn-secondary flex-1"> Cancel </button>
              <button
                type="submit"
                disabled={submitting || verificationCode.length !== 6}
                class="btn-primary flex-1 disabled:opacity-50"
              >
                {#if submitting}
                  <div class="flex items-center justify-center space-x-2">
                    <LoadingSpinner size="sm" color="white" />
                    <span>Verifying...</span>
                  </div>
                {:else}
                  Verify & Enable
                {/if}
              </button>
            </div>
          </form>

          <!-- Form Errors -->
          {#if form?.errors}
            <div class="mt-4">
              <ErrorMessage title="Verification Failed" message={Object.values(form.errors).join(', ')} />
            </div>
          {/if}
        </div>
      {:else if step === 3}
        <!-- Backup Codes -->
        <div class="bg-white rounded-xl shadow-sm border border-navy border-opacity-10 p-8">
          <div class="text-center mb-8">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            <h2 class="text-xl font-serif font-medium text-navy mb-2">MFA Successfully Enabled!</h2>

            <p class="text-navy text-opacity-70">Your account is now protected with multi-factor authentication.</p>
          </div>

          <!-- Backup Codes Alert -->
          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
            <div class="flex items-start space-x-3">
              <svg class="w-6 h-6 text-yellow-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <div>
                <h3 class="text-lg font-semibold text-yellow-800 mb-2">Save Your Backup Codes</h3>
                <p class="text-yellow-700 text-sm mb-4">
                  These codes can be used to access your account if you lose your authenticator device. Store them in a
                  safe place - each code can only be used once.
                </p>
                <button
                  on:click={() => (showBackupCodes = !showBackupCodes)}
                  class="text-yellow-800 font-medium underline hover:text-yellow-900"
                >
                  {showBackupCodes ? 'Hide' : 'Show'} Backup Codes
                </button>
              </div>
            </div>
          </div>

          <!-- Backup Codes Display -->
          {#if showBackupCodes}
            <div class="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 class="font-semibold text-navy mb-4">Your Backup Codes</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {#each backupCodes as code}
                  <code class="bg-white px-3 py-2 rounded border font-mono text-sm text-center">
                    {code}
                  </code>
                {/each}
              </div>
              <div class="flex flex-col sm:flex-row gap-3">
                <button on:click={copyBackupCodes} class="btn-secondary text-sm"> 📋 Copy Codes </button>
                <button on:click={printBackupCodes} class="btn-secondary text-sm"> 🖨️ Print Codes </button>
              </div>
            </div>
          {/if}

          <!-- Next Steps -->
          <div class="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 class="font-semibold text-green-800 mb-2">What's Next?</h3>
            <ul class="text-sm text-green-700 space-y-1">
              <li>• You'll be prompted for MFA codes on future logins</li>
              <li>• Keep your backup codes safe for account recovery</li>
              <li>• You can disable MFA anytime from this page</li>
            </ul>
          </div>

          <!-- Finish Button -->
          <div class="mt-8 text-center">
            <a href="/account" class="btn-primary"> Return to Account Settings </a>
          </div>
        </div>
      {/if}
    </div>
  </section>
</div>
