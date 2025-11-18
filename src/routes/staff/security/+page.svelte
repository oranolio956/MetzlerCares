<script lang="ts">
  import { onMount } from 'svelte'
  import { supabase } from '$lib/utils/supabase'
  import { getSecurityDashboard } from '$lib/utils/security-monitoring'
  import type { SecurityEvent, SecurityAlert } from '$lib/utils/security-monitoring'

  let loading = true
  let activeTab = 'overview'
  let securityData: {
    recentEvents: SecurityEvent[]
    activeAlerts: SecurityAlert[]
    securityMetrics: Record<string, number>
    complianceStatus: Record<string, any>
  } = {
    recentEvents: [],
    activeAlerts: [],
    securityMetrics: {},
    complianceStatus: {}
  }

  // Alert management
  let selectedAlert: SecurityAlert | null = null
  let showAlertModal = false
  let resolutionNotes = ''

  onMount(async () => {
    await loadSecurityData()
  })

  async function loadSecurityData() {
    try {
      loading = true
      securityData = await getSecurityDashboard()
    } catch (error) {
      console.error('Error loading security data:', error)
    } finally {
      loading = false
    }
  }

  async function resolveAlert(alertId: string, resolution: string) {
    try {
      const { error } = await supabase
        .from('security_alerts')
        .update({
          status: 'resolved',
          resolution: resolution,
          resolved_at: new Date().toISOString(),
          resolved_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', alertId)

      if (error) throw error

      // Reload data
      await loadSecurityData()
      showAlertModal = false
      selectedAlert = null
      resolutionNotes = ''

      alert('Alert resolved successfully')
    } catch (error) {
      console.error('Error resolving alert:', error)
      alert('Failed to resolve alert')
    }
  }

  async function acknowledgeAlert(alertId: string) {
    try {
      const { error } = await supabase
        .from('security_alerts')
        .update({
          status: 'acknowledged'
        })
        .eq('id', alertId)

      if (error) throw error

      await loadSecurityData()
      alert('Alert acknowledged')
    } catch (error) {
      console.error('Error acknowledging alert:', error)
      alert('Failed to acknowledge alert')
    }
  }

  function getSeverityColor(severity: string) {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-100'
      case 'high':
        return 'text-orange-600 bg-orange-100'
      case 'medium':
        return 'text-yellow-600 bg-yellow-100'
      case 'low':
        return 'text-blue-600 bg-blue-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  function getEventTypeIcon(eventType: string) {
    switch (eventType) {
      case 'successful_login':
        return '✅'
      case 'failed_login':
        return '❌'
      case 'account_lockout':
        return '🔒'
      case 'mfa_success':
        return '🔐'
      case 'mfa_failure':
        return '🚫'
      case 'phi_access':
        return '📋'
      case 'suspicious_activity':
        return '⚠️'
      case 'session_timeout':
        return '⏰'
      case 'encryption_failure':
        return '🔓'
      default:
        return '📝'
    }
  }

  function formatEventType(eventType: string) {
    return eventType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }
</script>

<svelte:head>
  <title>Security Monitoring - Metzler Foundations</title>
  <meta name="description" content="Monitor security events, alerts, and compliance status for HIPAA compliance." />
</svelte:head>

<div class="min-h-screen bg-cream text-navy">
  <!-- Header -->
  <header class="bg-white border-b border-navy border-opacity-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-serif font-medium text-navy">Security Monitoring</h1>
          <p class="text-sm text-navy text-opacity-60">Monitor threats and ensure HIPAA compliance</p>
        </div>
        <button on:click={loadSecurityData} class="btn-secondary text-sm" disabled={loading}>
          {#if loading}
            <div class="flex items-center">
              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-navy mr-2"></div>
              Loading...
            </div>
          {:else}
            Refresh
          {/if}
        </button>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {#if loading && !securityData.recentEvents.length}
      <div class="flex justify-center items-center py-16">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-navy"></div>
        <span class="ml-3 text-navy">Loading security data...</span>
      </div>
    {:else}
      <!-- Tab Navigation -->
      <div class="mb-8">
        <nav class="flex space-x-8 border-b border-navy border-opacity-10">
          <button
            class="py-2 px-1 border-b-2 font-medium text-sm {activeTab === 'overview'
              ? 'border-olive text-olive'
              : 'border-transparent text-navy text-opacity-60 hover:text-navy'}"
            on:click={() => (activeTab = 'overview')}
          >
            Overview
          </button>
          <button
            class="py-2 px-1 border-b-2 font-medium text-sm {activeTab === 'alerts'
              ? 'border-olive text-olive'
              : 'border-transparent text-navy text-opacity-60 hover:text-navy'}"
            on:click={() => (activeTab = 'alerts')}
          >
            Active Alerts ({securityData.activeAlerts.length})
          </button>
          <button
            class="py-2 px-1 border-b-2 font-medium text-sm {activeTab === 'events'
              ? 'border-olive text-olive'
              : 'border-transparent text-navy text-opacity-60 hover:text-navy'}"
            on:click={() => (activeTab = 'events')}
          >
            Recent Events
          </button>
          <button
            class="py-2 px-1 border-b-2 font-medium text-sm {activeTab === 'compliance'
              ? 'border-olive text-olive'
              : 'border-transparent text-navy text-opacity-60 hover:text-navy'}"
            on:click={() => (activeTab = 'compliance')}
          >
            Compliance
          </button>
        </nav>
      </div>

      <!-- Tab Content -->
      {#if activeTab === 'overview'}
        <!-- Security Overview Dashboard -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <!-- Critical Alerts -->
          <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-6">
            <div class="flex items-center">
              <div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-navy text-opacity-60">Critical Alerts</p>
                <p class="text-2xl font-bold text-navy">
                  {securityData.activeAlerts.filter(a => a.severity === 'critical').length}
                </p>
              </div>
            </div>
          </div>

          <!-- Failed Logins (24h) -->
          <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-6">
            <div class="flex items-center">
              <div class="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-navy text-opacity-60">Failed Logins (24h)</p>
                <p class="text-2xl font-bold text-navy">{securityData.securityMetrics.failed_logins_24h || 0}</p>
              </div>
            </div>
          </div>

          <!-- PHI Access Events -->
          <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-6">
            <div class="flex items-center">
              <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-navy text-opacity-60">PHI Access (24h)</p>
                <p class="text-2xl font-bold text-navy">{securityData.securityMetrics.phi_access_24h || 0}</p>
              </div>
            </div>
          </div>

          <!-- MFA Enabled Users -->
          <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-6">
            <div class="flex items-center">
              <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-navy text-opacity-60">MFA Enabled</p>
                <p class="text-2xl font-bold text-navy">
                  {securityData.complianceStatus.mfa_enabled_users || 0}/{securityData.complianceStatus.total_users ||
                    0}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Active Alerts Summary -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Critical Alerts -->
          <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-6">
            <h3 class="text-lg font-medium text-navy mb-4">Active Security Alerts</h3>
            {#if securityData.activeAlerts.length === 0}
              <p class="text-navy text-opacity-60 text-center py-8">No active alerts</p>
            {:else}
              <div class="space-y-3">
                {#each securityData.activeAlerts.slice(0, 5) as alert}
                  <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p class="font-medium text-navy text-sm">{alert.ruleName}</p>
                      <p class="text-xs text-navy text-opacity-60">{new Date(alert.timestamp).toLocaleString()}</p>
                    </div>
                    <span class={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(alert.severity)}`}>
                      {alert.severity}
                    </span>
                  </div>
                {/each}
              </div>
            {/if}
          </div>

          <!-- Recent Security Events -->
          <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-6">
            <h3 class="text-lg font-medium text-navy mb-4">Recent Security Events</h3>
            <div class="space-y-3">
              {#each securityData.recentEvents.slice(0, 8) as event}
                <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <span class="text-lg">{getEventTypeIcon(event.eventType)}</span>
                  <div class="flex-1">
                    <p class="font-medium text-navy text-sm">{formatEventType(event.eventType)}</p>
                    <p class="text-xs text-navy text-opacity-60">{new Date(event.timestamp).toLocaleString()}</p>
                  </div>
                  <span class={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(event.severity)}`}>
                    {event.severity}
                  </span>
                </div>
              {/each}
            </div>
          </div>
        </div>
      {:else if activeTab === 'alerts'}
        <!-- Active Alerts Management -->
        <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-6">
          <h3 class="text-lg font-medium text-navy mb-4">Active Security Alerts</h3>

          {#if securityData.activeAlerts.length === 0}
            <div class="text-center py-16">
              <svg class="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h4 class="text-lg font-medium text-navy mb-2">All Clear</h4>
              <p class="text-navy text-opacity-60">No active security alerts at this time</p>
            </div>
          {:else}
            <div class="space-y-4">
              {#each securityData.activeAlerts as alert}
                <div class="border border-navy border-opacity-10 rounded-lg p-4">
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <div class="flex items-center space-x-3 mb-2">
                        <h4 class="font-medium text-navy">{alert.ruleName}</h4>
                        <span class={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(alert.severity)}`}>
                          {alert.severity.toUpperCase()}
                        </span>
                        <span class="text-sm text-navy text-opacity-60">
                          {new Date(alert.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <p class="text-navy text-opacity-80 mb-3">{alert.description}</p>
                      {#if alert.affectedUsers.length > 0}
                        <p class="text-sm text-navy text-opacity-60">
                          Affected Users: {alert.affectedUsers.length}
                        </p>
                      {/if}
                    </div>
                    <div class="flex space-x-2 ml-4">
                      <button on:click={() => acknowledgeAlert(alert.id)} class="btn-secondary text-xs px-3 py-1">
                        Acknowledge
                      </button>
                      <button
                        on:click={() => {
                          selectedAlert = alert
                          showAlertModal = true
                        }}
                        class="btn-primary text-xs px-3 py-1"
                      >
                        Resolve
                      </button>
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          {/if}
        </div>
      {:else if activeTab === 'events'}
        <!-- Security Events Log -->
        <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-6">
          <h3 class="text-lg font-medium text-navy mb-4">Security Events Log (Last 24 Hours)</h3>

          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-navy divide-opacity-10">
              <thead>
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-navy text-opacity-60 uppercase tracking-wider"
                    >Time</th
                  >
                  <th class="px-6 py-3 text-left text-xs font-medium text-navy text-opacity-60 uppercase tracking-wider"
                    >Event</th
                  >
                  <th class="px-6 py-3 text-left text-xs font-medium text-navy text-opacity-60 uppercase tracking-wider"
                    >User</th
                  >
                  <th class="px-6 py-3 text-left text-xs font-medium text-navy text-opacity-60 uppercase tracking-wider"
                    >Severity</th
                  >
                  <th class="px-6 py-3 text-left text-xs font-medium text-navy text-opacity-60 uppercase tracking-wider"
                    >IP Address</th
                  >
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-navy divide-opacity-10">
                {#each securityData.recentEvents as event}
                  <tr>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-navy">
                      {new Date(event.timestamp).toLocaleString()}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-navy">
                      <div class="flex items-center space-x-2">
                        <span>{getEventTypeIcon(event.eventType)}</span>
                        <span>{formatEventType(event.eventType)}</span>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-navy text-opacity-60">
                      {event.userId ? event.userId.substring(0, 8) + '...' : 'System'}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(event.severity)}`}>
                        {event.severity}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-navy text-opacity-60">
                      {event.ipAddress || 'N/A'}
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      {:else if activeTab === 'compliance'}
        <!-- Compliance Status -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- User Compliance -->
          <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-6">
            <h3 class="text-lg font-medium text-navy mb-4">User Compliance Status</h3>
            <div class="space-y-4">
              <div class="flex justify-between items-center">
                <span class="text-navy">Total Users</span>
                <span class="font-medium text-navy">{securityData.complianceStatus.total_users || 0}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-navy">MFA Enabled</span>
                <span class="font-medium text-green-600">{securityData.complianceStatus.mfa_enabled_users || 0}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-navy">HIPAA Trained</span>
                <span class="font-medium text-green-600">{securityData.complianceStatus.hipaa_trained_users || 0}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-navy">Unresolved Alerts</span>
                <span class="font-medium text-red-600">{securityData.complianceStatus.alerts_unresolved || 0}</span>
              </div>
            </div>
          </div>

          <!-- Security Metrics -->
          <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-6">
            <h3 class="text-lg font-medium text-navy mb-4">Security Metrics (24h)</h3>
            <div class="space-y-4">
              <div class="flex justify-between items-center">
                <span class="text-navy">Total Events</span>
                <span class="font-medium text-navy">{securityData.securityMetrics.total_events_24h || 0}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-navy">Failed Logins</span>
                <span class="font-medium text-orange-600">{securityData.securityMetrics.failed_logins_24h || 0}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-navy">PHI Access Events</span>
                <span class="font-medium text-blue-600">{securityData.securityMetrics.phi_access_24h || 0}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-navy">High Severity Events</span>
                <span class="font-medium text-red-600">{securityData.securityMetrics.severity_high || 0}</span>
              </div>
            </div>
          </div>
        </div>
      {/if}
    {/if}
  </main>
</div>

<!-- Alert Resolution Modal -->
{#if showAlertModal && selectedAlert}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg max-w-md w-full p-6">
      <h3 class="text-lg font-medium text-navy mb-4">Resolve Security Alert</h3>

      <div class="mb-4">
        <h4 class="font-medium text-navy mb-2">{selectedAlert.ruleName}</h4>
        <p class="text-sm text-navy text-opacity-70 mb-3">{selectedAlert.description}</p>
        <p class="text-xs text-navy text-opacity-60">
          Triggered: {new Date(selectedAlert.timestamp).toLocaleString()}
        </p>
      </div>

      <div class="mb-4">
        <label for="resolution-notes" class="block text-sm font-medium text-navy mb-2"> Resolution Notes </label>
        <textarea
          id="resolution-notes"
          bind:value={resolutionNotes}
          placeholder="Describe how this alert was resolved..."
          class="form-input w-full h-24 resize-none"
          required
        ></textarea>
      </div>

      <div class="flex space-x-3">
        <button
          on:click={() => {
            showAlertModal = false
            selectedAlert = null
            resolutionNotes = ''
          }}
          class="flex-1 btn-secondary"
        >
          Cancel
        </button>
        <button
          on:click={() => selectedAlert && resolveAlert(selectedAlert.id, resolutionNotes)}
          disabled={!resolutionNotes.trim()}
          class="flex-1 btn-primary disabled:opacity-50"
        >
          Resolve Alert
        </button>
      </div>
    </div>
  </div>
{/if}
