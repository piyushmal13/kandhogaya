# 🏛️ IFX TRADES — SYSTEM BLUEPRINT v1.0
> **Sovereign Truth Document** — Update after EVERY session. This is the AI's memory.
> Last updated: 2026-05-02 | Stack: React 19 + Vite 6 + Tailwind 4 + Supabase + Express

---

## 🗂️ PROJECT IDENTITY

| Property | Value |
|---|---|
| **Brand** | IFX Trades |
| **Tagline** | Asia's #1 Institutional Forex Intelligence & Education Platform |
| **Positioning** | NOT a broker. Pure education & research desk. |
| **Primary Markets** | India, UAE (Dubai), Singapore |
| **Tech Stack** | React 19, Vite 6, Tailwind 4, Supabase (PostgreSQL), Express, Motion/React, Recharts, GSAP, Lucide |
| **Domain** | www.ifxtrades.com |
| **Deployment** | Vercel (frontend) + Express server |

---

## 📁 CRITICAL FILES

- Hero: `src/components/home/FortressHero.tsx` — main landing hero
- CSS: `src/index.css` — master design system
- Supabase: `src/lib/supabase.ts` — client (health polling DISABLED)
- API: `src/services/apiHandlers.ts` — all DB queries
- Routes: `src/App.tsx`

---

## 🗄️ SUPABASE TABLES

leads, consultations, webinars, webinar_registrations, products, bot_licenses,
content_posts, courses, lessons, user_access, signals, signal_subscriptions,
market_data, performance_results, sales_tracking, payment_proofs, contact_messages

---

## 🚫 CRITICAL BUSINESS RULES

1. IFX Trades is NOT a broker — no deposit/execution language
2. NEVER modify existing Supabase migrations — ADD only
3. No retail red flags (latency counters, HFT grids, live PnL)
4. Supabase health polling setInterval is DISABLED — do not restore
5. No select(*) on high-traffic tables — use specific column selects
6. All motion easing: cubic-bezier(0.4, 0, 0.2, 1) — NO spring bounces in hero/nav

---

## 🎨 DESIGN TOKENS

- Background: #010203 (deep void)
- Primary: #10B981 (emerald)
- Secondary: #00FFA3 (neon mint)
- Accent: #06B6D4 (cyan)
- Gold: #D4AF37
- Font headings: Inter + DM Serif Display
- Font data: IBM Plex Mono

---

## 🔄 GIT EVOLUTION SUMMARY

Phase 1: Retail → Imperial Research theme
Phase 2: AnimatedAlgoCube, custom cursor, candlesticks
Phase 3: Webinar routing, blog/marketplace hardening
Phase 4: Full lint/TS/a11y sweep
Phase 5: Video hero, performance-first luxury, system_blueprint created
Phase 6 (current): Infrastructure stabilization, Supabase MCP tool connectivity restored (docs feature bypassed)
