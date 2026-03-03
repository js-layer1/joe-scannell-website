# Pitfalls Research

**Domain:** Personal SEO link-hub website / Carrd-to-Next.js platform migration
**Researched:** 2026-03-03
**Confidence:** HIGH (verified against Vercel official docs, Google Search Central, Next.js docs, and multiple migration post-mortems)

---

## Critical Pitfalls

### Pitfall 1: vercel.app Subdomain Causes Duplicate Content Penalty

**What goes wrong:**
Once deployed on Vercel, the site is accessible at both `joeScannell.vercel.app` (or similar) and `joescannell.com`. Search engines see these as two separate pages with identical content. Google may split ranking signals between both URLs, diluting the authority of the canonical custom domain. For a site that depends entirely on its domain authority and name-match ranking, this can meaningfully suppress rankings.

**Why it happens:**
Vercel automatically assigns a `.vercel.app` subdomain to every project. Developers deploy successfully and add their custom domain but forget that the Vercel subdomain remains publicly accessible and crawlable. Most tutorials don't emphasize this risk for SEO-dependent sites.

**How to avoid:**
Implement a three-layer defense before DNS cutover:
1. Add `<link rel="canonical" href="https://joescannell.com/" />` in the page `<head>` using Next.js `metadata.alternates.canonical` in `layout.tsx`.
2. Configure `vercel.json` headers or Next.js `headers()` to send `X-Robots-Tag: noindex` for requests originating from the `.vercel.app` domain.
3. After launch, use Google Search Console's URL Inspection tool to confirm only `joescannell.com` is being indexed.

**Warning signs:**
- Google Search Console shows the `.vercel.app` URL indexed alongside the custom domain.
- `site:joescannell.vercel.app` in Google returns results after launch.
- Two properties appear in GSC with similar content.

**Phase to address:** Foundation / Build phase (before DNS cutover). The canonical tag and noindex header must be in place before the site goes live.

---

### Pitfall 2: DNS Cutover Without Pre-Generating SSL Certificate Causes Downtime

**What goes wrong:**
Switching DNS records to point at Vercel before the SSL certificate is provisioned causes a window — potentially minutes to hours — where `joescannell.com` serves an SSL error. Any Googlebot crawls during this window result in errors logged in GSC, and users who visit see a browser security warning. For a domain with existing authority this can create transient crawl errors that pollute GSC data.

**Why it happens:**
It seems natural to just update DNS and let Vercel handle everything. But SSL provisioning via Let's Encrypt requires a DNS challenge that can lag. If the certificate isn't pre-generated, Vercel starts the provisioning process only after DNS starts resolving — creating a gap.

**How to avoid:**
Follow Vercel's zero-downtime sequence:
1. Add `joescannell.com` to the Vercel project in the dashboard *before* touching DNS.
2. Wait for Vercel to provision the SSL certificate (verify in dashboard: Domains > Certificate issued).
3. Then update DNS records (A record to `76.76.21.21`, CNAME `www` to `cname.vercel-dns.com`).
DNS TTL on Carrd is reportedly ~5 minutes, so propagation should be fast. Full nameserver changes take up to 48 hours — prefer A record/CNAME swap over nameserver transfer for minimal downtime.

**Warning signs:**
- Vercel dashboard shows domain added but certificate status is "Pending" when you're about to change DNS.
- Browser shows "certificate not trusted" immediately after DNS change.
- GSC reports spike in coverage errors right after migration.

**Phase to address:** DNS Cutover phase. Make this a checklist gate: certificate must show "issued" before DNS is touched.

---

### Pitfall 3: Losing Domain Authority by Not Setting Up GSC Before Launch

**What goes wrong:**
The domain `joescannell.com` has tenure and existing authority. If Google Search Console is not verified and a sitemap submitted promptly after launch, Google crawls the new platform cold — without the signal from GSC that the site owner acknowledges the migration. Re-crawl and re-indexing can take weeks instead of days, during which rankings may temporarily drop.

**Why it happens:**
GSC setup is treated as a "nice to have" post-launch cleanup task rather than a pre-launch requirement. The assumption is "Google already knows this domain." But a platform change resets crawl patterns.

**How to avoid:**
- Verify the GSC property (Domain property via DNS TXT record, which Vercel supports) before going live.
- Submit a sitemap (`/sitemap.xml`) immediately after DNS propagation confirms.
- Use "Request Indexing" on the homepage URL via GSC URL Inspection tool within the first 24 hours.
- Note: The GSC "Change of Address" tool is NOT needed here — the domain stays the same (`joescannell.com`). It's only for cross-domain moves. Using it unnecessarily creates confusion.

**Warning signs:**
- GSC property not verified 24 hours after launch.
- No sitemap submitted within 48 hours of launch.
- GSC shows "Discovered — currently not indexed" status for the homepage.

**Phase to address:** Launch / SEO verification phase.

---

### Pitfall 4: Headshot Image Lazy-Loaded as LCP Element Tanks Core Web Vitals

**What goes wrong:**
On a single-page personal site, the headshot is almost certainly the Largest Contentful Paint (LCP) element. If Next.js's `<Image>` component is used without the `priority` prop, Next.js defaults to lazy loading — meaning the most visible above-the-fold image loads last. This can push LCP to 3-5+ seconds, which Google uses as a Core Web Vitals signal. Bad LCP directly hurts search ranking, particularly for name-branded queries where competition is tight.

**Why it happens:**
Developers use `<Image src="..." alt="..." />` which is correct, but forget that Next.js lazy-loads images by default. The `priority` prop must be explicitly set on above-the-fold images. A 2025 Web Almanac study found ~16% of pages still lazy-load their LCP image.

**How to avoid:**
Add `priority` to the headshot image element:
```tsx
<Image
  src="/headshot.jpg"
  alt="Joe Scannell"
  width={300}
  height={300}
  priority  // required — this is the LCP element
/>
```
Also ensure the image is served in modern formats (Next.js handles WebP/AVIF conversion automatically) and sized appropriately (don't serve a 2000px image for a 300px display slot).

**Warning signs:**
- Lighthouse report flags "Image was detected as LCP but was lazily loaded."
- LCP score above 2.5 seconds in Lighthouse.
- PageSpeed Insights shows the headshot as the LCP element with a poor score.

**Phase to address:** Build phase. Verify with Lighthouse before DNS cutover.

---

### Pitfall 5: Person Schema Structured Data Malformed or Incomplete

**What goes wrong:**
The Person schema is the primary structured data signal telling Google who `joescannell.com` represents. Malformed JSON-LD — wrong property names, missing required fields, invalid URL formats — causes Google to ignore the schema entirely. Without it, the site relies solely on text matching for the name-branded query. With it, Google can display rich results and Knowledge Panel data.

**Why it happens:**
Schema.org property names are exact and case-sensitive (`sameAs` not `same_as`, `jobTitle` not `title`). Copying examples from blog posts that use outdated schema versions or wrong property names is common. Additionally, placing JSON-LD in a client component (with `"use client"`) means it may not render server-side, making it invisible to Googlebot.

**How to avoid:**
- Implement JSON-LD in a Server Component in `layout.tsx` or `page.tsx`, not a client component.
- Use a `<script type="application/ld+json">` tag via Next.js metadata or direct JSX.
- Include key fields: `@type: "Person"`, `name`, `url`, `jobTitle`, `worksFor`, `sameAs` (array of LinkedIn, Layer One Group).
- Validate with Google's Rich Results Test tool before launch.
- Validate with Schema.org validator as secondary check.

**Warning signs:**
- Rich Results Test returns "no results detected" for the URL.
- GSC Enhancements tab shows no structured data.
- Schema.org validator shows errors.

**Phase to address:** Build phase. Run Rich Results Test as a pre-launch gate before DNS cutover.

---

### Pitfall 6: Canonical Tag Missing or Pointing to Wrong URL Variant

**What goes wrong:**
Without a canonical tag, Google must guess which URL is authoritative among variations: `http://joescannell.com`, `https://joescannell.com`, `https://www.joescannell.com`, `https://joeScannell.com` (case variants), and the Vercel subdomain. Even a brief indexing of the wrong variant can split authority. The 50-site Next.js SEO study found only 50% of sites implement canonical tags.

**Why it happens:**
Developers assume HTTPS redirect and domain setup handles canonicalization. But Googlebot doesn't always follow redirects during crawl — it may index the redirect source and the destination separately. Without an explicit canonical, Google makes its own determination.

**How to avoid:**
In `app/layout.tsx`, set:
```tsx
export const metadata: Metadata = {
  alternates: {
    canonical: 'https://joescannell.com',
  },
}
```
This renders as `<link rel="canonical" href="https://joescannell.com/" />` in the HTML head on every page. Verify with `curl -I https://joescannell.com | grep canonical` or inspect page source post-launch.

**Warning signs:**
- Page source does not contain `<link rel="canonical">`.
- GSC Coverage report shows "Duplicate without user-selected canonical" warnings.
- Multiple URL variants appearing in GSC coverage.

**Phase to address:** Build phase. Canonical must be present before DNS cutover.

---

## Technical Debt Patterns

Shortcuts that seem reasonable but create long-term problems.

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Skip sitemap.xml | Faster launch | Google discovers pages slowly, indexing lag weeks or months | Never — it's a 5-minute file for Next.js |
| Use placeholder headshot permanently | Faster to launch | Stock photo reduces trust, credibility, and name-matching signals for Google Images | Only in MVP phase; swap before treating as "live" |
| Skip robots.txt | No work needed | No crawl guidance; Google eventually figures it out but "eventually" = weeks | Never — 5-minute file, no excuse |
| Omit Open Graph tags | Faster build | Links shared on LinkedIn/Slack show no preview, reducing traffic and professionalism | Never for a professional personal site |
| Use `<img>` instead of `next/image` | Simpler code | Unoptimized format and size delivery; likely LCP failure | Never — next/image is a 1-line swap |
| Copy Layer One Group design | Design consistency, faster | Dilutes personal brand identity; the personal site should feel distinct from the agency | Never — explicit project requirement |

---

## Integration Gotchas

Common mistakes when connecting to external services.

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Google Search Console | Verify as "URL prefix" property | Verify as "Domain property" via DNS TXT record — covers all subdomains and http/https variants in one property |
| Google Search Console | Submit sitemap to wrong property | Must submit to the same property that covers the canonical URL (`https://joescannell.com`) |
| Vercel Domains | Add domain after DNS change | Add domain in Vercel dashboard first, wait for SSL provisioning, then change DNS |
| LinkedIn outbound link | Hard-coding a profile URL that changes | Use the canonical LinkedIn URL format: `linkedin.com/in/username` — do not use the `linkedin.com/pub/...` legacy format |
| Layer One Group outbound link | Linking to staging/preview URL | Always link to the production URL `https://layeronegroup.com`, not any Vercel preview URL |

---

## Performance Traps

Patterns that work fine in development but cause ranking issues in production.

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| LCP image not prioritized | Lighthouse LCP > 2.5s, CWV failure in GSC | Add `priority` prop to headshot `<Image>` | Day one — Lighthouse will catch this |
| Large uncompressed headshot | Slow load even with Next.js; image optimization limited by source size | Export headshot at 2x display size max (600px wide for 300px slot), high quality JPEG/PNG; Next.js handles WebP conversion | Immediately visible in Lighthouse audit |
| External font loading blocking render | FOUT, CLS score degraded | Use `next/font` with `display: swap` and preload; do not load fonts from external CDN via CSS `@import` | Visible in CLS metric on Lighthouse |
| Client-side rendering of above-fold content | Google sees blank page; name/title not in initial HTML | Keep all above-fold content in Server Components; avoid `"use client"` on the hero/main card | Detectable via `curl` on the URL — if name isn't in the raw HTML, Googlebot may not see it |

---

## Security Mistakes

Domain-specific security issues for a personal link-hub site.

| Mistake | Risk | Prevention |
|---------|------|------------|
| mailto: link without obfuscation | Spam bots harvest the email address from HTML | Acceptable risk for a professional personal site — obfuscation breaks accessibility; use professional email filtering instead |
| External links without `rel="noopener noreferrer"` | Minor security issue (window.opener exploit) on outbound links | Add `target="_blank" rel="noopener noreferrer"` to all external links (LinkedIn, Layer One Group, email) |
| No HTTPS enforcement | HTTP version accessible, dilutes canonical signals | Vercel enforces HTTPS automatically; verify that `http://joescannell.com` redirects to `https://joescannell.com` post-launch |

---

## UX Pitfalls

Common user experience mistakes that also affect SEO signals (bounce rate, engagement).

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Links open in same tab | User navigates away from joescannell.com to LinkedIn; no path back | Use `target="_blank"` for all outbound links (LinkedIn, Layer One Group, email client) |
| Generic page title "Home" or "Joe Scannell's Website" | Weak name-match signal; poor CTR in search results | Use exact title: "Joe Scannell — Layer One Group" or "Joe Scannell | PR & Communications" — the full name must be the first words |
| Missing meta description | Google generates its own, often unflattering excerpt | Write a 140-155 character description that includes "Joe Scannell," role, and Layer One Group |
| No visible link text / icon-only links | Screen readers and search engines cannot understand link purpose | Use descriptive `aria-label` on icon-only links; or use text alongside icons |
| Overly designed page that loads slowly on mobile | Mobile bounce before page renders | Keep design minimal; test on real mobile device; Lighthouse Mobile score target >90 |

---

## "Looks Done But Isn't" Checklist

Things that appear complete but are missing critical pieces.

- [ ] **Canonical tag:** Page looks correct in browser — verify with `curl https://joescannell.com | grep canonical` that the tag is present in raw HTML (not just rendered DOM)
- [ ] **Structured data:** Person schema appears correct in code — validate at https://search.google.com/test/rich-results before launch
- [ ] **Sitemap:** `sitemap.xml` file exists — verify it's actually accessible at `https://joescannell.com/sitemap.xml` (not 404ing)
- [ ] **robots.txt:** File exists — verify at `https://joescannell.com/robots.txt` and confirm it does NOT block Googlebot
- [ ] **LCP image priority:** Headshot looks great visually — run Lighthouse and confirm LCP < 2.5s and no lazy-load warning
- [ ] **Vercel subdomain noindex:** Site is live — confirm `https://[project].vercel.app` returns `X-Robots-Tag: noindex` via `curl -I`
- [ ] **GSC verified:** Console is set up — confirm "Domain" property (not URL prefix) and sitemap submitted
- [ ] **Open Graph preview:** OG tags look correct in source — test with LinkedIn Post Inspector and Twitter Card Validator
- [ ] **SSL on custom domain:** HTTPS works — confirm `http://joescannell.com` redirects to `https://joescannell.com`
- [ ] **Outbound links functional:** Links added to code — manually click each (LinkedIn, Layer One Group, email) in production to confirm correct URLs

---

## Recovery Strategies

When pitfalls occur despite prevention, how to recover.

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Vercel subdomain indexed by Google | MEDIUM (weeks to resolve) | Add canonical + noindex header, submit removal request in GSC for the .vercel.app URL, wait for re-crawl |
| SSL gap during DNS cutover | LOW (minutes if caught fast) | Revert DNS, wait for Vercel to provision cert, then re-cut over; downtime likely under 1 hour |
| LCP failing post-launch | LOW | Add `priority` prop, redeploy — Vercel deploy takes ~1 min; Lighthouse reflects fix immediately |
| Malformed Person schema | LOW | Fix JSON-LD, redeploy, revalidate with Rich Results Test, submit URL for re-indexing in GSC |
| GSC not set up at launch | MEDIUM (2-4 week indexing delay) | Set up GSC, submit sitemap, use URL Inspection to request indexing — full crawl still takes weeks |
| Rankings dropped after migration | HIGH (weeks to months) | Verify redirects in place, canonical set, GSC data clean; recovery averages 2-6 weeks for same-domain migrations; do not change domain |

---

## Pitfall-to-Phase Mapping

How roadmap phases should address these pitfalls.

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Vercel subdomain duplicate content | Foundation/Build (canonical + noindex header) | `curl -I https://[project].vercel.app` shows `X-Robots-Tag: noindex` |
| SSL gap during cutover | DNS Cutover (pre-flight checklist) | Vercel dashboard shows "Certificate issued" before DNS change |
| GSC not set up at launch | Launch/SEO (pre-cutover) | GSC Domain property verified, sitemap submitted within 24h |
| LCP image lazy-loaded | Build (image implementation) | Lighthouse Mobile LCP < 2.5s, no lazy-load warning |
| Malformed Person schema | Build (structured data implementation) | Rich Results Test shows valid Person entity |
| Missing canonical tag | Build (layout.tsx metadata) | `curl https://joescannell.com | grep canonical` returns correct URL |
| robots.txt/sitemap.xml missing | Build (static file generation) | Both files return 200 with correct content |
| Open Graph missing/malformed | Build (metadata) | LinkedIn Post Inspector shows correct preview |

---

## Sources

- Vercel: [Avoiding duplicate-content SEO with vercel.app URLs and custom domains](https://vercel.com/kb/guide/avoiding-duplicate-content-with-vercel-app-urls) — HIGH confidence
- Vercel: [Zero-downtime migration to Vercel](https://vercel.com/kb/guide/zero-downtime-migration) — HIGH confidence
- Google Search Central: [Site Moves and Migrations](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes) — HIGH confidence
- Google Search Central: [Change of Address tool](https://support.google.com/webmasters/answer/9370220?hl=en) — HIGH confidence (same-domain platform migrations do NOT require this tool)
- Next.js: [Image Component docs — priority prop](https://nextjs.org/docs/app/api-reference/components/image) — HIGH confidence
- Next.js: [LCP — SEO guide](https://nextjs.org/learn/seo/lcp) — HIGH confidence
- SALT.agency: [SEO Issues On Next.js Websites (50 Site Study)](https://salt.agency/blog/common-seo-issues-on-next-js-websites/) — MEDIUM confidence (third-party study, methodology not fully auditable)
- Search Engine Land: [Site Migration SEO Checklist](https://searchengineland.com/guide/ultimate-site-migration-seo-checklist) — MEDIUM confidence
- fastfwd: [20 Common SEO Mistakes on Site Migrations](https://www.fastfwd.com/20-common-seo-mistakes-seen-on-site-migrations-and-rebuilds/) — MEDIUM confidence
- OG Image gallery: [5 Common Mistakes with OG Images](https://www.ogimage.gallery/libary/5-common-mistakes-to-avoid-with-og-images) — MEDIUM confidence

---
*Pitfalls research for: Personal SEO link-hub / Carrd-to-Next.js migration (joescannell.com)*
*Researched: 2026-03-03*
