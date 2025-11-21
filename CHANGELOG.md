# Change Log

## Homepage System Revamp

- Standardized homepage to use `hero-section` and shared `.card`/button components; removed parallax and blur overlays (`src/routes/+page.svelte`).
- Unified colors/typography to deep-navy/sage palette; improved contrast.

## Error Handling & UX

- Specific status-based titles and message in `src/routes/+error.svelte`.
- Support email now a working `mailto:` link; Return to Home button remains accessible.
- Added client-side error logging trigger to `/api/security/log`.

## Security Logging

- New endpoint `POST /api/security/log` (`src/routes/api/security/log/+server.ts`) to record client-side error events via `securityLogger`.

## Resources Page Alignment

- Aligned table of contents, breadcrumbs, and prose styles to design system (`src/routes/resources/[slug]/+page.svelte`).

## Blog Loading & Accessibility

- Debounced loads guard with requestId to prevent race conditions; clearer CMS error text and `aria-live` for error announcements (`src/routes/blog/+page.svelte`).
- Slight image quality reduction for grid performance.

## Mobile Menu Accessibility

- Restores focus to menu toggle on close; Escape and link click close behaviors retained (`src/routes/+layout.svelte`).
