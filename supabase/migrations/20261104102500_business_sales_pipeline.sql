-- Private Boxont sales pipeline for prospecting from SEWA's published businesses.
-- No outbound messages are sent by this feature. Admins log human-led contact and follow-up.

CREATE TABLE public.business_sales_prospects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id text NOT NULL UNIQUE REFERENCES public.listings(id) ON DELETE CASCADE,
  stage text NOT NULL DEFAULT 'identified'
    CHECK (stage IN ('identified', 'qualified', 'contacted', 'replied', 'meeting', 'proposal', 'won', 'lost', 'do_not_contact')),
  service_interest text NOT NULL DEFAULT 'unsure'
    CHECK (service_interest IN ('website', 'redesign', 'care', 'sponsored_placement', 'unsure')),
  contact_channel text NOT NULL DEFAULT 'none'
    CHECK (contact_channel IN ('whatsapp', 'phone', 'email', 'in_person', 'none')),
  next_follow_up_at timestamptz,
  last_contacted_at timestamptz,
  quote_amount_npr integer,
  paid_amount_npr integer NOT NULL DEFAULT 0,
  notes text,
  created_by uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT business_sales_prospects_quote_check
    CHECK (quote_amount_npr IS NULL OR quote_amount_npr BETWEEN 1 AND 5000000),
  CONSTRAINT business_sales_prospects_paid_check
    CHECK (paid_amount_npr BETWEEN 0 AND 5000000),
  CONSTRAINT business_sales_prospects_paid_quote_check
    CHECK (paid_amount_npr <= coalesce(quote_amount_npr, 0)),
  CONSTRAINT business_sales_prospects_notes_check
    CHECK (notes IS NULL OR char_length(notes) <= 2000)
);

CREATE INDEX business_sales_prospects_stage_updated_idx
  ON public.business_sales_prospects (stage, updated_at DESC);
CREATE INDEX business_sales_prospects_follow_up_idx
  ON public.business_sales_prospects (next_follow_up_at)
  WHERE next_follow_up_at IS NOT NULL
    AND stage NOT IN ('won', 'lost', 'do_not_contact');

CREATE TABLE public.business_sales_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prospect_id uuid NOT NULL REFERENCES public.business_sales_prospects(id) ON DELETE CASCADE,
  activity_type text NOT NULL
    CHECK (activity_type IN ('call', 'whatsapp', 'email', 'meeting', 'follow_up', 'proposal', 'payment', 'note', 'stage_change')),
  summary text NOT NULL CHECK (char_length(summary) BETWEEN 1 AND 1500),
  amount_npr integer,
  happened_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT business_sales_activities_amount_check
    CHECK (amount_npr IS NULL OR amount_npr BETWEEN 1 AND 5000000),
  CONSTRAINT business_sales_activities_amount_type_check
    CHECK (amount_npr IS NULL OR activity_type = 'payment')
);

CREATE INDEX business_sales_activities_prospect_history_idx
  ON public.business_sales_activities (prospect_id, happened_at DESC);

ALTER TABLE public.business_sales_prospects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_sales_activities ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.business_sales_prospects FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.business_sales_activities FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.business_sales_prospects TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.business_sales_activities TO authenticated;
GRANT ALL ON TABLE public.business_sales_prospects TO service_role;
GRANT ALL ON TABLE public.business_sales_activities TO service_role;

CREATE POLICY "Admins manage business sales prospects"
  ON public.business_sales_prospects
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins manage business sales activities"
  ON public.business_sales_activities
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE OR REPLACE FUNCTION public.set_business_sales_prospect_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = pg_catalog
AS $$
BEGIN
  IF NEW.paid_amount_npr < OLD.paid_amount_npr THEN
    RAISE EXCEPTION 'sales_cash_cannot_decrease';
  END IF;
  NEW.updated_at := pg_catalog.now();
  RETURN NEW;
END
$$;

REVOKE ALL ON FUNCTION public.set_business_sales_prospect_updated_at() FROM PUBLIC, anon, authenticated, service_role;

CREATE TRIGGER business_sales_prospects_updated_at
  BEFORE UPDATE ON public.business_sales_prospects
  FOR EACH ROW EXECUTE FUNCTION public.set_business_sales_prospect_updated_at();
