## Error Handling & UX
- Replace generic messaging with contextual errors in `src/routes/+error.svelte`:
  - Show `status`-specific titles (404, 500, 503) and map to friendly help text.
  - Make support email a real mailto link: `mailto:support@metzlerfoundations.org` instead of plain text (file: src/routes/+error.svelte:22–24).
  - Ensure the “Return to Home” anchor works and carries accessible name (file: src/routes/+error.svelte:24).
  - Add lightweight error telemetry (POST to `/api/security/events`) when `error` is present; include `status`, `url`, `userAgent`.
- Standardize error panels site‑wide:
  - Blog error state currently says “Something went wrong” (src/routes/blog/+page.svelte:283). Replace with specific failure reason (e.g., “Failed to load blog posts from CMS”) and keep retry button wired to `loadPosts()` (src/routes/blog/+page.svelte:285–290).

## Design System & Color Standardization
- Adopt the palette defined in `src/app.css` and remove inconsistent blues/opaque whites:
  - Replace ad‑hoc `bg-blue-*`, `text-blue-*`, `bg-white/95 + backdrop-filter` on homepage cards with the shared `.card` component (src/routes/+page.svelte:168–186). Drop `blur-3xl` backgrounds (lines 68–74) and use `hero-section` class from app.css.
  - Use CSS variables/classes: `text-primary`, `text-deep-navy-*`, `bg-soft-white`, `bg-warm-cream`, `btn-primary/btn-secondary` consistently.
- Typography cohesion:
  - Use the base heading/link styles from app.css instead of inline styles; ensure headline uses `font-serif` where the system expects it and paragraph text uses `text-deep-navy-700/900`.
- Contrast/readability:
  - Audit foreground/background pairs against WCAG AA. Fix any `opacity` that reduces legibility (e.g., `opacity-60` overlays on homepage background, src/routes/+page.svelte:63 should be increased or removed).

## Resource Pages Improvements
- Layout/consistency in `src/routes/resources/[slug]/+page.svelte`:
  - Replace mixed color names like `text-olive`, `text-navy` with deep-navy/sage system (e.g., lines 213–219, 286–297, 312–315, 373–399).
  - Keep article content within `prose` classes (already present at 320–356) and ensure headings/links match the design system.
  - Table of Contents: ensure generated IDs are applied to DOM consistently; keep only h2/h3, and add keyboard navigation to jump to sections.
  - Breadcrumbs: use consistent deep-navy link styles (lines 274–282).

## Blog Loading & Performance
- Data loading (src/routes/blog/+page.svelte):
  - Add robust error reporting with `console.error` and telemetry to `/api/security/events` when Sanity calls fail (lines 128–134, 90–92).
  - Cancel in-flight requests when filters change using `AbortController` to prevent race conditions with debounced load.
  - Image performance: keep `loading="lazy"`, add `width/height` and `decoding="async"`; ensure `urlFor(...).quality(80)` for grids (lines 323–330).
  - Pagination: guard buttons and aria labels; ensure keyboard focus order is preserved.

## Mobile Menu Fixes
- Menu in `src/routes/+layout.svelte`:
  - Confirm `aria-expanded`, `aria-controls` semantics (lines 72–90) and ensure Escape closes (lines 19–21) and link clicks close (lines 107–113).
  - Add focus management: when opening, focus first menu link (already at lines 23–30); add returning focus to the toggle on close.
  - Ensure menu container uses `positioned` + `z-50` and no backdrop blur; current `bg-white` and shadow are correct (line 105). Test overscroll and viewport width changes.

## Error Logging & Monitoring
- Frontend: reusable `logClientError({ context, error, status })` that POSTs to `/api/security/events` (no secrets; redacts PII). Use in `+error.svelte`, blog load, resource page errors.
- Server: confirm `src/routes/api/security/events/+server.ts` accepts and stores telemetry (append-only). If present, unify event shape.

## Accessibility & Responsive Testing
- Accessibility:
  - Ensure all interactive elements have visible focus styles (app.css already adds focus-visible ring).
  - Test color contrast for headings and body text; fix any failures with darker deep-navy variants.
  - Add aria-live for error messages where appropriate (blog results). Label pagination buttons.
- Responsive:
  - Verify homepage hero and cards on 360px, 768px, 1024px, 1440px. Remove parallax effects that harm low-end devices.
  - Test the mobile menu across iOS Safari, Chrome Android.
- Cross-browser:
  - Smoke-test on latest Chrome, Safari, Firefox, Edge.

## Documentation & Change Log
- Summarize changes per file with before/after notes:
  - `src/routes/+error.svelte`: specific error mapping, mailto link, accessible button.
  - `src/routes/+page.svelte`: remove blur/opaque overlays; use `.card`/`hero-section`; unify colors.
  - `src/routes/resources/[slug]/+page.svelte`: palette alignment; prose consistency; TOC fixes.
  - `src/routes/blog/+page.svelte`: error text, telemetry, abortable loads, image perf.
  - `src/routes/+layout.svelte`: mobile menu accessibility refinements.
- Add a short accessibility report (WCAG AA checklist outcomes).

## Verification Plan
- Unit/manual checks:
  - Trigger `+error.svelte` via a forced 500 and confirm mailto click opens client; “Return to Home” navigates.
  - Blog: simulate network failure and verify specific error text + telemetry.
  - Resource pages: scan headings and links for consistent styles and contrast.
  - Mobile menu: keyboard navigation, Escape behavior, focus management.
- Performance:
  - Lighthouse for homepage/blog on mobile & desktop; aim for >90 Performance/Accessibility.
