---
name: IT Head Workflow
description: Qualitative overview of the IFX Trades business and UI/UX best practices.
---

# IFX Trades: IT Head Perspective

## 1. Business Overview
IFX Trades is Asia's leading institutional forex intelligence and education platform. Our mission is to provide retail traders with quantitative research, automated execution logic (algo bots), and premium education (Gold Algo Masterclass).
- **Core Product**: Education & Intelligence (Not a broker).
- **Target Audience**: High-net-worth individuals, quantitative analysts, and serious retail traders transitioning to institutional methodologies.
- **Tone**: Sovereign, elite, hyper-professional, institutional, zero-fluff.

## 2. SEO & Market Lead Strategy
To maintain the #1 position in SEO and market authority:
- Prioritize semantic HTML5 (`<article>`, `<section>`, `<header>`, `<footer>`).
- Ensure load speeds are under 1.5s utilizing `React.lazy` and Suspense.
- Implement structured schema data for all pages (e.g., FAQ, Course, Organization schemas).
- Always ensure zero latency in perceived UI. Data should be mocked or cached if the primary database is scaling or recovering.

## 3. UI/UX "Realistic" Upgrade Protocol
When upgrading components to our realistic standard:
1. **Glassmorphism**: Use sophisticated backdrop filters instead of solid opacity (e.g., `bg-white/5 backdrop-blur-xl border border-white/10`).
2. **Typography**: Utilize highly-legible sans-serifs, tight letter spacing for headings (`tracking-tighter`), and wide spacing for labels (`tracking-widest`).
3. **Color Palette**: Pitch black (`#020202`) with strategic neon accents (Emerald, Cyan, Amber) used sparingly for high intent actions. No flat bright colors.
4. **Micro-Animations**: Employ Framer Motion (`motion/react`) for subtle entry effects, hovered scaling (`hover:scale-[1.02]`), and continuous ambient movement.
5. **Glow Emulation**: Box-shadows should mimic physical LED diffusion (`shadow-[0_0_30px_rgba(16,185,129,0.15)]`).

## 4. Full Audit Workflow
Whenever executing a systematic upgrade across the platform:
- **Phase 1: DB Resilience**: Guarantee no blank data states (fallback arrays).
- **Phase 2: Typographical Hierarchy**: Standardize all fonts to the new design system.
- **Phase 3: Component Glazing**: Apply glass layers and gradients.
- **Phase 4: Interaction Pass**: Bind all missing onClick elements.

Always ask questions to the agent validating if the UI reflects "Top 1% Financial Firm".
