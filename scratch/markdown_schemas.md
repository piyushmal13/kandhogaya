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
  - `"Public insert events"`: `FOR INSERT TO anon, authenticated WITH CHECK (true)`
  - `"Admins view events"`: `FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))`

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
  - `"Public active banners"`: `FOR SELECT TO public USING (is_active = true)`
  - `"Admin full access"`: `FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))`

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
  - `"Affiliates can view their own commissions"`: `FOR SELECT TO authenticated USING (agent_id = auth.uid())`
  - `"Admins have full access to commissions"`: `FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))`

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
- **RLS Policies**:
  - RLS Enabled. Restricted access based on institutional permissions.

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
  - RLS Enabled. Restricted access based on institutional permissions.

---

### public.content_categories
- **Purpose**: Operational base table.
- **Schema**:
  - `id` (`UUID` [Not Null] (default: `gen_random_uuid()`))
  - `name` (`TEXT` [Not Null])
  - `slug` (`TEXT` [Not Null])
- **RLS Policies**:
  - RLS Enabled. Restricted access based on institutional permissions.

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
  - RLS Enabled. Restricted access based on institutional permissions.

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
  - `"Public view active FAQs"`: `FOR SELECT TO public USING (is_active = true)`
  - `"Admins manage FAQs"`: `FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))`

---

### public.feature_flags
- **Purpose**: Feature toggles for managing platform capabilities.
- **Schema**:
  - `id` (`UUID` [Not Null] (default: `gen_random_uuid()`))
  - `key` (`TEXT` [Not Null])
  - `enabled` (`BOOLEAN` [Nullable] (default: `true`))
  - `created_at` (`TIMESTAMP WITH TIME ZONE` [Nullable] (default: `now()`))
- **RLS Policies**:
  - `"Public read flags"`: `FOR SELECT TO public USING (true)`
  - `"Admins manage flags"`: `FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))`

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
  - `"Admins have full access to leads"`: `FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))`
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
  - `"Users manage own receipts"`: `FOR ALL TO authenticated USING (user_id = auth.uid())`
  - `"Admins manage all receipts"`: `FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))`

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
  - `"Public read market data"`: `FOR SELECT TO public USING (true)`

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
  - `"Admins manage queue"`: `FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))`

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
  - `"Affiliates view own payouts"`: `FOR SELECT TO authenticated USING (agent_id = auth.uid())`
  - `"Admins manage payouts"`: `FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))`

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
  - `"Public read platform flags"`: `FOR SELECT TO public USING (true)`

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
  - `"Public read approved reviews"`: `FOR SELECT TO public USING (status = 'approved')`
  - `"Users submit reviews"`: `FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid())`
  - `"Admins manage reviews"`: `FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))`

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
- **RLS Policies**:
  - `"Users view own subscriptions"`: `FOR SELECT TO authenticated USING (user_id = auth.uid())`
  - `"Admins manage subscriptions"`: `FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))`

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
  - `"Users can view their own profile"`: `FOR SELECT USING (id = auth.uid())`
  - `"Users can update their own profile"`: `FOR UPDATE USING (id = auth.uid())`
  - `"Admins can view all users"`: `FOR SELECT USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))`

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
- **Triggers**:
  - `trg_webinar_reg_after_insert`: Executes `private.trg_webinar_registrations_after_insert()` to increment webinar attendees.
  - `trg_webinar_reg_after_delete`: Executes `private.trg_webinar_registrations_after_delete()` to decrement webinar attendees.
- **RLS Policies**:
  - `"Users view own webinar registrations"`: `FOR SELECT TO authenticated USING (user_id = auth.uid())`
  - `"Users create own webinar registrations"`: `FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid())`
  - `"Admins manage webinar registrations"`: `FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))`

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
  - `"Public view sponsors"`: `FOR SELECT TO public USING (true)`
  - `"Admins manage sponsors"`: `FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))`

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
  - `"Public read webinars"`: `FOR SELECT TO anon, authenticated USING (true)`
  - `"Admins manage webinars"`: `FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))`

---

