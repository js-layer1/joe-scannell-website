# Requirements: JoeScannell.com

**Defined:** 2026-03-03
**Core Value:** Own the top search result for "Joe Scannell" and "Joseph Scannell" with a clean, professional personal page that links to Layer One Group.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Page Content

- [ ] **PAGE-01**: Page displays a headshot photo (placeholder acceptable at launch)
- [ ] **PAGE-02**: Page displays "Joe Scannell" as the H1 heading
- [ ] **PAGE-03**: Page displays a professional title/tagline (role + organization)
- [ ] **PAGE-04**: Page has a prominent link to layeronegroup.com
- [ ] **PAGE-05**: Page has a link to Joe's LinkedIn profile
- [ ] **PAGE-06**: Page has a link to Joe's Twitter/X profile
- [ ] **PAGE-07**: Page has an email contact link (mailto:)
- [ ] **PAGE-08**: Page is mobile-responsive and works on all screen sizes

### SEO / Structured Data

- [ ] **SEO-01**: Page has a descriptive title tag containing "Joe Scannell" and "Layer One Group"
- [ ] **SEO-02**: Page has a meta description (150-160 chars) covering "Joe Scannell" and "Joseph Scannell"
- [ ] **SEO-03**: Page has a self-referencing canonical URL
- [ ] **SEO-04**: Page includes Person schema (JSON-LD) with name, jobTitle, url, image, and sameAs array
- [ ] **SEO-05**: Person schema includes alternateName "Joseph Scannell"
- [ ] **SEO-06**: Person schema sameAs includes LinkedIn, Twitter/X, and layeronegroup.com
- [ ] **SEO-07**: Page has Open Graph metadata (og:title, og:description, og:image at 1200x630, og:type)
- [ ] **SEO-08**: Page has a sitemap.xml with the root URL
- [ ] **SEO-09**: Page has a robots.txt referencing the sitemap
- [ ] **SEO-10**: Page includes Google Search Console verification meta tag
- [ ] **SEO-11**: Page passes Core Web Vitals (headshot as priority LCP element)

### Design / Assets

- [ ] **DES-01**: Site has a clean, personal design distinct from Layer One Group brand
- [ ] **DES-02**: Site has a favicon and apple-touch-icon
- [ ] **DES-03**: Site uses a font/typography system appropriate for a personal page

### Infrastructure

- [ ] **INF-01**: Site is built with Next.js and deployed on Vercel
- [ ] **INF-02**: Custom domain joescannell.com configured on Vercel with SSL
- [ ] **INF-03**: Vercel subdomain (.vercel.app) has noindex header to prevent duplicate indexing
- [ ] **INF-04**: DNS cutover from Carrd to Vercel completed

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Identity Reinforcement

- **ID-01**: Page includes `<link rel="me">` reciprocal identity tags for verified profiles
- **ID-02**: Additional sameAs links added as Joe acquires verified profiles on other platforms

### Content

- **CONT-01**: Real headshot replaces placeholder photo

## Out of Scope

| Feature | Reason |
|---------|--------|
| Blog / content section | SEO value comes from domain authority + structured data, not content volume; blog belongs on layeronegroup.com |
| Contact form | Adds backend complexity; mailto: link is sufficient for this positioning |
| Dark mode | Doubles CSS surface; unnecessary for a minimal link-hub |
| Analytics (beyond GSC) | GSC provides branded query data which is the KPI; additional analytics adds JS weight |
| Multi-page navigation | All content on root URL to concentrate PageRank |
| Social feed embeds | Heavy JS, poor Core Web Vitals, external dependency |
| Animations / motion | LCP and INP are the ranking signals; keep JS minimal |
| Layer One Group brand aesthetic | Personal site needs its own identity |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| PAGE-01 | — | Pending |
| PAGE-02 | — | Pending |
| PAGE-03 | — | Pending |
| PAGE-04 | — | Pending |
| PAGE-05 | — | Pending |
| PAGE-06 | — | Pending |
| PAGE-07 | — | Pending |
| PAGE-08 | — | Pending |
| SEO-01 | — | Pending |
| SEO-02 | — | Pending |
| SEO-03 | — | Pending |
| SEO-04 | — | Pending |
| SEO-05 | — | Pending |
| SEO-06 | — | Pending |
| SEO-07 | — | Pending |
| SEO-08 | — | Pending |
| SEO-09 | — | Pending |
| SEO-10 | — | Pending |
| SEO-11 | — | Pending |
| DES-01 | — | Pending |
| DES-02 | — | Pending |
| DES-03 | — | Pending |
| INF-01 | — | Pending |
| INF-02 | — | Pending |
| INF-03 | — | Pending |
| INF-04 | — | Pending |

**Coverage:**
- v1 requirements: 26 total
- Mapped to phases: 0
- Unmapped: 26

---
*Requirements defined: 2026-03-03*
*Last updated: 2026-03-03 after initial definition*
