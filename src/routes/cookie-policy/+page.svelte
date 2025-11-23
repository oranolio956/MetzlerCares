<script lang="ts">
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte'
  let lastUpdated = 'November 23, 2025'
</script>

<svelte:head>
  <title>Cookie Policy | Metzler Cares</title>
  <meta name="description" content="Cookie Policy for Metzler Cares. Understand how we use cookies on our website." />
  <meta name="robots" content="noindex" />
</svelte:head>

<div class="bg-white py-12 sm:py-16 lg:py-20">
  <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
    <Breadcrumbs />
    
    <h1 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-8">Cookie Policy</h1>
    
    <div class="prose prose-lg prose-blue text-gray-500">
      <p class="lead">
        This Cookie Policy explains what cookies are, how we use them, and your choices regarding cookies when you visit metzlercares.com.
      </p>
      
      <p><strong>Last Updated:</strong> {lastUpdated}</p>

      <h2>1. What Are Cookies?</h2>
      <p>
        Cookies are small text files that are stored on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and to provide information to the owners of the site.
      </p>

      <h2>2. How We Use Cookies</h2>
      <p>We use cookies for the following purposes:</p>
      <ul>
        <li><strong>Essential Cookies:</strong> These are necessary for the website to function properly (e.g., maintaining your session while you are logged in or filling out a form). You cannot opt-out of these cookies.</li>
        <li><strong>Analytics Cookies:</strong> These allow us to count visits and traffic sources so we can measure and improve the performance of our site. We use Google Analytics for this purpose. The data is aggregated and anonymous.</li>
        <li><strong>Functional Cookies:</strong> These enable the website to provide enhanced functionality and personalization (e.g., remembering your language preference).</li>
      </ul>

      <h2>3. Managing Your Cookies</h2>
      <p>
        You can change your cookie preferences at any time by clicking on the "Cookie Preferences" link in the footer of our website. You can also set your browser to refuse all or some browser cookies, or to alert you when websites set or access cookies.
      </p>

      <h2>4. Contact Us</h2>
      <p>
        If you have any questions about our use of cookies, please contact us at <a href="mailto:privacy@metzlercares.com">privacy@metzlercares.com</a>.
      </p>
    </div>
  </div>
</div>
