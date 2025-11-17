## Scope
- Audit every page/route for mobile and responsive UX quality (phones, small tablets, large tablets, desktop).
- Identify missing patterns, bugs, confusing flows, access issues and friction — no gimmicks; deliver pragmatic improvements.

## Methodology
1. Viewport matrix:
   - Phones: 360×640 (Android), 375×812 (iPhone notch), 414×896 (Plus); landscape variants
   - Tablets: 768×1024 (iPad portrait), 1024×768 (landscape)
   - Desktop tiers: 1280, 1440, 1920
2. Devices & environments:
   - Chromium + WebKit (iOS Safari surrogate) using Playwright screenshots
   - Lighthouse mobile audits per route
3. Heuristics & standards:
   - WCAG 2.1 AA, Apple HIG, Material guidelines, Nielsen heuristics
   - Tap targets ≥44px, contrast ≥4.5:1, consistent spacing/typography

## Global Checks
- Header/nav: collapse behavior, sticky interactions, tap target sizes, focus-visible states
- Footer: spacing, link density, scroll-to-content
- Typography: line length on small screens, legibility, consistent scale
- Images: responsive `sizes/srcset`, object-fit cropping, lazy loading
- Forms: input types, labels/help, autofill, error visibility, keyboard-safe scrolling
- Buttons/CTAs: consistent variants, disabled/loading states, minimum sizes, no hover-dependence
- Layout: avoid horizontal scrolling, manage content stacking order
- Safe areas: iOS notch safe-area insets, status bar color
- Performance: CLS/LCP (image placeholders), prefetch, minimal JS on content pages
- Accessibility: landmarks, heading hierarchy, aria-live for async, focus management, semantic lists/tables

## Page-by-Page Audit Plan
- Home (`/`): hero scaling, eligibility section stacking, nav focus
- Give Support (`/give-support`): vertical “model” readability, partners grid wrapping, donation card measures
- Donate (`/donate`): Donorbox iframe responsiveness, monthly emphasis clarity, tier cards stacking
- Impact (`/impact`): KPI cards grid reflow, donut chart legibility, story block image cropping, last-updated visibility
- Resources hub & detail (`/resources`, `/resources/[slug]`): prose widths, TOC interactions on mobile, image figures
- Get Aid (`/get-aid`, `/get-aid/apply`, `/get-aid/success`): form field groups, validation messages, keyboard behavior, success CTA clarity
- App (`/app/apply`, `/app/success`, `/app/dashboard`): dashboard card density, list scrolling, empty states
- Auth (`/auth/login`): form inputs, OTP/email types, error states, keyboard & autofill
- Donor Dashboard (`/(donor)/donor-dashboard`): KPI tiles, tables, pagination, filters on mobile
- Beneficiary Portal (`/(beneficiary)/portal` + privacy): consent controls, data access modals, long lists
- Staff Dashboard & Ops (`/(staff)/staff-dashboard`, `/(staff)/operations`, `/(staff)/application/[id]`): overflow tables, action buttons on mobile, progress bars, sticky action bars
- Partners (`/partners`): upload flows, long text readability, mobile file inputs

## Deliverables
- Route-by-route issue list with severity (Critical/Major/Minor)
- Annotated screenshots per viewport with callouts
- Accessibility checklist per route (headings/labels/aria)
- Performance summary (Lighthouse mobile scores, key metrics)
- Consolidated improvement plan with quick wins and structural refactors

## Prioritized Improvements (Examples)
- Nav: reduce header height; ensure hamburger works keyboard-only; add focus-visible
- Forms: unify error styles, persistent inline messages, prevent keyboard overlap; input `type` correctness
- Cards/lists: no hover-dependence; explicit tap feedback; condensed spacing on mobile
- Story blocks: enforce `object-fit: cover` with focal cropping; readable captions
- Tables: responsive patterns (stacked rows, scroll containers with aria labels)
- Safe-area CSS: apply `env(safe-area-inset-*)` for header/footer
- Meta tags: `theme-color` for mobile browser UI

## Execution Plan
### Phase 1: Automated Sweep
- Playwright screenshots for all routes at defined viewports
- Lighthouse mobile audits; collect CLS/LCP/TTI
- A11y linting: headings, labels, focus, contrast quick checks
### Phase 2: Findings Report
- Compile issues by route with severity and suggested fix patterns
- Provide component-level adjustments (tokens for spacing, tap sizes)
### Phase 3: Fix Implementation
- Apply global tokens (tap sizes, spacing), nav/footer, forms
- Page-specific fixes; tables/lists patterns; story/image handling
### Phase 4: Verify
- Re-run Playwright/Lighthouse; accessibility pass; publish deltas
### Phase 5: Deploy & Monitor
- Deploy, watch analytics/error logs, iterate on residuals

## Acceptance Criteria
- No horizontal scroll at mobile breakpoints across all routes
- Tap targets ≥44px; focus-visible everywhere; consistent forms
- Lighthouse mobile ≥90 (Perf, A11y, SEO) on key routes
- No hover-dependent interactions required on touch devices
- All async states accessible (aria-live), errors readable, keyboard usable

Confirm, and I will begin the full audit and deliver the findings with screenshots and prioritized fixes, then proceed to implement improvements route-by-route.