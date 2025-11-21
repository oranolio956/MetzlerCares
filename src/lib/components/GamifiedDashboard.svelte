<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, scale, slide } from 'svelte/transition';
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';
  
  export let userId: string;
  // export let persona: string; // Removed unused export
  
  let dashboardData: any = null;
  let isLoading = true;
  let error = '';
  let selectedTab = 'progress';
  let showCelebration = false;
  let celebrationMessage = '';
  
  // Animated values
  const progressValue = tweened(0, {
    duration: 1000,
    easing: cubicOut
  });
  
  const pointsValue = tweened(0, {
    duration: 1500,
    easing: cubicOut
  });
  
  const tabs = [
    { id: 'progress', name: 'My Progress', icon: '📈' },
    { id: 'achievements', name: 'Achievements', icon: '🏆' },
    { id: 'community', name: 'Community', icon: '👥' },
    { id: 'referrals', name: 'Referrals', icon: '🤝' }
  ];
  
  onMount(async () => {
    await loadDashboardData();
    
    // Check for new achievements
    if (dashboardData?.newAchievements?.length > 0) {
      showAchievementCelebration(dashboardData.newAchievements[0]);
    }
  });
  
  async function loadDashboardData() {
    try {
      isLoading = true;
      error = '';
      
      const response = await fetch(`/api/dashboard/${userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to load dashboard data');
      }
      
      dashboardData = await response.json();
      
      // Animate the values
      progressValue.set(dashboardData.overallProgress || 0);
      pointsValue.set(dashboardData.totalPoints || 0);
      
    } catch (err) {
      error = 'Unable to load dashboard data';
      console.error('Error loading dashboard:', err);
    } finally {
      isLoading = false;
    }
  }
  
  function showAchievementCelebration(achievement: any) {
    celebrationMessage = `🎉 Achievement Unlocked: ${achievement.name}!`;
    showCelebration = true;
    
    setTimeout(() => {
      showCelebration = false;
    }, 3000);
  }
  
  function getProgressColor(percentage: number): string {
    if (percentage >= 80) return 'text-green-500';
    if (percentage >= 50) return 'text-blue-500';
    if (percentage >= 25) return 'text-yellow-500';
    return 'text-red-500';
  }
  
  function getProgressStrokeColor(percentage: number): string {
    if (percentage >= 80) return '#10b981'; // green-500
    if (percentage >= 50) return '#3b82f6'; // blue-500
    if (percentage >= 25) return '#f59e0b'; // yellow-500
    return '#ef4444'; // red-500
  }
  
  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
  
  function formatDays(days: number): string {
    if (days === 0) return 'Today';
    if (days === 1) return '1 day';
    return `${days} days`;
  }
  
  async function connectWithBuddy(buddyId: string) {
    try {
      const response = await fetch('/api/buddies/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, buddyId })
      });
      
      if (response.ok) {
        // Refresh dashboard data
        await loadDashboardData();
        showCelebration = true;
        celebrationMessage = '🤝 New buddy connection created!';
        setTimeout(() => showCelebration = false, 3000);
      }
    } catch (err) {
      console.error('Error connecting with buddy:', err);
    }
  }
  
  async function shareAchievement(achievement: any) {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Recovery Achievement',
          text: `I just earned the "${achievement.name}" achievement in my recovery journey! 🏆`,
          url: window.location.href
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback to copying to clipboard
      const text = `I just earned the "${achievement.name}" achievement in my recovery journey! 🏆`;
      navigator.clipboard.writeText(text).then(() => {
        alert('Achievement copied to clipboard!');
      });
    }
  }
  
  function calculateStreak(milestones: any[]): number {
    const completedMilestones = milestones.filter(m => m.is_completed);
    if (completedMilestones.length === 0) return 0;
    
    // Simple streak calculation - in real app would be more sophisticated
    return completedMilestones.length;
  }
</script>

<div class="gamified-dashboard max-w-6xl mx-auto p-6">
  <!-- Celebration Modal -->
  {#if showCelebration}
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" transition:fade={{ duration: 300 }}>
      <div class="bg-white rounded-lg p-8 text-center max-w-md mx-4" transition:scale={{ duration: 500 }}>
        <div class="text-4xl mb-4">🎉</div>
        <h3 class="text-xl font-bold text-gray-800 mb-2">{celebrationMessage}</h3>
        <div class="animate-bounce mt-4">
          <div class="text-2xl">🏆</div>
        </div>
      </div>
    </div>
  {/if}
  
  {#if isLoading}
    <div class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <p class="text-gray-600">Loading your dashboard...</p>
    </div>
  {:else if error}
    <div class="text-center py-12">
      <div class="text-red-500 mb-4">❌</div>
      <p class="text-red-600">{error}</p>
      <button 
        on:click={loadDashboardData}
        class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  {:else if dashboardData}
    <!-- Header Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow-md p-6 text-center">
        <div class="text-3xl mb-2">🔥</div>
        <div class="text-2xl font-bold text-orange-500">{calculateStreak(dashboardData.milestones)}</div>
        <div class="text-sm text-gray-600">Day Streak</div>
      </div>
      
      <div class="bg-white rounded-lg shadow-md p-6 text-center">
        <div class="text-3xl mb-2">⭐</div>
        <div class="text-2xl font-bold text-yellow-500">{$pointsValue}</div>
        <div class="text-sm text-gray-600">Total Points</div>
      </div>
      
      <div class="bg-white rounded-lg shadow-md p-6 text-center">
        <div class="text-3xl mb-2">🎯</div>
        <div class="text-2xl font-bold text-blue-500">{$progressValue.toFixed(0)}%</div>
        <div class="text-sm text-gray-600">Progress</div>
      </div>
      
      <div class="bg-white rounded-lg shadow-md p-6 text-center">
        <div class="text-3xl mb-2">👥</div>
        <div class="text-2xl font-bold text-green-500">{dashboardData.buddyCount || 0}</div>
        <div class="text-sm text-gray-600">Buddies</div>
      </div>
    </div>
    
    <!-- Main Content -->
    <div class="bg-white rounded-lg shadow-md">
      <!-- Tabs -->
      <div class="border-b border-gray-200">
        <nav class="flex space-x-8 px-6" aria-label="Tabs">
          {#each tabs as tab}
            <button
              on:click={() => selectedTab = tab.id}
              class="py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 {selectedTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
            >
              <span class="mr-2">{tab.icon}</span>
              {tab.name}
            </button>
          {/each}
        </nav>
      </div>
      
      <!-- Tab Content -->
      <div class="p-6">
        <!-- Progress Tab -->
        {#if selectedTab === 'progress'}
          <div in:fade={{ duration: 300 }}>
            <h3 class="text-lg font-semibold mb-6">Recovery Progress</h3>
            
            <!-- Overall Progress Circle -->
            <div class="flex justify-center mb-8">
              <div class="relative">
                <svg class="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#e5e7eb"
                    stroke-width="8"
                    fill="none"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke={getProgressStrokeColor($progressValue)}
                    stroke-width="8"
                    fill="none"
                    stroke-dasharray={`${2 * Math.PI * 56}`}
                    stroke-dashoffset={`${2 * Math.PI * 56 * (1 - $progressValue / 100)}`}
                    class="transition-all duration-1000"
                  />
                </svg>
                <div class="absolute inset-0 flex items-center justify-center">
                  <div class="text-center">
                    <div class="text-2xl font-bold {getProgressColor($progressValue)}">{$progressValue.toFixed(0)}%</div>
                    <div class="text-xs text-gray-500">Complete</div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Milestones -->
            <div class="space-y-4">
              {#each dashboardData.milestones as milestone}
                <div class="bg-gray-50 rounded-lg p-4">
                  <div class="flex items-center justify-between mb-2">
                    <h4 class="font-medium text-gray-800">{milestone.milestone_name}</h4>
                    <span class="text-sm text-gray-500">{milestone.current_value}/{milestone.target_value} {milestone.unit}</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      class="h-2 rounded-full transition-all duration-500 {getProgressStrokeColor((milestone.current_value / milestone.target_value) * 100)}"
                      style="width: {(milestone.current_value / milestone.target_value) * 100}%"
                    ></div>
                  </div>
                  {#if milestone.is_completed}
                    <div class="mt-2 text-green-600 text-sm font-medium">✅ Completed on {formatDate(milestone.completed_at)}</div>
                  {/if}
                </div>
              {/each}
            </div>
          </div>
        {/if}
        
        <!-- Achievements Tab -->
        {#if selectedTab === 'achievements'}
          <div in:fade={{ duration: 300 }}>
            <h3 class="text-lg font-semibold mb-6">Achievements</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {#each dashboardData.achievements as achievement}
                <div class="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-200">
                  <div class="text-center">
                    <div class="text-3xl mb-2">{achievement.badge_icon || '🏆'}</div>
                    <h4 class="font-semibold text-gray-800 mb-1">{achievement.name}</h4>
                    <p class="text-sm text-gray-600 mb-3">{achievement.description}</p>
                    <div class="flex items-center justify-between">
                      <span class="text-xs text-yellow-700 font-medium">+{achievement.points_awarded} points</span>
                      <button
                        on:click={() => shareAchievement(achievement)}
                        class="text-xs bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 transition-colors"
                      >
                        Share
                      </button>
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        {/if}
        
        <!-- Community Tab -->
        {#if selectedTab === 'community'}
          <div in:fade={{ duration: 300 }}>
            <h3 class="text-lg font-semibold mb-6">Recovery Community</h3>
            
            <!-- Buddy Connections -->
            <div class="mb-8">
              <h4 class="font-medium text-gray-800 mb-4">Your Recovery Buddies</h4>
              {#if dashboardData.buddies && dashboardData.buddies.length > 0}
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {#each dashboardData.buddies as buddy}
                    <div class="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <div class="flex items-center mb-3">
                        <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                          {buddy.first_name?.[0] || '?'}
                        </div>
                        <div>
                          <h5 class="font-medium text-gray-800">{buddy.first_name} {buddy.last_name}</h5>
                          <p class="text-xs text-gray-500">{formatDays(buddy.sober_days)} sober</p>
                        </div>
                      </div>
                      <div class="flex justify-between text-xs text-gray-600">
                        <span>Connection strength:</span>
                        <span class="font-medium">{buddy.connection_strength}/10</span>
                      </div>
                    </div>
                  {/each}
                </div>
              {:else}
                <div class="text-center py-8 bg-gray-50 rounded-lg">
                  <div class="text-4xl mb-4">👥</div>
                  <p class="text-gray-600 mb-4">Connect with recovery buddies for support</p>
                  <button class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                    Find Buddies
                  </button>
                </div>
              {/if}
            </div>
            
            <!-- Suggested Buddies -->
            {#if dashboardData.suggestedBuddies && dashboardData.suggestedBuddies.length > 0}
              <div>
                <h4 class="font-medium text-gray-800 mb-4">Suggested Buddies</h4>
                <div class="space-y-3">
                  {#each dashboardData.suggestedBuddies as buddy}
                    <div class="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                      <div class="flex items-center">
                        <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                          {buddy.first_name?.[0] || '?'}
                        </div>
                        <div>
                          <h5 class="font-medium text-gray-800 text-sm">{buddy.first_name} {buddy.last_name}</h5>
                          <p class="text-xs text-gray-500">{formatDays(buddy.sober_days)} sober • Similar goals</p>
                        </div>
                      </div>
                      <button
                        on:click={() => connectWithBuddy(buddy.id)}
                        class="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                      >
                        Connect
                      </button>
                    </div>
                  {/each}
                </div>
              </div>
            {/if}
          </div>
        {/if}
        
        <!-- Referrals Tab -->
        {#if selectedTab === 'referrals'}
          <div in:fade={{ duration: 300 }}>
            <h3 class="text-lg font-semibold mb-6">Referral Program</h3>
            
            <div class="bg-green-50 rounded-lg p-6 mb-6">
              <div class="text-center">
                <div class="text-3xl mb-2">🤝</div>
                <h4 class="font-semibold text-green-800 mb-2">Help Others Find Recovery</h4>
                <p class="text-green-700 mb-4">Refer friends or family and earn points for successful admissions</p>
                <div class="text-2xl font-bold text-green-600 mb-4">
                  {dashboardData.referralStats?.successful || 0} Successful Referrals
                </div>
                <button class="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors">
                  Create Referral
                </button>
              </div>
            </div>
            
            {#if dashboardData.recentReferrals && dashboardData.recentReferrals.length > 0}
              <div>
                <h4 class="font-medium text-gray-800 mb-4">Recent Referrals</h4>
                <div class="space-y-3">
                  {#each dashboardData.recentReferrals as referral}
                    <div class="bg-white border border-gray-200 rounded-lg p-4">
                      <div class="flex items-center justify-between mb-2">
                        <span class="font-medium text-gray-800">{referral.client_name}</span>
                        <span class="text-xs px-2 py-1 rounded {referral.status === 'completed' ? 'bg-green-100 text-green-800' : referral.status === 'admitted' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}">
                          {referral.status}
                        </span>
                      </div>
                      <div class="text-sm text-gray-600">
                        <p>Created: {formatDate(referral.created_at)}</p>
                        {#if referral.commission_earned > 0}
                          <p class="text-green-600 font-medium">Earned: ${referral.commission_earned}</p>
                        {/if}
                      </div>
                    </div>
                  {/each}
                </div>
              </div>
            {/if}
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>

<style>
  .gamified-dashboard {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  
  @keyframes bounce {
    0%, 20%, 53%, 80%, 100% {
      transform: translate3d(0,0,0);
    }
    40%, 43% {
      transform: translate3d(0, -30px, 0);
    }
    70% {
      transform: translate3d(0, -15px, 0);
    }
    90% {
      transform: translate3d(0, -4px, 0);
    }
  }
  
  .animate-bounce {
    animation: bounce 1s infinite;
  }
  
  .animate-spin {
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>