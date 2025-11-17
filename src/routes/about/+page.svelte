<script lang="ts">
  import { trackEvent } from '$lib/utils/analytics'
  import { onMount } from 'svelte'

  onMount(() => {
    trackEvent('about_page_viewed')
  })
</script>

<svelte:head>
  <title>About Us - Metzler Foundations</title>
  <meta
    name="description"
    content="Learn about Metzler Foundations' mission to provide dignified housing support for individuals in recovery from addiction through innovative scholarship programs."
  />
  <meta
    name="keywords"
    content="about Metzler Foundations, recovery housing mission, addiction recovery support, housing scholarships nonprofit"
  />
  <link rel="canonical" href="https://metzlerfoundations.org/about" />
</svelte:head>

<div class="min-h-screen bg-cream text-navy">
  <!-- Hero Section -->
  <section class="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-navy via-olive to-gold bg-opacity-5">
    <div class="max-w-6xl mx-auto text-center">
      <h1 class="text-4xl md:text-5xl font-serif font-medium text-navy mb-6">About Metzler Foundations</h1>
      <p class="text-xl text-navy text-opacity-80 mb-8 max-w-3xl mx-auto">
        We're on a mission to make recovery housing accessible and dignified for everyone. Through innovative
        scholarship programs and partnerships, we're building a future where stable housing is a right, not a privilege,
        in recovery.
      </p>
    </div>
  </section>

  <!-- Mission & Vision -->
  <section class="py-16 px-4 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h2 class="text-3xl font-serif font-medium text-navy mb-6">Our Mission</h2>
          <p class="text-lg text-navy text-opacity-80 mb-6">
            To provide immediate, dignified housing scholarships for individuals in recovery from addiction, ensuring
            that stable housing never becomes a barrier to recovery success.
          </p>
          <p class="text-navy text-opacity-80">
            We believe that everyone deserves a safe place to heal and rebuild their lives. Through our automated
            scholarship system and partnerships with quality sober living facilities, we're making this vision a
            reality.
          </p>
        </div>

        <div class="bg-white rounded-xl shadow-lg border border-navy border-opacity-10 p-8">
          <div class="text-center">
            <div class="w-16 h-16 bg-olive bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-olive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 class="text-xl font-serif font-medium text-navy mb-2">Our Impact</h3>
            <div class="grid grid-cols-3 gap-4 text-center">
              <div>
                <div class="text-2xl font-bold text-olive">300+</div>
                <div class="text-sm text-navy text-opacity-70">Lives Housed</div>
              </div>
              <div>
                <div class="text-2xl font-bold text-olive">$90K+</div>
                <div class="text-sm text-navy text-opacity-70">Scholarships Paid</div>
              </div>
              <div>
                <div class="text-2xl font-bold text-olive">15</div>
                <div class="text-sm text-navy text-opacity-70">Partner Facilities</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Our Story -->
      <div class="bg-white rounded-xl shadow-sm border border-navy border-opacity-10 p-8 lg:p-12 mb-16">
        <h2 class="text-3xl font-serif font-medium text-navy mb-8 text-center">Our Story</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div class="space-y-6">
            <div>
              <h3 class="text-xl font-semibold text-navy mb-3">The Problem</h3>
              <p class="text-navy text-opacity-80">
                For many in recovery, finding stable housing is the biggest barrier to success. Traditional housing
                assistance programs are often slow, bureaucratic, and insufficient for the unique needs of those
                rebuilding their lives.
              </p>
            </div>

            <div>
              <h3 class="text-xl font-semibold text-navy mb-3">Our Solution</h3>
              <p class="text-navy text-opacity-80">
                We created an automated scholarship system that connects qualified individuals with verified sober
                living facilities within minutes, not months. Our technology streamlines the process while maintaining
                the highest standards of care and privacy.
              </p>
            </div>

            <div>
              <h3 class="text-xl font-semibold text-navy mb-3">The Future</h3>
              <p class="text-navy text-opacity-80">
                We're expanding our network of partner facilities and developing new programs to serve more communities.
                Our goal is to create a nationwide network where recovery housing is accessible to everyone who needs
                it.
              </p>
            </div>
          </div>

          <div class="space-y-6">
            <div class="bg-cream bg-opacity-50 rounded-lg p-6">
              <h4 class="font-semibold text-navy mb-2">Founded in 2024</h4>
              <p class="text-sm text-navy text-opacity-70">
                Metzler Foundations was established with a vision to modernize recovery housing support through
                technology and innovation.
              </p>
            </div>

            <div class="bg-cream bg-opacity-50 rounded-lg p-6">
              <h4 class="font-semibold text-navy mb-2">HIPAA Compliant</h4>
              <p class="text-sm text-navy text-opacity-70">
                We maintain the highest standards of privacy and security, fully complying with healthcare privacy
                regulations.
              </p>
            </div>

            <div class="bg-cream bg-opacity-50 rounded-lg p-6">
              <h4 class="font-semibold text-navy mb-2">Technology-Driven</h4>
              <p class="text-sm text-navy text-opacity-70">
                Our automated systems ensure fast, fair, and transparent processing while maintaining personal
                connections where they matter most.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Team Section -->
      <div class="text-center mb-16">
        <h2 class="text-3xl font-serif font-medium text-navy mb-8">Our Team</h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-6">
            <div class="w-20 h-20 bg-olive bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-10 h-10 text-olive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-navy mb-2">Leadership Team</h3>
            <p class="text-navy text-opacity-70 text-sm">
              Experienced professionals in recovery services, technology, and nonprofit management.
            </p>
          </div>

          <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-6">
            <div class="w-20 h-20 bg-olive bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-10 h-10 text-olive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-navy mb-2">Recovery Experts</h3>
            <p class="text-navy text-opacity-70 text-sm">
              Certified addiction counselors and recovery coaches with years of direct service experience.
            </p>
          </div>

          <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-6">
            <div class="w-20 h-20 bg-olive bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-10 h-10 text-olive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-navy mb-2">Technology Team</h3>
            <p class="text-navy text-opacity-70 text-sm">
              Engineers and developers building secure, scalable systems for social impact.
            </p>
          </div>
        </div>
      </div>

      <!-- Call to Action -->
      <div class="bg-navy bg-opacity-5 rounded-xl p-8 lg:p-12 text-center border border-navy border-opacity-10">
        <h2 class="text-3xl font-serif font-medium text-navy mb-4">Join Our Mission</h2>
        <p class="text-lg text-navy text-opacity-80 mb-8 max-w-2xl mx-auto">
          Whether you're seeking housing support, want to partner with us, or simply want to help, there are many ways
          to be part of creating housing stability in recovery.
        </p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/get-aid" class="btn-primary"> Apply for Support </a>
          <a href="/give-support" class="btn-secondary"> Ways to Help </a>
          <a href="/partners" class="btn-gold"> Partner With Us </a>
        </div>
      </div>
    </div>
  </section>
</div>
