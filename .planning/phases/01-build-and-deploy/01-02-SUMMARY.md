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
  - LinkList component (4 equal-prominence pill-button links)
  - Warm personal design system (CSS tokens: bg/text/muted/border/accent)
  - favicon.ico (32x32 JS monogram, warm off-white)
  - apple-icon.png (180x180 JS monogram)
  - opengraph-image.png (1200x630 with name + tagline text)
  - Composed app/page.tsx (Avatar + NameCard + LinkList vertical stack)
affects:
  - 01-03 (SEO plan adds metadata, JSON-LD schema, confirms LinkedIn/Twitter URLs)

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
  - "LinkedIn and Twitter URLs marked PLACEHOLDER -- to be confirmed in Plan 01-03 checkpoint"
  - "scripts/generate-assets.mjs added for reproducibility (re-run to regenerate if needed)"

# Metrics
duration: 8min
completed: 2026-03-04
---

# Phase 1 Plan 02: UI Components and Warm Design System Summary

**Three reusable components (Avatar, NameCard, LinkList) with warm personal design tokens deployed to Vercel; favicon, apple-icon, and OG image generated via sharp SVG rendering**

## Performance

- **Duration:** ~8 min
- **Started:** 2026-03-04T00:20:00Z
- **Completed:** 2026-03-04T00:28:00Z
- **Tasks:** 2 of 3 (Task 3 is checkpoint -- awaiting human verification)
- **Files modified/created:** 9

## Accomplishments

- `components/Avatar.tsx`: 96px circular headshot using next/image with `priority` prop (LCP element). Warm ring border.
- `components/NameCard.tsx`: H1 "Joe Scannell" (semibold, charcoal), tagline "Founder, Layer One Group" (muted warm gray).
- `components/LinkList.tsx`: Four equal-prominence pill buttons (Layer One Group, LinkedIn, Twitter/X, Email). Amber hover accent. Proper `rel="noopener noreferrer"` on external links, no rel/target on mailto.
- `app/globals.css`: Design token layer with 5 CSS custom properties (`--color-bg`, `--color-text`, `--color-muted`, `--color-border`, `--color-accent`).
- `app/page.tsx`: Replaced Next.js scaffold with composed centered vertical stack on warm off-white background.
- `app/favicon.ico`: 32x32 "JS" monogram (Helvetica Bold, charcoal on warm off-white) -- replaces default Next.js favicon.
- `app/apple-icon.png`: 180x180 "JS" monogram (same palette).
- `app/opengraph-image.png`: 1200x630 with "Joe Scannell" (80px bold) and "Founder, Layer One Group" (38px muted) on warm off-white, subtle amber top bar.
- All assets generated via `scripts/generate-assets.mjs` using sharp + SVG overlay (ImageMagick not available).
- `npm run build` passes. Site pushed to GitHub. Vercel auto-deploying.

## Task Commits

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Build Avatar, NameCard, LinkList with warm design system | `8755593` | components/Avatar.tsx, components/NameCard.tsx, components/LinkList.tsx, app/page.tsx, app/globals.css |
| 2 | Generate favicon, apple-icon, OG image static assets | `91106d9` | app/favicon.ico, app/apple-icon.png, app/opengraph-image.png, scripts/generate-assets.mjs |
| 3 | (Checkpoint: human verification) | Pending | -- |

## Design Decisions (Claude's Discretion)

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Accent color | `#B8956A` warm amber | Earthy, personal, zero overlap with Layer One Group purple/pink/green palette |
| Layout | Centered vertical stack with `gap-6` | Clean hierarchy: headshot > name > tagline > links |
| Link style | Rounded-full pill buttons, `bg-white/60` default | Soft, readable; hover shifts border + text to amber accent |
| Avatar size | 96px | Text-primary approach; headshot supports without dominating |
| OG image | Amber accent bar + name + tagline on warm off-white | Matches page aesthetic; legible on all social platforms |
| Asset generation | Sharp + SVG overlay | ImageMagick not available; SVG gives clean text rendering |

## Placeholder URLs (To Confirm in Plan 01-03)

- LinkedIn: `https://linkedin.com/in/joescannell` -- **PLACEHOLDER**
- Twitter/X: `https://twitter.com/joescannell` -- **PLACEHOLDER**

These will be finalized at the Task 3 checkpoint.

## Deployment Info

- **Vercel URL:** https://joe-scannell-website.vercel.app
- **GitHub:** https://github.com/js-layer1/joe-scannell-website
- **Build status:** Passing (both pre and post-asset generation)

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

- Plan 01-03 (SEO layer) can start after Task 3 checkpoint is cleared
- Needs from checkpoint: confirmed LinkedIn URL, confirmed Twitter/X URL, GSC token
- `metadataBase` warning in build is expected -- Plan 01-03 resolves it when adding metadata export

---
*Phase: 01-build-and-deploy*
*Completed: 2026-03-04 (Tasks 1-2; Task 3 checkpoint pending)*
