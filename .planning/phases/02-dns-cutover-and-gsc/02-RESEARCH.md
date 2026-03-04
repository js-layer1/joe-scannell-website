# Phase 2: DNS Cutover and GSC - Research

**Researched:** 2026-03-03
**Domain:** DNS cutover, Vercel custom domains, SSL provisioning, Google Search Console
**Confidence:** HIGH

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| INF-02 | Custom domain joescannell.com configured on Vercel with SSL | Vercel A record + pre-generated SSL cert process documented; DNS currently at Cloudflare |
| INF-04 | DNS cutover from Carrd to Vercel completed | Carrd currently using Cloudflare nameservers; change is A record update in Cloudflare dashboard, not nameserver change |
</phase_requirements>

---

## Summary

Phase 2 has three distinct operations that must execute in order: (1) add the domain to Vercel and pre-generate the SSL certificate, (2) cut DNS in Cloudflare by updating the A record and disabling the proxy, and (3) verify and register in Google Search Console.

The critical discovery from live DNS inspection is that joescannell.com currently uses Cloudflare nameservers (`jonah.ns.cloudflare.com`, `deb.ns.cloudflare.com`). The current A records point to Carrd IPs (`23.21.234.173`, `23.21.157.88`). The DNS cutover happens inside the Cloudflare dashboard -- not at a registrar and not by switching nameservers. This means Cloudflare's proxy (orange cloud) must be disabled on the A record pointing to Vercel, or SSL will fail.

The GSC verification token is already embedded in the site as a placeholder (`GSC_VERIFICATION_TOKEN_PLACEHOLDER` in `app/layout.tsx` line ~42). The token must be replaced and a new Vercel build deployed before or immediately after DNS cutover, so that GSC can verify the site when it crawls joescannell.com. The token must come from the user -- it is unique to their Google account and the specific property.

**Primary recommendation:** Pre-generate the Vercel SSL cert first (using TXT record in Cloudflare), then swap the A record, then replace the GSC token and deploy, then verify in GSC and submit the sitemap. Never touch nameservers -- they stay on Cloudflare throughout.

---

## Current DNS State (Verified Live)

| Record | Type | Current Value | Notes |
|--------|------|---------------|-------|
| `@` (joescannell.com) | A | `23.21.234.173`, `23.21.157.88` | Carrd's IPs |
| `www` | CNAME | `joescannell.com.` | Points back to apex |
| Nameservers | NS | `jonah.ns.cloudflare.com`, `deb.ns.cloudflare.com` | Cloudflare manages DNS |

**Implication:** DNS changes happen inside the Cloudflare dashboard. Nameservers do NOT change.

---

## Standard Stack

### Core

| Tool | Version/Details | Purpose | Why Standard |
|------|-----------------|---------|--------------|
| Vercel Dashboard | Pro plan (js-layer1) | Add domain, generate SSL, verify | Official Vercel interface; CLI equivalent also works |
| Cloudflare Dashboard | (joescannell.com zone) | Update A record, disable proxy | Current DNS provider; changes propagate in ~5 min |
| Google Search Console | search.google.com/search-console | Property verification, sitemap submission | Official Google tool |

### DNS Records to Modify

| Action | Record Type | Name | New Value | Cloudflare Proxy |
|--------|-------------|------|-----------|-----------------|
| Replace Carrd A records | A | `@` | `76.76.21.21` (or project-specific IP shown in Vercel dashboard) | MUST be gray-cloud (off) |
| Verify www redirect | CNAME | `www` | `cname.vercel-dns.com` OR keep pointing to apex | gray-cloud |

**Note:** Vercel may show a project-specific IP or CNAME value in the domain settings dashboard. Use whatever is displayed there. The commonly documented value is `76.76.21.21` for A records, but the dashboard may show a newer anycast IP. Always use the value Vercel provides in Settings > Domains.

---

## Architecture Patterns

### Order of Operations (CRITICAL - do not reorder)

```
1. Add domain to Vercel project (Settings > Domains)
2. Pre-generate SSL certificate (TXT challenge in Cloudflare)
3. Verify SSL cert works (curl --resolve test)
4. Replace GSC token in app/layout.tsx + push + Vercel deploys
5. Update A record in Cloudflare (remove Carrd IPs, add Vercel IP)
6. Disable Cloudflare proxy (gray cloud) on the A record
7. Verify site loads at https://joescannell.com
8. Verify SSL cert is valid (no browser warning)
9. Add URL-prefix property in Google Search Console
10. Verify GSC ownership (meta tag auto-detected)
11. Submit sitemap.xml
12. Verify noindex still applies on vercel.app URL
```

### Pattern 1: Pre-Generate SSL Before DNS Flip

**What:** Vercel can issue an SSL certificate using a DNS TXT challenge before the A record is changed. This prevents any window where the domain resolves to Vercel but has no valid cert.

**When to use:** Always when migrating a live domain. joescannell.com is currently live (Carrd site). If the SSL cert is not pre-generated, there will be a "Not Secure" window after the A record is updated.

**How:**
1. In Vercel: Settings > Domains > (after domain is added) > scroll to SSL Certificates > "Pre-generate SSL certificates"
2. Vercel shows TXT records -- add them in Cloudflare DNS
3. Click "Verify" in Vercel dashboard
4. Run `curl https://joescannell.com --resolve joescannell.com:443:76.76.21.21 -I` to confirm cert works before DNS flip

```bash
# Source: Vercel docs - https://vercel.com/docs/domains/pre-generating-ssl-certs
# Verify cert before DNS cutover (replace with actual Vercel IP from dashboard)
curl https://joescannell.com --resolve joescannell.com:443:76.76.21.21 -I
# Expected: HTTP/2 200 with no SSL error
```

### Pattern 2: Cloudflare A Record Swap

**What:** In Cloudflare dashboard, delete the two existing Carrd A records and add one new A record pointing to Vercel. Set proxy to "DNS only" (gray cloud).

**Critical:** If the orange cloud (proxy) is left on, Cloudflare will proxy traffic through its own SSL termination. Vercel's SSL cert will not be presented to visitors. The site will appear broken or show a Cloudflare error. Set to gray cloud.

```
Cloudflare DNS > joescannell.com zone:
- DELETE: A  @  23.21.234.173
- DELETE: A  @  23.21.157.88
- ADD:    A  @  76.76.21.21  [Proxy: DNS only (gray cloud)]
```

**www handling:** The existing CNAME `www -> joescannell.com` can stay in place if Vercel is configured to redirect www to apex (or accept both). Add `www.joescannell.com` as a domain in Vercel settings to ensure it resolves. Vercel prompts for this when you add the apex domain.

### Pattern 3: GSC Meta Tag Verification

**What:** The site uses Next.js `metadata.verification.google` which outputs `<meta name="google-site-verification" content="TOKEN">` in the page `<head>`. GSC's "HTML tag" verification method reads this tag.

**Property type to create:** URL-prefix property at `https://joescannell.com`. Do NOT create a Domain property -- Domain properties require DNS TXT verification which adds complexity. The URL-prefix property supports the HTML meta tag method already implemented in the codebase.

**Token placeholder location:** `app/layout.tsx` line ~42 -- `google: 'GSC_VERIFICATION_TOKEN_PLACEHOLDER'`. User must get the token from GSC, replace this string, and push. Vercel will auto-deploy.

**GSC steps after domain resolves:**
1. Go to search.google.com/search-console
2. Add property > URL prefix > `https://joescannell.com`
3. Select "HTML tag" method -- Google shows the token
4. Replace the placeholder in `app/layout.tsx` with the real token
5. Push to GitHub, Vercel deploys
6. In GSC click "Verify" -- GSC crawls the page and finds the tag
7. Indexing > Sitemaps > add `sitemap.xml` > Submit

### Anti-Patterns to Avoid

- **Do not use Cloudflare proxy (orange cloud) with Vercel.** Cloudflare's proxy intercepts SSL before Vercel, causing cert mismatch errors. Gray cloud only.
- **Do not change nameservers.** joescannell.com is already on Cloudflare nameservers. The only change needed is the A record value within the existing Cloudflare zone.
- **Do not create a Domain property in GSC.** Domain properties require DNS TXT verification (adding a TXT record in Cloudflare). The meta tag approach is already implemented and works for a URL-prefix property.
- **Do not deploy the GSC token replacement after DNS cutover without verifying first.** If the token is wrong, GSC verification will fail and need a re-deploy cycle.
- **Do not skip the SSL pre-generation step.** Even if joescannell.com has minimal traffic, a cert gap creates a bad signal if Google crawls during the window.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| SSL certificate | Custom cert + renewal automation | Vercel auto-provisioned Let's Encrypt | Vercel handles issuance, renewal, and delivery automatically |
| DNS propagation check | Poll DNS repeatedly | `nslookup -type=A joescannell.com` / Vercel dashboard status | Vercel's dashboard shows green checkmark when verified |
| GSC verification token generation | Any custom logic | Get token from GSC UI, paste into `app/layout.tsx` | Token is Google-generated and unique to the account |
| www-to-apex redirect | Custom redirect rules | Vercel project settings "Redirect to" toggle | Built into Vercel domain management |

---

## Common Pitfalls

### Pitfall 1: Cloudflare Proxy Left Enabled (Orange Cloud)
**What goes wrong:** The site loads but SSL errors appear, or Cloudflare shows its own cert instead of Vercel's. GSC may report SSL issues.
**Why it happens:** Cloudflare defaults to "Proxied" for A records. The orange cloud intercepts traffic before it reaches Vercel.
**How to avoid:** When adding the A record in Cloudflare, explicitly set the proxy status to "DNS only" (gray cloud icon). Double-check after saving.
**Warning signs:** `curl -I https://joescannell.com` shows `server: cloudflare` in response headers instead of Vercel's response headers.

### Pitfall 2: DNS Propagation Confusion
**What goes wrong:** Domain doesn't resolve to Vercel immediately after A record change, user assumes something is broken.
**Why it happens:** DNS TTL and propagation. Cloudflare zones typically propagate in 5 minutes (low TTL), but some resolvers cache longer.
**How to avoid:** Use `nslookup joescannell.com 8.8.8.8` to check Google's resolver specifically. Use Vercel dashboard which shows green when its edge sees the record.
**Warning signs:** Site still shows Carrd content 10+ minutes after change. Check with a different resolver or `dig @1.1.1.1 joescannell.com A`.

### Pitfall 3: GSC Token Not Deployed Before Verification Attempt
**What goes wrong:** GSC verification fails. The meta tag in the live site still shows the placeholder value.
**Why it happens:** User gets token from GSC, edits layout.tsx, but doesn't push or waits for Vercel deploy to complete before clicking "Verify" in GSC.
**How to avoid:** After pushing the token, watch Vercel deployment logs to confirm the build completed. Then verify in GSC. Alternatively, check the live page source for the correct token before clicking Verify.
**Warning signs:** GSC reports "Verification failed: couldn't find the meta tag."

### Pitfall 4: Wrong GSC Property Type (Domain vs URL-prefix)
**What goes wrong:** User creates a Domain property, which requires DNS TXT verification, creating unnecessary work and potential confusion.
**Why it happens:** GSC now prominently offers "Domain" as a property type. It's tempting to use it for "complete" coverage.
**How to avoid:** Select "URL prefix" and enter `https://joescannell.com`. The meta tag verification is already wired up in the codebase.
**Warning signs:** GSC shows "DNS TXT record" as the only verification method shown.

### Pitfall 5: Two A Records Confuse Vercel
**What goes wrong:** Vercel dashboard shows domain as "misconfigured" even after adding the A record because Carrd's old A records are still present.
**Why it happens:** Cloudflare allows multiple A records for the same name. If both Carrd IPs and the Vercel IP are present, DNS round-robins between them.
**How to avoid:** DELETE both existing Carrd A records (`23.21.234.173`, `23.21.157.88`) before or immediately when adding the Vercel A record.
**Warning signs:** `dig joescannell.com A` returns more than one IP address after the cutover.

### Pitfall 6: www Subdomain Not Added to Vercel
**What goes wrong:** `https://www.joescannell.com` returns 404 after cutover even though apex works.
**Why it happens:** Vercel doesn't automatically handle the www subdomain -- it must be explicitly added as a domain in the project, or the CNAME must point to a Vercel URL.
**How to avoid:** When Vercel prompts "would you like to add www.joescannell.com?" during domain addition, accept. If missed, add it manually in Settings > Domains.
**Warning signs:** `curl -I https://www.joescannell.com` returns 404.

---

## Code Examples

### Verify Current noindex on vercel.app (already confirmed working)
```bash
# Source: Live verification - confirmed 2026-03-03
curl -s -I https://joe-scannell-website.vercel.app | grep -i x-robots-tag
# Expected output: x-robots-tag: noindex
```

### Check DNS Has Propagated to Vercel
```bash
# Check what IP joescannell.com resolves to
dig joescannell.com A +short
# After cutover, expect: 76.76.21.21 (or whatever Vercel dashboard showed)

# Check via Google's resolver specifically
nslookup joescannell.com 8.8.8.8
```

### Pre-flight SSL Cert Test (Before DNS Flip)
```bash
# Source: https://vercel.com/docs/domains/pre-generating-ssl-certs
# Test SSL cert against Vercel edge before DNS change
# Replace 76.76.21.21 with actual IP from Vercel Settings > Domains
curl https://joescannell.com --resolve joescannell.com:443:76.76.21.21 -I
# Success: HTTP/2 200, no SSL error
```

### Verify Site After Cutover
```bash
# Confirm site loads on custom domain with correct headers
curl -s -I https://joescannell.com
# Expect: HTTP/2 200
# Expect: NO x-robots-tag: noindex header (that's only for vercel.app)

# Confirm noindex still applies to vercel.app
curl -s -I https://joe-scannell-website.vercel.app
# Expect: x-robots-tag: noindex
```

### GSC Token Replacement (in app/layout.tsx)
```typescript
// Source: app/layout.tsx ~line 40
// BEFORE (placeholder):
verification: {
  google: 'GSC_VERIFICATION_TOKEN_PLACEHOLDER',
},

// AFTER (replace with real token from GSC - example format):
verification: {
  google: 'abc123XYZrealTokenFromGSC',
},
// Next.js renders: <meta name="google-site-verification" content="abc123XYZrealTokenFromGSC">
```

---

## State of the Art

| Old Approach | Current Approach | Impact |
|--------------|------------------|--------|
| Manually upload SSL cert | Vercel auto-provisions via Let's Encrypt, with pre-generation for zero-downtime | SSL is fully automatic post-DNS flip |
| Change nameservers to Vercel | Keep existing DNS provider, update A record only | Faster propagation, keep Cloudflare features |
| Verify GSC via HTML file upload | Next.js `metadata.verification.google` outputs meta tag natively | Zero extra files needed |
| Submit sitemap manually via GSC API | GSC Sitemaps UI: paste `sitemap.xml`, click Submit | Simple one-step UI action |

---

## Open Questions

1. **What is the actual Vercel IP shown in Settings > Domains for this project?**
   - What we know: Standard Vercel apex A record is `76.76.21.21`. Vercel may show a project-specific anycast IP.
   - What's unclear: Whether this project uses the standard IP or a custom one.
   - Recommendation: Planner should include a step to check Vercel Settings > Domains first and use whatever IP is displayed. Document it in the plan for the executor.

2. **Does joescannell.com have an existing GSC property?**
   - What we know: STATE.md notes "Check if a GSC property already exists for joescannell.com before Phase 2." No data on whether one exists.
   - What's unclear: Whether there is a pre-existing URL-prefix or Domain property the user has already created.
   - Recommendation: Plan should include a check step -- go to GSC and look. If a property exists, just replace the token and verify. If not, create one.

3. **Should www.joescannell.com redirect to apex or vice versa?**
   - What we know: The canonical URL in the codebase is `https://joescannell.com` (apex). The sitemap uses apex. The sameAs in JSON-LD uses apex.
   - What's unclear: Whether the user wants www to redirect to apex or to be a separate entry in Vercel.
   - Recommendation: Configure www to redirect to apex (Vercel's default when prompted). The canonical is set to apex throughout the codebase.

4. **What registrar holds joescannell.com?**
   - What we know: Cloudflare manages DNS. The registrar (where nameservers were originally configured) is unknown.
   - What's unclear: Whether the domain is registered at Cloudflare Registrar itself, or at a third party (GoDaddy, Namecheap, etc.) with nameservers pointed to Cloudflare.
   - Recommendation: This doesn't affect the cutover -- all DNS changes happen in Cloudflare dashboard regardless. Not a blocker.

---

## Sources

### Primary (HIGH confidence)
- [Vercel: Setting up a custom domain](https://vercel.com/docs/domains/set-up-custom-domain) - DNS record values, CLI commands, dashboard flow
- [Vercel: Adding & Configuring a Custom Domain](https://vercel.com/docs/domains/working-with-domains/add-a-domain) - Step-by-step dashboard guide, apex vs subdomain handling
- [Vercel: Pre-Generate SSL Certificates](https://vercel.com/docs/domains/pre-generating-ssl-certs) - TXT challenge flow, curl verification command
- [Vercel: Migrate to Vercel from Cloudflare](https://vercel.com/kb/guide/migrate-to-vercel-from-cloudflare) - Cloudflare proxy pitfall, gray-cloud requirement
- [Vercel: Avoiding duplicate-content SEO with vercel.app URLs](https://vercel.com/kb/guide/avoiding-duplicate-content-with-vercel-app-urls) - noindex header behavior post-cutover
- Live DNS dig: `dig joescannell.com A` - Current Carrd IPs (`23.21.234.173`, `23.21.157.88`)
- Live NS dig: `dig joescannell.com NS` - Cloudflare nameservers confirmed
- Live curl: `curl -I https://joe-scannell-website.vercel.app` - noindex header confirmed working

### Secondary (MEDIUM confidence)
- [Google: Verify your site ownership](https://support.google.com/webmasters/answer/9008080) - URL-prefix property, meta tag method vs Domain property distinction
- [Next.js GSC integration guide](https://www.webstudiospace.com/blog/how-to-add-google-search-console-tag-in-nextjs-app-router-project) - `metadata.verification.google` renders correct meta tag
- [GSC: Add a website property](https://support.google.com/webmasters/answer/34592) - Sitemap submission steps, UI navigation

### Tertiary (LOW confidence)
- Vercel community discussions - General propagation timelines (5 min Cloudflare, up to 48h globally)

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - DNS records confirmed via live dig; Vercel domain docs are authoritative and current
- Architecture: HIGH - Order of operations derived from official Vercel zero-downtime migration guide
- Pitfalls: HIGH - Cloudflare proxy pitfall confirmed in official Vercel/Cloudflare docs; others derived from live DNS state

**Research date:** 2026-03-03
**Valid until:** 2026-09-03 (stable infrastructure, 6-month validity reasonable)
