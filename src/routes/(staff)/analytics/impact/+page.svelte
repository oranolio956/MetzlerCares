<script lang="ts">
  import { onMount } from 'svelte'
  import { Chart, registerables } from 'chart.js'
  import { Download, TrendingUp, Users, Heart, Award, Target, Calendar, MapPin } from 'lucide-svelte'
  
  Chart.register(...registerables)

  interface ImpactMetric {
    category: string
    current_value: number
    target_value: number
    unit: string
    trend: 'up' | 'down' | 'stable'
    change_percent: number
  }

  interface SuccessStory {
    id: string
    name: string
    age: number
    program: string
    graduation_date: string
    current_status: string
    employment_type: string
    sobriety_duration: number
    impact_score: number
  }

  interface GeographicImpact {
    region: string
    total_participants: number
    success_rate: number
    avg_sobriety_duration: number
    employment_rate: number
    cost_per_outcome: number
  }

  export let data

  let impactChart: Chart | null = null
  let successTrendChart: Chart | null = null
  let geographicChart: Chart | null = null

  let impactMetrics: ImpactMetric[] = data.impactMetrics
  let successStories: SuccessStory[] = data.successStories
  let geographicImpact: GeographicImpact[] = data.geographicImpact
  let kpis = data.kpis

  onMount(() => {
    initializeCharts()
  })

  function initializeCharts() {
    // Impact Progress Chart
    const impactCtx = document.getElementById('impactChart') as HTMLCanvasElement
    if (impactCtx) {
      impactChart = new Chart(impactCtx, {
        type: 'radar',
        data: {
          labels: impactMetrics.map(m => m.category),
          datasets: [
            {
              label: 'Current Performance',
              data: impactMetrics.map(m => (m.current_value / m.target_value) * 100),
              backgroundColor: 'rgba(34, 197, 94, 0.2)',
              borderColor: 'rgba(34, 197, 94, 1)',
              borderWidth: 2,
              pointBackgroundColor: 'rgba(34, 197, 94, 1)',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: 'rgba(34, 197, 94, 1)'
            },
            {
              label: 'Target (100%)',
              data: impactMetrics.map(() => 100),
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              borderColor: 'rgba(59, 130, 246, 0.5)',
              borderWidth: 1,
              pointBackgroundColor: 'rgba(59, 130, 246, 0.5)',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: 'rgba(59, 130, 246, 1)'
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Impact Metrics Performance vs Target',
              font: { size: 16, weight: 'bold' }
            }
          },
          scales: {
            r: {
              beginAtZero: true,
              max: 120,
              ticks: {
                stepSize: 20
              }
            }
          }
        }
      })
    }

    // Success Trend Chart
    const trendCtx = document.getElementById('successTrendChart') as HTMLCanvasElement
    if (trendCtx) {
      const monthlyData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
      const successRates = [72, 75, 78, 81, 79, 83]
      const employmentRates = [65, 68, 71, 74, 72, 76]
      const sobrietyRates = [85, 87, 89, 91, 88, 92]

      successTrendChart = new Chart(trendCtx, {
        type: 'line',
        data: {
          labels: monthlyData,
          datasets: [
            {
              label: 'Success Rate',
              data: successRates,
              borderColor: 'rgba(34, 197, 94, 1)',
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              tension: 0.4,
              fill: true
            },
            {
              label: 'Employment Rate',
              data: employmentRates,
              borderColor: 'rgba(59, 130, 246, 1)',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              tension: 0.4,
              fill: true
            },
            {
              label: 'Sobriety Maintenance',
              data: sobrietyRates,
              borderColor: 'rgba(147, 51, 234, 1)',
              backgroundColor: 'rgba(147, 51, 234, 0.1)',
              tension: 0.4,
              fill: true
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: '6-Month Impact Trends',
              font: { size: 16, weight: 'bold' }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              title: {
                display: true,
                text: 'Percentage (%)'
              }
            }
          }
        }
      })
    }

    // Geographic Impact Chart
    const geoCtx = document.getElementById('geographicChart') as HTMLCanvasElement
    if (geoCtx) {
      geographicChart = new Chart(geoCtx, {
        type: 'bar',
        data: {
          labels: geographicImpact.map(g => g.region),
          datasets: [
            {
              label: 'Total Participants',
              data: geographicImpact.map(g => g.total_participants),
              backgroundColor: 'rgba(59, 130, 246, 0.8)',
              borderColor: 'rgba(59, 130, 246, 1)',
              borderWidth: 1
            },
            {
              label: 'Success Rate (%)',
              data: geographicImpact.map(g => g.success_rate),
              backgroundColor: 'rgba(34, 197, 94, 0.8)',
              borderColor: 'rgba(34, 197, 94, 1)',
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Geographic Impact Distribution',
              font: { size: 16, weight: 'bold' }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Count / Percentage'
              }
            }
          }
        }
      })
    }
  }

  function exportData() {
    const data = {
      impactMetrics,
      successStories,
      geographicImpact,
      kpis,
      exportDate: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `impact-analytics-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  function refreshData() {
    // Simulate data refresh
    console.log('Refreshing impact data...')
    // In a real implementation, this would fetch fresh data from the API
  }
</script>

<div class="min-h-screen bg-gray-50">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Impact Measurement</h1>
          <p class="mt-2 text-gray-600">Track program effectiveness, success stories, and geographic impact</p>
        </div>
        <div class="flex space-x-3">
          <button
            onclick={refreshData}
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <TrendingUp class="h-4 w-4 mr-2" />
            Refresh
          </button>
          <button
            onclick={exportData}
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Download class="h-4 w-4 mr-2" />
            Export Data
          </button>
        </div>
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <Users class="h-8 w-8 text-blue-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Total Participants</p>
            <p class="text-2xl font-bold text-gray-900">{kpis.total_participants.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <Target class="h-8 w-8 text-green-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Overall Success Rate</p>
            <p class="text-2xl font-bold text-gray-900">{kpis.overall_success_rate}%</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <Heart class="h-8 w-8 text-red-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Sobriety Maintenance</p>
            <p class="text-2xl font-bold text-gray-900">{kpis.sobriety_maintenance_rate}%</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <Award class="h-8 w-8 text-purple-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Employment Rate</p>
            <p class="text-2xl font-bold text-gray-900">{kpis.employment_rate}%</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <!-- Impact Progress Radar -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Impact Metrics Performance</h3>
        <div class="h-80">
          <canvas id="impactChart"></canvas>
        </div>
        <div class="mt-4 text-sm text-gray-600">
          <p>Radar chart showing current performance against target goals across key impact categories.</p>
        </div>
      </div>

      <!-- Success Trends -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">6-Month Impact Trends</h3>
        <div class="h-80">
          <canvas id="successTrendChart"></canvas>
        </div>
        <div class="mt-4 text-sm text-gray-600">
          <p>Monthly trends showing program effectiveness in key outcome areas.</p>
        </div>
      </div>
    </div>

    <!-- Geographic Impact -->
    <div class="bg-white rounded-lg shadow p-6 mb-8">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Geographic Impact Distribution</h3>
      <div class="h-80">
        <canvas id="geographicChart"></canvas>
      </div>
      <div class="mt-4 grid grid-cols-3 gap-4 text-sm">
        <div class="text-center">
          <p class="text-gray-600">Most Effective Region</p>
          <p class="text-xl font-bold text-green-600">Northeast</p>
        </div>
        <div class="text-center">
          <p class="text-gray-600">Highest Volume</p>
          <p class="text-xl font-bold text-blue-600">Southeast</p>
        </div>
        <div class="text-center">
          <p class="text-gray-600">Best ROI</p>
          <p class="text-xl font-bold text-purple-600">Midwest</p>
        </div>
      </div>
    </div>

    <!-- Impact Metrics Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden mb-8">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">Detailed Impact Metrics</h3>
        <p class="mt-1 text-sm text-gray-600">Performance tracking across key impact categories</p>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Current Value
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Target
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Progress
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trend
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Change
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            {#each impactMetrics as metric}
              <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {metric.category}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {metric.current_value.toLocaleString()} {metric.unit}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {metric.target_value.toLocaleString()} {metric.unit}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div class="flex items-center">
                    <div class="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        class="bg-blue-600 h-2 rounded-full" 
                        style="width: {Math.min((metric.current_value / metric.target_value) * 100, 100)}%"
                      ></div>
                    </div>
                    <span class="text-xs">{Math.round((metric.current_value / metric.target_value) * 100)}%</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span class={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                    metric.trend === 'up' ? 'bg-green-100 text-green-800' :
                    metric.trend === 'down' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {#if metric.trend === 'up'}
                      ↗
                    {:else if metric.trend === 'down'}
                      ↘
                    {:else}
                      →
                    {/if}
                    {metric.trend}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span class={`font-medium ${
                    metric.change_percent >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metric.change_percent >= 0 ? '+' : ''}{metric.change_percent}%
                  </span>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Success Stories -->
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold text-gray-900">Recent Success Stories</h3>
        <span class="text-sm text-gray-500">{successStories.length} stories</span>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {#each successStories.slice(0, 6) as story}
          <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div class="flex items-start justify-between mb-2">
              <div>
                <h4 class="font-medium text-gray-900">{story.name}</h4>
                <p class="text-sm text-gray-600">{story.age} years old • {story.program}</p>
              </div>
              <span class={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                story.impact_score >= 8 ? 'bg-green-100 text-green-800' :
                story.impact_score >= 6 ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                Score: {story.impact_score}/10
              </span>
            </div>
            <div class="space-y-2 text-sm">
              <div class="flex items-center text-gray-600">
                <Calendar class="h-4 w-4 mr-2" />
                Graduated: {new Date(story.graduation_date).toLocaleDateString()}
              </div>
              <div class="flex items-center text-gray-600">
                <Target class="h-4 w-4 mr-2" />
                Status: {story.current_status}
              </div>
              <div class="flex items-center text-gray-600">
                <TrendingUp class="h-4 w-4 mr-2" />
                Sobriety: {story.sobriety_duration} months
              </div>
              {#if story.employment_type !== 'Unemployed'}
                <div class="flex items-center text-green-600">
                  <Award class="h-4 w-4 mr-2" />
                  Employed: {story.employment_type}
                </div>
              {/if}
            </div>
          </div>
        {/each}
      </div>
      {#if successStories.length > 6}
        <div class="mt-4 text-center">
          <button class="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View All Success Stories ({successStories.length})
          </button>
        </div>
      {/if}
    </div>
  </div>
</div>