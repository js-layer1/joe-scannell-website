# Roadmap: JoeScannell.com

## Overview

Two phases deliver the complete project. Phase 1 builds and deploys the site on Vercel with all content, SEO metadata, Person schema, and design assets -- everything needed to pass the pre-launch checklist. Phase 2 executes the DNS cutover from Carrd, configures the custom domain, and registers the site with Google Search Console. Nothing ships to the real domain until Phase 1 passes Lighthouse and Rich Results Test verification.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Build and Deploy** - Scaffold Next.js site, build all content and SEO layers, deploy to Vercel subdomain, pass pre-launch verification (completed 2026-03-04)
- [ ] **Phase 2: DNS Cutover and GSC** - Configure custom domain on Vercel, cut DNS from Carrd, submit sitemap to Google Search Console

## Phase Details

### Phase 1: Build and Deploy
**Goal**: The complete site is live on the Vercel subdomain, passing all pre-launch checks, and ready for DNS cutover
**Depends on**: Nothing (first phase)
**Requirements**: PAGE-01, PAGE-02, PAGE-03, PAGE-04, PAGE-05, PAGE-06, PAGE-07, PAGE-08, SEO-01, SEO-02, SEO-03, SEO-04, SEO-05, SEO-06, SEO-07, SEO-08, SEO-09, SEO-10, SEO-11, DES-01, DES-02, DES-03, INF-01, INF-03
**Success Criteria** (what must be TRUE):
  1. Visiting the Vercel subdomain URL shows the page with a headshot, "Joe Scannell" as H1, title/tagline, and working links to Layer One Group, LinkedIn, Twitter/X, and email
  2. Google Rich Results Test returns a valid Person schema result with name, jobTitle, url, and sameAs array (LinkedIn, Twitter/X, layeronegroup.com)
  3. Lighthouse audit returns LCP under 2.5s, Performance >= 95, and SEO score of 100
  4. The page is mobile-responsive and the layout holds on a 375px viewport
  5. The Vercel subdomain returns an X-Robots-Tag: noindex header (confirmed via curl), preventing Google from indexing the staging URL
**Plans**: 3 plans

Plans:
- [x] 01-01-PLAN.md -- Bootstrap Next.js 16.1.6, static export config, Geist font, vercel.json noindex, first Vercel deploy
- [x] 01-02-PLAN.md -- Avatar/NameCard/LinkList components, warm design system, favicon, apple-icon, OG image; human verify checkpoint
- [x] 01-03-PLAN.md -- Full metadata export, Person JSON-LD schema, sitemap.ts, robots.ts, Lighthouse audit gate

### Phase 2: DNS Cutover and GSC
**Goal**: joescannell.com resolves to the Vercel-hosted site with SSL, Google Search Console is verified, and the site is submitted for indexing
**Depends on**: Phase 1
**Requirements**: INF-02, INF-04
**Success Criteria** (what must be TRUE):
  1. https://joescannell.com loads the site with a valid SSL certificate issued by Vercel
  2. Google Search Console shows the domain property as verified and the sitemap as submitted and indexed
  3. Visiting joescannell.vercel.app returns a noindex header and does not appear as a separate indexed result in Google
**Plans**: 1 plan

Plans:
- [ ] 02-01-PLAN.md -- Add custom domain to Vercel, pre-generate SSL, cut DNS from Carrd, replace GSC token, verify GSC, submit sitemap

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Build and Deploy | 3/3 | Complete   | 2026-03-04 |
| 2. DNS Cutover and GSC | 0/1 | Not started | - |
