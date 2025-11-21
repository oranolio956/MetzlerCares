<script lang="ts">
  import { onMount } from 'svelte'
  import { goto } from '$app/navigation'

  export let data: any

  let pendingApplications = data.pendingApplications || []
  let disbursementsReady = data.disbursementsReady || []
  let slaBreaches = data.slaBreaches || 0

  function viewApplication(id: string) {
    goto(`/staff/application/${id}`)
  }

  onMount(() => {
    // Initialize any client-side functionality
  })
</script>

<svelte:head>
  <title>Staff Dashboard</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
  <div class="max-w-7xl mx-auto px-4 py-8">
    <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-2">Staff Dashboard</h1>
      <p class="text-gray-600">Review and manage applications</p>
    </div>

    {#if slaBreaches > 0}
      <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <p class="text-yellow-800">{slaBreaches} applications have exceeded the 48-hour review SLA.</p>
      </div>
    {/if}

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">Pending Applications</h2>
        {#if pendingApplications.length === 0}
          <p class="text-gray-500">No pending applications</p>
        {:else}
          <div class="space-y-3">
            {#each pendingApplications as application}
              <div class="border rounded-lg p-4">
                <div class="flex justify-between items-start">
                  <div>
                    <p class="font-medium">{application.beneficiaries?.full_name || 'N/A'}</p>
                    <p class="text-sm text-gray-600">{application.beneficiaries?.email || 'N/A'}</p>
                    <p class="text-xs text-gray-500">
                      Submitted: {new Date(application.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    on:click={() => viewApplication(application.id)}
                    class="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Review →
                  </button>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">Ready for Disbursement</h2>
        {#if disbursementsReady.length === 0}
          <p class="text-gray-500">No disbursements ready</p>
        {:else}
          <div class="space-y-3">
            {#each disbursementsReady as application}
              <div class="border rounded-lg p-4">
                <div class="flex justify-between items-start">
                  <div>
                    <p class="font-medium">{application.beneficiaries?.full_name || 'N/A'}</p>
                    <p class="text-sm text-gray-600">{application.sober_living_partners?.facility_name || 'N/A'}</p>
                    <p class="text-xs text-gray-500">Amount: ${application.amount_requested || 'TBD'}</p>
                  </div>
                  <button
                    on:click={() => viewApplication(application.id)}
                    class="text-green-600 hover:text-green-800 text-sm font-medium"
                  >
                    Process →
                  </button>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>
