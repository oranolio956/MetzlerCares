<script lang="ts">
  import type { OutcomeStat } from '$lib/content/homepage'
  import { fly } from 'svelte/transition'
  import { trackEvent } from '$lib/utils/analytics'

  export let stats: OutcomeStat[] = []
  export let title = 'Every partner gets a telemetry report, not a testimonial.'
  export let description =
    'We quantify field operations in the same units as CFOs, quality teams, and Medicaid reviewers. That means faster approvals, faster reimbursements, and fewer “trust us” decks.'
  export let footnotes: string[] = []
</script>

<section class="py-24 bg-brand-card border-t border-brand-border/60">
  <div class="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
    <div class="space-y-6">
      <p class="text-xs uppercase tracking-[0.32em] text-brand-muted">Proof > Pitch</p>
      <h2 class="text-3xl md:text-4xl font-bold text-white">{title}</h2>
      <p class="text-lg text-brand-muted">{description}</p>
      <div class="space-y-4">
        <div class="flex items-start gap-4">
          <div
            class="w-10 h-10 rounded-2xl bg-white/5 border border-brand-border flex items-center justify-center text-brand-emerald"
          >
            01
          </div>
          <div>
            <p class="text-white font-semibold">ClinOps visibility</p>
            <p class="text-sm text-brand-muted">Live supervision trails + task routing replace static PDFs.</p>
          </div>
        </div>
        <div class="flex items-start gap-4">
          <div
            class="w-10 h-10 rounded-2xl bg-white/5 border border-brand-border flex items-center justify-center text-brand-cyan"
          >
            02
          </div>
          <div>
            <p class="text-white font-semibold">Finance-friendly data</p>
            <p class="text-sm text-brand-muted">Clean H0038 exports drop straight into payer workflows.</p>
          </div>
        </div>
        <div class="flex items-start gap-4">
          <div
            class="w-10 h-10 rounded-2xl bg-white/5 border border-brand-border flex items-center justify-center text-brand-iris"
          >
            03
          </div>
          <div>
            <p class="text-white font-semibold">Member loyalty</p>
            <p class="text-sm text-brand-muted">Risk pings fire micro-interventions before relapse cascades.</p>
          </div>
        </div>
      </div>
      <a
        href="/impact"
        class="inline-flex items-center gap-2 text-brand-cyan font-semibold hover:text-white transition-colors"
        on:click={() => trackEvent('outcomes_cta_click', { destination: '/impact' })}
      >
        Explore live outcome dossiers
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </a>
      {#if footnotes.length}
        <div class="pt-6 text-xs text-brand-muted space-y-2 border-t border-brand-border/60">
          {#each footnotes as note, index}
            <p>
              <span class="text-brand-soft font-semibold">[{index + 1}]</span>
              {note}
            </p>
          {/each}
        </div>
      {/if}
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {#each stats as stat, index}
        <div class="p-6 rounded-3xl border border-brand-border bg-gradient-to-br from-white/[0.04] to-brand-card/30" in:fly={{ y: 16, duration: 400, delay: 80 * index }}>
          <div class="text-4xl font-semibold text-white">{stat.value}</div>
          <p class="text-sm uppercase tracking-[0.28em] text-brand-muted mt-1">{stat.label}</p>
          <p class="text-sm text-brand-muted mt-3">{stat.context}</p>
          <p class="text-xs text-brand-soft mt-3">{stat.source}</p>
        </div>
      {/each}
    </div>
  </div>
</section>
