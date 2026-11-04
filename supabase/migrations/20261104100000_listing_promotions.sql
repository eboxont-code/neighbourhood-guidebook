-- The existing Boxont quote form can request the promotion service too.
ALTER TABLE public.contact_messages
  DROP CONSTRAINT IF EXISTS contact_messages_service_package_check;
ALTER TABLE public.contact_messages
  ADD CONSTRAINT contact_messages_service_package_check
  CHECK (service_package IS NULL OR service_package IN ('launch', 'growth', 'care', 'promotion'));

-- SEWA sponsored placements. Campaigns are private to admins until fully paid and in date.
-- Sponsorship affects a clearly labelled promotional slot only; it does not change verification.

CREATE TABLE public.listing_promotions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id text NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  placement text NOT NULL CHECK (placement IN ('area_featured', 'category_featured')),
  target_area text,
  target_category text,
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  quote_amount_npr integer,
  paid_amount_npr integer NOT NULL DEFAULT 0,
  refunded_amount_npr integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT listing_promotions_target_check CHECK (
    (placement = 'area_featured' AND target_area IS NOT NULL AND target_category IS NULL)
    OR
    (placement = 'category_featured' AND target_area IS NULL AND target_category IS NOT NULL)
  ),
  CONSTRAINT listing_promotions_window_check CHECK (starts_at < ends_at),
  CONSTRAINT listing_promotions_quote_check CHECK (quote_amount_npr IS NULL OR quote_amount_npr BETWEEN 1 AND 5000000),
  CONSTRAINT listing_promotions_paid_check CHECK (paid_amount_npr BETWEEN 0 AND 5000000),
  CONSTRAINT listing_promotions_refund_check CHECK (refunded_amount_npr BETWEEN 0 AND paid_amount_npr),
  CONSTRAINT listing_promotions_status_check CHECK (
    (status = 'draft' AND quote_amount_npr IS NULL AND paid_amount_npr = 0 AND refunded_amount_npr = 0)
    OR
    (status = 'quoted' AND quote_amount_npr IS NOT NULL AND paid_amount_npr = 0 AND refunded_amount_npr = 0)
    OR
    (status = 'paid' AND quote_amount_npr IS NOT NULL AND paid_amount_npr = quote_amount_npr AND refunded_amount_npr = 0)
    OR
    (status = 'cancelled' AND paid_amount_npr = 0 AND refunded_amount_npr = 0)
    OR
    (status = 'refunded' AND quote_amount_npr IS NOT NULL AND paid_amount_npr = quote_amount_npr AND paid_amount_npr > 0 AND refunded_amount_npr = paid_amount_npr)
  )
);

CREATE INDEX listing_promotions_active_window_idx
  ON public.listing_promotions (status, starts_at, ends_at);
CREATE INDEX listing_promotions_listing_idx
  ON public.listing_promotions (listing_id, created_at DESC);

ALTER TABLE public.listing_promotions ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON public.listing_promotions TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.listing_promotions TO authenticated;
GRANT ALL ON public.listing_promotions TO service_role;

CREATE POLICY "Public can read active paid promotions"
  ON public.listing_promotions
  FOR SELECT TO anon, authenticated
  USING (status = 'paid' AND starts_at <= now() AND ends_at > now());

CREATE POLICY "Admins can manage listing promotions"
  ON public.listing_promotions
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- A quoted or paid campaign reserves its placement window. The advisory lock
-- serialises checks for the same slot so two admins cannot sell overlapping dates.
CREATE OR REPLACE FUNCTION public.guard_listing_promotion_slot()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = pg_catalog
AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    IF OLD.status = 'refunded' THEN
      RAISE EXCEPTION 'promotion_refunded_campaign_closed';
    END IF;
    IF OLD.status = 'paid' AND NEW.status NOT IN ('paid', 'refunded') THEN
      RAISE EXCEPTION 'promotion_paid_campaign_terminal';
    END IF;
    IF OLD.status = 'paid' AND (
      NEW.listing_id IS DISTINCT FROM OLD.listing_id
      OR NEW.placement IS DISTINCT FROM OLD.placement
      OR NEW.target_area IS DISTINCT FROM OLD.target_area
      OR NEW.target_category IS DISTINCT FROM OLD.target_category
      OR NEW.starts_at IS DISTINCT FROM OLD.starts_at
      OR NEW.ends_at IS DISTINCT FROM OLD.ends_at
    ) THEN
      RAISE EXCEPTION 'promotion_paid_booking_locked';
    END IF;
    IF OLD.status = 'paid' AND (
      NEW.quote_amount_npr IS DISTINCT FROM OLD.quote_amount_npr
      OR NEW.paid_amount_npr IS DISTINCT FROM OLD.paid_amount_npr
    ) THEN
      RAISE EXCEPTION 'promotion_paid_amount_locked';
    END IF;
  END IF;

  IF NEW.status NOT IN ('quoted', 'paid') THEN
    RETURN NEW;
  END IF;

  PERFORM pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(
      NEW.placement || ':' || coalesce(NEW.target_area, NEW.target_category),
      0
    )
  );

  IF EXISTS (
    SELECT 1
    FROM public.listing_promotions AS existing
    WHERE existing.id <> NEW.id
      AND existing.placement = NEW.placement
      AND coalesce(existing.target_area, existing.target_category)
          = coalesce(NEW.target_area, NEW.target_category)
      AND existing.status IN ('quoted', 'paid')
      AND existing.starts_at < NEW.ends_at
      AND existing.ends_at > NEW.starts_at
  ) THEN
    RAISE EXCEPTION 'promotion_slot_unavailable'
      USING ERRCODE = '23P01';
  END IF;

  RETURN NEW;
END
$$;

REVOKE ALL ON FUNCTION public.guard_listing_promotion_slot() FROM PUBLIC, anon, authenticated, service_role;

CREATE TRIGGER listing_promotions_slot_guard
  BEFORE INSERT OR UPDATE ON public.listing_promotions
  FOR EACH ROW EXECUTE FUNCTION public.guard_listing_promotion_slot();

ALTER TABLE public.analytics_events
  DROP CONSTRAINT IF EXISTS analytics_events_event_check;

ALTER TABLE public.analytics_events
  ADD CONSTRAINT analytics_events_event_check
  CHECK (event IN (
    'search', 'search_zero', 'click_call', 'click_whatsapp', 'click_directions',
    'click_website', 'click_instagram', 'save', 'claim_click', 'preview_click',
    'preview_view', 'preview_enquiry_click', 'claim_submit', 'enquiry_submit',
    'nearby_click', 'service_package_select', 'service_quote_submit', 'sponsored_click'
  ));
