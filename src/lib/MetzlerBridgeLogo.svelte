<!--
  Metzler Bridge Logo Component
  Concept: Minimalist 'M' monogram representing stability and connection
  - Outer vertical strokes: Thick, solid, square (conveying stability)
  - Inner 'V': Replaced by upward-curving arch (symbolizing bridge/connection)
-->
<script lang="ts">
  export let className = 'w-8 h-8';
  export let color = 'currentColor';
</script>

<svg
  class={className}
  viewBox="0 0 100 100"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  role="img"
  aria-label="Metzler Foundations Bridge Logo"
>
  <!-- Left vertical stroke - thick and stable -->
  <rect
    x="15"
    y="20"
    width="12"
    height="60"
    rx="2"
    fill={color}
  />

  <!-- Right vertical stroke - thick and stable -->
  <rect
    x="73"
    y="20"
    width="12"
    height="60"
    rx="2"
    fill={color}
  />

  <!-- Top horizontal connection -->
  <rect
    x="15"
    y="20"
    width="70"
    height="12"
    rx="2"
    fill={color}
  />

  <!-- Bridge arch - upward-curving connection symbolizing transformation -->
  <path
    d="M27 50 Q50 35 73 50"
    stroke={color}
    stroke-width="8"
    stroke-linecap="round"
    fill="none"
  />

  <!-- Subtle arch accent for depth -->
  <path
    d="M30 55 Q50 42 70 55"
    stroke={color}
    stroke-width="3"
    stroke-linecap="round"
    fill="none"
    opacity="0.6"
  />
</svg>

<style>
  svg {
    transition: color 0.2s ease-in-out;
  }
</style>

