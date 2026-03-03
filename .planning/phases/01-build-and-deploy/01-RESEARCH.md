# Phase 1: Build and Deploy - Research

**Researched:** 2026-03-03
**Domain:** Next.js 16 personal site / SEO link-hub — scaffold, build, and Vercel deploy
**Confidence:** HIGH — all findings verified against official Next.js docs (lastUpdated 2026-02-27), Vercel docs, and prior project research

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Page layout:**
- Small/subtle headshot — text-forward, photo is secondary
- Warm & approachable mood: warm off-white background, soft shadows, rounded elements
- Spacious and centered feel — content floats in the middle of the page

**Content & copy:**
- H1: "Joe Scannell"
- Tagline: "Founder, Layer One Group"
- Links: Layer One Group, LinkedIn, Twitter/X, Email (hello@layeronegroup.com)
- All links have equal prominence — no hierarchy between them

**Design system:**
- Sans-serif font (no serif, no mix)
- Warm color palette: off-white background, dark charcoal text
- Rounded corners on interactive elements

**Stack (from STATE.md):**
- Next.js 16.1.6 + Tailwind CSS 4 + static export (`output: 'export'`)
- schema-dts for typed JSON-LD
- No analytics, no motion library

### Claude's Discretion

- Exact layout structure (centered stack vs split — pick what works best for a warm, approachable feel with small photo)
- Link presentation style (buttons vs text links vs icons — pick what fits the warm mood)
- Accent color selection (subtle accent or fully neutral — whatever fits)
- Specific font choice (any clean sans-serif that feels warm, not cold/technical)
- Spacing and typography scale
- Favicon design approach
- OG image design (static vs generated)

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| PAGE-01 | Page displays a headshot photo (placeholder acceptable at launch) | Next.js `<Image priority>` with local file in `public/`; placeholder at launch per FEATURES.md |
| PAGE-02 | Page displays "Joe Scannell" as the H1 heading | Single semantic `<h1>` in `NameCard` component; must match Person schema `name` exactly |
| PAGE-03 | Page displays a professional title/tagline (role + organization) | Subheading below H1: "Founder, Layer One Group" |
| PAGE-04 | Page has a prominent link to layeronegroup.com | Always link to production URL `https://layeronegroup.com`; `target="_blank" rel="noopener noreferrer"` |
| PAGE-05 | Page has a link to Joe's LinkedIn profile | Canonical format `linkedin.com/in/[slug]`; confirm slug before authoring Person schema |
| PAGE-06 | Page has a link to Joe's Twitter/X profile | Confirm handle before authoring sameAs array |
| PAGE-07 | Page has an email contact link (mailto:) | `mailto:hello@layeronegroup.com`; no backend needed |
| PAGE-08 | Page is mobile-responsive and works on all screen sizes | Single-column centered layout; Tailwind responsive utilities; Lighthouse mobile target >90 |
| SEO-01 | Descriptive title tag containing "Joe Scannell" and "Layer One Group" | Next.js `metadata.title` in `layout.tsx`; format: "Joe Scannell — Founder, Layer One Group" |
| SEO-02 | Meta description (150-160 chars) covering "Joe Scannell" and "Joseph Scannell" | `metadata.description`; include both name variants naturally in 150-160 chars |
| SEO-03 | Self-referencing canonical URL | `metadata.alternates.canonical: 'https://joescannell.com'` in `layout.tsx` |
| SEO-04 | Person schema JSON-LD with name, jobTitle, url, image, and sameAs array | `<script type="application/ld+json">` in Server Component; validated via Rich Results Test |
| SEO-05 | Person schema includes alternateName "Joseph Scannell" | `alternateName: 'Joseph Scannell'` in the JSON-LD object |
| SEO-06 | Person schema sameAs includes LinkedIn, Twitter/X, and layeronegroup.com | sameAs array: LinkedIn URL, Twitter/X URL, `https://layeronegroup.com` |
| SEO-07 | Open Graph metadata (og:title, og:description, og:image at 1200x630, og:type) | `metadata.openGraph` object in `layout.tsx`; static `opengraph-image.png` in `app/` |
| SEO-08 | sitemap.xml with the root URL | `app/sitemap.ts` — Next.js generates at build time |
| SEO-09 | robots.txt referencing the sitemap | `app/robots.ts` — Next.js generates at build time |
| SEO-10 | Google Search Console verification meta tag | `metadata.verification.google: 'TOKEN'` in `layout.tsx`; token from GSC |
| SEO-11 | Page passes Core Web Vitals (headshot as priority LCP element) | `priority` prop on headshot `<Image>`; Lighthouse audit before close |
| DES-01 | Clean, personal design distinct from Layer One Group brand | Warm off-white bg, charcoal text, rounded elements; NO glass/gradient aesthetic |
| DES-02 | Site has a favicon and apple-touch-icon | `favicon.ico` in `app/` (or `public/`); `apple-icon.png` in `app/` — Next.js file convention |
| DES-03 | Site uses a font/typography system appropriate for a personal page | `next/font` with a warm sans-serif (e.g., Geist Sans already on Vercel, or Inter) |
| INF-01 | Site is built with Next.js and deployed on Vercel | `create-next-app`, Vercel GitHub integration, auto-deploy on push to main |
| INF-03 | Vercel subdomain (.vercel.app) has noindex header to prevent duplicate indexing | `vercel.json` headers rule: `X-Robots-Tag: noindex` conditional on `.vercel.app` hostname |
</phase_requirements>

---

## Summary

This phase builds a greenfield Next.js 16.1.6 single-page personal site from scratch and deploys it to a Vercel subdomain. The goal is a complete, SEO-ready site that passes Lighthouse and Rich Results Test, ready for DNS cutover in Phase 2. There are no moving parts — no database, no API routes, no state management. The entire implementation is static HTML/CSS generated at build time.

The work naturally groups into three sequential plans: (1) scaffold + infrastructure setup, (2) UI components + design, and (3) SEO layer + Vercel subdomain noindex. Plans 1 and 3 have hard dependencies; plan 2 can overlap with plan 3. The critical path is: scaffold first, then SEO layer (the entire stated business purpose), then design polish.

Two items require human confirmation before the SEO plan can be completed: Joe's LinkedIn profile slug (exact URL) and Twitter/X handle. These must be in the Person schema sameAs array. The GSC verification token also needs to be retrieved from Google Search Console before SEO-10 can be implemented.

**Primary recommendation:** Build in three plans — Scaffold, UI/Design, SEO Layer. Parallelize UI and SEO where possible. Treat Rich Results Test validation and Lighthouse audit as hard pre-close gates.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 16.1.6 | React framework, static export, routing | Locked by user. App Router generates fully static HTML; built-in Metadata API handles all SEO without third-party packages. |
| React | 19.x | UI library | Required peer dep of Next.js 16. No choice. |
| Tailwind CSS | 4.2.1 | Utility-first styling | Locked by user. CSS-first config (`@import "tailwindcss"`), no config file, auto-scan. |
| TypeScript | 5.x | Type safety | Included by `create-next-app --typescript`. Type-safe JSON-LD via schema-dts. |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| schema-dts | 1.1.2 | TypeScript types for Schema.org JSON-LD | When authoring the Person structured data object; catches misspelled property names at compile time. |
| next/font | built-in | Font loading with zero layout shift | Always use instead of external CSS `@import` for fonts; eliminates CLS. |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Static `metadata` export | `generateMetadata()` function | `generateMetadata` runs per-request; `metadata` is compiled at build time with zero runtime overhead. Use static export — no dynamic data here. |
| `opengraph-image.png` (static file) | `opengraph-image.tsx` (ImageResponse) | Static PNG is simpler for a site where the OG image never changes. ImageResponse only needed for dynamic OG generation. |
| `next/font` | Google Fonts CSS `@import` | `next/font` self-hosts the font, eliminates third-party DNS lookup, zero CLS. `@import` adds a render-blocking request. |
| `app/sitemap.ts` | `public/sitemap.xml` (static file) | `sitemap.ts` is the Next.js 16 convention; handles environment-aware base URL automatically. |

**Installation:**

```bash
# Bootstrap (Tailwind + TypeScript + App Router all included)
npx create-next-app@16.1.6 . --typescript --eslint --app --tailwind

# schema-dts for typed JSON-LD (type-only package, zero runtime cost)
npm install schema-dts
```

Note: No additional packages needed. `next/font`, `next/image`, the Metadata API, `sitemap.ts`, and `robots.ts` are all built into Next.js 16 App Router.

---

## Architecture Patterns

### Recommended Project Structure

```
app/
├── layout.tsx              # Root HTML, metadata export, JSON-LD <script> tag
├── page.tsx                # Composes Avatar + NameCard + LinkList
├── sitemap.ts              # Generates /sitemap.xml at build time
├── robots.ts               # Generates /robots.txt at build time
├── opengraph-image.png     # Static 1200x630 OG image (simpler than ImageResponse)
├── favicon.ico             # Browser tab icon (Next.js file convention)
├── apple-icon.png          # Apple touch icon (Next.js file convention)
└── globals.css             # @import "tailwindcss"; font declarations

components/
├── Avatar.tsx              # Headshot with next/image, priority prop
├── NameCard.tsx            # <h1> name + tagline subheading
└── LinkList.tsx            # Equal-prominence external links

public/
└── headshot.jpg            # Headshot (placeholder initially)

next.config.ts              # output: 'export', image unoptimized: true for static export
vercel.json                 # X-Robots-Tag: noindex header for .vercel.app subdomain
```

### Pattern 1: Static Metadata Object in layout.tsx

**What:** Export a typed `Metadata` constant (not a function) from `app/layout.tsx`. All SEO tags compile at build time.

**When to use:** Any site where metadata is fixed. This site always qualifies.

```typescript
// Source: https://nextjs.org/docs/app/api-reference/functions/generate-metadata
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Joe Scannell — Founder, Layer One Group',
  description: 'Joe Scannell (Joseph Scannell) is the Founder of Layer One Group, a PR, digital strategy, and AI advisory firm.',
  openGraph: {
    title: 'Joe Scannell',
    description: 'Founder of Layer One Group.',
    url: 'https://joescannell.com',
    siteName: 'Joe Scannell',
    images: [{ url: '/opengraph-image.png', width: 1200, height: 630 }],
    type: 'profile',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Joe Scannell',
  },
  alternates: {
    canonical: 'https://joescannell.com',
  },
  verification: {
    google: 'TOKEN_FROM_GSC',
  },
  robots: {
    index: true,
    follow: true,
  },
}
```

### Pattern 2: Person JSON-LD in layout.tsx (Server Component)

**What:** Inline `<script type="application/ld+json">` in the root layout. Server Component only — never in a `'use client'` component or Googlebot will not see it.

**When to use:** Always for a personal site. Person schema is the primary entity disambiguation signal.

```typescript
// Source: https://nextjs.org/docs/app/guides/json-ld
// XSS-safe: replace '<' with '\u003c' to prevent script injection via JSON strings
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Joe Scannell',
  alternateName: 'Joseph Scannell',
  url: 'https://joescannell.com',
  image: 'https://joescannell.com/headshot.jpg',
  jobTitle: 'Founder',
  worksFor: {
    '@type': 'Organization',
    name: 'Layer One Group',
    url: 'https://layeronegroup.com',
  },
  sameAs: [
    'https://linkedin.com/in/[SLUG]',       // confirm before authoring
    'https://twitter.com/[HANDLE]',          // confirm before authoring
    'https://layeronegroup.com',
  ],
}

// In JSX:
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
  }}
/>
```

### Pattern 3: Headshot Image with LCP Priority

**What:** Always set `priority` on the headshot `<Image>`. Default is lazy load, which tanks LCP.

**When to use:** Any above-the-fold image. The headshot is the only image on this page and IS the LCP element.

```typescript
// Source: https://nextjs.org/docs/app/api-reference/components/image
import Image from 'next/image'

<Image
  src="/headshot.jpg"
  alt="Joe Scannell"
  width={120}
  height={120}
  priority   // required — disables lazy load; tells browser to preload
  className="rounded-full"
/>
```

Note: For `output: 'export'` (static export), add `unoptimized: true` to `next.config.ts` image config OR use a local static import. Vercel's image optimization does not run on static export deploys without the Vercel adapter.

### Pattern 4: File-Based Sitemap and Robots

**What:** `app/sitemap.ts` and `app/robots.ts` generate files at build time. Next.js handles the routes.

```typescript
// Source: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
// app/sitemap.ts
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://joescannell.com',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ]
}

// app/robots.ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://joescannell.com/sitemap.xml',
  }
}
```

### Pattern 5: Vercel Subdomain noindex Header

**What:** `vercel.json` rules send `X-Robots-Tag: noindex` only when the request comes from the `.vercel.app` subdomain. The custom domain is unaffected.

**When to use:** Every Next.js project deployed on Vercel with a custom domain. Required for INF-03.

```json
// vercel.json
{
  "headers": [
    {
      "source": "/(.*)",
      "has": [
        {
          "type": "host",
          "value": "(?!joescannell\\.com).*\\.vercel\\.app"
        }
      ],
      "headers": [
        {
          "key": "X-Robots-Tag",
          "value": "noindex"
        }
      ]
    }
  ]
}
```

Verification: `curl -I https://[project-name].vercel.app | grep -i x-robots` should return `x-robots-tag: noindex`.

### Pattern 6: Static Export Configuration

**What:** `next.config.ts` with `output: 'export'` generates static HTML in `out/`. Vercel handles this transparently.

```typescript
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,  // required for static export (no server to run image optimization)
  },
}

export default nextConfig
```

Important: `images.unoptimized: true` is required when using `output: 'export'`. Without it, `next build` throws an error because there is no server to handle on-the-fly image optimization.

### Anti-Patterns to Avoid

- **Using `generateMetadata` function:** Adds per-request semantics when metadata is static. Use `const metadata: Metadata = { ... }` export.
- **JSON-LD in a Client Component:** Any `'use client'` boundary means the `<script>` tag renders client-side only — Googlebot does not execute JS reliably. Always in Server Component.
- **Plain `<img>` tag for headshot:** Loses WebP/AVIF, responsive sizing, CLS prevention. Use `next/image` always.
- **`output: 'export'` without `images.unoptimized: true`:** Build fails. Static export has no image optimization server.
- **Linking to Vercel preview URL instead of layeronegroup.com:** Always use `https://layeronegroup.com` for the Layer One Group link.
- **Over-organizing:** No need for `lib/`, `hooks/`, `utils/` directories. This is four components. Start flat.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| HTML `<head>` meta tags | Manual `<head>` tag assembly | Next.js `metadata` export | Handles title, OG, Twitter, canonical, verification automatically; type-safe |
| Sitemap XML generation | Write `sitemap.xml` manually | `app/sitemap.ts` | Next.js generates it at build; handles environment-aware base URLs |
| robots.txt | Write robots.txt manually | `app/robots.ts` | Same — 5 lines, built-in convention |
| Font loading | CSS `@import` from Google Fonts | `next/font` | Self-hosted, zero CLS, no third-party DNS lookup, no render-blocking request |
| Image optimization | `<img>` with manual srcset | `next/image` | Automatic WebP/AVIF, lazy/priority loading, CLS prevention via reserved space |
| JSON-LD XSS safety | Custom sanitizer | `.replace(/</g, '\\u003c')` | One-liner from official Next.js docs; catches the `</script>` injection vector |

**Key insight:** Every hand-rolled solution for this stack is worse than the built-in. Next.js 16 App Router was specifically designed so that all the SEO concerns (head, OG, canonical, sitemap, robots) require zero third-party packages.

---

## Common Pitfalls

### Pitfall 1: Headshot Lazy-Loads as LCP — Core Web Vitals Failure

**What goes wrong:** Next.js `<Image>` defaults to lazy load. Headshot is the LCP element on this page. Without `priority`, LCP exceeds 2.5s and Google marks the page as failing Core Web Vitals.

**Why it happens:** `priority` prop is easy to forget; it's not in the most basic examples.

**How to avoid:** Add `priority` to every above-the-fold `<Image>`. Verify with Lighthouse Mobile before close.

**Warning signs:** Lighthouse reports "Image was detected as LCP but was lazily loaded." LCP score >2.5s.

### Pitfall 2: `output: 'export'` + `next/image` Without `unoptimized: true`

**What goes wrong:** `next build` throws an error: "Image Optimization using the default loader is not compatible with `{ output: 'export' }`."

**Why it happens:** Static export has no server to handle image optimization at request time.

**How to avoid:** Set `images: { unoptimized: true }` in `next.config.ts` when using `output: 'export'`.

**Warning signs:** Build error on `next build`.

### Pitfall 3: Person Schema Rendered in Client Component — Googlebot Doesn't See It

**What goes wrong:** JSON-LD is placed in a component with `'use client'`. The schema does not appear in the initial HTML response. Googlebot does not reliably execute JavaScript, so the structured data is effectively invisible. Rich Results Test returns no results.

**Why it happens:** Developers put the script tag in a component that happens to have client-side interactivity, or move it there during refactoring.

**How to avoid:** JSON-LD must be in `layout.tsx` or `page.tsx` — both are Server Components by default. Never add `'use client'` to these files.

**Warning signs:** Rich Results Test shows "Detected items: 0" despite schema being present in source code.

### Pitfall 4: Vercel Subdomain Indexed Alongside Custom Domain

**What goes wrong:** `[project].vercel.app` is publicly accessible and identical to `joescannell.com`. Google indexes both, splitting authority. For a site whose entire purpose is to rank for a name, this is especially harmful.

**Why it happens:** `vercel.json` noindex header is never added; canonical tag alone is insufficient — it's advisory, not directive.

**How to avoid:** Add the `X-Robots-Tag: noindex` header in `vercel.json` scoped to the `.vercel.app` hostname (see Pattern 5 above). Canonical tag in addition, not instead.

**Warning signs:** `site:project-name.vercel.app` in Google returns the page.

### Pitfall 5: LinkedIn/Twitter URLs Wrong or Guessed

**What goes wrong:** Person schema `sameAs` array contains malformed or incorrect profile URLs. Google's entity graph gets a bad signal; the Knowledge Panel (if one appears) may show wrong links.

**Why it happens:** LinkedIn slug is guessed from the name ("joescannell") when the actual slug may differ. Twitter/X handle may not be @joescannell.

**How to avoid:** Confirm both URLs before authoring the schema. This is flagged as a blocker in STATE.md. The planner should include a task step: "Confirm LinkedIn slug at linkedin.com/in/[slug] and Twitter handle — paste confirmed URLs before continuing."

**Warning signs:** LinkedIn profile URL returns 404. Schema validator accepts the URL format but the profile doesn't exist.

### Pitfall 6: Canonical Tag on Custom Domain Only

**What goes wrong:** Developer sets canonical to `https://joescannell.com` in code, but the Vercel subdomain URL (`[project].vercel.app`) also has a canonical pointing to `joescannell.com`. This is advisory, not directive — Googlebot may still index the `.vercel.app` URL. The noindex header is the enforced signal.

**How to avoid:** Both canonical AND `X-Robots-Tag: noindex` on the `.vercel.app` subdomain. Defense in depth.

### Pitfall 7: GSC Verification Token Not Available Before Deploying

**What goes wrong:** SEO-10 requires the GSC verification meta tag. If the GSC property is not set up first, the token isn't known when the SEO layer is being authored.

**How to avoid:** Set up the GSC property (Domain property or URL prefix) before the SEO plan executes. Get the verification token and have it ready as an input to the plan. The planner should flag this as a human prerequisite step.

---

## Code Examples

Verified patterns from official sources:

### next.config.ts for Static Export

```typescript
// Source: https://nextjs.org/docs/app/api-reference/config/next-config-js/output
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
}

export default nextConfig
```

### Font Loading with next/font

```typescript
// Source: https://nextjs.org/docs/app/api-reference/components/font
// app/layout.tsx
import { Geist } from 'next/font/google'

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.variable}>
      <body>{children}</body>
    </html>
  )
}
```

Alternative warm sans-serif options within next/font: `Inter`, `Nunito`, `DM Sans`. All are available as Google Fonts via `next/font/google`.

### Avatar Component (Headshot)

```typescript
// components/Avatar.tsx
import Image from 'next/image'

export function Avatar() {
  return (
    <Image
      src="/headshot.jpg"
      alt="Joe Scannell"
      width={120}
      height={120}
      priority
      className="rounded-full object-cover shadow-sm"
    />
  )
}
```

### External Link with Proper Rel Attributes

```typescript
// All outbound links: target="_blank" + rel="noopener noreferrer"
<a
  href="https://layeronegroup.com"
  target="_blank"
  rel="noopener noreferrer"
>
  Layer One Group
</a>
```

### GSC Verification in metadata

```typescript
// Source: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#verification
export const metadata: Metadata = {
  verification: {
    google: 'paste-token-from-gsc-here',
  },
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `next-seo` library for OG/meta | Next.js built-in `metadata` export | Next.js 13 App Router (2022) | Zero config, type-safe, no third-party package needed |
| Pages Router (`getStaticProps`) | App Router (Server Components) | Next.js 13 (2022), stable 2023 | Pages Router is maintenance mode only |
| `tailwind.config.ts` | CSS-first config (`@import "tailwindcss"`) | Tailwind CSS v4 (2025) | No config file; auto-scan by default |
| `react-helmet` | `metadata` export / `<head>` convention | App Router launch | `react-helmet` conflicts with streaming; do not use |

**Deprecated/outdated:**
- `next-seo`: Third-party head management library. Replaced by native Metadata API. Do not install.
- `getStaticProps` / `getServerSideProps`: Pages Router data fetching. Irrelevant in App Router.
- `ProfilePage` schema type: Google explicitly says this is for forum/community profiles, not personal homepages. Use `Person` type.
- `serialize-javascript` package: Earlier research recommended this for XSS-safe JSON-LD. The official Next.js docs use `.replace(/</g, '\\u003c')` inline instead — simpler, zero dependency.

---

## Open Questions

1. **LinkedIn profile slug (exact URL)**
   - What we know: The sameAs array needs `linkedin.com/in/[slug]`
   - What's unclear: Slug may not be "joescannell" — must confirm at linkedin.com
   - Recommendation: Make confirming the LinkedIn URL a required step in the SEO plan task before authoring the schema. Cannot be guessed.

2. **Twitter/X handle**
   - What we know: User wants a Twitter/X link (PAGE-06) and sameAs entry (SEO-06)
   - What's unclear: Exact handle is not documented anywhere in project files
   - Recommendation: Same as LinkedIn — confirm before authoring. Planner should include this as a human-input prerequisite.

3. **GSC verification token**
   - What we know: SEO-10 requires a GSC verification meta tag; token comes from GSC property setup
   - What's unclear: Whether a GSC property for joescannell.com already exists, and whether it's a Domain property or URL prefix property
   - Recommendation: Check GSC before starting the SEO plan. Use Domain property (DNS TXT record) for broadest coverage. Token needed as input before running SEO plan.

4. **Headshot image source**
   - What we know: Placeholder acceptable at launch (per REQUIREMENTS.md); STATE.md notes real headshot availability is uncertain
   - What's unclear: Will a real headshot be provided, and in what format/resolution?
   - Recommendation: Use a warm-toned solid color placeholder (`#E8E0D8` or similar) as a circular div initially. OG image can be text-only or use the placeholder. Real headshot swap is a 2-minute task later.

5. **Vercel project name (subdomain)**
   - What we know: The project will be deployed on Vercel; the subdomain will be `[project-name].vercel.app`
   - What's unclear: Project name will be determined when the GitHub repo is pushed and Vercel project is created; needed for the noindex header verification command
   - Recommendation: Note the subdomain URL after first deploy; run `curl -I https://[name].vercel.app` to verify the noindex header is active.

---

## Sources

### Primary (HIGH confidence)
- [Next.js 16.x official docs (lastUpdated 2026-02-27)](https://nextjs.org/docs/app) — Metadata API, JSON-LD guide, sitemap.ts, robots.ts, Image component, output: 'export'
- [Next.js JSON-LD Guide](https://nextjs.org/docs/app/guides/json-ld) — XSS-safe pattern, schema-dts recommendation, Server Component placement requirement
- [Next.js generateMetadata API reference](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) — metadata fields, verification, alternates.canonical
- [Next.js Image component](https://nextjs.org/docs/app/api-reference/components/image) — priority prop, unoptimized flag, static export behavior
- [Tailwind CSS Next.js guide](https://tailwindcss.com/docs/guides/nextjs) — v4 CSS-first config, @import pattern
- [Vercel: Avoiding duplicate content with .vercel.app](https://vercel.com/kb/guide/avoiding-duplicate-content-with-vercel-app-urls) — X-Robots-Tag noindex pattern
- Prior project research: STACK.md, FEATURES.md, ARCHITECTURE.md, PITFALLS.md (researched 2026-03-03, HIGH confidence)

### Secondary (MEDIUM confidence)
- [Google Search Central: ProfilePage schema](https://developers.google.com/search/docs/appearance/structured-data/profile-page) — confirms `Person` (not `ProfilePage`) for personal homepages
- [Vercel: Zero-downtime migration](https://vercel.com/kb/guide/zero-downtime-migration) — SSL provisioning sequence; relevant for Phase 2 planning

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all verified against official Next.js 16.x docs
- Architecture patterns: HIGH — all code examples from official docs; verified 2026-02-27
- Pitfalls: HIGH — verified against Vercel docs, Google Search Central, and Next.js docs
- Open questions: these are data/asset gaps, not research gaps — confident in what needs to be confirmed

**Research date:** 2026-03-03
**Valid until:** 2026-04-03 (stable tech; Tailwind v4 and Next.js 16 are not in rapid flux)

---

## Plan Scaffold Recommendation

For the planner: this phase naturally breaks into three plans.

**Plan 01-01: Project Scaffold + Vercel Setup**
Scope: `create-next-app`, repo, Vercel project creation, first deploy to Vercel subdomain, `next.config.ts` with static export, `vercel.json` noindex header, font setup, `globals.css`.
Gate: Site deploys at `[project].vercel.app`; noindex header verified with `curl`.

**Plan 01-02: UI Design + Components**
Scope: Design tokens in CSS (off-white bg, charcoal text, warm accent), `Avatar.tsx`, `NameCard.tsx`, `LinkList.tsx` with all four links, responsive layout, favicon + apple-icon.
Gate: Mobile-responsive, visually distinct from L1G brand, Lighthouse mobile performance >90.

**Plan 01-03: SEO Layer**
Prerequisites (human input): LinkedIn slug confirmed, Twitter handle confirmed, GSC verification token obtained.
Scope: Full `metadata` export (title, description, OG, canonical, GSC verification), Person JSON-LD with confirmed sameAs URLs, `sitemap.ts`, `robots.ts`, `opengraph-image.png` (1200x630 static).
Gate: Rich Results Test shows valid Person entity, `curl` confirms canonical tag in HTML, both `sitemap.xml` and `robots.txt` return 200, Lighthouse Core Web Vitals green.
