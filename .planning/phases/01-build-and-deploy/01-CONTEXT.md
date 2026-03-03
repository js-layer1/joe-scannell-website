# Phase 1: Build and Deploy - Context

**Gathered:** 2026-03-03
**Status:** Ready for planning

<domain>
## Phase Boundary

Scaffold Next.js site, build all content and SEO layers (Person schema, Open Graph, sitemap, robots.txt, GSC verification), deploy to Vercel subdomain. Passing Lighthouse and Rich Results Test before DNS cutover (Phase 2).

</domain>

<decisions>
## Implementation Decisions

### Page layout
- Small/subtle headshot -- text-forward, photo is secondary
- Warm & approachable mood: warm off-white background, soft shadows, rounded elements
- Spacious and centered feel -- content floats in the middle of the page

### Content & copy
- H1: "Joe Scannell"
- Tagline: "Founder, Layer One Group"
- Links: Layer One Group, LinkedIn, Twitter/X, Email (hello@layeronegroup.com)
- All links have equal prominence -- no hierarchy between them

### Design system
- Sans-serif font (no serif, no mix)
- Warm color palette: off-white background, dark charcoal text
- Rounded corners on interactive elements

### Claude's Discretion
- Exact layout structure (centered stack vs split -- pick what works best for a warm, approachable feel with small photo)
- Link presentation style (buttons vs text links vs icons -- pick what fits the warm mood)
- Accent color selection (subtle accent or fully neutral -- whatever fits)
- Specific font choice (any clean sans-serif that feels warm, not cold/technical)
- Spacing and typography scale
- Favicon design approach
- OG image design (static vs generated)

</decisions>

<specifics>
## Specific Ideas

- Warm & approachable mood was chosen over minimal/sharp and bold/confident
- User liked the mockup with rounded buttons, soft shadows, warm tones
- Distinct from Layer One Group's glass/gradient aesthetic -- this should feel personal, not agency
- Email is hello@layeronegroup.com (same as L1G site)

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- None -- greenfield project, empty repository

### Established Patterns
- None -- first phase, no prior code

### Integration Points
- Vercel deployment pipeline (will be set up as part of this phase)
- Person schema sameAs URLs need to be confirmed: LinkedIn slug, Twitter/X handle

</code_context>

<deferred>
## Deferred Ideas

None -- discussion stayed within phase scope

</deferred>

---

*Phase: 01-build-and-deploy*
*Context gathered: 2026-03-03*
