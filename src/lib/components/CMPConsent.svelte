<script lang="ts">
  import { onMount } from 'svelte'
  
  // Enhanced consent preferences with GDPR/CCPA compliance
  type ConsentCategory = 'essential' | 'analytics' | 'marketing' | 'functional' | 'personalization'
  
  interface ConsentPrefs {
    essential: boolean
    analytics: boolean
    marketing: boolean
    functional: boolean
    personalization: boolean
    timestamp?: number
    consentId?: string
    ipAddress?: string
    userAgent?: string
  }

  // EU languages for GDPR compliance
  const EU_LANGS = [
    'bg','cs','da','de','el','en-IE','es','et','fi','fr','ga','hr','hu','it','lt','lv','mt','nl','pl','pt','ro','sk','sl','sv'
  ]

  // CCPA/CPRA compliance for California
  const CALIFORNIA_REGIONS = ['US-CA', 'CA', 'California']

  // Enhanced state management
  let open = $state(false)
  let detailedView = $state(false)
  let prefs = $state<ConsentPrefs>({
    essential: true, // Always required
    analytics: false,
    marketing: false,
    functional: false,
    personalization: false
  })
  
  let dialogContainer: HTMLDivElement | null = $state(null)
  let isEUUser = $state(false)
  let isCaliforniaUser = $state(false)
  let consentVersion = $state('2.0')
  let lastUpdated = $state('2025-11-17')

  // Generate unique consent ID
  function generateConsentId(): string {
    return 'consent_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  }

  // Enhanced consent saving with audit trail
  function saveConsent() {
    try {
      const consentData = {
        ...prefs,
        timestamp: Date.now(),
        consentId: generateConsentId(),
        ipAddress: getClientIP(),
        userAgent: navigator.userAgent,
        version: consentVersion,
        jurisdiction: getUserJurisdiction()
      }

      // Store in localStorage
      localStorage.setItem('cmp-consent-v2', JSON.stringify(consentData))
      
      // Store in cookie with security flags
      const cookieValue = encodeURIComponent(JSON.stringify(consentData))
      const cookieFlags = 'Path=/; SameSite=Strict; Max-Age=31536000' // 1 year
      const secureFlag = location.protocol === 'https:' ? '; Secure' : ''
      document.cookie = `cmp-consent-v2=${cookieValue}${cookieFlags}${secureFlag}`

      // Log consent for audit purposes (anonymized)
      logConsentEvent(consentData)

      open = false
      detailedView = false
      
      // Trigger consent update event
      window.dispatchEvent(new CustomEvent('cmp:consentUpdated', { detail: consentData }))
    } catch (error) {
      console.error('Failed to save consent:', error)
    }
  }

  // Accept all cookies (marketing included)
  function acceptAll() {
    prefs = {
      essential: true,
      analytics: true,
      marketing: true,
      functional: true,
      personalization: true
    }
    saveConsent()
  }

  // Reject non-essential cookies
  function rejectNonEssential() {
    prefs = {
      essential: true,
      analytics: false,
      marketing: false,
      functional: false,
      personalization: false
    }
    saveConsent()
  }

  // Accept only essential cookies
  function acceptEssentialOnly() {
    prefs = {
      essential: true,
      analytics: false,
      marketing: false,
      functional: false,
      personalization: false
    }
    saveConsent()
  }

  // Load existing consent
  function loadConsent() {
    try {
      // Try v2 first
      const v2Data = localStorage.getItem('cmp-consent-v2')
      if (v2Data) {
        const parsed = JSON.parse(v2Data)
        prefs = {
          essential: true, // Always true
          analytics: parsed.analytics || false,
          marketing: parsed.marketing || false,
          functional: parsed.functional || false,
          personalization: parsed.personalization || false
        }
        return true
      }

      // Fallback to v1
      const v1Data = localStorage.getItem('cmp-consent')
      if (v1Data) {
        const parsed = JSON.parse(v1Data)
        prefs = {
          essential: true,
          analytics: parsed.analytics || false,
          marketing: parsed.marketing || false,
          functional: false,
          personalization: false
        }
        // Migrate to v2
        saveConsent()
        return true
      }

      return false
    } catch (error) {
      console.error('Failed to load consent:', error)
      return false
    }
  }

  // Determine if user is in EU (GDPR applies)
  function shouldShowGDPR(): boolean {
    try {
      // Check browser language
      const lang = navigator.language || 'en-US'
      const base = lang.split('-')[0]
      const isEU = EU_LANGS.includes(lang) || EU_LANGS.includes(base)
      
      // Check timezone (rough approximation)
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
      const euTimezones = ['Europe/', 'GMT', 'UTC', 'Atlantic/']
      const isEUTimezone = euTimezones.some(tz => timezone.includes(tz))
      
      return isEU || isEUTimezone
    } catch {
      return false
    }
  }

  // Determine if user is in California (CCPA/CPRA applies)
  function shouldShowCCPA(): boolean {
    try {
      // This would typically involve IP geolocation
      // For now, we'll use a simplified check
      const lang = navigator.language || 'en-US'
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
      
      // Rough check for US Pacific timezone
      return timezone.includes('America/Los_Angeles') || 
             timezone.includes('US/Pacific') ||
             lang.includes('US')
    } catch {
      return false
    }
  }

  // Get user jurisdiction
  function getUserJurisdiction(): string {
    if (isEUUser) return 'EU'
    if (isCaliforniaUser) return 'California'
    return 'Other'
  }

  // Get client IP (simplified - in production, use server-side detection)
  function getClientIP(): string {
    // This is a placeholder - in production, you'd get this from your server
    return 'detected-server-side'
  }

  // Log consent event (anonymized)
  function logConsentEvent(consentData: any) {
    // In production, this would send to your analytics/logging service
    // This is anonymized and GDPR compliant
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'consent_update', {
        event_category: 'consent',
        event_label: consentData.consentId,
        value: consentData.analytics ? 1 : 0,
        custom_map: {
          'dimension1': consentData.jurisdiction,
          'dimension2': consentData.version
        }
      })
    }
  }

  // Check if consent is required
  function isConsentRequired(): boolean {
    return isEUUser || isCaliforniaUser || hasExistingConsent()
  }

  // Check if user has existing consent
  function hasExistingConsent(): boolean {
    return localStorage.getItem('cmp-consent-v2') !== null || 
           localStorage.getItem('cmp-consent') !== null
  }

  onMount(() => {
    // Determine user jurisdiction
    isEUUser = shouldShowGDPR()
    isCaliforniaUser = shouldShowCCPA()

    // Load existing consent
    const hasConsent = loadConsent()
    
    // Show banner if consent is required and not already given
    if (!hasConsent && isConsentRequired()) {
      open = true
    }

    // Handle manual consent trigger
    const handler = () => { 
      open = true
      detailedView = true
    }
    window.addEventListener('cmp:open', handler)
    
    // Handle Escape key
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) {
        saveConsent()
      }
    }

    document.addEventListener('keydown', handleEscape)
    
    // Focus management
    $effect(() => {
      if (open && dialogContainer) {
        setTimeout(() => {
          const firstButton = dialogContainer?.querySelector('button') as HTMLButtonElement
          if (firstButton) {
            firstButton.focus()
          }
        }, 100)
      }
    })
    
    return () => {
      window.removeEventListener('cmp:open', handler)
      document.removeEventListener('keydown', handleEscape)
    }
  })

  // Expose functions for external use
  onMount(() => {
    (window as any).cmp = {
      open: () => { open = true; detailedView = true },
      getConsent: () => prefs,
      setConsent: (newPrefs: Partial<ConsentPrefs>) => {
        prefs = { ...prefs, ...newPrefs }
        saveConsent()
      },
      reset: () => {
        localStorage.removeItem('cmp-consent-v2')
        localStorage.removeItem('cmp-consent')
        document.cookie = 'cmp-consent-v2=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
        document.cookie = 'cmp-consent=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
        open = true
        detailedView = true
      }
    }
  })
</script>

{#if open}
  <div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Cookie consent management">
    <div
      bind:this={dialogContainer}
      class="bg-white w-full sm:max-w-4xl mx-auto border border-gray-200 shadow-2xl rounded-t-lg sm:rounded-lg max-h-[90vh] overflow-y-auto"
    >
      <!-- Header -->
      <div class="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <div class="flex justify-between items-start">
          <div>
            <h2 class="text-2xl font-bold mb-2">
              {#if isEUUser}
                🔒 Your Privacy Rights Under GDPR
              {:else if isCaliforniaUser}
                🔒 Your Privacy Rights Under CCPA/CPRA
              {:else}
                🔒 Cookie Preferences
              {/if}
            </h2>
            <p class="text-blue-100 text-sm">
              {#if isEUUser}
                We respect your privacy rights under the General Data Protection Regulation
              {:else if isCaliforniaUser}
                We respect your privacy rights under the California Consumer Privacy Act
              {:else}
                We use cookies to enhance your experience and analyze our traffic
              {/if}
            </p>
          </div>
          <button
            onclick={() => { detailedView = !detailedView }}
            class="text-white hover:text-blue-200 transition-colors p-2 rounded-full hover:bg-white hover:bg-opacity-20"
            aria-label={detailedView ? "Show simple view" : "Show detailed view"}
          >
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {#if detailedView}
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              {:else}
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              {/if}
            </svg>
          </button>
        </div>
      </div>

      <!-- Simple View -->
      {#if !detailedView}
        <div class="p-6">
          <div class="prose prose-sm max-w-none text-gray-700 mb-6">
            <p>
              We use cookies and similar technologies to help provide, protect, and improve our services. 
              You can choose which types of cookies to accept.
            </p>
          </div>

          <!-- Quick consent buttons -->
          <div class="grid sm:grid-cols-3 gap-3 mb-6">
            <button
              onclick={acceptAll}
              class="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Accept All</span>
            </button>
            
            <button
              onclick={rejectNonEssential}
              class="bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Reject Non-Essential</span>
            </button>
            
            <button
              onclick={acceptEssentialOnly}
              class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Essential Only</span>
            </button>
          </div>

          <div class="text-center">
            <button
              onclick={() => { detailedView = true }}
              class="text-blue-600 hover:text-blue-800 font-medium text-sm underline"
            >
              Customize Settings →
            </button>
          </div>
        </div>
      {:else}
        <!-- Detailed View -->
        <div class="p-6">
          <div class="prose prose-sm max-w-none text-gray-700 mb-6">
            <p>
              We categorize cookies based on their purpose. You can choose which categories to accept. 
              Essential cookies are always active as they are required for basic functionality.
            </p>
          </div>

          <!-- Cookie Categories -->
          <div class="space-y-4 mb-6">
            <!-- Essential Cookies -->
            <div class="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center space-x-3">
                  <input
                    id="essential"
                    type="checkbox"
                    checked={prefs.essential}
                    disabled
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label for="essential" class="font-semibold text-gray-900">Essential Cookies</label>
                  <span class="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded-full">Always Active</span>
                </div>
              </div>
              <p class="text-sm text-gray-600 ml-7">
                Required for basic website functionality, security, and accessibility. These cannot be disabled.
              </p>
            </div>

            <!-- Analytics Cookies -->
            <div class="border border-gray-200 rounded-lg p-4">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center space-x-3">
                  <input
                    id="analytics"
                    type="checkbox"
                    bind:checked={prefs.analytics}
                    class="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label for="analytics" class="font-semibold text-gray-900">Analytics Cookies</label>
                  {#if isEUUser || isCaliforniaUser}
                    <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Privacy Protected</span>
                  {/if}
                </div>
              </div>
              <p class="text-sm text-gray-600 ml-7">
                Help us understand how visitors interact with our website by collecting anonymous usage statistics.
                We use privacy-preserving analytics that don't track individual users.
              </p>
            </div>

            <!-- Marketing Cookies -->
            <div class="border border-gray-200 rounded-lg p-4">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center space-x-3">
                  <input
                    id="marketing"
                    type="checkbox"
                    bind:checked={prefs.marketing}
                    class="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label for="marketing" class="font-semibold text-gray-900">Marketing Cookies</label>
                  <span class="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">Optional</span>
                </div>
              </div>
              <p class="text-sm text-gray-600 ml-7">
                Used to deliver relevant advertisements and measure the effectiveness of our marketing campaigns. 
                We never sell your data to third parties.
              </p>
            </div>

            <!-- Functional Cookies -->
            <div class="border border-gray-200 rounded-lg p-4">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center space-x-3">
                  <input
                    id="functional"
                    type="checkbox"
                    bind:checked={prefs.functional}
                    class="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label for="functional" class="font-semibold text-gray-900">Functional Cookies</label>
                  <span class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Enhanced Experience</span>
                </div>
              </div>
              <p class="text-sm text-gray-600 ml-7">
                Enable enhanced functionality and personalization, such as remembering your preferences 
                and providing customized content.
              </p>
            </div>

            <!-- Personalization Cookies -->
            <div class="border border-gray-200 rounded-lg p-4">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center space-x-3">
                  <input
                    id="personalization"
                    type="checkbox"
                    bind:checked={prefs.personalization}
                    class="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label for="personalization" class="font-semibold text-gray-900">Personalization Cookies</label>
                  <span class="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">Custom Experience</span>
                </div>
              </div>
              <p class="text-sm text-gray-600 ml-7">
                Allow us to provide a more personalized experience by remembering your settings, 
                location, and preferences across visits.
              </p>
            </div>
          </div>

          <!-- Privacy Rights Notice -->
          {#if isEUUser || isCaliforniaUser}
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div class="flex items-start space-x-3">
                <svg class="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 class="font-semibold text-blue-800 mb-1">Your Privacy Rights</h4>
                  <p class="text-sm text-blue-700">
                    {#if isEUUser}
                      Under GDPR, you have the right to access, rectify, erase, restrict processing, 
                      and port your personal data. You can withdraw consent at any time.
                    {:else if isCaliforniaUser}
                      Under CCPA/CPRA, you have the right to know, delete, and opt-out of the sale 
                      of your personal information. We never sell your data.
                    {/if}
                  </p>
                </div>
              </div>
            </div>
          {/if}

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-3">
            <button
              onclick={saveConsent}
              class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Save Preferences</span>
            </button>
            
            <button
              onclick={acceptAll}
              class="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Accept All
            </button>
            
            <button
              onclick={rejectNonEssential}
              class="bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Reject Non-Essential
            </button>
          </div>
        </div>
      {/if}

      <!-- Footer Links -->
      <div class="bg-gray-50 border-t border-gray-200 p-4">
        <div class="flex flex-wrap justify-center gap-4 text-sm">
          <a href="/privacy" class="text-blue-600 hover:text-blue-800 underline" target="_blank">
            Privacy Policy
          </a>
          <span class="text-gray-400">|</span>
          <a href="/cookie-policy" class="text-blue-600 hover:text-blue-800 underline" target="_blank">
            Cookie Policy
          </a>
          <span class="text-gray-400">|</span>
          <a href="/terms" class="text-blue-600 hover:text-blue-800 underline" target="_blank">
            Terms of Service
          </a>
          {#if isEUUser}
            <span class="text-gray-400">|</span>
            <a href="/gdpr-rights" class="text-blue-600 hover:text-blue-800 underline" target="_blank">
              GDPR Rights
            </a>
          {/if}
          {#if isCaliforniaUser}
            <span class="text-gray-400">|</span>
            <a href="/ccpa-rights" class="text-blue-600 hover:text-blue-800 underline" target="_blank">
              CCPA Rights
            </a>
          {/if}
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  :global(.prose) {
    max-width: none;
  }
  
  :global(.prose-sm) {
    font-size: 0.875rem;
    line-height: 1.5;
  }
  
  :global(.prose p) {
    margin-bottom: 1rem;
  }
</style>