---
phase: 02-dns-cutover-and-gsc
plan: 01
subsystem: infra
tags: [dns, vercel, cloudflare, gsc, ssl, domain]

requires:
  - phase: 01-build-and-deploy
    provides: Complete site deployed to Vercel subdomain with SEO metadata, sitemap, robots.txt
provides:
  - joescannell.com resolving to Vercel-hosted site with valid SSL
  - www.joescannell.com 308 redirect to apex
  - Google Search Console verified and sitemap submitted
affects: []

tech-stack:
  added: []
  patterns: [DNS-only Cloudflare (no proxy) for Vercel SSL compatibility]

key-files:
  created: []
  modified: [app/layout.tsx]

key-decisions:
  - "GSC auto-verified via DNS (Domain name provider) — HTML tag token unnecessary, removed placeholder"
  - "Vercel project IP 216.150.1.1 (not the generic 76.76.21.21) — works correctly"
  - "308 Permanent Redirect for www -> apex (not 307 temporary)"
  - "Cloudflare proxy OFF (gray cloud) on both A and CNAME records — required for Vercel SSL"

patterns-established:
  - "DNS-only mode in Cloudflare for Vercel-hosted domains"

requirements-completed: [INF-02, INF-04]

duration: 15min
completed: 2026-03-04
---

# Phase 2 Plan 01: DNS Cutover and GSC Summary

**joescannell.com live on Vercel with SSL, www 308-redirecting to apex, GSC verified via DNS, sitemap submitted**

## Performance

- **Duration:** ~15 min (interactive checkpoint tasks)
- **Started:** 2026-03-04T01:30:00Z
- **Completed:** 2026-03-04T01:45:00Z
- **Tasks:** 2
- **Files modified:** 1

## Accomplishments
- joescannell.com resolves to Vercel with valid SSL (HTTP/2 200)
- www.joescannell.com 308 permanent redirects to apex domain
- Google Search Console auto-verified via Cloudflare DNS ownership
- Sitemap submitted to GSC for indexing
- Vercel subdomain still returns x-robots-tag: noindex
- Production domain has no noindex header (crawlable by Google)
- Not proxied by Cloudflare (server: Vercel)

## Task Commits

1. **Task 1: Add domain to Vercel, pre-generate SSL, cut DNS from Carrd** - User action in Vercel/Cloudflare dashboards (no code commit)
2. **Task 2: GSC verification and sitemap submission** - `8743f86` (feat: remove GSC placeholder, verified via DNS)

## Files Created/Modified
- `app/layout.tsx` - Removed GSC placeholder token, added comment noting DNS verification method

## Decisions Made
- GSC auto-verified via Cloudflare DNS records (Domain name provider method), making HTML tag verification unnecessary
- Removed the GSC_VERIFICATION_TOKEN_PLACEHOLDER rather than inserting a token
- User initially configured redirect direction backwards (apex -> www); corrected to www -> apex with 308

## Deviations from Plan

### Adjusted: GSC verification method
- **Plan expected:** User copies HTML tag token from GSC, Claude replaces placeholder in layout.tsx
- **Actual:** GSC auto-verified via DNS ownership (Cloudflare nameservers). No HTML tag needed.
- **Impact:** Simpler outcome. Placeholder removed instead of replaced. DNS-based verification is more durable.

### Adjusted: Redirect direction fix
- **Plan expected:** User configures www redirect to apex on first attempt
- **Actual:** User initially set apex redirecting to www (307). Corrected to www -> apex (308) after verification caught the issue.
- **Impact:** None, caught and fixed during verification step.

## Issues Encountered
- Redirect direction was initially backwards (apex -> www instead of www -> apex). Caught by verification commands and corrected in Vercel domain settings.

## User Setup Required
None - all external service configuration completed during checkpoint tasks.

## Next Phase Readiness
- Site is live at joescannell.com with full SSL
- GSC is verified and sitemap submitted
- This is the final phase of the project

---
*Phase: 02-dns-cutover-and-gsc*
*Completed: 2026-03-04*
