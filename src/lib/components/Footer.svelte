<script lang="ts">
  import MetzlerBridgeLogo from '$lib/MetzlerBridgeLogo.svelte'

  // Footer navigation sections
  const footerSections = [
    {
      title: 'Services',
      links: [
        { text: 'Get Financial Aid', href: '/get-aid' },
        { text: 'Give Support', href: '/give-support' },
        { text: 'Colorado Recovery Resources', href: '/resources/colorado' },
        { text: 'Our Impact', href: '/impact' }
      ]
    },
    {
      title: 'Recovery Resources',
      links: [
        { text: 'Colorado Rehab Programs', href: '/resources/colorado-rehab' },
        { text: 'Colorado Detox Centers', href: '/resources/colorado-detox' },
        { text: 'Sober Living Homes', href: '/resources/colorado-sober-living' },
        { text: 'Recovery Support', href: '/resources/colorado' }
      ]
    },
    {
      title: 'About',
      links: [
        { text: 'Our Mission', href: '/impact' },
        { text: 'Contact Us', href: '/contact' },
        { text: 'Partners', href: '/partners' },
        { text: 'Careers', href: '/careers' }
      ]
    },
    {
      title: 'Legal',
      links: [
        { text: 'Privacy Policy', href: '/privacy-policy' },
        { text: 'Terms & Conditions', href: '/terms-and-conditions' },
        { text: 'Cookie Policy', href: '/cookie-policy' },
        { text: 'Accessibility', href: '/accessibility' }
      ]
    }
  ]

  const socialLinks = [
    { name: 'Facebook', href: '#', icon: 'facebook' },
    { name: 'Twitter', href: '#', icon: 'twitter' },
    { name: 'LinkedIn', href: '#', icon: 'linkedin' }
  ]
</script>

<footer class="bg-cream border-t border-navy border-opacity-10">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- Main footer content -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-8">
      <!-- Brand section -->
      <div class="lg:col-span-2">
        <div class="flex items-center space-x-3 mb-4">
          <MetzlerBridgeLogo className="w-8 h-8 text-navy" />
          <span class="text-xl font-serif font-medium text-navy">Metzler Foundations</span>
        </div>
        <p class="text-navy text-opacity-80 mb-4 max-w-md">
          Providing dignified housing support for individuals in recovery from addiction. Fast approval, direct
          payments, and compassionate care.
        </p>
        <div class="flex space-x-4">
          {#each socialLinks as social}
            <a
              href={social.href}
              class="text-navy text-opacity-60 hover:text-olive transition-colors"
              aria-label={social.name}
            >
              <span class="sr-only">{social.name}</span>
              <!-- Social icons would go here -->
              <div class="w-6 h-6 bg-navy bg-opacity-10 rounded-full flex items-center justify-center">
                <span class="text-xs font-bold text-navy">{social.icon.charAt(0).toUpperCase()}</span>
              </div>
            </a>
          {/each}
        </div>
      </div>

      <!-- Navigation sections -->
      {#each footerSections as section}
        <div>
          <h3 class="text-sm font-semibold text-navy mb-4 uppercase tracking-wider">
            {section.title}
          </h3>
          <ul class="space-y-3">
            {#each section.links as link}
              <li>
                <a href={link.href} class="text-navy text-opacity-80 hover:text-olive transition-colors text-sm">
                  {link.text}
                </a>
              </li>
            {/each}
          </ul>
        </div>
      {/each}
    </div>

    <!-- Newsletter signup -->
    <div class="border-t border-navy border-opacity-10 pt-8 mb-8">
      <div class="max-w-md">
        <h3 class="text-lg font-medium text-navy mb-2">Stay Updated</h3>
        <p class="text-navy text-opacity-70 text-sm mb-4">Get updates on new recovery resources and success stories.</p>
        <form class="flex gap-2">
          <input
            type="email"
            placeholder="Enter your email"
            class="flex-1 px-3 py-2 text-sm border border-navy border-opacity-20 rounded-md focus:outline-none focus:ring-2 focus:ring-olive focus:border-olive"
            required
          />
          <button
            type="submit"
            class="px-4 py-2 bg-olive text-cream text-sm font-medium rounded-md hover:bg-opacity-90 transition-colors focus:outline-none focus:ring-2 focus:ring-olive focus:ring-offset-2"
          >
            Subscribe
          </button>
        </form>
      </div>
    </div>

    <!-- Bottom section -->
    <div class="border-t border-navy border-opacity-10 pt-8">
      <div class="flex flex-col md:flex-row justify-between items-center">
        <div class="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 mb-4 md:mb-0">
          <p class="text-sm text-navy text-opacity-80">
            © {new Date().getFullYear()} Metzler Foundations. All rights reserved.
          </p>
          <div class="flex items-center space-x-4 text-xs text-navy text-opacity-70">
            <span>HIPAA Compliant</span>
            <span>•</span>
            <span>42 CFR Part 2 Compliant</span>
            <span>•</span>
            <span>501(c)(3) Nonprofit</span>
          </div>
        </div>

        <div class="flex items-center space-x-6">
          <a href="/privacy" class="text-xs text-navy text-opacity-80 hover:text-olive transition-colors"> Privacy </a>
          <a href="/terms" class="text-xs text-navy text-opacity-80 hover:text-olive transition-colors"> Terms </a>
          <a href="/cookie-policy" class="text-xs text-navy text-opacity-80 hover:text-olive transition-colors">
            Cookie Policy
          </a>
          <a href="/contact" class="text-xs text-navy text-opacity-80 hover:text-olive transition-colors"> Contact </a>
        </div>
      </div>
    </div>
  </div>
</footer>
