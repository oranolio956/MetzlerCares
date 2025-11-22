<script lang="ts">
  import { browser } from '$app/environment'
  import { onMount } from 'svelte'

  type OrbitRing = {
    radius: number
    thickness: number
    color: string
    glow?: number
  }

  type OrbitNode = {
    radius: number
    size: number
    speed: number
    color: string
  }

  type OrbitSpark = OrbitNode

  type HeroOrbitConfig = {
    background: [string, string]
    rings: OrbitRing[]
    nodes: OrbitNode[]
    sparks: OrbitSpark[]
  }

  export let fallbackAlt = 'Metzler telemetry hero illustration'
  export let fallbackSources = {
    avif: '/assets/hero-bg.avif',
    webp: '/assets/hero-bg.webp',
    png: '/assets/hero-bg.png'
  }

  let canvas: HTMLCanvasElement | null = null
  let ctx: CanvasRenderingContext2D | null = null
  let animationFrame: number | null = null
  let reduceMotion = true
  let config: HeroOrbitConfig | null = null
  let mediaQuery: MediaQueryList | null = null
  let containerWidth = 0
  let containerHeight = 0

  const ensureContext = () => {
    if (!canvas) return null
    ctx = ctx ?? canvas.getContext('2d')
    return ctx
  }

  const resizeCanvas = () => {
    if (!browser || !canvas) return

    const rect = canvas.getBoundingClientRect()
    containerWidth = rect.width
    containerHeight = rect.height

    const dpr = window.devicePixelRatio || 1
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr

    const context = ensureContext()
    if (context) {
      context.setTransform(1, 0, 0, 1, 0, 0)
      context.scale(dpr, dpr)
    }
  }

  const drawBackground = () => {
    const context = ensureContext()
    if (!context || !config || !canvas) return

    const gradient = context.createRadialGradient(
      containerWidth * 0.4,
      containerHeight * 0.3,
      60,
      containerWidth / 2,
      containerHeight / 2,
      Math.max(containerWidth, containerHeight)
    )

    gradient.addColorStop(0, config.background[0])
    gradient.addColorStop(1, config.background[1])

    context.fillStyle = gradient
    context.fillRect(0, 0, containerWidth, containerHeight)
  }

  const drawRings = () => {
    const context = ensureContext()
    if (!context || !config) return

    const centerX = containerWidth / 2
    const centerY = containerHeight / 2

    for (const ring of config.rings) {
      context.save()
      context.beginPath()
      context.strokeStyle = ring.color
      context.lineWidth = ring.thickness
      if (ring.glow) {
        context.shadowColor = ring.color
        context.shadowBlur = ring.glow * 40
      }
      context.arc(centerX, centerY, ring.radius, 0, Math.PI * 2)
      context.stroke()
      context.restore()
    }
  }

  const drawNodes = (time: number) => {
    const context = ensureContext()
    if (!context || !config) return

    const centerX = containerWidth / 2
    const centerY = containerHeight / 2

    config.nodes.forEach((node, index) => {
      const angle = time * 0.001 * node.speed + index
      const x = centerX + Math.cos(angle) * node.radius
      const y = centerY + Math.sin(angle) * node.radius

      context.save()
      context.beginPath()
      context.fillStyle = node.color
      context.shadowColor = node.color
      context.shadowBlur = 25
      context.arc(x, y, node.size, 0, Math.PI * 2)
      context.fill()
      context.restore()
    })
  }

  const drawSparks = (time: number) => {
    const context = ensureContext()
    if (!context || !config) return

    const centerX = containerWidth / 2
    const centerY = containerHeight / 2

    config.sparks.forEach((spark, index) => {
      const angle = time * 0.0015 * spark.speed + index * 1.2
      const x = centerX + Math.cos(angle) * spark.radius
      const y = centerY + Math.sin(angle) * spark.radius

      context.save()
      const gradient = context.createRadialGradient(x, y, 0, x, y, spark.size * 6)
      gradient.addColorStop(0, spark.color)
      gradient.addColorStop(1, 'transparent')

      context.fillStyle = gradient
      context.fillRect(x - spark.size * 3, y - spark.size * 3, spark.size * 6, spark.size * 6)
      context.restore()
    })
  }

  const renderFrame = (time: number) => {
    const context = ensureContext()
    if (!context || !config || reduceMotion) return

    context.clearRect(0, 0, containerWidth, containerHeight)
    drawBackground()
    drawRings()
    drawSparks(time)
    drawNodes(time)

    animationFrame = window.requestAnimationFrame(renderFrame)
  }

  const stopAnimation = () => {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame)
      animationFrame = null
    }
  }

  const maybeStartAnimation = () => {
    if (!browser || reduceMotion || !config || animationFrame) return
    animationFrame = window.requestAnimationFrame(renderFrame)
  }

  const handleMotionPreference = (event?: MediaQueryListEvent) => {
    if (!browser) return
    reduceMotion = event ? event.matches : mediaQuery?.matches ?? true
    if (reduceMotion) {
      stopAnimation()
    } else {
      maybeStartAnimation()
    }
  }

onMount(() => {
  if (!browser) return

  let cancelled = false
  mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  handleMotionPreference()
  mediaQuery.addEventListener('change', handleMotionPreference)

  const init = async () => {
    try {
      const response = await fetch('/assets/hero-orbit.json')
      if (response.ok) {
        config = (await response.json()) as HeroOrbitConfig
      }
    } catch (error) {
      console.warn('Unable to load hero orbit config', error)
    } finally {
      if (!cancelled && canvas) {
        resizeCanvas()
        maybeStartAnimation()
      }
    }
  }

  init()
  window.addEventListener('resize', resizeCanvas)

  return () => {
    cancelled = true
    stopAnimation()
    window.removeEventListener('resize', resizeCanvas)
    mediaQuery?.removeEventListener('change', handleMotionPreference)
  }
})

  $: showCanvas = !!config && !reduceMotion
</script>

<div class="relative w-full" aria-hidden="true">
  <canvas
    bind:this={canvas}
    class={`w-full h-[420px] sm:h-[520px] lg:h-[640px] rounded-[32px] border border-brand-border/60 bg-brand-card/40 backdrop-blur ${
      showCanvas ? 'opacity-100' : 'opacity-0'
    } transition-opacity duration-500`}
  />

  <picture
    class={`absolute inset-0 transition-opacity duration-500 ${showCanvas ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
  >
    <source srcset={fallbackSources.avif} type="image/avif" />
    <source srcset={fallbackSources.webp} type="image/webp" />
    <img src={fallbackSources.png} alt={fallbackAlt} class="w-full h-full object-cover rounded-[32px]" loading="eager" fetchpriority="high" />
  </picture>
</div>
