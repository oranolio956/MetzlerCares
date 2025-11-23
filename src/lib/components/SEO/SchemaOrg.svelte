<script lang="ts">
  export let organization = {
    name: 'Metzler Cares',
    url: 'https://metzlercares.com',
    logo: 'https://metzlercares.com/og-image.png',
    description: 'Recovery Infrastructure for Colorado'
  }
</script>

<svelte:head>
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Metzler Cares",
      "url": "https://metzlercares.com",
      "logo": "https://metzlercares.com/og-image.png",
      "description": "Recovery Infrastructure for Colorado"
    }
  </script>
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Metzler Cares",
      "url": "https://metzlercares.com"
    }
  </script>
</svelte:head>
