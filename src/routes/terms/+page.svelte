<script lang="ts">
  import { page } from '$app/stores'
</script>

<svelte:head>
  <title>Comprehensive Terms of Service & Legal Agreement - Metzler Foundations</title>
  <meta
    name="description"
    content="Legally binding Terms of Service, User Agreement, and Liability Waiver for Metzler Foundations addiction recovery housing services. Maximum legal protection."
  />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="https://metzlerfoundations.org/terms" />
</svelte:head>

<div class="min-h-screen bg-cream text-navy">
  <!-- Emergency Notice Banner -->
  <div class="bg-red-600 text-white px-4 py-3">
    <div class="max-w-7xl mx-auto flex items-center justify-between">
      <div class="flex items-center space-x-2">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clip-rule="evenodd"
          />
        </svg>
        <span class="font-semibold">EMERGENCY DISCLAIMER:</span>
        <span class="text-sm"
          >If you are experiencing a medical emergency, call 911 immediately. This website does not provide emergency
          services.</span
        >
      </div>
      <button
        class="text-white hover:text-gray-200 text-sm font-medium"
        on:click={() => {
          const el = document.getElementById('crisis-resources')
          window.scrollTo({ top: el ? el.offsetTop : 0, behavior: 'smooth' })
        }}
      >
        Crisis Resources →
      </button>
    </div>
  </div>

  <!-- Header -->
  <section class="py-12 px-4 sm:px-6 lg:px-8 border-b border-navy border-opacity-10">
    <div class="max-w-6xl mx-auto">
      <div class="text-center mb-8">
        <h1 class="text-3xl md:text-5xl font-serif font-medium text-navy mb-4">Comprehensive Terms of Service</h1>
        <p class="text-lg text-navy text-opacity-70 mb-2">Legally Binding User Agreement & Liability Waiver</p>
        <p class="text-sm text-navy text-opacity-60">Last updated: November 17, 2025 | Effective: Immediately</p>
      </div>

      <!-- Legal Notice Banner -->
      <div class="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8">
        <div class="flex items-start space-x-3">
          <svg
            class="w-6 h-6 text-yellow-600 mt-0.5 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <div>
            <h3 class="text-lg font-semibold text-yellow-800 mb-2">CRITICAL LEGAL NOTICE</h3>
            <p class="text-yellow-700 text-sm mb-3">
              This is a comprehensive, legally binding agreement. By accessing this website or using any services, you
              acknowledge full understanding and acceptance of all terms, including liability limitations, disclaimers,
              and waiver of rights. If you do not agree to ALL terms, you must immediately cease use.
            </p>
            <div class="flex flex-wrap gap-2">
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
                >No Emergency Services</span
              >
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800"
                >Medical Disclaimer</span
              >
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >HIPAA Covered</span
              >
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                >Liability Waiver</span
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Navigation -->
      <div class="bg-white rounded-lg border border-navy border-opacity-10 p-6">
        <h3 class="font-semibold text-navy mb-4">Quick Navigation to Critical Sections:</h3>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <a href="#medical-disclaimer" class="text-olive hover:text-navy underline font-medium">Medical Disclaimer</a>
          <a href="#emergency-services" class="text-olive hover:text-navy underline font-medium">Emergency Services</a>
          <a href="#liability-waiver" class="text-olive hover:text-navy underline font-medium">Liability Waiver</a>
          <a href="#assumption-risk" class="text-olive hover:text-navy underline font-medium">Assumption of Risk</a>
          <a href="#indemnification" class="text-olive hover:text-navy underline font-medium">Indemnification</a>
          <a href="#dispute-resolution" class="text-olive hover:text-navy underline font-medium">Dispute Resolution</a>
        </div>
      </div>
    </div>
  </section>

  <!-- Content -->
  <section class="py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto prose prose-lg prose-navy max-w-none">
      <!-- SECTION 1: MEDICAL DISCLAIMER & EMERGENCY SERVICES -->
      <div id="medical-disclaimer" class="bg-red-50 border border-red-200 rounded-lg p-8 mb-12">
        <div class="flex items-start space-x-4 mb-6">
          <svg class="w-8 h-8 text-red-600 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <div>
            <h2 class="text-2xl font-bold text-red-800 mb-2">MEDICAL DISCLAIMER & EMERGENCY SERVICES NOTICE</h2>
            <p class="text-red-700 font-semibold">
              CRITICAL: READ THIS SECTION CAREFULLY - IT AFFECTS YOUR LEGAL RIGHTS
            </p>
          </div>
        </div>

        <div class="space-y-4 text-red-800">
          <div class="bg-white bg-opacity-50 p-4 rounded border-l-4 border-red-500">
            <h3 class="font-bold text-red-900 mb-2">NO EMERGENCY SERVICES</h3>
            <p class="text-sm">
              <strong
                >THIS WEBSITE DOES NOT PROVIDE MEDICAL ADVICE, DIAGNOSIS, OR TREATMENT. WE DO NOT OFFER EMERGENCY
                SERVICES.</strong
              >
              If you are experiencing a medical emergency, substance use crisis, or mental health emergency, you must immediately
              call 911, go to your nearest emergency room, or contact the 988 Suicide & Crisis Lifeline by calling or texting
              988.
            </p>
          </div>

          <div class="bg-white bg-opacity-50 p-4 rounded border-l-4 border-orange-500">
            <h3 class="font-bold text-orange-900 mb-2">INFORMATIONAL PURPOSES ONLY</h3>
            <p class="text-sm">
              All content, resources, and information provided on this website are for <strong
                >informational and educational purposes only</strong
              >. This includes but is not limited to: housing information, recovery resources, treatment facility
              listings, educational materials, blog posts, testimonials, and any other content. Nothing on this website
              constitutes medical, legal, or professional advice.
            </p>
          </div>

          <div class="bg-white bg-opacity-50 p-4 rounded border-l-4 border-yellow-500">
            <h3 class="font-bold text-yellow-900 mb-2">NO PROFESSIONAL RELATIONSHIP</h3>
            <p class="text-sm">
              Your use of this website does <strong>NOT</strong> create a doctor-patient, therapist-client, attorney-client,
              or any other professional relationship between you and Metzler Foundations, its staff, volunteers, partners,
              or affiliated organizations. We are a housing scholarship provider, not a healthcare provider.
            </p>
          </div>

          <div class="bg-white bg-opacity-50 p-4 rounded border-l-4 border-purple-500">
            <h3 class="font-bold text-purple-900 mb-2">TREATMENT DECISIONS</h3>
            <p class="text-sm">
              All decisions regarding medical treatment, substance use treatment, mental health care, or any other
              healthcare services must be made in consultation with qualified healthcare professionals. We do not
              recommend or endorse any specific treatment, facility, or healthcare provider. You are solely responsible
              for verifying the credentials, licensing, and quality of any treatment facility or healthcare provider.
            </p>
          </div>

          <div class="bg-navy bg-opacity-10 p-4 rounded">
            <h3 class="font-bold text-navy mb-2">CRISIS RESOURCES (Available 24/7)</h3>
            <div class="grid md:grid-cols-2 gap-3 text-sm">
              <div>
                <strong>Emergency:</strong> 911<br />
                <strong>Crisis Line:</strong> 988 (call or text)<br />
                <strong>SAMHSA Helpline:</strong> 1-800-662-4357
              </div>
              <div>
                <strong>Crisis Text Line:</strong> Text HOME to 741741<br />
                <strong>Veterans Crisis Line:</strong> 1-800-273-8255<br />
                <strong>Disaster Distress Helpline:</strong> 1-800-985-5990
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- SECTION 2: BINDING AGREEMENT -->
      <div class="bg-navy bg-opacity-5 rounded-lg p-8 mb-12">
        <h2 class="text-2xl font-bold text-navy mb-6">1. BINDING LEGAL AGREEMENT</h2>

        <div class="space-y-6">
          <div class="bg-white p-4 rounded border">
            <h3 class="font-bold text-navy mb-2">ASSUMPTION OF RESPONSIBILITY</h3>
            <p class="text-sm text-navy text-opacity-80">
              By accessing this website, creating an account, submitting any application, using any services, or
              interacting with any content, you acknowledge that you have read, understood, and agree to be legally
              bound by these Terms of Service, our Privacy Policy, Cookie Policy, and all applicable laws and
              regulations. This agreement is legally enforceable and creates binding obligations.
            </p>
          </div>

          <div class="bg-white p-4 rounded border">
            <h3 class="font-bold text-navy mb-2">CAPACITY TO CONTRACT</h3>
            <p class="text-sm text-navy text-opacity-80">
              You represent and warrant that you are at least 18 years of age and have the legal capacity to enter into
              this binding agreement. If you are accessing this website on behalf of an organization, you represent that
              you have authority to bind that organization to these terms.
            </p>
          </div>

          <div class="bg-white p-4 rounded border">
            <h3 class="font-bold text-navy mb-2">MODIFICATION OF TERMS</h3>
            <p class="text-sm text-navy text-opacity-80">
              We reserve the right to modify these terms at any time without prior notice. Continued use of the website
              or services after any modification constitutes acceptance of the modified terms. It is your responsibility
              to review these terms regularly.
            </p>
          </div>
        </div>
      </div>

      <!-- SECTION 3: COMPREHENSIVE LIABILITY WAIVER -->
      <div id="liability-waiver" class="bg-red-50 border-2 border-red-300 rounded-lg p-8 mb-12">
        <div class="flex items-center space-x-3 mb-6">
          <svg class="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
          <h2 class="text-2xl font-bold text-red-800">COMPREHENSIVE LIABILITY WAIVER & RELEASE</h2>
        </div>

        <div class="bg-red-100 p-4 rounded mb-6">
          <p class="text-red-900 font-bold text-center">
            BY USING THIS WEBSITE, YOU WAIVE IMPORTANT LEGAL RIGHTS. READ THIS SECTION CAREFULLY.
          </p>
        </div>

        <div class="space-y-6">
          <div class="bg-white p-6 rounded border-l-4 border-red-500">
            <h3 class="font-bold text-red-900 mb-3">COMPLETE WAIVER OF LIABILITY</h3>
            <p class="text-sm text-red-800 mb-3">
              To the maximum extent permitted by applicable law, you hereby <strong
                >WAIVE, RELEASE, DISCHARGE, AND HOLD HARMLESS</strong
              > Metzler Foundations, its officers, directors, employees, volunteers, agents, representatives, affiliates,
              partners, licensors, and successors (collectively, "Released Parties") from any and all liability, claims,
              demands, actions, causes of action, damages, costs, expenses, and compensation of any kind whatsoever, whether
              direct or indirect, known or unknown, suspected or unsuspected, arising out of or related to:
            </p>
            <ul class="list-disc list-inside text-sm text-red-800 space-y-1 ml-4">
              <li>Your access to or use of this website or any services</li>
              <li>Any content, information, or materials provided on this website</li>
              <li>
                Any housing facility, treatment provider, or third-party service referenced or connected through our
                services
              </li>
              <li>Any decisions made based on information obtained from this website</li>
              <li>Any technical issues, interruptions, or unavailability of services</li>
              <li>Any breach of data security or privacy incidents</li>
              <li>Any interactions with other users, facilities, or third parties</li>
              <li>Any loss, injury, harm, or damage of any kind, including death</li>
            </ul>
          </div>

          <div class="bg-white p-6 rounded border-l-4 border-orange-500">
            <h3 class="font-bold text-orange-900 mb-3">SPECIFIC WAIVERS FOR HEALTHCARE-RELATED CLAIMS</h3>
            <p class="text-sm text-orange-800 mb-3">You specifically waive and release any claims related to:</p>
            <ul class="list-disc list-inside text-sm text-orange-800 space-y-1 ml-4">
              <li>Medical malpractice or negligence claims against any healthcare provider</li>
              <li>Claims related to substance use treatment, detoxification, or recovery services</li>
              <li>Claims arising from housing conditions, facility operations, or resident interactions</li>
              <li>Claims related to medication, medical care, or mental health services</li>
              <li>Claims for emotional distress, psychological harm, or mental anguish</li>
              <li>Claims for relapse, overdose, or substance use-related incidents</li>
              <li>Claims for wrongful death or personal injury</li>
            </ul>
          </div>

          <div class="bg-white p-6 rounded border-l-4 border-purple-500">
            <h3 class="font-bold text-purple-900 mb-3">ECONOMIC AND NON-ECONOMIC DAMAGES</h3>
            <p class="text-sm text-purple-800 mb-3">
              This waiver includes but is not limited to all economic damages (medical expenses, lost wages, property
              damage, out-of-pocket costs) and non-economic damages (pain and suffering, emotional distress, loss of
              enjoyment of life, disfigurement, loss of consortium, and punitive damages).
            </p>
          </div>

          <div class="bg-yellow-50 p-6 rounded border border-yellow-300">
            <h3 class="font-bold text-yellow-900 mb-3">CALIFORNIA CIVIL CODE SECTION 1542 WAIVER</h3>
            <p class="text-sm text-yellow-800 mb-3">
              You specifically waive the provisions of California Civil Code Section 1542 (and any similar provisions in
              other jurisdictions), which states: "A general release does not extend to claims that the creditor or
              releasing party does not know or suspect to exist in his or her favor at the time of executing the release
              and that, if known by him or her, would have materially affected his or her settlement with the debtor or
              released party."
            </p>
            <p class="text-sm text-yellow-800">
              You acknowledge that you may later discover facts different from or in addition to what you now know or
              believe to be true, but you intend to fully, finally, and forever settle and release all claims, known or
              unknown, suspected or unsuspected.
            </p>
          </div>
        </div>
      </div>

      <!-- SECTION 4: ASSUMPTION OF RISK -->
      <div id="assumption-risk" class="bg-orange-50 border border-orange-200 rounded-lg p-8 mb-12">
        <h2 class="text-2xl font-bold text-orange-800 mb-6">ASSUMPTION OF RISK</h2>

        <div class="space-y-4">
          <div class="bg-white p-4 rounded border-l-4 border-orange-500">
            <h3 class="font-bold text-orange-900 mb-2">INHERENT RISKS ACKNOWLEDGED</h3>
            <p class="text-sm text-orange-800">
              You acknowledge and understand that addiction recovery, substance use treatment, and sober living involve
              inherent risks, including but not limited to: risk of relapse, overdose, medical complications, mental
              health crises, suicide, violence, property damage, theft, infectious diseases, and death. You voluntarily
              assume all such risks.
            </p>
          </div>

          <div class="bg-white p-4 rounded border-l-4 border-red-500">
            <h3 class="font-bold text-red-900 mb-2">THIRD-PARTY FACILITY RISKS</h3>
            <p class="text-sm text-red-800">
              You acknowledge that Metzler Foundations is not responsible for the actions, omissions, negligence, or
              misconduct of any third-party housing facilities, treatment providers, healthcare professionals, or other
              service providers. You assume all risks associated with using any third-party services or facilities.
            </p>
          </div>

          <div class="bg-white p-4 rounded border-l-4 border-purple-500">
            <h3 class="font-bold text-purple-900 mb-2">DIGITAL SERVICE RISKS</h3>
            <p class="text-sm text-purple-800">
              You acknowledge risks associated with digital services, including: data breaches, privacy violations,
              service interruptions, technical failures, cyber attacks, identity theft, and loss of data. You assume all
              such risks and agree that we are not liable for any resulting damages.
            </p>
          </div>
        </div>
      </div>

      <!-- SECTION 5: INDEMNIFICATION -->
      <div id="indemnification" class="bg-purple-50 border border-purple-200 rounded-lg p-8 mb-12">
        <h2 class="text-2xl font-bold text-purple-800 mb-6">INDEMNIFICATION OBLIGATION</h2>

        <div class="bg-white p-6 rounded border">
          <p class="text-sm text-purple-900 mb-4">
            You agree to <strong>INDEMNIFY, DEFEND, AND HOLD HARMLESS</strong> the Released Parties from and against any
            and all claims, demands, actions, causes of action, damages, liabilities, losses, costs, and expenses (including
            reasonable attorneys' fees and litigation costs) arising out of or related to:
          </p>
          <ul class="list-disc list-inside text-sm text-purple-900 space-y-1 ml-4">
            <li>Your breach of these Terms of Service</li>
            <li>Your violation of any law or regulation</li>
            <li>Your infringement of any third-party rights</li>
            <li>Your misuse of the website or services</li>
            <li>Any harm caused to third parties through your actions</li>
            <li>Any false information or misrepresentation provided by you</li>
            <li>Any claims brought by third parties related to your use of services</li>
          </ul>
          <p class="text-sm text-purple-900 mt-4">
            This indemnification obligation survives termination of this agreement and continues indefinitely.
          </p>
        </div>
      </div>

      <!-- Continue with more sections... -->
      <div class="text-center py-8">
        <p class="text-navy text-opacity-60 text-sm">
          This is a partial preview. The complete Terms of Service continues with additional comprehensive legal
          protections including:
        </p>
        <div class="mt-4 flex flex-wrap justify-center gap-2 text-xs">
          <span class="bg-gray-100 px-2 py-1 rounded">Service Limitations</span>
          <span class="bg-gray-100 px-2 py-1 rounded">HIPAA Compliance</span>
          <span class="bg-gray-100 px-2 py-1 rounded">Data Security</span>
          <span class="bg-gray-100 px-2 py-1 rounded">Intellectual Property</span>
          <span class="bg-gray-100 px-2 py-1 rounded">Termination Rights</span>
          <span class="bg-gray-100 px-2 py-1 rounded">Governing Law</span>
          <span class="bg-gray-100 px-2 py-1 rounded">Severability</span>
          <span class="bg-gray-100 px-2 py-1 rounded">Complete Agreement</span>
        </div>
      </div>

      <!-- Final Acceptance Section -->
      <div class="bg-navy bg-opacity-90 text-cream rounded-lg p-8 mb-12">
        <h2 class="text-2xl font-bold mb-6 text-center">BINDING ACCEPTANCE & LEGAL ACKNOWLEDGMENT</h2>

        <div class="space-y-4 text-sm">
          <div class="bg-white bg-opacity-10 p-4 rounded">
            <p class="mb-2">
              <strong>BY CONTINUING TO ACCESS THIS WEBSITE OR USE ANY SERVICES:</strong>
            </p>
            <ul class="list-disc list-inside space-y-1 ml-4">
              <li>You acknowledge you have read, understood, and agree to ALL terms in this agreement</li>
              <li>You waive important legal rights as detailed in the Liability Waiver section</li>
              <li>You assume all risks associated with using our services</li>
              <li>You agree to indemnify us against all claims and damages</li>
              <li>You acknowledge this agreement is legally binding and enforceable</li>
              <li>You understand this creates a waiver of rights under California Civil Code 1542</li>
            </ul>
          </div>

          <div class="text-center">
            <p class="text-xs text-cream text-opacity-70 mb-4">
              If you do not agree to these terms, you must immediately cease all use of this website and services.
            </p>
            <div class="flex justify-center space-x-4 text-xs">
              <a href="/privacy" class="text-cream hover:text-white underline">Privacy Policy</a>
              <span class="text-cream text-opacity-50">|</span>
              <a href="/contact" class="text-cream hover:text-white underline">Contact Legal</a>
              <span class="text-cream text-opacity-50">|</span>
              <a href="mailto:legal@metzlerfoundations.org" class="text-cream hover:text-white underline"
                >legal@metzlerfoundations.org</a
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Crisis Resources Section -->
      <div id="crisis-resources" class="bg-blue-50 border border-blue-200 rounded-lg p-8">
        <h2 class="text-2xl font-bold text-blue-800 mb-6">24/7 CRISIS RESOURCES</h2>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="bg-white p-4 rounded border">
            <h3 class="font-bold text-blue-900 mb-2">🚨 Emergency Services</h3>
            <p class="text-sm text-blue-800 mb-2">For immediate medical emergencies:</p>
            <p class="text-blue-900 font-semibold">Call 911</p>
          </div>

          <div class="bg-white p-4 rounded border">
            <h3 class="font-bold text-blue-900 mb-2">🧠 Suicide & Crisis Lifeline</h3>
            <p class="text-sm text-blue-800 mb-2">24/7 crisis support:</p>
            <p class="text-blue-900 font-semibold">Call or Text 988</p>
          </div>

          <div class="bg-white p-4 rounded border">
            <h3 class="font-bold text-blue-900 mb-2">💬 Crisis Text Line</h3>
            <p class="text-sm text-blue-800 mb-2">Text-based crisis support:</p>
            <p class="text-blue-900 font-semibold">Text HOME to 741741</p>
          </div>

          <div class="bg-white p-4 rounded border">
            <h3 class="font-bold text-blue-900 mb-2">🎖️ Veterans Crisis Line</h3>
            <p class="text-sm text-blue-800 mb-2">For veterans and their families:</p>
            <p class="text-blue-900 font-semibold">1-800-273-8255</p>
          </div>

          <div class="bg-white p-4 rounded border">
            <h3 class="font-bold text-blue-900 mb-2">🏠 SAMHSA Helpline</h3>
            <p class="text-sm text-blue-800 mb-2">Treatment referral service:</p>
            <p class="text-blue-900 font-semibold">1-800-662-4357</p>
          </div>

          <div class="bg-white p-4 rounded border">
            <h3 class="font-bold text-blue-900 mb-2">🌪️ Disaster Distress</h3>
            <p class="text-sm text-blue-800 mb-2">Disaster-related crisis support:</p>
            <p class="text-blue-900 font-semibold">1-800-985-5990</p>
          </div>
        </div>

        <div class="mt-6 p-4 bg-blue-100 rounded border-l-4 border-blue-500">
          <p class="text-sm text-blue-900">
            <strong>IMPORTANT:</strong> These resources are provided for informational purposes only. Metzler Foundations
            is not affiliated with these services and is not responsible for their operations or the quality of services
            they provide.
          </p>
        </div>
      </div>
    </div>
  </section>
</div>
