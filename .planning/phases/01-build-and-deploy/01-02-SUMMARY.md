---
phase: 01-build-and-deploy
plan: 02
subsystem: ui
tags: [next.js, tailwind, components, design-system, favicon, og-image, static-assets]

# Dependency graph
requires:
  - 01-01 (Next.js scaffold with Geist font, globals.css, layout.tsx)
provides:
  - Avatar component (96px circular headshot, LCP priority prop)
  - NameCard component (H1 "Joe Scannell", tagline "Founder, Layer One Group")
  - LinkList component (4 equal-prominence pill-button links with confirmed social URLs)
  - Warm personal design system (CSS tokens: bg/text/muted/border/accent)
  - favicon.ico (32x32 JS monogram, warm off-white)
  - apple-icon.png (180x180 JS monogram)
  - opengraph-image.png (1200x630 with name + tagline text)
  - Composed app/page.tsx (Avatar + NameCard + LinkList vertical stack)
  - Confirmed LinkedIn URL: https://www.linkedin.com/in/joe-scannell
  - Confirmed Twitter/X URL: https://twitter.com/joe_scannell
affects:
  - 01-03 (SEO plan uses confirmed social URLs for Person schema sameAs; GSC token still TBD)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "CSS custom property design tokens in globals.css consumed via Tailwind arbitrary values"
    - "SVG-to-PNG via sharp for static asset generation (no ImageMagick dependency)"
    - "Next.js file convention: apple-icon.png and opengraph-image.png in app/ auto-detected"
    - "Conditional rel/target on mailto links: undefined for email, noopener noreferrer for external"

key-files:
  created:
    - components/Avatar.tsx
    - components/NameCard.tsx
    - components/LinkList.tsx
    - app/apple-icon.png
    - app/opengraph-image.png
    - scripts/generate-assets.mjs
  modified:
    - app/page.tsx
    - app/globals.css
    - app/favicon.ico

key-decisions:
  - "Warm amber accent #B8956A as single accent color -- subtle, personal, distinct from agency palette"
  - "Pill-button link style: rounded-full border with soft hover (border + text shifts to accent amber)"
  - "96px avatar: small enough to keep text primary, large enough to be recognizable"
  - "SVG-overlay approach for asset generation: sharp renders SVG to PNG, produces clean text rendering"
  - "Confirmed LinkedIn URL: https://www.linkedin.com/in/joe-scannell"
  - "Confirmed Twitter/X URL: https://twitter.com/joe_scannell"
  - "GSC verification token: TBD -- user will provide in Plan 01-03"
  - "scripts/generate-assets.mjs added for reproducibility (re-run to regenerate if needed)"

requirements-completed: [PAGE-01, PAGE-02, PAGE-03, PAGE-04, PAGE-05, PAGE-06, PAGE-07, PAGE-08, DES-01, DES-02]

# Metrics
duration: 8min
completed: 2026-03-04
---

# Phase 1 Plan 02: UI Components and Warm Design System Summary

**Three reusable components (Avatar, NameCard, LinkList) with warm personal design tokens deployed to Vercel; favicon, apple-icon, and OG image generated via sharp SVG rendering; social URLs confirmed at checkpoint**

## Performance

- **Duration:** ~8 min (execution) + checkpoint wait
- **Started:** 2026-03-04T00:20:00Z
- **Completed:** 2026-03-04
- **Tasks:** 3 (2 auto + 1 checkpoint/human-verify with URL update follow-up)
- **Files modified/created:** 9

## Accomplishments

- `components/Avatar.tsx`: 96px circular headshot using next/image with `priority` prop (LCP element). Warm ring border.
- `components/NameCard.tsx`: H1 "Joe Scannell" (semibold, charcoal), tagline "Founder, Layer One Group" (muted warm gray).
- `components/LinkList.tsx`: Four equal-prominence pill buttons (Layer One Group, LinkedIn, Twitter/X, Email). Amber hover accent. Proper `rel="noopener noreferrer"` on external links, no rel/target on mailto. Confirmed social URLs committed.
- `app/globals.css`: Design token layer with 5 CSS custom properties (`--color-bg`, `--color-text`, `--color-muted`, `--color-border`, `--color-accent`).
- `app/page.tsx`: Replaced Next.js scaffold with composed centered vertical stack on warm off-white background.
- `app/favicon.ico`: 32x32 "JS" monogram (Helvetica Bold, charcoal on warm off-white) -- replaces default Next.js favicon.
- `app/apple-icon.png`: 180x180 "JS" monogram (same palette).
- `app/opengraph-image.png`: 1200x630 with "Joe Scannell" (80px bold) and "Founder, Layer One Group" (38px muted) on warm off-white, subtle amber top bar.
- All assets generated via `scripts/generate-assets.mjs` using sharp + SVG overlay (ImageMagick not available).
- Visual verification PASSED -- warm personal aesthetic approved by user at Task 3 checkpoint.
- `npm run build` passes. Site pushed to GitHub. Vercel deployed.

## Task Commits

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Build Avatar, NameCard, LinkList with warm design system | `8755593` | components/Avatar.tsx, components/NameCard.tsx, components/LinkList.tsx, app/page.tsx, app/globals.css |
| 2 | Generate favicon, apple-icon, OG image static assets | `91106d9` | app/favicon.ico, app/apple-icon.png, app/opengraph-image.png, scripts/generate-assets.mjs |
| 3 | Verify design (checkpoint) + confirm social URLs | `4c2b3e8` | components/LinkList.tsx (LinkedIn + Twitter URLs confirmed) |

**Plan metadata:** (docs commit follows this SUMMARY update)

## Design Decisions (Claude's Discretion)

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Accent color | `#B8956A` warm amber | Earthy, personal, zero overlap with Layer One Group purple/pink/green palette |
| Layout | Centered vertical stack with `gap-6` | Clean hierarchy: headshot > name > tagline > links |
| Link style | Rounded-full pill buttons, `bg-white/60` default | Soft, readable; hover shifts border + text to amber accent |
| Avatar size | 96px | Text-primary approach; headshot supports without dominating |
| OG image | Amber accent bar + name + tagline on warm off-white | Matches page aesthetic; legible on all social platforms |
| Asset generation | Sharp + SVG overlay | ImageMagick not available; SVG gives clean text rendering |

## SEO Inputs Collected (for Plan 01-03)

| Input | Value | Status |
|-------|-------|--------|
| LinkedIn URL | https://www.linkedin.com/in/joe-scannell | Confirmed |
| Twitter/X URL | https://twitter.com/joe_scannell | Confirmed |
| GSC verification token | TBD | User will provide in Plan 01-03 |

## Deployment Info

- **Vercel URL:** https://joe-scannell-website.vercel.app
- **GitHub:** https://github.com/js-layer1/joe-scannell-website
- **Build status:** Passing

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] ImageMagick unavailable -- used sharp + SVG overlay for asset generation**
- **Found during:** Task 2
- **Issue:** `convert` command not found; ImageMagick not installed on system
- **Fix:** Wrote `scripts/generate-assets.mjs` using sharp (already a Next.js dependency) with SVG input for text rendering -- produces identical visual output
- **Files modified:** scripts/generate-assets.mjs (new), app/favicon.ico, app/apple-icon.png, app/opengraph-image.png
- **Commit:** `91106d9`

No other deviations.

## Next Plan Readiness

- Plan 01-03 (SEO layer) can begin immediately
- Confirmed social URLs ready for Person schema `sameAs` array
- GSC token is a known gap -- Plan 01-03 will include a clear PLACEHOLDER and instructions for user to fill
- `metadataBase` warning in build is expected -- Plan 01-03 resolves it when adding metadata export to layout.tsx

---
*Phase: 01-build-and-deploy*
*Completed: 2026-03-04*
