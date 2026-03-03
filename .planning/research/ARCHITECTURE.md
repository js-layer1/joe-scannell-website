# Architecture Research

**Domain:** Personal SEO link-hub website (Next.js, Vercel)
**Researched:** 2026-03-03
**Confidence:** HIGH — all patterns verified against official Next.js 16.x docs (lastUpdated 2026-02-27)

## Standard Architecture

This is a statically rendered single-page app. There is no backend, no database, no state management, and no API routes. The architecture is as flat as possible by design.

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Build Layer (Next.js)                    │
│  - Static export at build time (no SSR needed)               │
│  - Metadata object compiled into <head>                      │
│  - JSON-LD compiled into <script> tag                        │
│  - OG image generated via ImageResponse or static .png       │
│  - sitemap.ts compiled to /sitemap.xml                       │
│  - robots.ts compiled to /robots.txt                         │
├─────────────────────────────────────────────────────────────┤
│                   app/ (App Router)                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  layout.tsx  │  │   page.tsx   │  │ SEO files    │       │
│  │  (metadata,  │  │  (UI only,   │  │ (sitemap.ts, │       │
│  │   JSON-LD)   │  │   no state)  │  │  robots.ts,  │       │
│  └──────────────┘  └──────────────┘  │  og-image)   │       │
│                                      └──────────────┘       │
├─────────────────────────────────────────────────────────────┤
│                  components/ (UI pieces)                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │  Avatar  │  │ NameCard │  │ LinkList │  │  Footer  │    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
├─────────────────────────────────────────────────────────────┤
│                  public/ (static assets)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ headshot.jpg │  │  favicon.ico │  │  apple-icon  │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘

                         ↓ Vercel Deploy
             Static HTML/CSS/JS served from CDN edge
             Zero server-side work after build
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| `app/layout.tsx` | Root HTML shell, metadata export, JSON-LD script tag | Server Component, exports `metadata` object |
| `app/page.tsx` | Renders the single page, composes UI components | Server Component, assembles Avatar + NameCard + LinkList |
| `app/sitemap.ts` | Generates `/sitemap.xml` at build time | Exports default function returning URL array |
| `app/robots.ts` | Generates `/robots.txt` at build time | Exports default function returning rules object |
| `app/opengraph-image.tsx` | Generates OG image at build time via ImageResponse | OR: just drop `opengraph-image.png` in `app/` as static file |
| `components/Avatar` | Headshot image with appropriate alt text | `<Image>` from `next/image`, optimized |
| `components/NameCard` | Name, title/tagline display | Semantic `<h1>` for name (one per page, SEO) |
| `components/LinkList` | Ordered list of venture links | `<nav>` with `<a>` tags, `rel` attributes where appropriate |
| `public/` | Headshot, favicon, apple-icon | Static files served directly |

## Recommended Project Structure

```
app/
├── layout.tsx              # Root layout: metadata export, JSON-LD script
├── page.tsx                # Single page: Avatar + NameCard + LinkList
├── sitemap.ts              # Generates /sitemap.xml
├── robots.ts               # Generates /robots.txt
├── opengraph-image.tsx     # OR opengraph-image.png (static is simpler here)
├── favicon.ico             # Favicon (or in public/)
└── globals.css             # Global styles

components/
├── Avatar.tsx              # Headshot image component
├── NameCard.tsx            # Name + title display
└── LinkList.tsx            # Venture links

public/
├── headshot.jpg            # Headshot photo
└── apple-icon.png          # Apple touch icon

next.config.ts              # Minimal config
tailwind.config.ts          # If using Tailwind (likely yes for consistency)
tsconfig.json
```

### Structure Rationale

- **app/layout.tsx for metadata:** Next.js App Router requires metadata export from layout or page — layout is preferred so it applies globally without repetition.
- **JSON-LD in layout.tsx:** For a single-page site, putting Person schema in the root layout means it's always present without conditional logic.
- **Flat components/:** With four or fewer UI components, no subdirectories needed. No `ui/` or `sections/` nesting — that would be premature organization for this scope.
- **No lib/ or hooks/:** There is no shared logic, no data fetching, no utilities. Adding these directories would be scaffolding theater.
- **Static OG image preferred:** A static `opengraph-image.png` dropped in `app/` is simpler than `ImageResponse` for a site where the OG image never changes dynamically. Use `opengraph-image.tsx` only if you want to generate it programmatically from the headshot.

## Architectural Patterns

### Pattern 1: Static Metadata Object

**What:** Export a typed `Metadata` object from `app/layout.tsx` directly. No `generateMetadata` function needed since no dynamic data.
**When to use:** Any site where metadata is fixed at build time. Personal sites always qualify.
**Trade-offs:** Zero runtime overhead. Cannot vary per route, but this site has one route.

```typescript
// app/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Joe Scannell',
  description: 'Joe Scannell — Founder of Layer One Group. PR, digital strategy, and AI advisory.',
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
}
```

### Pattern 2: JSON-LD Person Schema in Layout

**What:** Inline a `<script type="application/ld+json">` tag in the root layout with Schema.org Person type. This tells Google, Bing, and AI crawlers who this page is about.
**When to use:** Any personal site. Person schema is the highest-value structured data for individual name SEO.
**Trade-offs:** Tiny HTML weight. Must XSS-sanitize the JSON string (replace `<` with `\u003c`). No library required.

```typescript
// app/layout.tsx — inside the returned JSX
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Joe Scannell',
  alternateName: 'Joseph Scannell',
  url: 'https://joescannell.com',
  image: 'https://joescannell.com/headshot.jpg',
  sameAs: [
    'https://linkedin.com/in/joescannell',
    'https://layeronegroup.com',
  ],
  worksFor: {
    '@type': 'Organization',
    name: 'Layer One Group',
    url: 'https://layeronegroup.com',
  },
  jobTitle: 'Founder',
}

// In JSX:
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
  }}
/>
```

### Pattern 3: File-Based Sitemap and Robots

**What:** Use `app/sitemap.ts` and `app/robots.ts` conventions instead of static files. Next.js compiles these at build time.
**When to use:** Always in Next.js App Router. Cleaner than maintaining static XML files.
**Trade-offs:** Slightly more setup than dropping a `sitemap.xml` in `public/`, but correct behavior for Vercel deployments where the base URL may vary by environment.

```typescript
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

## Data Flow

### Request Flow

For a statically generated site, "data flow" at runtime is essentially none. All meaningful work happens at build time.

```
Build time:
  next build
    ↓
  layout.tsx exports metadata → compiled into HTML <head>
  layout.tsx renders JSON-LD → compiled into <script> in HTML
  sitemap.ts runs → /sitemap.xml generated
  robots.ts runs → /robots.txt generated
  opengraph-image.tsx runs → OG image PNG generated
  page.tsx renders → static HTML generated
    ↓
  Vercel CDN receives static assets

Runtime (user visits joescannell.com):
  Browser request → Vercel CDN edge → static HTML served
  (zero server computation per request)
```

### State Management

None. This site has no interactive state. No useState, no Zustand, no Context.

If an interactive element is added later (e.g., a copy-email button), it would be a minimal Client Component (`'use client'`) isolated to that one component. The rest of the site remains Server Components.

### Key Data Flows

1. **SEO metadata to crawlers:** `layout.tsx` metadata object → Next.js compiles to `<head>` tags → search engines and social platforms read at crawl time.
2. **Structured data to AI/search:** JSON-LD in `<script>` tag → Google Knowledge Graph, Bing, and AI crawlers parse at index time.
3. **Headshot to browser:** `public/headshot.jpg` → `next/image` component → optimized formats (WebP/AVIF) served by Vercel's image optimization.

## Scaling Considerations

This site does not scale in the traditional sense. It serves one static page.

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 0-10k visitors/month | No changes. Static CDN handles this trivially. |
| 10k-1M visitors/month | Still no changes. Vercel CDN scales automatically. |
| Adding a blog later | Add `app/blog/` route group. Introduce `lib/posts.ts` for content fetching. This is additive and does not require rearchitecting the personal page. |
| Adding contact form | Add a single `app/api/contact/route.ts`. No other changes. |

### Scaling Priorities

1. **First bottleneck:** Image load time on slow connections. Fix: `next/image` with `priority` prop on the headshot, explicit `width`/`height` to prevent layout shift.
2. **Non-issue:** Server load, database connections, API rate limits — none of these apply to a static personal site.

## Anti-Patterns

### Anti-Pattern 1: Using `generateMetadata` Instead of Static `metadata` Export

**What people do:** Use `generateMetadata` function even when no dynamic data is needed, because they've seen it in tutorials.
**Why it's wrong:** Adds complexity for zero benefit. Static `metadata` export is compiled at build time with no runtime overhead. `generateMetadata` runs on the server per request (or at build for static routes) but signals intent of dynamism.
**Do this instead:** Export `const metadata: Metadata = { ... }` directly from `layout.tsx`. Reserve `generateMetadata` for routes with dynamic params.

### Anti-Pattern 2: Putting Headshot in `public/` Without `next/image`

**What people do:** Use a plain `<img>` tag pointing to `public/headshot.jpg`.
**Why it's wrong:** Loses automatic WebP/AVIF conversion, responsive sizing, and lazy loading. On a personal site the headshot is the only image — making it fast matters disproportionately.
**Do this instead:** Use `next/image` with `priority` prop (it's above the fold), explicit `width` and `height`, and descriptive `alt` text for accessibility and SEO.

### Anti-Pattern 3: Over-Architecturing for a Five-Component Site

**What people do:** Add `lib/`, `hooks/`, `utils/`, `context/`, `store/`, `services/` directories because that's what they've seen in larger Next.js projects.
**Why it's wrong:** Empty or near-empty directories add cognitive load without value. This is a single page with four UI components.
**Do this instead:** Start flat. `app/`, `components/`, `public/`. Add structure only when there is actual code that needs it.

### Anti-Pattern 4: Skipping Canonical URL

**What people do:** Set title and description in metadata but omit `alternates.canonical`.
**Why it's wrong:** Without a canonical URL, search engines may encounter duplicate content issues (e.g., `www.joescannell.com` vs `joescannell.com`). For a domain with established authority this is especially important.
**Do this instead:** Always set `alternates: { canonical: 'https://joescannell.com' }` in the metadata object. This collapses all URL variants into one authoritative source.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Vercel | Deploy on push to main. Zero config for Next.js. | Set `NEXT_PUBLIC_SITE_URL` env var for canonical URL construction |
| Google Search Console | Add verification meta tag or DNS TXT record | Use metadata `verification` field in Next.js: `verification: { google: 'TOKEN' }` |
| LinkedIn / Layer One Group | Standard `<a>` href links, `rel="noopener noreferrer"` for external | No SDK or embed — plain links only |
| Carrd.co (existing) | DNS cutover: point joescannell.com A record to Vercel (76.76.21.21) | Same pattern already used for Layer One Group site |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| `layout.tsx` to `page.tsx` | layout wraps page (Next.js convention) | layout owns `<html>`, `<body>`, `<head>` — page owns visible content |
| `page.tsx` to `components/` | Direct import and render | No props drilling needed — all data is static constants |
| `app/` to `public/` | URL path reference (`/headshot.jpg`) | `next/image` handles path resolution automatically |

## Build Order Implications

Dependencies between components are minimal, but there is a logical sequence:

1. **Project scaffold first** — `app/layout.tsx`, `app/page.tsx`, `next.config.ts`, `tailwind.config.ts`. Nothing else can be built without this foundation.
2. **SEO layer second** — Metadata export, JSON-LD, `sitemap.ts`, `robots.ts`, canonical URL, OG image. These are the primary value of the rebuild (SEO is the stated goal). Build before UI polish.
3. **UI components third** — `Avatar`, `NameCard`, `LinkList`. These depend on the page scaffold but are independent of each other. Can be built in any order or in parallel.
4. **Static assets last** — Real headshot swap, favicon finalization. These are content, not structure, and can be deferred.

## Sources

- [Next.js: JSON-LD Guide](https://nextjs.org/docs/app/guides/json-ld) (official, version 16.1.6, lastUpdated 2026-02-27)
- [Next.js: Metadata and OG Images](https://nextjs.org/docs/app/getting-started/metadata-and-og-images) (official, version 16.1.6, lastUpdated 2026-02-27)
- [Next.js: generateMetadata API Reference](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Next.js: Project Structure](https://nextjs.org/docs/app/getting-started/project-structure)
- [Vercel: How to generate a sitemap for Next.js](https://vercel.com/kb/guide/how-do-i-generate-a-sitemap-for-my-nextjs-app-on-vercel)

---
*Architecture research for: Personal SEO link-hub website (joescannell.com)*
*Researched: 2026-03-03*
