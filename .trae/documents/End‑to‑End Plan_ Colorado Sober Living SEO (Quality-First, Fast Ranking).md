## Objectives

- Rank across every Colorado sober living query (cheap/affordable, scholarships, rules, near me, city modifiers) using only high‑quality, verified content.
- Deliver a robust technical foundation (SSR, canonicals, sitemap, schema, CWV) and a complete content architecture (city pages, scholarship hub, FAQ hub, editorial guides).
- Build authority via GMB, citations, partners, and ethical distribution (Medium with canonicals), then monitor and iterate based on real GSC data.

## Technical Foundation

- SSR for all SEO pages: render titles/meta/schema server‑side; no client-only head tags.
- Canonicals: one canonical per page; consistent URL structures for cities/services.
- Unified sitemap & robots: single server-generated sitemap covering all targeted pages; minimal, valid robots policy.
- Schema strategy: JSON‑LD arrays with WebPage, FAQPage (where applicable), BreadcrumbList; LocalBusiness/Residence only with verified fields (no placeholder phone/hours).
- Internal linking: dense cross-links between city pages, Scholarship Hub, FAQ Hub, Resources, and homepage; breadcrumbs on all.
- Performance: optimize images, preload fonts, defer non‑critical JS; target LCP < 2.5s, CLS < 0.1.
- Security: server-only secrets; audited endpoints; CSRF/rate limits; no client exposure of service keys.

## Content Architecture

- City Pages `/co/{city}/sober-living`:
  - Brand intro and value proposition tailored to sober living in {city}.
  - Verified local services (name, description, payment options, certifications), scholarship pathways, costs, rules, timelines.
  - Meeting directories (AA/NA/SMART) via authoritative links; emergency and county resources; “last updated” stamps + references.
  - FAQ block per city; testimonials and partner mentions; Breadcrumb + FAQ schema.
- Scholarship Hub `/scholarships`:
  - Eligibility, documentation, partners, application process; WebPage + FAQ + Breadcrumb schema; strong CTAs and cross-links.
- Sober Living FAQ Hub `/faq/sober-living`:
  - Comprehensive answers (costs, rules, timelines, scholarships); FAQ schema; links to Scholarships and the Colorado directory.
- Editorial Guides:
  - “How sober living works in Colorado”, “Scholarship pathways”, “Avoiding scams” (fact-based, non-adversarial, with sources).
- Resources Directory `/co`:
  - Statewide overview; links to city pages; references to SAMHSA, BHA, county health.

## Data & Integrity

- Sources: SAMHSA, Colorado BHA, county health departments, partner orgs, crisis services.
- No randomness: deterministic titles and copy; remove any fabricated or unverifiable claims.
- References: cite sources; display “last updated” with dates.

## Distribution & Authority

- Google Business Profiles per priority city; consistent NAP; photos; encourage real reviews.
- Local citations/directories (health, recovery, community); ensure consistent NAP.
- Partners & PR: announce scholarships and partnerships via local outlets and recovery orgs.
- Medium summaries: high-quality posts with canonical links back to main pages; avoid duplication.

## Monitoring & Iteration

- Google Search Console: submit sitemap; request indexing for priority pages; ingest data into dashboards.
- Weekly checks: index coverage, query insights, CTR, positions; adjust content depth/internal links based on GSC.
- Schema validation; CWV monitoring; fix regressions proactively.

## Rollout Plan

- Phase 1: Technical hardening (SSR, canonicals, sitemap/robots, schema, CWV, security).
- Phase 2: Content coverage (city pages, scholarships hub, sober living FAQ hub, editorial guides) and internal linking graph.
- Phase 3: Distribution & authority (GMB, citations, partners, PR, Medium with canonicals).
- Phase 4: Monitoring & optimization (GSC ingestion, dashboards, weekly iteration).

## Timelines (Realistic)

- Indexing: hours–3 days after submission.
- Long‑tail wins: 3–10 days with unique city pages and hubs.
- Mid‑tail city intent: 2–6 weeks with GMB/citations.
- Head terms: 6–12+ weeks, faster with PR/backlinks.

## Quality Gates & Acceptance

- 95%+ index coverage within 2 weeks; valid schema on all targeted pages; CWV green.
- Top‑10 for “sober living {major city}” in 4–8 weeks; measurable increases in impressions/CTR.
- No thin/duplicate content; clean internal linking; accurate canonicals; server-only secrets.

I will begin immediately with Phase 1–2, implementing high-quality city pages, scholarships and FAQ hubs, SSR schema, canonicals, internal linking and performance safeguards — then proceed with distribution and monitoring without asking further questions.
