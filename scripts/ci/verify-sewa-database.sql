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
      'analytics_events',
      'listing_promotions',
      'business_sales_prospects',
      'business_sales_activities'
    ])
    AND c.relrowsecurity;

  IF secured_tables <> 8 THEN
    RAISE EXCEPTION 'expected RLS on five private forms, listing_promotions and two private sales tables; found %', secured_tables;
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
      'touch_lead_status',
      'guard_listing_promotion_slot',
      'set_business_sales_prospect_updated_at'
    ])
    AND p.proconfig @> ARRAY['search_path=pg_catalog'];

  IF hardened_functions <> 7 THEN
    RAISE EXCEPTION 'expected seven functions with pg_catalog-only search_path; found %', hardened_functions;
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
    'analytics_events',
    'business_sales_prospects',
    'business_sales_activities'
  ] LOOP
    IF has_table_privilege('anon', format('public.%I', table_name), 'SELECT')
       OR has_table_privilege('anon', format('public.%I', table_name), 'UPDATE')
       OR has_table_privilege('anon', format('public.%I', table_name), 'DELETE')
       OR has_table_privilege('anon', format('public.%I', table_name), 'INSERT') THEN
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

-- The public role may read active campaigns only; all campaign writes are admin-only.
DO $$
BEGIN
  IF NOT has_table_privilege('anon', 'public.listing_promotions', 'SELECT')
     OR has_table_privilege('anon', 'public.listing_promotions', 'INSERT')
     OR has_table_privilege('anon', 'public.listing_promotions', 'UPDATE')
     OR has_table_privilege('anon', 'public.listing_promotions', 'DELETE') THEN
    RAISE EXCEPTION 'anonymous campaign permissions are incorrect';
  END IF;
  IF has_table_privilege('anon', 'public.business_sales_prospects', 'SELECT')
     OR has_table_privilege('anon', 'public.business_sales_prospects', 'INSERT')
     OR has_table_privilege('anon', 'public.business_sales_prospects', 'UPDATE')
     OR has_table_privilege('anon', 'public.business_sales_prospects', 'DELETE')
     OR has_table_privilege('anon', 'public.business_sales_activities', 'SELECT')
     OR has_table_privilege('anon', 'public.business_sales_activities', 'INSERT')
     OR has_table_privilege('anon', 'public.business_sales_activities', 'UPDATE')
     OR has_table_privilege('anon', 'public.business_sales_activities', 'DELETE') THEN
    RAISE EXCEPTION 'anonymous role has access to the private Boxont sales pipeline';
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

-- Admins can reserve and pay for a promotion slot; overlapping quoted/paid campaigns are blocked.
SET ROLE authenticated;
SELECT set_config('request.jwt.claim.sub', '22222222-2222-4222-8222-222222222222', false);
INSERT INTO public.listing_promotions
  (listing_id, placement, target_area, starts_at, ends_at, quote_amount_npr, paid_amount_npr, status)
VALUES
  ('b1', 'area_featured', 'durbar-marg', now() - interval '1 minute',
   now() + interval '1 day', 5000, 5000, 'paid');

DO $$
DECLARE
  blocked boolean := false;
BEGIN
  BEGIN
    INSERT INTO public.listing_promotions
      (listing_id, placement, target_area, starts_at, ends_at, quote_amount_npr, status)
    VALUES
      ('b5', 'area_featured', 'durbar-marg', now(),
       now() + interval '12 hours', 6000, 'quoted');
  EXCEPTION WHEN SQLSTATE '23P01' THEN
    blocked := true;
  END;
  IF NOT blocked THEN
    RAISE EXCEPTION 'overlapping quoted or paid promotions were not blocked';
  END IF;
END
$$;
RESET ROLE;

-- Admin-only prospect and activity writes; payment history remains attached to the prospect.
SET ROLE authenticated;
SELECT set_config('request.jwt.claim.sub', '22222222-2222-4222-8222-222222222222', false);
INSERT INTO public.business_sales_prospects
  (listing_id, stage, service_interest, contact_channel, next_follow_up_at, notes)
VALUES
  ('b1', 'identified', 'website', 'whatsapp', now() + interval '2 days',
   'Disposable sales pipeline CI fixture');
INSERT INTO public.business_sales_activities
  (prospect_id, activity_type, summary)
SELECT id, 'whatsapp', 'Disposable CI contact activity'
FROM public.business_sales_prospects WHERE listing_id = 'b1';
INSERT INTO public.business_sales_activities
  (prospect_id, activity_type, summary, amount_npr)
SELECT id, 'payment', 'Disposable CI receipt activity', 5000
FROM public.business_sales_prospects WHERE listing_id = 'b1';
UPDATE public.business_sales_prospects
  SET stage = 'proposal', quote_amount_npr = 15000
  WHERE listing_id = 'b1';
UPDATE public.business_sales_prospects
  SET stage = 'won', paid_amount_npr = 5000
  WHERE listing_id = 'b1';
DO $sales$
DECLARE
  cash_lock boolean := false;
BEGIN
  IF (SELECT count(*) FROM public.business_sales_prospects WHERE listing_id = 'b1'
      AND stage = 'won' AND quote_amount_npr = 15000 AND paid_amount_npr = 5000
      AND created_by = auth.uid()) <> 1 THEN
    RAISE EXCEPTION 'admin sales prospect or recorded cash did not persist';
  END IF;
  IF (SELECT count(*) FROM public.business_sales_activities a
      JOIN public.business_sales_prospects p ON p.id = a.prospect_id
      WHERE p.listing_id = 'b1') <> 2 THEN
    RAISE EXCEPTION 'admin sales activity history did not persist';
  END IF;
  IF (SELECT count(*) FROM public.business_sales_activities a
      JOIN public.business_sales_prospects p ON p.id = a.prospect_id
      WHERE p.listing_id = 'b1' AND a.amount_npr = 5000
      AND a.activity_type = 'payment') <> 1 THEN
    RAISE EXCEPTION 'recorded cash activity did not persist';
  END IF;
  BEGIN
    UPDATE public.business_sales_prospects
      SET paid_amount_npr = 4000
      WHERE listing_id = 'b1';
  EXCEPTION WHEN SQLSTATE 'P0001' THEN
    IF SQLERRM <> 'sales_cash_cannot_decrease' THEN RAISE; END IF;
    cash_lock := true;
  END;
  IF NOT cash_lock THEN
    RAISE EXCEPTION 'recorded sales cash could be silently decreased';
  END IF;
END
$sales$;
RESET ROLE;

-- A paid receipt and terminal campaign state cannot be silently rewritten.
DO $$
DECLARE
  amount_locked boolean := false;
  booking_locked boolean := false;
  cancellation_blocked boolean := false;
BEGIN
  BEGIN
    UPDATE public.listing_promotions
      SET quote_amount_npr = 6000, paid_amount_npr = 6000
      WHERE listing_id = 'b1' AND placement = 'area_featured';
  EXCEPTION WHEN SQLSTATE 'P0001' THEN
    IF SQLERRM <> 'promotion_paid_amount_locked' THEN RAISE; END IF;
    amount_locked := true;
  END;
  BEGIN
    UPDATE public.listing_promotions
      SET ends_at = ends_at + interval '1 day'
      WHERE listing_id = 'b1' AND placement = 'area_featured';
  EXCEPTION WHEN SQLSTATE 'P0001' THEN
    IF SQLERRM <> 'promotion_paid_booking_locked' THEN RAISE; END IF;
    booking_locked := true;
  END;
  BEGIN
    UPDATE public.listing_promotions
      SET status = 'cancelled', paid_amount_npr = 0
      WHERE listing_id = 'b1' AND placement = 'area_featured';
  EXCEPTION WHEN SQLSTATE 'P0001' THEN
    IF SQLERRM <> 'promotion_paid_campaign_terminal' THEN RAISE; END IF;
    cancellation_blocked := true;
  END;
  IF NOT amount_locked OR NOT booking_locked OR NOT cancellation_blocked THEN
    RAISE EXCEPTION 'paid campaign booking or financial state could be rewritten';
  END IF;
END
$$;

-- Anonymous visitors can see the paid campaign only while its window is live.
SET ROLE anon;
DO $$
BEGIN
  IF (SELECT count(*) FROM public.listing_promotions) <> 1 THEN
    RAISE EXCEPTION 'anonymous visitors could not read the live paid placement';
  END IF;
END
$$;
RESET ROLE;

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

-- A signed-in non-admin cannot inspect another user's role, private leads or promotion administration.
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
  IF (SELECT count(*) FROM public.listing_promotions) <> 1 THEN
    RAISE EXCEPTION 'a non-admin caller could not see the public active campaign';
  END IF;
  IF (SELECT count(*) FROM public.business_sales_prospects) <> 0
     OR (SELECT count(*) FROM public.business_sales_activities) <> 0 THEN
    RAISE EXCEPTION 'a non-admin caller read private Boxont sales records';
  END IF;
  BEGIN
    INSERT INTO public.business_sales_prospects (listing_id, stage)
    VALUES ('b2', 'identified');
    RAISE EXCEPTION 'a non-admin caller inserted a sales prospect';
  EXCEPTION WHEN insufficient_privilege THEN
    NULL;
  END;
  BEGIN
    INSERT INTO public.listing_promotions
      (listing_id, placement, target_category, starts_at, ends_at, status)
    VALUES ('b1', 'category_featured', 'salons', now(), now() + interval '1 day', 'draft');
    RAISE EXCEPTION 'a non-admin caller inserted a promotion';
  EXCEPTION WHEN insufficient_privilege THEN
    NULL;
  END;
  UPDATE public.contact_messages
    SET quote_amount_npr = 999, payment_status = 'quoted'
    WHERE id = (SELECT id FROM public.contact_messages WHERE name = 'SEWA CI Rate Test' ORDER BY id LIMIT 1);
  IF (SELECT count(*) FROM public.contact_messages WHERE name = 'SEWA CI Rate Test' AND quote_amount_npr IS NOT NULL) <> 0 THEN
    RAISE EXCEPTION 'a non-admin caller updated commercial quote fields';
  END IF;
END
$$;

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
  IF (SELECT count(*) FROM public.business_sales_prospects WHERE listing_id = 'b1') <> 1
     OR (SELECT count(*) FROM public.business_sales_activities a
         JOIN public.business_sales_prospects p ON p.id = a.prospect_id
         WHERE p.listing_id = 'b1') <> 2 THEN
    RAISE EXCEPTION 'the administrator could not read private prospect history';
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
$$;
RESET ROLE;

SELECT 'SEWA disposable database migration and security checks passed' AS result;
