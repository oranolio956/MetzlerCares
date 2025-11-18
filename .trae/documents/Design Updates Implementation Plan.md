## Scope
- Implement homepage design/content updates and design system adjustments (colors, typography, micro-interactions) aligned with recovery-centric messaging.
- Enhance navigation and role-aware redirects.
- Instrument analytics for key flows.
- Prepare commit, push to `github.com/Oranolio956/MetzlerCares`, and run build/execute.

## Implementation Steps
1) Design System
- Add/update theme colors: deep navy `#1a237e`, bright green `#00c853`, white `#ffffff`, awareness purple `#800080` in `tailwind.config.js` and `brand-tokens.css`.
- Set Inter as primary UI font; import via `<link>` in `+layout.svelte`; update font stacks.
- Confirm spacing, elevation, and motion-safe utilities.

2) Homepage Content & Components
- PremiumHero: update headline/subheadline/CTA copy; apply gradient and CTA styling; add compliance tagline.
- Value Grid: implement 3 columns with icons and fade-in; copy for rapid access, dignity, local mastery.
- Trust Cards: 4-card credibility with badges/tooltips and purple accents.
- Lead Capture: refine progressive steps, privacy microcopy, success message.
- Dashboard Demo: polish mock elements and caption.
- Insurance Verifier: streamline inputs and result copy.

3) Navigation & Role Redirects
- Ensure sticky nav and mobile hamburger behaviors.
- Add "Get Started" CTA linking to assessment.
- Verify post-login redirects based on Supabase user role to respective dashboards.

4) Analytics
- Emit GA events: `form_step_completed`, `assessment_submitted`, `insurance_verification_started/completed`, `cta_clicked` from components.

## Verification
- Run local build and dev server; test mobile/desktop breakpoints; validate reduced-motion behavior.
- Check color contrast (AAA) and semantics.
- Confirm GA events firing and role redirects.

## Commit & Deployment
- Create a single commit with changes.
- Add remote `origin` to `github.com/Oranolio956/MetzlerCares` (if not set), push branch.
- Execute build and start preview to validate.

## Notes
- Donations currently use Donorbox; Stripe key exists in `.env` but not in use. We will keep Donorbox unless you approve switching to Stripe later.
- No new dependencies are introduced; we leverage existing components and utilities.