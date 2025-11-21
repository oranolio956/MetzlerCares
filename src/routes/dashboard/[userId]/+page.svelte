<script lang="ts">
  import { page } from '$app/stores';
  import GamifiedDashboard from '$lib/components/GamifiedDashboard.svelte';
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  
  let userId = $page.params.userId;
  let userData: any = null;
  let isLoading = true;
  let error = '';
  
  onMount(async () => {
    try {
      // Load user data
      const response = await fetch(`/api/users/${userId}`);
      
      if (!response.ok) {
        throw new Error('User not found');
      }
      
      userData = await response.json();
      
      // Track dashboard view
      trackDashboardView();
      
    } catch (err) {
      error = 'Unable to load dashboard';
      console.error('Error loading dashboard:', err);
    } finally {
      isLoading = false;
    }
  });
  
  function trackDashboardView() {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'dashboard_view', {
        user_id: userId,
        persona: userData?.persona_type || 'unknown'
      });
    }
    
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_type: 'dashboard_view',
        user_id: userId,
        persona: userData?.persona_type || 'unknown'
      })
    }).catch(console.error);
  }
</script>

<svelte:head>
  <title>My Recovery Dashboard - MetzlerCares</title>
  <meta name="description" content="Track your recovery progress, achievements, and connect with your support community." />
</svelte:head>

<div class="min-h-screen bg-cream">
  {#if isLoading}
    <div class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-mountain-blue mx-auto mb-4"></div>
        <p class="text-charcoal font-medium">Loading your dashboard...</p>
      </div>
    </div>
  {:else if error}
    <div class="flex items-center justify-center min-h-screen">
      <div class="text-center bg-white p-10 rounded-xl shadow-premium border border-warm-gray">
        <div class="text-red-500 text-5xl mb-6">❌</div>
        <h1 class="text-2xl font-bold text-charcoal mb-3">Dashboard Not Found</h1>
        <p class="text-charcoal/70 mb-8">{error}</p>
        <a href="/" class="bg-mountain-blue text-white px-8 py-3 rounded-lg hover:bg-mountain-blue/90 transition-colors font-bold shadow-mountain">
          Go Home
        </a>
      </div>
    </div>
  {:else if userData}
    <div in:fade={{ duration: 500 }}>
      <!-- Header -->
      <header class="bg-white shadow-sm border-b border-warm-gray">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center py-4">
            <div class="flex items-center">
              <a href="/" class="text-2xl font-bold text-forest-green font-primary">MetzlerCares</a>
            </div>
            <div class="flex items-center space-x-6">
              <span class="text-charcoal font-medium">Welcome back, <span class="text-mountain-blue">{userData.first_name || 'Friend'}</span>!</span>
              <a href="/" class="text-charcoal/60 hover:text-mountain-blue transition-colors text-sm font-medium">Home</a>
            </div>
          </div>
        </div>
      </header>
      
      <!-- Dashboard Content -->
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <GamifiedDashboard 
          userId={userId}
        />
      </main>
    </div>
  {/if}
</div>

<style>
  .animate-spin {
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
</style>