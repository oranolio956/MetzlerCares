<script lang="ts">
  import MetzlerBridgeLogo from '$lib/MetzlerBridgeLogo.svelte'

  // Footer navigation sections
  const footerSections = [
    {
      title: 'Platform',
      links: [
        { text: 'Solutions', href: '/solutions' },
        { text: 'Outcomes Data', href: '/impact' },
        { text: 'Partner Portal', href: '/partners' },
        { text: 'Facility Network', href: '/partners/facility-network' }
      ]
    },
    {
      title: 'Company',
      links: [
        { text: 'Governance', href: '/about' },
        { text: 'Investors', href: '/investors' },
        { text: 'Careers', href: '/careers' },
        { text: 'Contact', href: '/contact' }
      ]
    },
    {
      title: 'Community',
      links: [
        { text: 'Get Financial Aid', href: '/get-aid' },
        { text: 'Donate', href: '/give-support' },
        { text: 'Colorado Recovery Resources', href: '/resources/colorado' },
        { text: 'Sober Living Directory', href: '/resources/colorado-sober-living' }
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
    { name: 'LinkedIn', href: '#', icon: 'linkedin' },
    { name: 'Twitter', href: '#', icon: 'twitter' }
  ]
</script>

<footer class="bg-white border-t border-gray-200 font-sans">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- Main footer content -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
      <!-- Brand section -->
      <div class="lg:col-span-2">
        <div class="flex items-center space-x-3 mb-4">
          <MetzlerBridgeLogo className="w-8 h-8 text-forest-green" />
          <div>
             <span class="block text-xl font-bold text-charcoal">Metzler Cares</span>
             <span class="text-xs text-gray-500">Powered by Metzler Foundations</span>
          </div>
        </div>
        <p class="text-gray-600 mb-6 max-w-md text-sm leading-relaxed">
          The operating system for sustainable recovery. We combine certified peer coaching with AI-driven engagement technology to deliver measurable outcomes.
        </p>
        <div class="flex space-x-4">
          {#each socialLinks as social}
            <a
              href={social.href}
              class="text-gray-600 hover:text-forest-green transition-colors"
              aria-label={social.name}
            >
              <span class="sr-only">{social.name}</span>
              <div class="w-8 h-8 bg-gray-100 rounded flex items-center justify-center hover:bg-green-100">
                <span class="text-xs font-bold text-charcoal">{social.icon.charAt(0).toUpperCase()}</span>
              </div>
            </a>
          {/each}
        </div>
      </div>

      <!-- Navigation sections -->
      {#each footerSections as section}
        <div>
          <h3 class="text-sm font-bold text-charcoal mb-4 uppercase tracking-wider">
            {section.title}
          </h3>
          <ul class="space-y-3">
            {#each section.links as link}
              <li>
                <a href={link.href} class="text-gray-600 hover:text-forest-green transition-colors text-sm">
                  {link.text}
                </a>
              </li>
            {/each}
          </ul>
        </div>
      {/each}
    </div>

    <!-- Compliance & Disclaimers (Critical for RSSO/Tech Pivot) -->
    <div class="border-t border-gray-200 pt-8 pb-8">
       <div class="bg-gray-50 p-6 rounded-lg border border-gray-100">
          <h4 class="text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Regulatory Disclaimers</h4>
          <p class="text-xs text-gray-500 mb-2">
             <strong>RSSO Licensure:</strong> Metzler Cares is a licensed Recovery Support Services Organization (RSSO) in the State of Colorado.
          </p>
          <p class="text-xs text-gray-500 mb-2">
             <strong>Non-Clinical Service:</strong> Peer Support Professionals provide recovery coaching and mentorship. They do not provide clinical therapy, medical diagnosis, or psychiatric treatment.
          </p>
          <p class="text-xs text-gray-500">
             <strong>Data Privacy:</strong> We are compliant with HIPAA Security Rules and 42 CFR Part 2 regarding the confidentiality of substance use disorder patient records.
          </p>
       </div>
    </div>

    <!-- Bottom section -->
    <div class="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
        <div class="mb-4 md:mb-0 text-sm text-gray-600">
          © {new Date().getFullYear()} Metzler Foundations (dba Metzler Cares). All rights reserved.
        </div>
        
        <div class="flex items-center space-x-4 text-xs text-gray-500">
           <span class="flex items-center"><div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div> System Status: Operational</span>
        </div>
    </div>
  </div>
</footer>
