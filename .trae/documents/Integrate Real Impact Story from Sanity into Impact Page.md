## Objective

* Add a real, authored impact story from Sanity and pair it with live metrics so the page reads like: "Jane is one of the 1,428 people you helped house." No generic templates.

## Data Model (Sanity)

* Create a new document schema `impactStory` with fields:

  * `name` (string)

  * `headline` (string)

  * `summary` (text)

  * `body` (portable text)

  * `photo` (image)

  * `city` (string), `state` (string)

  * `is_featured` (boolean)

  * `published` (boolean)

  * `publishedAt` (datetime)

* Files to add/update:

  * `sanity-studio/schemas/impactStory.ts`

  * `sanity-studio/schemas/index.ts` (register `impactStory`)

## Content Authoring (Sanity Studio)

* Add at least one featured, published story (e.g., Jane), with an image and short summary suitable for the public site.

## Server-Side Fetch (Impact Page)

* Use existing client in `src/lib/utils/sanity.ts` to fetch the featured story.

* Update `src/routes/impact/+page.server.ts` to:

  * Keep existing Supabase metrics retrieval.

  * Add GROQ query: `*[_type == "impactStory" && published == true && is_featured == true] | order(publishedAt desc)[0]`.

  * Return both `metrics` and `story` in `data`.

* Define a lightweight `ImpactStory` type (name, headline, summary, photo, city, state) near the loader or in `src/lib/types.ts`.

## UI Integration (Impact Page)

* Update `src/routes/impact/+page.svelte` by replacing the current "Stories of Hope" placeholder with the real story block:

  * Render story `headline` and `summary` with professional typography.

  * Compose the pairing sentence using metrics: `"{story.name} is one of the {formatNumber(metrics.total_beneficiaries_served)} people you helped house."`

  * Show `photo` (left or top), name, city/state; no icon bubbles, no gold accents, no hover gimmicks.

  * Maintain the clean, professional card style already used across the page.

* If needed for images, add `@sanity/image-url` and a small utility in `src/lib/utils/sanity-image.ts` to build `photo` URLs.

## Performance & Caching

* Keep current caching headers from `+page.server.ts` (e.g., short TTL with public cache) so metrics and story remain fresh.

## Validation

* Run `npm run build` to confirm no CSS/PostCSS errors.

* Preview locally with `npm run preview` and verify story renders with paired metric.

* Deploy to Vercel.

## Notes

* We intentionally avoid generic multi-card templates.

* Styling continues using the sage/deep-navy system; no rounded icon bubbles or gold.

* Sanity read-only queries use existing project `qxaj7c29` and dataset `production`.

