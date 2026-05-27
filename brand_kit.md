# IFX Trades: Institutional Master Brand Kit & Design System (v6.0 - Ice-Blue Diamond Edition)

This master document defines the precise mathematical visual schema, typography parameters, CSS utility formulas, tone of voice guidelines, and technical ECN dictionary for the **IFX Trades** brand. 

It is designed to serve as a complete, deterministic source of truth for human engineers, UI designers, and AI models to construct perfectly aligned brand assets, pages, or interface components.

---

## 🎨 1. THE CHROMATIC PALETTE (Ice-Blue Diamond Scheme)

We employ a premium **Midnight Space Base** with high-end **Swiss Ice-Blue Diamond & Platinum Highlights**. All retail green/yellow schemas and consumer pink/fuchsia colors have been systematically purged to uphold maximum forex institutional trust.

### 1.1 Core Colors & Surfaces
| Token Name | CSS Variable | Hex Code | HSL / RGBA Value | Operational Context |
| :--- | :--- | :--- | :--- | :--- |
| **Midnight Base** | `--bg-base` | `#010203` | `hsl(210, 60%, 1%)` | Primary page backdrop, ECN canvas |
| **Abyss Raised** | `--bg-raised` | `#040507` | `hsl(215, 45%, 3%)` | Sub-sections, section separation grids |
| **System Panel** | `--bg-panel` | `#0A0A0A` | `hsl(0, 0%, 4%)` | Dialog overlays, modular workspace panels |
| **Metallic Card** | `--bg-card` | `#0E1428` | `hsl(225, 48%, 10%)` | Bento grids, performance cards |
| **Glacier Edge** | `--border-default`| — | `rgba(0, 163, 255, 0.06)`| Default mechanical border |
| **Ice-Blue Glow** | `--border-glow` | — | `rgba(0, 163, 255, 0.3)` | Active component focus outlines |

### 1.2 Ice-Blue & Platinum Highlights
*   **Electric Ice-Blue (Primary)**: `#00A3FF`
    *   *Role*: Focus nodes, active status ticks, primary ECN actions, ECN order stream tracking.
    *   *Tailwind Override*: Globally mapped to v4 `emerald-500` to automatically swap green to Ice-Blue.
*   **Diamond-Cyan (Accent/Premium)**: `#00E5FF` / `#60CDFF`
    *   *Role*: High-tier highlights, premium masterclass badges, bespoke code desk signals.
*   **Soft Purple/Violet (Secondary)**: `#8B5CF6`
    *   *Role*: Secondary systems, indicators, quantitative execution highlights.
*   **Space Fuchsia/Pink**: **PURGED** - Completely banned from all public booking paths to protect forex institutional authority.

---

## 💎 2. SHIFTING ICE-BLUE & METALLIC GRADIENTS

Our gradients simulate dynamic light refraction across dark metallic surfaces, reminiscent of Google Antigravity, Cloud Gemini pages, and premium Swiss banking interfaces.

### 2.1 Shifting Ice-Blue Spectrum (`.gemini-shading`)
A continuous multi-step looping gradient with smooth transition curves:
```css
linear-gradient(135deg, 
  #8B5CF6 0%,    /* Deep Violet */
  #00A3FF 20%,   /* Brilliant Ice Blue */
  #06B6D4 40%,   /* Cyan */
  #00E5FF 60%,   /* Diamond-Cyan */
  #3B82F6 80%,   /* Sapphire Blue */
  #8B5CF6 100%   /* Seamless Loop back */
);
background-size: 400% 400%;
animation: gemini-gradient 12s cubic-bezier(0.4, 0, 0.2, 1) infinite;
```

### 2.2 Hero Text Gradient (`.text-gradient-hero`)
Used to paint large, eye-catching institutional typography elements:
```css
linear-gradient(135deg, 
  #00A3FF 0%, 
  #00E5FF 50%, 
  #8B5CF6 100%
);
```

### 2.3 Specular Specularspec Double-Border Card System (`.glass-card`)
Provides structure with absolute depth, using a high-precision inner specular highlight and outer shadow profile:
```css
background: rgba(14, 20, 40, 0.65);
backdrop-filter: blur(24px);
border: 1px solid rgba(255, 255, 255, 0.07);
box-shadow: 
  inset 0 1px 0 0 rgba(255, 255, 255, 0.03), 
  inset 0 -1px 0 0 rgba(0, 0, 0, 0.4),
  0 50px 100px -20px rgba(0, 0, 0, 0.9);
```

---

## ✍️ 3. TYPOGRAPHY & COPY HIERARCHY

We utilize clean geometric sans-serif shapes paired with elegant traditional serif expressions to represent absolute discipline and precision.

*   **Primary Typeface**: `Plus Jakarta Sans` / `Inter` (sans-serif)
    *   *Attributes*: Tight letter-spacing (`tracking-tight` or `tracking-[-0.04em]`), solid line-height (`leading-[0.88]` for headings, `leading-relaxed` for prose).
*   **Technical / Data Font**: `IBM Plex Mono` (monospace)
    *   *Attributes*: High tracking (`tracking-[0.25em]`), tiny sizes (`text-[10px]`), bold upper case weights.
*   **Editorial Accent Font**: `DM Serif Display` (serif, italic)
    *   *Usage*: Select words in headlines (e.g. "*Institutional FX*") to break visual monotony and build a prestigious feel.

---

## 🏛️ 4. TONE OF VOICE & B2B PROSE PARADIGMS

IFX Trades speaks to **Senior IT Directors, Hedge Fund Allocators, Broker Executives, and Proprietary Developers**. We reject all retail "get rich quick" marketing fluff.

### 4.1 Core Prose Directives
1.  **Facts-First Rigor**: Highlight execution latency, data compliance, and timestamped audit logs. Do not use generic buzzwords ("seamless," "magical," "revolutionize").
2.  **No AI Terminology**: Purge all retail AI template jargon. Shift "smart robot assistants" to **"disciplined systematic algorithms,"** and "AI-powered prediction" to **"quantitative ATR volatility and regime classification models."**
3.  **Concise Front-Tier, Deep Inner-Tier**: Homepage and top-level pages must be extremely brief, punchy, and structured. Let whitespace breathe. Detailed explanations should reside inside structured bento grid expandable nodes, data sheets, or documentation directories.

### 4.2 Copy-fitting Transformations (Before vs. After)
*   *Before (Generic retail)*: "Our amazing smart AI robot automatically trades gold for you with zero hassle and instant profits!"
*   *After (Institutional B2B)*: "We compile high-fidelity systematic algorithms optimized to track volatility regimes in XAUUSD. Deploy compiled EX5 binary files directly with hardcoded trailing stop safeguards."

---

## 🧭 5. PHYSICAL INFRASTRUCTURE & LATENCY SPECS

To build absolute trust with industry veterans, we anchor our technical specs in physical hosting reality:
*   **Primary Execution Desks**: Cross-connected directly inside **Equinix NY4 (Secaucus, New Jersey)**, **Equinix LD4 (Slough, London)**, and **Equinix TY3 (Tokyo)**.
*   **Network Latency Profile**: Averaging **<1.2ms** average network latency to ECN liquidity provider matching engines.
*   **Audit Protocol**: 100% Client Sovereignty. No client fund custody. Handover is executed strictly via secure, compiled binaries (MT5/TradingView) or clean Python/FIX API frameworks.
