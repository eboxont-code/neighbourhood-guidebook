CREATE TABLE public.business_claims (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 listing_slug text NOT NULL CHECK (char_length(btrim(listing_slug)) BETWEEN 1 AND 100),
 listing_id text CHECK (char_length(listing_id) <= 100),
 name text NOT NULL CHECK (char_length(btrim(name)) BETWEEN 1 AND 100),
 role text NOT NULL CHECK (role IN ('owner','manager','staff','other')),
 contact text NOT NULL CHECK (char_length(btrim(contact)) BETWEEN 1 AND 150 AND (btrim(contact) ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' OR (btrim(contact) ~ '^\+?[0-9 ()-]+$' AND char_length(regexp_replace(contact, '[^0-9]', '', 'g')) BETWEEN 7 AND 15))),
 proof_url text NOT NULL CHECK (char_length(proof_url) <= 500 AND proof_url ~* '^https?://[^[:space:]]+$'),
 wants text[] NOT NULL DEFAULT '{}' CHECK (wants <@ ARRAY['hours','photos','services','phone','address','other']::text[] AND cardinality(wants) <= 6),
 note text CHECK (char_length(note) <= 2000),
 status text NOT NULL DEFAULT 'new' CHECK (status IN ('new','verified','rejected')),
 admin_note text CHECK (char_length(admin_note) <= 2000),
 created_at timestamptz NOT NULL DEFAULT now(),
 client_key text CHECK (char_length(client_key) <= 64)
);
GRANT SELECT, UPDATE ON public.business_claims TO authenticated;
GRANT INSERT (listing_slug, listing_id, name, role, contact, proof_url, wants, note, client_key) ON public.business_claims TO anon, authenticated;
GRANT ALL ON public.business_claims TO service_role;
ALTER TABLE public.business_claims ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Visitors submit fresh claims" ON public.business_claims FOR INSERT TO anon, authenticated WITH CHECK (status = 'new' AND admin_note IS NULL);
CREATE POLICY "Admins read claims" ON public.business_claims FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins review claims" ON public.business_claims FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE FUNCTION public.validate_business_claim() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
 SELECT id INTO NEW.listing_id FROM public.listings WHERE slug = NEW.listing_slug AND status = 'published';
 IF NEW.listing_id IS NULL THEN RAISE EXCEPTION 'invalid_listing'; END IF;
 RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.validate_business_claim() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER business_claims_validate BEFORE INSERT ON public.business_claims FOR EACH ROW EXECUTE FUNCTION public.validate_business_claim();
CREATE TRIGGER business_claims_rate_limit BEFORE INSERT ON public.business_claims FOR EACH ROW EXECUTE FUNCTION public.enforce_form_rate_limit();
CREATE INDEX business_claims_created_at_idx ON public.business_claims (created_at DESC);
CREATE INDEX business_claims_status_idx ON public.business_claims (status);