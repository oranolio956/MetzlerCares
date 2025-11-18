## Summary Findings
- Tailwind theme and design tokens are centralized in `d:\MetzlerCares\tailwind.config.js` and `src\lib\styles\brand-tokens.css`.
- Global shell and navigation live in `src\routes\+layout.svelte` and `src\lib\components\Navigation.svelte`.
- Homepage is `src\routes\+page.svelte` with premium components under `src\lib\components\premium\*` (hero, cards, trust, lead-capture, dashboard, chat).
- Assessment and insurance verification flow is in `PremiumLeadCapture.svelte` and `InsuranceVerifier.svelte`.
- Role-based dashboards/routes exist for beneficiary, donor, partner, staff with Supabase guards; Sanity integration is in `src\lib\utils\sanity.ts`; donations use Donorbox, not Stripe.

## Implementation Plan By Area
### Homepage Hero (PremiumHero)
- Update copy to recovery-centric messaging and add Colorado emphasis.
- Apply gradient from deep navy to soft blue; elevate CTA styling with bright green and micro-animation.
- Add subtle compliance tagline and trust badges.
- Files: `src\lib\components\premium\PremiumHero.svelte`, content references in `src\routes\+page.svelte`.

### Value Proposition Grid
- Implement 3-column grid with icons (speed/heart/map) and fade-in on scroll.
- Use `PremiumCard` variants for consistent elevation and hover.
- Files: `src\routes\+page.svelte`, `src\lib\components\premium\PremiumCard.svelte`.

### Trust & Compliance Cards
- Add 4-card credibility section with badges/seals and tooltips; include purple accent for awareness.
- Files: `src\lib\components\premium\PremiumTrustSignals.svelte`, styles in `brand-tokens.css`.

### Multi-Step Assessment Form
- Refine progressive disclosure: Basic Info → Needs/Preferences → Insurance.
- Add progress indicator, privacy microcopy, and success message.
- Emit analytics events per step (`form_step_completed`), plus submit success/failure.
- Files: `src\lib\components\premium\PremiumLeadCapture.svelte`.

### Dashboard Demo
- Update mock beneficiary preview (progress trackers, chat bubbles, matches) and caption.
- Ensure motion-safe transitions and reduced-motion respect.
- Files: `src\lib\components\premium\PremiumDashboard.svelte`.

### Insurance Verification Tool
- Tighten 30-second flow, validate inputs, and enhance result copy for covered/alternatives.
- Add event tracking for verification start/complete.
- Files: `src\lib\components\InsuranceVerifier.svelte`, route `src\routes\insurance\[provider]\+page.svelte`.

### Navigation & Role Redirects
- Ensure sticky nav with scroll behavior; mobile hamburger menu interactions.
- Add "Get Started" CTA linking to assessment; post-login auto-redirect based on role (beneficiary → progress dashboard, etc.).
- Files: `src\lib\components\Navigation.svelte`, guards already in role `+layout.server.ts` files; confirm redirects in `hooks.server.ts` or role layouts.

### Donor Flow & Payments
- Retain Donorbox integration for secure donations; enhance donor page copy and tiered cards.
- If Stripe is desired later, plan integration with `VITE_STRIPE_PUBLISHABLE_KEY` after confirmation.
- Files: `src\routes\donate\+page.svelte`, `src\routes\give-support\+page.svelte`.

## Design System Updates
- Colors: Add/reaffirm palette
  - Primary deep navy `#1a237e`, secondary bright green `#00c853`, accent white `#ffffff`, and awareness purple `#800080`.
  - Update Tailwind theme in `tailwind.config.js` and CSS variables in `brand-tokens.css`.
- Typography: Scale headings
  - Increase H1 to ~4rem with responsive clamp; ensure Inter is the primary UI font.
  - Import Inter via `<link>` in `+layout.svelte` head and set font stacks in tokens.
- Spacing/Elevation/Radius
  - Maintain generous whitespace; use subtle shadows and rounded corners; tune hover elevations.
- Micro-interactions
  - Use existing Svelte transitions (`fade`, `slide`, `fly`) and utilities in `powerhouse-animations.css`; respect `prefers-reduced-motion`.

## Performance, Security, Accessibility
- Performance
  - Keep route-based code splitting; ensure lazy image loading with existing LazyImage patterns; use AVIF/WebP where available.
- Security
  - Confirm CSP headers; ensure input validation and rate limiting on API routes; keep Supabase audit logging calls.
- Accessibility
  - Enforce WCAG 2.1: semantic structure, ARIA labels, keyboard navigation; AAA color contrast on CTAs and text.

## Analytics & Monitoring
- Google Analytics events
  - `form_step_completed`, `assessment_submitted`, `insurance_verification_started/completed`, `cta_clicked`.
- Configure event dispatch from components and verify in global analytics init in `+layout.svelte`.

## Acceptance Criteria
- Homepage reflects updated copy, visuals, and trust sections; CTAs use the new color scheme and micro-interactions.
- Assessment and insurance tools run smoothly with progressive steps and analytics instrumentation.
- Navigation is sticky, mobile-responsive, and routes users to role dashboards after login.
- Design system updated (colors including purple accents, larger headings, spacing/elevation) with accessibility and performance maintained.
- No new dependencies added; changes align with existing patterns and components.