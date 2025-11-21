<script lang="ts">
  import { page } from '$app/stores'
  import { goto } from '$app/navigation'

  interface BreadcrumbItem {
    label: string
    href?: string
  }

  $: breadcrumbs = generateBreadcrumbs($page.url.pathname)

  function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
    const items: BreadcrumbItem[] = [{ label: 'Home', href: '/' }]

    if (pathname === '/') {
      return [items[0]]
    }

    const segments = pathname.split('/').filter(Boolean)
    let currentPath = ''

    segments.forEach((segment, index) => {
      currentPath += `/${segment}`
      const isLast = index === segments.length - 1

      // Format label
      let label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

      // Special cases
      if (segment === 'get-aid') label = 'Get Aid'
      if (segment === 'give-support') label = 'Give Support'
      if (segment === 'colorado-recovery') label = 'Colorado Recovery'
      if (segment === 'colorado-rehab') label = 'Colorado Rehab'
      if (segment === 'colorado-detox') label = 'Colorado Detox'
      if (segment === 'colorado-sober-living') label = 'Sober Living'
      if (segment === 'colorado') label = 'Colorado Resources'

      items.push({
        label,
        href: isLast ? undefined : currentPath
      })
    })

    return items
  }

  function handleClick(href: string | undefined, event: MouseEvent) {
    if (href) {
      event.preventDefault()
      goto(href)
    }
  }
</script>

{#if breadcrumbs.length > 1}
  <nav aria-label="Breadcrumb" class="py-3 px-4 bg-gray-50 border-b border-gray-200">
    <ol class="flex items-center space-x-2 text-sm text-gray-600 max-w-7xl mx-auto">
      {#each breadcrumbs as crumb, i}
        <li class="flex items-center">
          {#if i > 0}
            <svg
              class="w-4 h-4 mx-2 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          {/if}
          {#if crumb.href}
            <a
              href={crumb.href}
              on:click={(e) => handleClick(crumb.href, e)}
              class="hover:text-forest-green transition-colors"
            >
              {crumb.label}
            </a>
          {:else}
            <span class="text-charcoal font-medium" aria-current="page">{crumb.label}</span>
          {/if}
        </li>
      {/each}
    </ol>
  </nav>
{/if}
