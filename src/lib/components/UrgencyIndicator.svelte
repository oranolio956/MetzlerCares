<script lang="ts">
  import { onMount, onDestroy, createEventDispatcher } from 'svelte'
  import { fade, scale } from 'svelte/transition'

  export let facilityId: string
  export let urgencyLevel: number = 3
  export let message: string = ''
  export let showCountdown: boolean = true
  export let autoRefresh: boolean = true
  export let refreshInterval: number = 30000 // 30 seconds

  let bedData: any = null
  let isLoading = true
  let error = ''
  let timeRemaining = 0
  let countdownInterval: number
  let refreshTimer: number

  const urgencyColors: Record<number, string> = {
    1: 'bg-gray-100 border-gray-300 text-gray-700',
    2: 'bg-yellow-50 border-yellow-300 text-yellow-800',
    3: 'bg-orange-50 border-orange-300 text-orange-800',
    4: 'bg-red-50 border-red-300 text-red-800',
    5: 'bg-red-100 border-red-400 text-red-900'
  }

  const urgencyIcons: Record<number, string> = {
    1: '🕐',
    2: '⚠️',
    3: '🔥',
    4: '⏰',
    5: '🚨'
  }
  const dispatch = createEventDispatcher()

  onMount(async () => {
    await fetchBedAvailability()

    if (autoRefresh) {
      refreshTimer = window.setInterval(fetchBedAvailability, refreshInterval)
    }

    // Start countdown if applicable
    if (showCountdown && urgencyLevel >= 4) {
      startCountdown()
    }
  })

  onDestroy(() => {
    if (countdownInterval) clearInterval(countdownInterval)
    if (refreshTimer) clearInterval(refreshTimer)
  })

  async function fetchBedAvailability() {
    try {
      isLoading = true
      error = ''

      const response = await fetch(`/api/facilities/${facilityId}/availability`)

      if (!response.ok) {
        throw new Error('Failed to fetch availability')
      }

      bedData = await response.json()

      // Track urgency impression
      trackUrgencyImpression()
    } catch (err) {
      error = 'Unable to load availability data'
      console.error('Error fetching bed availability:', err)
    } finally {
      isLoading = false
    }
  }

  function startCountdown() {
    // Set countdown to next hour or 30 minutes for high urgency
    const now = new Date()
    const targetTime = new Date(now.getTime() + (urgencyLevel === 5 ? 30 * 60 * 1000 : 60 * 60 * 1000))
    timeRemaining = targetTime.getTime() - now.getTime()

    countdownInterval = window.setInterval(() => {
      timeRemaining -= 1000

      if (timeRemaining <= 0) {
        clearInterval(countdownInterval)
        // Refresh data when countdown ends
        fetchBedAvailability()
      }
    }, 1000)
  }

  function formatTimeRemaining(ms: number): string {
    if (ms <= 0) return 'Expired'

    const minutes = Math.floor(ms / (1000 * 60))
    const seconds = Math.floor((ms % (1000 * 60)) / 1000)

    if (minutes > 0) {
      return `${minutes}m ${seconds}s`
    }
    return `${seconds}s`
  }

  function getUrgencyMessage(): string {
    if (message) return message

    if (bedData) {
      const { available_beds, total_beds } = bedData
      const percentage = (available_beds / total_beds) * 100

      if (available_beds <= 1) {
        return `Only ${available_beds} bed${available_beds === 1 ? '' : 's'} available - Call now!`
      } else if (available_beds <= 3) {
        return `${available_beds} beds available - Limited availability`
      } else if (percentage < 20) {
        return `Filling up fast - ${available_beds} of ${total_beds} beds available`
      } else {
        return `${available_beds} beds available`
      }
    }

    return 'Checking availability...'
  }

  function trackUrgencyImpression() {
    // Track analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      ;(window as any).gtag('event', 'urgency_indicator_impression', {
        facility_id: facilityId,
        urgency_level: urgencyLevel,
        available_beds: bedData?.available_beds || 0,
        message: getUrgencyMessage()
      })
    }

    // Custom analytics
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_type: 'urgency_indicator_impression',
        metadata: {
          facility_id: facilityId,
          urgency_level: urgencyLevel,
          available_beds: bedData?.available_beds || 0
        }
      })
    }).catch(console.error)
  }

  function handleCtaClick() {
    // Track CTA click
    trackCtaClick()

    // Dispatch event for parent component
    dispatch('urgencyCtaClick', {
      facilityId,
      urgencyLevel,
      availableBeds: bedData?.available_beds || 0
    })
  }

  function trackCtaClick() {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      ;(window as any).gtag('event', 'urgency_cta_click', {
        facility_id: facilityId,
        urgency_level: urgencyLevel,
        available_beds: bedData?.available_beds || 0
      })
    }

    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_type: 'urgency_cta_click',
        metadata: {
          facility_id: facilityId,
          urgency_level: urgencyLevel
        }
      })
    }).catch(console.error)
  }
</script>

<div class="urgency-indicator {urgencyColors[urgencyLevel]} border-2 rounded-lg p-4 mb-4 transition-all duration-300">
  {#if isLoading}
    <div class="flex items-center justify-center py-2">
      <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
      <span class="text-sm">Checking availability...</span>
    </div>
  {:else if error}
    <div class="text-center text-sm text-red-600">
      {error}
    </div>
  {:else}
    <div class="flex items-center justify-between">
      <div class="flex items-center flex-1">
        <span class="text-2xl mr-3">{urgencyIcons[urgencyLevel]}</span>
        <div class="flex-1">
          <div class="flex items-center mb-1">
            <span class="font-semibold text-sm uppercase tracking-wide">
              {urgencyLevel === 5
                ? 'URGENT'
                : urgencyLevel === 4
                ? 'HIGH DEMAND'
                : urgencyLevel === 3
                ? 'LIMITED'
                : 'AVAILABLE'}
            </span>
            {#if showCountdown && timeRemaining > 0}
              <span class="ml-2 text-xs font-mono bg-black bg-opacity-10 px-2 py-1 rounded">
                {formatTimeRemaining(timeRemaining)}
              </span>
            {/if}
          </div>
          <p class="text-sm font-medium">{getUrgencyMessage()}</p>
          {#if bedData && urgencyLevel >= 4}
            <div class="mt-2">
              <div class="w-full bg-black bg-opacity-10 rounded-full h-1.5">
                <div
                  class="bg-current h-1.5 rounded-full transition-all duration-500"
                  style="width: {(bedData.available_beds / bedData.total_beds) * 100}%"
                />
              </div>
            </div>
          {/if}
        </div>
      </div>

      <button
        on:click={handleCtaClick}
        class="ml-4 px-4 py-2 text-sm font-medium bg-white bg-opacity-50 hover:bg-opacity-70 rounded-md transition-all duration-200 transform hover:scale-105"
      >
        Call Now
      </button>
    </div>

    {#if urgencyLevel >= 4}
      <div class="mt-3 pt-3 border-t border-current border-opacity-20">
        <div class="flex items-center text-xs">
          <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clip-rule="evenodd"
            />
          </svg>
          <span>Same-day admission may be available</span>
        </div>
      </div>
    {/if}
  {/if}
</div>
const dispatch = createEventDispatcher(); const dispatch = createEventDispatcher(); const dispatch = createEventDispatcher();

<style>
  .urgency-indicator {
    animation: slideIn 0.3s ease-out;
    position: relative;
    overflow: hidden;
  }

  .urgency-indicator::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    animation: shimmer 2s infinite;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes shimmer {
    0% {
      left: -100%;
    }
    100% {
      left: 100%;
    }
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
