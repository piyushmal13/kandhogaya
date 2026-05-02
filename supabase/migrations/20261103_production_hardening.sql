-- Final production hardening: explicit API grants, RLS coverage, private storage,
-- and private-schema trigger functions.

CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM anon, authenticated;
GRANT USAGE ON SCHEMA private TO postgres, service_role;

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

DO $$
DECLARE
  table_name TEXT;
  all_tables TEXT[] := ARRAY[
    'users',
    'leads',
    'contact_messages',
    'content_categories',
    'content_posts',
    'agent_accounts',
    'products',
    'algo_bots',
    'bot_licenses',
    'user_entitlements',
    'manual_payment_receipts',
    'payment-proofs',
    'sales_tracking',
    'commissions',
    'feature_flags',
    'system_logs',
    'analytics_events',
    'notification_queue',
    'signal_subscriptions',
    'algo_subscriptions',
    'webinars',
    'webinar_registrations',
    'reviews',
    'webinar_sponsors',
    'market_data',
    'performance_results',
    'banners',
    'payments',
    'product_images',
    'product_variants',
    'consultations'
  ];
  public_read_tables TEXT[] := ARRAY[
    'products',
    'product_variants',
    'product_images',
    'webinars',
    'webinar_sponsors',
    'reviews',
    'market_data',
    'performance_results',
    'banners',
    'content_categories',
    'content_posts',
    'feature_flags'
  ];
  public_insert_tables TEXT[] := ARRAY[
    'leads',
    'contact_messages',
    'consultations',
    'analytics_events'
  ];
  authenticated_crud_tables TEXT[] := ARRAY[
    'users',
    'affiliate_codes',
    'agent_accounts',
    'algo_bots',
    'bot_licenses',
    'user_entitlements',
    'manual_payment_receipts',
    'payment-proofs',
    'sales_tracking',
    'commissions',
    'feature_flags',
    'system_logs',
    'notification_queue',
    'payments',
    'webinar_registrations',
    'reviews',
    'banners',
    'product_variants',
    'product_images',
    'content_posts',
    'webinars'
  ];
BEGIN
  FOREACH table_name IN ARRAY all_tables LOOP
    IF to_regclass(format('public.%I', table_name)) IS NOT NULL THEN
      EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', table_name);
      EXECUTE format('GRANT ALL PRIVILEGES ON TABLE public.%I TO service_role', table_name);
    END IF;
  END LOOP;

  FOREACH table_name IN ARRAY public_read_tables LOOP
    IF to_regclass(format('public.%I', table_name)) IS NOT NULL THEN
      EXECUTE format('GRANT SELECT ON TABLE public.%I TO anon, authenticated', table_name);
    END IF;
  END LOOP;

  FOREACH table_name IN ARRAY public_insert_tables LOOP
    IF to_regclass(format('public.%I', table_name)) IS NOT NULL THEN
      EXECUTE format('GRANT INSERT ON TABLE public.%I TO anon, authenticated', table_name);
    END IF;
  END LOOP;

  FOREACH table_name IN ARRAY authenticated_crud_tables LOOP
    IF to_regclass(format('public.%I', table_name)) IS NOT NULL THEN
      EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.%I TO authenticated', table_name);
    END IF;
  END LOOP;
END $$;

GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

DROP POLICY IF EXISTS "Public read webinars" ON webinars;
CREATE POLICY "Public read webinars" ON webinars
  FOR SELECT TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Admins manage webinars" ON webinars;
CREATE POLICY "Admins manage webinars" ON webinars
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Users view own webinar registrations" ON webinar_registrations;
CREATE POLICY "Users view own webinar registrations" ON webinar_registrations
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users create own webinar registrations" ON webinar_registrations;
CREATE POLICY "Users create own webinar registrations" ON webinar_registrations
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins manage webinar registrations" ON webinar_registrations;
CREATE POLICY "Admins manage webinar registrations" ON webinar_registrations
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Public read reviews" ON reviews;
CREATE POLICY "Public read reviews" ON reviews
  FOR SELECT TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Admins manage reviews" ON reviews;
CREATE POLICY "Admins manage reviews" ON reviews
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Users create signal subscriptions" ON signal_subscriptions;
CREATE POLICY "Users create signal subscriptions" ON signal_subscriptions
  FOR INSERT TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins manage signal subscriptions" ON signal_subscriptions;
CREATE POLICY "Admins manage signal subscriptions" ON signal_subscriptions
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Anonymous insert consultations" ON consultations;
CREATE POLICY "Anonymous insert consultations" ON consultations
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins manage consultations" ON consultations;
CREATE POLICY "Admins manage consultations" ON consultations
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- Keep payment proof buckets private. Access is through authenticated uploads and
-- short-lived signed URLs from admin tooling.
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('payment-proofs', 'payment-proofs', false),
  ('receipts', 'receipts', false)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;

DROP POLICY IF EXISTS "Allow public uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public reads" ON storage.objects;
DROP POLICY IF EXISTS "Users upload payment proofs" ON storage.objects;
CREATE POLICY "Users upload payment proofs" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'payment-proofs'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Users read own payment proofs" ON storage.objects;
CREATE POLICY "Users read own payment proofs" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'payment-proofs'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Users upload receipts" ON storage.objects;
CREATE POLICY "Users upload receipts" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'receipts'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Users read own receipts" ON storage.objects;
CREATE POLICY "Users read own receipts" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'receipts'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Admins read payment artifacts" ON storage.objects;
CREATE POLICY "Admins read payment artifacts" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id IN ('payment-proofs', 'receipts')
    AND EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Move trigger code into a private schema while preserving registration counts.
CREATE OR REPLACE FUNCTION private.trg_webinar_registrations_after_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  UPDATE webinars
  SET registration_count = COALESCE(registration_count, 0) + 1
  WHERE id = NEW.webinar_id;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION private.trg_webinar_registrations_after_delete()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  UPDATE webinars
  SET registration_count = GREATEST(COALESCE(registration_count, 0) - 1, 0)
  WHERE id = OLD.webinar_id;
  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS trg_webinar_reg_after_insert ON webinar_registrations;
CREATE TRIGGER trg_webinar_reg_after_insert
AFTER INSERT ON webinar_registrations
FOR EACH ROW
EXECUTE FUNCTION private.trg_webinar_registrations_after_insert();

DROP TRIGGER IF EXISTS trg_webinar_reg_after_delete ON webinar_registrations;
CREATE TRIGGER trg_webinar_reg_after_delete
AFTER DELETE ON webinar_registrations
FOR EACH ROW
EXECUTE FUNCTION private.trg_webinar_registrations_after_delete();

DROP FUNCTION IF EXISTS public.trg_webinar_registrations_after_insert();
DROP FUNCTION IF EXISTS public.trg_webinar_registrations_after_delete();

