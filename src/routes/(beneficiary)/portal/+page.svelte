<script lang="ts">
  import MetzlerBridgeLogo from '$lib/MetzlerBridgeLogo.svelte'
  import { goto } from '$app/navigation'
  import { supabase } from '$lib/utils/supabase'
  import { onMount } from 'svelte'
  import type { Application, Beneficiary, FormError } from '$lib/types'
  import { LoadingSpinner, ErrorMessage } from '$lib'

  let application: Application | null = null
  let beneficiary: Beneficiary | null = null
  let loading = true
  let error: FormError | null = null
  let retryCount = 0
  const MAX_RETRIES = 3

  // Profile management
  let showProfileModal = false
  let editingProfile = false
  let profileForm = {
    full_name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip_code: ''
  }
  let profileErrors: Record<string, string> = {}
  let savingProfile = false

  // Password reset
  let showPasswordModal = false
  let passwordForm = {
    current_password: '',
    new_password: '',
    confirm_password: ''
  }
  let passwordErrors: Record<string, string> = {}
  let resettingPassword = false

  // Communication center
  let messages: any[] = []
  let unreadCount = 0
  let showMessagesModal = false
  let selectedMessage: any = null
  let newMessage = ''
  let sendingMessage = false

  // Resources
  let resources: any[] = []
  let showResourcesModal = false

  onMount(async () => {
    await Promise.all([loadApplicationStatus(), loadMessages(), loadResources()])
  })

  async function loadApplicationStatus() {
    try {
      loading = true
      error = null

      // Get current user
      const {
        data: { user },
        error: authError
      } = await supabase.auth.getUser()

      if (authError || !user) {
        goto('/auth/login')
        return
      }

      // Load beneficiary profile
      const { data: beneficiaryData, error: beneficiaryError } = await supabase
        .from('beneficiaries')
        .select('*')
        .eq('id', user.id)
        .single()

      if (beneficiaryError) {
        if (beneficiaryError.code === 'PGRST116') {
          error = { message: 'Beneficiary profile not found. Please contact support.' }
        } else {
          error = { message: 'Unable to load your profile. Please try again.' }
        }
        return
      }

      beneficiary = beneficiaryData
      profileForm = {
        full_name: beneficiary.full_name || '',
        phone: beneficiary.phone || '',
        address: beneficiary.address || '',
        city: beneficiary.city || '',
        state: beneficiary.state || '',
        zip_code: beneficiary.zip_code || ''
      }

      // Load most recent application
      const { data: applicationData, error: appError } = await supabase
        .from('applications')
        .select(
          `
          *,
          sober_living_partners (
            facility_name,
            contact_email,
            address_city,
            address_state
          )
        `
        )
        .eq('beneficiary_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (appError && appError.code !== 'PGRST116') {
        error = { message: 'Unable to load your application status. Please try again.' }
        return
      }

      application = applicationData || null
    } catch (err) {
      console.error('Error loading status:', err)
      error = {
        message:
          retryCount < MAX_RETRIES - 1
            ? 'Connection error. Retrying...'
            : 'Unable to load your information. Please check your connection and try again.'
      }
      retryCount++
    } finally {
      loading = false
    }
  }

  async function loadMessages() {
    try {
      const {
        data: { user }
      } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('beneficiary_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      messages = data || []
      unreadCount = messages.filter(msg => !msg.read).length
    } catch (err) {
      console.error('Error loading messages:', err)
    }
  }

  async function loadResources() {
    try {
      const { data, error } = await supabase
        .from('local_resources')
        .select('*')
        .eq('state', 'CO') // Assuming Colorado focus
        .limit(10)

      if (error) throw error
      resources = data || []
    } catch (err) {
      console.error('Error loading resources:', err)
    }
  }

  function getStatusStep(status: string): number {
    switch (status) {
      case 'draft':
      case 'pending':
        return 1
      case 'approved':
        return 2
      case 'funded':
        return 3
      default:
        return 1
    }
  }

  function getStatusMessage(status: string) {
    switch (status) {
      case 'pending':
        return {
          headline: "We're On It.",
          body: 'Your application has been submitted and is in our automated verification queue. This process is usually completed in under 15 minutes. Please check back soon.'
        }
      case 'approved':
        return {
          headline: "You're Approved.",
          body: `Your scholarship is approved. We are now processing the payment directly to ${application?.sober_living_partners?.facility_name || 'your facility'}. You do not need to do anything else. A confirmation email has been sent to you.`
        }
      case 'funded':
        return {
          headline: 'Your Scholarship Has Been Paid.',
          body: `Your scholarship has been successfully paid to ${application?.sober_living_partners?.facility_name || 'your facility'}. We are honored to be a part of your recovery journey.`
        }
      default:
        return {
          headline: 'Application Submitted',
          body: "Your application is being processed. We'll update you as soon as we have more information."
        }
    }
  }

  async function updateProfile(event: Event) {
    event.preventDefault();
    if (savingProfile) return

    savingProfile = true
    profileErrors = {}

    try {
      const {
        data: { user }
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error } = await supabase
        .from('beneficiaries')
        .update({
          full_name: profileForm.full_name,
          phone: profileForm.phone,
          address: profileForm.address,
          city: profileForm.city,
          state: profileForm.state,
          zip_code: profileForm.zip_code,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) throw error

      beneficiary = { ...beneficiary, ...profileForm }
      editingProfile = false
      showProfileModal = false

      alert('Profile updated successfully!')
    } catch (err) {
      console.error('Profile update error:', err)
      profileErrors.general = 'Failed to update profile. Please try again.'
    } finally {
      savingProfile = false
    }
  }

  async function resetPassword(event: Event) {
    event.preventDefault();
    if (resettingPassword) return

    resettingPassword = true
    passwordErrors = {}

    // Validate passwords
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      passwordErrors.confirm_password = 'Passwords do not match'
      resettingPassword = false
      return
    }

    if (passwordForm.new_password.length < 8) {
      passwordErrors.new_password = 'Password must be at least 8 characters'
      resettingPassword = false
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.new_password
      })

      if (error) throw error

      passwordForm = { current_password: '', new_password: '', confirm_password: '' }
      showPasswordModal = false

      alert('Password updated successfully!')
    } catch (err) {
      console.error('Password reset error:', err)
      passwordErrors.general = 'Failed to update password. Please try again.'
    } finally {
      resettingPassword = false
    }
  }

  async function sendMessage(event: Event) {
    event.preventDefault();
    if (sendingMessage || !newMessage.trim()) return

    sendingMessage = true
    try {
      const {
        data: { user }
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error } = await supabase.from('messages').insert({
        beneficiary_id: user.id,
        message: newMessage.trim(),
        direction: 'to_staff',
        created_at: new Date().toISOString()
      })

      if (error) throw error

      newMessage = ''
      await loadMessages()
    } catch (err) {
      console.error('Send message error:', err)
      alert('Failed to send message. Please try again.')
    } finally {
      sendingMessage = false
    }
  }

  function markMessageAsRead(messageId: string) {
    // Update local state
    messages = messages.map(msg => (msg.id === messageId ? { ...msg, read: true } : msg))
    unreadCount = Math.max(0, unreadCount - 1)
  }

  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }
</script>

<svelte:head>
  <title>My Application Status - Metzler Foundations</title>
  <meta name="description" content="Check your application status and track your scholarship progress." />
</svelte:head>

<div class="min-h-screen bg-cream text-navy">
  <!-- Header -->
  <header class="bg-cream border-b border-navy border-opacity-10 sticky top-0 z-40">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div class="flex justify-between items-center">
        <button onclick={() => goto('/')} class="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <MetzlerBridgeLogo className="w-8 h-8 text-navy" />
          <span class="text-xl font-serif font-medium text-navy">Beneficiary Portal</span>
        </button>

        <div class="flex items-center space-x-4">
          <!-- Quick Actions -->
          <div class="hidden md:flex items-center space-x-4">
            <!-- Messages Button -->
            <button
              onclick={() => (showMessagesModal = true)}
              class="relative p-2 text-navy hover:text-olive transition-colors"
              title="Messages"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              {#if unreadCount > 0}
                <span
                  class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                >
                  {unreadCount}
                </span>
              {/if}
            </button>

            <!-- Profile Button -->
            <button
              onclick={() => (showProfileModal = true)}
              class="p-2 text-navy hover:text-olive transition-colors"
              title="Profile Settings"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </button>

            <!-- Resources Button -->
            <button
              onclick={() => (showResourcesModal = true)}
              class="p-2 text-navy hover:text-olive transition-colors"
              title="Helpful Resources"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </button>
          </div>

          <!-- Mobile Menu Button -->
          <div class="md:hidden">
            <button
              onclick={() => (showMessagesModal = true)}
              class="relative p-2 text-navy hover:text-olive transition-colors"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              {#if unreadCount > 0}
                <span
                  class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center"
                >
                  !
                </span>
              {/if}
            </button>
          </div>

          <span class="text-sm text-navy text-opacity-70">Welcome back, {beneficiary?.full_name || 'User'}</span>
          <button onclick={() => supabase.auth.signOut().then(() => goto('/'))} class="btn-secondary text-sm">
            Sign Out
          </button>
        </div>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    {#if loading}
      <!-- Loading State -->
      <div class="flex flex-col justify-center items-center py-16" role="status" aria-live="polite">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-navy mb-4"></div>
        <h3 class="text-lg font-medium text-navy mb-2">Loading Your Application Status</h3>
        <p class="text-navy text-opacity-70 text-center max-w-md">
          We're retrieving your latest information. This may take a moment...
        </p>
      </div>
    {:else if error}
      <!-- Error State -->
      <div class="bg-red-50 border border-red-200 rounded-lg p-8 text-center" role="alert">
        <svg
          class="mx-auto h-12 w-12 text-red-400 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
        <h3 class="text-lg font-medium text-red-800 mb-2">Unable to Load Your Information</h3>
        <p class="text-red-700 mb-6 max-w-md mx-auto">{error.message}</p>
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onclick={loadApplicationStatus}
            class="bg-red-100 px-6 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
            aria-label="Retry loading your application status"
          >
            Try Again
          </button>
          <a
            href="mailto:support@metzlerfoundations.org"
            class="bg-white px-6 py-2 rounded-md text-sm font-medium text-red-800 border border-red-300 hover:bg-red-50 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
            aria-label="Contact support for help"
          >
            Contact Support
          </a>
        </div>
      </div>
    {:else if !application}
      <!-- No Application Found -->
      <div class="text-center py-16">
        <svg
          class="mx-auto h-12 w-12 text-navy text-opacity-40 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h1 class="text-3xl font-medium text-navy mb-4">No Application Found</h1>
        <p class="text-navy text-opacity-70 mb-8 max-w-2xl mx-auto">
          We don't have an application on file for your account. If you've recently applied, please allow a few minutes
          for processing. Otherwise, you can start a new application below.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button onclick={loadApplicationStatus} class="btn-primary"> Check Status Again </button>
          <button onclick={() => goto('/get-aid')} class="btn-secondary"> Start New Application </button>
        </div>
      </div>
    {:else}
      <!-- Application Status Display -->
      <div class="space-y-8">
        <!-- Progress Tracker -->
        <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-8">
          <h1 class="text-2xl font-medium text-navy mb-8 text-center">My Application Status</h1>

          <!-- Visual Progress Bar -->
          <div class="mb-8">
            <div class="flex items-center justify-center space-x-8 mb-4">
              <div class="flex flex-col items-center">
                <div
                  class={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium mb-2 ${
                    getStatusStep(application.status) >= 1 ? 'bg-navy text-cream' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  1
                </div>
                <span class="text-xs text-center text-navy text-opacity-70">Application<br />Submitted</span>
              </div>

              <div class="w-16 h-0.5 bg-gray-200"></div>

              <div class="flex flex-col items-center">
                <div
                  class={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium mb-2 ${
                    getStatusStep(application.status) >= 2 ? 'bg-navy text-cream' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  2
                </div>
                <span class="text-xs text-center text-navy text-opacity-70">Application<br />Approved</span>
              </div>

              <div class="w-16 h-0.5 bg-gray-200"></div>

              <div class="flex flex-col items-center">
                <div
                  class={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium mb-2 ${
                    getStatusStep(application.status) >= 3 ? 'bg-navy text-cream' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  3
                </div>
                <span class="text-xs text-center text-navy text-opacity-70">Scholarship<br />Funded</span>
              </div>
            </div>
          </div>

          <!-- Status Message -->
          <div class="text-center">
            <h2 class="text-2xl font-medium text-navy mb-4">{getStatusMessage(application.status).headline}</h2>
            <p class="text-navy text-opacity-80 max-w-2xl mx-auto">{getStatusMessage(application.status).body}</p>
          </div>
        </div>

        <!-- Application Details -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Beneficiary Information -->
          <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-6">
            <h2 class="text-xl font-medium text-navy mb-6">Application Details</h2>

            <div class="space-y-4">
              <div>
                <p class="block text-sm font-medium text-navy text-opacity-70 mb-1">Application ID</p>
                <p class="text-navy">{application.id.slice(-8).toUpperCase()}</p>
              </div>

              <div>
                <p class="block text-sm font-medium text-navy text-opacity-70 mb-1">Submitted</p>
                <p class="text-navy">{new Date(application.created_at).toLocaleDateString()}</p>
              </div>

              <div>
                <p class="block text-sm font-medium text-navy text-opacity-70 mb-1">Status</p>
                <span
                  class={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    application.status === 'approved'
                      ? 'bg-green-100 text-green-800'
                      : application.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : application.status === 'funded'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {application.status.replace(/_/g, ' ')}
                </span>
              </div>

              {#if application.amount_requested}
                <div>
                  <p class="block text-sm font-medium text-navy text-opacity-70 mb-1">Requested Amount</p>
                  <p class="text-navy">${application.amount_requested}</p>
                </div>
              {/if}

              {#if application.status === 'funded' && application.payment_date}
                <div>
                  <p class="block text-sm font-medium text-navy text-opacity-70 mb-1">Payment Date</p>
                  <p class="text-navy">{new Date(application.payment_date).toLocaleDateString()}</p>
                </div>
              {/if}
            </div>
          </div>

          <!-- Facility Information -->
          <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-6">
            <h2 class="text-xl font-medium text-navy mb-6">Assigned Facility</h2>

            {#if application.sober_living_partners}
              <div class="space-y-4">
                <div>
                  <p class="block text-sm font-medium text-navy text-opacity-70 mb-1">Facility Name</p>
                  <p class="text-navy">{application.sober_living_partners.facility_name}</p>
                </div>

                <div>
                  <p class="block text-sm font-medium text-navy text-opacity-70 mb-1">Location</p>
                  <p class="text-navy">
                    {application.sober_living_partners.address_city}, {application.sober_living_partners.address_state}
                  </p>
                </div>

                <div>
                  <p class="block text-sm font-medium text-navy text-opacity-70 mb-1">Contact</p>
                  <p class="text-navy">{application.sober_living_partners.contact_email}</p>
                </div>

                {#if application.status === 'funded'}
                  <div class="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div class="flex items-start">
                      <svg
                        class="w-5 h-5 text-green-400 mt-0.5 mr-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <div>
                        <h3 class="text-sm font-medium text-green-800">Payment Processed</h3>
                        <p class="text-sm text-green-700 mt-1">
                          Your scholarship has been paid directly to this facility. They will contact you soon to
                          arrange move-in.
                        </p>
                      </div>
                    </div>
                  </div>
                {:else if application.status === 'approved'}
                  <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div class="flex items-start">
                      <svg
                        class="w-5 h-5 text-blue-400 mt-0.5 mr-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <div>
                        <h3 class="text-sm font-medium text-blue-800">Payment Processing</h3>
                        <p class="text-sm text-blue-700 mt-1">
                          Your scholarship is approved and payment is being processed. This usually takes 1-2 business
                          days.
                        </p>
                      </div>
                    </div>
                  </div>
                {/if}
              </div>
            {:else}
              <div class="text-center py-8">
                <svg
                  class="mx-auto h-8 w-8 text-navy text-opacity-40 mb-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                <p class="text-navy text-opacity-60">Facility assignment pending</p>
              </div>
            {/if}
          </div>
        </div>

        <!-- Support Information -->
        <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-8">
          <h2 class="text-xl font-medium text-navy mb-6 text-center">Need Help?</h2>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="text-center">
              <svg class="mx-auto h-8 w-8 text-olive mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <h3 class="font-medium text-navy mb-2">Call Support</h3>
              <p class="text-sm text-navy text-opacity-70">Have questions about your application?</p>
              <a href="tel:+15551234567" class="text-olive hover:text-navy text-sm font-medium mt-2 inline-block">
                (555) 123-4567
              </a>
            </div>

            <div class="text-center">
              <svg class="mx-auto h-8 w-8 text-olive mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <h3 class="font-medium text-navy mb-2">Email Updates</h3>
              <p class="text-sm text-navy text-opacity-70">We'll send you updates at your email address.</p>
            </div>

            <div class="text-center">
              <svg class="mx-auto h-8 w-8 text-olive mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 class="font-medium text-navy mb-2">FAQs</h3>
              <p class="text-sm text-navy text-opacity-70">Common questions about the process.</p>
              <a href="/faqs" class="text-olive hover:text-navy text-sm font-medium mt-2 inline-block"> View FAQs → </a>
            </div>
          </div>
        </div>
      </div>
    {/if}

    <!-- Modals -->
    <!-- Profile Management Modal -->
    {#if showProfileModal}
      <div
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        role="dialog"
        aria-modal="true"
      >
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-xl font-serif font-medium text-navy">Profile Settings</h2>
              <button
                onclick={() => {
                  showProfileModal = false
                  editingProfile = false
                }}
                class="text-navy text-opacity-60 hover:text-navy"
              >
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {#if !editingProfile}
              <!-- View Profile -->
              <div class="space-y-4 mb-6">
                <div>
                  <label class="block text-sm font-medium text-navy text-opacity-70">Full Name</label>
                  <p class="text-navy mt-1">{beneficiary?.full_name || 'Not set'}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-navy text-opacity-70">Email</label>
                  <p class="text-navy mt-1">{beneficiary?.email || 'Not set'}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-navy text-opacity-70">Phone</label>
                  <p class="text-navy mt-1">{beneficiary?.phone || 'Not set'}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-navy text-opacity-70">Address</label>
                  <p class="text-navy mt-1">{beneficiary?.address || 'Not set'}</p>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-navy text-opacity-70">City</label>
                    <p class="text-navy mt-1">{beneficiary?.city || 'Not set'}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-navy text-opacity-70">State</label>
                    <p class="text-navy mt-1">{beneficiary?.state || 'Not set'}</p>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-navy text-opacity-70">ZIP Code</label>
                  <p class="text-navy mt-1">{beneficiary?.zip_code || 'Not set'}</p>
                </div>
              </div>

              <div class="flex space-x-3">
                <button onclick={() => (editingProfile = true)} class="btn-primary flex-1"> Edit Profile </button>
                <button onclick={() => (showPasswordModal = true)} class="btn-secondary flex-1">
                  Change Password
                </button>
              </div>
            {:else}
              <!-- Edit Profile Form -->
              <form onsubmit={updateProfile} class="space-y-4">
                {#if profileErrors.general}
                  <div class="bg-red-50 border border-red-200 rounded p-3 text-red-800 text-sm">
                    {profileErrors.general}
                  </div>
                {/if}

                <div>
                  <label for="full_name" class="block text-sm font-medium text-navy text-opacity-70">Full Name</label>
                  <input
                    id="full_name"
                    type="text"
                    bind:value={profileForm.full_name}
                    class="mt-1 w-full px-3 py-2 border border-navy border-opacity-20 rounded-md focus:outline-none focus:ring-2 focus:ring-olive focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label for="phone" class="block text-sm font-medium text-navy text-opacity-70">Phone</label>
                  <input
                    id="phone"
                    type="tel"
                    bind:value={profileForm.phone}
                    class="mt-1 w-full px-3 py-2 border border-navy border-opacity-20 rounded-md focus:outline-none focus:ring-2 focus:ring-olive focus:border-transparent"
                  />
                </div>

                <div>
                  <label for="address" class="block text-sm font-medium text-navy text-opacity-70">Address</label>
                  <input
                    id="address"
                    type="text"
                    bind:value={profileForm.address}
                    class="mt-1 w-full px-3 py-2 border border-navy border-opacity-20 rounded-md focus:outline-none focus:ring-2 focus:ring-olive focus:border-transparent"
                  />
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label for="city" class="block text-sm font-medium text-navy text-opacity-70">City</label>
                    <input
                      id="city"
                      type="text"
                      bind:value={profileForm.city}
                      class="mt-1 w-full px-3 py-2 border border-navy border-opacity-20 rounded-md focus:outline-none focus:ring-2 focus:ring-olive focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label for="state" class="block text-sm font-medium text-navy text-opacity-70">State</label>
                    <input
                      id="state"
                      type="text"
                      bind:value={profileForm.state}
                      class="mt-1 w-full px-3 py-2 border border-navy border-opacity-20 rounded-md focus:outline-none focus:ring-2 focus:ring-olive focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label for="zip_code" class="block text-sm font-medium text-navy text-opacity-70">ZIP Code</label>
                  <input
                    id="zip_code"
                    type="text"
                    bind:value={profileForm.zip_code}
                    class="mt-1 w-full px-3 py-2 border border-navy border-opacity-20 rounded-md focus:outline-none focus:ring-2 focus:ring-olive focus:border-transparent"
                  />
                </div>

                <div class="flex space-x-3 pt-4">
                  <button onclick={() => (editingProfile = false)} class="btn-secondary flex-1" type="button">
                    Cancel
                  </button>
                  <button type="submit" disabled={savingProfile} class="btn-primary flex-1">
                    {savingProfile ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            {/if}
          </div>
        </div>
      </div>
    {/if}

    <!-- Password Reset Modal -->
    {#if showPasswordModal}
      <div
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        role="dialog"
        aria-modal="true"
      >
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
          <div class="p-6">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-xl font-serif font-medium text-navy">Change Password</h2>
              <button onclick={() => (showPasswordModal = false)} class="text-navy text-opacity-60 hover:text-navy">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onsubmit={resetPassword} class="space-y-4">
              {#if passwordErrors.general}
                <div class="bg-red-50 border border-red-200 rounded p-3 text-red-800 text-sm">
                  {passwordErrors.general}
                </div>
              {/if}

              <div>
                <label for="new_password" class="block text-sm font-medium text-navy text-opacity-70"
                  >New Password</label
                >
                <input
                  id="new_password"
                  type="password"
                  bind:value={passwordForm.new_password}
                  class="mt-1 w-full px-3 py-2 border border-navy border-opacity-20 rounded-md focus:outline-none focus:ring-2 focus:ring-olive focus:border-transparent"
                  placeholder="Enter new password"
                  required
                />
                {#if passwordErrors.new_password}
                  <p class="text-red-600 text-sm mt-1">{passwordErrors.new_password}</p>
                {/if}
              </div>

              <div>
                <label for="confirm_password" class="block text-sm font-medium text-navy text-opacity-70"
                  >Confirm New Password</label
                >
                <input
                  id="confirm_password"
                  type="password"
                  bind:value={passwordForm.confirm_password}
                  class="mt-1 w-full px-3 py-2 border border-navy border-opacity-20 rounded-md focus:outline-none focus:ring-2 focus:ring-olive focus:border-transparent"
                  placeholder="Confirm new password"
                  required
                />
                {#if passwordErrors.confirm_password}
                  <p class="text-red-600 text-sm mt-1">{passwordErrors.confirm_password}</p>
                {/if}
              </div>

              <div class="text-sm text-navy text-opacity-70">
                Password must be at least 8 characters long and contain uppercase, lowercase, and numeric characters.
              </div>

              <div class="flex space-x-3 pt-4">
                <button onclick={() => (showPasswordModal = false)} class="btn-secondary flex-1" type="button">
                  Cancel
                </button>
                <button type="submit" disabled={resettingPassword} class="btn-primary flex-1">
                  {resettingPassword ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    {/if}

    <!-- Communication Center Modal -->
    {#if showMessagesModal}
      <div
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        role="dialog"
        aria-modal="true"
      >
        <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
          <div class="p-6 border-b border-navy border-opacity-10">
            <div class="flex justify-between items-center">
              <h2 class="text-xl font-serif font-medium text-navy">Communication Center</h2>
              <button onclick={() => (showMessagesModal = false)} class="text-navy text-opacity-60 hover:text-navy">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div class="flex-1 overflow-y-auto p-6 space-y-4">
            {#each messages as message}
              <div class="flex {message.direction === 'to_staff' ? 'justify-end' : 'justify-start'}">
                <div
                  class="max-w-xs lg:max-w-md px-4 py-2 rounded-lg {message.direction === 'to_staff'
                    ? 'bg-olive text-cream'
                    : 'bg-gray-100 text-navy'}"
                >
                  <p class="text-sm">{message.message}</p>
                  <p class="text-xs opacity-75 mt-1">
                    {new Date(message.created_at).toLocaleDateString()}
                    {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  {#if !message.read && message.direction === 'from_staff'}
                    <button onclick={() => markMessageAsRead(message.id)} class="text-xs underline opacity-75 mt-1">
                      Mark as read
                    </button>
                  {/if}
                </div>
              </div>
            {/each}

            {#if messages.length === 0}
              <div class="text-center py-8 text-navy text-opacity-60">
                <svg
                  class="w-12 h-12 mx-auto mb-4 text-navy text-opacity-30"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <p>No messages yet. Send us a message if you need help!</p>
              </div>
            {/if}
          </div>

          <div class="p-6 border-t border-navy border-opacity-10">
            <form onsubmit={sendMessage} class="flex space-x-3">
              <input
                type="text"
                bind:value={newMessage}
                placeholder="Type your message here..."
                class="flex-1 px-3 py-2 border border-navy border-opacity-20 rounded-md focus:outline-none focus:ring-2 focus:ring-olive focus:border-transparent"
                disabled={sendingMessage}
              />
              <button type="submit" disabled={sendingMessage || !newMessage.trim()} class="btn-primary px-6">
                {sendingMessage ? 'Sending...' : 'Send'}
              </button>
            </form>
          </div>
        </div>
      </div>
    {/if}

    <!-- Resources Modal -->
    {#if showResourcesModal}
      <div
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        role="dialog"
        aria-modal="true"
      >
        <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6 border-b border-navy border-opacity-10">
            <div class="flex justify-between items-center">
              <h2 class="text-xl font-serif font-medium text-navy">Helpful Resources</h2>
              <button onclick={() => (showResourcesModal = false)} class="text-navy text-opacity-60 hover:text-navy">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              {#each resources as resource}
                <div class="bg-cream bg-opacity-50 rounded-lg p-4 border border-navy border-opacity-10">
                  <h3 class="font-semibold text-navy mb-2">{resource.name}</h3>
                  <p class="text-sm text-navy text-opacity-70 mb-3">{resource.description}</p>
                  <div class="text-xs text-navy text-opacity-60 space-y-1">
                    <p><strong>Type:</strong> {resource.resource_type}</p>
                    <p><strong>Address:</strong> {resource.address}, {resource.city}, {resource.state}</p>
                    {#if resource.phone}
                      <p><strong>Phone:</strong> {resource.phone}</p>
                    {/if}
                    {#if resource.website}
                      <p>
                        <strong>Website:</strong>
                        <a
                          href={resource.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          class="text-olive hover:underline">{resource.website}</a
                        >
                      </p>
                    {/if}
                  </div>
                </div>
              {/each}

              {#if resources.length === 0}
                <div class="col-span-full text-center py-8 text-navy text-opacity-60">
                  <svg
                    class="w-12 h-12 mx-auto mb-4 text-navy text-opacity-30"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  <p>Loading resources...</p>
                </div>
              {/if}
            </div>

            <div class="mt-6 text-center">
              <a href="/resources/colorado" class="btn-primary"> View All Colorado Resources </a>
            </div>
          </div>
        </div>
      </div>
    {/if}
  </main>
</div>
