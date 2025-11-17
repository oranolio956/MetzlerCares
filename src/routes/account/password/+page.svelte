<script lang="ts">
  import { onMount } from 'svelte'
  import { supabase } from '$lib/utils/supabase'
  import {
    validatePasswordStrength,
    getPasswordPolicyDescription,
    getPasswordStrengthText,
    getPasswordStrengthColor,
    PASSWORD_POLICY
  } from '$lib/utils/password-policy'

  let currentPassword = ''
  let newPassword = ''
  let confirmPassword = ''
  let loading = false
  let error = ''
  let success = ''
  let passwordStrength: { valid: boolean; score: number; issues: string[]; suggestions: string[] } = {
    valid: false,
    score: 0,
    issues: [] as string[],
    suggestions: [] as string[]
  }

  // Password policy status
  let policyStatus: any = null
  let policyLoading = true

  onMount(async () => {
    await loadPasswordPolicyStatus()
  })

  async function loadPasswordPolicyStatus() {
    try {
      const { data, error } = await supabase.rpc('get_password_policy_status')
      if (error) throw error
      policyStatus = data[0]
    } catch (err) {
      console.error('Error loading password policy status:', err)
    } finally {
      policyLoading = false
    }
  }

  function validatePasswords() {
    error = ''

    if (!currentPassword) {
      error = 'Current password is required'
      return false
    }

    if (!newPassword) {
      error = 'New password is required'
      return false
    }

    if (newPassword !== confirmPassword) {
      error = 'New passwords do not match'
      return false
    }

    if (currentPassword === newPassword) {
      error = 'New password must be different from current password'
      return false
    }

    // Validate password strength
    passwordStrength = validatePasswordStrength(newPassword)
    if (!passwordStrength.valid) {
      error = passwordStrength.issues[0]
      return false
    }

    return true
  }

  async function changePassword(event: Event) {
    event.preventDefault();
    if (!validatePasswords()) return

    loading = true
    error = ''
    success = ''

    try {
      const { data, error: changeError } = await supabase.rpc('change_password', {
        p_user_id: (await supabase.auth.getUser()).data.user?.id,
        p_current_password: currentPassword,
        p_new_password: newPassword
      })

      if (changeError) throw changeError

      const result = data[0]
      if (result.success) {
        success = result.message
        // Reset form
        currentPassword = ''
        newPassword = ''
        confirmPassword = ''
        passwordStrength = { valid: false, score: 0, issues: [], suggestions: [] }
        // Reload policy status
        await loadPasswordPolicyStatus()
      } else {
        error = result.message
      }
    } catch (err) {
      console.error('Error changing password:', err)
      error = err instanceof Error ? err.message : 'Failed to change password'
    } finally {
      loading = false
    }
  }

  function handlePasswordInput() {
    passwordStrength = validatePasswordStrength(newPassword)
  }
</script>

<svelte:head>
  <title>Change Password - Metzler Foundations</title>
  <meta name="description" content="Update your account password to maintain security compliance." />
</svelte:head>

<div class="min-h-screen bg-cream text-navy">
  <!-- Header -->
  <header class="bg-white border-b border-navy border-opacity-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div class="flex items-center space-x-4">
        <a href="/account" class="text-navy hover:text-olive transition-colors" title="Back to Account Settings">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </a>
        <h1 class="text-2xl font-serif font-medium text-navy">Change Password</h1>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Password Policy Status -->
    {#if policyLoading}
      <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-6 mb-6">
        <div class="animate-pulse">
          <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div class="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    {:else if policyStatus}
      <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-6 mb-6">
        <h2 class="text-lg font-medium text-navy mb-4">Password Status</h2>
        <div class="space-y-3">
          {#if policyStatus.is_locked}
            <div class="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
              <svg class="w-5 h-5 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <div>
                <p class="font-medium text-red-800">Account Locked</p>
                <p class="text-sm text-red-600">
                  Too many failed login attempts. Unlocks in {policyStatus.lockout_remaining_minutes} minutes.
                </p>
              </div>
            </div>
          {:else if policyStatus.is_expired}
            <div class="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
              <svg class="w-5 h-5 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <div>
                <p class="font-medium text-red-800">Password Expired</p>
                <p class="text-sm text-red-600">Your password has expired and must be changed immediately.</p>
              </div>
            </div>
          {:else if policyStatus.requires_change}
            <div class="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <svg class="w-5 h-5 text-yellow-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <div>
                <p class="font-medium text-yellow-800">Password Change Required</p>
                <p class="text-sm text-yellow-600">{policyStatus.change_reason}</p>
                {#if policyStatus.days_until_expiry > 0}
                  <p class="text-sm text-yellow-600">Expires in {policyStatus.days_until_expiry} days.</p>
                {/if}
              </div>
            </div>
          {:else}
            <div class="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
              <svg class="w-5 h-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <p class="font-medium text-green-800">Password Status Good</p>
                <p class="text-sm text-green-600">
                  Password is {policyStatus.password_age_days} days old. Expires in {policyStatus.days_until_expiry} days.
                </p>
              </div>
            </div>
          {/if}
        </div>
      </div>
    {/if}

    <!-- Password Change Form -->
    <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-6">
      <h2 class="text-lg font-medium text-navy mb-4">Change Password</h2>

      {#if error}
        <div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-red-800 text-sm">{error}</p>
        </div>
      {/if}

      {#if success}
        <div class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p class="text-green-800 text-sm">{success}</p>
        </div>
      {/if}

        <form onsubmit={changePassword} class="space-y-6">
        <!-- Current Password -->
        <div>
          <label for="current-password" class="block text-sm font-medium text-navy mb-2"> Current Password </label>
          <input
            id="current-password"
            type="password"
            bind:value={currentPassword}
            class="form-input w-full"
            required
            autocomplete="current-password"
          />
        </div>

        <!-- New Password -->
        <div>
          <label for="new-password" class="block text-sm font-medium text-navy mb-2"> New Password </label>
          <input
            id="new-password"
            type="password"
            bind:value={newPassword}
            oninput={handlePasswordInput}
            class="form-input w-full"
            required
            autocomplete="new-password"
          />

          <!-- Password Strength Indicator -->
          {#if newPassword}
            <div class="mt-2">
              <div class="flex items-center space-x-2 mb-1">
                <div class="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    class="h-2 rounded-full transition-all duration-300 {getPasswordStrengthColor(
                      passwordStrength.score
                    )}"
                    style="width: {passwordStrength.score}%"
                  ></div>
                </div>
                <span class="text-sm font-medium {getPasswordStrengthColor(passwordStrength.score)}">
                  {getPasswordStrengthText(passwordStrength.score)}
                </span>
              </div>

              {#if passwordStrength.issues.length > 0}
                <ul class="text-sm text-red-600 space-y-1">
                  {#each passwordStrength.issues.slice(0, 3) as issue}
                    <li>• {issue}</li>
                  {/each}
                </ul>
              {/if}

              {#if passwordStrength.suggestions.length > 0 && passwordStrength.issues.length === 0}
                <div class="text-sm text-blue-600">
                  <p class="font-medium">Suggestions:</p>
                  <ul class="space-y-1">
                    {#each passwordStrength.suggestions.slice(0, 2) as suggestion}
                      <li>• {suggestion}</li>
                    {/each}
                  </ul>
                </div>
              {/if}
            </div>
          {/if}
        </div>

        <!-- Confirm New Password -->
        <div>
          <label for="confirm-password" class="block text-sm font-medium text-navy mb-2"> Confirm New Password </label>
          <input
            id="confirm-password"
            type="password"
            bind:value={confirmPassword}
            class="form-input w-full"
            required
            autocomplete="new-password"
          />
          {#if newPassword && confirmPassword && newPassword !== confirmPassword}
            <p class="mt-1 text-sm text-red-600">Passwords do not match</p>
          {/if}
        </div>

        <!-- Password Policy Info -->
        <div class="bg-gray-50 p-4 rounded-lg">
          <h3 class="text-sm font-medium text-navy mb-2">Password Requirements</h3>
          <div class="text-sm text-navy text-opacity-70 space-y-1">
            <p>• At least {PASSWORD_POLICY.minLength} characters long</p>
            <p>• Must contain uppercase and lowercase letters</p>
            <p>• Must contain at least one number and one special character</p>
            <p>• Cannot be a common password or contain sequential patterns</p>
            <p>• Expires after {PASSWORD_POLICY.expirationDays} days</p>
            <p>• Cannot reuse any of your last {PASSWORD_POLICY.historyCount} passwords</p>
          </div>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          disabled={loading || !passwordStrength.valid || newPassword !== confirmPassword}
          class="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {#if loading}
            <div class="flex items-center justify-center">
              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Changing Password...
            </div>
          {:else}
            Change Password
          {/if}
        </button>
      </form>
    </div>
  </main>
</div>
