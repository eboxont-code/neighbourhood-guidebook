ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS client_key text CHECK (client_key IS NULL OR char_length(client_key) <= 64);
ALTER TABLE public.correction_reports ADD COLUMN IF NOT EXISTS client_key text CHECK (client_key IS NULL OR char_length(client_key) <= 64);

CREATE TABLE public.form_rate_log (
  id bigserial PRIMARY KEY,
  key_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.form_rate_log TO service_role;
ALTER TABLE public.form_rate_log ENABLE ROW LEVEL SECURITY;
CREATE INDEX form_rate_log_key_time ON public.form_rate_log (key_hash, created_at);

CREATE OR REPLACE FUNCTION public.enforce_form_rate_limit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  hdr json;
  ip text;
  keys text[] := ARRAY[]::text[];
  k text;
BEGIN
  BEGIN
    hdr := current_setting('request.headers', true)::json;
  EXCEPTION WHEN others THEN hdr := NULL;
  END;
  ip := split_part(coalesce(hdr->>'cf-connecting-ip', hdr->>'x-real-ip', hdr->>'x-forwarded-for', ''), ',', 1);
  IF ip <> '' THEN keys := keys || md5('ip:' || trim(ip)); END IF;
  IF NEW.client_key IS NOT NULL AND NEW.client_key <> '' THEN keys := keys || md5('s:' || NEW.client_key); END IF;
  NEW.client_key := NULL;

  DELETE FROM public.form_rate_log WHERE created_at < now() - interval '1 day';

  FOREACH k IN ARRAY keys LOOP
    IF (SELECT count(*) FROM public.form_rate_log WHERE key_hash = k AND created_at > now() - interval '10 minutes') >= 3 THEN
      RAISE EXCEPTION 'rate_limited' USING ERRCODE = 'P0001';
    END IF;
  END LOOP;
  IF (SELECT count(*) FROM public.form_rate_log WHERE key_hash = 'all' AND created_at > now() - interval '1 hour') >= 100 THEN
    RAISE EXCEPTION 'rate_limited' USING ERRCODE = 'P0001';
  END IF;

  FOREACH k IN ARRAY keys LOOP
    INSERT INTO public.form_rate_log (key_hash) VALUES (k);
  END LOOP;
  INSERT INTO public.form_rate_log (key_hash) VALUES ('all');
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.enforce_form_rate_limit() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER contact_messages_rate_limit BEFORE INSERT ON public.contact_messages
  FOR EACH ROW EXECUTE FUNCTION public.enforce_form_rate_limit();
CREATE TRIGGER correction_reports_rate_limit BEFORE INSERT ON public.correction_reports
  FOR EACH ROW EXECUTE FUNCTION public.enforce_form_rate_limit();