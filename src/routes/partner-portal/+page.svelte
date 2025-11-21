<script lang="ts">
  import { onMount } from 'svelte'
  import { supabase } from '$lib/utils/supabase'
  import { goto } from '$app/navigation'

  interface Client {
    id: string
    first_name: string
    last_name: string
    status: 'active' | 'discharged' | 'transferred'
    discharge_date: string | null
    consent_status: 'pending' | 'signed' | 'expired' | 'revoked'
    consent_signed_at: string | null
    created_at: string
  }

  interface KanbanBoard {
    id: string
    client_id: string
    title: string
    status: 'active' | 'archived'
  }

  interface KanbanCard {
    id: string
    title: string
    status: 'todo' | 'in_progress' | 'submitted' | 'complete'
    category: string
    created_at: string
  }

  let clients: Client[] = []
  let loading = true
  let selectedClient: Client | null = null
  let clientBoard: KanbanBoard | null = null
  let clientCards: KanbanCard[] = []

  onMount(async () => {
    await loadClients()
    loading = false
  })

  async function loadClients() {
    const { data, error } = await supabase.from('clients').select('*').order('created_at', { ascending: false })

    if (error) {
      console.error('Error loading clients:', error)
      return
    }

    clients = data || []
  }

  async function selectClient(client: Client) {
    selectedClient = client

    // Load kanban board for this client
    const { data: boardData, error: boardError } = await supabase
      .from('kanban_boards')
      .select('*')
      .eq('client_id', client.id)
      .eq('status', 'active')
      .single()

    if (boardError) {
      console.error('Error loading board:', boardError)
      clientBoard = null
      clientCards = []
      return
    }

    clientBoard = boardData

    // Load cards for this board
    const { data: cardsData, error: cardsError } = await supabase
      .from('kanban_cards')
      .select('id, title, status, category, created_at')
      .eq('client_id', client.id)
      .order('created_at')

    if (cardsError) {
      console.error('Error loading cards:', cardsError)
      clientCards = []
      return
    }

    clientCards = cardsData || []
  }

  function getStatusColor(status: string): string {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-50'
      case 'discharged':
        return 'text-blue-600 bg-blue-50'
      case 'transferred':
        return 'text-orange-600 bg-orange-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  function getConsentStatusColor(status: string): string {
    switch (status) {
      case 'signed':
        return 'text-green-600 bg-green-50'
      case 'pending':
        return 'text-yellow-600 bg-yellow-50'
      case 'expired':
        return 'text-red-600 bg-red-50'
      case 'revoked':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  function getCardStatusColor(status: string): string {
    switch (status) {
      case 'complete':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'submitted':
        return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'in_progress':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  function getProgressPercentage(cards: KanbanCard[]): number {
    if (cards.length === 0) return 0
    const completedCards = cards.filter(card => card.status === 'complete').length
    return Math.round((completedCards / cards.length) * 100)
  }

  function formatDate(dateString: string | null): string {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString()
  }
</script>

<svelte:head>
  <title>Partner Portal - Client Tracking | Metzler Cares</title>
  <meta name="description" content="Secure partner portal for tracking client progress, outcomes, and scholarship applications." />
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="min-h-screen bg-gray-light">
  <!-- Header -->
  <header class="bg-white shadow-sm border-b">
    <div class="container mx-auto px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <h1 class="text-2xl font-bold text-primary">Partner Portal</h1>
          <span class="text-sm text-gray-medium">Read-only client tracking</span>
        </div>
        <button on:click={() => goto('/auth/login')} class="btn btn-outline"> Logout </button>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="container mx-auto px-6 py-8">
    <div class="grid lg:grid-cols-3 gap-8">
      <!-- Client List -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold text-primary">Your Clients</h2>
            <span class="text-sm text-gray-medium">{clients.length} total</span>
          </div>

          {#if loading}
            <div class="text-center py-8">
              <div class="text-gray-medium">Loading clients...</div>
            </div>
          {:else if clients.length === 0}
            <div class="text-center py-8">
              <div class="text-gray-medium mb-2">No clients found</div>
              <div class="text-sm text-gray-medium">Contact your Metzler Cares representative to add clients.</div>
            </div>
          {:else}
            <div class="space-y-3">
              {#each clients as client}
                <button
                  on:click={() => selectClient(client)}
                  class="w-full text-left p-4 rounded-xl border-2 transition-all duration-200 {selectedClient?.id ===
                  client.id
                    ? 'border-primary bg-primary bg-opacity-5'
                    : 'border-gray-100 hover:border-primary hover:bg-gray-50'}"
                >
                  <div class="flex items-center justify-between mb-2">
                    <div class="font-semibold text-gray-dark">
                      {client.first_name}
                      {client.last_name}
                    </div>
                    <span class="px-2 py-1 rounded-full text-xs font-medium {getStatusColor(client.status)}">
                      {client.status}
                    </span>
                  </div>
                  <div class="text-sm text-gray-medium">
                    Added {formatDate(client.created_at)}
                  </div>
                  {#if client.discharge_date}
                    <div class="text-sm text-gray-medium">
                      Discharge: {formatDate(client.discharge_date)}
                    </div>
                  {/if}
                </button>
              {/each}
            </div>
          {/if}
        </div>
      </div>

      <!-- Client Details -->
      <div class="lg:col-span-2">
        {#if !selectedClient}
          <div class="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div class="text-6xl mb-6">👥</div>
            <h3 class="text-xl font-bold text-primary mb-2">Select a Client</h3>
            <p class="text-gray-medium">Choose a client from the list to view their progress and details.</p>
          </div>
        {:else}
          <div class="space-y-6">
            <!-- Client Info Card -->
            <div class="bg-white rounded-2xl shadow-lg p-6">
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-xl font-bold text-primary">Client Information</h2>
                <div class="flex gap-2">
                  <span class="px-3 py-1 rounded-full text-sm font-medium {getStatusColor(selectedClient.status)}">
                    {selectedClient.status}
                  </span>
                  <span
                    class="px-3 py-1 rounded-full text-sm font-medium {getConsentStatusColor(
                      selectedClient.consent_status
                    )}"
                  >
                    Consent: {selectedClient.consent_status}
                  </span>
                </div>
              </div>

              <div class="grid md:grid-cols-2 gap-6">
                <div>
                  <label for="client-name" class="block text-sm font-medium text-gray-medium mb-1">Name</label>
                  <div id="client-name" class="text-lg font-semibold text-gray-dark">
                    {selectedClient.first_name}
                    {selectedClient.last_name}
                  </div>
                </div>
                <div>
                  <label for="date-added" class="block text-sm font-medium text-gray-medium mb-1">Date Added</label>
                  <div id="date-added" class="text-gray-dark">{formatDate(selectedClient.created_at)}</div>
                </div>
                <div>
                  <label for="discharge-date" class="block text-sm font-medium text-gray-medium mb-1"
                    >Discharge Date</label
                  >
                  <div id="discharge-date" class="text-gray-dark">
                    {formatDate(selectedClient.discharge_date) || 'Not set'}
                  </div>
                </div>
                <div>
                  <label for="consent-signed" class="block text-sm font-medium text-gray-medium mb-1"
                    >Consent Signed</label
                  >
                  <div id="consent-signed" class="text-gray-dark">
                    {formatDate(selectedClient.consent_signed_at) || 'Not signed'}
                  </div>
                </div>
              </div>
            </div>

            <!-- Progress Overview -->
            {#if clientBoard && clientCards.length > 0}
              <div class="bg-white rounded-2xl shadow-lg p-6">
                <div class="flex items-center justify-between mb-6">
                  <h2 class="text-xl font-bold text-primary">Progress Overview</h2>
                  <div class="text-2xl font-bold text-secondary">
                    {getProgressPercentage(clientCards)}%
                  </div>
                </div>

                <!-- Progress Bar -->
                <div class="mb-6">
                  <div class="w-full bg-gray-200 rounded-full h-3">
                    <div
                      class="bg-secondary h-3 rounded-full transition-all duration-500"
                      style="width: {getProgressPercentage(clientCards)}%"
                    />
                  </div>
                </div>

                <!-- Task Status Breakdown -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div class="text-center p-4 rounded-xl bg-gray-50 border-2 border-gray-200">
                    <div class="text-2xl font-bold text-gray-600">
                      {clientCards.filter(c => c.status === 'todo').length}
                    </div>
                    <div class="text-sm text-gray-medium">To Do</div>
                  </div>
                  <div class="text-center p-4 rounded-xl bg-yellow-50 border-2 border-yellow-200">
                    <div class="text-2xl font-bold text-yellow-600">
                      {clientCards.filter(c => c.status === 'in_progress').length}
                    </div>
                    <div class="text-sm text-gray-medium">In Progress</div>
                  </div>
                  <div class="text-center p-4 rounded-xl bg-blue-50 border-2 border-blue-200">
                    <div class="text-2xl font-bold text-blue-600">
                      {clientCards.filter(c => c.status === 'submitted').length}
                    </div>
                    <div class="text-sm text-gray-medium">Submitted</div>
                  </div>
                  <div class="text-center p-4 rounded-xl bg-green-50 border-2 border-green-200">
                    <div class="text-2xl font-bold text-green-600">
                      {clientCards.filter(c => c.status === 'complete').length}
                    </div>
                    <div class="text-sm text-gray-medium">Complete</div>
                  </div>
                </div>
              </div>

              <!-- Task Details -->
              <div class="bg-white rounded-2xl shadow-lg p-6">
                <h2 class="text-xl font-bold text-primary mb-6">Task Details</h2>

                <div class="space-y-3">
                  {#each clientCards as card}
                    <div
                      class="flex items-center justify-between p-4 rounded-xl border-2 {getCardStatusColor(
                        card.status
                      )}"
                    >
                      <div class="flex items-center gap-3">
                        <div class="text-lg">
                          {#if card.category === 'id'}🆔{/if}
                          {#if card.category === 'snap'}🍎{/if}
                          {#if card.category === 'housing'}🏠{/if}
                          {#if card.category === 'workforce'}💼{/if}
                          {#if card.category === 'fresh_start'}🎁{/if}
                          {#if card.category === 'other'}📋{/if}
                        </div>
                        <div>
                          <div class="font-semibold text-gray-dark">{card.title}</div>
                          <div class="text-sm text-gray-medium">Created {formatDate(card.created_at)}</div>
                        </div>
                      </div>
                      <div class="text-right">
                        <div class="text-sm font-medium capitalize">{card.status.replace('_', ' ')}</div>
                      </div>
                    </div>
                  {/each}
                </div>
              </div>
            {:else if clientBoard}
              <div class="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div class="text-6xl mb-6">📋</div>
                <h3 class="text-xl font-bold text-primary mb-2">No Tasks Yet</h3>
                <p class="text-gray-medium">Tasks will appear here as your PSS team creates them.</p>
              </div>
            {:else}
              <div class="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div class="text-6xl mb-6">🎯</div>
                <h3 class="text-xl font-bold text-primary mb-2">Board Not Ready</h3>
                <p class="text-gray-medium">The kanban board for this client is being set up.</p>
              </div>
            {/if}
          </div>
        {/if}
      </div>
    </div>
  </main>
</div>

<style>
  /* Custom scrollbar for client list */
  .bg-white.rounded-2xl.shadow-lg {
    max-height: calc(100vh - 12rem);
    overflow-y: auto;
  }

  /* Smooth transitions */
  .transition-all {
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* Progress bar animation */
  .transition-all.duration-500 {
    transition-duration: 500ms;
  }

  /* Responsive adjustments */
  @media (max-width: 1024px) {
    .grid.lg\:grid-cols-3 {
      grid-template-columns: 1fr;
    }
  }
</style>
