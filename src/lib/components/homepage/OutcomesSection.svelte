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

<section class="relative" id="outcomes-section">
  <div class="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
    <div class="space-y-4">
      <p class="text-[10px] uppercase tracking-wider text-white/50 font-medium">Proof > Pitch</p>
      <h2 class="text-2xl md:text-3xl font-bold text-white font-[family-name:var(--font-primary)] leading-tight">{title}</h2>
      <p class="text-base text-white/60 font-[family-name:var(--font-secondary)] leading-relaxed">{description}</p>
      <div class="space-y-3">
        <div class="flex items-start gap-3">
          <div class="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-xs font-medium text-white">
            01
          </div>
          <div>
            <p class="text-sm font-medium text-white">ClinOps visibility</p>
            <p class="text-xs text-white/60">Live supervision trails + task routing replace static PDFs.</p>
          </div>
        </div>
        <div class="flex items-start gap-3">
          <div class="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-xs font-medium text-white">
            02
          </div>
          <div>
            <p class="text-sm font-medium text-white">Finance-friendly data</p>
            <p class="text-xs text-white/60">Clean H0038 exports drop straight into payer workflows.</p>
          </div>
        </div>
        <div class="flex items-start gap-3">
          <div class="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-xs font-medium text-white">
            03
          </div>
          <div>
            <p class="text-sm font-medium text-white">Member loyalty</p>
            <p class="text-xs text-white/60">Risk pings fire micro-interventions before relapse cascades.</p>
          </div>
        </div>
      </div>
      <a
        href="/impact"
        class="inline-flex items-center gap-2 text-sm text-white/70 font-medium hover:text-white transition-colors"
        on:click={() => trackEvent('outcomes_cta_click', { destination: '/impact' })}
      >
        Explore live outcome dossiers
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </a>
      {#if footnotes.length}
        <div class="pt-4 text-[10px] text-white/40 space-y-1 border-t border-white/10">
          {#each footnotes as note, index}
            <p>
              <span class="text-white/60 font-medium">[{index + 1}]</span>
              {note}
            </p>
          {/each}
        </div>
      {/if}
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {#each stats.slice(0, 4) as stat, index}
          <div
          class="relative p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-200"
            in:fly={{ y: 10, duration: 300, delay: 50 * index }}
          >
            <div>
              <div class="text-3xl font-semibold text-white font-[family-name:var(--font-primary)]">{stat.value}</div>
              <p class="text-xs uppercase tracking-wider text-white/50 mt-1">{stat.label}</p>
            </div>
            <p class="text-sm text-white/60 mt-2">{stat.context}</p>
              <p class="text-[10px] text-white/40 mt-2">
                {stat.source}
              </p>
              {#if stat.sourceLink}
                <a
                  href={stat.sourceLink}
                  target="_blank"
                  rel="noreferrer"
                  class="inline-flex items-center gap-1 text-[11px] text-emerald-300 mt-1 hover:text-emerald-200 transition-colors"
                >
                  View methodology
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              {/if}
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
