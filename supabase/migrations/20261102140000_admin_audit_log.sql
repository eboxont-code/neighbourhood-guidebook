-- SEWA administrative audit history. Records operational metadata only:
-- never copy enquiry text, contact details, proof URLs or full business JSON into this table.

CREATE TABLE public.admin_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  actor_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL CHECK (action IN (
    'listing_created',
    'listing_updated',
    'listing_deleted',
    'claim_status_changed',
    'submission_status_changed',
    'lead_status_changed'
  )),
  resource_type text NOT NULL CHECK (resource_type IN (
    'listing',
    'business_claim',
    'business_submission',
    'contact_message'
  )),
  resource_id text NOT NULL CHECK (char_length(resource_id) BETWEEN 1 AND 120),
  resource_label text CHECK (resource_label IS NULL OR char_length(resource_label) <= 180),
  details jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(details) = 'object')
);

CREATE INDEX admin_audit_log_created_idx
  ON public.admin_audit_log (created_at DESC);
CREATE INDEX admin_audit_log_resource_idx
  ON public.admin_audit_log (resource_type, resource_id, created_at DESC);
CREATE INDEX admin_audit_log_actor_idx
  ON public.admin_audit_log (actor_user_id, created_at DESC);

GRANT SELECT ON public.admin_audit_log TO authenticated;
GRANT ALL ON public.admin_audit_log TO service_role;
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read audit history"
  ON public.admin_audit_log
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.audit_listing_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, auth
AS $$
DECLARE
  changed_fields text[];
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.admin_audit_log (
      actor_user_id, action, resource_type, resource_id, resource_label, details
    ) VALUES (
      auth.uid(),
      'listing_created',
      'listing',
      NEW.id,
      NEW.name,
      jsonb_build_object(
        'slug', NEW.slug,
        'status', NEW.status,
        'area', NEW.area,
        'category', NEW.category
      )
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    SELECT coalesce(array_agg(n.key ORDER BY n.key), ARRAY[]::text[])
    INTO changed_fields
    FROM jsonb_each(to_jsonb(NEW)) AS n(key, value)
    JOIN jsonb_each(to_jsonb(OLD)) AS o(key, value) USING (key)
    WHERE n.value IS DISTINCT FROM o.value
      AND n.key <> 'updated_at';

    IF cardinality(changed_fields) = 0 THEN
      RETURN NEW;
    END IF;

    INSERT INTO public.admin_audit_log (
      actor_user_id, action, resource_type, resource_id, resource_label, details
    ) VALUES (
      auth.uid(),
      'listing_updated',
      'listing',
      NEW.id,
      NEW.name,
      jsonb_build_object(
        'changed_fields', to_jsonb(changed_fields),
        'previous_slug', OLD.slug,
        'current_slug', NEW.slug,
        'previous_status', OLD.status,
        'current_status', NEW.status
      )
    );
    RETURN NEW;
  ELSE
    INSERT INTO public.admin_audit_log (
      actor_user_id, action, resource_type, resource_id, resource_label, details
    ) VALUES (
      auth.uid(),
      'listing_deleted',
      'listing',
      OLD.id,
      OLD.name,
      jsonb_build_object('slug', OLD.slug, 'status', OLD.status)
    );
    RETURN OLD;
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.audit_listing_change() FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.audit_admin_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, auth
AS $$
DECLARE
  action_name text;
  resource_kind text;
  resource_key text;
  label text;
BEGIN
  IF NEW.status IS NOT DISTINCT FROM OLD.status THEN
    RETURN NEW;
  END IF;

  IF TG_TABLE_NAME = 'business_claims' THEN
    action_name := 'claim_status_changed';
    resource_kind := 'business_claim';
    resource_key := NEW.id::text;
    label := NEW.listing_slug;
  ELSIF TG_TABLE_NAME = 'business_submissions' THEN
    action_name := 'submission_status_changed';
    resource_kind := 'business_submission';
    resource_key := NEW.id::text;
    label := NEW.business_name;
  ELSIF TG_TABLE_NAME = 'contact_messages' THEN
    action_name := 'lead_status_changed';
    resource_kind := 'contact_message';
    resource_key := NEW.id::text;
    label := 'Lead';
  ELSE
    RAISE EXCEPTION 'unsupported_audit_table';
  END IF;

  INSERT INTO public.admin_audit_log (
    actor_user_id, action, resource_type, resource_id, resource_label, details
  ) VALUES (
    auth.uid(),
    action_name,
    resource_kind,
    resource_key,
    label,
    jsonb_build_object(
      'previous_status', OLD.status,
      'current_status', NEW.status
    )
  );

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.audit_admin_status_change() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER listings_admin_audit
  AFTER INSERT OR UPDATE OR DELETE ON public.listings
  FOR EACH ROW EXECUTE FUNCTION public.audit_listing_change();

CREATE TRIGGER business_claims_admin_audit
  AFTER UPDATE OF status ON public.business_claims
  FOR EACH ROW EXECUTE FUNCTION public.audit_admin_status_change();

CREATE TRIGGER business_submissions_admin_audit
  AFTER UPDATE OF status ON public.business_submissions
  FOR EACH ROW EXECUTE FUNCTION public.audit_admin_status_change();

CREATE TRIGGER contact_messages_admin_audit
  AFTER UPDATE OF status ON public.contact_messages
  FOR EACH ROW EXECUTE FUNCTION public.audit_admin_status_change();
