# Feature Research

**Domain:** Personal website / SEO link-hub (professional individual)
**Researched:** 2026-03-03
**Confidence:** HIGH

## Feature Landscape

### Table Stakes (Users Expect These)

Features that any professional personal website must have. Missing these signals an incomplete or unprofessional presence.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Headshot / photo | Establishes identity; without it the page feels anonymous | LOW | Next.js `<Image>` with explicit dimensions prevents CLS; use placeholder initially |
| Full name as H1 | Primary entity signal for Google; headline that names the person | LOW | Must match schema `name` property exactly |
| Professional title / tagline | Answers "who is this person and why does this page exist" | LOW | One line: role + org (e.g., "Founder, Layer One Group / Attorney") |
| Link to primary web property | Visitors need somewhere to go; also passes PageRank | LOW | Prominent CTA to layeronegroup.com |
| LinkedIn profile link | Standard professional web expectation; sameAs signal | LOW | Links out; also included in Person schema sameAs array |
| Email contact link | Low-friction contact; `mailto:` is sufficient for this use case | LOW | No form needed; `mailto:` href with styled link |
| Mobile-responsive layout | >60% of branded search clicks are mobile | LOW | Single column layout trivial to make responsive |
| HTTPS / SSL | Table stakes for trust; required for Google ranking signal | LOW | Vercel provides automatically |
| Favicon + apple-touch-icon | Browser tab and home screen identity | LOW | Next.js file-based: `favicon.ico` and `apple-icon.png` in `/app` root |
| Page title tag | Required for any indexable page; primary SERP display text | LOW | Format: "Joe Scannell — [Title], Layer One Group" |
| Meta description | Controls SERP snippet; affects CTR on branded queries | LOW | 150-160 chars; include both "Joe Scannell" and "Joseph Scannell" naturally |
| Canonical URL | Prevents duplicate content penalties if site is ever mirrored | LOW | Self-referencing canonical via Next.js metadata |
| Fast load / Core Web Vitals | Google ranking signal; single-page site should trivially pass | LOW | Static export or SSR with no client-side fetch; LCP is the headshot |

### Differentiators (Competitive Advantage)

These are what separate a purpose-built personal SEO page from a Carrd or Linktree throwdown. The primary goal is owning the "Joe Scannell" SERP.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Person schema (JSON-LD) | Directly signals identity to Google; accelerates Knowledge Panel eligibility; entity disambiguation for the name "Joe Scannell" | LOW | Use `@type: "Person"` with `name`, `jobTitle`, `url`, `image`, `sameAs`; NOT ProfilePage (Google explicitly says ProfilePage is for community/forum profiles, not personal homepages) |
| sameAs social graph | Connects the entity across web properties; Google uses this to confirm identity and resolve disambiguation | LOW | Include LinkedIn, layeronegroup.com, any verified professional profiles; limit to <15 high-quality URLs per best practice |
| Open Graph / Twitter Card metadata | Controls how the page renders when shared on LinkedIn, Twitter/X, iMessage; critical for the "Joe Scannell" page appearing polished when a prospect Googles and shares | LOW | og:image at 1200x630; og:title, og:description, og:type "profile"; Next.js metadata object handles this natively |
| Google Search Console verification + sitemap submission | Actively signals to Google "this page exists and is authoritative"; accelerates indexing of a new Vercel deploy | LOW | GSC meta tag in `<head>`; `/sitemap.xml` with a single URL entry; `/robots.txt` pointing to sitemap |
| Alternate name coverage ("Joseph Scannell") | Many people search full legal name; covering both variants in metadata captures both queries | LOW | Include `alternateName: "Joseph Scannell"` in Person schema; include in meta description naturally; consider `<title>` format that surfaces both |
| `<link rel="me">` reciprocal identity tags | Reinforces sameAs claims; some crawlers (and Mastodon/IndieWeb verifiers) use rel="me" to confirm profile ownership | LOW | Add `<link rel="me" href="[LinkedIn URL]">` etc. in `<head>`; zero visible impact |
| Distinct personal design (not L1G brand) | Signals Joe the person vs. Layer One Group the agency; reduces brand confusion; more personable | MEDIUM | Clean, minimal, personal aesthetic; photography-forward; no gradient glass system |

### Anti-Features (Commonly Requested, Often Problematic)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Blog / content section | "More content = more SEO" is conventional wisdom | Wrong for this use case: the domain authority already exists; content would dilute the single-entity focus and create maintenance burden; PROJECT.md explicitly rules this out | Domain authority + structured data is the SEO strategy; blog content belongs on layeronegroup.com |
| Contact form | Feels more professional than mailto | Adds backend complexity (or third-party dependency), GDPR surface area, spam handling, no meaningful conversion advantage for a one-person professional site | `mailto:` link is sufficient; projects the right level of directness for an attorney/founder |
| Dark mode | Users are accustomed to it on dev-oriented sites | Complexity without benefit; this is a quick personal page, not an app; doubles CSS surface area | Light mode only; keep scope minimal |
| Analytics beyond GSC | Know who visits | For a link-hub, the metric that matters is SERP rank for "Joe Scannell," not pageviews; analytics adds JS weight and privacy exposure | GSC provides impression/click data on branded queries; that's the KPI |
| Social feed embeds (Twitter/LinkedIn) | Shows activity, feels dynamic | Heavy JS, poor Core Web Vitals impact, external dependency, privacy implications (GDPR), frequently breaks when platform APIs change | Link to LinkedIn profile directly; let visitors click through |
| Multi-page navigation | Feels more complete | Destroys the single-page simplicity; adds routes that dilute PageRank concentration on the root URL | All content on `/`; the entire SEO goal is to make `/` rank |
| ProfilePage schema | Sounds right for a personal page | Google's official docs explicitly state ProfilePage is for community/forum profiles (forum members, author pages on news sites); for a personal homepage Google recommends Person schema directly | Use `@type: "Person"` at the page root instead |
| Animations / interactive UI | Looks impressive | LCP and INP (Core Web Vitals) are the metrics Google uses; motion libraries add JS weight; headshot load time IS the LCP; any animation that delays it hurts ranking | Static layout with CSS transitions at most; keep JS bundle minimal |

## Feature Dependencies

```
Person schema (JSON-LD)
    └──requires──> Headshot URL (image property needs a stable, public URL)
    └──requires──> Name as H1 (schema name must match visible H1)
    └──enhances──> sameAs social graph (schema is the container for sameAs)

sameAs social graph
    └──enhances──> Google Knowledge Panel eligibility
    └──enhances──> Entity disambiguation for "Joe Scannell"

Open Graph metadata
    └──requires──> Headshot / photo (og:image)
    └──requires──> Canonical URL (og:url must match canonical)

Google Search Console
    └──requires──> sitemap.xml (submitted in GSC for fast indexing)
    └──requires──> robots.txt (must reference sitemap)
    └──enhances──> Person schema (GSC confirms which entity owns the domain)

Headshot / photo
    └──drives──> LCP (Largest Contentful Paint) Core Web Vitals score
                     └──requires──> explicit width/height on <Image> to prevent CLS
```

### Dependency Notes

- **Person schema requires headshot URL:** The `image` property needs a stable, publicly accessible URL. If using a placeholder initially, ensure the URL is still valid and not a local or dynamic blob reference.
- **sameAs enhances Knowledge Panel:** The panel itself is Google's decision, not a feature we build — but sameAs is the primary signal we control that influences eligibility.
- **Headshot drives LCP:** On a single-page site with minimal content, the hero image IS the Largest Contentful Paint element. Optimizing it (Next.js `<Image>` with priority, correct sizing) is the single most impactful Core Web Vitals action.
- **Open Graph requires canonical URL:** `og:url` should be the canonical URL to avoid confusion when Googlebot and social crawlers disagree on the "real" URL.

## MVP Definition

### Launch With (v1)

The minimum needed to replace Carrd and immediately own the "Joe Scannell" SERP position.

- [ ] Headshot (placeholder acceptable at launch) — establishes visual identity; LCP element
- [ ] Name as H1 ("Joe Scannell") — primary entity signal
- [ ] Professional title / tagline — context for search result snippet
- [ ] Links to Layer One Group, LinkedIn, email — core link-hub function
- [ ] Person schema with sameAs (LinkedIn, layeronegroup.com) — entity SEO foundation
- [ ] Title tag + meta description covering "Joe Scannell" and "Joseph Scannell" — SERP control
- [ ] Open Graph metadata with og:image — social sharing appearance
- [ ] Canonical URL — prevents duplicate content edge cases
- [ ] Favicon + apple-touch-icon — browser/mobile identity
- [ ] robots.txt + sitemap.xml — indexing control
- [ ] GSC verification tag — submit sitemap, monitor branded query performance
- [ ] Mobile-responsive, fast-loading layout — Core Web Vitals baseline

### Add After Validation (v1.x)

Add once the page is ranking and GSC shows impressions for "Joe Scannell."

- [ ] `<link rel="me">` tags — adds identity reinforcement once sameAs is established; add when/if LinkedIn or other profiles support rel="me" verification
- [ ] `alternateName` in schema — add "Joseph Scannell" if GSC shows impressions for that variant; small addition to existing schema block

### Future Consideration (v2+)

- [ ] Real headshot swap — defer until available; placeholder works for launch
- [ ] Additional sameAs links — add if Joe acquires verified profiles on other platforms (e.g., Crunchbase, legal directories); only add quality profiles per best practice (<15 total)

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Person schema (JSON-LD) | HIGH | LOW | P1 |
| Name H1 + title tag | HIGH | LOW | P1 |
| Headshot | HIGH | LOW | P1 |
| Links (L1G, LinkedIn, email) | HIGH | LOW | P1 |
| Open Graph metadata | HIGH | LOW | P1 |
| Mobile-responsive layout | HIGH | LOW | P1 |
| Meta description | HIGH | LOW | P1 |
| Canonical URL | MEDIUM | LOW | P1 |
| Favicon + apple-touch-icon | MEDIUM | LOW | P1 |
| robots.txt + sitemap.xml | MEDIUM | LOW | P1 |
| GSC verification | MEDIUM | LOW | P1 |
| sameAs social graph | HIGH | LOW | P1 |
| alternateName coverage | MEDIUM | LOW | P2 |
| `<link rel="me">` tags | LOW | LOW | P2 |
| Distinct personal design | MEDIUM | MEDIUM | P1 |

**Priority key:**
- P1: Must have for launch
- P2: Should have, add when possible
- P3: Nice to have, future consideration

## Competitor Feature Analysis

"Competitors" here are the other tools/approaches that could fill this role: Carrd (current), Linktree, and a plain HTML page.

| Feature | Carrd (current) | Linktree | Custom Next.js |
|---------|----------------|----------|----------------|
| Custom domain SEO authority | Partial (custom domain supported) | Weak (hosted on linktree.ee) | Full (domain authority flows to root) |
| Person schema / structured data | None | None | Full control via JSON-LD in layout.tsx |
| sameAs / entity SEO | None | None | Full control |
| Open Graph control | Limited | None | Full control via Next.js metadata |
| Core Web Vitals control | Limited | Poor (heavy JS) | Full control; trivial to pass on static page |
| GSC sitemap submission | Cannot verify | Cannot verify | Full control |
| Design freedom | Moderate | Minimal (button stack only) | Total |
| Consistency with L1G Vercel stack | No | No | Yes |

**Key finding:** Carrd and Linktree provide zero structured data capability. The entire differentiating SEO value of this project — Person schema, sameAs, entity disambiguation — can only be achieved on an owned, custom-coded page. This is the correct reason to move off Carrd.

## Sources

- Google Search Central: ProfilePage schema — https://developers.google.com/search/docs/appearance/structured-data/profile-page
- Google Search Central: Organization Schema (sameAs reference) — https://developers.google.com/search/docs/appearance/structured-data/organization
- Zipyra: Person Schema and sameAs Setup for Creator Knowledge Panels — https://zipyra.com/blog/person-schema-and-sameas-setup-for-creator-knowledge-panels
- Schema App: How Schema Markup Enhances Your Google Knowledge Panel — https://www.schemaapp.com/schema-markup/how-schema-markup-helps-you-gain-or-enhance-a-google-knowledge-panel/
- Next.js Docs: Metadata and OG Images — https://nextjs.org/docs/app/getting-started/metadata-and-og-images
- Next.js Docs: generateMetadata — https://nextjs.org/docs/app/api-reference/functions/generate-metadata
- Lindy Panels: Technical Guide to Google Knowledge Panel — https://lindypanels.com/blogs/technical-guide-how-to-get-a-google-knowledge-panel
- Backlinko: Google's 200 Ranking Factors 2026 — https://backlinko.com/google-ranking-factors
- Click to Startup: Personal Website vs Linktree — https://clicktostartup.com/personal-website-vs-linktree-which-one/
- UXify: Core Web Vitals 2025 Guide — https://uxify.com/blog/post/core-web-vitals
- Weekend Growth: sameAs Schema for E-E-A-T — https://weekendgrowth.com/sameas-schema/
- Phoenix SEO Geek: Structured Data SEO 2026 — https://phoenixseogeek.com/structured-data-seo/

---
*Feature research for: personal website / SEO link-hub (professional individual)*
*Researched: 2026-03-03*
