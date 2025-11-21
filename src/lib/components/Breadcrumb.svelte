<script lang="ts">
  export let items: Array<{ name: string; url: string }> = []
</script>

<nav aria-label="Breadcrumb" class="mb-6">
  <ol class="flex items-center space-x-2 text-sm text-gray-600">
    {#each items as item, index}
      {#if index > 0}
        <li class="flex items-center">
          <svg class="w-4 h-4 mx-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </li>
      {/if}
      <li>
        {#if index === items.length - 1}
          <span class="font-medium text-gray-900" aria-current="page">{item.name}</span>
        {:else}
          <a href={item.url} class="hover:text-blue-600 transition-colors">{item.name}</a>
        {/if}
      </li>
    {/each}
  </ol>
</nav>
