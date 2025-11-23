<script lang="ts">
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte'
  let lastUpdated = 'November 23, 2025'
</script>

<svelte:head>
  <title>Terms and Conditions | Metzler Cares</title>
  <meta name="description" content="Terms and Conditions for using Metzler Cares services and website." />
  <meta name="robots" content="noindex" />
</svelte:head>

<div class="bg-white py-12 sm:py-16 lg:py-20">
  <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
    <Breadcrumbs />
    
    <h1 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-8">Terms and Conditions</h1>
    
    <div class="prose prose-lg prose-blue text-gray-500">
      <p class="lead">
        Please read these Terms and Conditions ("Terms") carefully before using the Metzler Cares website (metzlercares.com) operated by Metzler Foundations ("we," "us," or "our").
      </p>
      
      <p><strong>Last Updated:</strong> {lastUpdated}</p>

      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing or using our website and services, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the service.
      </p>

      <h2>2. Use of Services</h2>
      <p>
        Our website provides information and tools to facilitate housing support and financial aid for individuals in recovery. You agree to use these services only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else's use and enjoyment of the website.
      </p>

      <h2>3. Partner Network MOU</h2>
      <p id="partner-mou">
        <strong>For Facilities and Partners:</strong> By applying to join the Metzler Foundations Preferred Provider Network, you agree to the terms of our Memorandum of Understanding (MOU), which includes:
      </p>
      <ul>
        <li>Providing accurate and up-to-date facility information.</li>
        <li>maintaining necessary state licenses and certifications.</li>
        <li>Adhering to ethical standards in addiction treatment and housing.</li>
        <li>Cooperating with our verification and payment processes.</li>
      </ul>
      <p>Failure to adhere to the MOU may result in removal from our partner network.</p>

      <h2>4. Intellectual Property</h2>
      <p>
        The content, features, and functionality of this website (including but not limited to text, graphics, logos, and code) are the exclusive property of Metzler Foundations and are protected by copyright, trademark, and other intellectual property laws.
      </p>

      <h2>5. Limitation of Liability</h2>
      <p>
        In no event shall Metzler Foundations, its directors, employees, partners, or agents, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.
      </p>

      <h2>6. Donations</h2>
      <p>
        Donations made to Metzler Foundations are generally non-refundable. If you believe an error has been made in connection with your online donation, contact us immediately at <a href="mailto:help@metzlercares.com">help@metzlercares.com</a>.
      </p>

      <h2>7. Governing Law</h2>
      <p>
        These Terms shall be governed and construed in accordance with the laws of the State of Colorado, without regard to its conflict of law provisions.
      </p>

      <h2>8. Changes</h2>
      <p>
        We reserve the right, at our sole discretion, to modify or replace these Terms at any time. What constitutes a material change will be determined at our sole discretion.
      </p>

      <h2>9. Contact Us</h2>
      <p>
        If you have any questions about these Terms, please contact us at <a href="mailto:legal@metzlercares.com">legal@metzlercares.com</a>.
      </p>
    </div>
  </div>
</div>
