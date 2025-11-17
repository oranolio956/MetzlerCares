<script lang="ts">
  import { onMount } from 'svelte'
  type ConsentPrefs = { analytics: boolean; marketing: boolean }
  const EU_LANGS = [
    'bg','cs','da','de','el','en-IE','es','et','fi','fr','ga','hr','hu','it','lt','lv','mt','nl','pl','pt','ro','sk','sl','sv'
  ]
  let open = $state(false)
  let prefs = $state<ConsentPrefs>({ analytics: false, marketing: false })
  let dialogContainer: HTMLDivElement | null = $state(null)
  function save() {
    const v = JSON.stringify(prefs)
    localStorage.setItem('cmp-consent', v)
    document.cookie = `cmp-consent=${encodeURIComponent(v)}; Path=/; SameSite=Lax` + (location.protocol === 'https:' ? '; Secure' : '')
    open = false
  }
  function acceptAll() {
    prefs.analytics = true
    prefs.marketing = true
    save()
  }
  function rejectNonEssential() {
    prefs.analytics = false
    prefs.marketing = false
    save()
  }
  function load() {
    const raw = localStorage.getItem('cmp-consent')
    if (raw) {
      try { prefs = JSON.parse(raw) } catch {}
      return true
    }
    return false
  }
  function shouldShow() {
    const lang = navigator.language || 'en-US'
    const base = lang.split('-')[0]
    const isEU = EU_LANGS.includes(lang) || EU_LANGS.includes(base)
    return isEU
  }
  onMount(() => {
    const has = load()
    if (!has && shouldShow()) open = true
    const handler = () => { open = true }
    window.addEventListener('cmp:open', handler)
    
    // Handle Escape key to close dialog
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) {
        save()
      }
    }

    document.addEventListener('keydown', handleEscape)
    
    // Focus management when dialog opens
    $effect(() => {
      if (open && dialogContainer) {
        setTimeout(() => {
          const firstButton = dialogContainer.querySelector('button') as HTMLButtonElement
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
</script>

{#if open}
  <div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40">
    <div
      bind:this={dialogContainer}
      role="dialog"
      aria-modal="true"
      aria-label="Cookie preferences"
      class="bg-soft-white w-full sm:max-w-lg mx-auto p-6 border border-sage-300 shadow-soft"
    >
      <h2 class="text-lg font-semibold text-deep-navy-900 mb-4">Cookie Preferences</h2>
      <p class="text-deep-navy-700 mb-4">Control how we use cookies to improve your experience.</p>
      <form class="space-y-4">
        <div class="flex items-start gap-3">
          <input id="analytics" type="checkbox" bind:checked={prefs.analytics} class="w-4 h-4 border-sage-400 focus:ring-sage-600" />
          <label for="analytics" class="text-deep-navy-800">Allow analytics cookies</label>
        </div>
        <div class="flex items-start gap-3">
          <input id="marketing" type="checkbox" bind:checked={prefs.marketing} class="w-4 h-4 border-sage-400 focus:ring-sage-600" />
          <label for="marketing" class="text-deep-navy-800">Allow marketing cookies</label>
        </div>
      </form>
      <div class="mt-6 flex flex-col sm:flex-row gap-3">
        <button class="btn-primary" onclick={acceptAll}>Accept all</button>
        <button class="btn-secondary" onclick={rejectNonEssential}>Reject non-essential</button>
        <button class="btn-secondary-outline" onclick={save}>Save preferences</button>
      </div>
      <div class="mt-4 text-sm">
        <a href="/cookie-policy" class="underline decoration-sage-600">Learn more</a>
      </div>
    </div>
  </div>
{/if}