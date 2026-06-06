-- Migration: Remediate Database Linter Warnings
-- Resolves warnings: function_search_path_mutable, rls_policy_always_true, public_bucket_allows_listing, and definer_function_executable

CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM anon, authenticated;
GRANT USAGE ON SCHEMA private TO postgres, service_role;

-- 1. Hardening advanced_crm_lead_routing trigger function
CREATE OR REPLACE FUNCTION private.advanced_crm_lead_routing()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    -- Initialize or reset score
    NEW.score := COALESCE(NEW.score, 0);
    
    -- Determine base score from source if not already scored heavily
    IF NEW.score < 10 THEN
        IF NEW.source ILIKE '%webinar%' THEN
            NEW.score := 85;
            NEW.conversion_probability := 78;
        ELSIF NEW.source ILIKE '%exit%' THEN
            NEW.score := 45;
            NEW.conversion_probability := 32;
        ELSIF NEW.source ILIKE '%hero%' THEN
            NEW.score := 65;
            NEW.conversion_probability := 55;
        ELSE
            NEW.score := 30;
            NEW.conversion_probability := 15;
        END IF;
    END IF;

    -- Hot lead criteria based on institutional thresholds
    IF NEW.score >= 70 THEN
        NEW.is_hot := true;
        NEW.priority_tag := 'TIER_1_INSTITUTIONAL';
    ELSIF NEW.score >= 50 THEN
        NEW.is_hot := false;
        NEW.priority_tag := 'TIER_2_CORPORATE';
    ELSE
        NEW.is_hot := false;
        NEW.priority_tag := 'TIER_3_STANDARD';
    END IF;

    -- Set default stage if null
    IF NEW.stage IS NULL THEN
        NEW.stage := 'discovered';
    END IF;

    RETURN NEW;
END;
$$;

-- Drop public trigger function and update trigger
DROP TRIGGER IF EXISTS lead_routing_trigger ON public.leads;
CREATE TRIGGER lead_routing_trigger
BEFORE INSERT OR UPDATE ON public.leads
FOR EACH ROW
EXECUTE FUNCTION private.advanced_crm_lead_routing();

DROP FUNCTION IF EXISTS public.advanced_crm_lead_routing();

-- Drop obsolete public advanced_crm_lead_routing(uuid) function
DROP FUNCTION IF EXISTS public.advanced_crm_lead_routing(uuid);


-- 2. Hardening increment_affiliate_stats trigger function
CREATE OR REPLACE FUNCTION private.increment_affiliate_stats()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF NEW.event_type = 'referral_capture' AND NEW.metadata->>'code' IS NOT NULL THEN
    UPDATE affiliate_codes 
    SET total_clicks = total_clicks + 1
    WHERE code = NEW.metadata->>'code';
  ELSIF NEW.event_type = 'referral_resolved' AND NEW.metadata->>'code' IS NOT NULL THEN
    UPDATE affiliate_codes 
    SET total_registrations = total_registrations + 1
    WHERE code = NEW.metadata->>'code';
  END IF;
  RETURN NEW;
END;
$$;

-- Update trigger for increment_affiliate_stats
DROP TRIGGER IF EXISTS trigger_increment_affiliate_stats ON public.analytics_events;
CREATE TRIGGER trigger_increment_affiliate_stats
AFTER INSERT ON public.analytics_events
FOR EACH ROW
EXECUTE FUNCTION private.increment_affiliate_stats();

DROP FUNCTION IF EXISTS public.increment_affiliate_stats();


-- 3. Hardening hiring_applications RLS insert policy
DROP POLICY IF EXISTS "Public submit applications" ON public.hiring_applications;
CREATE POLICY "Public submit applications" ON public.hiring_applications
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    position_id IS NOT NULL 
    AND length(trim(full_name)) > 0 
    AND length(trim(email)) > 0 
    AND length(trim(resume_url)) > 0
  );


-- 4. Hardening storage bucket listing policies
-- Prevent listing resumes bucket contents for public roles (keep admin only)
DROP POLICY IF EXISTS "Public read resumes" ON storage.objects;
CREATE POLICY "Admin read resumes" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'resumes'
    AND EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Prevent listing webinar-assets bucket contents for public roles (keep admin only)
DROP POLICY IF EXISTS "Public read webinar assets" ON storage.objects;
CREATE POLICY "Admin read webinar assets" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'webinar-assets'
    AND EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );


-- 5. Hardening generate_affiliate_code function (SECURITY INVOKER)
CREATE OR REPLACE FUNCTION public.generate_affiliate_code(user_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public, pg_temp
AS $$
DECLARE
  existing_code text;
  new_code text;
  chars text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; -- No I, O, 0, 1 to avoid confusion
  i int;
BEGIN
  -- 1. Check if this user already has an affiliate code
  SELECT code INTO existing_code
  FROM affiliate_codes
  WHERE affiliate_codes.user_id = generate_affiliate_code.user_id;

  IF existing_code IS NOT NULL THEN
    RETURN existing_code;
  END IF;

  -- 2. Generate a unique code with retry loop
  LOOP
    new_code := 'IFX-';
    FOR i IN 1..6 LOOP
      new_code := new_code || substr(chars, floor(random() * length(chars) + 1)::int, 1);
    END LOOP;

    -- Try to insert; if code collision, retry
    BEGIN
      INSERT INTO affiliate_codes (user_id, code, total_clicks, total_registrations, commission_rate)
      VALUES (generate_affiliate_code.user_id, new_code, 0, 0, 10.0);
      
      RETURN new_code;
    EXCEPTION WHEN unique_violation THEN
      -- Code already exists, loop and try again
      CONTINUE;
    END;
  END LOOP;
END;
$$;

-- Revoke default public execute permission
REVOKE EXECUTE ON FUNCTION public.generate_affiliate_code(uuid) FROM PUBLIC, anon, authenticated;
-- Grant execute permissions to authenticated and service_role only
GRANT EXECUTE ON FUNCTION public.generate_affiliate_code(uuid) TO authenticated, service_role;
