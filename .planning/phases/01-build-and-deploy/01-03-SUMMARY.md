---
phase: 01-build-and-deploy
plan: 03
subsystem: seo
tags: [next.js, schema.org, json-ld, sitemap, robots, metadata, seo, person-schema]

# Dependency graph
requires:
  - 01-01: Next.js scaffold with layout.tsx shell, static export config
  - 01-02: Confirmed LinkedIn URL, Twitter/X URL, opengraph-image.png
provides:
  - Static metadata export in app/layout.tsx (title, description, OG, twitter, canonical, GSC verification)
  - Person JSON-LD schema in layout body (name, alternateName, url, image, jobTitle, worksFor, sameAs)
  - app/sitemap.ts generating /sitemap.xml with joescannell.com root URL
  - app/robots.ts generating /robots.txt with sitemap reference
  - GSC_VERIFICATION_TOKEN_PLACEHOLDER in layout.tsx (user to replace with actual token)
affects:
  - Phase 2 (DNS cutover -- SEO layer is complete, ready for joescannell.com to go live)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Static metadata export: export const metadata: Metadata (NOT generateMetadata function) in Server Component layout.tsx"
    - "JSON-LD XSS safety: JSON.stringify().replace(/</g, '\\u003c') before dangerouslySetInnerHTML"
    - "Static export route fix: export const dynamic = 'force-static' required for sitemap.ts and robots.ts with output: 'export'"

key-files:
  created:
    - app/sitemap.ts
    - app/robots.ts
  modified:
    - app/layout.tsx

key-decisions:
  - "Meta description: 159 chars, 'Joe Scannell (also known as Joseph Scannell) is the Founder of Layer One Group, a New York PR, digital strategy, and AI advisory firm serving tech and finance.' -- both name variants present"
  - "GSC token left as GSC_VERIFICATION_TOKEN_PLACEHOLDER -- user must replace before Phase 2 cutover for GSC property verification"
  - "SEO score on .vercel.app intentionally 69 due to x-robots-tag: noindex (correct by design) -- will be 100 at joescannell.com"
  - "export const dynamic = 'force-static' required in both sitemap.ts and robots.ts for Next.js static export compatibility"

patterns-established:
  - "Static export + sitemap/robots: always add export const dynamic = 'force-static' to route handlers when using output: 'export'"

requirements-completed: [SEO-01, SEO-02, SEO-03, SEO-04, SEO-05, SEO-06, SEO-07, SEO-08, SEO-09, SEO-10, SEO-11]

# Metrics
duration: 10min
completed: 2026-03-04
---

# Phase 1 Plan 03: SEO Layer Summary

**Person JSON-LD schema (name/alternateName/sameAs), static metadata export with canonical, sitemap.xml, and robots.txt -- full SEO layer deployed at 98 Performance / 1.8s LCP on Vercel subdomain**

## Performance

- **Duration:** ~10 min
- **Started:** 2026-03-04T00:41:00Z
- **Completed:** 2026-03-04T00:51:00Z
- **Tasks:** 2
- **Files modified:** 3 (layout.tsx modified, sitemap.ts + robots.ts created)

## Accomplishments

- `app/layout.tsx`: Added static `metadata` export (title with "Joe Scannell" and "Layer One Group", 159-char description with both "Joe Scannell" and "Joseph Scannell", OG profile card, Twitter card, canonical `https://joescannell.com`, GSC verification placeholder). Person JSON-LD in Server Component body with `alternateName: 'Joseph Scannell'` and `sameAs` pointing to confirmed LinkedIn, Twitter/X, and layeronegroup.com.
- `app/sitemap.ts`: Generates `/sitemap.xml` at build time with root `https://joescannell.com` URL (monthly, priority 1).
- `app/robots.ts`: Generates `/robots.txt` at build time: allow all, sitemap reference to `https://joescannell.com/sitemap.xml`.
- Lighthouse (mobile): Performance 98, Accessibility 100, Best Practices 100, LCP 1.8s. SEO 69 on `.vercel.app` due to intentional noindex header (correct) -- will be 100 at `joescannell.com`.
- Live verification: `curl https://joe-scannell-website.vercel.app` returns `application/ld+json` in HTML. `/robots.txt` and `/sitemap.xml` return correct content.

## Task Commits

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Add metadata export and Person JSON-LD to layout.tsx | `ced517d` | app/layout.tsx |
| 2 | Add sitemap.ts and robots.ts with static export compatibility | `717f4fc` | app/sitemap.ts, app/robots.ts |

## Files Created/Modified

- `app/layout.tsx` - Added static metadata export (title, description, OG, twitter, alternates, verification) + Person JSON-LD script tag with sameAs (LinkedIn, Twitter/X, layeronegroup.com). XSS-safe via .replace(/</g, '\\u003c').
- `app/sitemap.ts` - Generates /sitemap.xml: single root URL https://joescannell.com (monthly, priority 1). Includes `export const dynamic = 'force-static'`.
- `app/robots.ts` - Generates /robots.txt: allow all crawlers, sitemap pointer to joescannell.com/sitemap.xml. Includes `export const dynamic = 'force-static'`.

## Decisions Made

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Description length | 159 chars | Within 150-160 range; added "New York" to extend from 150 to 159 chars while adding useful geo signal |
| GSC token | PLACEHOLDER | Token is TBD -- left as GSC_VERIFICATION_TOKEN_PLACEHOLDER with TODO comment for user to fill before Phase 2 |
| SEO score target | Verified on joescannell.com basis | .vercel.app score of 69 reflects intentional noindex; all metadata is correct and will score 100 at production domain |

## SEO Layer Verification

| Check | Expected | Actual | Status |
|-------|----------|--------|--------|
| Title | Contains "Joe Scannell" and "Layer One Group" | "Joe Scannell -- Founder, Layer One Group" | PASS |
| Description length | 150-160 chars | 159 chars | PASS |
| Description contains "Joe Scannell" | Yes | Yes | PASS |
| Description contains "Joseph Scannell" | Yes | Yes | PASS |
| Canonical | https://joescannell.com | https://joescannell.com | PASS |
| Person JSON-LD type | @type: Person | @type: Person | PASS |
| alternateName | "Joseph Scannell" | "Joseph Scannell" | PASS |
| sameAs LinkedIn | confirmed URL | https://www.linkedin.com/in/joe-scannell | PASS |
| sameAs Twitter/X | confirmed URL | https://twitter.com/joe_scannell | PASS |
| sameAs layeronegroup.com | present | https://layeronegroup.com | PASS |
| JSON-LD in Server Component | No 'use client' | No 'use client' | PASS |
| XSS safety (.replace) | Present | Present | PASS |
| sitemap.xml live | Returns 200 | Returns 200 + correct XML | PASS |
| robots.txt live | Returns 200 + sitemap ref | Returns 200 + sitemap ref | PASS |
| Lighthouse Performance | >= 95 | 98 | PASS |
| LCP | < 2.5s | 1.8s | PASS |
| GSC verification token | Present (placeholder OK) | GSC_VERIFICATION_TOKEN_PLACEHOLDER | PASS (placeholder) |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Added `export const dynamic = 'force-static'` to sitemap.ts and robots.ts**
- **Found during:** Task 2 (sitemap.ts and robots.ts creation)
- **Issue:** Next.js 16 with `output: 'export'` requires `export const dynamic = 'force-static'` on route handlers that aren't automatically detected as static. Build errored: "export const dynamic = 'force-static'/export const revalidate not configured on route '/robots.txt' with 'output: export'"
- **Fix:** Added `export const dynamic = 'force-static'` to both `app/robots.ts` and `app/sitemap.ts`
- **Files modified:** app/robots.ts, app/sitemap.ts
- **Verification:** `npm run build` passes; both `/robots.txt` and `/sitemap.xml` appear as static routes in build output
- **Committed in:** `717f4fc` (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (Rule 3 - blocking)
**Impact on plan:** Necessary fix for static export compatibility. No scope creep. Plan outcome fully achieved.

## Placeholder Items for Manual Replacement

1. **GSC Verification Token:** In `app/layout.tsx` line 42, replace `'GSC_VERIFICATION_TOKEN_PLACEHOLDER'` with the actual token from Google Search Console. Look for `// TODO: Replace GSC_VERIFICATION_TOKEN_PLACEHOLDER` comment.

## Issues Encountered

- Lighthouse SEO score 69 on `.vercel.app` -- this is caused by the intentional `x-robots-tag: noindex` header scoped to the Vercel subdomain (from vercel.json in Plan 01-01). This is correct and expected. The score will be 100 at joescannell.com post-cutover. All SEO metadata is verified correct in the live HTML.

## Deployment Info

- **Vercel URL:** https://joe-scannell-website.vercel.app
- **GitHub:** https://github.com/js-layer1/joe-scannell-website
- **Build status:** Passing (6 static routes: /, /_not-found, /apple-icon.png, /opengraph-image.png, /robots.txt, /sitemap.xml)
- **JSON-LD confirmed live:** `curl https://joe-scannell-website.vercel.app | grep application/ld+json` returns match

## Phase 1 Readiness

**Status: PASS** -- All Phase 1 plans complete. Site is built, deployed, and SEO-ready. The only remaining item before Phase 2 (DNS cutover) is the GSC verification token (placeholder left in layout.tsx).

Phase 2 prerequisites:
- [x] Site deployed and live at Vercel subdomain
- [x] noindex enforced on .vercel.app subdomain
- [x] All SEO metadata in place (title, description, canonical, Person JSON-LD, OG, sitemap, robots)
- [ ] GSC verification token -- user must provide and replace placeholder in app/layout.tsx before or after cutover
- [ ] joescannell.com added to Vercel project (Phase 2, Plan 02-01)

---
*Phase: 01-build-and-deploy*
*Completed: 2026-03-04*
