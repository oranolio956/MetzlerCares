export function withParams(url: string, params: Record<string, string | number>) {
  const u = new URL(url)
  for (const [k, v] of Object.entries(params)) {
    u.searchParams.set(k, String(v))
  }
  return u.toString()
}

export function buildSanitySrcSet(url: string, widths: number[], quality = 75) {
  return widths.map(w => `${withParams(url, { w, q: quality, auto: 'format' })} ${w}w`).join(', ')
}

export const defaultSizes = '(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1024px'
