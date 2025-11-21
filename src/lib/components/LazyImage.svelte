<script lang="ts">
  import { onMount } from 'svelte'

  export let src: string
  export let alt: string
  export let className = ''
  export let placeholder = ''
  export let width: number | string | undefined = undefined
  export let height: number | string | undefined = undefined

  let img: HTMLImageElement
  let isLoaded = false
  let hasError = false

  onMount(() => {
    if (img && img.complete) {
      isLoaded = true
    }
  })

  function handleLoad() {
    isLoaded = true
  }

  function handleError() {
    hasError = true
  }
</script>

<div class="relative overflow-hidden {className}">
  {#if !isLoaded && !hasError}
    <div
      class="lazy-loading absolute inset-0"
      style="padding-bottom: {height && width ? `${(Number(height) / Number(width)) * 100}%` : '56.25%'}"
      aria-hidden="true"
    >
      {#if placeholder}
        <div class="absolute inset-0 flex items-center justify-center text-gray-400">
          {placeholder}
        </div>
      {/if}
    </div>
  {/if}

  {#if hasError && placeholder}
    <div
      class="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500"
      style="padding-bottom: {height && width ? `${(Number(height) / Number(width)) * 100}%` : '56.25%'}"
    >
      {placeholder}
    </div>
  {/if}

  <img
    bind:this={img}
    {src}
    {alt}
    {width}
    {height}
    loading="lazy"
    decoding="async"
    class="transition-opacity duration-300 {isLoaded ? 'opacity-100' : 'opacity-0'}"
    on:load={handleLoad}
    on:error={handleError}
  />
</div>
