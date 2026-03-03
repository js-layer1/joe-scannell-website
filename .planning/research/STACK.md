# Stack Research

**Domain:** Minimal personal website / SEO link-hub
**Researched:** 2026-03-03
**Confidence:** HIGH

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Next.js | 16.1.6 | React framework, SSR, routing | Already the constraint. App Router generates fully static HTML with zero JS overhead — critical for a link-hub. Built-in Metadata API handles all SEO tags without third-party packages. Vercel-native. |
| React | 19.x | UI library | Required peer dependency of Next.js 16. No meaningful choice here. |
| Tailwind CSS | 4.2.1 | Utility-first styling | CSS-first configuration (no config file), single `@import` in globals.css, auto-scan. v4 is stable and the officially recommended path as of early 2026. Matches the Layer One Group project's Tailwind version. |
| TypeScript | 5.x | Type safety | Included by default in `create-next-app`. Type-safe JSON-LD via `schema-dts`. Prevents category of bugs with zero overhead for a project this size. |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| schema-dts | 1.1.2 | TypeScript types for Schema.org JSON-LD | Use when authoring the `Person` structured data object. Catches malformed schema at compile time, not at runtime. Recommended in official Next.js JSON-LD docs. |
| serialize-javascript | latest | XSS-safe JSON serialization | Use instead of `JSON.stringify` when rendering JSON-LD in `<script>` tags. Official Next.js docs flag the XSS risk of raw `JSON.stringify`; this library escapes dangerous characters. |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| Turbopack (built-in) | Dev server bundler | Default in Next.js 16. File system caching now stable — restart is near-instant on this tiny project. No configuration needed. |
| ESLint (built-in) | Linting | Included by `create-next-app`. Accept defaults. |
| `next upgrade` CLI | Version upgrades | New in 16.1. Use `npx next upgrade latest` rather than manually bumping package.json. |

## Installation

```bash
# Bootstrap
npx create-next-app@latest joe-scannell-website --typescript --eslint --app --tailwind

# schema-dts for typed JSON-LD (dev-only type package, zero runtime cost)
npm install schema-dts

# XSS-safe JSON serialization for JSON-LD script tag
npm install serialize-javascript
npm install -D @types/serialize-javascript
```

Note: Tailwind CSS 4 is installed automatically by `create-next-app` when `--tailwind` is passed. It uses the new PostCSS plugin (`@tailwindcss/postcss`) and CSS-first config — no `tailwind.config.ts` file is generated.

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Next.js App Router (static export) | Plain HTML + CSS | Only if you are categorically opposed to a build step and need sub-5-minute deployment. For this project, the consistency with the Layer One Group stack and Vercel-native behavior make Next.js the right call regardless. |
| Next.js App Router | Next.js Pages Router | Never start new projects on Pages Router. App Router is the present and future. Pages Router is in maintenance mode. |
| Tailwind CSS v4 | Tailwind CSS v3 | v3 only if you need IE11 or very old browser support (below ~3 years old). For a professional personal site in 2026, v4 is correct. |
| schema-dts | Hand-authored JSON-LD object | Acceptable for a simple Person schema if you want zero dependencies. The risk is silently invalid schema if a field name is misspelled. For a single object, either approach works; `schema-dts` is the safer default. |
| Vercel | Netlify, Cloudflare Pages | Vercel is the native platform for Next.js. Consistent with Layer One Group. Use alternatives only if billing or organizational constraints require it. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| `next-seo` (third-party library) | Unnecessary in 2026. Next.js App Router has a built-in type-safe Metadata API that handles title, description, Open Graph, Twitter cards, and canonical URLs. `next-seo` was a Pages Router workaround. Adding it is dead weight. | Next.js `generateMetadata()` / `metadata` export |
| `react-helmet` / `react-helmet-async` | Same reason as `next-seo`. Legacy pattern from before framework-level head management existed. Conflicts with App Router's streaming architecture. | Next.js `metadata` export in `layout.tsx` |
| `@vercel/analytics` or `@vercel/speed-insights` | Not needed for a link-hub with no user interactions to measure. Adds JS weight and a third-party request. | Nothing — or add GA4 only if you genuinely want search traffic data. |
| Pages Router (`pages/` directory) | Maintenance mode. Server Components, streaming, and built-in metadata all require App Router. | App Router (`app/` directory) |
| `getStaticProps` / `getServerSideProps` | Pages Router APIs. Irrelevant in App Router. | Server Components (default in App Router) |
| CSS Modules or styled-components | More complexity than needed. Tailwind covers all styling needs for a single-page site with no shared component library. | Tailwind CSS |

## Stack Patterns by Variant

**If you want zero JavaScript in the browser (pure static HTML):**
- Add `export const dynamic = 'force-static'` to `app/page.tsx`
- Add `output: 'export'` to `next.config.ts`
- This generates a static HTML/CSS site with no Next.js runtime JS
- Deploy the `out/` directory to any static host, or keep Vercel (it handles this transparently)
- Recommended for this project — a link-hub has zero interactivity requirements

**If you add a headshot image from local file (recommended approach):**
- Import the image statically: `import headshot from './headshot.jpg'`
- Pass to `<Image src={headshot} placeholder="blur" />`
- Next.js auto-generates `blurDataURL` and width/height from the static import
- No configuration needed

**If the headshot comes from a remote URL:**
- Must add the domain to `images.remotePatterns` in `next.config.ts`
- Must provide explicit `width` and `height` props
- Must generate `blurDataURL` manually (or skip the blur placeholder)
- Recommendation: store the headshot as a local file to avoid this complexity

## Version Compatibility

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| next@16.1.6 | react@19.x, react-dom@19.x | Required peer deps. Install together: `npm install next@latest react@latest react-dom@latest` |
| tailwindcss@4.2.1 | @tailwindcss/postcss@4.x | The PostCSS plugin ships as a separate package in v4. Must be installed alongside tailwindcss. `create-next-app --tailwind` handles this. |
| schema-dts@1.1.2 | TypeScript 5.x | Pure type package, zero runtime. No compatibility concerns. |
| serialize-javascript | Node.js 18+ | No known conflicts. Minimal package. |

## SEO Implementation Notes

Next.js App Router handles SEO through two mechanisms. Both are needed for this project:

**1. Metadata API** (in `app/layout.tsx` or `app/page.tsx`)

Handles: `<title>`, `<meta name="description">`, Open Graph tags, Twitter cards, canonical URL, robots directives.

```tsx
// app/page.tsx
export const metadata: Metadata = {
  title: 'Joe Scannell',
  description: 'Joe Scannell — Founder of Layer One Group.',
  openGraph: {
    title: 'Joe Scannell',
    description: 'Joe Scannell — Founder of Layer One Group.',
    url: 'https://joescannell.com',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  alternates: {
    canonical: 'https://joescannell.com',
  },
}
```

**2. JSON-LD Structured Data** (inline `<script>` in the page component)

Handles: Google rich results, AI answer engine understanding, entity disambiguation for "Joe Scannell" / "Joseph Scannell".

```tsx
// app/page.tsx
import type { WithContext, Person } from 'schema-dts'
import serialize from 'serialize-javascript'

const jsonLd: WithContext<Person> = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Joe Scannell',
  alternateName: 'Joseph Scannell',
  url: 'https://joescannell.com',
  sameAs: [
    'https://www.linkedin.com/in/joescannell',
    'https://layeronegroup.com',
  ],
  jobTitle: 'Founder',
  worksFor: {
    '@type': 'Organization',
    name: 'Layer One Group',
    url: 'https://layeronegroup.com',
  },
}

// In JSX:
// <script
//   type="application/ld+json"
//   dangerouslySetInnerHTML={{ __html: serialize(jsonLd) }}
// />
```

## Sources

- [Next.js 16.1 Release Notes](https://nextjs.org/blog/next-16-1) — confirmed stable version, Turbopack caching details (HIGH confidence)
- [Next.js JSON-LD Guide](https://nextjs.org/docs/app/guides/json-ld) — official implementation pattern, XSS warning, schema-dts recommendation (HIGH confidence)
- [Next.js generateMetadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) — Metadata API fields, Open Graph support (HIGH confidence)
- [Tailwind CSS Next.js Installation Guide](https://tailwindcss.com/docs/guides/nextjs) — confirmed v4.2, PostCSS plugin setup, `@import "tailwindcss"` pattern (HIGH confidence)
- [schema-dts on npm](https://www.npmjs.com/package/schema-dts) — v1.1.2 latest, Google-maintained (MEDIUM confidence — npm page 403'd, confirmed via search results)
- [tailwindcss on npm](https://www.npmjs.com/package/tailwindcss) — v4.2.1 latest as of early March 2026 (HIGH confidence)

---
*Stack research for: JoeScannell.com — minimal personal website / SEO link-hub*
*Researched: 2026-03-03*
