# Supabase Database Connection & Schema Audit Report

This document presents a comprehensive audit of the Supabase database schemas, data connections, and frontend integration pipelines for **IFXTrades**. 

---

## 1. Core Database Connections Matrix

The following table maps all database tables in the Supabase instance, their frontend connection handlers, associated actions (inserts/updates/triggers), and their connection status.

| Table Name | Schema Key Columns | Frontend File / Handler | Actions / Reactions | Status / Audited Gaps |
| :--- | :--- | :--- | :--- | :--- |
| **users** | `id`, `email`, `full_name`, `role`, `referred_by` | `AuthContext.tsx`, `apiHandlers.ts` (`getAgentStats`) | Read profile, verify referral tags. | **Active & Synced** |
| **leads** | `id`, `email`, `source`, `stage`, `score`, `is_hot`, `crm_metadata`, `last_action_at` | `NewsletterPopup.tsx`, `ExitIntentModal.tsx`, `RegistrationModal.tsx`, `LeadManager.tsx` | Captures newsletter/website leads; CRM filters and segments them. | **Active & Polished** (Now aligned to schema columns. Extra metadata stored in `crm_metadata` to prevent query failures). |
| **contact_messages** | `id`, `name`, `email`, `subject`, `message` | `crmService.ts` (`captureInquiry`) | Inserts contact forms. | **Active & Synced** |
| **products** | `id`, `name`, `price`, `description`, `strategy_details`, `risk_profile` | `productService.ts`, `ProductManager.tsx` | Marketplace catalog display; admin CRUD actions. | **Active & Synced** |
| **algo_bots** | `id`, `product_id`, `name`, `version`, `download_url` | `productService.ts` (`getAlgoBots`), `FulfillmentManager.tsx` | Linked catalog download items. | **Restored & Connected** (Recreated in DB with RLS enabled; resolves fulfillment releases). |
| **bot_licenses** | `id`, `user_id`, `algo_id`, `license_key`, `is_active`, `expires_at` | `productService.ts` (`subscribeToAlgo`), `LicenseManager.tsx` | Manages MT5 execution authorization keys. | **Restored & Connected** (Recreated in DB with RLS and indexes; resolves key deliveries). |
| **manual_payment_receipts** | `id`, `user_id`, `product_id`, `amount`, `status`, `rejection_reason` | `FulfillmentManager.tsx`, `CEOPanel.tsx` | Main payments capture table (manages Whatsapp approvals and receipts). | **Active & Synced** (Now also counts pending payments for the CEO executive panel). |
| **payment-proofs** | `id`, `user_id`, `amount`, `proof_url`, `status` | None (Legacy) | Old payment proofs registry. | **Consolidated** (Legacy table. Dashboard references redirected to `manual_payment_receipts`). |
| **sales_tracking** | `id`, `agent_id`, `user_id`, `sale_amount`, `product_id` | `FulfillmentManager.tsx`, `CEOPanel.tsx` | Logs sales associated with agents. Triggers stats calculations. | **Restored & Connected** (Recreated in DB with RLS; restores ledger inserts and revenue summaries). |
| **commissions** | `id`, `lead_id`, `agent_id`, `amount`, `percentage`, `status` | `CEOPanel.tsx`, `AgentSystem.tsx` | Financial payouts tracking. | **Active & Synced** |
| **feature_flags** | `id`, `key`, `enabled` | `CEOPanel.tsx`, `useFeatureFlag` | Zero-code live panel configuration toggles. | **Active & Synced** |
| **system_logs** | `id`, `type`, `message`, `severity` | `ErrorViewer.tsx`, `CEOPanel.tsx` | Audits critical system faults. | **Active & Synced** |
| **analytics_events** | `id`, `user_id`, `event_type`, `metadata` | `CEOPanel.tsx`, `apiHandlers.ts`, triggers | Tracks clicks, page views, and user flows. | **Active & Synced** (Triggers affiliate stats updates) |
| **notification_queue** | `id`, `recipient`, `channel`, `payload`, `status` | Admin Background Scripts | Asynchronous mailing/Whatsapp dispatches. | **Active & Synced** |
| **webinars** | `id`, `title`, `description`, `date_time`, `status`, `registration_count` | `WebinarPromo.tsx`, `WebinarManager.tsx`, `RegistrationModal.tsx` | Event scheduler and descriptions. | **Active & Synced** |
| **webinar_registrations** | `id`, `webinar_id`, `user_id`, `email`, `referred_by_code` | `RegistrationModal.tsx` | Logs attendee counts. | **Active & Synced** |
| **reviews** | `id`, `name`, `role`, `text`, `rating`, `region`, `status` | `ReviewManager.tsx`, `apiHandlers.ts` | Testimonials and geographical analytics. | **Active & Synced** |
| **user_entitlements** | `id`, `user_id`, `feature`, `active`, `expires_at` | `FulfillmentManager.tsx` | Grants feature access privileges per user. | **Active & Synced** |
| **subscriptions** | `id`, `user_id`, `product_id`, `status` | `CEOPanel.tsx` | Stripe/Razorpay active subscriptions catalog. | **Active & Synced** |

---

## 2. Resolved Connection Gaps & Leftover Connections

A thorough analysis of database logs and code files revealed critical table gaps, which have now been fully resolved:

### A. Dropped Tables Restored: `algo_bots`, `bot_licenses`, and `sales_tracking`
- **Location**: `src/services/productService.ts`, `src/modules/admin/FulfillmentManager.tsx`, `src/modules/admin/CEOPanel.tsx`.
- **Anomalies**:
  - The tables were dropped during a database cleanup migration (`20261108_database_cleanup.sql`), leaving the frontend components failing to query or insert licenses/sales data.
  - Releases of bot licenses failed because `algo_bots` and `bot_licenses` were missing.
  - Recording of sales commissions failed because `sales_tracking` was missing.
- **Resolutions**:
  - Recreated all three tables in the database with their original columns, foreign key constraints, indexes, and Row Level Security (RLS) policies.
  - Re-enabled real-time listeners for updates.

### B. Consolidated Payment proofs: `payment_proofs` -> `manual_payment_receipts`
- **Location**: `src/modules/admin/CEOPanel.tsx` line 101.
- **Anomaly**: The executive dashboard counted pending payments by querying a legacy, dropped table (`payment_proofs`).
- **Resolution**: Re-wired `CEOPanel.tsx` to query `manual_payment_receipts` instead. This consolidates pending payment alerts with the active Whatsapp receipt clearing console.

### C. Re-aligned Subscriptions Query
- **Location**: `src/modules/admin/CEOPanel.tsx` line 104.
- **Anomaly**: Prior audits suggested querying the non-existent `bot_licenses` table here.
- **Resolution**: Preserved the query to `subscriptions` table, as the table `subscriptions` actually exists in the database and manages user subscriptions.

---

## 3. CRM Lead Ingestion & Segmentation Alignment

We resolved two critical schema mismatches that were causing user lead captures to throw silent Postgres errors and fail:

### A. Newsletter Ingress Popup (`NewsletterPopup.tsx`)
- **Bug**: The submission handler was inserting `subject`, `message`, and `metadata` into the `leads` table. None of these columns exist in the database table schema. It also set the stage to `'NEWSLETTER'`, which is not a valid enum value for the `lead_stage` type `[ 'CONVERTED', 'HIGH_INTENT', 'INTERESTED', 'NEW', 'PAYMENT_PENDING' ]`.
- **Fix**: Realigned the payload:
  - Email addresses are lowercased.
  - Stage is set to `'NEW'` (valid enum label).
  - Source is set to `'newsletter'`.
  - Non-existent fields (`subject`, `message`, and `metadata`) are stored within the `crm_metadata` (jsonb) column.

### B. Exit Intent Modal (`ExitIntentModal.tsx`)
- **Bug**: The exit intent form was inserting raw email values and had no stage configuration.
- **Fix**: Realigned the payload to use lowercased emails, stage `'NEW'`, source `'exit_intent'`, and store contextual metadata in `crm_metadata`.

### C. Webinar Registration Modal (`RegistrationModal.tsx`)
- **Bug**: The upsert logic inserted non-existent columns (`name`, `status`, and `metadata`).
- **Fix**: Realigned the payload to match the `leads` schema:
  - Email is lowercased.
  - Stage is explicitly set to `'INTERESTED'` (valid enum label).
  - Custom attributes (`name`, `phone`, `country`, `webinar_id`, `webinar_title`) are nested within the `crm_metadata` column.

### D. CRM Segmentation Matrix (`LeadManager.tsx`)
- The segmentation filters are fully synced:
  - **Newsletter Leads**: Captures records where `source = 'newsletter'` or `stage = 'NEWSLETTER'` (accommodates legacy data).
  - **Client Leads**: Captures records where `source !== 'newsletter'` and `stage !== 'NEWSLETTER'`.
