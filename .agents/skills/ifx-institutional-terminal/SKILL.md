---
name: ifx-institutional-terminal
description: "Core architectural and design standards for the IFX Trades Institutional Terminal. Use when modifying UI components, data services, or administrative modules within the kandhogaya repository. Enforces 'Royale Noir' aesthetics, E-E-A-T compliance, and strict Supabase data patterns."
metadata:
  author: Principal Systems Architect
  version: "1.0.0"
---

# IFX Institutional Terminal Standards

## Executive Directives

**1. Zero Database Alteration**
Strictly forbidden from altering Supabase schemas, migrations, or existing dummy data configurations unless explicitly requested for infrastructure stabilization. All frontend logic must map to the existing production schema.

**2. Royale Noir Aesthetic**
Implement high-fidelity, premium designs.
- **Colors**: HSL-tailored dark modes, emerald-500 highlights, glassmorphism (backdrop-blur-3xl).
- **Typography**: Inter/Roboto Mono for technical data, serif italics for terminal headers.
- **Micro-animations**: Subtle `motion` (framer-motion) pulses, slides, and scale effects.
- **Institutional Clarity**: Use "Dashboard" instead of "Console", "Terminal" instead of "Site", "Node" instead of "Page".

**3. E-E-A-T & Institutional Hardening**
- **No Broker Red Flags**: Remove retail-focused metrics (latency counters, HFT grids).
- **Educational Pulse**: If data is missing, provide high-fidelity "Pulse" placeholders that reflect institutional liquidity rather than generic "No data" states.
- **Sovereign Data**: Always prefer direct Supabase client interactions over local state or mock files.

## Component Architecture

### 1. Dashboard Layout
All institutional pages must be wrapped in `DashboardLayout` for persistent sidebar navigation and mobile responsiveness.

### 2. Data Pulse Pattern
Use the `useDataPulse` hook or `useQuery` with `staleTime` (e.g., 30s) for high-frequency data streams. Avoid redundant egress by sharing state through context providers where applicable.

### 3. Administrative Modules
Admin tools must follow the "Fleet" pattern:
- **Discovery**: Real-time listing of records from Supabase.
- **Orchestration**: Direct control via `supabase` client (e.g., updating leads, fulfilling payments).
- **Telemetry**: Clear sync status indicators (`Protocol Sync`, `Node Online`).

## Code Hygiene & TypeScript

- **Strict Typing**: No `any` in production modules. Map Supabase types to local interfaces in `src/types/index.ts`.
- **Zero CLS**: Use skeleton loaders and fixed-height containers for data-heavy feeds (e.g., `SignalFeed`).
- **Performance**: Use `useMemo` and `useCallback` for expensive calculations or callback props to prevent unnecessary re-renders in the high-density terminal.

## Troubleshooting

- **ReferenceError**: Check for orphan imports or mismatched API mappings in `src/core/dataMapper.ts`.
- **Schema Drift**: If a query fails with 406/400, verify the column names against the production Supabase project via MCP `list_tables`.
- **Hydration Mismatch**: Ensure `sessionReady` is checked before rendering auth-dependent components.
