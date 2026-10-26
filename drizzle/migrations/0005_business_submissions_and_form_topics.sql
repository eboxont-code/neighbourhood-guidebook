ALTER TABLE public.contact_messages ADD COLUMN topic text CHECK (topic IS NULL OR topic IN ('claim', 'fix', 'website', 'add', 'other'));
ALTER TABLE public.correction_reports ADD COLUMN correction_type text CHECK (correction_type IS NULL OR correction_type IN ('closed', 'phone', 'hours', 'location', 'category', 'duplicate', 'other'));
CREATE TABLE public.business_submissions (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 created_at timestamptz NOT NULL DEFAULT now(),
 business_name text NOT NULL CHECK (char_length(btrim(business_name)) BETWEEN 1 AND 150),
 category text NOT NULL CHECK (category IN ('salons','barbers','spas','clinics','cafes','restaurants','gyms','hotels')),
 area text NOT NULL CHECK (area IN ('durbar-marg','naxal','kamaladi','baluwatar','boudha','thamel','lazimpat','other')),
 address text CHECK (char_length(address) <= 500),
 phone text CHECK (char_length(phone) <= 30),
 website text CHECK (char_length(website) <= 500 AND (website IS NULL OR website ~* '^https?://[^[:space:]]+$')),
 opening_hours text CHECK (char_length(opening_hours) <= 1000),
 is_owner boolean NOT NULL DEFAULT false,
 name text CHECK (char_length(name) <= 100),
 contact text NOT NULL CHECK (char_length(btrim(contact)) BETWEEN 1 AND 150 AND (btrim(contact) ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' OR (btrim(contact) ~ '^\+?[0-9 ()-]+$' AND char_length(regexp_replace(contact, '[^0-9]', '', 'g')) BETWEEN 7 AND 15))),
 note text CHECK (char_length(note) <= 2000),
 client_key text CHECK (char_length(client_key) <= 64),
 status text NOT NULL DEFAULT 'new' CHECK (status IN ('new','approved','rejected','duplicate')),
 admin_note text CHECK (char_length(admin_note) <= 2000)
);
GRANT SELECT, INSERT, UPDATE ON public.business_submissions TO authenticated;
GRANT INSERT ON public.business_submissions TO anon;
GRANT ALL ON public.business_submissions TO service_role;
ALTER TABLE public.business_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Visitors submit new businesses" ON public.business_submissions FOR INSERT TO anon, authenticated WITH CHECK (status = 'new' AND admin_note IS NULL);
CREATE POLICY "Admins read business submissions" ON public.business_submissions FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins review business submissions" ON public.business_submissions FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE TRIGGER business_submissions_rate_limit BEFORE INSERT ON public.business_submissions FOR EACH ROW EXECUTE FUNCTION public.enforce_form_rate_limit();
CREATE INDEX business_submissions_created_at_idx ON public.business_submissions (created_at DESC);
