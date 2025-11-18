<script lang="ts">
  import { page } from '$app/stores'
  import { onMount } from 'svelte'
  import { supabase } from '$lib/utils/supabase'
  import { goto } from '$app/navigation'
  import type { Application, Beneficiary, Consent, FormError } from '$lib/types'

  // data is used in the template

  let application: Application | null = null
  let beneficiary: Beneficiary | null = null
  let consents: Consent[] = []
  let loading = true
  let error: FormError | null = null
  let disbursing = false
  let manualReviewMode = false
  let uploadedFiles: any[] = []
  let uploading = false

  onMount(async () => {
    await loadApplicationDetails()
  })

  async function loadApplicationDetails() {
    try {
      loading = true
      error = null

      const applicationId = $page.params.id

      // Load application with related data
      const { data: appData, error: appError } = await supabase
        .from('applications')
        .select(
          `
          *,
          beneficiaries (
            id,
            full_name,
            email,
            created_at
          ),
          sober_living_partners (
            id,
            facility_name,
            contact_person,
            contact_email,
            address_street,
            address_city,
            address_state
          )
        `
        )
        .eq('id', applicationId)
        .single()

      if (appError) {
        console.error('Error loading application:', appError)
        error = { message: 'Failed to load application details' }
        return
      }

      application = appData
      beneficiary = appData.beneficiaries

      // Load consents for this beneficiary
      const { data: consentData, error: consentError } = await supabase
        .from('consents')
        .select('*')
        .eq('beneficiary_id', beneficiary?.id)
        .order('granted_at', { ascending: false })

      if (consentError) {
        console.error('Error loading consents:', consentError)
      } else {
        consents = consentData || []
      }

      // Check if manual review is needed
      manualReviewMode = application?.verification_status === 'failed'
    } catch (err) {
      console.error('Unexpected error:', err)
      error = { message: 'An unexpected error occurred' }
    } finally {
      loading = false
    }
  }

  async function disburseFunds() {
    if (!application) return

    try {
      disbursing = true

      // Call the Stripe disbursement Edge Function
      const { data, error } = await supabase.functions.invoke('disburse-scholarship', {
        body: {
          application_id: application.id,
          amount: application.amount_requested
        }
      })

      if (error) {
        console.error('Disbursement failed:', error)
        alert(`Payment failed: ${error.message || 'Unknown error'}`)
        return
      }

      if (data?.success) {
        // Reload the page to show updated status
        await loadApplicationDetails()
        alert(`Payment processed successfully! Transfer ID: ${data.transfer_id}`)
      } else {
        alert('Payment processing failed. Please check the application status.')
      }
    } catch (err) {
      console.error('Error processing payment:', err)
      alert('An error occurred while processing the payment. Please try again.')
    } finally {
      disbursing = false
    }
  }

  async function handleFileUpload(event: Event) {
    const target = event.target as HTMLInputElement
    const files = target.files

    if (!files || files.length === 0) return

    try {
      uploading = true

      for (const file of Array.from(files)) {
        // Create secure file path for HIPAA compliance
        const fileExt = file.name.split('.').pop()
        if (!application) return
        const fileName = `verification-${application.id}-${Date.now()}.${fileExt}`
        const filePath = `manual-verifications/${application.id}/${fileName}`

        // Upload to Supabase Storage (staff-only bucket)
        const { data, error } = await supabase.storage
          .from('private-verifications') // Secure bucket for staff only
          .upload(filePath, file)

        if (error) {
          console.error('File upload error:', error)
          alert(`Failed to upload ${file.name}: ${error.message}`)
        } else {
          uploadedFiles = [
            ...uploadedFiles,
            {
              name: file.name,
              path: filePath,
              uploadedAt: new Date().toISOString(),
              type: 'file' as const
            }
          ]
        }
      }

      alert('Files uploaded successfully')
    } catch (err) {
      console.error('Upload error:', err)
      alert('An error occurred during file upload')
    } finally {
      uploading = false
    }
  }

  async function manuallyApprove() {
    if (!application || uploadedFiles.length === 0) {
      alert('Please upload verification documents before approving')
      return
    }

    try {
      const { error } = await supabase
        .from('applications')
        .update({
          status: 'approved',
          verification_status: 'manual_override',
          manual_review_notes: `Approved with ${uploadedFiles.length} verification documents`,
          reviewed_by: 'staff-user', // In production, get from auth context
          reviewed_at: new Date().toISOString()
        })
        .eq('id', application?.id)

      if (error) {
        console.error('Manual approval error:', error)
        alert('Failed to approve application')
      } else {
        await loadApplicationDetails()
        alert('Application manually approved')
      }
    } catch (err) {
      console.error('Approval error:', err)
      alert('An error occurred during approval')
    }
  }

  async function denyApplication() {
    try {
      const { error } = await supabase
        .from('applications')
        .update({
          status: 'denied',
          verification_status: 'manual_deny',
          manual_review_notes: 'Application denied during manual review',
          reviewed_by: 'staff-user',
          reviewed_at: new Date().toISOString()
        })
        .eq('id', application?.id)

      if (error) {
        console.error('Denial error:', error)
        alert('Failed to deny application')
      } else {
        await loadApplicationDetails()
        alert('Application denied')
      }
    } catch (err) {
      console.error('Denial error:', err)
      alert('An error occurred during denial')
    }
  }

  function getConsentStatusColor(status: string) {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'revoked':
        return 'bg-red-100 text-red-800'
      case 'expired':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString()
  }
</script>

<svelte:head>
  <title>Application Review - Staff Dashboard</title>
  <meta name="description" content="Review beneficiary application details and process approvals." />
</svelte:head>

<div class="min-h-screen bg-cream text-navy">
  <!-- Header -->
  <header class="bg-navy text-cream shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div class="flex justify-between items-center">
        <div class="flex items-center space-x-4">
          <button
            on:click={() => goto('/staff/dashboard')}
            class="flex items-center space-x-2 hover:text-olive transition-colors"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Queue</span>
          </button>
          <div>
            <h1 class="text-xl font-medium">Application Review</h1>
            <p class="text-cream text-opacity-80 text-sm">Application #{application?.id?.slice(-8)}</p>
          </div>
        </div>
        <button
          on:click={loadApplicationDetails}
          class="px-4 py-2 bg-olive text-cream rounded-md hover:bg-opacity-90 transition-colors"
        >
          Refresh
        </button>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {#if loading}
      <div class="flex justify-center items-center py-16">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-navy"></div>
        <span class="ml-3 text-navy">Loading application details...</span>
      </div>
    {:else if error}
      <div class="bg-red-50 border border-red-200 rounded-lg p-6">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Error Loading Application</h3>
            <div class="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    {:else if application}
      <!-- Application Details -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Beneficiary Details -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-6">
            <h2 class="text-xl font-medium text-navy mb-6">Beneficiary Details</h2>

            <div class="space-y-4">
              <div>
                <div class="block text-sm font-medium text-navy text-opacity-70 mb-1">Full Name</div>
                <p class="text-navy">{beneficiary?.full_name}</p>
              </div>

              <div>
                <div class="block text-sm font-medium text-navy text-opacity-70 mb-1">Email</div>
                <p class="text-navy">{beneficiary?.email}</p>
              </div>

              <div>
                <div class="block text-sm font-medium text-navy text-opacity-70 mb-1">Member Since</div>
                <p class="text-navy">{beneficiary?.created_at ? formatDate(beneficiary.created_at) : 'N/A'}</p>
              </div>

              <div>
                <div class="block text-sm font-medium text-navy text-opacity-70 mb-1">Application Status</div>
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
                  {application.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Legal & Consent -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-6">
            <h2 class="text-xl font-medium text-navy mb-6">Legal & Consent</h2>

            {#if consents.length > 0}
              <div class="space-y-4">
                {#each consents as consent}
                  <div class="border border-navy border-opacity-10 rounded-md p-4">
                    <div class="flex items-center justify-between mb-2">
                      <h3 class="text-sm font-medium text-navy">
                        {(consent.consent_type || 'unknown').replace(/_/g, ' ')}
                      </h3>
                      <span
                        class={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getConsentStatusColor(consent.status || 'unknown')}`}
                      >
                        {consent.status || 'unknown'}
                      </span>
                    </div>
                    <p class="text-sm text-navy text-opacity-70 mb-2">{consent.purpose}</p>
                    <div class="text-xs text-navy text-opacity-60">
                      Granted: {consent.granted_at ? formatDate(consent.granted_at) : 'N/A'}
                    </div>
                  </div>
                {/each}
              </div>
            {:else}
              <p class="text-navy text-opacity-60 text-sm">No consents found</p>
            {/if}
          </div>
        </div>

        <!-- Verification & Action -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-6">
            <h2 class="text-xl font-medium text-navy mb-6">Verification & Action</h2>

            <div class="space-y-4">
              <!-- Verification Status -->
              <div>
                <div class="block text-sm font-medium text-navy text-opacity-70 mb-1">Verification Status</div>
                <div class="flex items-center space-x-2">
                  <span
                    class={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      application.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : application.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {application.status}
                  </span>
                  {#if application.status === 'approved'}
                    <span class="text-xs text-green-600">✓ Ready for disbursement</span>
                  {/if}
                </div>
              </div>

              <!-- Partner Information -->
              {#if application.sober_living_partners}
                <div>
                  <div class="block text-sm font-medium text-navy text-opacity-70 mb-1">Assigned Facility</div>
                  <div class="text-sm text-navy">
                    <p class="font-medium">{application?.sober_living_partners?.[0]?.facility_name}</p>
                    <p class="text-opacity-70">{application?.sober_living_partners?.[0]?.contact_email}</p>
                    {#if application.sober_living_partners?.[0]?.address_city}
                      <p class="text-opacity-70 text-xs">
                        {application.sober_living_partners[0].address_city}, {application.sober_living_partners[0]
                          .address_state}
                      </p>
                    {/if}
                  </div>
                </div>
              {/if}

              <!-- Manual Review Component -->
              {#if manualReviewMode}
                <div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h3 class="text-lg font-medium text-red-800 mb-3">Manual Review Required</h3>

                  <div class="text-sm text-red-700 mb-4">
                    <p class="mb-2">
                      The automated verification check failed. The applicant's data could not be matched with federal or
                      state databases. Manual verification is required before funds can be disbursed.
                    </p>
                    <p>
                      To proceed, please contact the applicant or their referring case manager. Ask them to provide one
                      of the following documents, which you can upload below:
                    </p>
                    <ul class="list-disc list-inside mt-2 space-y-1">
                      <li>Referral letter from a state-licensed treatment facility</li>
                      <li>Copy of Medicaid, SNAP, or SSI eligibility letter</li>
                    </ul>
                  </div>

                  <!-- File Upload -->
                  <div class="mb-4">
                    <label for="verification-files" class="block text-sm font-medium text-red-700 mb-2">
                      Upload Verification Documents
                    </label>
                    <input
                      type="file"
                      id="verification-files"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      on:change={handleFileUpload}
                      disabled={uploading}
                      class="block w-full text-sm text-red-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-red-100 file:text-red-700 hover:file:bg-red-200 disabled:opacity-50"
                    />
                    {#if uploading}
                      <p class="text-sm text-red-600 mt-1">Uploading files...</p>
                    {/if}
                  </div>

                  <!-- Uploaded Files List -->
                  {#if uploadedFiles.length > 0}
                    <div class="mb-4">
                      <h4 class="text-sm font-medium text-red-700 mb-2">Uploaded Files:</h4>
                      <ul class="space-y-1">
                        {#each uploadedFiles as file}
                          <li class="text-sm text-red-600 flex items-center">
                            <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            {file.name}
                          </li>
                        {/each}
                      </ul>
                    </div>
                  {/if}

                  <!-- Action Buttons -->
                  <div class="flex space-x-3">
                    <button
                      on:click={manuallyApprove}
                      disabled={uploadedFiles.length === 0}
                      class="px-4 py-2 bg-olive text-cream text-sm font-medium rounded-md hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Manually Approve Application
                    </button>
                    <button
                      on:click={denyApplication}
                      class="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700"
                    >
                      Deny Application
                    </button>
                  </div>
                </div>
              {/if}

              <!-- Action Buttons -->
              <div class="pt-4 border-t border-navy border-opacity-10">
                {#if application.status === 'approved' && !manualReviewMode}
                  <button
                    on:click={disburseFunds}
                    disabled={disbursing}
                    class="w-full bg-olive text-cream py-3 px-4 rounded-md font-medium hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {#if disbursing}
                      <svg
                        class="animate-spin -ml-1 mr-3 h-4 w-4 text-cream inline"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
                        ></circle>
                        <path
                          class="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing Payment...
                    {:else}
                      Disburse Funds
                    {/if}
                  </button>

                  {#if application.amount_requested}
                    <p class="text-center text-sm text-navy text-opacity-60 mt-2">
                      Amount: ${application.amount_requested}
                    </p>
                  {/if}
                {:else if application.status === 'pending'}
                  <div class="text-center">
                    <div class="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
                      <h3 class="text-sm font-medium text-yellow-800 mb-2">Awaiting Verification</h3>
                      <p class="text-sm text-yellow-700">
                        This application is still being processed by our automated verification system.
                      </p>
                    </div>
                    <button
                      on:click={loadApplicationDetails}
                      class="text-olive hover:text-navy text-sm font-medium transition-colors"
                    >
                      Check Status
                    </button>
                  </div>
                {:else if application.status === 'funded'}
                  <div class="text-center">
                    <div class="bg-green-50 border border-green-200 rounded-md p-4">
                      <svg
                        class="mx-auto h-8 w-8 text-green-400 mb-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <h3 class="text-sm font-medium text-green-800 mb-2">Payment Completed</h3>
                      <p class="text-sm text-green-700">
                        Funds disbursed to {application?.sober_living_partners?.[0]?.facility_name}
                      </p>
                      {#if application.payment_date}
                        <p class="text-xs text-green-600 mt-2">
                          {formatDate(application.payment_date)}
                        </p>
                      {/if}
                    </div>
                  </div>
                {:else}
                  <div class="text-center">
                    <span class="inline-flex px-3 py-2 text-sm font-semibold rounded-full bg-gray-100 text-gray-800">
                      {application.status}
                    </span>
                  </div>
                {/if}
              </div>
            </div>
          </div>
        </div>
      </div>
    {:else}
      <div class="text-center py-16">
        <p class="text-navy text-opacity-60">Application not found</p>
      </div>
    {/if}
  </main>
</div>
