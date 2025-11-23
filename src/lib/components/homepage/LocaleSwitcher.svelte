<script lang="ts">
  import type { HomepageLocale } from '$lib/content/homepage'

  type LocaleOption = {
    label: string
    value: HomepageLocale
    description: string
  }

  export let currentLocale: HomepageLocale | string = 'en'
  export let variant: 'dark' | 'light' = 'dark'
  export let formAction = '/'

  const locales: LocaleOption[] = [
    { label: 'EN', value: 'en', description: 'Switch to English' },
    { label: 'ES', value: 'es', description: 'Cambiar a español' }
  ]
  
  const variantStyles = {
    dark: {
      container: 'rounded-full border border-white/20 bg-white/5 backdrop-blur px-1 py-1 shadow-lg shadow-black/20',
      active: 'bg-white text-brand-night shadow-inner',
      inactive: 'text-white/80 hover:text-white'
    },
    light: {
      container:
        'rounded-full border border-[var(--surface-border)] bg-white px-1 py-0.5 shadow-sm shadow-black/5 text-[var(--color-charcoal)]',
      active: 'bg-[var(--color-forest-green)] text-white shadow-inner',
      inactive: 'text-[var(--color-charcoal)] hover:text-[var(--color-forest-green)]'
    }
  } as const

  const baseButtonClass =
    'px-4 py-1.5 text-xs font-semibold tracking-[0.28em] uppercase rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-emerald min-h-[36px]'

  $: styles = variantStyles[variant] ?? variantStyles.dark
</script>

<form method="GET" action={formAction} aria-labelledby="locale-switcher-label" class="inline-flex">
  <span id="locale-switcher-label" class="sr-only">Select a language</span>
  <div class={`inline-flex ${styles.container}`}>
    {#each locales as option}
      <button
        type="submit"
        name="lang"
        value={option.value}
        class={`${baseButtonClass} ${currentLocale === option.value ? styles.active : styles.inactive}`}
        aria-pressed={currentLocale === option.value}
        aria-label={option.description}
        title={option.description}
      >
        {option.label}
      </button>
    {/each}
  </div>
</form>
