<script lang="ts">
  import { onMount } from 'svelte';
  import { getSystemStatus, getRapidRankingMetrics, getCompetitorAnalysis } from '$lib/utils/metzler-cares-deployment.js';

  interface SystemStatus {
    health: {
      overall: string;
      indexing: number;
      contentVelocity: number;
      schemaMarkup: number;
      competitorMonitoring: number;
      searchConsole: number;
      issues: string[];
    };
    metrics: {
      pagesIndexed: number;
      averageRankingPosition: number;
      contentVelocityScore: number;
      schemaCoverage: number;
      competitorThreats: number;
      opportunities: number;
      indexingSpeed: number;
      rankingImprovement: number;
      trafficGrowth: number;
    };
    config: {
      mode: string;
      indexingStrategy: string;
      contentVelocity: string;
    };
  }

  interface CompetitorAnalysis {
    highThreat: Array<{
      domain: string;
      ranking: number;
      threatLevel: string;
      domainAuthority: number;
    }>;
    opportunities: Array<{
      keyword: string;
      position: {
        position: number;
        opportunityScore: number;
        difficulty: string;
      };
    }>;
  }

  let systemStatus: SystemStatus | null = null;
  let competitorAnalysis: CompetitorAnalysis | null = null;
  let isLoading = true;
  let lastUpdate = '';
  let autoRefresh = true;
  let refreshInterval: number | null = null;

  // Fetch system status
  async function fetchSystemStatus() {
    try {
      const response = await fetch('/api/seo/status');
      const data = await response.json();
      if (data.success) {
        systemStatus = data.data.system;
        lastUpdate = new Date().toLocaleString();
      }
    } catch (error) {
      console.error('Failed to fetch system status:', error);
    }
  }

  // Fetch rapid ranking metrics
  async function fetchMetrics() {
    try {
      const response = await fetch('/api/seo/metrics');
      const data = await response.json();
      if (data.success) {
        // Update systemStatus with latest metrics
        if (systemStatus) {
          systemStatus.metrics = data.data.metrics;
        }
      }
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
    }
  }

  // Fetch competitor analysis
  async function fetchCompetitorAnalysis() {
    try {
      const response = await fetch('/api/seo/competitors');
      const data = await response.json();
      if (data.success) {
        competitorAnalysis = data.data.competitors;
      }
    } catch (error) {
      console.error('Failed to fetch competitor analysis:', error);
    }
  }

  // Fetch all data
  async function fetchAllData() {
    isLoading = true;
    await Promise.all([
      fetchSystemStatus(),
      fetchMetrics(),
      fetchCompetitorAnalysis()
    ]);
    isLoading = false;
  }

  // Toggle auto refresh
  function toggleAutoRefresh() {
    autoRefresh = !autoRefresh;
    if (autoRefresh) {
      startAutoRefresh();
    } else {
      stopAutoRefresh();
    }
  }

  // Start auto refresh
  function startAutoRefresh() {
    if (refreshInterval) clearInterval(refreshInterval);
    refreshInterval = window.setInterval(fetchAllData, 30000); // 30 seconds
  }

  // Stop auto refresh
  function stopAutoRefresh() {
    if (refreshInterval) {
      clearInterval(refreshInterval);
      refreshInterval = null;
    }
  }

  // Activate emergency mode
  async function activateEmergencyMode() {
    try {
      const response = await fetch('/api/seo/emergency?action=activate');
      const data = await response.json();
      if (data.success) {
        alert('Emergency mode activated! All systems running at maximum capacity.');
        fetchAllData(); // Refresh data
      }
    } catch (error) {
      console.error('Failed to activate emergency mode:', error);
    }
  }

  // Force index a page
  async function forceIndexPage() {
    const url = prompt('Enter URL to force index:');
    if (url) {
      try {
        const response = await fetch(`/api/seo/index?url=${encodeURIComponent(url)}`);
        const data = await response.json();
        if (data.success) {
          alert(`Page submitted for indexing: ${data.data.message}`);
        }
      } catch (error) {
        console.error('Failed to force index page:', error);
      }
    }
  }

  // Get health status color
  function getHealthColor(score: number): string {
    if (score >= 90) return 'text-green-500';
    if (score >= 80) return 'text-yellow-500';
    if (score >= 70) return 'text-orange-500';
    return 'text-red-500';
  }

  // Get overall status color
  function getOverallStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'excellent': return 'text-green-500';
      case 'good': return 'text-yellow-500';
      case 'warning': return 'text-orange-500';
      case 'critical': return 'text-red-500';
      default: return 'text-gray-500';
    }
  }

  onMount(() => {
    fetchAllData();
    if (autoRefresh) {
      startAutoRefresh();
    }
    
    return () => {
      stopAutoRefresh();
    };
  });
</script>

<div class="min-h-screen bg-gray-900 text-white p-6">
  <div class="max-w-7xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
        MetzlerCares SEO Command Center
      </h1>
      <p class="text-gray-400">Colorado Recovery Services - Rapid Ranking System</p>
      
      <div class="flex items-center gap-4 mt-4">
        <button
          on:click={fetchAllData}
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          🔄 Refresh Data
        </button>
        
        <button
          on:click={toggleAutoRefresh}
          class="px-4 py-2 {autoRefresh ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'} rounded-lg transition-colors"
        >
          {autoRefresh ? '⏸️ Pause Auto-Refresh' : '▶️ Enable Auto-Refresh'}
        </button>
        
        <button
          on:click={activateEmergencyMode}
          class="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
        >
          🚨 Emergency Mode
        </button>
        
        <button
          on:click={forceIndexPage}
          class="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
        >
          ⚡ Force Index Page
        </button>
        
        <span class="text-sm text-gray-400">
          Last Update: {lastUpdate}
        </span>
      </div>
    </div>

    {#if isLoading}
      <div class="flex items-center justify-center h-64">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p class="text-gray-400">Loading SEO system data...</p>
        </div>
      </div>
    {:else if systemStatus}
      <!-- System Overview -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 class="text-lg font-semibold mb-2">System Status</h3>
          <p class="text-2xl font-bold {getOverallStatusColor(systemStatus.health.overall)}">
            {systemStatus.health.overall.toUpperCase()}
          </p>
          <p class="text-sm text-gray-400 mt-1">Overall Health</p>
        </div>
        
        <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 class="text-lg font-semibold mb-2">Pages Indexed</h3>
          <p class="text-2xl font-bold text-blue-400">
            {systemStatus.metrics.pagesIndexed.toLocaleString()}
          </p>
          <p class="text-sm text-gray-400 mt-1">Total Pages</p>
        </div>
        
        <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 class="text-lg font-semibold mb-2">Avg Ranking</h3>
          <p class="text-2xl font-bold text-green-400">
            #{systemStatus.metrics.averageRankingPosition.toFixed(1)}
          </p>
          <p class="text-sm text-gray-400 mt-1">Average Position</p>
        </div>
        
        <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 class="text-lg font-semibold mb-2">Content Velocity</h3>
          <p class="text-2xl font-bold text-purple-400">
            {systemStatus.metrics.contentVelocityScore.toFixed(1)}/10
          </p>
          <p class="text-sm text-gray-400 mt-1">Freshness Score</p>
        </div>
      </div>

      <!-- Performance Metrics -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 class="text-xl font-semibold mb-4">System Health Metrics</h3>
          <div class="space-y-4">
            {#each [
              { name: 'Indexing Performance', value: systemStatus.health.indexing, color: 'blue' },
              { name: 'Content Velocity', value: systemStatus.health.contentVelocity, color: 'purple' },
              { name: 'Schema Markup', value: systemStatus.health.schemaMarkup, color: 'green' },
              { name: 'Competitor Monitoring', value: systemStatus.health.competitorMonitoring, color: 'yellow' },
              { name: 'Search Console', value: systemStatus.health.searchConsole, color: 'red' }
            ] as metric}
              <div>
                <div class="flex justify-between items-center mb-2">
                  <span class="text-sm font-medium">{metric.name}</span>
                  <span class="text-sm {getHealthColor(metric.value)}">{metric.value.toFixed(0)}%</span>
                </div>
                <div class="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    class="bg-{metric.color}-500 h-2 rounded-full transition-all duration-300"
                    style="width: {metric.value}%"
                  ></div>
                </div>
              </div>
            {/each}
          </div>
        </div>

        <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 class="text-xl font-semibold mb-4">Rapid Ranking Metrics</h3>
          <div class="grid grid-cols-2 gap-4">
            <div class="text-center">
              <p class="text-2xl font-bold text-blue-400">
                {systemStatus.metrics.indexingSpeed.toFixed(1)}h
              </p>
              <p class="text-sm text-gray-400">Avg Indexing Time</p>
            </div>
            <div class="text-center">
              <p class="text-2xl font-bold text-green-400">
                +{systemStatus.metrics.rankingImprovement}
              </p>
              <p class="text-sm text-gray-400">Positions Gained</p>
            </div>
            <div class="text-center">
              <p class="text-2xl font-bold text-purple-400">
                +{systemStatus.metrics.trafficGrowth}%
              </p>
              <p class="text-sm text-gray-400">Traffic Growth</p>
            </div>
            <div class="text-center">
              <p class="text-2xl font-bold text-yellow-400">
                {systemStatus.metrics.schemaCoverage.toFixed(0)}%
              </p>
              <p class="text-sm text-gray-400">Schema Coverage</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Competitor Analysis -->
      {#if competitorAnalysis}
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 class="text-xl font-semibold mb-4">High-Threat Competitors</h3>
            {#if competitorAnalysis.highThreat.length > 0}
              <div class="space-y-3">
                {#each competitorAnalysis.highThreat.slice(0, 5) as competitor}
                  <div class="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div>
                      <p class="font-medium text-red-400">{competitor.domain}</p>
                      <p class="text-sm text-gray-400">Position: #{competitor.ranking}</p>
                    </div>
                    <div class="text-right">
                      <p class="text-sm font-medium {competitor.threatLevel === 'critical' ? 'text-red-500' : 'text-orange-500'}">
                        {competitor.threatLevel.toUpperCase()}
                      </p>
                      <p class="text-sm text-gray-400">DA: {competitor.domainAuthority}</p>
                    </div>
                  </div>
                {/each}
              </div>
            {:else}
              <p class="text-gray-400">No high-threat competitors detected</p>
            {/if}
          </div>

          <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 class="text-xl font-semibold mb-4">Opportunities</h3>
            {#if competitorAnalysis.opportunities.length > 0}
              <div class="space-y-3">
                {#each competitorAnalysis.opportunities.slice(0, 5) as opportunity}
                  <div class="p-3 bg-gray-700 rounded-lg">
                    <p class="font-medium text-green-400 mb-1">{opportunity.keyword}</p>
                    <div class="flex justify-between text-sm text-gray-400">
                      <span>Position: #{opportunity.position.position}</span>
                      <span>Score: {opportunity.position.opportunityScore.toFixed(2)}</span>
                      <span>Difficulty: {opportunity.position.difficulty}</span>
                    </div>
                  </div>
                {/each}
              </div>
            {:else}
              <p class="text-gray-400">No opportunities identified</p>
            {/if}
          </div>
        </div>
      {/if}

      <!-- System Issues -->
      {#if systemStatus.health.issues.length > 0}
        <div class="bg-red-900 border border-red-700 rounded-lg p-6 mb-8">
          <h3 class="text-xl font-semibold mb-4 text-red-400">System Issues</h3>
          <div class="space-y-2">
            {#each systemStatus.health.issues as issue}
              <div class="flex items-center gap-2">
                <span class="text-red-400">⚠️</span>
                <span class="text-red-300">{issue}</span>
              </div>
            {/each}
          </div>
        </div>
      {/if}

      <!-- Configuration -->
      <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 class="text-xl font-semibold mb-4">System Configuration</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p class="text-sm text-gray-400">Mode</p>
            <p class="font-medium text-blue-400">{systemStatus.config.mode.toUpperCase()}</p>
          </div>
          <div>
            <p class="text-sm text-gray-400">Indexing Strategy</p>
            <p class="font-medium text-purple-400">{systemStatus.config.indexingStrategy.toUpperCase()}</p>
          </div>
          <div>
            <p class="text-sm text-gray-400">Content Velocity</p>
            <p class="font-medium text-green-400">{systemStatus.config.contentVelocity.toUpperCase()}</p>
          </div>
        </div>
      </div>
    {:else}
      <div class="text-center text-gray-400">
        <p>No system data available</p>
      </div>
    {/if}
  </div>
</div>

<style>
  .bg-gray-900 {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  }
  
  .bg-gray-800 {
    background: rgba(45, 45, 45, 0.95);
  }
  
  .bg-gray-700 {
    background: rgba(64, 64, 64, 0.6);
  }
  
  .border-gray-700 {
    border-color: rgba(64, 64, 64, 0.3);
  }
</style>