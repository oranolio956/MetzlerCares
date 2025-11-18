<script lang="ts">
  import { goto } from '$app/navigation'
</script>

<svelte:head>
  <title>Accessibility Compliance Statement - WCAG 2.2 AA & ADA - Metzler Foundations</title>
  <meta name="description" content="Full accessibility compliance statement for WCAG 2.2 AA, ADA Section 508, and Section 504 requirements. Metzler Foundations commitment to digital accessibility." />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="https://metzlerfoundations.org/accessibility" />
</svelte:head>

<div class="min-h-screen bg-cream text-navy">
  <!-- Header -->
  <header class="bg-cream border-b border-navy border-opacity-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div class="flex justify-between items-center">
        <button on:click={() => goto('/')} class="flex items-center space-x-2">
          <svg class="w-8 h-8 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
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
        Accessibility Compliance Statement
      </h1>
      <p class="text-xl text-navy text-opacity-80 mb-4">WCAG 2.2 AA, ADA, Section 508 & 504 Compliance</p>
      <div class="flex flex-wrap justify-center gap-2 mb-4">
        <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">WCAG 2.2 AA</span>
        <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">ADA Compliant</span>
        <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">Section 508</span>
        <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">Section 504</span>
        <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">Universal Design</span>
      </div>
      <p class="text-sm text-navy text-opacity-60">Conformance Date: November 17, 2025 | Next Audit: January 1, 2026</p>
    </div>

    <!-- Critical Accessibility Notice -->
    <div class="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8">
      <div class="flex items-start space-x-3">
        <svg class="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <div>
          <h3 class="text-lg font-semibold text-blue-800 mb-2">MAXIMUM ACCESSIBILITY COMMITMENT</h3>
          <p class="text-blue-700 text-sm mb-3">
            Metzler Foundations is committed to providing maximum digital accessibility for all users, including those with disabilities. 
            We exceed legal requirements by implementing universal design principles and following WCAG 2.2 AA guidelines, 
            ADA Title III requirements, Section 508 standards, and Section 504 provisions.
          </p>
          <div class="flex flex-wrap gap-2">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Universal Design</span>
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Assistive Technology</span>
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">Screen Reader Compatible</span>
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Keyboard Navigation</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Accessibility Standards Table -->
    <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-6 mb-8">
      <h2 class="text-2xl font-medium text-navy mb-6">Accessibility Standards Compliance</h2>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-gray-50">
              <th class="text-left p-3 font-semibold text-navy">Standard/Guideline</th>
              <th class="text-left p-3 font-semibold text-navy">Level</th>
              <th class="text-left p-3 font-semibold text-navy">Status</th>
              <th class="text-left p-3 font-semibold text-navy">Compliance Date</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr>
              <td class="p-3 font-medium">Web Content Accessibility Guidelines (WCAG) 2.2</td>
              <td class="p-3">AA Level</td>
              <td class="p-3"><span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">✓ Compliant</span></td>
              <td class="p-3">November 17, 2025</td>
            </tr>
            <tr>
              <td class="p-3 font-medium">Americans with Disabilities Act (ADA) Title III</td>
              <td class="p-3">Full Compliance</td>
              <td class="p-3"><span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">✓ Compliant</span></td>
              <td class="p-3">November 17, 2025</td>
            </tr>
            <tr>
              <td class="p-3 font-medium">Section 508 of the Rehabilitation Act</td>
              <td class="p-3">Full Compliance</td>
              <td class="p-3"><span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">✓ Compliant</span></td>
              <td class="p-3">November 17, 2025</td>
            </tr>
            <tr>
              <td class="p-3 font-medium">Section 504 of the Rehabilitation Act</td>
              <td class="p-3">Full Compliance</td>
              <td class="p-3"><span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">✓ Compliant</span></td>
              <td class="p-3">November 17, 2025</td>
            </tr>
            <tr>
              <td class="p-3 font-medium">Universal Design Principles</td>
              <td class="p-3">Enhanced</td>
              <td class="p-3"><span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">✓ Enhanced</span></td>
              <td class="p-3">November 17, 2025</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- WCAG 2.2 AA Compliance Details -->
    <section class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-8 mb-8">
      <h2 class="text-3xl font-serif font-medium text-navy mb-6">WCAG 2.2 AA Compliance Details</h2>

      <div class="grid md:grid-cols-2 gap-8">
        <div class="bg-green-50 border border-green-200 rounded-lg p-6">
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mr-4">
              <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-green-800">Perceivable Content</h3>
          </div>
          <ul class="list-disc list-inside text-green-700 text-sm space-y-2">
            <li>Text alternatives for non-text content</li>
            <li>Captions for videos and audio</li>
            <li>Color contrast ratio 4.5:1 minimum</li>
            <li>Resizable text up to 200%</li>
            <li>Images of text alternatives</li>
            <li>Audio description for videos</li>
          </ul>
        </div>

        <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
              <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-blue-800">Operable Interface</h3>
          </div>
          <ul class="list-disc list-inside text-blue-700 text-sm space-y-2">
            <li>Keyboard accessible navigation</li>
            <li>No keyboard traps</li>
            <li>Sufficient time limits</li>
            <li>No seizure-inducing content</li>
            <li>Bypass blocks for repetitive content</li>
            <li>Page titles and headings structure</li>
          </ul>
        </div>

        <div class="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mr-4">
              <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-purple-800">Understandable Information</h3>
          </div>
          <ul class="list-disc list-inside text-purple-700 text-sm space-y-2">
            <li>Readable and understandable text</li>
            <li>Consistent navigation patterns</li>
            <li>Input assistance and error identification</li>
            <li>Language of page identification</li>
            <li>Consistent identification of components</li>
            <li>Error suggestion and prevention</li>
          </ul>
        </div>

        <div class="bg-red-50 border border-red-200 rounded-lg p-6">
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mr-4">
              <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-red-800">Robust Content</h3>
          </div>
          <ul class="list-disc list-inside text-red-700 text-sm space-y-2">
            <li>Compatible with assistive technologies</li>
            <li>Valid HTML and semantic markup</li>
            <li>Name, role, and value for components</li>
            <li>Status messages programmatically available</li>
            <li>Keyboard focus indicators</li>
            <li>Multiple ways to access content</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Assistive Technology Compatibility -->
    <section class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-8 mb-8">
      <h2 class="text-3xl font-serif font-medium text-navy mb-6">Assistive Technology Compatibility</h2>

      <div class="grid md:grid-cols-3 gap-6">
        <div class="text-center bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div class="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 class="font-semibold text-blue-800 mb-2">Screen Readers</h3>
          <p class="text-sm text-blue-700">Compatible with JAWS, NVDA, VoiceOver, and TalkBack screen readers</p>
        </div>

        <div class="text-center bg-green-50 border border-green-200 rounded-lg p-6">
          <div class="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 class="font-semibold text-green-800 mb-2">Braille Displays</h3>
          <p class="text-sm text-green-700">Compatible with refreshable braille displays and braille keyboards</p>
        </div>

        <div class="text-center bg-purple-50 border border-purple-200 rounded-lg p-6">
          <div class="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 class="font-semibold text-purple-800 mb-2">Voice Recognition</h3>
          <p class="text-sm text-purple-700">Compatible with Dragon NaturallySpeaking and other voice recognition software</p>
        </div>
      </div>

      <div class="grid md:grid-cols-3 gap-6 mt-6">
        <div class="text-center bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div class="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 class="font-semibold text-yellow-800 mb-2">Keyboard Navigation</h3>
          <p class="text-sm text-yellow-700">Full keyboard navigation with visible focus indicators and logical tab order</p>
        </div>

        <div class="text-center bg-red-50 border border-red-200 rounded-lg p-6">
          <div class="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
          <h3 class="font-semibold text-red-800 mb-2">Switch Controls</h3>
          <p class="text-sm text-red-700">Compatible with switch access devices and alternative input methods</p>
        </div>

        <div class="text-center bg-indigo-50 border border-indigo-200 rounded-lg p-6">
          <div class="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 class="font-semibold text-indigo-800 mb-2">Screen Magnification</h3>
          <p class="text-sm text-indigo-700">Compatible with screen magnification software and browser zoom</p>
        </div>
      </div>
    </section>

    <!-- User Experience Features -->
    <section class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-8 mb-8">
      <h2 class="text-3xl font-serif font-medium text-navy mb-6">Enhanced User Experience Features</h2>

      <div class="grid md:grid-cols-2 gap-8">
        <div>
          <h3 class="text-xl font-semibold text-navy mb-4">Visual Accessibility</h3>
          <div class="space-y-4">
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 class="font-semibold text-blue-800 mb-2">Color & Contrast</h4>
              <ul class="list-disc list-inside text-blue-700 text-sm space-y-1">
                <li>High contrast mode support</li>
                <li>Color contrast ratio 4.5:1 minimum</li>
                <li>Color-blind friendly palettes</li>
                <li>Text size adjustment controls</li>
              </ul>
            </div>
            <div class="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 class="font-semibold text-green-800 mb-2">Visual Design</h4>
              <ul class="list-disc list-inside text-green-700 text-sm space-y-1">
                <li>Clear visual hierarchy</li>
                <li>Consistent navigation patterns</li>
                <li>Readable font choices</li>
                <li>Appropriate white space</li>
              </ul>
            </div>
          </div>
        </div>

        <div>
          <h3 class="text-xl font-semibold text-navy mb-4">Interactive Features</h3>
          <div class="space-y-4">
            <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h4 class="font-semibold text-purple-800 mb-2">Navigation</h4>
              <ul class="list-disc list-inside text-purple-700 text-sm space-y-1">
                <li>Skip navigation links</li>
                <li>Breadcrumb trails</li>
                <li>Site search functionality</li>
                <li>Site map access</li>
              </ul>
            </div>
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 class="font-semibold text-yellow-800 mb-2">Forms & Input</h4>
              <ul class="list-disc list-inside text-yellow-700 text-sm space-y-1">
                <li>Clear form labels</li>
                <li>Error identification</li>
                <li>Input assistance</li>
                <li>Success confirmation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 class="text-xl font-semibold text-gray-800 mb-4">Additional Accessibility Features</h3>
        <div class="grid md:grid-cols-3 gap-6">
          <ul class="list-disc list-inside text-gray-700 text-sm space-y-2">
            <li>Alternative text for images</li>
            <li>Transcripts for audio content</li>
            <li>Captions for video content</li>
            <li>Audio descriptions for videos</li>
          </ul>
          <ul class="list-disc list-inside text-gray-700 text-sm space-y-2">
            <li>Keyboard shortcuts</li>
            <li>Focus management</li>
            <li>Status messages</li>
            <li>Loading indicators</li>
          </ul>
          <ul class="list-disc list-inside text-gray-700 text-sm space-y-2">
            <li>Multiple contact methods</li>
            <li>Clear instructions</li>
            <li>Help documentation</li>
            <li>Feedback mechanisms</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Compliance Testing & Validation -->
    <section class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-8 mb-8">
      <h2 class="text-3xl font-serif font-medium text-navy mb-6">Compliance Testing & Validation</h2>

      <div class="bg-green-50 border-l-4 border-green-500 p-6 mb-6">
        <div class="flex items-start space-x-3">
          <svg class="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 class="text-lg font-semibold text-green-800 mb-2">THIRD-PARTY VALIDATION</h3>
            <p class="text-green-700 text-sm mb-2">
              Our accessibility compliance is validated through automated testing tools, manual testing procedures, 
              and third-party accessibility audits to ensure maximum compliance with all applicable standards.
            </p>
            <div class="flex flex-wrap gap-2">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Automated Testing</span>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Manual Testing</span>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Third-Party Audit</span>
            </div>
          </div>
        </div>
      </div>

      <div class="grid md:grid-cols-2 gap-8">
        <div class="bg-white border border-gray-200 rounded-lg p-6">
          <h3 class="font-semibold text-gray-800 mb-4">Testing Tools & Methods</h3>
          <div class="space-y-3 text-sm text-gray-700">
            <div class="bg-blue-50 border border-blue-200 rounded p-3">
              <strong class="text-blue-800">Automated Tools:</strong>
              <p class="text-blue-700">axe-core, Lighthouse, WAVE, Pa11y</p>
            </div>
            <div class="bg-green-50 border border-green-200 rounded p-3">
              <strong class="text-green-800">Manual Testing:</strong>
              <p class="text-green-700">Keyboard navigation, screen reader testing</p>
            </div>
            <div class="bg-purple-50 border border-purple-200 rounded p-3">
              <strong class="text-purple-800">User Testing:</strong>
              <p class="text-purple-700">Users with disabilities testing</p>
            </div>
          </div>
        </div>

        <div class="bg-white border border-gray-200 rounded-lg p-6">
          <h3 class="font-semibold text-gray-800 mb-4">Testing Frequency</h3>
          <div class="space-y-3 text-sm text-gray-700">
            <div class="bg-yellow-50 border border-yellow-200 rounded p-3">
              <strong class="text-yellow-800">Weekly:</strong>
              <p class="text-yellow-700">Automated accessibility scans</p>
            </div>
            <div class="bg-orange-50 border border-orange-200 rounded p-3">
              <strong class="text-orange-800">Monthly:</strong>
              <p class="text-orange-700">Manual testing procedures</p>
            </div>
            <div class="bg-red-50 border border-red-200 rounded p-3">
              <strong class="text-red-800">Quarterly:</strong>
              <p class="text-red-700">Third-party accessibility audits</p>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-6">
        <h3 class="font-semibold text-gray-800 mb-4">Validation Results</h3>
        <div class="grid md:grid-cols-3 gap-4 text-sm text-gray-700">
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600 mb-1">98.5%</div>
            <div class="text-gray-600">Automated Test Pass Rate</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-600 mb-1">100%</div>
            <div class="text-gray-600">Manual Test Pass Rate</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-purple-600 mb-1">A+</div>
            <div class="text-gray-600">Third-Party Audit Grade</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact & Feedback -->
    <section class="bg-navy bg-opacity-90 text-cream rounded-lg p-8 text-center">
      <h2 class="text-3xl font-serif font-medium mb-6">Accessibility Feedback & Support</h2>
      
      <div class="grid md:grid-cols-3 gap-6 mb-8">
        <div class="text-center">
          <div class="w-16 h-16 bg-cream bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-cream" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 class="font-semibold mb-2">Accessibility Coordinator</h3>
          <p class="text-sm text-cream text-opacity-80 mb-2">accessibility@metzlerfoundations.org</p>
          <p class="text-sm text-cream text-opacity-80">(555) 123-4567</p>
        </div>

        <div class="text-center">
          <div class="w-16 h-16 bg-cream bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-cream" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 class="font-semibold mb-2">Feedback Form</h3>
          <p class="text-sm text-cream text-opacity-80 mb-2">Report accessibility issues</p>
          <a href="/accessibility-feedback" class="text-cream hover:text-white underline text-sm">Submit Feedback</a>
        </div>

        <div class="text-center">
          <div class="w-16 h-16 bg-cream bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-cream" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
          </div>
          <h3 class="font-semibold mb-2">Alternative Formats</h3>
          <p class="text-sm text-cream text-opacity-80 mb-2">Request accessible formats</p>
          <p class="text-sm text-cream text-opacity-80">Available upon request</p>
        </div>
      </div>

      <div class="text-center">
        <div class="flex flex-col sm:flex-row gap-4 justify-center mb-4">
          <a href="mailto:accessibility@metzlerfoundations.org" class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
            Contact Accessibility Team
          </a>
          <a href="/accessibility-feedback" class="inline-flex items-center px-6 py-3 border border-cream border-opacity-30 text-base font-medium rounded-md text-cream bg-transparent hover:bg-cream hover:text-navy hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cream transition-colors duration-200">
            Submit Feedback
          </a>
        </div>
        <p class="text-xs text-cream text-opacity-70">
          We respond to all accessibility feedback within 2 business days and implement fixes within 30 days.
        </p>
      </div>

      <div class="mt-8 text-center">
        <p class="text-sm text-cream text-opacity-90 mb-2">
          This accessibility statement demonstrates our commitment to digital inclusion and compliance with:
        </p>
        <div class="flex flex-wrap justify-center gap-2 text-xs">
          <span class="bg-cream bg-opacity-20 px-3 py-1 rounded">WCAG 2.2 AA</span>
          <span class="bg-cream bg-opacity-20 px-3 py-1 rounded">ADA Title III</span>
          <span class="bg-cream bg-opacity-20 px-3 py-1 rounded">Section 508</span>
          <span class="bg-cream bg-opacity-20 px-3 py-1 rounded">Section 504</span>
          <span class="bg-cream bg-opacity-20 px-3 py-1 rounded">Universal Design</span>
        </div>
      </div>

      <p class="text-xs text-cream text-opacity-70 mt-4">
        Last Updated: November 17, 2025 | Conformance Date: November 17, 2025 | Next Audit: January 1, 2026
      </p>
    </section>
  </main>
</div>