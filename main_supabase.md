# IFX Trades — Supabase Database Architecture Guide

This document is the absolute source of truth for the Supabase database and storage configuration for the IFX Trades Institutional platform. It is designed to enable future developers or AI agents to immediately understand, manage, and scale the database setup.

---

## 1. Architectural Overview & Security Design

The IFX Trades platform integrates with Supabase to provide user authentication, persistent CRM tracking, partner/affiliate rewards, webinar event management, and candidate sourcing. 

The integration leverages key Postgres security capabilities:
1. **Strict Row-Level Security (RLS)**: Enabled on all tables exposed to the public schema to verify that users can only select or write their own records.
2. **Privilege Isolation (Private Schema Triggers)**: Automation triggers that execute with elevated owner privileges (`SECURITY DEFINER`) are placed inside a dedicated `private` schema. This schema is inaccessible to client APIs (`anon` and `authenticated`), mitigating any SQL injection or trigger hijacking attempts.
3. **Strict Function Contexts (`SECURITY INVOKER`)**: Functions in the `public` schema callable by the client run strictly under the caller's context to enforce table-level RLS policies.
4. **Hardened Storage listing**: Storage buckets containing private client data (like candidates' resumes or webinar visual materials) restrict the list files (`SELECT`) API to administrators only, while serving files directly via their obfuscated public URLs.

---


## 2. Table Registry & Schemas

### private.api_audit_logs
- **Purpose**: Internal audit log registers for key-based API calls.
- **Schema**:
  - `id` (`UUID` [Not Null] (default: `gen_random_uuid()`))
  - `key_id` (`UUID` [Not Null])
  - `client_ip` (`INET` [Nullable])
  - `endpoint` (`CHARACTER VARYING` [Not Null])
  - `status_code` (`INTEGER` [Not Null])
  - `request_timestamp` (`TIMESTAMP WITH TIME ZONE` [Not Null] (default: `timezone('utc'::text, now())`))
- **RLS Policies**:
  - *Internal Private Table*: Direct API keys log pipeline. RLS disabled (held in private system schema only).

---

### public.affiliate_codes
- **Purpose**: Stores unique referral codes assigned to active partner/affiliate users.
- **Schema**:
  - `id` (`UUID` [Not Null] (default: `gen_random_uuid()`))
  - `user_id` (`UUID` [Not Null])
  - `code` (`TEXT` [Not Null])
  - `total_clicks` (`INTEGER` [Nullable] (default: `0`))
  - `total_registrations` (`INTEGER` [Nullable] (default: `0`))
  - `created_at` (`TIMESTAMP WITH TIME ZONE` [Nullable] (default: `now()`))
  - `updated_at` (`TIMESTAMP WITH TIME ZONE` [Nullable] (default: `now()`))
  - `commission_rate` (`NUMERIC` [Nullable] (default: `10.00`))
- **RLS Policies**:
  - `"Users can view their own affiliate codes"`: `FOR SELECT TO authenticated USING (auth.uid() = user_id)`
  - `"Users can create their own affiliate codes"`: `FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id)`
  - `"Admins have full access to affiliate_codes"`: `FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))`

---

### public.analytics_events
- **Purpose**: Tracks user telemetry events (clicks, signups, referrals) for analytics.
- **Schema**:
  - `id` (`UUID` [Not Null] (default: `gen_random_uuid()`))
  - `user_id` (`UUID` [Nullable])
  - `event_type` (`TEXT` [Not Null])
  - `metadata` (`JSONB` [Nullable] (default: `'{}'::jsonb`))
  - `created_at` (`TIMESTAMP WITH TIME ZONE` [Nullable] (default: `now()`))
- **Triggers**:
  - `trigger_increment_affiliate_stats`: Executes `private.increment_affiliate_stats()` to track affiliate events.
- **RLS Policies**:
  - `"ana_select"`: `FOR SELECT TO authenticated USING (auth.uid() = user_id)`
  - `"ana_insert"`, `"Users can insert analytics"`: `FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id)`
  - `"ana_update"`: `FOR UPDATE TO authenticated USING (auth.uid() = user_id)`
  - `"ana_delete"`: `FOR DELETE TO authenticated USING (auth.uid() = user_id)`
  - `"Admins can see analytics"`: `FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))`
  - `"admin_all_access"`: `FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))`

---

### public.api_keys
- **Purpose**: Holds API key configurations for third-party institutional access keys.
- **Schema**:
  - `id` (`UUID` [Not Null] (default: `gen_random_uuid()`))
  - `user_id` (`UUID` [Not Null])
  - `key_name` (`CHARACTER VARYING` [Not Null])
  - `hashed_key` (`CHARACTER VARYING` [Not Null])
  - `scopes` (`ARRAY` [Nullable] (default: `ARRAY['signals:read'::text]`))
  - `is_active` (`BOOLEAN` [Nullable] (default: `true`))
  - `created_at` (`TIMESTAMP WITH TIME ZONE` [Not Null] (default: `timezone('utc'::text, now())`))
  - `expires_at` (`TIMESTAMP WITH TIME ZONE` [Not Null])
- **RLS Policies**:
  - `"Users manage own API keys"`: `FOR ALL TO authenticated USING (user_id = auth.uid())`

---

### public.banners
- **Purpose**: Persists advertisement banners rendered on webinars/homepage placements.
- **Schema**:
  - `id` (`UUID` [Not Null] (default: `gen_random_uuid()`))
  - `title` (`TEXT` [Not Null])
  - `description` (`TEXT` [Nullable])
  - `image_url` (`TEXT` [Not Null])
  - `link_url` (`TEXT` [Nullable])
  - `is_active` (`BOOLEAN` [Nullable] (default: `true`))
  - `placement` (`TEXT` [Nullable] (default: `'webinar'::text`))
  - `priority` (`INTEGER` [Nullable] (default: `0`))
  - `metadata` (`JSONB` [Nullable] (default: `'{}'::jsonb`))
  - `created_at` (`TIMESTAMP WITH TIME ZONE` [Nullable] (default: `now()`))
  - `updated_at` (`TIMESTAMP WITH TIME ZONE` [Nullable] (default: `now()`))
- **RLS Policies**:
  - `"Allow public read access to active banners"`: `FOR SELECT TO public USING (is_active = true)`
  - `"admin_all_banners"`: `FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'superadmin')))`

---

### public.commissions
- **Purpose**: Records referral commission balances and payouts details.
- **Schema**:
  - `id` (`UUID` [Not Null] (default: `gen_random_uuid()`))
  - `lead_id` (`UUID` [Nullable])
  - `agent_id` (`UUID` [Nullable])
  - `amount` (`NUMERIC` [Not Null])
  - `percentage` (`NUMERIC` [Nullable])
  - `source` (`TEXT` [Not Null])
  - `product_id` (`TEXT` [Nullable])
  - `status` (`USER-DEFINED` [Nullable] (default: `'PENDING'::commission_status`))
  - `payout_id` (`UUID` [Nullable])
  - `created_at` (`TIMESTAMP WITH TIME ZONE` [Nullable] (default: `now()`))
- **RLS Policies**:
  - Row Level Security is enabled, but no active public-schema policies are defined (restricting access strictly to administrative service role access).

---

### public.consultations
- **Purpose**: Operational base table.
- **Schema**:
  - `id` (`UUID` [Not Null] (default: `gen_random_uuid()`))
  - `name` (`TEXT` [Not Null])
  - `email` (`TEXT` [Not Null])
  - `phone` (`TEXT` [Nullable])
  - `company` (`TEXT` [Nullable])
  - `strategy` (`TEXT` [Not Null])
  - `platform` (`TEXT` [Nullable] (default: `'MT5'::text`))
  - `budget` (`TEXT` [Nullable])
  - `status` (`TEXT` [Nullable] (default: `'pending'::text`))
  - `notes` (`TEXT` [Nullable])
  - `created_at` (`TIMESTAMP WITH TIME ZONE` [Nullable] (default: `now()`))
  - `updated_at` (`TIMESTAMP WITH TIME ZONE` [Nullable] (default: `now()`))
- **Triggers**:
  - `set_consultations_updated_at`: Executes `BEFORE UPDATE` running `public.update_consultations_updated_at()` to update `updated_at`.
- **RLS Policies**:
  - `"anon_can_insert"`: `FOR INSERT TO anon WITH CHECK (id IS NOT NULL)`

---

### public.contact_messages
- **Purpose**: Operational base table.
- **Schema**:
  - `id` (`UUID` [Not Null] (default: `gen_random_uuid()`))
  - `name` (`TEXT` [Nullable])
  - `email` (`TEXT` [Nullable])
  - `subject` (`TEXT` [Nullable])
  - `message` (`TEXT` [Nullable])
  - `created_at` (`TIMESTAMP WITH TIME ZONE` [Nullable] (default: `now()`))
- **RLS Policies**:
  - `"public_insert_contact_messages"`: `FOR INSERT TO public WITH CHECK (id IS NOT NULL)`
  - `"admin_read_contact_messages"`: `FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'superadmin')))`

---

### public.content_categories
- **Purpose**: Operational base table.
- **Schema**:
  - `id` (`UUID` [Not Null] (default: `gen_random_uuid()`))
  - `name` (`TEXT` [Not Null])
  - `slug` (`TEXT` [Not Null])
- **RLS Policies**:
  - `"Allow public SELECT on content_categories"`: `FOR SELECT TO public USING (true)`
  - `"admin_all_access"`: `FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))`

---

### public.content_posts
- **Purpose**: Operational base table.
- **Schema**:
  - `id` (`UUID` [Not Null] (default: `gen_random_uuid()`))
  - `title` (`TEXT` [Not Null])
  - `slug` (`TEXT` [Not Null])
  - `content` (`TEXT` [Not Null])
  - `image_url` (`TEXT` [Nullable])
  - `category` (`TEXT` [Nullable])
  - `status` (`TEXT` [Nullable] (default: `'published'::text`))
  - `created_at` (`TIMESTAMP WITH TIME ZONE` [Nullable] (default: `now()`))
  - `content_type` (`TEXT` [Not Null] (default: `'blog'::text`))
  - `body` (`TEXT` [Nullable])
  - `featured_image` (`TEXT` [Nullable])
  - `author_id` (`UUID` [Nullable])
  - `metadata` (`JSONB` [Nullable] (default: `'{}'::jsonb`))
  - `author_bio` (`TEXT` [Nullable])
- **RLS Policies**:
  - `"public_read_insights_atomic"`: `FOR SELECT TO public USING (true)`
  - `"admin_all_access"`: `FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))`

---

### public.faqs
- **Purpose**: Holds Frequently Asked Questions displayed on the support portal.
- **Schema**:
  - `id` (`UUID` [Not Null] (default: `gen_random_uuid()`))
  - `question` (`TEXT` [Not Null])
  - `answer` (`TEXT` [Not Null])
  - `category` (`TEXT` [Nullable] (default: `'General'::text`))
  - `priority` (`INTEGER` [Nullable] (default: `0`))
  - `is_active` (`BOOLEAN` [Nullable] (default: `true`))
  - `created_at` (`TIMESTAMP WITH TIME ZONE` [Nullable] (default: `now()`))
  - `updated_at` (`TIMESTAMP WITH TIME ZONE` [Nullable] (default: `now()`))
- **RLS Policies**:
  - `"Public Read Access"`: `FOR SELECT TO anon, authenticated USING (true)`
  - `"Admin All Access"`: `FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))`

---

### public.feature_flags
- **Purpose**: Feature toggles for managing platform capabilities.
- **Schema**:
  - `id` (`UUID` [Not Null] (default: `gen_random_uuid()`))
  - `key` (`TEXT` [Not Null])
  - `enabled` (`BOOLEAN` [Nullable] (default: `true`))
  - `created_at` (`TIMESTAMP WITH TIME ZONE` [Nullable] (default: `now()`))
- **RLS Policies**:
  - `"Allow public SELECT on feature_flags"`: `FOR SELECT TO public USING (true)`

---

### public.hiring_applications
- **Purpose**: Stores CV details and cover letters submitted by candidates.
- **Schema**:
  - `id` (`UUID` [Not Null] (default: `gen_random_uuid()`))
  - `position_id` (`UUID` [Nullable])
  - `full_name` (`TEXT` [Not Null])
  - `email` (`TEXT` [Not Null])
  - `phone` (`TEXT` [Nullable])
  - `resume_url` (`TEXT` [Not Null])
  - `portfolio_url` (`TEXT` [Nullable])
  - `cover_letter` (`TEXT` [Nullable])
  - `metadata` (`JSONB` [Not Null] (default: `'{}'::jsonb`))
  - `created_at` (`TIMESTAMP WITH TIME ZONE` [Not Null] (default: `now()`))
- **RLS Policies**:
  - `"Public submit applications"`: `FOR INSERT TO anon, authenticated WITH CHECK (position_id IS NOT NULL AND length(trim(full_name)) > 0 AND length(trim(email)) > 0 AND length(trim(resume_url)) > 0)`
  - `"Admins view applications"`: `FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))`

---

### public.hiring_positions
- **Purpose**: List open internal and B2B broker talent job opportunities.
- **Schema**:
  - `id` (`UUID` [Not Null] (default: `gen_random_uuid()`))
  - `title` (`TEXT` [Not Null])
  - `department` (`TEXT` [Not Null])
  - `description` (`TEXT` [Not Null])
  - `requirements` (`ARRAY` [Not Null] (default: `'{}'::text[]`))
  - `is_active` (`BOOLEAN` [Nullable] (default: `true`))
  - `type` (`TEXT` [Not Null])
  - `location` (`TEXT` [Nullable] (default: `'Remote'::text`))
  - `created_at` (`TIMESTAMP WITH TIME ZONE` [Not Null] (default: `now()`))
- **RLS Policies**:
  - `"Public view active positions"`: `FOR SELECT TO anon, authenticated USING (is_active = true)`
  - `"Admins manage positions"`: `FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))`

---

### public.leads
- **Purpose**: Persists prospective lead metrics, interaction scores, and stage details for CRM routing.
- **Schema**:
  - `id` (`UUID` [Not Null] (default: `gen_random_uuid()`))
  - `email` (`TEXT` [Not Null])
  - `source` (`TEXT` [Nullable])
  - `created_at` (`TIMESTAMP WITH TIME ZONE` [Nullable] (default: `now()`))
  - `stage` (`USER-DEFINED` [Nullable] (default: `'NEW'::lead_stage`))
  - `score` (`INTEGER` [Nullable] (default: `0`))
  - `is_hot` (`BOOLEAN` [Nullable] (default: `false`))
  - `last_action_at` (`TIMESTAMP WITH TIME ZONE` [Nullable] (default: `now()`))
  - `crm_metadata` (`JSONB` [Nullable] (default: `'{}'::jsonb`))
  - `assigned_to` (`UUID` [Nullable])
  - `urgency_triggered_at` (`TIMESTAMP WITH TIME ZONE` [Nullable])
  - `reengagement_triggered_at` (`TIMESTAMP WITH TIME ZONE` [Nullable])
  - `conversion_probability` (`INTEGER` [Nullable] (default: `0`))
  - `priority_tag` (`TEXT` [Nullable])
  - `referred_by_code` (`TEXT` [Nullable])
- **Triggers**:
  - `lead_routing_trigger`: Runs `BEFORE INSERT OR UPDATE` executing `private.advanced_crm_lead_routing()` to compute CRM scores.
- **RLS Policies**:
  - `"public_insert_leads"`: `FOR INSERT TO public WITH CHECK (id IS NOT NULL)`
  - `"admin_all_leads"`: `FOR ALL TO authenticated USING (auth.jwt()->>'role' = 'admin')`
  - `"owner_absolute_access_leads"`: `FOR ALL TO public USING (auth.uid() = '8181fb81-0dae-4020-882b-dc016e8a3717'::uuid)`
  - `"Affiliates can view leads they referred"`: `FOR SELECT TO authenticated USING (referred_by_code IN (SELECT code FROM affiliate_codes WHERE user_id = auth.uid()))`

---

### public.manual_payment_receipts
- **Purpose**: Stores bank receipt uploads for manual subscriptions.
- **Schema**:
  - `id` (`UUID` [Not Null] (default: `gen_random_uuid()`))
  - `user_id` (`UUID` [Not Null])
  - `product_id` (`UUID` [Not Null])
  - `amount` (`NUMERIC` [Not Null])
  - `storage_path` (`TEXT` [Not Null])
  - `whatsapp_number` (`TEXT` [Nullable])
  - `status` (`TEXT` [Not Null] (default: `'pending'::text`))
  - `rejection_reason` (`TEXT` [Nullable])
  - `created_at` (`TIMESTAMP WITH TIME ZONE` [Nullable] (default: `now()`))
  - `updated_at` (`TIMESTAMP WITH TIME ZONE` [Nullable] (default: `now()`))
  - `referred_by_code` (`TEXT` [Nullable])
- **RLS Policies**:
  - `"Users can view own receipts"`: `FOR SELECT TO public USING (auth.uid() = user_id)`
  - `"Users can insert own receipts"`: `FOR INSERT TO public WITH CHECK (auth.uid() = user_id)`
  - `"admin_manage_receipts"`: `FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'superadmin')))`

---

### public.market_data
- **Purpose**: Live bid/ask price feeds for major trading pairs.
- **Schema**:
  - `id` (`UUID` [Not Null] (default: `gen_random_uuid()`))
  - `symbol` (`TEXT` [Not Null])
  - `price` (`TEXT` [Not Null])
  - `change` (`TEXT` [Not Null])
  - `up` (`BOOLEAN` [Nullable] (default: `true`))
  - `created_at` (`TIMESTAMP WITH TIME ZONE` [Nullable] (default: `now()`))
- **RLS Policies**:
  - `"public_read_market_data_absolute"`: `FOR SELECT TO public USING (true)`
  - `"admin_all_access"`: `FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))`

---

### public.notification_queue
- **Purpose**: Enqueues outbound alerts (WhatsApp/Email) to sales agents.
- **Schema**:
  - `id` (`UUID` [Not Null] (default: `gen_random_uuid()`))
  - `recipient` (`TEXT` [Not Null])
  - `channel` (`USER-DEFINED` [Nullable] (default: `'WHATSAPP'::notify_channel`))
  - `priority` (`USER-DEFINED` [Nullable] (default: `'LOW'::notify_priority`))
  - `payload` (`JSONB` [Not Null])
  - `status` (`TEXT` [Nullable] (default: `'PENDING'::text`))
  - `attempts` (`INTEGER` [Nullable] (default: `0`))
  - `sent_at` (`TIMESTAMP WITH TIME ZONE` [Nullable])
  - `created_at` (`TIMESTAMP WITH TIME ZONE` [Nullable] (default: `now()`))
- **RLS Policies**:
  - `"Admin superuser access"`: `FOR ALL TO authenticated USING (auth.email() = 'piyushmalmantra01@gmail.com')`

---

### public.payouts
- **Purpose**: Records affiliate commission payouts status and methods.
- **Schema**:
  - `id` (`UUID` [Not Null] (default: `gen_random_uuid()`))
  - `agent_id` (`UUID` [Nullable])
  - `total_amount` (`NUMERIC` [Not Null])
  - `currency` (`TEXT` [Nullable] (default: `'INR'::text`))
  - `method` (`TEXT` [Nullable])
  - `status` (`TEXT` [Nullable] (default: `'PENDING'::text`))
  - `processed_at` (`TIMESTAMP WITH TIME ZONE` [Nullable])
  - `created_at` (`TIMESTAMP WITH TIME ZONE` [Nullable] (default: `now()`))
- **RLS Policies**:
  - `"Admin superuser access"`: `FOR ALL TO authenticated USING (auth.email() = 'piyushmalmantra01@gmail.com')`

---

### public.performance_results
- **Purpose**: Historical systematic performance metrics (monthly return, drawdown, win rates).
- **Schema**:
  - `id` (`UUID` [Not Null] (default: `gen_random_uuid()`))
  - `month` (`TEXT` [Not Null])
  - `pips` (`INTEGER` [Not Null])
  - `win_rate` (`NUMERIC` [Nullable])
  - `profit_factor` (`NUMERIC` [Nullable])
  - `risk_reward` (`TEXT` [Nullable])
  - `is_featured` (`BOOLEAN` [Nullable] (default: `false`))
  - `created_at` (`TIMESTAMP WITH TIME ZONE` [Nullable] (default: `now()`))
  - `year` (`INTEGER` [Nullable] (default: `2026`))
  - `return_pct` (`NUMERIC` [Nullable] (default: `0`))
  - `product_id` (`UUID` [Nullable])
  - `drawdown` (`NUMERIC` [Nullable])
  - `total_trades` (`INTEGER` [Nullable] (default: `0`))
  - `equity_curve` (`JSONB` [Nullable])
  - `is_live` (`BOOLEAN` [Nullable] (default: `true`))
- **RLS Policies**:
  - `"Public read performance results"`: `FOR SELECT TO public USING (true)`
  - `"Admins manage performance results"`: `FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))`

---

### public.platform_flags
- **Purpose**: Legacy system configuration flags.
- **Schema**:
  - `key` (`TEXT` [Not Null])
  - `value` (`BOOLEAN` [Not Null] (default: `false`))
  - `updated_at` (`TIMESTAMP WITH TIME ZONE` [Not Null] (default: `now()`))
- **RLS Policies**:
  - `"Admin read flags"`: `FOR SELECT TO public USING (true)`

---

### public.product_variants
- **Purpose**: Pricing tiers and durations for product subscriptions.
- **Schema**:
  - `id` (`UUID` [Not Null] (default: `gen_random_uuid()`))
  - `product_id` (`UUID` [Nullable])
  - `name` (`TEXT` [Not Null])
  - `price` (`NUMERIC` [Not Null])
  - `currency` (`TEXT` [Nullable] (default: `'USD'::text`))
  - `duration_days` (`INTEGER` [Not Null])
  - `stripe_price_id` (`TEXT` [Nullable])
  - `razorpay_plan_id` (`TEXT` [Nullable])
  - `created_at` (`TIMESTAMP WITH TIME ZONE` [Nullable] (default: `now()`))
- **RLS Policies**:
  - `"Public read product variants"`: `FOR SELECT TO public USING (true)`
  - `"Admins manage product variants"`: `FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))`

---

### public.products
- **Purpose**: Catalog of quantitative algorithms and educational courses.
- **Schema**:
  - `id` (`UUID` [Not Null] (default: `gen_random_uuid()`))
  - `name` (`TEXT` [Not Null])
  - `description` (`TEXT` [Nullable])
  - `price` (`NUMERIC` [Not Null])
  - `image_url` (`TEXT` [Nullable])
  - `created_at` (`TIMESTAMP WITH TIME ZONE` [Nullable] (default: `now()`))
  - `strategy_details` (`TEXT` [Nullable])
  - `risk_profile` (`TEXT` [Nullable])
  - `performance_data` (`JSONB` [Nullable] (default: `'[]'::jsonb`))
  - `q_and_a` (`JSONB` [Nullable] (default: `'[]'::jsonb`))
  - `terms_and_conditions` (`TEXT` [Nullable])
  - `strategy_graph_url` (`TEXT` [Nullable])
  - `backtesting_result_url` (`TEXT` [Nullable])
  - `video_explanation_url` (`TEXT` [Nullable])
  - `long_plan_offers` (`JSONB` [Nullable] (default: `'[]'::jsonb`))
  - `category` (`TEXT` [Nullable])
  - `metadata` (`JSONB` [Nullable] (default: `'{}'::jsonb`))
- **RLS Policies**:
  - `"Public read products"`: `FOR SELECT TO public USING (true)`
  - `"Admins manage products"`: `FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))`

---

### public.reviews
- **Purpose**: Testimonials and customer reviews with moderation statuses.
- **Schema**:
  - `id` (`UUID` [Not Null] (default: `gen_random_uuid()`))
  - `name` (`TEXT` [Not Null])
  - `role` (`TEXT` [Nullable])
  - `text` (`TEXT` [Not Null])
  - `rating` (`INTEGER` [Nullable] (default: `5`))
  - `created_at` (`TIMESTAMP WITH TIME ZONE` [Nullable] (default: `now()`))
  - `image_url` (`TEXT` [Nullable])
  - `region` (`TEXT` [Nullable])
  - `user_name` (`TEXT` [Nullable])
  - `status` (`TEXT` [Nullable] (default: `'pending'::text`))
  - `source` (`TEXT` [Nullable] (default: `'web'::text`))
  - `priority` (`INTEGER` [Nullable] (default: `0`))
  - `user_id` (`UUID` [Nullable])
  - `rejection_reason` (`TEXT` [Nullable])
  - `flagged` (`BOOLEAN` [Nullable] (default: `false`))
  - `ip_address` (`TEXT` [Nullable])
  - `user_agent` (`TEXT` [Nullable])
  - `metadata` (`JSONB` [Nullable] (default: `'{}'::jsonb`))
- **RLS Policies**:
  - `"public_read_reviews_atomic"`: `FOR SELECT TO public USING (true)`
  - `"Users can submit reviews"`: `FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND status = 'pending')`
  - `"admin_all_access"`: `FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))`

---

### public.subscriptions
- **Purpose**: Active client subscriptions matching products and variants.
- **Schema**:
  - `id` (`UUID` [Not Null] (default: `gen_random_uuid()`))
  - `user_id` (`UUID` [Nullable])
  - `product_id` (`UUID` [Nullable])
  - `variant_id` (`UUID` [Nullable])
  - `status` (`TEXT` [Nullable] (default: `'active'::text`))
  - `current_period_start` (`TIMESTAMP WITH TIME ZONE` [Nullable] (default: `now()`))
  - `current_period_end` (`TIMESTAMP WITH TIME ZONE` [Not Null])
  - `stripe_subscription_id` (`TEXT` [Nullable])
  - `created_at` (`TIMESTAMP WITH TIME ZONE` [Nullable] (default: `now()`))
  - `payment_proof_id` (`UUID` [Nullable])
- **Triggers**:
  - `on_subscription_arrival`: AFTER INSERT OR UPDATE ON EACH ROW EXECUTE FUNCTION `public.sync_subscription_entitlements()`
- **RLS Policies**:
  - `"sub_select"` / `"sub_update"` / `"sub_delete"`: `FOR SELECT/UPDATE/DELETE TO authenticated USING (auth.uid() = user_id)`
  - `"sub_insert"`: `FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id)`
  - `"Users can discover their own subscriptions"`: `FOR SELECT TO authenticated USING (auth.uid() = user_id)`
  - `"admin_all_access"`: `FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))`

---

### public.system_logs
- **Purpose**: System log entries for operational monitoring.
- **Schema**:
  - `id` (`UUID` [Not Null] (default: `gen_random_uuid()`))
  - `type` (`TEXT` [Not Null])
  - `message` (`TEXT` [Not Null])
  - `metadata` (`JSONB` [Nullable] (default: `'{}'::jsonb`))
  - `user_id` (`UUID` [Nullable])
  - `severity` (`TEXT` [Nullable] (default: `'info'::text`))
  - `created_at` (`TIMESTAMP WITH TIME ZONE` [Nullable] (default: `now()`))
- **RLS Policies**:
  - `"Admins view logs"`: `FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))`

---

### public.user_entitlements
- **Purpose**: Granted feature access privileges per user.
- **Schema**:
  - `id` (`UUID` [Not Null] (default: `gen_random_uuid()`))
  - `user_id` (`UUID` [Not Null])
  - `feature` (`TEXT` [Not Null])
  - `active` (`BOOLEAN` [Nullable] (default: `true`))
  - `expires_at` (`TIMESTAMP WITH TIME ZONE` [Nullable])
  - `created_at` (`TIMESTAMP WITH TIME ZONE` [Nullable] (default: `now()`))
- **RLS Policies**:
  - `"Users view own entitlements"`: `FOR SELECT TO authenticated USING (user_id = auth.uid())`
  - `"Admins manage entitlements"`: `FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))`

---

### public.users
- **Purpose**: Holds profiles of registered users. Linked directly to Supabase Auth (`auth.users.id`).
- **Schema**:
  - `id` (`UUID` [Not Null])
  - `email` (`TEXT` [Nullable])
  - `full_name` (`TEXT` [Nullable])
  - `referred_by` (`UUID` [Nullable])
  - `created_at` (`TIMESTAMP WITH TIME ZONE` [Nullable] (default: `now()`))
  - `avatar_url` (`TEXT` [Nullable])
  - `role` (`TEXT` [Nullable] (default: `'user'::text`))
- **RLS Policies**:
  - `"users_basic_access"`: `FOR SELECT TO authenticated USING (auth.uid() = id)`

---

### public.webinar_registrations
- **Purpose**: Records webinar attendee registrations.
- **Schema**:
  - `id` (`UUID` [Not Null] (default: `gen_random_uuid()`))
  - `webinar_id` (`UUID` [Nullable])
  - `user_id` (`UUID` [Nullable])
  - `email` (`TEXT` [Nullable])
  - `created_at` (`TIMESTAMP WITH TIME ZONE` [Nullable] (default: `now()`))
  - `attended` (`BOOLEAN` [Nullable] (default: `false`))
  - `payment_status` (`TEXT` [Nullable] (default: `'completed'::text`))
  - `payment_id` (`TEXT` [Nullable])
  - `referred_by_code` (`TEXT` [Nullable])
  - `name` (`TEXT` [Nullable])
- **RLS Policies**:
  - `"web_reg_insert"`: `FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id)`
  - `"web_reg_select"`: `FOR SELECT TO authenticated USING (auth.uid() = user_id)`
  - `"web_reg_update"`: `FOR UPDATE TO authenticated USING (auth.uid() = user_id)`
  - `"web_reg_delete"`: `FOR DELETE TO authenticated USING (auth.uid() = user_id)`
  - `"admin_all_access"`: `FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))`

---

### public.webinar_sponsors
- **Purpose**: Webinar co-brand sponsor details (Headline, Partner, etc.).
- **Schema**:
  - `id` (`UUID` [Not Null] (default: `gen_random_uuid()`))
  - `webinar_id` (`UUID` [Nullable])
  - `name` (`TEXT` [Not Null])
  - `tier` (`TEXT` [Not Null])
  - `logo_url` (`TEXT` [Not Null])
  - `website_url` (`TEXT` [Nullable])
  - `created_at` (`TIMESTAMP WITH TIME ZONE` [Nullable] (default: `now()`))
  - `updated_at` (`TIMESTAMP WITH TIME ZONE` [Nullable] (default: `now()`))
- **RLS Policies**:
  - `"Allow public read access for sponsors"`: `FOR SELECT TO public USING (true)`

---

### public.webinars
- **Purpose**: Stores scheduled educational webinars, links, speakers, and registrations metrics.
- **Schema**:
  - `id` (`UUID` [Not Null] (default: `gen_random_uuid()`))
  - `title` (`TEXT` [Not Null])
  - `description` (`TEXT` [Nullable])
  - `date_time` (`TIMESTAMP WITH TIME ZONE` [Not Null])
  - `speaker_name` (`TEXT` [Nullable])
  - `status` (`TEXT` [Nullable] (default: `'upcoming'::text`))
  - `is_paid` (`BOOLEAN` [Nullable] (default: `false`))
  - `price` (`NUMERIC` [Nullable] (default: `0`))
  - `created_at` (`TIMESTAMP WITH TIME ZONE` [Nullable] (default: `now()`))
  - `speaker_profile_url` (`TEXT` [Nullable])
  - `brand_logo_url` (`TEXT` [Nullable])
  - `webinar_image_url` (`TEXT` [Nullable])
  - `sponsor_logos` (`JSONB` [Nullable] (default: `'[]'::jsonb`))
  - `speaker_images` (`JSONB` [Nullable] (default: `'[]'::jsonb`))
  - `about_content` (`TEXT` [Nullable])
  - `q_and_a` (`JSONB` [Nullable] (default: `'[]'::jsonb`))
  - `advanced_features` (`JSONB` [Nullable] (default: `'{}'::jsonb`))
  - `max_attendees` (`INTEGER` [Nullable] (default: `500`))
  - `registration_count` (`INTEGER` [Nullable] (default: `0`))
  - `type` (`TEXT` [Nullable] (default: `'free'::text`))
  - `recording_url` (`TEXT` [Nullable])
  - `streaming_url` (`TEXT` [Nullable])
  - `co_brand_name` (`TEXT` [Nullable])
  - `co_brand_logo` (`TEXT` [Nullable])
  - `co_brand_banner` (`TEXT` [Nullable])
- **RLS Policies**:
  - `"public_read_webinars_absolute"`: `FOR SELECT TO public USING (true)`

---


## 3. Storage Buckets & Policies

| Bucket ID | Public? | Target Usage | SELECT Policy (List Files) | UPDATE / DELETE Policies |
| :--- | :--- | :--- | :--- | :--- |
| `payment-proofs` | **No** | Subscription bank screenshots | `"admin_access_payment_proofs"`: Admin-only (`role = 'admin'`) | None |
| `receipts` | **No** | Invoiced payment proofs | `"Allow users to view own receipts"` (Owner folder name matches `auth.uid()`) & `"Allow admins to view all receipts"` | None |
| `webinar-assets` | **Yes** | Webinar speaker photos/slides | `"Admin read webinar assets"`: Admin-only | `"Admin Update Search for Webinar Assets"`, `"Admin Delete Search for Webinar Assets"`: Admin-only |
| `resumes` | **Yes** | Candidate CV PDFs | `"Admin read resumes"`: Admin-only | None |

---

## 4. Functions & Triggers (`private` vs. `public`)

### 4.1 Trigger Functions (Executed in `private` schema)
Trigger functions automate counts, API access logging, and routing. They execute with `SECURITY DEFINER` and a strict search path:

1. **`private.advanced_crm_lead_routing()`**:
   - Executes `BEFORE INSERT OR UPDATE` on `public.leads`.
   - Injects default lead scores and tags based on organic traffic sources (e.g. `source ILIKE '%webinar%'` -> score = 85).
2. **`private.increment_affiliate_stats()`**:
   - Executes `AFTER INSERT` on `public.analytics_events`.
   - Aggregates affiliate referral actions (`referral_capture` -> clicks + 1, `referral_resolved` -> registrations + 1).
3. **`private.log_api_access(p_key_id uuid, p_ip text, p_endpoint text, p_status integer)`**:
   - Writes api telemetry info directly to `private.api_audit_logs`.
   - Securely isolates institutional logging from public-facing schemas.

---

### 4.2 Utility & Helper Functions (Executed in `public` schema)

1. **`public.generate_affiliate_code(user_id uuid)`**:
   - **Context**: `SECURITY INVOKER` (Runs under caller privileges).
   - **Privileges**: Explicitly **revoked from anonymous users**. Granted only to `authenticated` users and `service_role`.
   - **Path**: `SET search_path = public, pg_temp`
   - **Logic**: Resolves if the user already has a code. If not, generates an `IFX-XXXXXX` alphanumeric code and inserts it. Respects caller RLS bounds.
2. **`public.expire_subscriptions()`**:
   - **Context**: `SECURITY DEFINER` (SET `search_path = public`).
   - **Logic**: Automatically expires client plans whose end dates have lapsed.
3. **`public.handle_new_user()`**:
   - **Context**: `SECURITY DEFINER` (SET `search_path = public`).
   - **Logic**: Custom auth trigger function that populates `public.users` profile information upon registration.
4. **`public.handle_payment_approval()`**:
   - **Context**: `SECURITY DEFINER` (SET `search_path = public`).
   - **Logic**: Automated trigger that fulfills subscription features and grants user privileges when a manual bank screenshot status changes to 'approved'.
5. **`public.increment_agent_conversion(agent_id uuid)`**:
   - **Context**: `SECURITY INVOKER` (SET `search_path = public`).
   - **Logic**: Increments CRM performance scores for agents when a lead is successfully closed.
6. **`public.increment_agent_load(agent_id uuid)`**:
   - **Context**: `SECURITY INVOKER` (SET `search_path = public`).
   - **Logic**: Tracks active workload counts for auto-routing algorithms.
7. **`public.rls_auto_enable()`**:
   - **Context**: `SECURITY DEFINER` (SET `search_path = pg_catalog`).
   - **Logic**: Custom DDL Event Trigger helper that guarantees every new table created has RLS auto-enabled instantly.
8. **`public.sync_subscription_entitlements()`**:
   - **Context**: `SECURITY DEFINER` (SET `search_path = public`).
   - **Logic**: Trigger function executes AFTER INSERT OR UPDATE on `public.subscriptions` to synchronize granted features inside `public.user_entitlements`.
9. **`public.update_consultations_updated_at()`**:
   - **Context**: `SECURITY INVOKER` (SET `search_path = public`).
   - **Logic**: Keeps track of consultation timestamps when records are updated.

---

## 5. Developer Guide: How to Modify the Database

To maintain stability and prevent drift between local development and the remote production server, follow these strict workflows:

### 5.1 Making Schema Changes (Table additions, columns, RLS, functions)
> [!WARNING]
> Never create, edit, or delete tables directly in the Supabase Table Editor or SQL Editor on the live production dashboard. This causes migrations history to diverge and will crash future deployments.

To make a schema change:
1. **Initialize a migration file**:
   ```bash
   npx supabase migration new your_descriptive_name
   ```
2. **Write the SQL**: Edit the newly created `.sql` file inside `supabase/migrations/`. Keep statements idempotent (using `IF NOT EXISTS` and `DROP ... IF EXISTS`).
3. **Apply the migration**:
   ```bash
   npm run apply-migrations
   ```
4. **Hardening checks**: Always verify that RLS is explicitly enabled (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`) and that any `SECURITY DEFINER` function explicitly sets the search path.

### 5.2 Content & Row Editing (Webinars, Positions, Banners, Users)
For data entry and standard day-to-day administrative content updates:
- **Dashboard Table Editor**: It is perfectly safe to insert, edit, or delete records in tables like `webinars`, `banners`, `hiring_positions`, or `products` directly via the Supabase Dashboard Table Editor. RLS policies do not apply to direct dashboard administrators.

### 5.3 In-Memory Mocks (Signals Table Exclusion)
> [!IMPORTANT]
> **We do not store or distribute trade signals in the database.**
> To avoid regulatory compliance risks and eliminate database polling overhead, the `signals` and `signal_subscriptions` tables are dropped. All execution desk streams (`LiveAlgoTerminal` and `SignalFeed`) are rendered using deterministic in-memory mock execution engines. Do not re-create tables or triggers for trade signals.
