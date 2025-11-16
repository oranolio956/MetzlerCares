<script lang="ts">
  import { onMount } from 'svelte'
  import { page } from '$app/stores'
  import { Chart, registerables } from 'chart.js'
  
  Chart.register(...registerables)
  
  interface SecurityMetrics {
    total_requests: number
    blocked_requests: number
    auth_failures: number
    suspicious_activities: number
    timestamp: string
  }
  
  interface SecurityEvent {
    id: string
    timestamp: string
    level: 'info' | 'warn' | 'error' | 'critical'
    category: 'auth' | 'api' | 'upload' | 'security' | 'system'
    message: string
    details?: Record<string, any>
    user_id?: string
    ip_address?: string
  }
  
  let metrics: SecurityMetrics = {
    total_requests: 0,
    blocked_requests: 0,
    auth_failures: 0,
    suspicious_activities: 0,
    timestamp: new Date().toISOString()
  }
  
  let recentEvents: SecurityEvent[] = []
  let loading = true
  let error = ''
  let timeRange = '24h'
  let levelFilter = 'all'
  let categoryFilter = 'all'
  
  let requestsChart: Chart
  let threatsChart: Chart
  let categoryChart: Chart
  
  const timeRanges = [
    { value: '1h', label: 'Last Hour' },
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' }
  ]
  
  const levelFilters = [
    { value: 'all', label: 'All Levels' },
    { value: 'info', label: 'Info' },
    { value: 'warn', label: 'Warning' },
    { value: 'error', label: 'Error' },
    { value: 'critical', label: 'Critical' }
  ]
  
  const categoryFilters = [
    { value: 'all', label: 'All Categories' },
    { value: 'auth', label: 'Authentication' },
    { value: 'api', label: 'API' },
    { value: 'upload', label: 'File Upload' },
    { value: 'security', label: 'Security' },
    { value: 'system', label: 'System' }
  ]
  
  function getTimeRangeDates(range: string): { start: Date; end: Date } {
    const end = new Date()
    const start = new Date()
    
    switch (range) {
      case '1h':
        start.setHours(start.getHours() - 1)
        break
      case '24h':
        start.setDate(start.getDate() - 1)
        break
      case '7d':
        start.setDate(start.getDate() - 7)
        break
      case '30d':
        start.setDate(start.getDate() - 30)
        break
      default:
        start.setDate(start.getDate() - 1)
    }
    
    return { start, end }
  }
  
  async function loadSecurityData() {
    loading = true
    error = ''
    
    try {
      const { start, end } = getTimeRangeDates(timeRange)
      
      // Load metrics
      const metricsResponse = await fetch('/api/security/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ start: start.toISOString(), end: end.toISOString() })
      })
      
      if (metricsResponse.ok) {
        metrics = await metricsResponse.json()
      }
      
      // Load recent events
      const eventsResponse = await fetch('/api/security/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          start: start.toISOString(),
          end: end.toISOString(),
          level: levelFilter === 'all' ? null : levelFilter,
          category: categoryFilter === 'all' ? null : categoryFilter,
          limit: 100
        })
      })
      
      if (eventsResponse.ok) {
        recentEvents = await eventsResponse.json()
      }
      
      // Update charts
      updateCharts()
    } catch (err) {
      error = 'Failed to load security data'
      console.error('Error loading security data:', err)
    } finally {
      loading = false
    }
  }
  
  function updateCharts() {
    // Requests over time chart
    const requestsCtx = document.getElementById('requestsChart') as HTMLCanvasElement
    if (requestsCtx) {
      if (requestsChart) requestsChart.destroy()
      
      requestsChart = new Chart(requestsCtx, {
        type: 'line',
        data: {
          labels: generateTimeLabels(),
          datasets: [{
            label: 'Total Requests',
            data: generateRequestData(),
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4
          }, {
            label: 'Blocked Requests',
            data: generateBlockedData(),
            borderColor: 'rgb(239, 68, 68)',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Request Patterns'
            }
          },
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      })
    }
    
    // Threat detection chart
    const threatsCtx = document.getElementById('threatsChart') as HTMLCanvasElement
    if (threatsCtx) {
      if (threatsChart) threatsChart.destroy()
      
      threatsChart = new Chart(threatsCtx, {
        type: 'doughnut',
        data: {
          labels: ['Clean', 'Auth Failures', 'Rate Limited', 'Security Violations'],
          datasets: [{
            data: [
              metrics.total_requests - metrics.blocked_requests,
              metrics.auth_failures,
              metrics.blocked_requests - metrics.suspicious_activities,
              metrics.suspicious_activities
            ],
            backgroundColor: [
              'rgb(34, 197, 94)',
              'rgb(251, 191, 36)',
              'rgb(59, 130, 246)',
              'rgb(239, 68, 68)'
            ]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Security Threat Distribution'
            }
          }
        }
      })
    }
    
    // Category breakdown chart
    const categoryCtx = document.getElementById('categoryChart') as HTMLCanvasElement
    if (categoryCtx) {
      if (categoryChart) categoryChart.destroy()
      
      const categoryData = getCategoryBreakdown()
      
      categoryChart = new Chart(categoryCtx, {
        type: 'bar',
        data: {
          labels: Object.keys(categoryData),
          datasets: [{
            label: 'Events by Category',
            data: Object.values(categoryData),
            backgroundColor: [
              'rgba(59, 130, 246, 0.8)',
              'rgba(16, 185, 129, 0.8)',
              'rgba(251, 191, 36, 0.8)',
              'rgba(239, 68, 68, 0.8)',
              'rgba(139, 92, 246, 0.8)'
            ]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Security Events by Category'
            }
          },
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      })
    }
  }
  
  function generateTimeLabels(): string[] {
    const labels = []
    const now = new Date()
    
    for (let i = 23; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000)
      labels.push(time.getHours() + ':00')
    }
    
    return labels
  }
  
  function generateRequestData(): number[] {
    // Simulated data - in real implementation, this would come from analytics
    return Array.from({ length: 24 }, () => Math.floor(Math.random() * 100) + 50)
  }
  
  function generateBlockedData(): number[] {
    // Simulated data
    return Array.from({ length: 24 }, () => Math.floor(Math.random() * 10))
  }
  
  function getCategoryBreakdown(): Record<string, number> {
    const breakdown: Record<string, number> = {}
    
    recentEvents.forEach(event => {
      breakdown[event.category] = (breakdown[event.category] || 0) + 1
    })
    
    return breakdown
  }
  
  function getLevelColor(level: string): string {
    switch (level) {
      case 'info': return 'text-blue-600 bg-blue-50'
      case 'warn': return 'text-yellow-600 bg-yellow-50'
      case 'error': return 'text-red-600 bg-red-50'
      case 'critical': return 'text-purple-600 bg-purple-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }
  
  function getCategoryColor(category: string): string {
    switch (category) {
      case 'auth': return 'text-blue-700'
      case 'api': return 'text-green-700'
      case 'upload': return 'text-yellow-700'
      case 'security': return 'text-red-700'
      case 'system': return 'text-purple-700'
      default: return 'text-gray-700'
    }
  }
  
  onMount(() => {
    loadSecurityData()
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadSecurityData, 30000)
    
    return () => {
      clearInterval(interval)
      if (requestsChart) requestsChart.destroy()
      if (threatsChart) threatsChart.destroy()
      if (categoryChart) categoryChart.destroy()
    }
  })
  
  $: if (timeRange || levelFilter || categoryFilter) {
    loadSecurityData()
  }
</script>

<div class="min-h-screen bg-gray-50 py-8">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Security Analytics</h1>
      <p class="mt-2 text-gray-600">Monitor security events, threats, and system health</p>
    </div>
    
    <!-- Filters -->
    <div class="bg-white rounded-lg shadow p-6 mb-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label for="timeRange" class="block text-sm font-medium text-gray-700 mb-2">
            Time Range
          </label>
          <select
            id="timeRange"
            bind:value={timeRange}
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {#each timeRanges as range}
              <option value={range.value}>{range.label}</option>
            {/each}
          </select>
        </div>
        
        <div>
          <label for="levelFilter" class="block text-sm font-medium text-gray-700 mb-2">
            Event Level
          </label>
          <select
            id="levelFilter"
            bind:value={levelFilter}
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {#each levelFilters as filter}
              <option value={filter.value}>{filter.label}</option>
            {/each}
          </select>
        </div>
        
        <div>
          <label for="categoryFilter" class="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            id="categoryFilter"
            bind:value={categoryFilter}
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {#each categoryFilters as filter}
              <option value={filter.value}>{filter.label}</option>
            {/each}
          </select>
        </div>
      </div>
    </div>
    
    <!-- Metrics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded-lg">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Requests</p>
            <p class="text-2xl font-semibold text-gray-900">{metrics.total_requests.toLocaleString()}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 bg-red-100 rounded-lg">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Blocked Requests</p>
            <p class="text-2xl font-semibold text-gray-900">{metrics.blocked_requests.toLocaleString()}</p>
            <p class="text-sm text-red-600">{((metrics.blocked_requests / metrics.total_requests) * 100).toFixed(1)}% of total</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 bg-yellow-100 rounded-lg">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Auth Failures</p>
            <p class="text-2xl font-semibold text-gray-900">{metrics.auth_failures.toLocaleString()}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 bg-purple-100 rounded-lg">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Suspicious Activities</p>
            <p class="text-2xl font-semibold text-gray-900">{metrics.suspicious_activities.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <div class="bg-white rounded-lg shadow p-6">
        <canvas id="requestsChart" height="300"></canvas>
      </div>
      
      <div class="bg-white rounded-lg shadow p-6">
        <canvas id="threatsChart" height="300"></canvas>
      </div>
    </div>
    
    <div class="bg-white rounded-lg shadow p-6 mb-8">
      <canvas id="categoryChart" height="200"></canvas>
    </div>
    
    <!-- Recent Events -->
    <div class="bg-white rounded-lg shadow">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">Recent Security Events</h3>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            {#if loading}
              <tr>
                <td colspan="6" class="px-6 py-4 text-center text-gray-500">Loading...</td>
              </tr>
            {:else if recentEvents.length === 0}
              <tr>
                <td colspan="6" class="px-6 py-4 text-center text-gray-500">No security events found</td>
              </tr>
            {:else}
              {#each recentEvents as event}
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(event.timestamp).toLocaleString()}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {getLevelColor(event.level)}">
                      {event.level.toUpperCase()}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm {getCategoryColor(event.category)}">
                    {event.category}
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-900">
                    {event.message}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {event.ip_address || '-'}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {event.user_id || '-'}
                  </td>
                </tr>
              {/each}
            {/if}
          </tbody>
        </table>
      </div>
    </div>
    
    {#if error}
      <div class="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
        <p class="text-red-800">{error}</p>
      </div>
    {/if}
  </div>
</div>