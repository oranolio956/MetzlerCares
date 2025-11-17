<script lang="ts">
  import MetzlerBridgeLogo from '$lib/MetzlerBridgeLogo.svelte'
  import { goto } from '$app/navigation'
</script>

<svelte:head>
  <title>HIPAA Privacy Policy & Notice of Privacy Practices - Metzler Foundations</title>
  <meta
    name="description"
    content="HIPAA-compliant privacy policy and notice of privacy practices for Metzler Foundations. Learn how we protect your health information."
  />
</svelte:head>

<div class="min-h-screen bg-cream text-navy">
  <!-- Header -->
  <header class="bg-cream border-b border-navy border-opacity-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div class="flex justify-between items-center">
        <button onclick={() => goto('/')} class="flex items-center space-x-2">
          <MetzlerBridgeLogo className="w-8 h-8 text-navy" />
          <span class="text-xl font-serif font-medium text-navy">Metzler Foundations</span>
        </button>
        <nav class="hidden md:flex space-x-4">
          <a href="/get-aid" class="text-navy hover:text-olive transition-colors duration-200 font-medium">Get Aid</a>
          <a href="/give-support" class="text-navy hover:text-olive transition-colors duration-200 font-medium"
            >Give Support</a
          >
          <a href="/impact" class="text-navy hover:text-olive transition-colors duration-200 font-medium">Impact</a>
        </nav>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- Page Header -->
    <div class="text-center mb-12">
      <h1 class="text-4xl md:text-5xl font-serif font-medium text-navy mb-6">
        HIPAA Privacy Policy & Notice of Privacy Practices
      </h1>
      <p class="text-xl text-navy text-opacity-80 mb-4">How We Protect Your Health Information</p>
      <p class="text-sm text-navy text-opacity-80">Effective Date: January 1, 2025 | Last Updated: November 16, 2025</p>
    </div>

    <!-- Table of Contents -->
    <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-6 mb-8">
      <h2 class="text-2xl font-medium text-navy mb-4">Table of Contents</h2>
      <nav aria-label="Privacy policy sections">
        <ul class="space-y-2 text-navy text-opacity-80">
          <li>
            <a href="#notice-privacy-practices" class="hover:text-olive transition-colors"
              >1. Notice of Privacy Practices</a
            >
          </li>
          <li>
            <a href="#how-we-use-info" class="hover:text-olive transition-colors"
              >2. How We Use and Disclose Your Information</a
            >
          </li>
          <li>
            <a href="#your-rights" class="hover:text-olive transition-colors"
              >3. Your Rights Regarding Your Health Information</a
            >
          </li>
          <li>
            <a href="#data-security" class="hover:text-olive transition-colors">4. How We Protect Your Information</a>
          </li>
          <li>
            <a href="#complaints" class="hover:text-olive transition-colors">5. Complaints and Contact Information</a>
          </li>
          <li><a href="#changes" class="hover:text-olive transition-colors">6. Changes to This Notice</a></li>
        </ul>
      </nav>
    </div>

    <!-- Notice of Privacy Practices -->
    <section
      id="notice-privacy-practices"
      class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-8 mb-8"
    >
      <h2 class="text-3xl font-serif font-medium text-navy mb-6">Notice of Privacy Practices</h2>

      <div class="prose prose-lg max-w-none text-navy text-opacity-90">
        <p class="mb-4">
          <strong class="text-navy">Metzler Foundations</strong> is committed to protecting the privacy of your health information.
          This Notice of Privacy Practices describes how we collect, use, and protect your protected health information (PHI)
          in compliance with the Health Insurance Portability and Accountability Act (HIPAA), the Colorado Privacy Act (CPA),
          and 42 CFR Part 2 regulations governing substance use disorder records.
        </p>

        <div class="bg-olive bg-opacity-10 border-l-4 border-olive p-4 my-6">
          <h3 class="font-semibold text-navy mb-2">What is Protected Health Information (PHI)?</h3>
          <p class="mb-0">
            PHI includes any information about your health, healthcare services, or payment for healthcare services that
            can be linked to you. This includes your name, address, date of birth, Social Security Number, medical
            records, and any other health-related information.
          </p>
        </div>

        <p>
          We are required by law to maintain the privacy of your PHI and to provide you with this Notice of our legal
          duties and privacy practices. We must follow the privacy practices described in this Notice while it is in
          effect.
        </p>
      </div>
    </section>

    <!-- How We Use Information -->
    <section id="how-we-use-info" class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-8 mb-8">
      <h2 class="text-3xl font-serif font-medium text-navy mb-6">How We Use and Disclose Your Information</h2>

      <div class="space-y-6">
        <div>
          <h3 class="text-xl font-semibold text-navy mb-3">Required by Law (No Consent Needed)</h3>
          <ul class="list-disc list-inside space-y-2 text-navy text-opacity-80 ml-4">
            <li>Emergency situations where disclosure is necessary to prevent serious harm</li>
            <li>Law enforcement requests with proper legal authorization</li>
            <li>Court orders or subpoenas</li>
            <li>Public health reporting as required by law</li>
            <li>Reporting abuse, neglect, or domestic violence</li>
            <li>Workers' compensation claims</li>
          </ul>
        </div>

        <div>
          <h3 class="text-xl font-semibold text-navy mb-3">With Your Consent (Treatment, Payment, Operations)</h3>
          <ul class="list-disc list-inside space-y-2 text-navy text-opacity-80 ml-4">
            <li>
              <strong>Treatment:</strong> Coordinating your care with sober living facilities and healthcare providers
            </li>
            <li><strong>Payment:</strong> Processing scholarship payments and verifying eligibility</li>
            <li><strong>Operations:</strong> Quality improvement, program evaluation, and business management</li>
          </ul>
        </div>

        <div>
          <h3 class="text-xl font-semibold text-navy mb-3">With Explicit Authorization</h3>
          <ul class="list-disc list-inside space-y-2 text-navy text-opacity-80 ml-4">
            <li>Sharing information with family members or friends you designate</li>
            <li>Communications with your emergency contact</li>
            <li>Fundraising communications (with separate consent)</li>
            <li>Research participation (with IRB approval)</li>
          </ul>
        </div>

        <div class="bg-gold bg-opacity-10 border border-gold border-opacity-20 rounded-lg p-4">
          <h4 class="font-semibold text-navy mb-2">42 CFR Part 2 Special Protections</h4>
          <p class="text-sm text-navy text-opacity-80 mb-0">
            Records related to substance use disorder treatment receive additional federal protections. These records
            cannot be disclosed without your specific consent, even in emergency situations.
          </p>
        </div>
      </div>
    </section>

    <!-- Your Rights -->
    <section id="your-rights" class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-8 mb-8">
      <h2 class="text-3xl font-serif font-medium text-navy mb-6">Your Rights Regarding Your Health Information</h2>

      <div class="grid md:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div class="border border-navy border-opacity-20 rounded-lg p-4">
            <h3 class="font-semibold text-navy mb-2">Right to Access</h3>
            <p class="text-sm text-navy text-opacity-80">
              You have the right to inspect and obtain a copy of your PHI in our custody. We will respond within 30 days
              of your request.
            </p>
          </div>

          <div class="border border-navy border-opacity-20 rounded-lg p-4">
            <h3 class="font-semibold text-navy mb-2">Right to Amend</h3>
            <p class="text-sm text-navy text-opacity-80">
              You may request corrections to your PHI if you believe it is inaccurate or incomplete.
            </p>
          </div>

          <div class="border border-navy border-opacity-20 rounded-lg p-4">
            <h3 class="font-semibold text-navy mb-2">Right to Accounting</h3>
            <p class="text-sm text-navy text-opacity-80">
              You can request a list of disclosures of your PHI made in the past 6 years.
            </p>
          </div>
        </div>

        <div class="space-y-4">
          <div class="border border-navy border-opacity-20 rounded-lg p-4">
            <h3 class="font-semibold text-navy mb-2">Right to Request Restrictions</h3>
            <p class="text-sm text-navy text-opacity-80">
              You may request restrictions on how we use or disclose your PHI for treatment, payment, or operations.
            </p>
          </div>

          <div class="border border-navy border-opacity-20 rounded-lg p-4">
            <h3 class="font-semibold text-navy mb-2">Right to Confidential Communications</h3>
            <p class="text-sm text-navy text-opacity-80">
              You can request that we communicate with you in a confidential way (e.g., different address).
            </p>
          </div>

          <div class="border border-navy border-opacity-20 rounded-lg p-4">
            <h3 class="font-semibold text-navy mb-2">Right to Revoke Consent</h3>
            <p class="text-sm text-navy text-opacity-80">
              You may revoke consent for future uses/disclosures, though this won't affect past disclosures.
            </p>
          </div>
        </div>
      </div>

      <div class="mt-6 p-4 bg-olive bg-opacity-10 rounded-lg">
        <h4 class="font-semibold text-navy mb-2">Colorado Privacy Act Rights</h4>
        <p class="text-sm text-navy text-opacity-80">
          In addition to HIPAA rights, Colorado law gives you the right to:
        </p>
        <ul class="list-disc list-inside text-sm text-navy text-opacity-80 mt-2 space-y-1">
          <li>Know what personal data we collect and how we use it</li>
          <li>Access your personal data in a portable format</li>
          <li>Correct inaccurate personal data</li>
          <li>Delete your personal data (with exceptions for legal/compliance reasons)</li>
          <li>Opt-out of sale of personal data (we don't sell data)</li>
        </ul>
      </div>
    </section>

    <!-- Data Security -->
    <section id="data-security" class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-8 mb-8">
      <h2 class="text-3xl font-serif font-medium text-navy mb-6">How We Protect Your Information</h2>

      <div class="grid md:grid-cols-3 gap-6">
        <div class="text-center">
          <div class="w-12 h-12 bg-olive rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h3 class="font-semibold text-navy mb-2">Encryption</h3>
          <p class="text-sm text-navy text-opacity-70">
            All data is encrypted in transit and at rest using industry-standard AES-256 encryption.
          </p>
        </div>

        <div class="text-center">
          <div class="w-12 h-12 bg-olive rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <h3 class="font-semibold text-navy mb-2">Access Controls</h3>
          <p class="text-sm text-navy text-opacity-70">
            Role-based access ensures only authorized personnel can access your information.
          </p>
        </div>

        <div class="text-center">
          <div class="w-12 h-12 bg-olive rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 class="font-semibold text-navy mb-2">Audit Logging</h3>
          <p class="text-sm text-navy text-opacity-70">
            All access to your information is logged and monitored for security and compliance.
          </p>
        </div>
      </div>

      <div class="mt-8 p-4 bg-navy bg-opacity-5 rounded-lg">
        <h4 class="font-semibold text-navy mb-2">Business Associate Agreements</h4>
        <p class="text-sm text-navy text-opacity-80 mb-2">
          We have signed Business Associate Agreements (BAAs) with all service providers who handle your PHI:
        </p>
        <ul class="text-sm text-navy text-opacity-80 space-y-1">
          <li>• <strong>Supabase:</strong> Database and authentication services</li>
          <li>• <strong>Stripe:</strong> Payment processing (when implemented)</li>
          <li>• <strong>Google Workspace:</strong> Staff email and collaboration</li>
          <li>• <strong>Sanity CMS:</strong> Content management</li>
        </ul>
      </div>
    </section>

    <!-- Complaints and Contact -->
    <section id="complaints" class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-8 mb-8">
      <h2 class="text-3xl font-serif font-medium text-navy mb-6">Complaints and Contact Information</h2>

      <div class="grid md:grid-cols-2 gap-8">
        <div>
          <h3 class="text-xl font-semibold text-navy mb-4">Privacy Officer</h3>
          <div class="space-y-2 text-navy text-opacity-80">
            <p><strong>Metzler Foundations</strong></p>
            <p>Attn: Privacy Officer</p>
            <p>privacy@metzlerfoundations.org</p>
            <p>(555) 123-4567</p>
          </div>

          <div class="mt-6">
            <h4 class="font-semibold text-navy mb-2">To File a Complaint:</h4>
            <ul class="text-sm text-navy text-opacity-80 space-y-1">
              <li>• Contact our Privacy Officer</li>
              <li>• File complaint with Department of Health and Human Services</li>
              <li>• File complaint with Colorado Attorney General</li>
            </ul>
          </div>
        </div>

        <div>
          <h3 class="text-xl font-semibold text-navy mb-4">Your Rights Summary</h3>
          <div class="space-y-3">
            <div class="flex items-start space-x-3">
              <div class="w-6 h-6 bg-navy rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span class="text-cream text-xs">✓</span>
              </div>
              <div>
                <p class="font-medium text-navy text-sm">Request Access</p>
                <p class="text-xs text-navy text-opacity-70">Get copies of your PHI</p>
              </div>
            </div>

            <div class="flex items-start space-x-3">
              <div class="w-6 h-6 bg-navy rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span class="text-cream text-xs">✓</span>
              </div>
              <div>
                <p class="font-medium text-navy text-sm">Request Deletion</p>
                <p class="text-xs text-navy text-opacity-70">Remove your personal data</p>
              </div>
            </div>

            <div class="flex items-start space-x-3">
              <div class="w-6 h-6 bg-navy rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span class="text-cream text-xs">✓</span>
              </div>
              <div>
                <p class="font-medium text-navy text-sm">Revoke Consent</p>
                <p class="text-xs text-navy text-opacity-70">Stop future disclosures</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Changes to Notice -->
    <section id="changes" class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-8 mb-8">
      <h2 class="text-3xl font-serif font-medium text-navy mb-6">Changes to This Notice</h2>

      <div class="prose max-w-none text-navy text-opacity-90">
        <p class="mb-4">
          We reserve the right to change this Notice of Privacy Practices at any time. Any changes will be effective
          immediately upon posting on our website. We will notify you of any significant changes via email or mail.
        </p>

        <p class="mb-4">You can always obtain the current version of this Notice by:</p>

        <ul class="list-disc list-inside space-y-2 ml-4">
          <li>Visiting our website at metzlerfoundations.org/privacy</li>
          <li>Contacting our Privacy Officer</li>
          <li>Requesting a paper copy at any of our locations</li>
        </ul>

        <div class="mt-6 p-4 bg-olive bg-opacity-10 rounded-lg">
          <p class="text-sm text-navy text-opacity-80 mb-0">
            <strong>Last Updated:</strong> November 16, 2025<br />
            <strong>Effective Date:</strong> January 1, 2025<br />
            <strong>Notice Version:</strong> 1.0
          </p>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <div class="text-center bg-navy bg-opacity-5 rounded-lg p-8">
      <h2 class="text-2xl font-serif font-medium text-navy mb-4">Questions About Your Privacy Rights?</h2>
      <p class="text-navy text-opacity-80 mb-6 max-w-2xl mx-auto">
        We're here to help you understand and exercise your privacy rights. Contact our Privacy Officer for assistance.
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <a href="mailto:privacy@metzlerfoundations.org" class="btn-primary"> Contact Privacy Officer </a>
        <a href="/get-aid/apply" class="btn-secondary"> Apply for Aid </a>
      </div>
    </div>
  </main>
</div>

<style>
  .prose {
    color: inherit;
  }

  .prose strong {
    color: inherit;
    font-weight: 600;
  }

  .prose ul {
    color: inherit;
  }

  .prose li {
    color: inherit;
  }
</style>
