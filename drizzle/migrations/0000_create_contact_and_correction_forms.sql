CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 100),
  business_name text CHECK (business_name IS NULL OR char_length(business_name) <= 150),
  phone text CHECK (phone IS NULL OR char_length(phone) <= 30),
  message text NOT NULL CHECK (char_length(message) BETWEEN 1 AND 2000),
  source_listing_slug text CHECK (source_listing_slug IS NULL OR char_length(source_listing_slug) <= 100),
  page text NOT NULL DEFAULT 'contact' CHECK (char_length(page) <= 100)
);
GRANT INSERT ON public.contact_messages TO anon, authenticated;
GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can send a contact message" ON public.contact_messages FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE TABLE public.correction_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  listing_slug text NOT NULL CHECK (char_length(listing_slug) BETWEEN 1 AND 100),
  whats_wrong text NOT NULL CHECK (char_length(whats_wrong) BETWEEN 1 AND 2000),
  contact text CHECK (contact IS NULL OR char_length(contact) <= 150)
);
GRANT INSERT ON public.correction_reports TO anon, authenticated;
GRANT ALL ON public.correction_reports TO service_role;
ALTER TABLE public.correction_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can report a correction" ON public.correction_reports FOR INSERT TO anon, authenticated WITH CHECK (true);