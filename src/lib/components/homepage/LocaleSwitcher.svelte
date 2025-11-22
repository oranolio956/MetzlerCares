<script lang="ts">
  import type { HomepageLocale } from '$lib/content/homepage'

  type LocaleOption = {
    label: string
    value: HomepageLocale
    description: string
  }

  export let currentLocale: HomepageLocale | string = 'en'

  const locales: LocaleOption[] = [
    { label: 'EN', value: 'en', description: 'Switch to English' },
    { label: 'ES', value: 'es', description: 'Cambiar a español' }
  ]
</script>

<form method="GET" action="/" aria-labelledby="locale-switcher-label" class="inline-flex">
  <span id="locale-switcher-label" class="sr-only">Select a language</span>
  <div class="inline-flex rounded-full border border-white/20 bg-white/5 backdrop-blur px-1 py-1 shadow-lg shadow-black/20">
    {#each locales as option}
      <button
        type="submit"
        name="lang"
        value={option.value}
        class={`px-4 py-1.5 text-xs font-semibold tracking-[0.28em] uppercase rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-emerald ${
          currentLocale === option.value
            ? 'bg-white text-brand-night shadow-inner'
            : 'text-brand-soft hover:text-white'
        }`}
        aria-pressed={currentLocale === option.value}
        aria-label={option.description}
        title={option.description}
      >
        {option.label}
      </button>
    {/each}
  </div>
</form>
