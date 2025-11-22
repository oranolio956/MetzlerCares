<script lang="ts">
  import type { CredibilitySignal } from '$lib/content/homepage'

  export let items: CredibilitySignal[] = []
</script>

<section class="py-20">
  <div class="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
    <div class="lg:col-span-2 space-y-6">
      <p class="text-xs uppercase tracking-[0.32em] text-brand-muted">Proof instead of platitudes</p>
      <h2 class="text-3xl md:text-4xl font-bold text-white">Infrastructure signals the boardroom remembers.</h2>
      <p class="text-lg text-brand-muted">
        Instead of generic logo farms, we lead with the regulatory, billing, and security receipts that matter to CFOs,
        Medicaid reviewers, and CMOs evaluating behavioral health partners.
      </p>
    </div>
    <div class="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
      {#each items as item}
        <div
          class="p-6 rounded-2xl border border-brand-border bg-gradient-to-br from-white/[0.05] via-brand-card/40 to-brand-card/20 backdrop-blur"
        >
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-brand-cyan">
              {#if item.icon === 'shield'}
                <svg class="w-5 h-5 text-brand-emerald" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                  />
                </svg>
              {:else if item.icon === 'chip'}
                <svg class="w-5 h-5 text-brand-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 3h6M9 21h6M3 9v6M21 9v6M7 9h10v6H7z"
                  />
                </svg>
              {:else if item.icon === 'lock'}
                <svg class="w-5 h-5 text-brand-iris" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 17a1 1 0 001-1v-2a1 1 0 10-2 0v2a1 1 0 001 1zm6-4h-1V9a5 5 0 00-10 0v4H6a2 2 0 00-2 2v4a2 2 0 002 2h12a2 2 0 002-2v-4a2 2 0 00-2-2z"
                  />
                </svg>
              {:else}
                <svg class="w-5 h-5 text-brand-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 6h4l2 5-2 5H4l-2-5 2-5zm12 0h4l2 5-2 5h-4l-2-5 2-5zm-6 5h4"
                  />
                </svg>
              {/if}
            </div>
            <div class="text-xs uppercase tracking-[0.32em] text-brand-muted">{item.label}</div>
          </div>
          <h3 class="text-xl font-semibold text-white mb-2">{item.title}</h3>
          <p class="text-sm text-brand-muted leading-relaxed">{item.detail}</p>
        </div>
      {/each}
    </div>
  </div>
</section>
