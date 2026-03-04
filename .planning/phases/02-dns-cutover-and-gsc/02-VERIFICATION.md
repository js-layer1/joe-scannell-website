---
phase: 02-dns-cutover-and-gsc
verified: 2026-03-04T01:49:00Z
status: human_needed
score: 3/5 must-haves verified programmatically (2 require human GSC dashboard confirmation)
human_verification:
  - test: "Confirm joescannell.com property is verified in Google Search Console"
    expected: "GSC dashboard shows a green verified checkmark for https://joescannell.com"
    why_human: "GSC verification state lives in Google's servers and cannot be queried via curl or any open API"
  - test: "Confirm sitemap.xml is listed as submitted in Google Search Console"
    expected: "GSC > Indexing > Sitemaps shows https://joescannell.com/sitemap.xml with status 'Success' or 'Pending'"
    why_human: "GSC sitemap submission state is internal to Google's dashboard and not exposed programmatically"
---

# Phase 2: DNS Cutover and GSC Verification Report

**Phase Goal:** joescannell.com resolves to the Vercel-hosted site with SSL, Google Search Console is verified, and the site is submitted for indexing
**Verified:** 2026-03-04T01:49:00Z
**Status:** human_needed
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | https://joescannell.com loads the site with valid SSL and no browser warnings | VERIFIED | HTTP/2 200, `server: Vercel`, `strict-transport-security: max-age=63072000` present, no Cloudflare proxy |
| 2 | https://www.joescannell.com redirects to https://joescannell.com | VERIFIED | HTTP/2 308 redirect to apex confirmed live; subsequent 200 on apex |
| 3 | Google Search Console shows joescannell.com as verified | NEEDS HUMAN | DNS-based verification used; HTML tag absent by design; GSC dashboard state not accessible programmatically |
| 4 | Sitemap is submitted and acknowledged in Google Search Console | NEEDS HUMAN | sitemap.xml returns HTTP 200 with valid XML on production domain; GSC submission status not accessible programmatically |
| 5 | joe-scannell-website.vercel.app still returns x-robots-tag: noindex | VERIFIED | `x-robots-tag: noindex` confirmed live on vercel.app subdomain; absent on joescannell.com |

**Score:** 3/5 truths verified programmatically; 2 require human dashboard confirmation

---

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `app/layout.tsx` | GSC verification handled (placeholder removed or real token inserted) | VERIFIED | Placeholder `GSC_VERIFICATION_TOKEN_PLACEHOLDER` removed in commit `8743f86`. Empty `verification: {}` block is correct — DNS-based verification makes HTML tag unnecessary. Code is substantive, committed, and deployed. |
| `vercel.json` | noindex header scoped to vercel.app only | VERIFIED | Host regex `(?!joescannell\\.com).*\\.vercel\\.app` confirmed in file; verified live: vercel.app has noindex, joescannell.com does not. |

**Artifact deviation note:** The PLAN expected `contains: "google: '"` in `app/layout.tsx` (real token replacing placeholder). Actual outcome: DNS ownership verification made the HTML tag unnecessary; placeholder removed cleanly instead. This is a legitimate, documented deviation — DNS verification is more durable than HTML tag verification. The file was modified substantively and the commit is real.

---

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| Cloudflare DNS A record | Vercel edge | A record pointing to Vercel IP, proxy OFF | VERIFIED | `dig joescannell.com A +short` returns `216.150.1.1` (Vercel project-specific IP). `curl -I https://joescannell.com` shows `server: Vercel` (not `server: cloudflare`), confirming proxy is off. |
| app/layout.tsx google verification | Google Search Console verification | meta name=google-site-verification in page head | N/A (by design) | DNS verification replaced HTML tag method. No `google-site-verification` meta tag in live page source. GSC verified via Cloudflare nameserver ownership instead. Confirmed absent from live page HTML. |
| vercel.json noindex header | Vercel subdomain only | host regex excludes joescannell.com | VERIFIED | noindex header present on `joe-scannell-website.vercel.app`, absent on `joescannell.com`. Both confirmed via live curl. |

---

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|----------|
| INF-02 | 02-01-PLAN.md | Custom domain joescannell.com configured on Vercel with SSL | SATISFIED | HTTP/2 200 on https://joescannell.com. `server: Vercel`. `strict-transport-security` header present. DNS A record 216.150.1.1 confirmed. |
| INF-04 | 02-01-PLAN.md | DNS cutover from Carrd to Vercel completed | SATISFIED | Carrd IPs (23.21.234.173, 23.21.157.88) no longer resolve. A record is now 216.150.1.1 (Vercel). www CNAME is `114dbd9f2cbd9be1.vercel-dns-016.com.` (Vercel DNS). Site responds correctly. |

**Requirements.md status note:** Both INF-02 and INF-04 remain marked `[ ]` (pending) in `.planning/REQUIREMENTS.md` as of verification. The implementation is complete — this is a documentation update needed in REQUIREMENTS.md, not an implementation gap.

**Orphaned requirements check:** No additional Phase 2 requirements found in REQUIREMENTS.md beyond INF-02 and INF-04. Full coverage.

---

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `app/layout.tsx` | 41 | `verification: {}` empty object block | Info | Not a stub — empty block is correct behavior when verification is handled at DNS level. Comment explains rationale. No functional impact. |

No blockers or warnings found.

---

### Human Verification Required

#### 1. GSC Property Verified

**Test:** Log in to https://search.google.com/search-console, navigate to the joescannell.com property, and check the verification status.

**Expected:** The property https://joescannell.com shows as verified (green checkmark or "Ownership verified" status in Settings > Ownership verification).

**Why human:** GSC verification state is stored in Google's backend and is not exposed via any public API or HTTP header. Cannot be confirmed programmatically.

#### 2. Sitemap Submitted in GSC

**Test:** In Google Search Console for joescannell.com, navigate to Indexing > Sitemaps.

**Expected:** `sitemap.xml` (or the full URL `https://joescannell.com/sitemap.xml`) appears in the submitted sitemaps list with a status of "Success" or "Pending" (Pending is normal within the first 24-48 hours).

**Why human:** GSC sitemap submission records are internal to Google's platform and not accessible programmatically.

---

### Gaps Summary

No implementation gaps found. All code-verifiable checks passed. The two items requiring human verification are GSC dashboard states that cannot be confirmed programmatically — they represent normal operational status for any GSC integration.

The one notable deviation from the PLAN (DNS verification replacing HTML tag verification) was handled correctly: the placeholder was removed rather than replaced with a real token, which is the right outcome when DNS ownership verification is used. This is more durable than HTML tag verification and does not require a token in the codebase.

**REQUIREMENTS.md needs a documentation update:** INF-02 and INF-04 should be marked `[x]` (complete) in `.planning/REQUIREMENTS.md` and the traceability table updated from "Pending" to "Complete".

---

## Live Verification Commands (Run at Verification Time)

```
dig joescannell.com A +short
  Result: 216.150.1.1 (Vercel project IP)

dig www.joescannell.com CNAME +short
  Result: 114dbd9f2cbd9be1.vercel-dns-016.com. (Vercel DNS)

curl -s -I https://joescannell.com
  HTTP/2 200 | server: Vercel | strict-transport-security: max-age=63072000

curl -s -I -L https://www.joescannell.com (first response)
  HTTP/2 308 | location: https://joescannell.com/

curl -s -I https://joe-scannell-website.vercel.app | grep -i x-robots-tag
  x-robots-tag: noindex

curl -s -I https://joescannell.com | grep -i x-robots-tag
  (no output — header absent on production domain)

curl -s -I https://joescannell.com | grep -i server
  server: Vercel (not cloudflare)

curl -s -o /dev/null -w "%{http_code}" https://joescannell.com/sitemap.xml
  200

curl -s https://joescannell.com/robots.txt
  Contains: Sitemap: https://joescannell.com/sitemap.xml

curl -s https://joescannell.com | grep google-site-verification
  (no output — DNS verification used, no HTML tag needed)
```

---

_Verified: 2026-03-04T01:49:00Z_
_Verifier: Claude (gsd-verifier)_
