\set ON_ERROR_STOP on

DO $$
DECLARE
  secured_tables integer;
  hardened_functions integer;
  trigger_count integer;
  table_name text;
BEGIN
  SELECT count(*)
  INTO secured_tables
  FROM pg_catalog.pg_class c
  JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
  WHERE n.nspname = 'public'
    AND c.relname = ANY (ARRAY[
      'contact_messages',
      'correction_reports',
      'business_submissions',
      'business_claims',
      'analytics_events'
    ])
    AND c.relrowsecurity;

  IF secured_tables <> 5 THEN
    RAISE EXCEPTION 'expected RLS on all five private form/analytics tables; found %', secured_tables;
  END IF;

  SELECT count(*)
  INTO hardened_functions
  FROM pg_catalog.pg_proc p
  JOIN pg_catalog.pg_namespace n ON n.oid = p.pronamespace
  WHERE n.nspname = 'public'
    AND p.proname = ANY (ARRAY[
      'enforce_form_rate_limit',
      'has_role',
      'validate_business_claim',
      'listings_before_update',
      'touch_lead_status'
    ])
    AND p.proconfig @> ARRAY['search_path=pg_catalog'];

  IF hardened_functions <> 5 THEN
    RAISE EXCEPTION 'expected five functions with pg_catalog-only search_path; found %', hardened_functions;
  END IF;

  IF has_function_privilege('anon', 'public.has_role(uuid, public.app_role)', 'EXECUTE') THEN
    RAISE EXCEPTION 'anonymous role must not execute has_role';
  END IF;
  IF NOT has_function_privilege('authenticated', 'public.has_role(uuid, public.app_role)', 'EXECUTE') THEN
    RAISE EXCEPTION 'authenticated role must execute has_role';
  END IF;
  IF has_function_privilege('service_role', 'public.has_role(uuid, public.app_role)', 'EXECUTE') THEN
    RAISE EXCEPTION 'service_role must not execute the user-scoped has_role helper';
  END IF;
  IF has_function_privilege('anon', 'public.enforce_form_rate_limit()', 'EXECUTE')
     OR has_function_privilege('authenticated', 'public.enforce_form_rate_limit()', 'EXECUTE') THEN
    RAISE EXCEPTION 'rate-limit trigger helper must not be directly executable by client roles';
  END IF;

  FOREACH table_name IN ARRAY ARRAY[
    'contact_messages',
    'correction_reports',
    'business_submissions',
    'business_claims',
    'analytics_events'
  ] LOOP
    IF has_table_privilege('anon', format('public.%I', table_name), 'SELECT')
       OR has_table_privilege('anon', format('public.%I', table_name), 'UPDATE')
       OR has_table_privilege('anon', format('public.%I', table_name), 'DELETE') THEN
      RAISE EXCEPTION 'anonymous role has an unexpected private-table privilege on %', table_name;
    END IF;
  END LOOP;

  SELECT count(*)
  INTO trigger_count
  FROM pg_catalog.pg_trigger t
  JOIN pg_catalog.pg_class c ON c.oid = t.tgrelid
  JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
  WHERE n.nspname = 'public'
    AND t.tgname = ANY (ARRAY[
      'contact_messages_rate_limit',
      'correction_reports_rate_limit',
      'business_submissions_rate_limit',
      'business_claims_rate_limit'
    ])
    AND NOT t.tgisinternal
    AND t.tgenabled <> 'D';

  IF trigger_count <> 4 THEN
    RAISE EXCEPTION 'expected four enabled public-form rate-limit triggers; found %', trigger_count;
  END IF;
END
$$;

-- Public visitors may select service options but cannot set commercial amounts or payment state.
DO $$
BEGIN
  IF NOT has_column_privilege('anon', 'public.contact_messages', 'service_package', 'INSERT')
     OR NOT has_column_privilege('anon', 'public.contact_messages', 'budget_band', 'INSERT') THEN
    RAISE EXCEPTION 'anonymous visitors must be able to submit service requests';
  END IF;
  IF has_column_privilege('anon', 'public.contact_messages', 'quote_amount_npr', 'INSERT')
     OR has_column_privilege('anon', 'public.contact_messages', 'paid_amount_npr', 'INSERT')
     OR has_column_privilege('anon', 'public.contact_messages', 'payment_status', 'INSERT')
     OR has_column_privilege('anon', 'public.contact_messages', 'quote_amount_npr', 'UPDATE')
     OR has_column_privilege('anon', 'public.contact_messages', 'paid_amount_npr', 'UPDATE')
     OR has_column_privilege('anon', 'public.contact_messages', 'payment_status', 'UPDATE') THEN
    RAISE EXCEPTION 'anonymous visitors must not write quote or payment fields';
  END IF;
  IF NOT has_column_privilege('authenticated', 'public.contact_messages', 'quote_amount_npr', 'UPDATE')
     OR NOT has_column_privilege('authenticated', 'public.contact_messages', 'paid_amount_npr', 'UPDATE')
     OR NOT has_column_privilege('authenticated', 'public.contact_messages', 'payment_status', 'UPDATE') THEN
    RAISE EXCEPTION 'authenticated admins must be able to record quote and payment fields';
  END IF;
END
$$;

INSERT INTO auth.users (id) VALUES
  ('11111111-1111-4111-8111-111111111111'),
  ('22222222-2222-4222-8222-222222222222')
ON CONFLICT DO NOTHING;

INSERT INTO public.user_roles (user_id, role)
VALUES ('22222222-2222-4222-8222-222222222222', 'admin'::public.app_role)
ON CONFLICT (user_id, role) DO NOTHING;

-- Exercise the public submission trigger as an anonymous caller. Three requests
-- are accepted; a fourth request through a different form must be rejected.
SET ROLE anon;
SELECT set_config('request.headers', '{"cf-connecting-ip":"198.51.100.77"}', false);
DO $$
DECLARE
  attempt integer;
  blocked boolean := false;
BEGIN
  FOR attempt IN 1..3 LOOP
    INSERT INTO public.contact_messages (name, message, page, client_key, service_package)
    VALUES ('SEWA CI Rate Test', 'Disposable rate-limit test', 'contact', 'sewa-rate-session', 'launch');
  END LOOP;

  BEGIN
    INSERT INTO public.correction_reports (listing_slug, whats_wrong, client_key)
    VALUES ('ci-test-listing', 'Disposable cross-form rate-limit test', 'sewa-rate-session');
  EXCEPTION WHEN SQLSTATE 'P0001' THEN
    IF SQLERRM <> 'rate_limited' THEN
      RAISE;
    END IF;
    blocked := true;
  END;

  IF NOT blocked THEN
    RAISE EXCEPTION 'the shared rate limiter did not reject the fourth cross-form request';
  END IF;
END
$$;
RESET ROLE;

DO $$
BEGIN
  IF (SELECT count(*) FROM public.contact_messages
      WHERE name = 'SEWA CI Rate Test' AND client_key IS NULL
        AND service_package = 'launch' AND quote_amount_npr IS NULL
        AND paid_amount_npr = 0 AND payment_status = 'not_quoted') <> 3 THEN
    RAISE EXCEPTION 'raw client keys were not cleared or the first three requests were not stored';
  END IF;
  IF (SELECT count(*) FROM public.form_rate_log
      WHERE key_hash = md5('ip:198.51.100.77')
        AND created_at > clock_timestamp() - interval '1 hour') <> 3 THEN
    RAISE EXCEPTION 'IP rate-log count did not record exactly three accepted requests';
  END IF;
  IF (SELECT count(*) FROM public.form_rate_log
      WHERE key_hash = md5('s:sewa-rate-session')
        AND created_at > clock_timestamp() - interval '1 hour') <> 3 THEN
    RAISE EXCEPTION 'client-session rate-log count did not record exactly three accepted requests';
  END IF;
  IF (SELECT count(*) FROM public.form_rate_log
      WHERE key_hash = 'all'
        AND created_at > clock_timestamp() - interval '1 hour') <> 3 THEN
    RAISE EXCEPTION 'global rate-log count did not record exactly three accepted requests';
  END IF;
  IF EXISTS (SELECT 1 FROM public.correction_reports WHERE listing_slug = 'ci-test-listing') THEN
    RAISE EXCEPTION 'the rejected cross-form request was inserted';
  END IF;
END
$$;

-- A signed-in non-admin cannot inspect another user's role or read private leads.
SET ROLE authenticated;
SELECT set_config('request.jwt.claim.sub', '11111111-1111-4111-8111-111111111111', false);
DO $$
BEGIN
  IF public.has_role('22222222-2222-4222-8222-222222222222', 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'a non-admin caller probed another user admin role';
  END IF;
  IF public.has_role('11111111-1111-4111-8111-111111111111', 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'a non-admin caller was incorrectly classified as admin';
  END IF;
  IF (SELECT count(*) FROM public.contact_messages WHERE name = 'SEWA CI Rate Test') <> 0 THEN
    RAISE EXCEPTION 'a non-admin caller read private contact messages';
  END IF;
  UPDATE public.contact_messages
    SET quote_amount_npr = 999, payment_status = 'quoted'
    WHERE id = (SELECT id FROM public.contact_messages WHERE name = 'SEWA CI Rate Test' ORDER BY id LIMIT 1);
  IF (SELECT count(*) FROM public.contact_messages WHERE name = 'SEWA CI Rate Test' AND quote_amount_npr IS NOT NULL) <> 0 THEN
    RAISE EXCEPTION 'a non-admin caller updated commercial quote fields';
  END IF;
END
$;

-- The administrator can check their own role and read the private submissions.
SELECT set_config('request.jwt.claim.sub', '22222222-2222-4222-8222-222222222222', false);
DO $$
BEGIN
  IF NOT public.has_role('22222222-2222-4222-8222-222222222222', 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'the administrator could not verify their own role';
  END IF;
  IF public.has_role('11111111-1111-4111-8111-111111111111', 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'the administrator probed another user role';
  END IF;
  IF (SELECT count(*) FROM public.contact_messages WHERE name = 'SEWA CI Rate Test') <> 3 THEN
    RAISE EXCEPTION 'the administrator could not read private contact messages';
  END IF;
  UPDATE public.contact_messages
    SET quote_amount_npr = 15000, payment_status = 'quoted'
    WHERE id = (SELECT id FROM public.contact_messages WHERE name = 'SEWA CI Rate Test' ORDER BY id LIMIT 1);
  IF NOT FOUND THEN
    RAISE EXCEPTION 'the administrator could not record a quote';
  END IF;
  UPDATE public.contact_messages
    SET paid_amount_npr = 15000, payment_status = 'paid', status = 'won'
    WHERE id = (SELECT id FROM public.contact_messages WHERE name = 'SEWA CI Rate Test' ORDER BY id LIMIT 1);
  IF NOT FOUND THEN
    RAISE EXCEPTION 'the administrator could not record payment received';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM public.contact_messages
    WHERE name = 'SEWA CI Rate Test'
      AND quote_amount_npr = 15000
      AND paid_amount_npr = 15000
      AND payment_status = 'paid'
      AND status = 'won'
  ) THEN
    RAISE EXCEPTION 'admin quote/payment values were not persisted';
  END IF;
END
$;
RESET ROLE;

SELECT 'SEWA disposable database migration and security checks passed' AS result;
