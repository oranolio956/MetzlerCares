<script lang="ts">
  import { goto } from '$app/navigation'
</script>

<svelte:head>
  <title>DMCA Compliance & Copyright Protection - Metzler Foundations</title>
  <meta name="description" content="DMCA compliance, copyright protection, and intellectual property policies for Metzler Foundations addiction recovery housing services." />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="https://metzlerfoundations.org/dmca" />
</svelte:head>

<div class="min-h-screen bg-cream text-charcoal">
  <!-- Header -->
  <header class="bg-cream border-b border-charcoal border-opacity-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div class="flex justify-between items-center">
        <button on:click={() => goto('/')} class="flex items-center space-x-2">
          <svg class="w-8 h-8 text-forest-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span class="text-xl font-semibold text-forest-green">Metzler Foundations</span>
        </button>
        <nav class="hidden md:flex space-x-4">
          <a href="/get-aid" class="text-charcoal hover:text-forest-green transition-colors duration-200 font-medium">Get Aid</a>
          <a href="/give-support" class="text-charcoal hover:text-forest-green transition-colors duration-200 font-medium">Give Support</a>
          <a href="/impact" class="text-charcoal hover:text-forest-green transition-colors duration-200 font-medium">Impact</a>
        </nav>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- Page Header -->
    <div class="text-center mb-12">
      <h1 class="text-4xl md:text-6xl font-semibold text-charcoal mb-6">
        DMCA Compliance & Copyright Protection
      </h1>
      <p class="text-xl text-charcoal text-opacity-80 mb-4">Digital Millennium Copyright Act Compliance</p>
      <div class="flex flex-wrap justify-center gap-2 mb-4">
        <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">DMCA Compliant</span>
        <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">Copyright Protected</span>
        <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">IP Rights Reserved</span>
        <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">Notice & Takedown</span>
      </div>
      <p class="text-sm text-charcoal text-opacity-60">Effective Date: November 17, 2025 | Last Updated: November 17, 2025</p>
    </div>

    <!-- Critical Notice -->
    <div class="bg-red-50 border-l-4 border-red-500 p-6 mb-8">
      <div class="flex items-start space-x-3">
        <svg class="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <div>
          <h3 class="text-lg font-semibold text-red-800 mb-2">CRITICAL COPYRIGHT NOTICE</h3>
          <p class="text-red-700 text-sm mb-3">
            All content on this website is protected by United States and international copyright laws. 
            Unauthorized use, reproduction, distribution, or modification of any content is strictly prohibited 
            and may result in civil and criminal penalties.
          </p>
          <div class="flex flex-wrap gap-2">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">© All Rights Reserved</span>
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Federal Protection</span>
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">International Treaties</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Table of Contents -->
    <div class="bg-white rounded-lg shadow-sm border border-charcoal border-opacity-10 p-6 mb-8">
      <h2 class="text-2xl font-medium text-charcoal mb-6">DMCA Policy Navigation</h2>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <h3 class="font-semibold text-charcoal mb-2">Copyright Protection</h3>
          <ul class="space-y-1 text-sm text-charcoal text-opacity-80">
            <li><a href="#copyright-notice" class="hover:text-forest-green transition-colors">Copyright Notice</a></li>
            <li><a href="#ownership" class="hover:text-forest-green transition-colors">Ownership Rights</a></li>
            <li><a href="#licensing" class="hover:text-forest-green transition-colors">Licensing Terms</a></li>
            <li><a href="#prohibited-use" class="hover:text-forest-green transition-colors">Prohibited Use</a></li>
          </ul>
        </div>
        <div>
          <h3 class="font-semibold text-charcoal mb-2">DMCA Procedures</h3>
          <ul class="space-y-1 text-sm text-navy text-opacity-80">
            <li><a href="#notice-requirements" class="hover:text-forest-green transition-colors">Notice Requirements</a></li>
            <li><a href="#takedown-process" class="hover:text-forest-green transition-colors">Takedown Process</a></li>
            <li><a href="#counter-notice" class="hover:text-olive transition-colors">Counter-Notice</a></li>
            <li><a href="#repeat-infringers" class="hover:text-olive transition-colors">Repeat Infringers</a></li>
          </ul>
        </div>
        <div>
          <h3 class="font-semibold text-navy mb-2">Legal Compliance</h3>
          <ul class="space-y-1 text-sm text-navy text-opacity-80">
            <li><a href="#legal-action" class="hover:text-olive transition-colors">Legal Action</a></li>
            <li><a href="#penalties" class="hover:text-olive transition-colors">Civil & Criminal Penalties</a></li>
            <li><a href="#jurisdiction" class="hover:text-olive transition-colors">Jurisdiction</a></li>
            <li><a href="#contact" class="hover:text-olive transition-colors">Contact Information</a></li>
          </ul>
        </div>
      </div>
    </div>

    <!-- SECTION 1: Copyright Notice -->
    <section id="copyright-notice" class="bg-white rounded-lg shadow-sm border border-charcoal border-opacity-10 p-8 mb-8">
      <h2 class="text-3xl font-semibold text-charcoal mb-6">Copyright Notice & Ownership</h2>

      <div class="bg-blue-50 border-l-4 border-blue-500 p-6 mb-6">
        <div class="flex items-start space-x-3">
          <svg class="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <div>
            <h3 class="text-lg font-semibold text-blue-800 mb-2">COMPREHENSIVE COPYRIGHT PROTECTION</h3>
            <p class="text-blue-700 text-sm mb-2">
              All content, materials, and intellectual property on this website are protected by United States copyright law, 
              international treaties, and applicable foreign laws. This includes but is not limited to text, graphics, logos, 
              images, audio, video, software, and any other content.
            </p>
            <div class="flex flex-wrap gap-2">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">17 U.S.C. § 101 et seq.</span>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Berne Convention</span>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">WIPO Treaties</span>
            </div>
          </div>
        </div>
      </div>

      <div class="prose prose-lg max-w-none text-navy text-opacity-90">
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-6 my-6">
          <h3 class="font-semibold text-gray-800 mb-3">Copyright © 2025 Metzler Foundations. All Rights Reserved.</h3>
          <p class="text-gray-700 text-sm mb-3">
            This work is protected by United States copyright law and international treaties. 
            Unauthorized reproduction, distribution, transmission, or use of any content on this website 
            is strictly prohibited and may result in civil and criminal liability.
          </p>
          <div class="flex flex-wrap gap-2">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">© 2025 Metzler Foundations</span>
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">All Rights Reserved</span>
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">International Protection</span>
          </div>
        </div>

        <h3 class="text-xl font-semibold text-charcoal mb-4">Protected Content Includes:</h3>
        <div class="grid md:grid-cols-2 gap-6">
          <div class="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 class="font-semibold text-green-800 mb-2">Text Content</h4>
            <ul class="list-disc list-inside text-green-700 text-sm space-y-1">
              <li>Website copy and articles</li>
              <li>Blog posts and testimonials</li>
              <li>Educational materials</li>
              <li>Resource guides and documentation</li>
              <li>Legal documents and policies</li>
            </ul>
          </div>

          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 class="font-semibold text-blue-800 mb-2">Visual Content</h4>
            <ul class="list-disc list-inside text-blue-700 text-sm space-y-1">
              <li>Photographs and images</li>
              <li>Graphics and illustrations</li>
              <li>Logos and trademarks</li>
              <li>Website design elements</li>
              <li>Charts and infographics</li>
            </ul>
          </div>

          <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 class="font-semibold text-purple-800 mb-2">Audio & Video</h4>
            <ul class="list-disc list-inside text-purple-700 text-sm space-y-1">
              <li>Video content and recordings</li>
              <li>Audio content and podcasts</li>
              <li>Multimedia presentations</li>
              <li>Training materials</li>
              <li>Webinar recordings</li>
            </ul>
          </div>

          <div class="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h4 class="font-semibold text-orange-800 mb-2">Software & Technology</h4>
            <ul class="list-disc list-inside text-orange-700 text-sm space-y-1">
              <li>Website code and scripts</li>
              <li>Custom applications</li>
              <li>Database structures</li>
              <li>Proprietary algorithms</li>
              <li>Technical documentation</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 2: DMCA Notice Requirements -->
    <section id="notice-requirements" class="bg-white rounded-lg shadow-sm border border-charcoal border-opacity-10 p-8 mb-8">
      <h2 class="text-3xl font-semibold text-charcoal mb-6">DMCA Notice Requirements</h2>

      <div class="bg-yellow-50 border-l-4 border-yellow-500 p-6 mb-6">
        <div class="flex items-start space-x-3">
          <svg class="w-6 h-6 text-yellow-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div>
            <h3 class="text-lg font-semibold text-yellow-800 mb-2">DMCA TAKEDOWN NOTICE REQUIREMENTS</h3>
            <p class="text-yellow-700 text-sm mb-2">
              Pursuant to 17 U.S.C. § 512(c)(3), all DMCA takedown notices must include specific information. 
              Failure to provide complete information may result in delayed processing or rejection of your notice.
            </p>
            <div class="flex flex-wrap gap-2">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">17 U.S.C. § 512(c)(3)</span>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Complete Information Required</span>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Legal Compliance</span>
            </div>
          </div>
        </div>
      </div>

      <div class="prose prose-lg max-w-none text-navy text-opacity-90">
        <h3 class="text-xl font-semibold text-charcoal mb-4">Required Information for DMCA Notices:</h3>
        
        <div class="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <h4 class="font-semibold text-red-800 mb-3">⚠️ CRITICAL: INCOMPLETE NOTICES WILL BE REJECTED</h4>
          <p class="text-red-700 text-sm mb-3">
            All DMCA notices must include ALL of the following information. Incomplete notices will not be processed 
            and may result in legal liability for false claims under 17 U.S.C. § 512(f).
          </p>
        </div>

        <div class="grid md:grid-cols-2 gap-6">
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 class="font-semibold text-blue-800 mb-3">1. Signature Requirements</h4>
            <ul class="list-disc list-inside text-blue-700 text-sm space-y-1">
              <li>Physical or electronic signature of copyright owner</li>
              <li>Signature of authorized agent acting on behalf of owner</li>
              <li>Must be legally binding signature</li>
              <li>Typed name with "Electronic Signature" notation acceptable</li>
            </ul>
          </div>

          <div class="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 class="font-semibold text-green-800 mb-3">2. Identification of Work</h4>
            <ul class="list-disc list-inside text-green-700 text-sm space-y-1">
              <li>Clear identification of copyrighted work claimed to be infringed</li>
              <li>Multiple works may be covered by single notification</li>
              <li>Include title, author, publication date if applicable</li>
              <li>Registration number if work is registered with U.S. Copyright Office</li>
            </ul>
          </div>

          <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 class="font-semibold text-purple-800 mb-3">3. Infringing Material Identification</h4>
            <ul class="list-disc list-inside text-purple-700 text-sm space-y-1">
              <li>Identification of material claimed to be infringing</li>
              <li>Specific URL or location of infringing material</li>
              <li>Information reasonably sufficient to locate material</li>
              <li>Screenshots or other evidence of infringement</li>
            </ul>
          </div>

          <div class="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h4 class="font-semibold text-orange-800 mb-3">4. Contact Information</h4>
            <ul class="list-disc list-inside text-orange-700 text-sm space-y-1">
              <li>Address, telephone number, and email address</li>
              <li>Must be complete and accurate contact information</li>
              <li>Information must be current and monitored</li>
              <li>Include time zone for telephone contact</li>
            </ul>
          </div>

          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 class="font-semibold text-yellow-800 mb-3">5. Good Faith Statement</h4>
            <ul class="list-disc list-inside text-yellow-700 text-sm space-y-1">
              <li>Statement of good faith belief of infringement</li>
              <li>Must be made under penalty of perjury</li>
              <li>Must be specific to the claimed infringement</li>
              <li>Cannot be blanket or generalized statement</li>
            </ul>
          </div>

          <div class="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 class="font-semibold text-red-800 mb-3">6. Authority Statement</h4>
            <ul class="list-disc list-inside text-red-700 text-sm space-y-1">
              <li>Statement of authority to act on behalf of owner</li>
              <li>Must be made under penalty of perjury</li>
              <li>Include basis for authority (owner, agent, etc.)</li>
              <li>Must be specific to the copyrighted work</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 3: Contact Information & Procedures -->
    <section id="contact" class="bg-white rounded-lg shadow-sm border border-charcoal border-opacity-10 p-8 mb-8">
      <h2 class="text-3xl font-serif font-medium text-navy mb-6">DMCA Contact Information</h2>

      <div class="bg-green-50 border-l-4 border-green-500 p-6 mb-6">
        <div class="flex items-start space-x-3">
          <svg class="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <div>
            <h3 class="text-lg font-semibold text-green-800 mb-2">DESIGNATED DMCA AGENT</h3>
            <p class="text-green-700 text-sm mb-2">
              All DMCA notices must be sent to our designated DMCA agent. Contact information is provided below 
              for legitimate copyright infringement claims only.
            </p>
            <div class="flex flex-wrap gap-2">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">17 U.S.C. § 512(c)(2)</span>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Designated Agent</span>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Legal Notices Only</span>
            </div>
          </div>
        </div>
      </div>

      <div class="grid md:grid-cols-2 gap-8">
        <div class="bg-white border border-gray-200 rounded-lg p-6">
          <h3 class="font-semibold text-gray-800 mb-4">DMCA Designated Agent</h3>
          <div class="space-y-3 text-sm text-gray-700">
            <div>
              <strong>Name:</strong> DMCA Compliance Officer
            </div>
            <div>
              <strong>Email:</strong> dmca@metzlerfoundations.org
            </div>
            <div>
              <strong>Address:</strong><br>
              Metzler Foundations<br>
              Attn: DMCA Compliance Officer<br>
              1234 Recovery Way<br>
              Denver, CO 80202
            </div>
            <div>
              <strong>Phone:</strong> (555) 123-4567 (M-F, 9AM-5PM MST)
            </div>
            <div>
              <strong>Fax:</strong> (555) 123-4568
            </div>
          </div>
        </div>

        <div class="bg-white border border-gray-200 rounded-lg p-6">
          <h3 class="font-semibold text-gray-800 mb-4">Notice Submission Guidelines</h3>
          <div class="space-y-3 text-sm text-gray-700">
            <div class="bg-yellow-50 border border-yellow-200 rounded p-3">
              <strong class="text-yellow-800">Preferred Method:</strong>
              <p class="text-yellow-700">Email to dmca@metzlerfoundations.org</p>
            </div>
            <div>
              <strong>Subject Line:</strong> "DMCA Takedown Notice - [Your Name/Organization]"
            </div>
            <div>
              <strong>Format:</strong> PDF or plain text preferred
            </div>
            <div>
              <strong>Response Time:</strong> 10-14 business days
            </div>
            <div>
              <strong>Confirmation:</strong> You will receive email confirmation of receipt
            </div>
          </div>
        </div>
      </div>

      <div class="bg-red-50 border border-red-200 rounded-lg p-6 mt-6">
        <h3 class="font-semibold text-red-800 mb-3">⚠️ IMPORTANT NOTICE REQUIREMENTS</h3>
        <div class="grid md:grid-cols-2 gap-4 text-sm text-red-700">
          <div>
            <h4 class="font-medium mb-2">Required Elements:</h4>
            <ul class="list-disc list-inside space-y-1">
              <li>Complete contact information</li>
              <li>Specific URL identification</li>
              <li>Copyright ownership proof</li>
              <li>Good faith statement</li>
              <li>Authority statement</li>
            </ul>
          </div>
          <div>
            <h4 class="font-medium mb-2">Consequences of False Claims:</h4>
            <ul class="list-disc list-inside space-y-1">
              <li>Civil liability under 17 U.S.C. § 512(f)</li>
              <li>Damages and attorney's fees</li>
              <li>Criminal penalties for perjury</li>
              <li>Account termination</li>
              <li>Legal action by affected parties</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 4: Legal Penalties & Enforcement -->
    <section id="legal-action" class="bg-white rounded-lg shadow-sm border border-charcoal border-opacity-10 p-8 mb-8">
      <h2 class="text-3xl font-semibold text-charcoal mb-6">Legal Penalties & Enforcement</h2>

      <div class="bg-red-50 border-l-4 border-red-500 p-6 mb-6">
        <div class="flex items-start space-x-3">
          <svg class="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div>
            <h3 class="text-lg font-semibold text-red-800 mb-2">SEVERE PENALTIES FOR COPYRIGHT INFRINGEMENT</h3>
            <p class="text-red-700 text-sm mb-2">
              Copyright infringement carries severe civil and criminal penalties under federal law. 
              Willful infringement for commercial advantage can result in felony criminal charges.
            </p>
            <div class="flex flex-wrap gap-2">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Civil Damages</span>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Criminal Penalties</span>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Felony Charges</span>
            </div>
          </div>
        </div>
      </div>

      <div class="grid md:grid-cols-2 gap-8">
        <div class="bg-white border border-gray-200 rounded-lg p-6">
          <h3 class="font-semibold text-gray-800 mb-4">Civil Penalties (17 U.S.C. § 504)</h3>
          <div class="space-y-3 text-sm text-gray-700">
            <div class="bg-yellow-50 border border-yellow-200 rounded p-3">
              <strong class="text-yellow-800">Statutory Damages:</strong>
              <p class="text-yellow-700">$750 - $30,000 per work infringed</p>
            </div>
            <div class="bg-red-50 border border-red-200 rounded p-3">
              <strong class="text-red-800">Willful Infringement:</strong>
              <p class="text-red-700">Up to $150,000 per work infringed</p>
            </div>
            <div class="bg-green-50 border border-green-200 rounded p-3">
              <strong class="text-green-800">Innocent Infringement:</strong>
              <p class="text-green-700">Minimum $200 per work infringed</p>
            </div>
            <div class="bg-blue-50 border border-blue-200 rounded p-3">
              <strong class="text-blue-800">Attorney's Fees:</strong>
              <p class="text-blue-700">Full reasonable attorney's fees and costs</p>
            </div>
          </div>
        </div>

        <div class="bg-white border border-gray-200 rounded-lg p-6">
          <h3 class="font-semibold text-gray-800 mb-4">Criminal Penalties (17 U.S.C. § 506)</h3>
          <div class="space-y-3 text-sm text-gray-700">
            <div class="bg-orange-50 border border-orange-200 rounded p-3">
              <strong class="text-orange-800">Willful Infringement:</strong>
              <p class="text-orange-700">Up to 5 years imprisonment</p>
            </div>
            <div class="bg-red-50 border border-red-200 rounded p-3">
              <strong class="text-red-800">Commercial Advantage:</strong>
              <p class="text-red-700">Up to 10 years imprisonment</p>
            </div>
            <div class="bg-purple-50 border border-purple-200 rounded p-3">
              <strong class="text-purple-800">Repeat Offenders:</strong>
              <p class="text-purple-700">Enhanced penalties apply</p>
            </div>
            <div class="bg-gray-50 border border-gray-200 rounded p-3">
              <strong class="text-gray-800">Fines:</strong>
              <p class="text-gray-700">Up to $250,000 per offense</p>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-charcoal bg-opacity-90 text-cream rounded-lg p-6 mt-6">
        <h3 class="font-semibold text-cream mb-4">ENFORCEMENT ACTIONS WE MAY TAKE:</h3>
        <div class="grid md:grid-cols-2 gap-4 text-sm text-cream text-opacity-90">
          <ul class="list-disc list-inside space-y-1">
            <li>Immediate content removal</li>
            <li>Account suspension or termination</li>
            <li>IP address blocking</li>
            <li>Legal notice issuance</li>
            <li>Law enforcement referral</li>
          </ul>
          <ul class="list-disc list-inside space-y-1">
            <li>Civil lawsuit filing</li>
            <li>Criminal complaint filing</li>
            <li>Injunction seeking</li>
            <li>Damages collection</li>
            <li>Attorney's fees recovery</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Final Notice -->
    <div class="bg-charcoal bg-opacity-90 text-cream rounded-lg p-8 text-center">
      <h2 class="text-2xl font-semibold mb-4">FINAL COPYRIGHT NOTICE</h2>
      <p class="text-cream text-opacity-90 mb-4">
        This DMCA compliance policy is part of our comprehensive legal framework. All content on this website 
        is protected by United States and international copyright laws. Unauthorized use is strictly prohibited.
      </p>
      <div class="flex flex-wrap justify-center gap-4 text-sm">
        <span class="bg-cream bg-opacity-20 px-3 py-1 rounded">© 2025 Metzler Foundations</span>
        <span class="bg-cream bg-opacity-20 px-3 py-1 rounded">All Rights Reserved</span>
        <span class="bg-cream bg-opacity-20 px-3 py-1 rounded">17 U.S.C. § 512 Compliant</span>
        <span class="bg-cream bg-opacity-20 px-3 py-1 rounded">International Protection</span>
      </div>
      <p class="text-xs text-cream text-opacity-70 mt-4">
        Last Updated: November 17, 2025 | Effective Date: November 17, 2025 | Next Review: January 1, 2026
      </p>
    </div>
  </main>
</div>