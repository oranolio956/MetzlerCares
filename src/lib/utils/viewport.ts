import { browser } from '$app/environment'

type RevealOptions = {
  threshold?: number
  rootMargin?: string
  once?: boolean
}

export function revealOnScroll(node: HTMLElement, options: RevealOptions = {}) {
  if (!browser) {
    node.dataset.reveal = 'visible'
    return
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion) {
    node.dataset.reveal = 'visible'
    return
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          node.dataset.reveal = 'visible'
          if (options.once ?? true) {
            observer.unobserve(node)
          }
        } else if (!(options.once ?? true)) {
          node.dataset.reveal = 'hidden'
        }
      })
    },
    {
      threshold: options.threshold ?? 0.35,
      rootMargin: options.rootMargin ?? '0px 0px -10% 0px'
    }
  )

  observer.observe(node)

  return {
    destroy() {
      observer.disconnect()
    }
  }
}
