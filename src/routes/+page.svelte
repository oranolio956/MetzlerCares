<script lang="ts">
  const heroSignals = [
    {
      label: 'H0038 claims',
      value: '100% auto-coded',
      detail: 'Structured exports with payer-ready notes and supervision logs.'
    },
    {
      label: 'Coverage',
      value: '24/7 hybrid team',
      detail: 'AI + certified peers resolve escalations in under four minutes.'
    },
    {
      label: 'Deployments',
      value: '12 Colorado regions',
      detail: 'Hospital networks and county programs run Metzler end-to-end.'
    }
  ]

  const credibility = [
    {
      label: 'Assurance',
      title: 'RSSO License MC-247',
      detail: 'Colorado OBH verified workforce, Medicaid billing, and supervision stack.',
      icon: 'shield'
    },
    {
      label: 'Billing engine',
      title: 'Medicaid + commercial ready',
      detail: 'H0038, T1012, and SUD codes exported with encounter documentation.',
      icon: 'chip'
    },
    {
      label: 'Security posture',
      title: 'HIPAA + SOC 2 controls',
      detail: 'Hardened Supabase Postgres with automated audit webhooks.',
      icon: 'lock'
    },
    {
      label: 'Adoption',
      title: 'Clinics & payers in sync',
      detail: 'Health systems, FQHCs, and managed care orgs co-manage inside Metzler.',
      icon: 'pulse'
    }
  ]

  const loops = [
    {
      title: 'Signal Layer',
      description: 'Real-time telemetry from the mobile app, SMS, and EHR events fuels predictive alerts.',
      chips: ['SDOH ingestion', 'Sentiment scanning', 'Warm handoffs']
    },
    {
      title: 'Orchestrate Layer',
      description: 'Ops console routes playbooks, supervision, and billing artifacts with zero spreadsheets.',
      chips: ['Playbook routing', 'Clean fee schedules', 'Coach QA & supervision']
    },
    {
      title: 'Proof Layer',
      description: 'Audit ledger captures every touch with payer-friendly evidence and ROI reporting.',
      chips: ['Encounter ledger', 'Medicaid exports', 'Outcome visualizations']
    }
  ]

  const pillars = [
    {
      title: 'Data Spine',
      description: 'Normalized recovery capital, referrals, and claims into one streaming telemetry feed.',
      icon: 'chart',
      stat: '12 Colorado markets live'
    },
    {
      title: 'Interoperability Mesh',
      description: 'Push peer encounter notes and billing data into Epic, Athena, and Netsmart without manual files.',
      icon: 'network',
      stat: 'EHR agnostic'
    },
    {
      title: 'Engagement Cloud',
      description: 'White-label mobile app plus AI-driven nudges keep members connected between sessions.',
      icon: 'cpu',
      stat: '95% opt-in engagement'
    },
    {
      title: 'Governance Core',
      description: 'Audit-ready ledger mapped to Colorado RSSO standards with Medicaid H0038 coding baked in.',
      icon: 'shield',
      stat: '100% audit-ready threads'
    }
  ]

  const stats = [
    { value: '4.2x', label: 'More peer touchpoints captured', context: 'vs manual spreadsheets + phone trees' },
    { value: '32%', label: 'Faster claim approval cycle', context: 'clean H0038 exports & auto-notes' },
    { value: '<4 min', label: 'Average risk escalation response', context: 'hybrid AI + human coverage' }
  ]
</script>

<svelte:head>
  <title>Metzler Cares | Colorado’s Recovery Infrastructure OS</title>
  <meta
    name="description"
    content="Metzler Cares is the Colorado-born operating system that powers certified peer coaching, Medicaid billing, and auditable outcomes in a single platform."
  />
</svelte:head>

<div
  class="min-h-screen bg-brand-night text-brand-text font-sans selection:bg-brand-iris selection:text-brand-night relative overflow-hidden"
>
  <div class="absolute inset-0 bg-gradient-to-b from-brand-dusk via-brand-night to-brand-night" aria-hidden="true" />
  <div
    class="absolute inset-0 opacity-35"
    aria-hidden="true"
    style="background: radial-gradient(circle at 20% 20%, rgba(45, 212, 191, 0.18), transparent 42%), radial-gradient(circle at 80% 0%, rgba(167, 139, 250, 0.22), transparent 50%);"
  />
  <div
    class="absolute inset-0 opacity-20 mix-blend-soft-light"
    aria-hidden="true"
    style="background-image: linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(0deg, rgba(255,255,255,0.04) 1px, transparent 1px); background-size: 80px 80px;"
  />

  <div class="relative z-10">
    <!-- Hero Section -->
    <section class="relative min-h-screen flex items-center pt-28 pb-20" aria-labelledby="hero-title">
      <div
        class="absolute inset-x-0 top-0 h-[420px] bg-gradient-to-b from-white/10 via-transparent to-transparent opacity-30 blur-3xl"
        aria-hidden="true"
      />
      <div class="container mx-auto px-4 grid grid-cols-1 xl:grid-cols-10 gap-16 items-center">
        <div class="xl:col-span-5 space-y-8">
          <div
            class="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-brand-border bg-white/5 text-[11px] uppercase tracking-[0.28em] text-brand-muted/90"
          >
            Colorado built · RSSO Licensed
          </div>
          <h1 id="hero-title" class="text-5xl md:text-6xl xl:text-7xl font-bold text-white leading-tight text-balance">
            Recovery infrastructure built like mission control.
          </h1>
          <p class="text-lg md:text-xl text-brand-muted max-w-2xl">
            Metzler Cares is the operating system for peer-led recovery: telemetry-rich, Medicaid-clean, and designed so
            clinicians, payers, and field teams finally see the same truth.
          </p>
          <div class="flex flex-col sm:flex-row gap-4">
            <a
              href="/contact"
              class="px-9 py-4 rounded-full text-lg font-semibold text-brand-night bg-gradient-to-r from-brand-teal via-brand-emerald to-brand-cyan shadow-xl shadow-teal-500/25 hover:scale-[1.01] transition-transform duration-200"
            >
              Plan a live build
            </a>
            <a
              href="#operating-blueprint"
              class="px-9 py-4 rounded-full border border-brand-border text-brand-soft hover:bg-white/10 text-lg font-semibold transition-colors duration-200 text-center"
            >
              View the system map
            </a>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8">
            {#each heroSignals as signal}
              <div class="p-5 rounded-2xl border border-brand-border bg-brand-card/60 backdrop-blur-md">
                <p class="text-xs uppercase tracking-[0.32em] text-brand-muted">{signal.label}</p>
                <p class="mt-2 text-2xl font-semibold text-white">{signal.value}</p>
                <p class="text-sm text-brand-muted">{signal.detail}</p>
              </div>
            {/each}
          </div>
        </div>

        <div class="xl:col-span-5">
          <div class="relative">
            <div
              class="absolute -inset-6 bg-gradient-to-r from-brand-teal/25 via-transparent to-brand-iris/25 blur-3xl"
              aria-hidden="true"
            />
            <div class="relative space-y-6">
              <div
                class="rounded-[32px] border border-brand-border bg-brand-card/80 backdrop-blur-2xl p-8 shadow-[0_25px_80px_rgba(5,6,10,0.75)]"
              >
                <div class="flex items-start justify-between">
                  <div>
                    <p class="text-xs uppercase tracking-[0.32em] text-brand-muted">Ops Console</p>
                    <p class="text-2xl font-semibold text-white mt-3">Metzler Field Command</p>
                  </div>
                  <span
                    class="px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.4em] bg-emerald-400/20 text-emerald-200"
                  >
                    Live
                  </span>
                </div>
                <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-4">
                    <div>
                      <div class="flex justify-between text-sm text-brand-muted">
                        <span>Active cohorts</span>
                        <span>37</span>
                      </div>
                      <div class="h-1.5 w-full rounded-full bg-white/10 mt-2">
                        <div class="h-full w-4/5 rounded-full bg-gradient-to-r from-teal-300 to-emerald-500" />
                      </div>
                    </div>
                    <div>
                      <div class="flex justify-between text-sm text-brand-muted">
                        <span>Escalations resolved</span>
                        <span>92%</span>
                      </div>
                      <div class="h-1.5 w-full rounded-full bg-white/10 mt-2">
                        <div class="h-full w-[92%] rounded-full bg-gradient-to-r from-purple-400 to-pink-500" />
                      </div>
                    </div>
                    <div class="rounded-2xl border border-brand-border bg-brand-card/70 p-4">
                      <p class="text-xs uppercase tracking-[0.32em] text-brand-muted">SDOH Signals</p>
                      <p class="text-3xl font-semibold text-white mt-2">+18 spikes</p>
                      <p class="text-sm text-brand-muted">Auto-routed to peer supervisors</p>
                    </div>
                  </div>
                  <div class="space-y-4">
                    <div
                      class="rounded-2xl bg-brand-card/70 border border-brand-border p-4 flex items-center justify-between gap-4"
                    >
                      <div>
                        <p class="text-sm text-brand-muted">Mesa County</p>
                        <p class="text-xl font-semibold text-white">Stabilized</p>
                      </div>
                      <span
                        class="px-3 py-1 text-xs uppercase tracking-[0.35em] rounded-full bg-emerald-400/15 text-emerald-200"
                      >
                        Green
                      </span>
                    </div>
                    <div class="rounded-2xl bg-brand-card/70 border border-brand-border p-4">
                      <p class="text-xs uppercase tracking-[0.32em] text-brand-muted">Billing Queue</p>
                      <div class="mt-3 space-y-2 text-sm text-brand-muted">
                        <div class="flex justify-between">
                          <span>H0038 · 14 claims</span>
                          <span class="text-emerald-300">auto coded</span>
                        </div>
                        <div class="flex justify-between">
                          <span>T1012 · 6 claims</span>
                          <span class="text-sky-300">review</span>
                        </div>
                        <div class="flex justify-between">
                          <span>Peer supervision</span>
                          <span class="text-brand-muted">awaiting sign-off</span>
                        </div>
                      </div>
                    </div>
                    <div
                      class="rounded-2xl border border-brand-border p-4 bg-gradient-to-br from-brand-teal/15 to-brand-iris/15"
                    >
                      <p class="text-sm text-brand-soft">Next best action</p>
                      <p class="text-2xl font-semibold text-white mt-2">Deploy harm reduction kit</p>
                      <p class="text-xs uppercase tracking-[0.32em] text-brand-muted mt-2">
                        Triggered by sentiment dip
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  class="rounded-2xl border border-brand-border bg-brand-card/70 p-5 flex items-center justify-between"
                >
                  <div>
                    <p class="text-xs uppercase tracking-[0.32em] text-brand-muted">H0038 Claim</p>
                    <p class="text-2xl font-semibold text-white mt-2">Ready</p>
                  </div>
                  <span class="text-sm text-emerald-300">→ Payer portal</span>
                </div>
                <div class="rounded-2xl border border-brand-border bg-brand-card/70 p-5">
                  <p class="text-xs uppercase tracking-[0.32em] text-brand-muted">Network pulse</p>
                  <p class="text-2xl font-semibold text-white mt-2">98% uptime</p>
                  <p class="text-sm text-brand-muted">APIs + field hardware</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Credibility Section -->
    <section class="py-20">
      <div class="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
        <div class="lg:col-span-2 space-y-6">
          <p class="text-xs uppercase tracking-[0.32em] text-brand-muted">Proof instead of platitudes</p>
          <h2 class="text-3xl md:text-4xl font-bold text-white">Infrastructure signals the boardroom remembers.</h2>
          <p class="text-lg text-brand-muted">
            Instead of generic logo farms, we lead with the regulatory, billing, and security receipts that matter to
            CFOs, Medicaid reviewers, and CMOs evaluating behavioral health partners.
          </p>
        </div>
        <div class="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {#each credibility as item}
            <div
              class="p-6 rounded-2xl border border-brand-border bg-gradient-to-br from-white/[0.05] via-brand-card/40 to-brand-card/20 backdrop-blur"
            >
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-brand-cyan">
                  {#if item.icon === 'shield'}
                    <svg class="w-5 h-5 text-brand-emerald" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                      ><path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                      /></svg
                    >
                  {:else if item.icon === 'chip'}
                    <svg class="w-5 h-5 text-brand-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                      ><path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 3h6M9 21h6M3 9v6M21 9v6M7 9h10v6H7z"
                      /></svg
                    >
                  {:else if item.icon === 'lock'}
                    <svg class="w-5 h-5 text-brand-iris" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                      ><path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 17a1 1 0 001-1v-2a1 1 0 10-2 0v2a1 1 0 001 1zm6-4h-1V9a5 5 0 00-10 0v4H6a2 2 0 00-2 2v4a2 2 0 002 2h12a2 2 0 002-2v-4a2 2 0 00-2-2z"
                      /></svg
                    >
                  {:else}
                    <svg class="w-5 h-5 text-brand-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                      ><path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 6h4l2 5-2 5H4l-2-5 2-5zm12 0h4l2 5-2 5h-4l-2-5 2-5zm-6 5h4"
                      /></svg
                    >
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

    <!-- Operating Blueprint -->
    <section id="operating-blueprint" class="py-24 relative">
      <div
        class="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent opacity-10 pointer-events-none"
        aria-hidden="true"
      />
      <div class="container mx-auto px-4 grid grid-cols-1 xl:grid-cols-5 gap-12 items-start">
        <div class="xl:col-span-2 space-y-8">
          <p class="text-xs uppercase tracking-[0.32em] text-brand-muted">Infrastructure, not intervention</p>
          <h2 class="text-3xl md:text-4xl font-bold text-white">
            A three-layer operating system that captures the entire recovery loop.
          </h2>
          <p class="text-lg text-brand-muted">
            Every workflow snaps into a loop—Signal, Orchestrate, Prove—so field teams, clinicians, and finance speak
            the same language without duct-taped software.
          </p>
          <div class="space-y-6">
            {#each loops as loop, index}
              <div class="p-5 rounded-2xl border border-brand-border bg-white/[0.03] backdrop-blur">
                <div class="flex items-start gap-4">
                  <div
                    class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-sm font-semibold text-white"
                  >
                    {index + 1}
                  </div>
                  <div>
                    <p class="text-xs uppercase tracking-[0.32em] text-brand-muted">{loop.title}</p>
                    <p class="text-base text-brand-soft mt-2">{loop.description}</p>
                  </div>
                </div>
                <div class="flex flex-wrap gap-2 mt-4">
                  {#each loop.chips as chip}
                    <span
                      class="px-3 py-1 text-[11px] uppercase tracking-[0.22em] rounded-full bg-brand-card/60 border border-brand-border text-brand-soft"
                    >
                      {chip}
                    </span>
                  {/each}
                </div>
              </div>
            {/each}
          </div>
        </div>
        <div class="xl:col-span-3">
          <div
            class="relative p-10 rounded-[36px] border border-brand-border bg-brand-card/90 backdrop-blur-xl shadow-[0_30px_120px_rgba(3,4,6,0.95)] overflow-hidden"
          >
            <div
              class="absolute inset-0 opacity-30"
              aria-hidden="true"
              style="background-image: linear-gradient(120deg, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(0deg, rgba(255,255,255,0.04) 1px, transparent 1px); background-size: 140px 120px; mask-image: radial-gradient(circle at 30% 30%, rgba(0,0,0,0.9), rgba(0,0,0,0));"
            />
            <div class="absolute -right-20 top-10 w-72 h-72 bg-teal-500/20 blur-[120px]" aria-hidden="true" />
            <div class="relative space-y-6">
              {#each pillars as pillar}
                <div
                  class="group relative p-6 rounded-3xl bg-brand-card/70 border border-brand-border backdrop-blur flex flex-col gap-4 md:flex-row md:items-center"
                >
                  <div
                    class="w-14 h-14 rounded-2xl bg-white/5 border border-brand-border flex items-center justify-center text-brand-cyan group-hover:bg-brand-cyan/10 transition-colors"
                  >
                    {#if pillar.icon === 'chart'}
                      <svg class="w-7 h-7 text-brand-emerald" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                        ><path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        /></svg
                      >
                    {:else if pillar.icon === 'network'}
                      <svg class="w-7 h-7 text-brand-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                        ><path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                        /></svg
                      >
                    {:else if pillar.icon === 'cpu'}
                      <svg class="w-7 h-7 text-brand-iris" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                        ><path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                        /></svg
                      >
                    {:else}
                      <svg class="w-7 h-7 text-brand-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                        ><path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        /></svg
                      >
                    {/if}
                  </div>
                  <div class="flex-1">
                    <p class="text-xs uppercase tracking-[0.32em] text-brand-muted">{pillar.stat}</p>
                    <h3 class="text-2xl font-semibold text-white mt-2">{pillar.title}</h3>
                    <p class="text-sm text-brand-muted mt-2 leading-relaxed">{pillar.description}</p>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Outcomes / Case Studies -->
    <section class="py-24 bg-brand-card border-t border-brand-border/60">
      <div class="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div class="space-y-6">
          <p class="text-xs uppercase tracking-[0.32em] text-brand-muted">Proof > Pitch</p>
          <h2 class="text-3xl md:text-4xl font-bold text-white">
            Every partner gets a telemetry report, not a testimonial.
          </h2>
          <p class="text-lg text-brand-muted">
            We quantify field operations in the same units as CFOs, quality teams, and Medicaid reviewers. That means
            faster approvals, faster reimbursements, and fewer “trust us” decks.
          </p>
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
          >
            Explore live outcome dossiers
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"
              ><path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              /></svg
            >
          </a>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {#each stats as stat}
            <div
              class="p-6 rounded-3xl border border-brand-border bg-gradient-to-br from-white/[0.04] to-brand-card/30"
            >
              <div class="text-4xl font-semibold text-white">{stat.value}</div>
              <p class="text-sm uppercase tracking-[0.28em] text-brand-muted mt-1">{stat.label}</p>
              <p class="text-sm text-brand-muted mt-3">{stat.context}</p>
            </div>
          {/each}
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-24 relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-r from-brand-dusk via-brand-night to-brand-card" aria-hidden="true" />
      <div
        class="absolute inset-y-0 left-1/2 w-1/2 bg-gradient-to-l from-brand-teal/30 to-transparent blur-3xl opacity-60"
        aria-hidden="true"
      />
      <div class="container mx-auto px-4 text-center relative z-10">
        <p class="text-xs uppercase tracking-[0.32em] text-brand-teal">First impression ≠ final delivery</p>
        <h2 class="text-4xl md:text-5xl font-bold text-white mt-4">
          Let’s architect recovery infrastructure once, not reinvent it every contract.
        </h2>
        <p class="text-lg text-brand-soft max-w-3xl mx-auto mt-6">
          We onboard with your clinicians, finance leads, and field teams in the same sprint so everyone is shipping
          from day one.
        </p>
        <div class="flex flex-col sm:flex-row justify-center gap-4 mt-10">
          <a
            href="/contact"
            class="px-10 py-4 rounded-full bg-white text-brand-night text-lg font-semibold shadow-xl shadow-black/20 hover:scale-[1.01] transition-transform"
          >
            Book a working session
          </a>
          <a
            href="/partner-portal"
            class="px-10 py-4 rounded-full border border-brand-border text-white text-lg font-semibold hover:bg-white/10 transition-colors"
          >
            Access partner portal
          </a>
        </div>
        <div class="flex flex-wrap justify-center gap-3 mt-8 text-xs uppercase tracking-[0.32em] text-brand-muted">
          <span class="px-4 py-2 rounded-full border border-brand-border bg-white/5">Medicaid H0038 ready</span>
          <span class="px-4 py-2 rounded-full border border-brand-border bg-white/5">Colorado RSSO certified</span>
          <span class="px-4 py-2 rounded-full border border-brand-border bg-white/5">Security-first delivery</span>
        </div>
      </div>
    </section>
  </div>
</div>
