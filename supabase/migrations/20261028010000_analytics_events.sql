CREATE TABLE public.analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  event text NOT NULL CHECK (event IN ('search','search_zero','click_call','click_whatsapp','click_directions','click_website','click_instagram','save','claim_click','preview_click')),
  listing_slug text NULL CHECK (listing_slug IS NULL OR char_length(listing_slug) <= 120),
  query text NULL CHECK (query IS NULL OR (char_length(query) <= 80 AND query = lower(btrim(query)))),
  lang text NULL CHECK (lang IS NULL OR char_length(lang) <= 5),
  path text NULL CHECK (path IS NULL OR char_length(path) <= 200)
);
CREATE INDEX analytics_events_event_created_idx ON public.analytics_events (event, created_at);
GRANT INSERT (event, listing_slug, query, lang, path) ON public.analytics_events TO anon, authenticated;
GRANT SELECT ON public.analytics_events TO authenticated;
GRANT ALL ON public.analytics_events TO service_role;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can record an anonymous event" ON public.analytics_events
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    (listing_slug IS NULL OR char_length(listing_slug) <= 120)
    AND (query IS NULL OR char_length(query) <= 80)
    AND (lang IS NULL OR char_length(lang) <= 5)
    AND (path IS NULL OR char_length(path) <= 200)
  );
CREATE POLICY "Admins can read events" ON public.analytics_events
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));