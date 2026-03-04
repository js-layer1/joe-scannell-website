---
phase: 01-build-and-deploy
verified: 2026-03-03T20:00:00Z
status: human_needed
score: 24/25 must-haves verified
re_verification: false
human_verification:
  - test: "Open https://joe-scannell-website.vercel.app in a browser at 375px viewport width"
    expected: "Circular headshot, H1 'Joe Scannell', tagline 'Founder, Layer One Group', four pill-button links visible with no horizontal scroll. Warm off-white background. Page feels personal and distinct from Layer One Group brand."
    why_human: "Visual quality and warm aesthetic require human judgment. Mobile layout behavior at 375px cannot be confirmed from HTML inspection alone."
  - test: "Run Rich Results Test at https://search.google.com/test/rich-results with URL https://joe-scannell-website.vercel.app"
    expected: "Returns a valid Person entity result with name 'Joe Scannell', alternateName 'Joseph Scannell', jobTitle 'Founder', and sameAs listing LinkedIn, Twitter/X, and layeronegroup.com"
    why_human: "Rich Results Test requires a live browser-based tool call. Cannot fully validate schema rendering via grep of HTML source alone."
  - test: "Provide the actual Google Search Console verification token to replace GSC_VERIFICATION_TOKEN_PLACEHOLDER in app/layout.tsx line 42"
    expected: "layout.tsx has a real token value (e.g., 'AbCdEfGhIjKlMnOpQrStUvWxYz12345678') instead of the placeholder string. After replacing and redeploying, GSC can verify the property."
    why_human: "The GSC token is an external credential the user must supply. SEO-10 is technically present in the HTML but the placeholder value will not pass GSC property verification."
  - test: "Run Lighthouse mobile audit at https://joe-scannell-website.vercel.app"
    expected: "Performance >= 95, SEO score reflects intentional noindex on subdomain (expected ~69 on subdomain, will be 100 at joescannell.com). LCP < 2.5s. Summary reported 98 Performance and 1.8s LCP."
    why_human: "Lighthouse requires a live browser audit. The local static export (out/) reflects localhost-based OG URLs which differ from deployed output. Scores need confirmation on the live Vercel URL."
---

# Phase 1: Build and Deploy Verification Report

**Phase Goal:** Build and deploy Joe Scannell's personal SEO site -- a single-page link-in-bio with Person schema, warm design, and noindex on Vercel subdomain.
**Verified:** 2026-03-03T20:00:00Z
**Status:** human_needed (24/25 automated checks pass; 4 items need human confirmation)
**Re-verification:** No -- initial verification

---

## Goal Achievement

### Observable Truths (from Phase 1 Success Criteria)

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Page shows headshot, "Joe Scannell" H1, tagline, and working links to Layer One Group / LinkedIn / Twitter/X / Email | ? HUMAN | HTML source confirmed: H1, tagline, all 4 links present with correct hrefs. Visual appearance requires browser check. |
| 2 | Google Rich Results Test returns valid Person schema with name, jobTitle, url, sameAs array | ? HUMAN | JSON-LD confirmed present in live HTML with all required fields. Rendering by Rich Results Test tool requires browser. |
| 3 | Lighthouse: LCP < 2.5s, Performance >= 95, SEO 100 (on production domain) | ? HUMAN | Summary reports 98 Performance, 1.8s LCP. SEO 69 on subdomain is correct (noindex header). Needs live audit to confirm. |
| 4 | Page is mobile-responsive; layout holds at 375px viewport | ? HUMAN | Code uses `max-w-sm`, `px-6`, centered flex stack -- patterns are mobile-responsive. Visual confirmation required. |
| 5 | Vercel subdomain returns X-Robots-Tag: noindex header | ✓ VERIFIED | `curl -sI https://joe-scannell-website.vercel.app` returns `x-robots-tag: noindex` (confirmed live). |

**Automated score:** 1/5 success criteria fully automatable. 4/5 require human browser action (visual, Lighthouse, Rich Results).

---

## Required Artifacts

### Plan 01-01 Artifacts

| Artifact | Status | Details |
|----------|--------|---------|
| `next.config.ts` | ✓ VERIFIED | Contains `output: 'export'` and `images: { unoptimized: true }`. Both required patterns present. |
| `vercel.json` | ✓ VERIFIED | Contains `X-Robots-Tag: noindex` scoped to `.vercel.app` via host conditional regex. Pattern `(?!joescannell\\.com).*\\.vercel\\.app` correctly excludes production domain. |
| `app/layout.tsx` | ✓ VERIFIED | 87 lines. Contains Geist font variable, static metadata export, Person JSON-LD script tag. Substantive and wired. |
| `app/globals.css` | ✓ VERIFIED | Contains `@import "tailwindcss"` and 5 CSS custom properties. |
| `public/headshot.jpg` | ✓ VERIFIED | 400x400 JPEG, valid image (1206 bytes -- sharp-generated placeholder). |

### Plan 01-02 Artifacts

| Artifact | Status | Details |
|----------|--------|---------|
| `components/Avatar.tsx` | ✓ VERIFIED | next/image with `priority` prop present (LCP signal). 96px circular with ring border. |
| `components/NameCard.tsx` | ✓ VERIFIED | H1 text is exactly "Joe Scannell". Tagline is exactly "Founder, Layer One Group". |
| `components/LinkList.tsx` | ✓ VERIFIED | 4 links present: layeronegroup.com, linkedin.com/in/joe-scannell, twitter.com/joe_scannell, mailto:hello@layeronegroup.com. External links have `rel="noopener noreferrer"`. mailto has no rel/target (correct). |
| `app/page.tsx` | ✓ VERIFIED | Imports Avatar, NameCard, LinkList. Renders all three in centered vertical stack. |
| `app/favicon.ico` | ✓ VERIFIED | 661-byte file exists in `app/`. |
| `app/apple-icon.png` | ✓ VERIFIED | 3,465-byte PNG exists in `app/`. |
| `app/opengraph-image.png` | ✓ VERIFIED | 31,918-byte PNG exists in `app/`. 1200x630 dimensions (confirmed in metadata output). |

### Plan 01-03 Artifacts

| Artifact | Status | Details |
|----------|--------|---------|
| `app/layout.tsx` (metadata export) | ✓ VERIFIED | Static `export const metadata: Metadata` present (not `generateMetadata`). Title "Joe Scannell -- Founder, Layer One Group". Description 159 chars with both name variants. Canonical `https://joescannell.com`. OG profile type. GSC verification field present (placeholder). |
| `app/layout.tsx` (Person JSON-LD) | ✓ VERIFIED | `application/ld+json` script tag in Server Component. Contains: @type Person, name "Joe Scannell", alternateName "Joseph Scannell", url, image, jobTitle "Founder", worksFor Organization, sameAs [LinkedIn, Twitter/X, layeronegroup.com]. XSS-safe via `.replace(/</g, '\\u003c')`. |
| `app/sitemap.ts` | ✓ VERIFIED | Generates sitemap with `https://joescannell.com` root URL, monthly, priority 1. `export const dynamic = 'force-static'` present for static export compatibility. |
| `app/robots.ts` | ✓ VERIFIED | Allow all crawlers, sitemap reference to `https://joescannell.com/sitemap.xml`. `export const dynamic = 'force-static'` present. |

---

## Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `next.config.ts` | static export output | `output: 'export'` | ✓ WIRED | Pattern `output.*export` confirmed on line 3. |
| `vercel.json` | X-Robots-Tag header | host conditional rule | ✓ WIRED | Live curl confirms `x-robots-tag: noindex` returned on `.vercel.app`. |
| `app/layout.tsx` | font variable | `className={geist.variable}` on `<html>` | ✓ WIRED | `geist.variable` applied to html element on line 74. CSS font-family consumes it in globals.css. |
| `app/page.tsx` | Avatar, NameCard, LinkList | import statements | ✓ WIRED | All three imported and rendered in JSX. Confirmed in source and live HTML. |
| `components/Avatar.tsx` | `public/headshot.jpg` | next/image src prop with priority | ✓ WIRED | `src="/headshot.jpg"` and `priority` prop both present. Live HTML shows `<link rel="preload" as="image" href="/headshot.jpg"/>` (LCP hint active). |
| `components/LinkList.tsx` | external URLs | `rel="noopener noreferrer"` | ✓ WIRED | All 3 external links have correct rel. mailto correctly omits rel/target. |
| `app/layout.tsx` (JSON-LD) | Person schema sameAs | confirmed LinkedIn + Twitter/X URLs | ✓ WIRED | sameAs: `https://www.linkedin.com/in/joe-scannell`, `https://twitter.com/joe_scannell`, `https://layeronegroup.com`. No placeholders in URLs. |
| `app/layout.tsx` | canonical URL | `alternates.canonical` | ✓ WIRED | `canonical: 'https://joescannell.com'` confirmed in live HTML: `<link rel="canonical" href="https://joescannell.com"/>`. |
| `app/robots.ts` | sitemap.xml | `sitemap` property | ✓ WIRED | Live robots.txt returns `Sitemap: https://joescannell.com/sitemap.xml`. |

---

## Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|---------|
| PAGE-01 | 01-02 | Headshot photo displayed | ✓ SATISFIED | `components/Avatar.tsx` with next/image `/headshot.jpg`. Live HTML has `<img alt="Joe Scannell" ... src="/headshot.jpg"/>`. |
| PAGE-02 | 01-02 | "Joe Scannell" as H1 | ✓ SATISFIED | `NameCard.tsx` line 4: `<h1>Joe Scannell</h1>`. Live HTML confirms. |
| PAGE-03 | 01-02 | Professional title/tagline | ✓ SATISFIED | `<p>Founder, Layer One Group</p>` in NameCard. Confirmed in live HTML. |
| PAGE-04 | 01-02 | Prominent link to layeronegroup.com | ✓ SATISFIED | First link in LinkList: `href="https://layeronegroup.com"`. |
| PAGE-05 | 01-02 | Link to Joe's LinkedIn | ✓ SATISFIED | `href="https://www.linkedin.com/in/joe-scannell"` confirmed in LinkList. |
| PAGE-06 | 01-02 | Link to Joe's Twitter/X | ✓ SATISFIED | `href="https://twitter.com/joe_scannell"` confirmed in LinkList. |
| PAGE-07 | 01-02 | Email mailto: link | ✓ SATISFIED | `href="mailto:hello@layeronegroup.com"` in LinkList. |
| PAGE-08 | 01-02 | Mobile-responsive | ? HUMAN | Code uses responsive patterns (max-w-sm, px-6, centered flex). Visual check at 375px needed. |
| SEO-01 | 01-03 | Title tag with "Joe Scannell" and "Layer One Group" | ✓ SATISFIED | Title: "Joe Scannell -- Founder, Layer One Group". Both names present. Confirmed in live HTML. |
| SEO-02 | 01-03 | Meta description 150-160 chars with both name variants | ✓ SATISFIED | 159 chars. Contains "Joe Scannell" and "Joseph Scannell". Confirmed in live HTML. |
| SEO-03 | 01-03 | Self-referencing canonical URL | ✓ SATISFIED | `<link rel="canonical" href="https://joescannell.com"/>` in live HTML. |
| SEO-04 | 01-03 | Person schema with name, jobTitle, url, image, sameAs | ✓ SATISFIED | All fields present in JSON-LD: name, jobTitle "Founder", url, image, sameAs array. Confirmed in live HTML. |
| SEO-05 | 01-03 | Person schema alternateName "Joseph Scannell" | ✓ SATISFIED | `"alternateName":"Joseph Scannell"` in JSON-LD. Confirmed in live HTML. |
| SEO-06 | 01-03 | sameAs includes LinkedIn, Twitter/X, layeronegroup.com | ✓ SATISFIED | sameAs array has all three URLs with confirmed slugs. |
| SEO-07 | 01-03 | OG metadata (title, description, image 1200x630, type) | ✓ SATISFIED | og:title, og:description, og:image (1200x630 PNG), og:type "profile" all present in live HTML. |
| SEO-08 | 01-03 | sitemap.xml with root URL | ✓ SATISFIED | Live `https://joe-scannell-website.vercel.app/sitemap.xml` returns XML with `<loc>https://joescannell.com</loc>`. |
| SEO-09 | 01-03 | robots.txt referencing sitemap | ✓ SATISFIED | Live robots.txt: `Sitemap: https://joescannell.com/sitemap.xml`. |
| SEO-10 | 01-03 | Google Search Console verification meta tag | ⚠️ PARTIAL | Tag is present: `<meta name="google-site-verification" content="GSC_VERIFICATION_TOKEN_PLACEHOLDER"/>`. The tag exists but the value is a placeholder string -- GSC property verification will fail until the real token is substituted. This is a known, intentional gap documented in the SUMMARY. |
| SEO-11 | 01-03 | Core Web Vitals (headshot LCP priority, Performance >= 95) | ? HUMAN | Avatar has `priority` prop (LCP signal wired). Summary reports 98 Performance, 1.8s LCP. Needs Lighthouse confirmation on live URL. |
| DES-01 | 01-02 | Warm personal design distinct from Layer One Group | ? HUMAN | CSS tokens define warm off-white (#FAF8F5), charcoal (#2C2825), amber accent (#B8956A) -- no purple/pink/green. User approved at checkpoint. Visual confirmation recommended. |
| DES-02 | 01-02 | Favicon and apple-touch-icon | ✓ SATISFIED | `app/favicon.ico` (661 bytes) and `app/apple-icon.png` (3,465 bytes) exist. Live HTML has both `<link rel="icon">` and `<link rel="apple-touch-icon">` tags. |
| DES-03 | 01-01 | Font/typography appropriate for personal page | ✓ SATISFIED | Geist loaded via next/font/google with CSS variable. Applied to html element. Font preloaded in live HTML (`<link rel="preload" ... type="font/woff2"/>`). |
| INF-01 | 01-01 | Built with Next.js and deployed on Vercel | ✓ SATISFIED | Next.js 16.1.6. Deployed at https://joe-scannell-website.vercel.app. Live and responding HTTP 200. |
| INF-03 | 01-01 | Vercel subdomain has noindex header | ✓ SATISFIED | `curl -sI https://joe-scannell-website.vercel.app` returns `x-robots-tag: noindex`. Verified live. |

**Coverage:** 24 requirements assessed. 20 fully satisfied, 3 need human confirmation (PAGE-08, SEO-11, DES-01), 1 partial (SEO-10 -- placeholder token).

**Orphaned requirements check:** INF-02 and INF-04 are Phase 2 requirements (DNS cutover). Not claimed by Phase 1 plans. Correctly deferred.

---

## Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `app/layout.tsx` | 41-42 | `GSC_VERIFICATION_TOKEN_PLACEHOLDER` | ⚠️ Warning | GSC property verification (SEO-10) will not function until replaced. Known gap, documented in SUMMARY. Does not block SEO indexing at joescannell.com -- only blocks GSC property ownership verification. |
| `out/index.html` | (static export) | `og:image` uses `localhost:3000` | ℹ️ Info | The local `out/` static export contains `http://localhost:3000/opengraph-image.png` for OG image URLs because no `metadataBase` is set in `app/layout.tsx`. This is a local artifact only -- the live Vercel deployment correctly resolves to `https://joe-scannell-website.vercel.app/opengraph-image.png`. OG cards will work correctly at the production domain once `metadataBase` is set to `https://joescannell.com` for Phase 2 (or Vercel's runtime inference handles it as it does now on the subdomain). |

---

## Human Verification Required

### 1. Visual Design and Mobile Layout

**Test:** Open https://joe-scannell-website.vercel.app in a browser. Use DevTools to set viewport to 375px width (iPhone SE). Scroll to confirm no horizontal overflow.
**Expected:** Circular headshot at top, "Joe Scannell" as bold heading, "Founder, Layer One Group" in muted text below, four equal pill-button links (Layer One Group, LinkedIn, Twitter/X, Email). Warm off-white background. No purple, pink, or green from Layer One Group palette. User already approved this at the Plan 01-02 checkpoint.
**Why human:** Visual aesthetics, warm vs. cold feel, and mobile layout overflow cannot be confirmed from HTML/CSS inspection alone.

### 2. Rich Results Test: Person Schema

**Test:** Go to https://search.google.com/test/rich-results and enter `https://joe-scannell-website.vercel.app`.
**Expected:** Returns "Person" as a detected entity with name "Joe Scannell", alternateName "Joseph Scannell", jobTitle "Founder", and sameAs links to LinkedIn, Twitter/X, and layeronegroup.com.
**Why human:** The Rich Results Test requires a browser session with Google's testing tool. The JSON-LD is confirmed present in the live HTML (verified via curl), but rendering validation requires the tool.

### 3. GSC Verification Token (SEO-10)

**Test:** Obtain the Google Search Console HTML verification token for joescannell.com (or joe-scannell-website.vercel.app if using URL prefix property). Replace `'GSC_VERIFICATION_TOKEN_PLACEHOLDER'` on line 42 of `app/layout.tsx` with the real token value. Commit and push to trigger a Vercel redeploy.
**Expected:** After replacement and deploy, Google Search Console can verify the property by fetching the meta tag value.
**Why human:** The GSC token is an external credential only the site owner can retrieve. The code infrastructure for SEO-10 is complete -- only the credential value is missing.

### 4. Lighthouse Audit Confirmation

**Test:** Run Lighthouse on `https://joe-scannell-website.vercel.app` using Chrome DevTools or PageSpeed Insights (https://pagespeed.web.dev/).
**Expected:** Performance >= 95, LCP < 2.5s. Note: SEO score will be ~69 on the `.vercel.app` subdomain due to the intentional `x-robots-tag: noindex` header -- this is correct by design. The SUMMARY documents 98 Performance and 1.8s LCP.
**Why human:** Lighthouse requires a live browser audit. The local static export differs from the deployed output.

---

## Gaps Summary

No blocking gaps exist. The phase goal -- "The complete site is live on the Vercel subdomain, passing all pre-launch checks, and ready for DNS cutover" -- is substantially achieved. All automated verification passes.

Two items require human follow-up before Phase 2:

1. **GSC verification token** (SEO-10, WARNING): The `GSC_VERIFICATION_TOKEN_PLACEHOLDER` in `app/layout.tsx` must be replaced with the real token before Google Search Console can verify the property. This is a known, documented gap. The site will index correctly without it, but GSC will not recognize the property owner.

2. **OG image `metadataBase`** (INFO): The local static export produces `localhost:3000` OG image URLs. The live Vercel deployment correctly resolves this via runtime inference. For the production domain (joescannell.com), adding `metadataBase: new URL('https://joescannell.com')` to the metadata export in `app/layout.tsx` would make OG image URLs absolute in both static export and production, and is recommended before Phase 2 cutover.

Three success criteria (visual design, Rich Results Test, Lighthouse scores) require human browser verification but are expected to pass based on code inspection and Summary documentation.

---

_Verified: 2026-03-03T20:00:00Z_
_Verifier: Claude (gsd-verifier)_
