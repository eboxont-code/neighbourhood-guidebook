-- Listings, slug redirects and the admin role. Safe to run as is on a fresh project
-- (after 0000 and 0001) and safe to run again: every statement is guarded.

-- Roles
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO anon, authenticated, service_role;

DROP POLICY IF EXISTS "Users can read their own roles" ON public.user_roles;
CREATE POLICY "Users can read their own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

-- Listings
CREATE TABLE IF NOT EXISTS public.listings (
  id text PRIMARY KEY,
  slug text NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' AND char_length(slug) <= 100),
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 150),
  city text NOT NULL DEFAULT 'kathmandu',
  area text NOT NULL,
  category text NOT NULL,
  status text NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'hidden')),
  sort_order integer NOT NULL DEFAULT 0,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS listings_status_sort_idx ON public.listings (status, sort_order);
GRANT SELECT ON public.listings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.listings TO authenticated;
GRANT ALL ON public.listings TO service_role;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read published listings" ON public.listings;
CREATE POLICY "Anyone can read published listings" ON public.listings FOR SELECT TO anon, authenticated USING (status = 'published');
DROP POLICY IF EXISTS "Admins can read all listings" ON public.listings;
CREATE POLICY "Admins can read all listings" ON public.listings FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins can add listings" ON public.listings;
CREATE POLICY "Admins can add listings" ON public.listings FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins can change listings" ON public.listings;
CREATE POLICY "Admins can change listings" ON public.listings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins can remove listings" ON public.listings;
CREATE POLICY "Admins can remove listings" ON public.listings FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Old slugs keep working
CREATE TABLE IF NOT EXISTS public.slug_redirects (
  old_slug text PRIMARY KEY,
  new_slug text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.slug_redirects TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.slug_redirects TO authenticated;
GRANT ALL ON public.slug_redirects TO service_role;
ALTER TABLE public.slug_redirects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read slug redirects" ON public.slug_redirects;
CREATE POLICY "Anyone can read slug redirects" ON public.slug_redirects FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Admins can add slug redirects" ON public.slug_redirects;
CREATE POLICY "Admins can add slug redirects" ON public.slug_redirects FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins can change slug redirects" ON public.slug_redirects;
CREATE POLICY "Admins can change slug redirects" ON public.slug_redirects FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins can remove slug redirects" ON public.slug_redirects;
CREATE POLICY "Admins can remove slug redirects" ON public.slug_redirects FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Keep updated_at fresh, and record the old slug whenever a slug changes.
-- Runs as the admin making the change, so RLS still applies to the redirect rows.
CREATE OR REPLACE FUNCTION public.listings_before_update()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.updated_at := now();
  IF NEW.slug IS DISTINCT FROM OLD.slug THEN
    DELETE FROM public.slug_redirects WHERE old_slug = NEW.slug;
    UPDATE public.slug_redirects SET new_slug = NEW.slug WHERE new_slug = OLD.slug;
    INSERT INTO public.slug_redirects (old_slug, new_slug) VALUES (OLD.slug, NEW.slug)
      ON CONFLICT (old_slug) DO UPDATE SET new_slug = EXCLUDED.new_slug;
  END IF;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS listings_before_update ON public.listings;
CREATE TRIGGER listings_before_update BEFORE UPDATE ON public.listings FOR EACH ROW EXECUTE FUNCTION public.listings_before_update();

-- Admins can read form submissions; everyone else stays insert-only.
DROP POLICY IF EXISTS "Admins can read contact messages" ON public.contact_messages;
CREATE POLICY "Admins can read contact messages" ON public.contact_messages FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
GRANT SELECT ON public.contact_messages TO authenticated;
DROP POLICY IF EXISTS "Admins can read correction reports" ON public.correction_reports;
CREATE POLICY "Admins can read correction reports" ON public.correction_reports FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
GRANT SELECT ON public.correction_reports TO authenticated;

-- Seed: the listings as they were in code, in the same order.
INSERT INTO public.listings (id, slug, name, city, area, category, status, sort_order, data) VALUES
('b1','aavaran-durbar-marg','Aavaran Skin & Hair Clinic','kathmandu','durbar-marg','clinics','published',10,'{"services":[],"verification":"source_checked","demo":false,"cover":{"url":"https://www.aavaranskin.com/uploaded_images/seo/aavaran-skin-clinic-225940.JPG","credit":"aavaranskin.com"},"address":"Durbar Marg, next to ANTA showroom, Kathmandu","phone":"9802323990","website":"https://www.aavaranskin.com","websiteStatus":"working","lastChecked":"2026-10-11","hours":[{"days":"Sun–Fri","time":"11:00–19:00"},{"days":"Sat","time":"11:00–18:00"}],"hoursSource":"their own about page","hoursVerified":true,"social":["Facebook aavaranclinic","TikTok @aavaranskinclinic","YouTube @aavaranskinhairclinic833"],"directions":"https://www.google.com/maps/search/?api=1&query=Aavaran+Skin+Hair+Clinic+Durbar+Marg+Kathmandu","sourceNotes":"Their own website","addedOn":"2026-10-11"}'),
('b2','the-new-barber-durbar-marg','The New Barber, Durbar Marg branch','kathmandu','durbar-marg','barbers','published',20,'{"services":[],"verification":"source_checked","demo":false,"address":"Durbar Marg, Kathmandu","phone":"01-5367872","website":"https://www.thenewbarber.com.np","websiteStatus":"failed","lastChecked":"2026-10-11","hours":[{"days":"Every day","time":"From 10:00, last booking 18:00"}],"hoursSource":"their post","hoursVerified":true,"social":["Instagram thenewbarber.nepal","Facebook thenewbarber.nepal"],"directions":"https://www.google.com/maps/search/?api=1&query=The+New+Barber+Durbar+Marg+Kathmandu","sourceNotes":"Their Instagram","addedOn":"2026-10-11"}'),
('b3','femina-flaunt-naxal','Femina Flaunt Studio Salon','kathmandu','naxal','salons','published',30,'{"services":[],"verification":"source_checked","demo":false,"address":"1st Floor, Shrestha Tower, Nagpokhari Marg, Naxal, Kathmandu","phone":"01-4545676","websiteStatus":"none_found","hours":[{"days":"Every day","time":"11:00–19:00"}],"hoursSource":"their Instagram","hoursVerified":true,"social":["Instagram femina_flaunt_nepal"],"directions":"https://www.google.com/maps/search/?api=1&query=Femina+Flaunt+Salon+Naxal+Kathmandu","sourceNotes":"Their Instagram","addedOn":"2026-10-11"}'),
('b4','toni-and-guy-durbar-mall','TONI&GUY Nepal','kathmandu','durbar-marg','salons','published',40,'{"services":[],"verification":"source_checked","demo":false,"address":"3rd Floor, Durbar Mall, Durbar Marg, Kathmandu","phone":"9851088880","websiteStatus":"none_found","hours":[{"days":"Every day","time":"10:00–19:00"}],"hoursSource":"the global TONI&GUY Kathmandu page","hoursVerified":false,"social":["Instagram toniandguynepal","Facebook toniandguynepal"],"directions":"https://www.google.com/maps/search/?api=1&query=TONI+and+GUY+Durbar+Mall+Kathmandu","sourceNotes":"Their Instagram","addedOn":"2026-10-11"}'),
('b5','munney-durbar-marg','Munney Salon, Durbar Marg','kathmandu','durbar-marg','salons','published',50,'{"services":[],"verification":"source_checked","demo":false,"address":"Durbar Marg, Kathmandu","phone":"9819412614","website":"https://munneysalon.com","websiteStatus":"not_checked","hours":[{"days":"","time":"10:00–20:00"}],"hoursSource":"their Instagram","hoursVerified":true,"social":["Instagram munney_salon","Facebook munneysalondurbarmarg","TikTok @munneysalon"],"directions":"https://www.google.com/maps/search/?api=1&query=Munney+Salon+Durbar+Marg+Kathmandu","sourceNotes":"Their Instagram; website as listed on their Facebook","addedOn":"2026-10-11"}'),
('b6','tranquility-spa','Tranquility Spa','kathmandu','lazimpat','spas','published',60,'{"services":[],"verification":"source_checked","demo":false,"cover":{"url":"https://www.tranquilityspa.com.np/uploads/images/galleries/03534099-dc1e-46d4-b007-0a62f39a0cf9.jpg","credit":"tranquilityspa.com.np"},"address":"Lazimpat Road, opposite MBL Tower, Kathmandu (one of several branches)","phone":"9802021285","otherPhones":[{"number":"01-4425386","note":"fromOtherListings"},{"number":"01-5318396","note":"fromOtherListings"}],"website":"https://www.tranquilityspa.com.np","websiteStatus":"working","lastChecked":"2026-10-11","hours":[{"days":"Every day","time":"08:00–21:00"}],"hoursSource":"one directory listing","hoursVerified":false,"description":"Nepal’s largest spa chain, recognised by the Nepal Tourism Board.","directions":"https://www.google.com/maps/search/?api=1&query=Tranquility+Spa+Kathmandu","sourceNotes":"Their own website","addedOn":"2026-10-11"}'),
('b7','plush-lazimpat','Plush Unisex Salon','kathmandu','lazimpat','salons','published',70,'{"services":[],"verification":"source_checked","demo":false,"address":"Lazimpat, near Radisson, Kathmandu","phone":"9808428150","otherPhones":[{"number":"01-4168710"}],"website":"https://plushsalon.com.np","websiteStatus":"not_checked","hours":[{"days":"Every day","time":"10:00–20:00"}],"hoursSource":"their post","hoursVerified":true,"social":["Instagram plush_unisex_salon_np","Facebook plushktm"],"description":"Was in Kamaladi, near Kathmandu Plaza. They posted a move to Lazimpat near Radisson from 17 June 2026.","directions":"https://www.google.com/maps/search/?api=1&query=Plush+Unisex+Salon+Kathmandu","sourceNotes":"Their Facebook page (Plush Salon & Makeup Academy); website as listed there","addedOn":"2026-10-11"}'),
('b8','deezy-cuts-baluwatar','Deezy Cuts','kathmandu','baluwatar','barbers','published',80,'{"services":[],"verification":"source_checked","demo":false,"phone":"9704549439","websiteStatus":"none_found","hours":[{"days":"","time":"08:00–20:00"}],"hoursSource":"an earlier TikTok post","hoursVerified":true,"social":["TikTok deezycuts.np"],"directions":"https://www.google.com/maps/search/?api=1&query=Deezy+Cuts+Baluwatar+Kathmandu","sourceNotes":"Their TikTok","addedOn":"2026-10-11"}'),
('b9','serene-durbar-marg','Serene Salon & Spa','kathmandu','durbar-marg','salons','published',90,'{"services":[],"verification":"source_checked","demo":false,"address":"Yak & Yeti Lane, Durbar Marg, Kathmandu","phone":"01-5322702","otherPhones":[{"number":"9802335552"}],"websiteStatus":"none_found","hours":[{"days":"Every day","time":"09:00–22:00"}],"hoursSource":"a directory listing","hoursVerified":false,"social":["Instagram serenewellnessnepal","Facebook serenewellnessnepal"],"directions":"https://www.google.com/maps/search/?api=1&query=Serene+Salon+Spa+Yak+Yeti+Lane+Durbar+Marg","sourceNotes":"Their Instagram and Facebook page","addedOn":"2026-10-11"}'),
('b10','club-oasis-hyatt','Club Oasis, Hyatt Regency Kathmandu','kathmandu','boudha','spas','published',100,'{"services":[],"verification":"source_checked","demo":false,"lat":27.7220039,"lng":85.3568175,"address":"Hyatt Regency Kathmandu, Taragaon, Boudha, Kathmandu","phone":"01-5171234","website":"https://www.hyatt.com/hyatt-regency/en-US/kathm-hyatt-regency-kathmandu","websiteStatus":"not_checked","description":"Spa bookings go through the hotel. The phone is the hotel''s number.","directions":"https://www.google.com/maps/search/?api=1&query=Hyatt+Regency+Kathmandu+Club+Oasis","sourceNotes":"The hotel''s official contact page","addedOn":"2026-10-11"}'),
('b11','lavish-durbar-marg','Lavish Salon & Academy','kathmandu','durbar-marg','salons','published',110,'{"services":[],"verification":"source_checked","demo":false,"address":"Hitipokhari, Durbar Marg, Kathmandu","phone":"01-4542030","otherPhones":[{"number":"9808018075"}],"websiteStatus":"none_found","social":["Instagram lavishsalon.np"],"directions":"https://www.google.com/maps/search/?api=1&query=Lavish+Salon+Academy+Durbar+Marg","sourceNotes":"Their Instagram","addedOn":"2026-10-11"}'),
('b12','nuad-thai-lazimpat','Nuad Thai Spa, Panipokhari','kathmandu','lazimpat','spas','published',120,'{"services":[],"verification":"source_checked","demo":false,"lat":27.7284896,"lng":85.3250871,"address":"Panipokhari, Lazimpat, Kathmandu","phone":"01-4002808","websiteStatus":"none_found","social":["Instagram nuadthaispa.nepal"],"directions":"https://www.google.com/maps/search/?api=1&query=Nuad+Thai+Spa+Panipokhari+Lazimpat","sourceNotes":"Their Instagram","addedOn":"2026-10-11"}'),
('b13','kathmandu-spa-thamel','Kathmandu Spa','kathmandu','thamel','spas','published',130,'{"services":[],"verification":"source_checked","demo":false,"lat":27.716144,"lng":85.3110464,"address":"Bhagawati Marg, Thamel, Kathmandu","phone":"01-4522661","website":"https://kathmanduspa.com.np","websiteStatus":"not_checked","social":["Facebook kathmanduspa"],"directions":"https://www.google.com/maps/search/?api=1&query=Kathmandu+Spa+Thamel","sourceNotes":"Their Facebook page (Kathmandu Spa Pvt. Ltd.)","addedOn":"2026-10-11"}'),
('b14','kaya-healing-thamel','Kaya Healing Spa','kathmandu','thamel','spas','published',140,'{"services":[],"verification":"source_checked","demo":false,"lat":27.7158128,"lng":85.3103243,"address":"Hotel Northfield, Chaksibari Marg, Thamel, Kathmandu","phone":"9803038823","otherPhones":[{"number":"01-5355882"}],"website":"https://www.kayaspa.com.np","websiteStatus":"failed","social":["Instagram kayaspa.thamel"],"directions":"https://www.google.com/maps/search/?api=1&query=Kaya+Healing+Spa+Thamel","sourceNotes":"Their Instagram","addedOn":"2026-10-11"}'),
('b15','crest-club-lazimpat','Crest Club and Spa','kathmandu','lazimpat','spas','published',150,'{"services":[],"verification":"source_checked","demo":false,"lat":27.719318,"lng":85.3206915,"address":"Dusit Princess Kathmandu, Lazimpat, Kathmandu","phone":"9802352729","websiteStatus":"none_found","social":["Instagram crestclubandspa"],"directions":"https://www.google.com/maps/search/?api=1&query=Crest+Club+Spa+Dusit+Princess+Lazimpat","sourceNotes":"Their Instagram","addedOn":"2026-10-11"}'),
('b16','the-new-barber-thamel','The New Barber, Thamel branch','kathmandu','thamel','barbers','published',160,'{"services":[],"verification":"source_checked","demo":false,"address":"Thamel, Kathmandu","phone":"01-5908499","websiteStatus":"not_checked","hours":[{"days":"Every day","time":"From 10:00, last booking 18:00"}],"hoursSource":"their post","hoursVerified":true,"social":["Instagram thenewbarber.nepal"],"description":"Same brand as the Durbar Marg shop, different branch.","directions":"https://www.google.com/maps/search/?api=1&query=The+New+Barber+Thamel+Kathmandu","sourceNotes":"Their Instagram","addedOn":"2026-10-11"}'),
('b17','the-new-barber-boudha','The New Barber, Boudha branch','kathmandu','boudha','barbers','published',170,'{"services":[],"verification":"source_checked","demo":false,"address":"Boudha, Kathmandu","phone":"01-4567713","websiteStatus":"not_checked","hours":[{"days":"Every day","time":"From 10:00, last booking 18:00"}],"hoursSource":"their post","hoursVerified":true,"social":["Instagram thenewbarber.nepal"],"description":"Same brand as the Durbar Marg shop, different branch.","directions":"https://www.google.com/maps/search/?api=1&query=The+New+Barber+Boudha+Kathmandu","sourceNotes":"Their Instagram","addedOn":"2026-10-11"}'),
('b18','bliss-sakil-durbar-marg','Bliss by Sakil Kunwar','kathmandu','durbar-marg','salons','published',180,'{"services":[],"verification":"source_checked","demo":false,"address":"Level 2, Durbar Marg, Kathmandu","phone":"01-5339065","websiteStatus":"none_found","hours":[{"days":"","time":"10:00–20:00"}],"hoursSource":"his page","hoursVerified":true,"social":["Facebook collage.sakil"],"directions":"https://www.google.com/maps/search/?api=1&query=Bliss+by+Sakil+Kunwar+Durbar+Marg","sourceNotes":"Sakil Kunwar''s Facebook page","addedOn":"2026-10-11"}'),
('b19','annapurna-salon-durbar-marg','Annapurna Salon & Spa','kathmandu','durbar-marg','salons','published',190,'{"services":[],"verification":"source_checked","demo":false,"address":"3rd Floor, Annapurna Arcade, Durbar Marg, Kathmandu","phone":"9818981221","website":"https://annapurnasalon.com.np","websiteStatus":"not_checked","hours":[{"days":"Sunday to Saturday","time":"9:30–19:00"}],"hoursSource":"their own contact page","hoursVerified":true,"sourceNotes":"Their own website (contact page)","addedOn":"2026-10-11"}'),
('b20','hair-n-shanti-kamaladi','Hair n Shanti, Kamaladi','kathmandu','kamaladi','salons','published',200,'{"services":[],"verification":"source_checked","demo":false,"address":"Siddhartha Complex, Kamaladi, Durbar Marg, Kathmandu","phone":"01-4428463","website":"https://hairnshantinepal.com","websiteStatus":"not_checked","sourceNotes":"Their own website (contacts page)","addedOn":"2026-10-11"}'),
('b21','himalayan-java-mandala-street','Himalayan Java Coffee, Mandala Street','kathmandu','thamel','cafes','published',210,'{"services":[],"verification":"source_checked","demo":false,"address":"Mandala Street, Thamel, Kathmandu","phone":"01-4700627","website":"https://himalayanjava.com","websiteStatus":"working","lastChecked":"2026-10-11","lat":27.714949,"lng":85.3109555,"sourceNotes":"Their own website (Mandala Street branch page)","sourceUrl":"https://himalayanjava.com/locations/mandala-street/","addedOn":"2026-10-12"}'),
('b22','himalayan-java-lazimpat','Himalayan Java Coffee, Lazimpat','kathmandu','lazimpat','cafes','published',220,'{"services":[],"verification":"source_checked","demo":false,"address":"Bhanu Memorial Marg, Lazimpat, Kathmandu","phone":"01-4538305","website":"https://himalayanjava.com","websiteStatus":"working","lastChecked":"2026-10-11","sourceNotes":"Their own website (Lazimpat branch page)","sourceUrl":"https://himalayanjava.com/locations/lazimpat/","addedOn":"2026-10-12"}'),
('b23','caffeophilia-durbar-marg','Caffeophilia, Durbar Marg','kathmandu','durbar-marg','cafes','published',230,'{"services":[],"verification":"source_checked","demo":false,"address":"Lal Durbar Marg, Durbar Marg, Kathmandu","phone":"9709420430","website":"https://caffeophilia.com","websiteStatus":"working","lastChecked":"2026-10-11","sourceNotes":"Their own website (locations page)","sourceUrl":"https://caffeophilia.com/locations","addedOn":"2026-10-12"}'),
('b24','filli-cafe-lazimpat','FiLLi Cafe, Lazimpat','kathmandu','lazimpat','cafes','published',240,'{"services":[],"verification":"source_checked","demo":false,"address":"Lazimpat Road, Kathmandu","phone":"9820105007","website":"https://fillicafe.com","websiteStatus":"working","lastChecked":"2026-10-11","hours":[{"days":"Every day","time":"07:00–22:00"}],"hoursSource":"their own store page","hoursVerified":true,"sourceNotes":"Their own website (Lazimpat store page)","sourceUrl":"https://fillicafe.com/np/stores/kathmandu/lazimpat-kathmandu","addedOn":"2026-10-12"}'),
('b25','peedee-beans-boudha','PeeDee Beans Coffee','kathmandu','boudha','cafes','published',250,'{"services":[],"verification":"source_checked","demo":false,"address":"Boudha Stupa, Kathmandu","phone":"9860671298","website":"https://peedeebeans.com","websiteStatus":"working","lastChecked":"2026-10-11","hours":[{"days":"Every day","time":"06:00–22:30"}],"hoursSource":"their own website","hoursVerified":true,"lat":27.7210506,"lng":85.3624124,"sourceNotes":"Their own website","sourceUrl":"https://peedeebeans.com/","addedOn":"2026-10-12"}'),
('b26','roadhouse-cafe-thamel','Roadhouse Cafe, Thamel','kathmandu','thamel','restaurants','published',260,'{"services":[],"verification":"source_checked","demo":false,"address":"Thamel, Kathmandu","phone":"01-5367885","otherPhones":[{"number":"9863029293"}],"website":"https://www.roadhousenepal.com","websiteStatus":"working","lastChecked":"2026-10-11","sourceNotes":"Their own website (Thamel page)","sourceUrl":"https://www.roadhousenepal.com/restaurants/thamel","addedOn":"2026-10-12"}'),
('b27','roadhouse-cafe-boudha','Roadhouse Cafe, Boudha','kathmandu','boudha','restaurants','published',270,'{"services":[],"verification":"source_checked","demo":false,"address":"Boudha Stupa circle, Kathmandu","phone":"01-4916446","otherPhones":[{"number":"9863029297"}],"website":"https://www.roadhousenepal.com","websiteStatus":"working","lastChecked":"2026-10-11","lat":27.7209107,"lng":85.3619714,"sourceNotes":"Their own website (Boudha page)","sourceUrl":"https://www.roadhousenepal.com/restaurants/boudha","addedOn":"2026-10-12"}'),
('b28','mezze-by-roadhouse-durbar-marg','Mezze by Roadhouse','kathmandu','durbar-marg','restaurants','published',280,'{"services":[],"verification":"source_checked","demo":false,"address":"Rooftop, Durbar Marg, Kathmandu","phone":"01-5323087","otherPhones":[{"number":"9843737736"}],"website":"https://www.roadhousenepal.com","websiteStatus":"working","lastChecked":"2026-10-11","lat":27.7128231,"lng":85.3175004,"sourceNotes":"Their own website (Mezze page)","sourceUrl":"https://www.roadhousenepal.com/restaurants/mezze","addedOn":"2026-10-12"}'),
('b29','or2k-thamel','OR2K','kathmandu','thamel','restaurants','published',290,'{"services":[],"verification":"source_checked","demo":false,"address":"Mandala Street, Thamel, Kathmandu","phone":"01-4422097","website":"https://www.or2k.com","websiteStatus":"failed","lastChecked":"2026-10-11","lat":27.7148007,"lng":85.3110168,"sourceNotes":"Two directory listings (Trip.com, Yellow Pages Nepal); their website did not load when checked","sourceUrl":"https://www.yellowpagesnepal.com/or2k-restaurant","addedOn":"2026-10-12"}'),
('b30','wellness-organic-club-lazimpat','Wellness Organic Club','kathmandu','lazimpat','gyms','published',300,'{"services":[],"verification":"source_checked","demo":false,"address":"Metropark Building, 5th floor, Uttar Dhoka, Lazimpat, Kathmandu","phone":"01-4005126","otherPhones":[{"number":"01-4005127"}],"website":"https://wellnessorganicclub.com","websiteStatus":"working","lastChecked":"2026-10-11","hours":[{"days":"Every day","time":"06:00–21:00"}],"hoursSource":"their own website","hoursVerified":true,"lat":27.7183528,"lng":85.3189239,"sourceNotes":"Their own website (gym page)","sourceUrl":"https://wellnessorganicclub.com/gym/","addedOn":"2026-10-12"}'),
('b31','fitness-studio-nepal-lazimpat','Fitness Studio Nepal','kathmandu','lazimpat','gyms','published',310,'{"services":[],"verification":"source_checked","demo":false,"address":"Uttar Dhoka, Lazimpat, Kathmandu","phone":"01-4005040","websiteStatus":"none_found","sourceNotes":"One directory listing (BizDire Nepal)","sourceUrl":"https://bizdirenepal.com/fitness-studio-nepal","addedOn":"2026-10-12"}'),
('b32','thamel-physical-fitness','Thamel Physical Fitness','kathmandu','thamel','gyms','published',320,'{"services":[],"verification":"source_checked","demo":false,"address":"Paknajol Marg, Thamel, Kathmandu","phone":"01-4263496","websiteStatus":"none_found","hours":[{"days":"Sun–Fri","time":"06:00–20:30"},{"days":"Sat","time":"Closed"}],"hoursSource":"one directory listing","hoursVerified":false,"sourceNotes":"Directory listings (Kaha6 for address and hours; phone from one other listing)","sourceUrl":"https://kaha6.com/company/thamel-physical-fitness/","addedOn":"2026-10-12"}'),
('b33','hotel-yak-and-yeti-durbar-marg','Hotel Yak & Yeti','kathmandu','durbar-marg','hotels','published',330,'{"services":[],"verification":"source_checked","demo":false,"address":"Paryatak Marg, Durbar Marg, Kathmandu","phone":"01-4248999","otherPhones":[{"number":"01-4240520"}],"website":"https://www.yakandyeti.com","websiteStatus":"working","lastChecked":"2026-10-11","lat":27.711505,"lng":85.319905,"sourceNotes":"Their own website (contact page)","sourceUrl":"https://www.yakandyeti.com/contact-us","addedOn":"2026-10-12"}'),
('b34','kathmandu-guest-house-thamel','Kathmandu Guest House','kathmandu','thamel','hotels','published',340,'{"services":[],"verification":"source_checked","demo":false,"address":"Satghumti, Thamel, Kathmandu","phone":"01-4700632","otherPhones":[{"number":"01-4700800"}],"whatsapp":"9851073793","website":"https://ktmgh.com","websiteStatus":"working","lastChecked":"2026-10-11","lat":27.7155833,"lng":85.310125,"sourceNotes":"Their own website (contact page)","sourceUrl":"https://ktmgh.com/kathmandu-guest-house/contact-kgh-hotel/","addedOn":"2026-10-12"}'),
('b35','hotel-shanker-lazimpat','Hotel Shanker','kathmandu','lazimpat','hotels','published',350,'{"services":[],"verification":"source_checked","demo":false,"address":"Lazimpat, Kathmandu","phone":"01-4510151","otherPhones":[{"number":"01-4510152"}],"website":"https://www.shankerhotel.com.np","websiteStatus":"working","lastChecked":"2026-10-11","lat":27.7189329,"lng":85.3199249,"sourceNotes":"Their own website (contact page)","sourceUrl":"https://www.shankerhotel.com.np/contact-page","addedOn":"2026-10-12"}'),
('b36','radisson-hotel-kathmandu-lazimpat','Radisson Hotel Kathmandu','kathmandu','lazimpat','hotels','published',360,'{"services":[],"verification":"source_checked","demo":false,"address":"Lazimpat, Kathmandu","phone":"01-4511818","website":"https://www.radissonhotels.com/en-us/hotels/radisson-kathmandu","websiteStatus":"not_checked","lat":27.7205961,"lng":85.3204553,"sourceNotes":"The Radisson Hotels website and Hotel Association Nepal","sourceUrl":"https://www.radissonhotels.com/en-us/hotels/radisson-kathmandu","addedOn":"2026-10-12"}'),
('b37','hotel-tibet-international-boudha','Hotel Tibet International','kathmandu','boudha','hotels','published',370,'{"services":[],"verification":"source_checked","demo":false,"address":"Boudha, Kathmandu","phone":"01-4588188","otherPhones":[{"number":"01-4567746"}],"website":"https://hoteltibetintl.com","websiteStatus":"working","lastChecked":"2026-10-11","lat":27.7202958,"lng":85.359504,"sourceNotes":"Their own website (contact page)","sourceUrl":"https://hoteltibetintl.com/inquiry/","addedOn":"2026-10-12"}')
ON CONFLICT (id) DO NOTHING;