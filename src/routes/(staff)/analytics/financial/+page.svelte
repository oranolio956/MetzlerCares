<script lang="ts">
  import { onMount } from 'svelte'
  import { Chart, registerables } from 'chart.js'
  import { Download, TrendingUp, DollarSign, Users, Target, AlertTriangle } from 'lucide-svelte'
  
  Chart.register(...registerables)

  interface DonationFunnelData {
    stage: string
    count: number
    conversion_rate: number
    value: number
  }

  interface PartnerROI {
    partner_id: string
    partner_name: string
    total_funding: number
    success_rate: number
    cost_per_success: number
    roi_score: number
    avg_stay_duration: number
    graduates_employed: number
  }

  interface MonthlyMetrics {
    month: string
    donations: number
    expenses: number
    net: number
    utilization_rate: number
  }

  export let data

  let donationFunnelChart: Chart | null = null
  let partnerROIChart: Chart | null = null
  let monthlyMetricsChart: Chart | null = null

  let donationFunnelData: DonationFunnelData[] = data.donationFunnelData
  let partnerROI: PartnerROI[] = data.partnerROI
  let monthlyMetrics: MonthlyMetrics[] = data.monthlyMetrics
  let kpis = data.kpis

  onMount(() => {
    initializeCharts()
  })

  function initializeCharts() {
    // Donation Funnel Chart
    const funnelCtx = document.getElementById('donationFunnelChart') as HTMLCanvasElement
    if (funnelCtx) {
      donationFunnelChart = new Chart(funnelCtx, {
        type: 'bar',
        data: {
          labels: donationFunnelData.map(d => d.stage),
          datasets: [{
            label: 'Conversion Count',
            data: donationFunnelData.map(d => d.count),
            backgroundColor: 'rgba(59, 130, 246, 0.8)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Donation Conversion Funnel',
              font: { size: 16, weight: 'bold' }
            },
            tooltip: {
              callbacks: {
                afterLabel: (context) => {
                  const data = donationFunnelData[context.dataIndex]
                  return `Conversion Rate: ${data.conversion_rate}%`
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Count'
              }
            }
          }
        }
      })
    }

    // Partner ROI Chart
    const roiCtx = document.getElementById('partnerROIChart') as HTMLCanvasElement
    if (roiCtx) {
      partnerROIChart = new Chart(roiCtx, {
        type: 'scatter',
        data: {
          datasets: [{
            label: 'Partner ROI Performance',
            data: partnerROI.map(p => ({
              x: p.success_rate,
              y: p.roi_score,
              label: p.partner_name
            })),
            backgroundColor: 'rgba(34, 197, 94, 0.8)',
            borderColor: 'rgba(34, 197, 94, 1)',
            pointRadius: 8,
            pointHoverRadius: 12
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Partner ROI vs Success Rate',
              font: { size: 16, weight: 'bold' }
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const partner = partnerROI[context.dataIndex]
                  return [
                    partner.partner_name,
                    `Success Rate: ${partner.success_rate}%`,
                    `ROI Score: ${partner.roi_score}`,
                    `Cost per Success: $${partner.cost_per_success.toLocaleString()}`
                  ]
                }
              }
            }
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Success Rate (%)'
              },
              min: 60,
              max: 90
            },
            y: {
              title: {
                display: true,
                text: 'ROI Score'
              },
              min: 0,
              max: 8
            }
          }
        }
      })
    }

    // Monthly Metrics Chart
    const metricsCtx = document.getElementById('monthlyMetricsChart') as HTMLCanvasElement
    if (metricsCtx) {
      monthlyMetricsChart = new Chart(metricsCtx, {
        type: 'line',
        data: {
          labels: monthlyMetrics.map(m => m.month),
          datasets: [
            {
              label: 'Donations',
              data: monthlyMetrics.map(m => m.donations),
              borderColor: 'rgba(34, 197, 94, 1)',
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              tension: 0.4,
              fill: true
            },
            {
              label: 'Expenses',
              data: monthlyMetrics.map(m => m.expenses),
              borderColor: 'rgba(239, 68, 68, 1)',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              tension: 0.4,
              fill: true
            },
            {
              label: 'Net Funding',
              data: monthlyMetrics.map(m => m.net),
              borderColor: 'rgba(59, 130, 246, 1)',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
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
              text: 'Monthly Financial Trends',
              font: { size: 16, weight: 'bold' }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Amount ($)'
              }
            }
          }
        }
      })
    }
  }

  function exportData() {
    const data = {
      kpis,
      donationFunnel: donationFunnelData,
      partnerROI,
      monthlyMetrics,
      exportDate: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `financial-analytics-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  function refreshData() {
    // Simulate data refresh
    console.log('Refreshing financial data...')
    // In a real implementation, this would fetch fresh data from the API
  }
</script>

<div class="min-h-screen bg-gray-50">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Financial Analytics</h1>
          <p class="mt-2 text-gray-600">Track donation funnels, fund utilization, and partner ROI performance</p>
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
            <DollarSign class="h-8 w-8 text-green-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Total Donations</p>
            <p class="text-2xl font-bold text-gray-900">${kpis.total_donations.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <Target class="h-8 w-8 text-blue-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Fund Utilization Rate</p>
            <p class="text-2xl font-bold text-gray-900">{kpis.utilization_rate}%</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <Users class="h-8 w-8 text-purple-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Average Donation</p>
            <p class="text-2xl font-bold text-gray-900">${kpis.avg_donation.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <TrendingUp class="h-8 w-8 text-orange-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Average ROI</p>
            <p class="text-2xl font-bold text-gray-900">{kpis.roi_average}x</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <!-- Donation Funnel -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Donation Conversion Funnel</h3>
        <div class="h-80">
          <canvas id="donationFunnelChart"></canvas>
        </div>
        <div class="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-600">Conversion Rate:</span>
            <span class="font-semibold">3.6%</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Avg. Donation Value:</span>
            <span class="font-semibold">${(kpis.total_donations / 445).toFixed(0)}</span>
          </div>
        </div>
      </div>

      <!-- Partner ROI -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Partner ROI Performance</h3>
        <div class="h-80">
          <canvas id="partnerROIChart"></canvas>
        </div>
        <div class="mt-4 text-sm text-gray-600">
          <p>Higher ROI scores indicate better cost-effectiveness in producing successful outcomes.</p>
        </div>
      </div>
    </div>

    <!-- Monthly Metrics -->
    <div class="bg-white rounded-lg shadow p-6 mb-8">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Monthly Financial Trends</h3>
      <div class="h-80">
        <canvas id="monthlyMetricsChart"></canvas>
      </div>
      <div class="mt-4 grid grid-cols-3 gap-4 text-sm">
        <div class="text-center">
          <p class="text-gray-600">Average Monthly Net</p>
          <p class="text-xl font-bold text-green-600">${(monthlyMetrics.reduce((sum, m) => sum + m.net, 0) / monthlyMetrics.length).toLocaleString()}</p>
        </div>
        <div class="text-center">
          <p class="text-gray-600">Growth Rate</p>
          <p class="text-xl font-bold text-blue-600">+12.3%</p>
        </div>
        <div class="text-center">
          <p class="text-gray-600">Fund Efficiency</p>
          <p class="text-xl font-bold text-purple-600">87.2%</p>
        </div>
      </div>
    </div>

    <!-- Partner ROI Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">Partner Facility ROI Analysis</h3>
        <p class="mt-1 text-sm text-gray-600">Detailed performance metrics by partner facility</p>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Partner Facility
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Funding
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Success Rate
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cost per Success
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ROI Score
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Avg Stay
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employed Graduates
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            {#each partnerROI as partner}
              <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {partner.partner_name}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${partner.total_funding.toLocaleString()}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span class={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    partner.success_rate >= 80 ? 'bg-green-100 text-green-800' :
                    partner.success_rate >= 70 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {partner.success_rate}%
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${partner.cost_per_success.toLocaleString()}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span class={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    partner.roi_score >= 5 ? 'bg-green-100 text-green-800' :
                    partner.roi_score >= 4 ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {partner.roi_score}x
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {partner.avg_stay_duration} days
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {partner.graduates_employed}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Utilization Alerts -->
    <div class="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <AlertTriangle class="h-5 w-5 text-yellow-400" />
        </div>
        <div class="ml-3">
          <p class="text-sm text-yellow-700">
            <strong>Utilization Alert:</strong> Hope Recovery facility showing below-average utilization (71.8% success rate). 
            Consider reviewing program structure and support services.
          </p>
        </div>
      </div>
    </div>
  </div>
</div>