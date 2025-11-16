<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/utils/supabase';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  interface KanbanCard {
    id: string;
    title: string;
    description: string;
    category: 'id' | 'snap' | 'housing' | 'workforce' | 'fresh_start' | 'other';
    status: 'todo' | 'in_progress' | 'submitted' | 'complete';
    position: number;
    assigned_to: string | null;
    time_logged: number;
    due_date: string | null;
    metadata: any;
    created_at: string;
  }

  interface KanbanColumn {
    id: string;
    title: string;
    position: number;
    color: string;
    cards: KanbanCard[];
  }

  interface Client {
    id: string;
    first_name: string;
    last_name: string;
    status: string;
    discharge_date: string | null;
  }

  let columns: KanbanColumn[] = [];
  let client: Client | null = null;
  let loading = true;
  let draggedCard: KanbanCard | null = null;
  let draggedFromColumn: string | null = null;
  let showTimeModal = false;
  let timeLoggingCard: KanbanCard | null = null;
  let timeMinutes = 15;
  let timeNotes = '';

  const clientId = $page.params.id;
  const categoryIcons = {
    id: '🆔',
    snap: '🍎',
    housing: '🏠',
    workforce: '💼',
    fresh_start: '🎁',
    other: '📋'
  };

  const categoryColors = {
    id: 'border-l-blue-500',
    snap: 'border-l-green-500',
    housing: 'border-l-purple-500',
    workforce: 'border-l-orange-500',
    fresh_start: 'border-l-pink-500',
    other: 'border-l-gray-500'
  };

  onMount(async () => {
    await loadClientData();
    await loadKanbanData();
    loading = false;
  });

  async function loadClientData() {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', clientId)
      .single();

    if (error) {
      console.error('Error loading client:', error);
      return;
    }

    client = data;
  }

  async function getCurrentUserTenantId() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    
    const { data: tenantUser } = await supabase
      .from('tenant_users')
      .select('tenant_id')
      .eq('user_id', user.id)
      .single();
    
    return tenantUser?.tenant_id || null;
  }

  async function loadKanbanData() {
    // Get current user's tenant ID for filtering
    const tenantId = await getCurrentUserTenantId();
    if (!tenantId) {
      console.error('No tenant ID found for current user');
      return;
    }
    
    // Load columns for this tenant
    const { data: columnsData, error: columnsError } = await supabase
      .from('kanban_columns')
      .select('*')
      .order('position');

    if (columnsError) {
      console.error('Error loading columns:', columnsError);
      return;
    }

    // Load cards for this client and tenant
    const { data: cardsData, error: cardsError } = await supabase
      .from('kanban_cards')
      .select('*')
      .eq('client_id', clientId)
      .order('position');

    if (cardsError) {
      console.error('Error loading cards:', cardsError);
      return;
    }

    // Organize cards by column
    columns = columnsData.map(column => ({
      ...column,
      cards: cardsData.filter(card => card.column_id === column.id)
    }));
  }

  function handleDragStart(event: DragEvent, card: KanbanCard, columnId: string) {
    draggedCard = card;
    draggedFromColumn = columnId;
    event.dataTransfer!.effectAllowed = 'move';
  }

  function handleDragOver(event: DragEvent) {
    event.preventDefault();
    event.dataTransfer!.dropEffect = 'move';
  }

  async function handleDrop(event: DragEvent, targetColumnId: string) {
    event.preventDefault();
    
    if (!draggedCard || draggedFromColumn === targetColumnId) {
      draggedCard = null;
      draggedFromColumn = null;
      return;
    }

    // Update card status and column
    const newStatus = getStatusFromColumn(targetColumnId);
    
    const { error } = await supabase
      .from('kanban_cards')
      .update({ 
        column_id: targetColumnId,
        status: newStatus
      })
      .eq('id', draggedCard.id);

    if (error) {
      console.error('Error updating card:', error);
      return;
    }

    // If moving to complete, show time logging modal
    if (newStatus === 'complete') {
      timeLoggingCard = draggedCard;
      showTimeModal = true;
    }

    // Reload data
    await loadKanbanData();
    
    draggedCard = null;
    draggedFromColumn = null;
  }

  function getStatusFromColumn(columnId: string): string {
    const column = columns.find(c => c.id === columnId);
    if (!column) return 'todo';
    
    switch (column.title.toLowerCase()) {
      case 'to do': return 'todo';
      case 'in progress': return 'in_progress';
      case 'submitted': return 'submitted';
      case 'complete': return 'complete';
      default: return 'todo';
    }
  }

  async function logTime() {
    if (!timeLoggingCard) return;

    const { error } = await supabase
      .from('time_tracking')
      .insert({
        client_id: clientId,
        card_id: timeLoggingCard.id,
        minutes: timeMinutes,
        notes: timeNotes,
        billable: true,
        service_code: 'H0038'
      });

    if (error) {
      console.error('Error logging time:', error);
      return;
    }

    // Update card time logged
    await supabase
      .from('kanban_cards')
      .update({ time_logged: timeLoggingCard.time_logged + timeMinutes })
      .eq('id', timeLoggingCard.id);

    showTimeModal = false;
    timeLoggingCard = null;
    timeMinutes = 15;
    timeNotes = '';
  }

  function formatTime(minutes: number): string {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  }
</script>

<svelte:head>
  <title>PSS Dashboard - Kanban Board | Metzler Cares</title>
</svelte:head>

<div class="min-h-screen bg-gray-light">
  <!-- Header -->
  <header class="bg-white shadow-sm border-b">
    <div class="container mx-auto px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <h1 class="text-2xl font-bold text-primary">PSS Dashboard</h1>
          {#if client}
            <div class="text-gray-medium">
              Client: <span class="font-semibold text-gray-dark">{client.first_name} {client.last_name}</span>
            </div>
          {/if}
        </div>
        <button 
          on:click={() => goto('/staff/dashboard')}
          class="btn btn-outline"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="container mx-auto px-6 py-8">
    {#if loading}
      <div class="flex items-center justify-center h-64">
        <div class="text-gray-medium">Loading kanban board...</div>
      </div>
    {:else if columns.length === 0}
      <div class="text-center py-12">
        <div class="text-gray-medium mb-4">No kanban board found for this client.</div>
        <button 
          on:click={async () => {
            // Get current user's tenant ID
            const tenantId = await getCurrentUserTenantId();
            if (!tenantId) {
              console.error('No tenant ID found for current user');
              return;
            }
            
            // Create default board
            const { data: boardData, error: boardError } = await supabase
              .from('kanban_boards')
              .insert({
                tenant_id: tenantId,
                client_id: clientId,
                title: 'Life Stabilization Checklist',
                description: 'Client stabilization tasks',
                status: 'active'
              })
              .select()
              .single();
            
            if (!boardError && boardData) {
              // Create default columns
              const defaultColumns = [
                { title: 'To Do', position: 1, color: '#ef4444', board_id: boardData.id },
                { title: 'In Progress', position: 2, color: '#3b82f6', board_id: boardData.id },
                { title: 'Submitted', position: 3, color: '#f59e0b', board_id: boardData.id },
                { title: 'Complete', position: 4, color: '#00c853', board_id: boardData.id }
              ];
              
              const { data: columnsData } = await supabase
                .from('kanban_columns')
                .insert(defaultColumns)
                .select();
              
              if (columnsData && columnsData.length > 0) {
                // Get the first column (To Do) for default cards
                const todoColumn = columnsData.find(col => col.title === 'To Do');
                
                if (todoColumn) {
                  // Create default cards
                  const defaultCards = [
                    { title: 'Secure State ID', category: 'id' },
                    { title: 'Apply for SNAP Benefits', category: 'snap' },
                    { title: 'Secure Sober Living Bed', category: 'housing' },
                    { title: 'Register with Workforce Center', category: 'workforce' },
                    { title: 'Order Fresh Start Kit', category: 'fresh_start' }
                  ];
                  
                  for (const card of defaultCards) {
                    await supabase.from('kanban_cards').insert({
                      ...card,
                      tenant_id: tenantId,
                      client_id: clientId,
                      column_id: todoColumn.id,
                      status: 'todo',
                      position: 1
                    });
                  }
                }
              }
              
              await loadKanbanData();
            }
          }}
          class="btn btn-primary"
        >
          Create Board
        </button>
      </div>
    {:else}
      <!-- Kanban Board -->
      <div class="bg-white rounded-2xl shadow-xl p-6">
        <h2 class="text-2xl font-bold text-primary mb-6">Life Stabilization Checklist</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          {#each columns as column}
            <div 
              class="bg-gray-50 rounded-xl p-4 min-h-96 powerhouse-card"
              on:dragover={handleDragOver}
              on:drop={(e) => handleDrop(e, column.id)}
              role="region"
              aria-label="{column.title} column"
            >
              <!-- Column Header -->
              <div class="flex items-center justify-between mb-4">
                <h3 class="font-semibold text-gray-dark">{column.title}</h3>
                <span class="text-sm text-gray-medium bg-white px-2 py-1 rounded-full">
                  {column.cards.length}
                </span>
              </div>
              
              <!-- Cards -->
              <div class="space-y-3">
                {#each column.cards as card}
                  <div
                    draggable="true"
                    on:dragstart={(e) => handleDragStart(e, card, column.id)}
                    class="bg-white rounded-lg p-4 shadow-sm border-l-4 {categoryColors[card.category]} cursor-move hover:shadow-md transition-all duration-200 group kanban-card"
                    role="button"
                    aria-label="Drag {card.title} to move"
                    tabindex="0"
                  >
                    <!-- Card Header -->
                    <div class="flex items-center justify-between mb-2">
                      <div class="flex items-center gap-2">
                        <span class="text-lg">{categoryIcons[card.category]}</span>
                        <span class="text-sm font-medium text-gray-dark">{card.title}</span>
                      </div>
                      <div class="text-xs text-gray-medium">
                        {formatTime(card.time_logged)}
                      </div>
                    </div>
                    
                    <!-- Card Description -->
                    {#if card.description}
                      <p class="text-sm text-gray-medium mb-3">{card.description}</p>
                    {/if}
                    
                    <!-- Card Footer -->
                    <div class="flex items-center justify-between text-xs text-gray-medium">
                      <span>Due: {card.due_date || 'No due date'}</span>
                      <div class="flex items-center gap-1">
                        <span class="opacity-0 group-hover:opacity-100 transition-opacity">Drag to move</span>
                        <svg class="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                {/each}
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/if}
  </main>

  <!-- Time Logging Modal -->
  {#if showTimeModal}
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
        <h3 class="text-2xl font-bold text-primary mb-6">Log Time for {timeLoggingCard?.title}</h3>
        
        <div class="space-y-6">
          <div>
            <label for="time-minutes" class="block text-sm font-medium text-gray-dark mb-2">Time Spent (minutes)</label>
            <div id="time-minutes" class="grid grid-cols-3 gap-3">
              <button
                on:click={() => timeMinutes = 15}
                class="px-4 py-2 rounded-lg border-2 transition-colors {timeMinutes === 15 ? 'border-primary bg-primary text-white' : 'border-gray-200 text-gray-dark hover:border-primary'}"
              >
                15 min
              </button>
              <button
                on:click={() => timeMinutes = 30}
                class="px-4 py-2 rounded-lg border-2 transition-colors {timeMinutes === 30 ? 'border-primary bg-primary text-white' : 'border-gray-200 text-gray-dark hover:border-primary'}"
              >
                30 min
              </button>
              <button
                on:click={() => timeMinutes = 45}
                class="px-4 py-2 rounded-lg border-2 transition-colors {timeMinutes === 45 ? 'border-primary bg-primary text-white' : 'border-gray-200 text-gray-dark hover:border-primary'}"
              >
                45 min
              </button>
            </div>
          </div>
          
          <div>
            <label for="time-notes" class="block text-sm font-medium text-gray-dark mb-2">Notes (optional)</label>
            <textarea id="time-notes"
              bind:value={timeNotes}
              rows="3"
              class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="What was accomplished..."
            ></textarea>
          </div>
          
          <div class="flex gap-3">
            <button
              on:click={() => showTimeModal = false}
              class="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-dark hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              on:click={logTime}
              class="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-800"
            >
              Log Time
            </button>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  /* Custom scrollbar for kanban board */
  .min-h-96 {
    min-height: 24rem;
  }

  /* Smooth drag animations */
  [draggable="true"] {
    cursor: grab;
  }

  [draggable="true"]:active {
    cursor: grabbing;
  }

  /* Column hover effects */
  .bg-gray-50:hover {
    background-color: #f3f4f6;
  }

  /* Card animations */
  /* .group:hover .group-hover\:shadow-md {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  } */

  /* Modal backdrop */
  .bg-black.bg-opacity-50 {
    backdrop-filter: blur(4px);
  }
</style>