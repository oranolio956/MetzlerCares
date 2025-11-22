<script lang="ts">
  import { onMount } from 'svelte'
  import { fade, fly } from 'svelte/transition'

  const leadership = [
    {
      name: 'Clinical Advisory Board',
      role: 'Oversight',
      description: 'Comprised of licensed LCSWs and LACs, our advisory board reviews all peer supervision protocols to ensure clinical integrity and prevent scope creep.'
    },
    {
      name: 'Lived Experience Council',
      role: 'Strategy',
      description: 'A rotating council of alumni and current peer specialists who guide our product roadmap, ensuring our technology remains human-centered.'
    },
    {
      name: 'Compliance Office',
      role: 'Governance',
      description: 'Dedicated internal audit team focused on Medicaid H0038 documentation standards, 42 CFR Part 2 data privacy, and RSSO licensing requirements.'
    }
  ]

  let visible = false
  onMount(() => {
    visible = true
  })
</script>

<svelte:head>
  <title>About | Metzler Cares</title>
  <meta name="description" content="Building the digital infrastructure for sustainable recovery. Governance, compliance, and lived experience at the core of our mission." />
</svelte:head>

<div class="min-h-screen bg-tech-primary text-warm-gray font-sans selection:bg-tech-accent selection:text-white pt-20">

  <!-- Hero Section -->
  <section class="relative py-24 overflow-hidden">
    <div class="container mx-auto px-4 relative z-10 text-center">
      <h1 class="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
        Governance & <span class="text-tech-teal">Mission</span>.
      </h1>
      <p class="text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
        We are not just a tech company. We are a licensed Recovery Support Services Organization (RSSO) building the digital infrastructure for sustainable recovery.
      </p>
    </div>
  </section>

  <!-- Mission Statement -->
  <section class="py-20 bg-tech-secondary/30 border-y border-gray-800">
    <div class="container mx-auto px-4 text-center">
      <div class="max-w-4xl mx-auto">
        <h2 class="text-3xl font-bold text-white mb-6">Our Mandate</h2>
        <p class="text-2xl text-gray-300 italic font-serif leading-relaxed">
          "To bridge the gap between clinical treatment and long-term recovery through data-driven, human-centered infrastructure."
        </p>
      </div>
    </div>
  </section>

  <!-- Leadership Grid -->
  <section class="py-24">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl font-bold text-white mb-12 text-center">Organizational Structure</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        {#each leadership as leader}
          <div class="p-8 bg-tech-secondary border border-gray-800 rounded-xl hover:border-tech-accent transition-colors group">
            <div class="text-tech-accent font-bold text-sm uppercase tracking-wider mb-2">{leader.role}</div>
            <h3 class="text-xl font-bold text-white mb-4">{leader.name}</h3>
            <p class="text-gray-400 leading-relaxed">{leader.description}</p>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- Compliance Badges -->
  <section class="py-24 bg-tech-secondary border-t border-gray-800">
    <div class="container mx-auto px-4 text-center">
      <h2 class="text-3xl font-bold text-white mb-12">Regulatory Framework</h2>
      <div class="flex flex-wrap justify-center gap-8 md:gap-16">
        <div class="flex flex-col items-center gap-4">
          <div class="w-20 h-20 rounded-full bg-tech-primary border-2 border-tech-accent flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-tech-accent/20">
            RSSO
          </div>
          <div class="text-gray-300 font-medium">Licensed RSSO</div>
        </div>
        <div class="flex flex-col items-center gap-4">
          <div class="w-20 h-20 rounded-full bg-tech-primary border-2 border-tech-accent flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-tech-accent/20">
            HIPAA
          </div>
          <div class="text-gray-300 font-medium">HIPAA Compliant</div>
        </div>
        <div class="flex flex-col items-center gap-4">
          <div class="w-20 h-20 rounded-full bg-tech-primary border-2 border-tech-accent flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-tech-accent/20">
            H0038
          </div>
          <div class="text-gray-300 font-medium">Medicaid Enrolled</div>
        </div>
      </div>
    </div>
  </section>

</div>
