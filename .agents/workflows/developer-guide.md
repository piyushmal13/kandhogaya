---
description: Agentic developer guide for IFX Trades — the definitive pre-flight checklist for any change made to this codebase
---

# 🧠 IFX TRADES — AGENTIC DEVELOPER GUIDE
**Mandatory reading for every AI agent or human developer before making ANY change to this platform.**

## Mission
IFX Trades must always rank #1 in search. Be the most trustworthy, fastest, and most premium forex education platform on the web. Every change must serve this mission.

## Pre-Flight Checklist (Run BEFORE every change)
1. **SEO Impact?** → Read `.agents/skills/seo-dominance/SKILL.md` fully
2. **H1 Affected?** → Exactly ONE `<h1>` per page — never add or remove without a reason
3. **PageMeta Present?** → Every page MUST have `<PageMeta title="..." description="..." path="..." structuredData={[...]} />`
4. **Images have alt text?** → Descriptive, keyword-rich alt on every `<img>`
5. **Below-fold content wrapped in `<LazySection>`?** → Yes, always

## Core Directives (Non-Negotiable)
- ❌ NEVER alter Supabase schemas or migrations
- ❌ NEVER remove PageMeta or structuredData from any page
- ❌ NEVER show latency counters, HFT grids, or live execution feeds — convert to "Educational Demo"
- ✅ ALWAYS use `<Link>` from react-router-dom for internal navigation (not `<a href>`)
- ✅ ALWAYS implement the E-E-A-T principle: Experience, Expertise, Authority, Trust in all copy
- ✅ ALWAYS run `npm run lint` after changes and fix all TypeScript errors before committing

## Architecture Map
```
src/
├── pages/          → Route-level pages (each needs PageMeta + unique H1)
├── components/
│   ├── home/       → Homepage sections (LazySection wrapping required)
│   ├── ui/         → Reusable primitives (Navbar, Footer, etc.)
│   └── site/       → SEO components (PageMeta, PageHero, Reveal)
├── services/       → Data layer (Supabase calls — NO MOCK DATA)
├── utils/
│   └── structuredData.ts  → JSON-LD schemas — ADD new schemas here
└── constants/
    └── branding.ts  → BRANDING object — single source of truth for name/logo
```

## Git Commit Format
```
type: description of change

Types: feat | fix | refactor | seo | perf | style | docs
Example: "seo: add forex-signals cluster keywords to Signals page meta"
```
