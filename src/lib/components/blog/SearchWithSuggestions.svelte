<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte'

  export let searchQuery = ''
  export let maxSuggestions = 5

  let suggestions: string[] = []
  let selectedIndex = -1
  let showSuggestions = false
  let inputElement: HTMLInputElement

  const dispatch = createEventDispatcher()

  // Mock search suggestions - in a real app, this would come from an API
  const mockSuggestions = [
    'addiction recovery',
    'sober living',
    'mental health',
    'substance abuse treatment',
    'nonprofit management',
    'community outreach',
    'family support',
    'relapse prevention',
    'holistic healing',
    'peer support',
    'trauma informed care',
    'evidence based treatment',
    'recovery housing',
    'case management',
    'behavioral health'
  ]

  // Generate suggestions based on current query
  function generateSuggestions(query: string) {
    if (!query || query.length < 2) {
      suggestions = []
      return
    }

    const lowerQuery = query.toLowerCase()
    suggestions = mockSuggestions
      .filter(suggestion => suggestion.toLowerCase().includes(lowerQuery))
      .slice(0, maxSuggestions)

    selectedIndex = -1
    showSuggestions = suggestions.length > 0
  }

  function selectSuggestion(suggestion: string) {
    searchQuery = suggestion
    showSuggestions = false
    selectedIndex = -1
    dispatch('search', { query: suggestion })
    inputElement?.focus()
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (!showSuggestions || suggestions.length === 0) return

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        selectedIndex = Math.min(selectedIndex + 1, suggestions.length - 1)
        break
      case 'ArrowUp':
        event.preventDefault()
        selectedIndex = Math.max(selectedIndex - 1, -1)
        break
      case 'Enter':
        event.preventDefault()
        if (selectedIndex >= 0) {
          selectSuggestion(suggestions[selectedIndex])
        } else {
          dispatch('search', { query: searchQuery })
          showSuggestions = false
        }
        break
      case 'Escape':
        showSuggestions = false
        selectedIndex = -1
        break
    }
  }

  function handleInputFocus() {
    if (searchQuery.length >= 2 && suggestions.length > 0) {
      showSuggestions = true
    }
  }

  function handleInputBlur() {
    // Delay hiding to allow click on suggestions
    setTimeout(() => {
      showSuggestions = false
      selectedIndex = -1
    }, 200)
  }

  function handleInput() {
    generateSuggestions(searchQuery)
  }

  // Generate suggestions when query changes
  $: generateSuggestions(searchQuery)

  // Hide suggestions when clicking outside
  onMount(() => {
    function handleClickOutside(event: MouseEvent) {
      if (inputElement && !inputElement.contains(event.target as Node)) {
        showSuggestions = false
        selectedIndex = -1
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  })
</script>

<div class="relative">
  <input
    bind:this={inputElement}
    type="text"
    bind:value={searchQuery}
    on:input={handleInput}
    on:focus={handleInputFocus}
    on:blur={handleInputBlur}
    on:keydown={handleKeyDown}
    placeholder="Search articles..."
    class="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    autocomplete="off"
    autocorrect="off"
    autocapitalize="off"
    spellcheck="false"
  />

  <svg class="absolute left-4 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>

  <!-- Search Suggestions Dropdown -->
  {#if showSuggestions && suggestions.length > 0}
    <div
      class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
    >
      {#each suggestions as suggestion, index}
        <button
          type="button"
          class="w-full text-left px-4 py-2 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none {selectedIndex ===
          index
            ? 'bg-blue-50 text-blue-700'
            : 'text-gray-900'}"
          on:click={() => selectSuggestion(suggestion)}
          on:mouseenter={() => (selectedIndex = index)}
        >
          <div class="flex items-center">
            <svg class="h-4 w-4 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <span class="text-sm">{suggestion}</span>
          </div>
        </button>
      {/each}
    </div>
  {/if}
</div>
