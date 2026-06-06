import fs from 'fs';

const schemas = JSON.parse(fs.readFileSync('scratch/schemas_utf8.json', 'utf8'));

const tableDescriptions = {
  "public.users": "Holds profiles of registered users. Linked directly to Supabase Auth (`auth.users.id`).",
  "public.leads": "Persists prospective lead metrics, interaction scores, and stage details for CRM routing.",
  "public.affiliate_codes": "Stores unique referral codes assigned to active partner/affiliate users.",
  "public.commissions": "Records referral commission balances and payouts details.",
  "public.webinars": "Stores scheduled educational webinars, links, speakers, and registrations metrics.",
  "public.webinar_registrations": "Records webinar attendee registrations.",
  "public.hiring_positions": "List open internal and B2B broker talent job opportunities.",
  "public.hiring_applications": "Stores CV details and cover letters submitted by candidates.",
  "public.banners": "Persists advertisement banners rendered on webinars/homepage placements.",
  "public.analytics_events": "Tracks user telemetry events (clicks, signups, referrals) for analytics.",
  "public.api_keys": "Holds API key configurations for third-party institutional access keys.",
  "public.faqs": "Holds Frequently Asked Questions displayed on the support portal.",
  "public.feature_flags": "Feature toggles for managing platform capabilities.",
  "public.manual_payment_receipts": "Stores bank receipt uploads for manual subscriptions.",
  "public.market_data": "Live bid/ask price feeds for major trading pairs.",
  "public.notification_queue": "Enqueues outbound alerts (WhatsApp/Email) to sales agents.",
  "public.payouts": "Records affiliate commission payouts status and methods.",
  "public.performance_results": "Historical systematic performance metrics (monthly return, drawdown, win rates).",
  "public.platform_flags": "Legacy system configuration flags.",
  "public.product_variants": "Pricing tiers and durations for product subscriptions.",
  "public.products": "Catalog of quantitative algorithms and educational courses.",
  "public.reviews": "Testimonials and customer reviews with moderation statuses.",
  "public.subscriptions": "Active client subscriptions matching products and variants.",
  "public.system_logs": "System log entries for operational monitoring.",
  "public.user_entitlements": "Granted feature access privileges per user.",
  "public.webinar_sponsors": "Webinar co-brand sponsor details (Headline, Partner, etc.).",
  "private.api_audit_logs": "Internal audit log registers for key-based API calls."
};

const rlsPolicies = {
  "public.users": `  - \`"Users can view their own profile"\`: \`FOR SELECT USING (id = auth.uid())\`
  - \`"Users can update their own profile"\`: \`FOR UPDATE USING (id = auth.uid())\`
  - \`"Admins can view all users"\`: \`FOR SELECT USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))\``,
  
  "public.leads": `  - \`"Admins have full access to leads"\`: \`FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))\`
  - \`"Affiliates can view leads they referred"\`: \`FOR SELECT TO authenticated USING (referred_by_code IN (SELECT code FROM affiliate_codes WHERE user_id = auth.uid()))\``,
  
  "public.affiliate_codes": `  - \`"Users can view their own affiliate codes"\`: \`FOR SELECT TO authenticated USING (auth.uid() = user_id)\`
  - \`"Users can create their own affiliate codes"\`: \`FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id)\`
  - \`"Admins have full access to affiliate_codes"\`: \`FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))\``,
  
  "public.commissions": `  - \`"Affiliates can view their own commissions"\`: \`FOR SELECT TO authenticated USING (agent_id = auth.uid())\`
  - \`"Admins have full access to commissions"\`: \`FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))\``,
  
  "public.webinars": `  - \`"Public read webinars"\`: \`FOR SELECT TO anon, authenticated USING (true)\`
  - \`"Admins manage webinars"\`: \`FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))\``,
  
  "public.webinar_registrations": `  - \`"Users view own webinar registrations"\`: \`FOR SELECT TO authenticated USING (user_id = auth.uid())\`
  - \`"Users create own webinar registrations"\`: \`FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid())\`
  - \`"Admins manage webinar registrations"\`: \`FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))\``,
  
  "public.hiring_positions": `  - \`"Public view active positions"\`: \`FOR SELECT TO anon, authenticated USING (is_active = true)\`
  - \`"Admins manage positions"\`: \`FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))\``,
  
  "public.hiring_applications": `  - \`"Public submit applications"\`: \`FOR INSERT TO anon, authenticated WITH CHECK (position_id IS NOT NULL AND length(trim(full_name)) > 0 AND length(trim(email)) > 0 AND length(trim(resume_url)) > 0)\`
  - \`"Admins view applications"\`: \`FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))\``,
  
  "public.banners": `  - \`"Public active banners"\`: \`FOR SELECT TO public USING (is_active = true)\`
  - \`"Admin full access"\`: \`FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))\``,

  "public.analytics_events": `  - \`"Public insert events"\`: \`FOR INSERT TO anon, authenticated WITH CHECK (true)\`
  - \`"Admins view events"\`: \`FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))\``,

  "public.api_keys": `  - \`"Users manage own API keys"\`: \`FOR ALL TO authenticated USING (user_id = auth.uid())\``,

  "public.faqs": `  - \`"Public view active FAQs"\`: \`FOR SELECT TO public USING (is_active = true)\`
  - \`"Admins manage FAQs"\`: \`FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))\``,

  "public.feature_flags": `  - \`"Public read flags"\`: \`FOR SELECT TO public USING (true)\`
  - \`"Admins manage flags"\`: \`FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))\``,

  "public.manual_payment_receipts": `  - \`"Users manage own receipts"\`: \`FOR ALL TO authenticated USING (user_id = auth.uid())\`
  - \`"Admins manage all receipts"\`: \`FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))\``,

  "public.market_data": `  - \`"Public read market data"\`: \`FOR SELECT TO public USING (true)\``,

  "public.notification_queue": `  - \`"Admins manage queue"\`: \`FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))\``,

  "public.payouts": `  - \`"Affiliates view own payouts"\`: \`FOR SELECT TO authenticated USING (agent_id = auth.uid())\`
  - \`"Admins manage payouts"\`: \`FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))\``,

  "public.performance_results": `  - \`"Public read performance results"\`: \`FOR SELECT TO public USING (true)\`
  - \`"Admins manage performance results"\`: \`FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))\``,

  "public.platform_flags": `  - \`"Public read platform flags"\`: \`FOR SELECT TO public USING (true)\``,

  "public.product_variants": `  - \`"Public read product variants"\`: \`FOR SELECT TO public USING (true)\`
  - \`"Admins manage product variants"\`: \`FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))\``,

  "public.products": `  - \`"Public read products"\`: \`FOR SELECT TO public USING (true)\`
  - \`"Admins manage products"\`: \`FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))\``,

  "public.reviews": `  - \`"Public read approved reviews"\`: \`FOR SELECT TO public USING (status = 'approved')\`
  - \`"Users submit reviews"\`: \`FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid())\`
  - \`"Admins manage reviews"\`: \`FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))\``,

  "public.subscriptions": `  - \`"Users view own subscriptions"\`: \`FOR SELECT TO authenticated USING (user_id = auth.uid())\`
  - \`"Admins manage subscriptions"\`: \`FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))\``,

  "public.system_logs": `  - \`"Admins view logs"\`: \`FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))\``,

  "public.user_entitlements": `  - \`"Users view own entitlements"\`: \`FOR SELECT TO authenticated USING (user_id = auth.uid())\`
  - \`"Admins manage entitlements"\`: \`FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))\``,

  "public.webinar_sponsors": `  - \`"Public view sponsors"\`: \`FOR SELECT TO public USING (true)\`
  - \`"Admins manage sponsors"\`: \`FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))\``,

  "private.api_audit_logs": `  - *Internal Private Table*: Direct API keys log pipeline. RLS disabled (held in private system schema only).`
};

let output = '';
const entries = Object.keys(schemas).sort();

for (const key of entries) {
  if (key === 'public.schema_migrations') continue;
  
  const columns = schemas[key];
  const desc = tableDescriptions[key] || "Operational base table.";
  const pol = rlsPolicies[key] || "  - RLS Enabled. Restricted access based on institutional permissions.";
  
  output += `### ${key}\n`;
  output += `- **Purpose**: ${desc}\n`;
  output += `- **Schema**:\n`;
  for (const c of columns) {
    const defaultStr = c.default ? ` (default: \`${c.default}\`)` : '';
    const nullableStr = c.nullable ? ' [Nullable]' : ' [Not Null]';
    output += `  - \`${c.name}\` (\`${c.type.toUpperCase()}\`${nullableStr}${defaultStr})\n`;
  }
  
  // Triggers checking
  if (key === 'public.leads') {
    output += `- **Triggers**:\n`;
    output += `  - \`lead_routing_trigger\`: Runs \`BEFORE INSERT OR UPDATE\` executing \`private.advanced_crm_lead_routing()\` to compute CRM scores.\n`;
  } else if (key === 'public.webinar_registrations') {
    output += `- **Triggers**:\n`;
    output += `  - \`trg_webinar_reg_after_insert\`: Executes \`private.trg_webinar_registrations_after_insert()\` to increment webinar attendees.\n`;
    output += `  - \`trg_webinar_reg_after_delete\`: Executes \`private.trg_webinar_registrations_after_delete()\` to decrement webinar attendees.\n`;
  } else if (key === 'public.analytics_events') {
    output += `- **Triggers**:\n`;
    output += `  - \`trigger_increment_affiliate_stats\`: Executes \`private.increment_affiliate_stats()\` to track affiliate events.\n`;
  }
  
  output += `- **RLS Policies**:\n${pol}\n\n---\n\n`;
}

fs.writeFileSync('scratch/markdown_schemas.md', output, 'utf8');
console.log("SUCCESS: markdown_schemas.md generated!");
