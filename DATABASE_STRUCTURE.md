# Sovereign Database Architecture: IFX Trades (v4.0)
> [!IMPORTANT]
> This document defines the high-fidelity database schema for IFX Trades. All modifications must be executed via controlled migrations. Zero-alteration policy in effect for production environments.

## Overview
The IFX Trades ecosystem is powered by a high-performance, resilient PostgreSQL database (Supabase). The architecture is designed for millisecond-precision tracking of institutional research, algorithmic execution, and complex multi-tier affiliate attribution.

---

## 1. Core Identity & Access Control
### `users`
Core profile and authorization nexus. Synchronized with `auth.users`.
- **id** (uuid): Primary key (FK to `auth.users`).
- **email** (text): Verified institutional email.
- **full_name** (text): Public profile name.
- **avatar_url** (text): High-resolution profile anchor.
- **role** (text): Access tier (`user`, `pro`, `elite`, `admin`).
- **referred_by** (uuid): Direct acquisition attribution link.

---

## 2. Institutional Research & Intelligence
### `content_posts`
The engine behind the **Sovereign Intelligence Desk**.
- **title** (text): Report headline.
- **slug** (text): SEO-optimized URI string.
- **content** (text): Raw markdown/HTML report data.
- **category** (text): Sector (`Macro`, `Technical`, `Quantitative`, `Geopolitical`).
- **metadata** (jsonb): Analyst profiles, reading time, and OpenGraph structured data.
- **author_id** (uuid): Lead analyst identification.

---

## 3. High-Fidelity Market Engine
### `market_data`
Real-time exchange heartbeat for the user terminal.
- **symbol** (text): Asset identifier (e.g., `XAUUSD`, `EURUSD`).
- **price** (text): Current market quote.
- **change** (text): 24h volatility delta.
- **up** (boolean): Trend directionality bit.

### `signals`
Systemic alpha alerts for Pro/Elite tiers.
- **asset** (text): Target instrument.
- **direction** (text): `BUY` or `SELL`.
- **status** (text): `active`, `closed`, `cancelled`.
- **entry_price** / **stop_loss** / **take_profit** (numeric): Technical execution nodes.

---

## 4. Algorithmic Execution Hub
### `products`
The quantitative strategy repository (formerly `algorithms`).
- **performance_data** (jsonb): Historical drawdown, CAGR, and win-rate arrays for terminal charting.
- **strategy_details** (text): Technical logic summary.
- **risk_profile** (text): `Conservative`, `Aggressive`, `Institutional`.
- **q_and_a** (jsonb): Pre-flight technical clearance data.

### `bot_licenses`
Zero-fail operational clearance for the execution terminal.
- **license_key** (text): Unique encrypted execution signature.
- **is_active** (boolean): Real-time heartbeat validation state.
- **account_id** (text): MT4/MT5 account hard-link.
- **last_validated_at** (timestamptz): Heartbeat synchronization anchor.

---

## 5. Masterclass & Event Orchestration
### `webinars`
Corporate events and liquidity masterclasses.
- **date_time** (timestamptz): Global session schedule.
- **sponsor_logos** (jsonb): High-fidelity partner assets (Binance, MT4).
- **registration_count** (integer): Counter for "Seats Remaining" urgency logic.

### `webinar_sponsors`
Corporate partnership management layer.
- **tier** (text): `Headline` or `Partner`.
- **logo_url** (text): Alpha-transparent SVG/PNG path.

---

## 6. Lead Acquisition & Affiliate Matrix
### `leads`
The Lead Acquisition Matrix (CRM).
- **stage** (lead_stage): `NEW`, `INTERESTED`, `HIGH_INTENT`, `PAYMENT_PENDING`, `CONVERTED`.
- **score** (integer): Behavioral interest magnitude.
- **conversion_probability** (integer): Data-driven analytics metric.

### `agents`
Affiliate fleet management hub.
- **code** (text): Unique acquisition identifier (referral code).
- **performance_score** (numeric): Conversion efficiency rank.
- **commission** (numeric): Real-time revenue share rate.

---

## 7. Operational Diagnostics & Logs
### `user_events`
High-resolution behavioral diagnostics.
- **event_type** (text): `PAGE_VIEW`, `LICENSE_VALIDATION`, `UPGRADE_INTENT`.
- **priority** (event_priority): `LOW` to `CRITICAL`.

### `system_logs`
Operational heartbeat and error auditing.
- **severity** (text): `info`, `warning`, `critical`.
- **metadata** (jsonb): Full stack trace or diagnostic context.

---

## Relationship Integrity (Logic Layer)
- **Attribute-First**: All acquisition flows (`leads`, `manual_payment_receipts`, `webinar_registrations`) are hard-linked to an **agent_code** for zero-leak revenue attribution.
- **Hierarchy of Access**: `users` -> `subscriptions` -> `bot_licenses` ensures sub-millisecond access revocation upon subscription expiration.
- **Data Preservation**: Soft-deletes are simulated via `status` and `active` flags in all critical financial tables.

---
**Document Status**: PRODUCTION READY (v4.0.0)  
**Last Verified**: 2026-04-03  
**Custodian**: Antigravity Principal Architect
