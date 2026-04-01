---
name: seo-dominance
description: Complete SEO dominance playbook for IFX Trades — ensures the platform ranks #1 for every forex, algo trading, webinar, and education search. Mandatory reading before any content, copy, or route change.
---

# 🏆 IFX TRADES — SEO DOMINANCE PROTOCOL
**Objective: RANK #1 for every forex, algo trading, webinar, and education-related search in Asia, India, Dubai & globally.**  
This is a living, enforced document. Every developer, content editor, or AI making changes MUST comply with these directives.

---

## PART 1: TIER-1 TARGET KEYWORDS (Ranked by Priority)

### Cluster A — Core Brand & Institutional (Highest Volume)
| Keyword | Page Target | Intent |
|---|---|---|
| `forex education` | `/` | Informational |
| `algo trading` | `/marketplace` | Commercial |
| `best forex course India` | `/academy` | Transactional |
| `best algo trading course Dubai` | `/academy` | Transactional |
| `institutional forex education` | `/` | Informational |
| `forex academy India` | `/academy` | Informational |
| `IFX Trades` | `/` | Brand |

### Cluster B — High-Intent Long-Tail (Best ROI)
| Keyword | Page Target | Intent |
|---|---|---|
| `forex webinar for professionals India` | `/webinars` | Transactional |
| `live forex trading webinar 2026` | `/webinars` | Transactional |
| `free forex webinar online India` | `/webinars` | Transactional |
| `forex algo trading course for beginners` | `/academy` | Transactional |
| `automated forex trading strategies 2026` | `/marketplace` | Commercial |
| `best AI forex trading bot MT5` | `/marketplace` | Commercial |
| `forex signals India live` | `/signals` | Transactional |
| `gold trading signals XAUUSD` | `/signals` | Transactional |
| `how to pass prop firm challenge 2026` | `/blog` | Informational |
| `quantitative trading course India` | `/academy` | Transactional |

### Cluster C — Trending & Growing (Capture Early)
| Keyword | Page Target | Intent |
|---|---|---|
| `AI forex trading bots 2026` | `/marketplace` | Commercial |
| `machine learning forex trading` | `/marketplace` | Informational |
| `prop firm trading rules explained` | `/blog` | Informational |
| `how to build MT5 expert advisor` | `/blog` | Informational |
| `XAUUSD macro analysis 2026` | `/blog` | Informational |

---

## PART 2: MANDATORY ON-PAGE SEO RULES

### 2.1 Title Tags
- **Format:** `[Primary Keyword] | [Secondary Keyword] — IFX Trades`
- **Max Length:** 60 characters
- **Must contain:** At least one Cluster A or B keyword
- **Example:** `Best Algo Trading Course Dubai & India | IFX Trades`

### 2.2 Meta Descriptions
- **Length:** 150–160 characters exactly
- **Must contain:** Primary keyword + call to action + year (2026)
- **Example:** `Master institutional forex and algo trading. Live signals, XAUUSD analysis & webinars for elite traders in India & Dubai. Join 12,000+ students today.`

### 2.3 H1 Tags (ONE per page — CRITICAL)
- Every page MUST have exactly one `<h1>`
- Must contain the **primary target keyword** verbatim
- Must be unique across all pages
- The `HeroSection` component h1 is the home page H1 — do NOT add another anywhere in Home.tsx

### 2.4 Heading Hierarchy
```
H1 → One per page (primary keyword)
H2 → Section titles (secondary keywords)
H3 → Card/sub-section titles (long-tail keywords)
```

### 2.5 Canonical URLs
- Every page MUST call `<PageMeta path="/your-route" />` 
- This auto-injects the canonical tag via `PageMeta.tsx`
- Never duplicate content across routes

---

## PART 3: STRUCTURED DATA (JSON-LD) — REQUIRED PER PAGE

All schemas live in `src/utils/structuredData.ts`. ALWAYS inject these:

| Page | Required Schemas |
|---|---|
| `/` (Home) | `educationalOrganizationSchema`, `websiteSchema`, `goldAlgoCourseSchema`, `faqSchema` |
| `/academy` | `educationalOrganizationSchema`, `courseSchema`, `breadcrumbSchema` |
| `/webinars` | `eventSchema` (per webinar), `breadcrumbSchema` |
| `/marketplace` | `productSchema` (per product), `breadcrumbSchema` |
| `/signals` | `breadcrumbSchema`, `organizationSchema` |
| `/blog/:slug` | `articleSchema`, `breadcrumbSchema` |
| `/results` | `breadcrumbSchema` |

**Rule:** Never remove structuredData from `PageMeta`. If you add a new page, ALWAYS add relevant JSON-LD.

---

## PART 4: TECHNICAL SEO CHECKLIST (Run Before Every Deploy)

### Core Web Vitals Targets
- **LCP (Largest Contentful Paint):** < 2.5s → Use `LazySection` for below-fold content ✅
- **FID (First Input Delay):** < 100ms → No heavy sync JS in render path ✅
- **CLS (Cumulative Layout Shift):** < 0.1 → Set explicit width/height on all images ✅

### Image SEO
```tsx
// CORRECT — Always include descriptive alt text with keywords
<img src="/logo.png" alt="IFX Trades institutional forex education logo" />

// WRONG — Never use empty or generic alt
<img src="/logo.png" alt="logo" />
```

### Link Structure
- Internal links: Use relative paths via React Router `<Link to="/route">`
- Anchor text must be descriptive (never "click here")
- Every page must link to at least 3 other pages (topic clustering)

### URL Rules
- All routes MUST be lowercase and hyphenated: `/forex-signals` ✅ not `/forexSignals` ❌
- Never add query params to canonical pages
- Blog slugs MUST contain the primary keyword

---

## PART 5: CONTENT SEO DIRECTIVES

### Blog Strategy (Topic Clusters)
Create content in these proven high-traffic clusters:

1. **Forex Basics Hub** → Target: `forex trading for beginners India`
   - "What is forex trading and how does it work"
   - "Forex leverage explained for beginners 2026"
   - "How to read forex charts"

2. **Algo Trading Hub** → Target: `algo trading course`
   - "How to build a forex EA in MT5 Python"
   - "Best backtesting tools for algorithmic trading"
   - "Automated trading strategies that work in 2026"

3. **Gold/XAUUSD Hub** → Target: `gold trading signals`
   - "XAUUSD macro analysis 2026"
   - "Why gold is the best forex pair for scalping"
   - "Institutional gold accumulation zones"

4. **Webinar Hub** → Target: `forex webinar`
   - "How to pick the right forex webinar"
   - "Top forex webinars India 2026"
   - "What to expect in a professional algo trading webinar"

### Freshness Requirements
- Blog posts: Update any post older than 3 months with `[Updated: Month Year]`
- Webinars: Always include the current year in title/description
- Home Hero: H1 must remain keyword-rich and current

---

## PART 6: LOCAL SEO (India + Dubai DOMINANCE)

### Google Business Profile Keywords
Target these in `educationalOrganizationSchema` and all page descriptions:
- "forex education Dubai"
- "forex academy Greater Noida India"
- "algo trading course Delhi NCR"
- "best trading education platform Middle East"

### hreflang (Multi-Region)
Add to `index.html` for India/UAE targeting:
```html
<link rel="alternate" hreflang="en-IN" href="https://ifxtrades.com" />
<link rel="alternate" hreflang="en-AE" href="https://ifxtrades.com" />
<link rel="alternate" hreflang="en" href="https://ifxtrades.com" />
```

### Location Signals
- Address schema is already set in `educationalOrganizationSchema()` — NEVER REMOVE
- Always mention "Dubai" and "India" in home page meta description
- Footer MUST contain physical address or region mentions

---

## PART 7: PERFORMANCE SEO (Browser-Side)

### Preloads (Critical Resources)
Already in `index.html` — never remove:
- Google Fonts preconnect
- Logo preload (add if missing)

### robots.txt (Ensure at `/public/robots.txt`)
```
User-agent: *
Allow: /
Disallow: /admin
Disallow: /dashboard
Disallow: /agent
Sitemap: https://ifxtrades.com/sitemap.xml
```

### sitemap.xml (Ensure at `/public/sitemap.xml`)
Must include all public routes:
- `/`, `/academy`, `/academy/:courseId`, `/webinars`, `/webinars/:id`
- `/blog`, `/blog/:slug`, `/marketplace`, `/signals`, `/results`
- `/about`, `/contact`, `/hiring`, `/privacy`, `/terms`, `/risk`

---

## PART 8: AGENTIC DEVELOPER RULES

**If you are an AI or human making any change to this codebase, you MUST:**

1. ✅ **Check PageMeta** — Does your page/component change affect H1, title, or description? Update `PageMeta` accordingly.
2. ✅ **Preserve Structured Data** — Never remove `structuredData` prop from `PageMeta`. Always add schemas for new pages.
3. ✅ **Keyword-Rich Copy** — All user-facing text should naturally contain target keywords from Cluster A or B above.
4. ✅ **No Broken Internal Links** — Run a quick mental check: does any link you're changing still resolve to a valid route?
5. ✅ **Alt Text on Images** — Every `<img>` must have descriptive, keyword-containing `alt` text.
6. ✅ **LazySection for Below-Fold** — Any new section added to a page must be wrapped in `<LazySection>` if it's below the hero.
7. ✅ **Update this File** — If you add a new page or significant feature, add its target keyword to the tables above.

---

## PART 9: MONITORING & MEASUREMENT

### Tools to Use
- **Google Search Console** → Connect at search.google.com/search-console
- **GA4** → Already integrated (G-GK6Z1JKXS4 in index.html)
- **Vercel Speed Insights** → Already deployed in App.tsx ✅

### Key Metrics to Track Monthly
| Metric | Target | Current |
|---|---|---|
| Organic Sessions | 10,000+/mo | Track in GSC |
| Keyword Rankings (Cluster A) | Top 10 | Track in GSC |
| Core Web Vitals | Green | Track in GSC |
| CTR from Search | > 5% | Track in GSC |
| Backlinks | 50+/month | Track with Ahrefs/Semrush |

---

*Last Updated: April 2026 | Platform: IFX Trades (ifxtrades.com) | Maintained by: Principal Systems Architect*
