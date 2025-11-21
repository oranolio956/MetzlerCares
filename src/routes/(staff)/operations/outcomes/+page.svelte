<script lang="ts">
  export let data
  let outcomes = data.outcomes || []
  let interval = ''
  let status = ''
  let metric = ''

  function applyFilters() {
    const params = new URLSearchParams()
    if (interval) params.set('interval', interval)
    if (status) params.set('status', status)
    if (metric) params.set('metric', metric)
    location.search = params.toString()
  }
</script>

<svelte:head>
  <title>Outcomes Log - Staff Operations</title>
  <meta name="description" content="Staff outcomes log" />
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="min-h-screen bg-warm-cream text-deep-navy-900">
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-2xl font-display font-medium mb-6">Outcomes Log</h1>

    <div class="card p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="form-label" for="interval">Interval</label>
          <select id="interval" bind:value={interval} class="form-input">
            <option value="">All</option>
            <option value="30">30</option>
            <option value="60">60</option>
            <option value="90">90</option>
          </select>
        </div>
        <div>
          <label class="form-label" for="status">Status</label>
          <select id="status" bind:value={status} class="form-input">
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div>
          <label class="form-label" for="metric">Metric</label>
          <select id="metric" bind:value={metric} class="form-input">
            <option value="">All</option>
            <option value="still_in_residence">Still in Residence</option>
            <option value="completed_program_successfully">Completed Program</option>
            <option value="discharged_non_compliant">Discharged (Non-compliant)</option>
            <option value="discharged_left_ama">Discharged (Left AMA)</option>
            <option value="lost_contact">Lost Contact</option>
          </select>
        </div>
        <div class="flex items-end">
          <button class="btn-secondary w-full" on:click={applyFilters}>Apply Filters</button>
        </div>
      </div>
    </div>

    <div class="card p-0 overflow-x-auto">
      <table class="min-w-full text-sm">
        <thead>
          <tr class="text-left bg-sage-50">
            <th class="px-3 py-2 text-deep-navy-800">ID</th>
            <th class="px-3 py-2 text-deep-navy-800">Interval</th>
            <th class="px-3 py-2 text-deep-navy-800">Status</th>
            <th class="px-3 py-2 text-deep-navy-800">Metric</th>
            <th class="px-3 py-2 text-deep-navy-800">Completed At</th>
            <th class="px-3 py-2 text-deep-navy-800">Updated At</th>
          </tr>
        </thead>
        <tbody>
          {#each outcomes as o}
            <tr class="border-t border-sage-200">
              <td class="px-3 py-2">{o.id}</td>
              <td class="px-3 py-2">{o.interval_days}</td>
              <td class="px-3 py-2">{o.status}</td>
              <td class="px-3 py-2">{o.outcome_metric}</td>
              <td class="px-3 py-2">{o.completed_at || '-'}</td>
              <td class="px-3 py-2">{o.updated_at}</td>
            </tr>
          {/each}
        </tbody>
      </table>

      <div class="mt-6">
        <a href="/staff/operations/outcomes.csv" class="btn-secondary">Export CSV</a>
      </div>
    </div>
  </main>
</div>
