// Performance Optimization System - World-Class Speed & Core Web Vitals
// Ensures lightning-fast page loads and optimal user experience

export interface PerformanceMetrics {
  lcp: number // Largest Contentful Paint (target: < 2.5s)
  fid: number // First Input Delay (target: < 100ms)
  cls: number // Cumulative Layout Shift (target: < 0.1)
  fcp: number // First Contentful Paint (target: < 1.8s)
  ttfb: number // Time to First Byte (target: < 800ms)
  overallScore: number // 0-100
}

export interface OptimizationStrategy {
  imageOptimization: boolean
  codeSplitting: boolean
  lazyLoading: boolean
  preloading: boolean
  caching: boolean
  compression: boolean
  cdn: boolean
}

export class PerformanceOptimizer {
  private baseUrl: string

  constructor(baseUrl: string = 'https://metzlercares.com') {
    this.baseUrl = baseUrl
  }

  // Generate optimized image attributes
  generateImageAttributes(src: string, alt: string, options?: {
    width?: number
    height?: number
    priority?: boolean
  }): Record<string, string> {
    const attrs: Record<string, string> = {
      src,
      alt,
      loading: options?.priority ? 'eager' : 'lazy',
      decoding: 'async',
      fetchpriority: options?.priority ? 'high' : 'auto'
    }

    if (options?.width) attrs.width = options.width.toString()
    if (options?.height) attrs.height = options.height.toString()

    // Add srcset for responsive images
    if (options?.width) {
      attrs.srcset = `${src}?w=400 400w, ${src}?w=800 800w, ${src}?w=1200 1200w`
      attrs.sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
    }

    return attrs
  }

  // Generate preload links for critical resources
  generatePreloadLinks(resources: Array<{
    href: string
    as: 'script' | 'style' | 'image' | 'font' | 'fetch'
    type?: string
    crossorigin?: boolean
  }>): string {
    return resources.map(resource => {
      const attrs = [
        `href="${resource.href}"`,
        `as="${resource.as}"`,
        resource.type ? `type="${resource.type}"` : '',
        resource.crossorigin ? 'crossorigin' : ''
      ].filter(Boolean).join(' ')

      return `<link rel="preload" ${attrs}>`
    }).join('\n')
  }

  // Generate resource hints (dns-prefetch, preconnect)
  generateResourceHints(domains: string[]): string {
    const hints: string[] = []

    domains.forEach(domain => {
      hints.push(`<link rel="dns-prefetch" href="https://${domain}">`)
      hints.push(`<link rel="preconnect" href="https://${domain}" crossorigin>`)
    })

    return hints.join('\n')
  }

  // Generate optimized font loading
  generateFontLoading(fonts: Array<{
    family: string
    weights: number[]
    display?: 'swap' | 'block' | 'fallback' | 'optional'
  }>): string {
    const fontFamilies = fonts.map(font => 
      `family=${font.family.replace(/\s+/g, '+')}:wght@${font.weights.join(';')}`
    ).join('&')

    const display = fonts[0]?.display || 'swap'

    return `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?${fontFamilies}&display=${display}" rel="stylesheet">`
  }

  // Calculate performance score
  calculatePerformanceScore(metrics: PerformanceMetrics): number {
    let score = 100

    // LCP penalty
    if (metrics.lcp > 2.5) score -= (metrics.lcp - 2.5) * 10
    if (metrics.lcp > 4.0) score -= 20 // Additional penalty for very slow

    // FID penalty
    if (metrics.fid > 100) score -= (metrics.fid - 100) / 10
    if (metrics.fid > 300) score -= 15

    // CLS penalty
    if (metrics.cls > 0.1) score -= metrics.cls * 100
    if (metrics.cls > 0.25) score -= 20

    // FCP penalty
    if (metrics.fcp > 1.8) score -= (metrics.fcp - 1.8) * 5

    // TTFB penalty
    if (metrics.ttfb > 800) score -= (metrics.ttfb - 800) / 50

    return Math.max(0, Math.min(100, score))
  }

  // Generate critical CSS inline (for above-the-fold content)
  generateCriticalCSS(css: string): string {
    // In production, this would extract only above-the-fold CSS
    return `<style>${css}</style>`
  }

  // Generate service worker registration for caching
  generateServiceWorkerRegistration(swPath: string = '/sw.js'): string {
    return `<script>
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('${swPath}')
      .then(reg => console.log('SW registered'))
      .catch(err => console.log('SW registration failed'));
  });
}
</script>`
  }

  // Generate optimized meta tags for performance
  generatePerformanceMetaTags(): string {
    return `<meta http-equiv="x-dns-prefetch-control" content="on">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<meta name="theme-color" content="#2d5016">`
  }

  // Generate lazy loading script for images
  generateLazyLoadScript(): string {
    return `<script>
if ('loading' in HTMLImageElement.prototype) {
  // Native lazy loading supported
  const images = document.querySelectorAll('img[loading="lazy"]');
  images.forEach(img => {
    img.src = img.dataset.src || img.src;
  });
} else {
  // Fallback for browsers without native lazy loading
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/lozad/dist/lozad.min.js';
  document.body.appendChild(script);
  script.onload = () => {
    const observer = lozad();
    observer.observe();
  };
}
</script>`
  }

  // Generate code splitting hints
  generateCodeSplittingHints(chunks: Array<{
    name: string
    path: string
    priority: 'high' | 'medium' | 'low'
  }>): string {
    return chunks
      .filter(chunk => chunk.priority === 'high')
      .map(chunk => `<link rel="modulepreload" href="${chunk.path}">`)
      .join('\n')
  }

  // Generate compression hints
  generateCompressionHints(): string {
    return `<meta http-equiv="Content-Encoding" content="gzip, br">
<meta name="compress" content="true">`
  }

  // Generate CDN optimization hints
  generateCDNHints(cdnUrl: string): string {
    return `<link rel="dns-prefetch" href="${cdnUrl}">
<link rel="preconnect" href="${cdnUrl}" crossorigin>`
  }
}

// Export singleton instance
export const performanceOptimizer = new PerformanceOptimizer('https://metzlercares.com')
