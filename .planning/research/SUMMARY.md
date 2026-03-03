# Project Research Summary

**Project:** JoeScannell.com — Personal Website / SEO Link-Hub
**Domain:** Minimal personal website, Carrd-to-Next.js platform migration
**Researched:** 2026-03-03
**Confidence:** HIGH

## Executive Summary

JoeScannell.com is a minimal personal SEO link-hub: one page, one purpose, one goal — own the "Joe Scannell" SERP. The move off Carrd is not primarily about design or functionality; it is about gaining structured data control. Carrd and Linktree provide zero ability to emit Person schema, sameAs entity signals, or canonical URL declarations. Those capabilities are the core of why this project exists, and they require an owned, custom-coded page. The recommended approach is a statically exported Next.js 16.1.6 app — the same stack already running on Vercel for Layer One Group — with Tailwind CSS 4 for styling. The build generates pure HTML/CSS with no client-side JS bundle, which is optimal for a page where the only performance metric that matters is LCP on the headshot.

The entire feature surface is small and well-understood. Every table-stakes feature (headshot, name H1, professional title, links, Open Graph, favicon, mobile layout) is LOW complexity. Every SEO differentiator (Person schema, sameAs social graph, canonical URL, GSC verification, sitemap, robots.txt) is also LOW complexity. Nothing in this project requires novel engineering decisions; it requires discipline about not over-building. The strongest anti-features are a blog, contact form, dark mode, analytics beyond GSC, and multi-page navigation. Every one of these adds complexity without contributing to the stated goal of ranked name-branded search.

The primary risks are operational, not technical. Carrd-to-Vercel migration has two credible failure modes: an SSL provisioning gap during DNS cutover that causes downtime, and the Vercel subdomain being indexed by Google alongside the custom domain, splitting ranking authority. Both are avoidable with a correct pre-flight sequence. A secondary risk is Person schema malformation: the JSON-LD must be in a Server Component, use exact Schema.org property names, and be validated with Google's Rich Results Test before launch. These are well-documented patterns — the risk comes from skipping validation, not from technical complexity.

## Key Findings

### Recommended Stack

The stack is constrained and straightforward. Next.js 16.1.6 with App Router, statically exported (`output: 'export'`), deployed to Vercel — this is the correct choice because it matches the existing Layer One Group infrastructure, is Vercel-native, and the App Router's built-in Metadata API eliminates the need for third-party SEO packages (`next-seo`, `react-helmet`). Tailwind CSS 4.2.1 is used CSS-first with no config file. TypeScript 5.x is included by default.

Two supporting libraries are recommended: `schema-dts` (Google-maintained type package for Schema.org JSON-LD, zero runtime cost) and `serialize-javascript` (XSS-safe JSON serialization for the `<script>` tag). No other dependencies are needed. Notably, `@vercel/analytics`, `next-seo`, and any motion library should be excluded — they add JS weight without contributing to the goal.

**Core technologies:**
- Next.js 16.1.6 (App Router, static export): Framework — generates fully static HTML with zero JS overhead, built-in Metadata API for all SEO tags, Vercel-native
- React 19.x: Required peer dependency of Next.js 16, no meaningful choice
- Tailwind CSS 4.2.1: Styling — CSS-first config, single `@import`, consistent with Layer One Group project
- TypeScript 5.x: Type safety — included by default, enables typed JSON-LD via `schema-dts`
- schema-dts 1.1.2: Dev-only type package for Schema.org objects, catches schema errors at compile time
- serialize-javascript: XSS-safe JSON serialization for JSON-LD `<script>` tags

### Expected Features

All P1 features are LOW complexity. The project has zero P2/P3 features required at launch. The MVP is well-defined and complete in one phase.

**Must have (table stakes):**
- Headshot / photo — establishes visual identity; is also the LCP element (drives Core Web Vitals)
- Full name as H1 ("Joe Scannell") — primary entity signal for Google; must match schema `name` exactly
- Professional title / tagline — context for SERP snippet and search intent
- Links to Layer One Group, LinkedIn, email — core link-hub function
- Mobile-responsive layout — >60% of branded search clicks are mobile
- HTTPS / SSL — Vercel provides automatically
- Favicon + apple-touch-icon — browser and home screen identity
- Page title tag + meta description — SERP control; description should include both "Joe Scannell" and "Joseph Scannell"
- Canonical URL — prevents duplicate content penalties across URL variants and Vercel subdomain

**Should have (differentiators from Carrd/Linktree):**
- Person schema (JSON-LD) — signals entity identity to Google; required for Knowledge Panel eligibility; use `@type: "Person"` not `ProfilePage`
- sameAs social graph — connects entity across web properties (LinkedIn, layeronegroup.com); Google uses to resolve disambiguation
- Open Graph / Twitter Card metadata — controls appearance when shared on LinkedIn, iMessage, X; og:image at 1200x630
- Google Search Console verification + sitemap submission — active signal that site owner acknowledges the migration; accelerates indexing
- robots.txt + sitemap.xml — crawl control and indexing guidance
- Distinct personal design (not L1G brand) — signals Joe the person vs. the agency; must not copy Layer One Group visual system

**Defer (v1.x, after GSC data confirms need):**
- `alternateName: "Joseph Scannell"` in schema — add if GSC shows impressions for the full legal name variant
- `<link rel="me">` reciprocal identity tags — reinforces sameAs claims; add once primary signals are established
- Real headshot swap — placeholder acceptable at launch; swap before treating the site as "production"

**Anti-features (explicitly exclude):**
- Blog, contact form, dark mode, analytics (beyond GSC), social feed embeds, multi-page navigation, animations/motion libraries, ProfilePage schema

### Architecture Approach

The architecture is as flat as possible by design. There is no backend, no database, no API routes, no state management, and no client-side data fetching. All meaningful work happens at build time. Next.js compiles metadata into `<head>`, JSON-LD into a `<script>` tag, and static pages into HTML. Vercel then serves everything from CDN edge with zero server computation per request. Adding `output: 'export'` and `dynamic = 'force-static'` eliminates the Next.js runtime JS bundle entirely.

**Major components:**
1. `app/layout.tsx` — Root HTML shell, static `metadata` export (not `generateMetadata`), JSON-LD `<script>` tag; Server Component
2. `app/page.tsx` — Single page, composes Avatar + NameCard + LinkList; Server Component, no state
3. `app/sitemap.ts` + `app/robots.ts` — File-based generation of `/sitemap.xml` and `/robots.txt` at build time
4. `app/opengraph-image.png` — Static file drop in `app/` (simpler than `ImageResponse` for a never-changing OG image)
5. `components/Avatar` — Headshot using `next/image` with `priority` prop (LCP element); explicit width/height to prevent CLS
6. `components/NameCard` — Semantic `<h1>` for name, title/tagline below
7. `components/LinkList` — `<nav>` with `<a>` tags, `rel="noopener noreferrer"` on all external links

No `lib/`, `hooks/`, `utils/`, `context/`, or `services/` directories. No subdirectories in `components/`. Flat structure only — adding organization scaffolding to a four-component site is an explicit anti-pattern.

### Critical Pitfalls

1. **Vercel subdomain duplicate content** — The `.vercel.app` subdomain is publicly crawlable by default. Without a canonical tag and `X-Robots-Tag: noindex` header on the Vercel subdomain, Google may index both `joescannell.vercel.app` and `joescannell.com`, splitting ranking authority. Prevention: canonical tag in `layout.tsx` metadata + `vercel.json` noindex header for the Vercel subdomain URL. Must be in place before DNS cutover.

2. **SSL gap during DNS cutover** — Changing DNS before Vercel provisions the SSL certificate creates a window where the site serves an SSL error to users and Googlebot. Prevention: add the domain in Vercel dashboard first, wait for "Certificate issued" status, then change DNS. Prefer A record/CNAME swap over nameserver transfer for fastest propagation.

3. **Headshot lazy-loaded as LCP element** — On a single-page personal site, the headshot is the LCP element. Next.js lazy-loads images by default. Without the `priority` prop, LCP can reach 3-5+ seconds, directly hurting search ranking. Prevention: `<Image priority>` on the headshot; verify with Lighthouse before DNS cutover (target: LCP < 2.5s).

4. **Malformed Person schema JSON-LD** — Schema.org property names are exact and case-sensitive. JSON-LD placed in a client component (`"use client"`) is invisible to Googlebot. Prevention: implement JSON-LD in `layout.tsx` (Server Component), include required fields (`@type`, `name`, `url`, `jobTitle`, `worksFor`, `sameAs`), validate with Google Rich Results Test before launch.

5. **Missing or wrong canonical URL** — Without a canonical tag, Google must choose among `http://`, `https://`, `www.`, non-www, and the Vercel subdomain variants. Prevention: always set `alternates: { canonical: 'https://joescannell.com' }` in `layout.tsx` metadata. The SALT.agency Next.js study found only 50% of sites implement this.

## Implications for Roadmap

Based on the research, this project maps cleanly to two phases. The scope is small enough that a three-phase structure would artificially fragment work that belongs together.

### Phase 1: Foundation, SEO Core, and UI Build

**Rationale:** Everything belongs in one phase because all features are LOW complexity, all dependencies are internal (no external APIs, no async data), and the only meaningful gate is "does it build correctly and pass pre-launch checks." The architecture research explicitly defines a build order: scaffold first, SEO layer second (it's the primary value), UI components third, static assets last. All of this is one cohesive unit of work.

**Delivers:** Complete site ready for DNS cutover — scaffold, all SEO metadata, Person schema, sitemap, robots.txt, OG image, all UI components (Avatar, NameCard, LinkList), favicon, apple-touch-icon, mobile-responsive layout. Vercel deploy with canonical + noindex headers on Vercel subdomain.

**Addresses:** All P1 features from FEATURES.md — every table-stakes and differentiator item. The entire MVP definition.

**Avoids:** Pitfalls 1, 3, 4, 5, 6 (canonical, LCP image priority, schema malformation, missing sitemap/robots.txt, OG metadata). Rich Results Test and Lighthouse audit are pre-launch gates within this phase.

### Phase 2: DNS Cutover and GSC Verification

**Rationale:** DNS cutover is a distinct operational step that should not be bundled with build work. It has its own pre-flight checklist (SSL certificate provisioned, canonical live, noindex header confirmed, Lighthouse passing), its own timing considerations (do it during low-traffic hours), and its own post-cutover verification steps (GSC sitemap submission, URL inspection request, Vercel subdomain noindex confirmed via curl). Making it a separate phase ensures the checklist is not skipped.

**Delivers:** Domain live on Vercel, GSC Domain property verified, sitemap submitted, homepage URL inspection requested, SSL confirmed, Vercel subdomain confirmed noindex.

**Avoids:** Pitfalls 2 (SSL gap) and 3 (GSC not set up at launch). The GSC setup must happen within 24 hours of cutover to avoid 2-4 week indexing delay.

### Phase Ordering Rationale

- Phase 2 cannot start until Phase 1 is complete and passing Lighthouse — the pre-flight checklist is a hard dependency on the build being correct.
- The SSL gap pitfall specifically requires that the domain is added to Vercel and certificate issued before DNS is touched — this is a Phase 2 gate, not a Phase 1 concern.
- Separating cutover from build prevents the common mistake of "it looks done in development, let's flip DNS" without running the full verification suite.
- Both phases together represent roughly 1-2 days of focused work for this scope.

### Research Flags

Phases with standard patterns (no additional research needed):
- **Phase 1:** Everything here is well-documented with official Next.js 16.x docs (lastUpdated 2026-02-27). Person schema, Metadata API, static export, Tailwind CSS 4 integration — all have authoritative official documentation and verified patterns. No research-phase needed.
- **Phase 2:** DNS cutover sequence is documented by Vercel and verified against official migration guides. GSC Domain property setup has official Google documentation. No research-phase needed.

No phases require `/gsd:research-phase`. All implementation patterns are definitively documented.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All technologies verified against official docs (Next.js 16.1.6 docs lastUpdated 2026-02-27, Tailwind CSS 4.2.1 npm confirmed, schema-dts via search results — npm 403'd but version confirmed). Zero novel technology choices. |
| Features | HIGH | Google Search Central docs confirm Person vs. ProfilePage schema recommendation explicitly. Multiple independent sources confirm sameAs and Knowledge Panel relationship. Feature set is narrow and well-understood. |
| Architecture | HIGH | Patterns verified against official Next.js App Router docs. Build order derived from component dependency graph — no inference needed. Flat structure is appropriate for scope and is an explicit anti-pattern avoidance. |
| Pitfalls | HIGH | Vercel duplicate content and SSL gap verified against Vercel official KB. LCP lazy-load issue verified against Next.js image docs and 2025 Web Almanac data. Schema pitfall verified against Google Search Central. |

**Overall confidence:** HIGH

### Gaps to Address

- **Headshot availability:** Research assumes a placeholder is acceptable at launch and a real headshot is swapped in post-launch. If Joe has a current professional headshot ready, it should be used from day one — the `image` property in Person schema pointing to a real photo strengthens the entity signal. Confirm asset availability before Phase 1 execution.

- **LinkedIn canonical URL format:** Research notes to use `linkedin.com/in/username` format. The exact LinkedIn profile slug for Joe Scannell should be confirmed before authoring the `sameAs` array in Person schema — using a wrong or legacy URL format would undermine the entity signal.

- **GSC existing property state:** The domain `joescannell.com` has existing tenure. Before Phase 2, check whether a GSC property already exists for this domain (URL prefix or Domain property). If a URL prefix property exists, it should be converted to a Domain property to cover all URL variants. This is a pre-Phase-2 discovery step, not a blocking concern for Phase 1.

- **Vercel project name:** The Vercel subdomain noindex header requires knowing the project's `.vercel.app` URL. The exact project name should be noted during Phase 1 Vercel setup to confirm the noindex header is applied to the correct subdomain.

## Sources

### Primary (HIGH confidence)
- Next.js 16.1 Release Notes — confirmed stable version, Turbopack caching details
- Next.js JSON-LD Guide (official, lastUpdated 2026-02-27) — official implementation pattern, XSS warning, schema-dts recommendation
- Next.js generateMetadata API Reference — Metadata API fields, Open Graph support
- Next.js Image Component docs — priority prop, LCP optimization
- Next.js Project Structure docs — App Router conventions
- Tailwind CSS Next.js Installation Guide — confirmed v4.2, PostCSS plugin, `@import "tailwindcss"` pattern
- Google Search Central: ProfilePage schema — explicit Person vs. ProfilePage guidance
- Google Search Central: Organization Schema — sameAs reference implementation
- Google Search Central: Site Moves and Migrations — platform migration guidance
- Vercel: Avoiding duplicate-content SEO with vercel.app URLs — canonical + noindex header pattern
- Vercel: Zero-downtime migration to Vercel — SSL pre-provisioning sequence
- Vercel: How to generate a sitemap for Next.js — sitemap.ts convention

### Secondary (MEDIUM confidence)
- SALT.agency: SEO Issues On Next.js Websites (50 site study) — canonical tag adoption rate finding
- Zipyra: Person Schema and sameAs Setup for Creator Knowledge Panels — sameAs implementation patterns
- Schema App: How Schema Markup Enhances Google Knowledge Panel — Knowledge Panel eligibility factors
- Lindy Panels: Technical Guide to Google Knowledge Panel — entity disambiguation patterns
- Search Engine Land: Site Migration SEO Checklist — migration sequence validation
- Weekend Growth: sameAs Schema for E-E-A-T — sameAs best practices

### Tertiary (LOW confidence)
- Backlinko: Google's 200 Ranking Factors 2026 — Core Web Vitals ranking signal weight (general guidance, not specific to name-branded queries)

---
*Research completed: 2026-03-03*
*Ready for roadmap: yes*
