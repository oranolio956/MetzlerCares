<script lang="ts">
  import { onMount } from 'svelte'
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte'

  let lastUpdated = 'November 23, 2025'
</script>

<svelte:head>
  <title>Privacy Policy | Metzler Cares</title>
  <meta name="description" content="Privacy Policy for Metzler Cares. Learn how we collect, use, and protect your personal information." />
  <meta name="robots" content="noindex" /> <!-- Remove noindex once reviewed by legal -->
</svelte:head>

<div class="bg-white py-12 sm:py-16 lg:py-20">
  <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
    <Breadcrumbs />
    
    <h1 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-8">Privacy Policy</h1>
    
    <div class="prose prose-lg prose-blue text-gray-500">
      <p class="lead">
        At Metzler Cares ("we," "our," or "us"), we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website (metzlercares.com) and use our services.
      </p>

      <p><strong>Last Updated:</strong> {lastUpdated}</p>

      <h2>1. Information We Collect</h2>
      <p>We may collect the following types of information:</p>
      <ul>
        <li><strong>Personal Information:</strong> Name, email address, phone number, mailing address, and other contact details you voluntarily provide when filling out forms (e.g., "Get Aid," "Partner With Us," or "Donate").</li>
        <li><strong>Sensitive Information:</strong> If you apply for aid, we may collect information related to your recovery status, treatment history, or housing needs. This information is treated with the highest level of confidentiality and security.</li>
        <li><strong>Technical Data:</strong> IP address, browser type, operating system, referral URLs, and pages visited, collected automatically via cookies and analytics tools (e.g., Google Analytics).</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <p>We use the information we collect to:</p>
      <ul>
        <li>Process and evaluate applications for financial aid and housing support.</li>
        <li>Facilitate partnerships with sober living homes and treatment centers.</li>
        <li>Process donations and issue tax receipts.</li>
        <li>Communicate with you regarding your application, donation, or partnership status.</li>
        <li>Improve our website functionality, user experience, and services.</li>
        <li>Comply with legal obligations and regulatory requirements.</li>
      </ul>

      <h2>3. Information Sharing and Disclosure</h2>
      <p>We do not sell your personal information. We may share your information with:</p>
      <ul>
        <li><strong>Service Providers:</strong> Third-party vendors who assist us with website hosting, data analysis, donation processing (e.g., Donorbox), and email delivery. These providers are bound by confidentiality agreements.</li>
        <li><strong>Legal Compliance:</strong> When required by law, regulation, or legal process (e.g., a subpoena), or to protect the rights, property, or safety of Metzler Cares, our users, or others.</li>
      </ul>

      <h2>4. Data Security (HIPAA & 42 CFR Part 2)</h2>
      <p>
        We implement robust security measures to protect your personal information. For data related to substance use disorder treatment and recovery, we adhere to the confidentiality requirements of <strong>42 CFR Part 2</strong> and, where applicable, the <strong>Health Insurance Portability and Accountability Act (HIPAA)</strong>.
      </p>
      <p>
        This includes using encryption for data in transit and at rest, strict access controls, and regular security audits.
      </p>

      <h2>5. Your Rights</h2>
      <p>Depending on your location, you may have the right to:</p>
      <ul>
        <li>Access the personal information we hold about you.</li>
        <li>Request correction of inaccurate or incomplete data.</li>
        <li>Request deletion of your personal data ("Right to be Forgotten").</li>
        <li>Opt-out of marketing communications.</li>
      </ul>
      <p>To exercise these rights, please contact us at <a href="mailto:privacy@metzlercares.com">privacy@metzlercares.com</a>.</p>

      <h2>6. Cookies</h2>
      <p>
        We use cookies to enhance your browsing experience. You can control and manage cookies through your browser settings. For more details, please view our <a href="/cookie-policy">Cookie Policy</a>.
      </p>

      <h2>7. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. Any changes will be posted on this page with a revised "Last Updated" date.
      </p>

      <h2>8. Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy, please contact us at:
        <br>
        <strong>Email:</strong> <a href="mailto:privacy@metzlercares.com">privacy@metzlercares.com</a>
        <br>
        <strong>Address:</strong> Metzler Foundations, Denver, CO
      </p>
    </div>
  </div>
</div>
