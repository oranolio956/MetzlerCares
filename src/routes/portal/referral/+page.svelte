<script lang="ts">
  import { onMount } from 'svelte'
  import { fade } from 'svelte/transition'

  const referrals = [
    { id: 'REF-2024-001', patient: 'Michael D.', status: 'Active', stage: 'Peer Matched', lastUpdate: '2 hours ago' },
    { id: 'REF-2024-002', patient: 'Sarah J.', status: 'Pending', stage: 'Intake Review', lastUpdate: '1 day ago' },
    {
      id: 'REF-2024-003',
      patient: 'David W.',
      status: 'Active',
      stage: 'Housing Placement',
      lastUpdate: '3 hours ago'
    },
    { id: 'REF-2024-004', patient: 'Emily R.', status: 'Completed', stage: 'Alumni Network', lastUpdate: '1 week ago' },
    { id: 'REF-2024-005', patient: 'James T.', status: 'Active', stage: 'Job Search', lastUpdate: '5 hours ago' }
  ]

  let visible = false
  onMount(() => {
    visible = true
  })
</script>

<svelte:head>
  <title>Referral Portal | Metzler Cares</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 font-sans text-gray-900">
  <!-- Top Navigation -->
  <nav class="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
    <div class="flex items-center gap-4">
      <div class="text-2xl font-bold text-tech-primary">Metzler<span class="text-tech-accent">Connect</span></div>
      <div class="h-6 w-px bg-gray-300" />
      <div class="text-sm font-medium text-gray-500">Partner Portal</div>
    </div>
    <div class="flex items-center gap-4">
      <button class="p-2 text-gray-400 hover:text-gray-600">
        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          /></svg
        >
      </button>
      <div class="h-8 w-8 rounded-full bg-tech-primary text-white flex items-center justify-center font-bold text-sm">
        DH
      </div>
    </div>
  </nav>

  <div class="flex">
    <!-- Sidebar -->
    <aside class="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-65px)] hidden md:block">
      <div class="p-4 space-y-1">
        <button
          type="button"
          class="flex w-full items-center gap-3 px-4 py-3 bg-tech-accent/10 text-tech-accent rounded-lg font-medium hover:bg-tech-accent/20 focus:outline-none focus:ring-2 focus:ring-tech-accent focus:ring-offset-2"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"
            ><path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 10h16M4 14h16M4 18h16"
            /></svg
          >
          Dashboard
        </button>
        <button
          type="button"
          class="flex w-full items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-tech-accent focus:ring-offset-2"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"
            ><path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            /></svg
          >
          Patients
        </button>
        <button
          type="button"
          class="flex w-full items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-tech-accent focus:ring-offset-2"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"
            ><path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            /></svg
          >
          Reports
        </button>
        <button
          type="button"
          class="flex w-full items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-tech-accent focus:ring-offset-2"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"
            ><path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            /><path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            /></svg
          >
          Settings
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 p-8">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Referral Dashboard</h1>
          <p class="text-gray-500">Denver Health Medical Center</p>
        </div>
        <button
          class="px-4 py-2 bg-tech-accent text-white rounded-lg font-medium hover:bg-blue-600 transition-colors shadow-sm flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"
            ><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg
          >
          New Referral
        </button>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div class="text-gray-500 text-sm font-medium mb-1">Active Referrals</div>
          <div class="text-3xl font-bold text-gray-900">24</div>
          <div class="text-green-500 text-xs font-medium mt-2 flex items-center">
            <svg class="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"
              ><path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              /></svg
            >
            +12% from last month
          </div>
        </div>
        <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div class="text-gray-500 text-sm font-medium mb-1">Pending Intake</div>
          <div class="text-3xl font-bold text-gray-900">5</div>
          <div class="text-yellow-500 text-xs font-medium mt-2">Requires attention</div>
        </div>
        <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div class="text-gray-500 text-sm font-medium mb-1">Placement Rate</div>
          <div class="text-3xl font-bold text-gray-900">92%</div>
          <div class="text-green-500 text-xs font-medium mt-2">Above target</div>
        </div>
        <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div class="text-gray-500 text-sm font-medium mb-1">Avg. Response Time</div>
          <div class="text-3xl font-bold text-gray-900">45m</div>
          <div class="text-gray-400 text-xs font-medium mt-2">Target: &lt; 60m</div>
        </div>
      </div>

      <!-- Recent Activity Table -->
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h3 class="font-bold text-gray-700">Recent Referrals</h3>
          <button class="text-sm text-tech-accent font-medium hover:underline">View All</button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead class="bg-gray-50 text-gray-500 uppercase tracking-wider font-medium">
              <tr>
                <th class="px-6 py-3">ID</th>
                <th class="px-6 py-3">Patient</th>
                <th class="px-6 py-3">Status</th>
                <th class="px-6 py-3">Current Stage</th>
                <th class="px-6 py-3">Last Update</th>
                <th class="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              {#each referrals as referral}
                <tr class="hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4 font-medium text-gray-900">{referral.id}</td>
                  <td class="px-6 py-4 text-gray-700">{referral.patient}</td>
                  <td class="px-6 py-4">
                    <span
                      class={`px-2 py-1 rounded-full text-xs font-medium ${
                        referral.status === 'Active'
                          ? 'bg-green-100 text-green-700'
                          : referral.status === 'Pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {referral.status}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-gray-600">{referral.stage}</td>
                  <td class="px-6 py-4 text-gray-500">{referral.lastUpdate}</td>
                  <td class="px-6 py-4">
                    <button class="text-tech-accent hover:text-blue-700 font-medium">View Details</button>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </div>
</div>
