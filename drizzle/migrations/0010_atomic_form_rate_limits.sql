-- Make public form throttling atomic and harden security-definer helpers.
-- The transaction-level lock serialises the check-and-insert window shared by every
-- public form. The existing limits and stored hash format remain unchanged.

CREATE OR REPLACE FUNCTION public.enforce_form_rate_limit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog
AS $$
DECLARE
  hdr json;
  ip text;
  keys text[] := ARRAY[]::text[];
  k text;
  event_time timestamptz;
BEGIN
  -- Prevent concurrent requests from passing the same count check before either inserts.
  -- This lock is transaction-scoped and shared by every table using this trigger.
  PERFORM pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended('sewa:form-rate-limit:v1', 0)
  );
  -- now() is fixed at transaction start; use wall-clock time after the lock wait.
  event_time := pg_catalog.clock_timestamp();

  BEGIN
    hdr := current_setting('request.headers', true)::json;
  EXCEPTION WHEN others THEN
    hdr := NULL;
  END;

  ip := split_part(
    coalesce(
      hdr->>'cf-connecting-ip',
      hdr->>'x-real-ip',
      hdr->>'x-forwarded-for',
      ''
    ),
    ',',
    1
  );

  IF ip <> '' THEN
    keys := keys || md5('ip:' || trim(ip));
  END IF;

  IF NEW.client_key IS NOT NULL AND NEW.client_key <> '' THEN
    keys := keys || md5('s:' || NEW.client_key);
  END IF;

  -- Keep the per-tab key transient; only its one-way hash is retained.
  NEW.client_key := NULL;

  DELETE FROM public.form_rate_log
  WHERE created_at < event_time - interval '1 day';

  FOREACH k IN ARRAY keys LOOP
    IF (
      SELECT count(*)
      FROM public.form_rate_log
      WHERE key_hash = k
        AND created_at > event_time - interval '10 minutes'
    ) >= 3 THEN
      RAISE EXCEPTION 'rate_limited' USING ERRCODE = 'P0001';
    END IF;
  END LOOP;

  IF (
    SELECT count(*)
    FROM public.form_rate_log
    WHERE key_hash = 'all'
      AND created_at > event_time - interval '1 hour'
  ) >= 100 THEN
    RAISE EXCEPTION 'rate_limited' USING ERRCODE = 'P0001';
  END IF;

  FOREACH k IN ARRAY keys LOOP
    INSERT INTO public.form_rate_log (key_hash, created_at) VALUES (k, event_time);
  END LOOP;
  INSERT INTO public.form_rate_log (key_hash, created_at) VALUES ('all', event_time);

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.enforce_form_rate_limit() FROM PUBLIC, anon, authenticated;

-- A signed-in caller may only check their own role; never expose other users' role membership.
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog
AS $
  SELECT
    auth.uid() IS NOT NULL
    AND _user_id = auth.uid()
    AND EXISTS (
      SELECT 1
      FROM public.user_roles
      WHERE user_id = auth.uid() AND role = _role
    )
$;

REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, service_role;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

-- Keep the claim trigger's security-definer lookup on an explicit trusted search path.
CREATE OR REPLACE FUNCTION public.validate_business_claim()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog
AS $$
BEGIN
  SELECT id
  INTO NEW.listing_id
  FROM public.listings
  WHERE slug = NEW.listing_slug
    AND status = 'published';

  IF NEW.listing_id IS NULL THEN
    RAISE EXCEPTION 'invalid_listing';
  END IF;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.validate_business_claim() FROM PUBLIC, anon, authenticated;

-- Keep trigger helper resolution explicit as migration history grows.
CREATE OR REPLACE FUNCTION public.listings_before_update()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = pg_catalog
AS $$
BEGIN
  NEW.updated_at := now();
  IF NEW.slug IS DISTINCT FROM OLD.slug THEN
    DELETE FROM public.slug_redirects WHERE old_slug = NEW.slug;
    UPDATE public.slug_redirects SET new_slug = NEW.slug WHERE new_slug = OLD.slug;
    INSERT INTO public.slug_redirects (old_slug, new_slug)
    VALUES (OLD.slug, NEW.slug)
    ON CONFLICT (old_slug) DO UPDATE SET new_slug = EXCLUDED.new_slug;
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.touch_lead_status()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = pg_catalog
AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    NEW.status_changed_at := now();
  END IF;
  RETURN NEW;
END;
$$;
