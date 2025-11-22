<script lang="ts">
  import type { OutcomeStat } from '$lib/content/homepage'
  import { trackEvent } from '$lib/utils/analytics'
  import { fly } from 'svelte/transition'

  export let stats: OutcomeStat[] = []
  export let title = 'Every partner gets a telemetry report, not a testimonial.'
  export let description =
    'We quantify field operations in the same units as CFOs, quality teams, and Medicaid reviewers. That means faster approvals, faster reimbursements, and fewer “trust us” decks.'
  export let footnotes: string[] = []

  let openStatLabel: string | null = null

  const toggleTooltip = (stat: OutcomeStat) => {
    const isOpen = openStatLabel === stat.label
    openStatLabel = isOpen ? null : stat.label

    if (!isOpen) {
      trackEvent('outcome_context', {
        stat_label: stat.label,
        stat_source: stat.source,
        has_source_link: Boolean(stat.sourceLink)
      })
    }
  }
</script>

<section class="py-24 relative isolate overflow-hidden">
  <div
    class="absolute inset-0 bg-[var(--surface-night)]/35 [mask-image:linear-gradient(180deg,rgba(255,255,255,0.85),rgba(255,255,255,0))]"
    aria-hidden="true"
  />
  <div
    class="absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,var(--homepage-glow-blue),transparent_60%)] opacity-60 blur-3xl"
    aria-hidden="true"
  />
  <div class="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
    <div class="space-y-6">
      <p class="text-xs uppercase tracking-[0.32em] text-[var(--text-muted)]">Proof > Pitch</p>
      <h2 class="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-primary)]">{title}</h2>
      <p class="text-lg text-[var(--text-muted)] font-[family-name:var(--font-secondary)]">{description}</p>
      <div class="space-y-4">
        <div class="flex items-start gap-4">
          <div
            class="w-10 h-10 rounded-2xl bg-white/5 border border-[var(--surface-border)] flex items-center justify-center text-[var(--color-success)]"
          >
            01
          </div>
          <div>
            <p class="text-white font-semibold">ClinOps visibility</p>
            <p class="text-sm text-[var(--text-muted)]">Live supervision trails + task routing replace static PDFs.</p>
          </div>
        </div>
        <div class="flex items-start gap-4">
          <div
            class="w-10 h-10 rounded-2xl bg-white/5 border border-[var(--surface-border)] flex items-center justify-center text-[var(--color-accent)]"
          >
            02
          </div>
          <div>
            <p class="text-white font-semibold">Finance-friendly data</p>
            <p class="text-sm text-[var(--text-muted)]">Clean H0038 exports drop straight into payer workflows.</p>
          </div>
        </div>
        <div class="flex items-start gap-4">
          <div
            class="w-10 h-10 rounded-2xl bg-white/5 border border-[var(--surface-border)] flex items-center justify-center text-[var(--color-accent-lilac)]"
          >
            03
          </div>
          <div>
            <p class="text-white font-semibold">Member loyalty</p>
            <p class="text-sm text-[var(--text-muted)]">Risk pings fire micro-interventions before relapse cascades.</p>
          </div>
        </div>
      </div>
      <a
        href="/impact"
        class="inline-flex items-center gap-2 text-[var(--color-accent)] font-semibold hover:text-white transition-colors"
        on:click={() => trackEvent('outcomes_cta_click', { destination: '/impact' })}
      >
        Explore live outcome dossiers
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </a>
      {#if footnotes.length}
        <div class="pt-6 text-xs text-[var(--text-muted)] space-y-2 border-t border-[var(--surface-border)]/60">
          {#each footnotes as note, index}
            <p>
              <span class="text-[var(--text-secondary)] font-semibold">[{index + 1}]</span>
              {note}
            </p>
          {/each}
        </div>
      {/if}
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {#each stats as stat, index}
          <div
          class="relative p-6 rounded-3xl border border-[var(--homepage-soft-border)] bg-[var(--homepage-soft-card)]/95 hover:bg-[var(--homepage-soft-card)] transition-colors shadow-[0_25px_65px_rgba(4,9,20,0.55)]"
            in:fly={{ y: 16, duration: 400, delay: 80 * index }}
          >
            <div class="flex items-start justify-between gap-4">
              <div>
                <div class="text-4xl font-semibold text-white font-[family-name:var(--font-primary)]">{stat.value}</div>
                <p class="text-sm uppercase tracking-[0.28em] text-[var(--text-muted)] mt-1">{stat.label}</p>
              </div>
              <button
                type="button"
                class="w-8 h-8 rounded-full border border-[var(--surface-border)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--color-accent)] transition-colors flex items-center justify-center text-xs font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
                aria-pressed={openStatLabel === stat.label}
                aria-expanded={openStatLabel === stat.label}
                aria-controls={`outcome-tooltip-${index}`}
                title={`Context for ${stat.label}`}
                on:click={() => toggleTooltip(stat)}
              >
                i
                <span class="sr-only">Toggle context for {stat.label}</span>
              </button>
            </div>
          <p class="text-sm text-[var(--text-muted)] mt-3">{stat.context}</p>
            <p class="text-xs text-[var(--text-secondary)] mt-3 flex flex-wrap gap-2 items-center">
              <span>{stat.source}</span>
              {#if stat.sourceLink}
                <a
                  href={stat.sourceLink}
                  target="_blank"
                  rel="noreferrer"
                  class="text-[var(--color-accent)] hover:text-white underline decoration-dotted underline-offset-4 text-[11px] uppercase tracking-[0.32em]"
                >
                  View source
                </a>
              {/if}
            </p>
          {#if openStatLabel === stat.label}
            <div
              id={`outcome-tooltip-${index}`}
              role="status"
              class="absolute top-4 right-4 mt-10 w-64 rounded-2xl border border-[var(--homepage-soft-border)] bg-[var(--surface-night)]/90 backdrop-blur p-4 text-xs text-[var(--text-muted)] shadow-[0_25px_55px_rgba(4,9,20,0.65)] z-10"
            >
              <p class="font-semibold text-[var(--text-secondary)] mb-2">Validated insight</p>
              <p>
                {stat.source} · {stat.context}
              </p>
            </div>
          {/if}
          </div>
      {/each}
    </div>
  </div>
</section>
