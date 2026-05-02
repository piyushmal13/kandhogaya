-- Trigger to maintain registration_count on webinars table
CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM anon, authenticated;

CREATE OR REPLACE FUNCTION private.trg_webinar_registrations_after_insert()
RETURNS trigger AS $$
BEGIN
  UPDATE webinars SET registration_count = COALESCE(registration_count, 0) + 1 WHERE id = NEW.webinar_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

CREATE TRIGGER trg_webinar_reg_after_insert
AFTER INSERT ON webinar_registrations
FOR EACH ROW
EXECUTE PROCEDURE private.trg_webinar_registrations_after_insert();

CREATE OR REPLACE FUNCTION private.trg_webinar_registrations_after_delete()
RETURNS trigger AS $$
BEGIN
  UPDATE webinars SET registration_count = GREATEST(COALESCE(registration_count, 0) - 1, 0) WHERE id = OLD.webinar_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

CREATE TRIGGER trg_webinar_reg_after_delete
AFTER DELETE ON webinar_registrations
FOR EACH ROW
EXECUTE PROCEDURE private.trg_webinar_registrations_after_delete();
