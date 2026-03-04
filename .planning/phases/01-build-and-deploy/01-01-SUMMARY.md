---
phase: 01-build-and-deploy
plan: 01
subsystem: infra
tags: [next.js, vercel, tailwind, geist, static-export, schema-dts]

# Dependency graph
requires: []
provides:
  - Next.js 16.1.6 project bootstrapped with static export (output: 'export')
  - Deployed to Vercel at https://joe-scannell-website.vercel.app
  - GitHub repo at https://github.com/js-layer1/joe-scannell-website
  - X-Robots-Tag noindex enforced on .vercel.app subdomain
  - Geist font loaded via next/font/google with zero CLS
  - Placeholder headshot at public/headshot.jpg (400x400 warm greige)
  - schema-dts installed for Plan 01-03 JSON-LD
affects:
  - 01-02 (UI plan builds on this scaffold)
  - 01-03 (SEO plan uses this layout shell and schema-dts)

# Tech tracking
tech-stack:
  added:
    - next@16.1.6
    - react@19 + react-dom@19
    - tailwindcss@4 (CSS-first via @import)
    - @tailwindcss/postcss
    - typescript
    - eslint + eslint-config-next
    - schema-dts@1.x
    - next/font/google (Geist font)
  patterns:
    - Static export: output='export' + images.unoptimized=true in next.config.ts
    - Font-as-CSS-variable: Geist loaded with variable='--font-geist', applied to <html> className
    - Tailwind v4 CSS-first config via @import "tailwindcss" (no tailwind.config.ts)
    - Conditional Vercel header: X-Robots-Tag noindex scoped to .vercel.app only via host matcher

key-files:
  created:
    - next.config.ts
    - vercel.json
    - app/layout.tsx
    - app/globals.css
    - app/page.tsx (scaffold default)
    - public/headshot.jpg
    - package.json
    - tsconfig.json
    - .gitignore
  modified: []

key-decisions:
  - "Static export (output: 'export') chosen for consistency with Vercel static hosting; requires images.unoptimized: true"
  - "Geist font via next/font/google (not local): Vercel CDN delivery, zero layout shift, no third-party DNS"
  - "Tailwind v4 CSS-first config: no tailwind.config.ts needed, @import in globals.css is sufficient"
  - "vercel.json noindex scoped to .vercel.app only: regex excludes joescannell.com for post-cutover SEO"
  - "Placeholder headshot (sharp-generated 400x400 #C8B8A8): real photo to replace in Phase 2"
  - "schema-dts installed in Task 1 alongside scaffold to avoid an extra npm step in Plan 01-03"

patterns-established:
  - "Static export pattern: next.config.ts with output: 'export' + images.unoptimized: true"
  - "Font variable pattern: load via next/font/google, set as CSS variable on <html>, consume in globals.css body"
  - "Noindex scoping pattern: vercel.json host conditional regex to protect production domain from noindex rule"

requirements-completed: [INF-01, INF-03, DES-03]

# Metrics
duration: 3min
completed: 2026-03-04
---

# Phase 1 Plan 01: Scaffold and Deploy Summary

**Next.js 16.1.6 static export deployed to Vercel with Geist font via next/font, noindex enforced on .vercel.app subdomain via vercel.json host conditional**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-04T00:14:19Z
- **Completed:** 2026-03-04T00:17:12Z
- **Tasks:** 2
- **Files modified:** 9

## Accomplishments
- Next.js 16.1.6 bootstrapped with static export config; `npm run build` passes and generates `out/`
- Site deployed to production at https://joe-scannell-website.vercel.app (auto-deployed from GitHub)
- `curl -sI https://joe-scannell-website.vercel.app` returns `x-robots-tag: noindex` confirmed
- Geist font loaded via next/font/google with CSS variable `--font-geist` applied to `<html>`, zero CLS
- GitHub repo created at https://github.com/js-layer1/joe-scannell-website and connected to Vercel

## Task Commits

Each task was committed atomically:

1. **Task 1: Bootstrap Next.js project and configure static export** - `222a787` (feat)
2. **Task 2: Add placeholder headshot, create vercel.json, push and deploy** - `37c6203` (feat)

**Plan metadata:** (docs commit follows this SUMMARY creation)

## Files Created/Modified
- `next.config.ts` - Static export config: output='export', images.unoptimized=true
- `app/layout.tsx` - Minimal root layout shell with Geist font variable on html element
- `app/globals.css` - Tailwind v4 CSS-first @import, font variable declaration
- `vercel.json` - X-Robots-Tag noindex header scoped to .vercel.app subdomain (excludes joescannell.com)
- `public/headshot.jpg` - 400x400 warm greige (#C8B8A8) placeholder JPEG via sharp
- `package.json` - Next.js 16.1.6, React 19, Tailwind v4, schema-dts
- `tsconfig.json` - TypeScript config (default Next.js)
- `.gitignore` - Standard Next.js ignores including out/, .vercel

## Decisions Made
- Created Next.js scaffold in /tmp then rsync'd to project dir (create-next-app rejects dirs with existing files)
- Used sharp (Next.js built-in) for headshot placeholder since ImageMagick was unavailable
- Installed Vercel CLI globally (was not present) to complete deployment task
- schema-dts installed now to avoid extra step in Plan 01-03

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Scaffolded in temp dir due to create-next-app conflict detection**
- **Found during:** Task 1 (Bootstrap Next.js project)
- **Issue:** `create-next-app` refuses to scaffold into directories containing any existing files (.claude/, .planning/ were present)
- **Fix:** Ran `create-next-app` in `/tmp/joe-scannell-next` then rsync'd all files (excluding .git, node_modules, .next) to project directory
- **Files modified:** All scaffolded files
- **Verification:** All files present in project dir, npm run build passes
- **Committed in:** `222a787` (Task 1 commit)

**2. [Rule 3 - Blocking] Installed Vercel CLI (not present on system)**
- **Found during:** Task 2 (Vercel deploy)
- **Issue:** `vercel` command not found; Vercel CLI was not installed
- **Fix:** `npm install -g vercel` then proceeded with `vercel --yes`
- **Files modified:** None (global tool install)
- **Verification:** `vercel whoami` returned `js-layer1`, deploy succeeded
- **Committed in:** n/a (tool install, not tracked in git)

---

**Total deviations:** 2 auto-fixed (both Rule 3 - blocking)
**Impact on plan:** Both necessary workarounds for environment gaps. No scope creep. Plan outcome fully achieved.

## Issues Encountered
- ImageMagick not available for headshot generation -- used sharp (Node.js, already a Next.js dependency) as fallback. Outcome identical.

## User Setup Required
None - no external service configuration required. Vercel was already authenticated as js-layer1. GitHub CLI was already authenticated.

## Deployment Info
- **Vercel project:** layer-one-group/joe-scannell-website
- **Production URL:** https://joe-scannell-website.vercel.app
- **GitHub repo:** https://github.com/js-layer1/joe-scannell-website
- **Verified:** `x-robots-tag: noindex` header confirmed via curl

## Next Phase Readiness
- Scaffold complete; Plan 01-02 (UI) and Plan 01-03 (SEO) can begin immediately
- layout.tsx intentionally has NO metadata export -- Plan 01-03 adds that
- headshot.jpg placeholder in place at public/headshot.jpg for Plan 01-02 UI work
- schema-dts ready to import in Plan 01-03 for Person/Organization JSON-LD

---
*Phase: 01-build-and-deploy*
*Completed: 2026-03-04*
