<script lang="ts">
  import { goto, invalidateAll } from '$app/navigation';
  import type { Application } from '$lib/types';
  export let data;
  let pendingApplications: Application[] = data.pendingApplications || [];
  let disbursementsReady: Application[] = data.disbursementsReady || [];
  let loading = false;
  let error: string | null = null;
  let lastRefreshed: string | null = null;

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString();
  }

  function viewApplication(id: string) {
    goto(`/staff/application/${id}`);
  }

  async function refreshQueue() {
    loading = true;
    error = null;
    try {
      await invalidateAll();
      lastRefreshed = new Date().toLocaleString();
    } catch (e: any) {
      error = e?.message || 'Failed to refresh';
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Application Queue - Staff Dashboard</title>
  <meta name="description" content="Review and manage beneficiary applications and disbursements." />
</svelte:head>

<div class="min-h-screen bg-cream text-navy">
  <header class="bg-navy text-cream shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-medium">Application Queue</h1>
          <p class="text-cream text-opacity-80">Human-in-the-Loop Command Center</p>
          {#if lastRefreshed}
            <p class="text-cream text-opacity-70 text-xs">Last refreshed: {lastRefreshed}</p>
          {/if}
        </div>
        <button on:click={refreshQueue} class="px-4 py-2 bg-olive text-cream rounded-md hover:bg-opacity-90 transition-colors">Refresh Queue</button>
      </div>
    </div>
  </header>

  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {#if loading}
      <div class="space-y-8" role="status" aria-live="polite">
        <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 overflow-hidden">
          <div class="px-6 py-4 bg-navy bg-opacity-5 border-b border-navy border-opacity-10">
            <div class="h-4 w-48 bg-navy bg-opacity-10"></div>
          </div>
          <div class="p-6 space-y-3">
            {#each Array(5) as _, i}
              <div class="h-4 w-full bg-navy bg-opacity-5"></div>
            {/each}
          </div>
        </div>
        <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 overflow-hidden">
          <div class="px-6 py-4 bg-navy bg-opacity-5 border-b border-navy border-opacity-10">
            <div class="h-4 w-56 bg-navy bg-opacity-10"></div>
          </div>
          <div class="p-6 space-y-3">
            {#each Array(5) as _, i}
              <div class="h-4 w-full bg-navy bg-opacity-5"></div>
            {/each}
          </div>
        </div>
      </div>
    {:else if error}
      <div class="bg-red-50 border border-red-200 rounded-lg p-6" role="alert" aria-live="assertive">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Error Loading Applications</h3>
            <div class="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
            <div class="mt-4">
              <button on:click={refreshQueue} class="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200">Try Again</button>
            </div>
          </div>
        </div>
      </div>
    {:else}
      <div class="space-y-8">
        <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 overflow-hidden">
          <div class="px-6 py-4 bg-navy bg-opacity-5 border-b border-navy border-opacity-10">
            <h2 class="text-xl font-medium text-navy">Pending Verification</h2>
            <p class="text-sm text-navy text-opacity-70 mt-1">Applications awaiting automated verification review</p>
          </div>

          {#if pendingApplications.length === 0}
            <div class="px-6 py-12 text-center">
              <svg class="mx-auto h-12 w-12 text-navy text-opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 class="mt-2 text-sm font-medium text-navy">No pending applications</h3>
              <p class="mt-1 text-sm text-navy text-opacity-60">All applications have been processed.</p>
            </div>
          {:else}
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-navy divide-opacity-10">
                <thead class="bg-navy bg-opacity-5">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-navy uppercase tracking-wider">Applicant</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-navy uppercase tracking-wider">Email</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-navy uppercase tracking-wider">Date Submitted</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-navy uppercase tracking-wider">Status</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-navy uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-navy divide-opacity-10">
                  {#each pendingApplications as application}
                    <tr class="hover:bg-navy hover:bg-opacity-5 transition-colors">
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm font-medium text-navy">Applicant #{application.id.slice(-8).toUpperCase()}</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-navy text-opacity-80">{(application.beneficiaries as any)?.email || 'N/A'}</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-navy text-opacity-80">{formatDate(application.created_at)}</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          {application.status}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          on:click={() => viewApplication(application.id)}
                          class="text-olive hover:text-navy transition-colors"
                        >
                          Review Application →
                        </button>
                      </td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
          {/if}
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 overflow-hidden">
          <div class="px-6 py-4 bg-navy bg-opacity-5 border-b border-navy border-opacity-10">
            <h2 class="text-xl font-medium text-navy">Ready for Disbursement</h2>
            <p class="text-sm text-navy text-opacity-70 mt-1">Approved applications ready for fund disbursement to partners</p>
          </div>

          {#if disbursementsReady.length === 0}
            <div class="px-6 py-12 text-center">
              <svg class="mx-auto h-12 w-12 text-navy text-opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              <h3 class="mt-2 text-sm font-medium text-navy">No disbursements ready</h3>
              <p class="mt-1 text-sm text-navy text-opacity-60">Approved applications will appear here when ready for payment.</p>
            </div>
          {:else}
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-navy divide-opacity-10">
                <thead class="bg-navy bg-opacity-5">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-navy uppercase tracking-wider">Applicant</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-navy uppercase tracking-wider">Facility</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-navy uppercase tracking-wider">Amount</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-navy uppercase tracking-wider">Approved Date</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-navy uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-navy divide-opacity-10">
                  {#each disbursementsReady as application}
                    <tr class="hover:bg-navy hover:bg-opacity-5 transition-colors">
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm font-medium text-navy">Applicant #{application.id.slice(-8)}</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-navy text-opacity-80">{(application.sober_living_partners as any)?.facility_name || 'N/A'}</div>
                        <div class="text-xs text-navy text-opacity-60">{(application.sober_living_partners as any)?.contact_email || 'N/A'}</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm font-medium text-navy">${application.amount_requested || 'TBD'}</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-navy text-opacity-80">{formatDate(application.created_at)}</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          on:click={() => viewApplication(application.id)}
                          class="text-olive hover:text-navy transition-colors"
                        >
                          Process Payment →
                        </button>
                      </td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
          {/if}
        </div>
      </div>
    {/if}
  </main>
</div>
  async function refreshQueue() {
    loading = true;
    error = null;
    try {
      await invalidateAll();
    } catch (e: any) {
      error = e?.message || 'Failed to refresh';
    } finally {
      loading = false;
    }
  }
