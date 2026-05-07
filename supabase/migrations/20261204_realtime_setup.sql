-- Migration: Real-Time Infrastructure & Change Data Capture
-- Created: 2026-12-04
-- Purpose: Enable Supabase Realtime on critical tables, configure change notifications

-- ============================================================================
-- ENABLE REPLICA IDENTITY FOR CHANGE TRACKING
-- Supabase Realtime uses logical replication; FULL identity needed for UPDATE/DELETE
-- ============================================================================

-- Critical tables for real-time updates
CREATE OR REPLACE FUNCTION enable_realtime_for_table(table_name TEXT) 
RETURNS void AS $$
DECLARE
  sql TEXT;
BEGIN
  sql := format('ALTER TABLE %I REPLICA IDENTITY FULL', table_name);
  EXECUTE sql;
  RAISE NOTICE 'Enabled REPLICA IDENTITY FULL for table: %', table_name;
END;
$$ LANGUAGE plpgsql;

SELECT enable_realtime_for_table('products');
SELECT enable_realtime_for_table('webinars');
SELECT enable_realtime_for_table('webinar_registrations');
SELECT enable_realtime_for_table('algo_licenses');
SELECT enable_realtime_for_table('user_entitlements');
SELECT enable_realtime_for_table('signals');
SELECT enable_realtime_for_table('market_data');
SELECT enable_realtime_for_table('performance_results');

-- ============================================================================
-- CUSTOM PUBLICATION FOR SELECTIVE REAL-TIME SUBSCRIPTIONS
-- ============================================================================

-- Drop existing publication if we're recreating
DROP PUBLICATION IF EXISTS ifx_trades_realtime;

-- Create new publication including exactly the tables we need real-time on
CREATE PUBLICATION ifx_trades_realtime FOR TABLE
  products,                    -- Marketplace price/availability updates
  webinars,                    -- Registration count changes, status updates
  webinar_registrations,       -- New registrations (concurrent updates)
  algo_licenses,               -- License activations/expirations
  user_entitlements,           -- Feature access grants/revocations
  signals,                     -- New trading signals
  market_data,                 -- Price ticks
  performance_results,         -- Updated performance metrics
  algo_performance_snapshots;  -- New performance records

-- ============================================================================
-- DATABASE TRIGGERS FOR REAL-TIME NOTIFICATIONS
-- Push notifications via pg_notify for critical events
-- ============================================================================

-- Function: Notify on signal insert/update
CREATE OR REPLACE FUNCTION public.notify_signal_update()
RETURNS TRIGGER AS $$
DECLARE
  payload JSONB;
BEGIN
  payload := jsonb_build_object(
    'type', TG_OP,
    'table', TG_TABLE_NAME,
    'id', NEW.id,
    'data', row_to_json(NEW),
    'timestamp', NOW()
  );

  PERFORM pg_notify('signals_channel', payload::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Signal changes
DROP TRIGGER IF EXISTS trg_signals_notify on signals;
CREATE TRIGGER trg_signals_notify
  AFTER INSERT OR UPDATE ON signals
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_signal_update();

-- Function: Notify on webinar registration count change
CREATE OR REPLACE FUNCTION public.notify_webinar_registration()
RETURNS TRIGGER AS $$
DECLARE
  payload JSONB;
BEGIN
  payload := jsonb_build_object(
    'type', TG_OP,
    'table', 'webinars',
    'id', NEW.webinar_id,
    'registration_count', (
      SELECT COUNT(*) FROM webinar_registrations 
      WHERE webinar_id = NEW.webinar_id
    ),
    'timestamp', NOW()
  );

  PERFORM pg_notify('webinars_channel', payload::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Webinar registration changes (update webinar count)
DROP TRIGGER IF EXISTS trg_webinar_registration_notify on webinar_registrations;
CREATE TRIGGER trg_webinar_registration_notify
  AFTER INSERT OR DELETE ON webinar_registrations
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_webinar_registration();

-- ============================================================================
-- FUNCTION: Increment webinar registration count atomically
-- Called by trigger on registration insert/delete
-- ============================================================================

CREATE OR REPLACE FUNCTION private.increment_webinar_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE webinars 
    SET registration_count = registration_count + 1 
    WHERE id = NEW.webinar_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE webinars 
    SET registration_count = registration_count - 1 
    WHERE id = OLD.webinar_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger for automatic count updates
DROP TRIGGER IF EXISTS trg_webinar_reg_after_insert ON webinar_registrations;
CREATE TRIGGER trg_webinar_reg_after_insert
  AFTER INSERT ON webinar_registrations
  FOR EACH ROW
  EXECUTE FUNCTION private.increment_webinar_count();

DROP TRIGGER IF EXISTS trg_webinar_reg_after_delete ON webinar_registrations;
CREATE TRIGGER trg_webinar_reg_after_delete
  AFTER DELETE ON webinar_registrations
  FOR EACH ROW
  EXECUTE FUNCTION private.increment_webinar_count();

-- ============================================================================
-- FUNCTION: Notify product stock/price changes (for marketplace)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.notify_product_update()
RETURNS TRIGGER AS $$
DECLARE
  payload JSONB;
BEGIN
  payload := jsonb_build_object(
    'type', TG_OP,
    'table', 'products',
    'id', NEW.id,
    'changes', jsonb_build_object(
      'price', NEW.price,
      'is_active', NEW.is_active,
      'category', NEW.category
    ),
    'timestamp', NOW()
  );

  PERFORM pg_notify('marketplace_updates', payload::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger product updates (price, availability changes)
DROP TRIGGER IF EXISTS trg_product_price_change ON products;
CREATE TRIGGER trg_product_price_change
  AFTER INSERT OR UPDATE OF price, is_active, category ON products
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_product_update();

-- ============================================================================
-- FUNCTION: License status change notification
-- ============================================================================

CREATE OR REPLACE FUNCTION public.notify_license_change()
RETURNS TRIGGER AS $$
DECLARE
  payload JSONB;
BEGIN
  payload := jsonb_build_object(
    'type', TG_OP,
    'table', 'bot_licenses',
    'id', NEW.id,
    'user_id', NEW.user_id,
    'algo_id', NEW.algo_id,
    'status', NEW.status,
    'timestamp', NOW()
  );

  PERFORM pg_notify('license_updates', payload::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: License status changes (activation, expiration)
DROP TRIGGER IF EXISTS trg_license_status_change ON bot_licenses;
CREATE TRIGGER trg_license_status_change
  AFTER INSERT OR UPDATE OF status, expires_at, is_active ON bot_licenses
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_license_change();

-- ============================================================================
-- FUNCTION: Audit log automatic creation
-- ============================================================================

CREATE OR REPLACE FUNCTION public.log_audit_event()
RETURNS TRIGGER AS $$
DECLARE
  actor_id UUID;
  action_type TEXT;
  entity_type TEXT := TG_TABLE_NAME;
  entity_id UUID;
  details JSONB;
BEGIN
  -- Get actor ID (from app metadata or default to service account)
  actor_id := auth.uid();
  
  IF actor_id IS NULL THEN
    actor_id := '00000000-0000-0000-0000-000000000000'::uuid; -- System actor
  END IF;

  -- Determine action type
  action_type := TG_OP;

  -- Get entity ID
  entity_id := COALESCE(NEW.id, OLD.id);

  -- Build details JSON
  details := jsonb_build_object(
    'table', TG_TABLE_NAME,
    'schema', TG_TABLE_SCHEMA
  );

  IF TG_OP = 'INSERT' THEN
    details := details || jsonb_build_object('new', to_jsonb(NEW));
  ELSIF TG_OP = 'UPDATE' THEN
    details := details || jsonb_build_object(
      'old', to_jsonb(OLD),
      'new', to_jsonb(NEW)
    );
  ELSIF TG_OP = 'DELETE' THEN
    details := details || jsonb_build_object('old', to_jsonb(OLD));
  END IF;

  -- Insert audit log (async to not block transaction)
  -- Using pg_notify to decouple audit logging from main transaction
  PERFORM pg_notify('audit_log_insert', jsonb_build_object(
    'actor_id', actor_id,
    'action', action_type,
    'entity_type', entity_type,
    'entity_id', entity_id,
    'details', details,
    'created_at', NOW()
  )::text);

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply audit triggers to sensitive tables
CREATE TRIGGER audit_users_changes
  AFTER INSERT OR UPDATE OR DELETE ON users
  FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

CREATE TRIGGER audit_products_changes
  AFTER INSERT OR UPDATE OR DELETE ON products
  FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

CREATE TRIGGER audit_payments_changes
  AFTER INSERT OR UPDATE OR DELETE ON payments
  FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

CREATE TRIGGER audit_licenses_changes
  AFTER INSERT OR UPDATE OR DELETE ON bot_licenses
  FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

CREATE TRIGGER audit_webinars_changes
  AFTER INSERT OR UPDATE OR DELETE ON webinars
  FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

-- ============================================================================
-- MATERIALIZED VIEW FOR DASHBOARD STATS (auto-refresh)
-- ============================================================================

CREATE OR REPLACE MATERIALIZED VIEW public.dashboard_daily_metrics AS
SELECT
  DATE(created_at) as metric_date,
  COUNT(DISTINCT user_id) as new_users,
  COUNT(DISTINCT CASE WHEN status = 'completed' THEN id END) as completed_orders,
  SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END) as total_revenue,
  COUNT(DISTINCT CASE WHEN source = 'webinar' THEN id END) as webinar_leads
FROM payments
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY metric_date DESC;

-- Create index on materialized view
CREATE UNIQUE INDEX IF NOT EXISTS idx_dashboard_daily_metrics_date 
  ON dashboard_daily_metrics(metric_date);

-- Function to refresh materialized view
CREATE OR REPLACE FUNCTION public.refresh_dashboard_metrics()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.dashboard_daily_metrics;
END;
$$ LANGUAGE plpgsql;

-- Auto-refresh every hour via pg_cron (if extension installed)
-- SELECT cron.schedule('refresh-dashboard-metrics', '0 * * * *', 'SELECT refresh_dashboard_metrics();');

-- ============================================================================
-- COMMENTS
-- ============================================================================
COMMENT ON PUBLICATION ifx_trades_realtime IS 
  'Selective real-time publication for IFX Trades trading platform. Subscribed tables: products, webinars, registrations, licenses, signals, market_data';
COMMENT ON FUNCTION public.notify_signal_update() IS 
  'Trigger function to broadcast signal changes to supabase_realtime channel';
COMMENT ON FUNCTION public.notify_webinar_registration() IS 
  'Updates webinar registration count and broadcasts real-time update';
COMMENT ON FUNCTION public.log_audit_event() IS 
  'Automated audit logging for sensitive tables via pg_notify to decouple from main transaction';
