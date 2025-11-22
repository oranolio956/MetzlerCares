<script lang="ts">
  import { onMount } from 'svelte'
  import { fade, fly } from 'svelte/transition'

  const features = [
    {
      title: 'Gamified Sobriety Tracking',
      description: 'Leveraging behavioral economics, our app uses point systems, streaks, and badges to gamify the early stages of recovery. This increases dopamine response to positive behaviors, improving retention rates.',
      icon: 'trophy'
    },
    {
      title: 'Geofencing & Risk Alerts',
      description: 'Optional GPS-enabled features allow members to identify "high-risk" zones. If a boundary is breached, the app prompts a check-in or alerts the assigned Peer Coach for immediate outreach.',
      icon: 'map'
    },
    {
      title: 'Tele-Peer Support',
      description: 'Secure, HIPAA-compliant video and text messaging built directly into the platform. This allows for billing of synchronous telehealth codes where applicable and ensures rural access.',
      icon: 'video'
    },
    {
      title: 'Asynchronous Learning',
      description: 'On-demand access to CBT-based exercises, mindfulness modules, and recovery literature. Usage data is tracked to demonstrate member engagement to clinical partners.',
      icon: 'book'
    }
  ]

  let visible = false
  onMount(() => {
    visible = true
  })
</script>

<svelte:head>
  <title>Platform | Metzler Cares</title>
  <meta name="description" content="The Metzler Cares App: Recovery in your pocket. A fully branded, white-label digital experience that keeps members connected, accountable, and supported." />
</svelte:head>

<div class="min-h-screen bg-tech-primary text-warm-gray font-sans selection:bg-tech-accent selection:text-white pt-20">

  <!-- Hero Section -->
  <section class="relative py-20 overflow-hidden">
    <div class="container mx-auto px-4 relative z-10">
      <div class="text-center max-w-4xl mx-auto">
        <h1 class="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Recovery in Your Pocket.
        </h1>
        <p class="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
          Recovery doesn't happen in one hour a week. It happens in the 167 hours between sessions. We deploy a fully branded, white-label digital experience that keeps members connected.
        </p>
        <div class="flex justify-center gap-4">
          <button class="px-8 py-4 bg-white text-tech-primary rounded-lg font-bold hover:bg-gray-100 transition-all">
            See the App in Action
          </button>
        </div>
      </div>
    </div>
    
    <!-- Abstract Background Elements -->
    <div class="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-tech-accent/10 rounded-full blur-3xl"></div>
    </div>
  </section>

  <!-- App Features Grid -->
  <section class="py-24 bg-tech-secondary/50 border-y border-gray-800">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <!-- Visual: App Mockup -->
        <div class="relative order-2 md:order-1">
          <div class="relative mx-auto border-gray-800 bg-gray-900 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-xl">
            <div class="w-[148px] h-[18px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute"></div>
            <div class="h-[32px] w-[3px] bg-gray-800 absolute -left-[17px] top-[72px] rounded-l-lg"></div>
            <div class="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[124px] rounded-l-lg"></div>
            <div class="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[178px] rounded-l-lg"></div>
            <div class="h-[64px] w-[3px] bg-gray-800 absolute -right-[17px] top-[142px] rounded-r-lg"></div>
            <div class="rounded-[2rem] overflow-hidden w-[272px] h-[572px] bg-tech-primary relative">
              <!-- Screen Content -->
              <div class="p-6 space-y-6">
                <div class="flex justify-between items-center text-white">
                  <span class="font-bold text-lg">My Recovery</span>
                  <div class="w-8 h-8 rounded-full bg-gray-700"></div>
                </div>
                
                <!-- Streak Card -->
                <div class="bg-gradient-to-br from-tech-accent to-blue-600 rounded-xl p-6 text-white shadow-lg">
                  <div class="text-sm opacity-80">Current Streak</div>
                  <div class="text-4xl font-bold mb-2">42 Days</div>
                  <div class="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                    <div class="bg-white h-full w-3/4"></div>
                  </div>
                </div>

                <!-- Daily Check-in -->
                <div class="bg-gray-800 rounded-xl p-4 border border-gray-700">
                  <div class="text-sm text-gray-400 mb-3">Daily Check-in</div>
                  <div class="flex justify-between">
                    <div class="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">😊</div>
                    <div class="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center grayscale opacity-50">😐</div>
                    <div class="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center grayscale opacity-50">😔</div>
                  </div>
                </div>

                <!-- Upcoming -->
                <div class="space-y-3">
                  <div class="text-sm text-gray-400">Upcoming</div>
                  <div class="bg-gray-800 rounded-xl p-4 border border-gray-700 flex items-center gap-3">
                    <div class="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400">
                      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    </div>
                    <div>
                      <div class="text-white font-medium">Peer Session</div>
                      <div class="text-xs text-gray-500">Today, 2:00 PM</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Features List -->
        <div class="order-1 md:order-2 space-y-10">
          {#each features as feature}
            <div class="flex gap-6">
              <div class="flex-shrink-0 w-14 h-14 rounded-xl bg-tech-secondary border border-gray-700 flex items-center justify-center text-tech-accent">
                {#if feature.icon === 'trophy'}
                  <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {:else if feature.icon === 'map'}
                  <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                {:else if feature.icon === 'video'}
                  <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                {:else}
                  <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                {/if}
              </div>
              <div>
                <h3 class="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p class="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </section>

  <!-- Human in the Loop Section -->
  <section class="py-24 bg-tech-primary">
    <div class="container mx-auto px-4 text-center">
      <h2 class="text-3xl md:text-5xl font-bold text-white mb-6">Powered by Certified, Tech-Enabled Professionals.</h2>
      <p class="text-xl text-gray-400 max-w-3xl mx-auto mb-16">
        Our Peer Support Professionals (PSPs) are not just mentors; they are certified data-literate recovery coaches.
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div class="p-8 rounded-2xl bg-tech-secondary border border-gray-800 text-left">
          <h3 class="text-2xl font-bold text-white mb-4">Credentialing</h3>
          <p class="text-gray-400">All peers maintain Colorado Peer and Family Specialist (CPFS) credentials or are in active apprenticeship toward certification. This ensures a baseline of competency and professionalism.</p>
        </div>
        <div class="p-8 rounded-2xl bg-tech-secondary border border-gray-800 text-left">
          <h3 class="text-2xl font-bold text-white mb-4">Supervision</h3>
          <p class="text-gray-400">We utilize a proprietary supervision dashboard that tracks peer caseloads, burnout indicators, and clinical drift, ensuring strict adherence to RSSO licensing standards.</p>
        </div>
      </div>
    </div>
  </section>

</div>
