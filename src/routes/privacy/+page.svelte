<script lang="ts">
  import MetzlerBridgeLogo from '$lib/MetzlerBridgeLogo.svelte'
  import { goto } from '$app/navigation'
</script>

<svelte:head>
  <title>Bulletproof HIPAA Privacy Policy & Data Protection Notice - Metzler Foundations</title>
  <meta
    name="description"
    content="Maximum protection HIPAA Privacy Policy, GDPR/CCPA compliance, data security, and privacy rights for addiction recovery housing services. Comprehensive data protection."
  />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="https://metzlerfoundations.org/privacy" />
</svelte:head>

<div class="min-h-screen bg-cream text-navy">
  <!-- Emergency Notice Banner -->
  <div class="bg-red-600 text-white px-4 py-3">
    <div class="max-w-7xl mx-auto flex items-center justify-between">
      <div class="flex items-center space-x-2">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        <span class="font-semibold">PRIVACY EMERGENCY:</span>
        <span class="text-sm">Data breach? Contact us immediately at privacy@metzlerfoundations.org or call (555) 123-4567</span>
      </div>
      <button class="text-white hover:text-gray-200 text-sm font-medium" on:click={() => window.scrollTo({top: document.getElementById('breach-response')?.offsetTop || 0, behavior: 'smooth'})}>
        Breach Response →
      </button>
    </div>
  </div>

  <!-- Header -->
  <header class="bg-cream border-b border-navy border-opacity-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div class="flex justify-between items-center">
        <button on:click={() => goto('/')} class="flex items-center space-x-2">
          <MetzlerBridgeLogo className="w-8 h-8 text-navy" />
          <span class="text-xl font-serif font-medium text-navy">Metzler Foundations</span>
        </button>
        <nav class="hidden md:flex space-x-4">
          <a href="/get-aid" class="text-navy hover:text-olive transition-colors duration-200 font-medium">Get Aid</a>
          <a href="/give-support" class="text-navy hover:text-olive transition-colors duration-200 font-medium">Give Support</a>
          <a href="/impact" class="text-navy hover:text-olive transition-colors duration-200 font-medium">Impact</a>
        </nav>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- Page Header -->
    <div class="text-center mb-12">
      <h1 class="text-4xl md:text-6xl font-serif font-medium text-navy mb-6">
        Bulletproof HIPAA Privacy Policy
      </h1>
      <p class="text-xl text-navy text-opacity-80 mb-4">Maximum Data Protection & Privacy Rights</p>
      <div class="flex flex-wrap justify-center gap-2 mb-4">
        <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">HIPAA Compliant</span>
        <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">GDPR Ready</span>
        <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">CCPA Compliant</span>
        <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">42 CFR Part 2</span>
        <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">Colorado Privacy Act</span>
      </div>
      <p class="text-sm text-navy text-opacity-60">Effective Date: January 1, 2025 | Last Updated: November 17, 2025 | Version 2.0</p>
    </div>

    <!-- Critical Privacy Notice -->
    <div class="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8">
      <div class="flex items-start space-x-3">
        <svg class="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <div>
          <h3 class="text-lg font-semibold text-blue-800 mb-2">CRITICAL PRIVACY NOTICE</h3>
          <p class="text-blue-700 text-sm mb-3">
            This is a comprehensive, maximum-protection privacy policy that exceeds legal requirements. 
            We implement military-grade security measures and provide you with extensive privacy rights. 
            Your protected health information (PHI) receives the highest level of protection under HIPAA, 
            42 CFR Part 2, and applicable state privacy laws.
          </p>
          <div class="flex flex-wrap gap-2">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Zero Data Selling</span>
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Maximum Encryption</span>
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">Audit Logging</span>
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Access Controls</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced Table of Contents -->
    <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-6 mb-8">
      <h2 class="text-2xl font-medium text-navy mb-6">Privacy Policy Navigation</h2>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <h3 class="font-semibold text-navy mb-2">HIPAA & Healthcare Privacy</h3>
          <ul class="space-y-1 text-sm text-navy text-opacity-80">
            <li><a href="#notice-privacy-practices" class="hover:text-olive transition-colors">Notice of Privacy Practices</a></li>
            <li><a href="#phi-protection" class="hover:text-olive transition-colors">PHI Protection Standards</a></li>
            <li><a href="#42-cfr-part-2" class="hover:text-olive transition-colors">42 CFR Part 2 Compliance</a></li>
            <li><a href="#business-associates" class="hover:text-olive transition-colors">Business Associate Agreements</a></li>
          </ul>
        </div>
        <div>
          <h3 class="font-semibold text-navy mb-2">Data Rights & Controls</h3>
          <ul class="space-y-1 text-sm text-navy text-opacity-80">
            <li><a href="#your-rights" class="hover:text-olive transition-colors">Your Privacy Rights</a></li>
            <li><a href="#data-access" class="hover:text-olive transition-colors">Data Access & Portability</a></li>
            <li><a href="#data-deletion" class="hover:text-olive transition-colors">Right to Deletion</a></li>
            <li><a href="#consent-management" class="hover:text-olive transition-colors">Consent Management</a></li>
          </ul>
        </div>
        <div>
          <h3 class="font-semibold text-navy mb-2">Security & Compliance</h3>
          <ul class="space-y-1 text-sm text-navy text-opacity-80">
            <li><a href="#data-security" class="hover:text-olive transition-colors">Data Security Measures</a></li>
            <li><a href="#breach-response" class="hover:text-olive transition-colors">Breach Response</a></li>
            <li><a href="#gdpr-compliance" class="hover:text-olive transition-colors">GDPR Compliance</a></li>
            <li><a href="#ccpa-compliance" class="hover:text-olive transition-colors">CCPA Compliance</a></li>
          </ul>
        </div>
      </div>
    </div>

    <!-- SECTION 1: HIPAA Notice of Privacy Practices -->
    <section id="notice-privacy-practices" class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-8 mb-8">
      <h2 class="text-3xl font-serif font-medium text-navy mb-6">HIPAA Notice of Privacy Practices</h2>

      <div class="prose prose-lg max-w-none text-navy text-opacity-90">
        <div class="bg-green-50 border-l-4 border-green-500 p-6 mb-6">
          <h3 class="font-semibold text-green-800 mb-2">HIPAA COMPLIANCE CERTIFICATION</h3>
          <p class="text-green-700 text-sm mb-2">
            Metzler Foundations maintains full compliance with the Health Insurance Portability and Accountability Act (HIPAA) 
            and implements security measures that exceed regulatory requirements.
          </p>
          <div class="flex flex-wrap gap-2">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Administrative Safeguards</span>
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Physical Safeguards</span>
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Technical Safeguards</span>
          </div>
        </div>

        <p class="mb-4">
          <strong class="text-navy">Metzler Foundations</strong> is required by federal law to maintain the privacy of your 
          Protected Health Information (PHI) and to provide you with this detailed Notice of our legal duties and privacy 
          practices regarding your PHI. We must follow the privacy practices described in this Notice while it is in effect.
        </p>

        <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 my-6">
          <h3 class="font-semibold text-blue-800 mb-2">What is Protected Health Information (PHI)?</h3>
          <p class="mb-0 text-blue-700 text-sm">
            PHI includes any information about your health, healthcare services, or payment for healthcare services that 
            can be linked to you. This includes your name, address, date of birth, Social Security Number, medical records, 
            treatment history, substance use disorder information, mental health records, and any other health-related information.
          </p>
        </div>

        <div class="bg-red-50 border border-red-200 rounded-lg p-6 my-6">
          <h3 class="font-semibold text-red-800 mb-2">YOUR RIGHTS UNDER HIPAA - YOU HAVE THE RIGHT TO:</h3>
          <ul class="list-disc list-inside space-y-2 text-red-700 text-sm">
            <li><strong>Request restrictions</strong> on uses and disclosures of your PHI</li>
            <li><strong>Request confidential communications</strong> at alternative locations or through alternative means</li>
            <li><strong>Inspect and copy</strong> your PHI (fees may apply for copying)</li>
            <li><strong>Request amendments</strong> to your PHI if you believe it is incomplete or inaccurate</li>
            <li><strong>Receive an accounting</strong> of disclosures of your PHI</li>
            <li><strong>Receive a paper copy</strong> of this Notice upon request</li>
            <li><strong>Be notified</strong> following a breach of your unsecured PHI</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- SECTION 2: 42 CFR Part 2 Enhanced Protection -->
    <section id="42-cfr-part-2" class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-8 mb-8">
      <h2 class="text-3xl font-serif font-medium text-navy mb-6">42 CFR Part 2 - Substance Use Disorder Records</h2>
      
      <div class="bg-red-50 border-l-4 border-red-500 p-6 mb-6">
        <div class="flex items-start space-x-3">
          <svg class="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div>
            <h3 class="text-lg font-semibold text-red-800 mb-2">FEDERAL CONFIDENTIALITY PROTECTIONS</h3>
            <p class="text-red-700 text-sm mb-2">
              Federal law (42 CFR Part 2) and Colorado state law protect the confidentiality of substance use disorder 
              patient records. These protections are STRONGER than HIPAA protections.
            </p>
            <div class="flex flex-wrap gap-2">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Cannot be redisclosed</span>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Requires specific consent</span>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Court order required</span>
            </div>
          </div>
        </div>
      </div>

      <div class="grid md:grid-cols-2 gap-6">
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 class="font-semibold text-blue-800 mb-3">Special Protections Include:</h3>
          <ul class="list-disc list-inside space-y-2 text-blue-700 text-sm">
            <li>Cannot be disclosed without your specific written consent</li>
            <li>Cannot be used in criminal prosecutions without court order</li>
            <li>Cannot be redisclosed by receiving parties</li>
            <li>Requires separate consent from general medical records</li>
            <li>Applies to all records relating to substance use disorder treatment</li>
          </ul>
        </div>

        <div class="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <h3 class="font-semibold text-purple-800 mb-3">When We Can Disclose (Limited):</h3>
          <ul class="list-disc list-inside space-y-2 text-purple-700 text-sm">
            <li>Medical emergencies (with specific limitations)</li>
            <li>Scientific research (with IRB approval)</li>
            <li>Audit and evaluation activities</li>
            <li>Qualified service organizations</li>
            <li>Crimes on program premises (with limitations)</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- SECTION 3: Data Security - Military Grade -->
    <section id="data-security" class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-8 mb-8">
      <h2 class="text-3xl font-serif font-medium text-navy mb-6">Military-Grade Data Security</h2>

      <div class="grid md:grid-cols-3 gap-6 mb-8">
        <div class="text-center bg-green-50 border border-green-200 rounded-lg p-6">
          <div class="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 class="font-semibold text-green-800 mb-2">AES-256 Encryption</h3>
          <p class="text-sm text-green-700">All data encrypted at rest and in transit using military-grade AES-256 encryption</p>
        </div>

        <div class="text-center bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div class="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 class="font-semibold text-blue-800 mb-2">Zero-Trust Architecture</h3>
          <p class="text-sm text-blue-700">Role-based access controls with multi-factor authentication and continuous verification</p>
        </div>

        <div class="text-center bg-purple-50 border border-purple-200 rounded-lg p-6">
          <div class="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 class="font-semibold text-purple-800 mb-2">Audit Logging</h3>
          <p class="text-sm text-purple-700">Complete audit trails of all data access with immutable logging and monitoring</p>
        </div>
      </div>

      <div class="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 class="font-semibold text-gray-800 mb-4">Security Certifications & Compliance</h3>
        <div class="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <h4 class="font-medium mb-2">Technical Safeguards:</h4>
            <ul class="list-disc list-inside space-y-1">
              <li>End-to-end encryption (AES-256)</li>
              <li>TLS 1.3 for all data transmission</li>
              <li>Multi-factor authentication required</li>
              <li>Automatic session timeouts</li>
              <li>Secure backup and disaster recovery</li>
            </ul>
          </div>
          <div>
            <h4 class="font-medium mb-2">Administrative Safeguards:</h4>
            <ul class="list-disc list-inside space-y-1">
              <li>Privacy officer designation</li>
              <li>Workforce training and sanctions</li>
              <li>Access management and authorization</li>
              <li>Security incident procedures</li>
              <li>Business associate agreements</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 4: GDPR & CCPA Compliance -->
    <section id="gdpr-compliance" class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-8 mb-8">
      <h2 class="text-3xl font-serif font-medium text-navy mb-6">GDPR & CCPA Compliance - Maximum Rights</h2>

      <div class="grid md:grid-cols-2 gap-8">
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div class="flex items-center mb-4">
            <svg class="w-8 h-8 text-blue-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 class="text-xl font-semibold text-blue-800">GDPR Rights (EU Residents)</h3>
          </div>
          <ul class="list-disc list-inside space-y-2 text-blue-700 text-sm">
            <li><strong>Right to Access:</strong> Obtain confirmation and copy of personal data</li>
            <li><strong>Right to Rectification:</strong> Correct inaccurate personal data</li>
            <li><strong>Right to Erasure:</strong> Request deletion of personal data</li>
            <li><strong>Right to Restrict:</strong> Limit processing of personal data</li>
            <li><strong>Right to Portability:</strong> Receive data in structured format</li>
            <li><strong>Right to Object:</strong> Object to processing of personal data</li>
            <li><strong>Rights to Automated Decision:</strong> Object to automated decisions</li>
          </ul>
        </div>

        <div class="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <div class="flex items-center mb-4">
            <svg class="w-8 h-8 text-purple-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 class="text-xl font-semibold text-purple-800">CCPA Rights (California Residents)</h3>
          </div>
          <ul class="list-disc list-inside space-y-2 text-purple-700 text-sm">
            <li><strong>Right to Know:</strong> Categories and specific pieces of personal information</li>
            <li><strong>Right to Delete:</strong> Request deletion of personal information</li>
            <li><strong>Right to Opt-Out:</strong> Opt-out of sale of personal information</li>
            <li><strong>Right to Non-Discrimination:</strong> No discrimination for exercising rights</li>
            <li><strong>Right to Limit:</strong> Limit use of sensitive personal information</li>
            <li><strong>Right to Correct:</strong> Correct inaccurate personal information</li>
          </ul>
        </div>
      </div>

      <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-6">
        <h3 class="font-semibold text-yellow-800 mb-3">Data Selling Disclosure - WE DO NOT SELL DATA</h3>
        <p class="text-yellow-700 text-sm mb-3">
          <strong>Metzler Foundations has never sold personal data and will never sell personal data.</strong> 
          We do not sell personal information of minors under 16 years of age without affirmative authorization.
        </p>
        <div class="flex flex-wrap gap-2">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Zero Data Selling</span>
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">No Third-Party Monetization</span>
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Privacy-First Business Model</span>
        </div>
      </div>
    </section>

    <!-- SECTION 5: Data Breach Response -->
    <section id="breach-response" class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-8 mb-8">
      <h2 class="text-3xl font-serif font-medium text-navy mb-6">Data Breach Response & Notification</h2>

      <div class="bg-red-50 border-l-4 border-red-500 p-6 mb-6">
        <div class="flex items-start space-x-3">
          <svg class="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div>
            <h3 class="text-lg font-semibold text-red-800 mb-2">IMMEDIATE BREACH RESPONSE</h3>
            <p class="text-red-700 text-sm mb-2">
              In the unlikely event of a data breach, we have implemented immediate response procedures to protect your information 
              and notify you as required by law.
            </p>
            <p class="text-red-700 text-sm font-semibold">
              24/7 Breach Hotline: (555) 123-4567 | Email: breach@metzlerfoundations.org
            </p>
          </div>
        </div>
      </div>

      <div class="grid md:grid-cols-2 gap-6">
        <div class="bg-white border border-gray-200 rounded-lg p-6">
          <h3 class="font-semibold text-gray-800 mb-3">Breach Notification Timeline</h3>
          <ul class="list-disc list-inside space-y-2 text-gray-700 text-sm">
            <li><strong>Immediate:</strong> Breach containment and assessment</li>
            <li><strong>24 hours:</strong> Internal incident response team activated</li>
            <li><strong>48 hours:</strong> Risk assessment completed</li>
            <li><strong>60 days:</strong> Individual notifications sent (if required)</li>
            <li><strong>60 days:</strong> Regulatory notifications filed</li>
            <li><strong>Ongoing:</strong> Monitoring and follow-up</li>
          </ul>
        </div>

        <div class="bg-white border border-gray-200 rounded-lg p-6">
          <h3 class="font-semibold text-gray-800 mb-3">Notification Requirements</h3>
          <ul class="list-disc list-inside space-y-2 text-gray-700 text-sm">
            <li>Individual written notice (first-class mail)</li>
            <li>Email notice (if consented)</li>
            <li>Substitute notice (if contact info unavailable)</li>
            <li>Media notice (for breaches affecting 500+)</li>
            <li>Regulatory notice to HHS</li>
            <li>State attorney general notifications</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- SECTION 6: Contact & Rights Exercise -->
    <section class="bg-navy bg-opacity-90 text-cream rounded-lg p-8 mb-8">
      <h2 class="text-3xl font-serif font-medium mb-6 text-center">Exercise Your Privacy Rights</h2>
      
      <div class="grid md:grid-cols-3 gap-6">
        <div class="text-center">
          <div class="w-16 h-16 bg-cream bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-cream" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 class="font-semibold mb-2">Privacy Officer</h3>
          <p class="text-sm text-cream text-opacity-80 mb-2">privacy@metzlerfoundations.org</p>
          <p class="text-sm text-cream text-opacity-80">(555) 123-4567</p>
        </div>

        <div class="text-center">
          <div class="w-16 h-16 bg-cream bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-cream" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 class="font-semibold mb-2">Data Protection Officer</h3>
          <p class="text-sm text-cream text-opacity-80 mb-2">dpo@metzlerfoundations.org</p>
          <p class="text-sm text-cream text-opacity-80">For EU residents</p>
        </div>

        <div class="text-center">
          <div class="w-16 h-16 bg-cream bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-cream" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 class="font-semibold mb-2">Legal Department</h3>
          <p class="text-sm text-cream text-opacity-80 mb-2">legal@metzlerfoundations.org</p>
          <p class="text-sm text-cream text-opacity-80">For legal inquiries</p>
        </div>
      </div>

      <div class="text-center mt-8">
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="mailto:privacy@metzlerfoundations.org?subject=Privacy Rights Request" class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-olive hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-olive transition-colors duration-200">
            Submit Privacy Request
          </a>
          <a href="/privacy-request" class="inline-flex items-center px-6 py-3 border border-cream border-opacity-30 text-base font-medium rounded-md text-cream bg-transparent hover:bg-cream hover:text-navy hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cream transition-colors duration-200">
            Privacy Request Form
          </a>
        </div>
        <p class="text-xs text-cream text-opacity-70 mt-4">
          We will respond to all privacy requests within 30 days as required by law.
        </p>
      </div>
    </section>

    <!-- Final Legal Notice -->
    <div class="bg-gray-100 border border-gray-300 rounded-lg p-6 text-center">
      <h3 class="font-semibold text-gray-800 mb-2">LEGAL COMPLIANCE NOTICE</h3>
      <p class="text-sm text-gray-700 mb-2">
        This Privacy Policy complies with: HIPAA, 42 CFR Part 2, GDPR, CCPA, Colorado Privacy Act, 
        and all applicable federal and state privacy laws.
      </p>
      <p class="text-xs text-gray-600">
        Last Updated: November 17, 2025 | Effective Date: January 1, 2025 | Version 2.0 | 
        Next Review: January 1, 2026
      </p>
    </div>
  </main>
</div>

<style>
  .prose { color: inherit; }
  .prose strong { color: inherit; font-weight: 600; }
  .prose ul { color: inherit; }
  .prose li { color: inherit; }
</style>
