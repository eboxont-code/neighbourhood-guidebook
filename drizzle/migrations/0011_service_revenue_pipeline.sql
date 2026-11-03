ALTER TABLE public.contact_messages
  ADD COLUMN service_package text,
  ADD COLUMN budget_band text,
  ADD COLUMN quote_amount_npr integer,
  ADD COLUMN paid_amount_npr integer NOT NULL DEFAULT 0,
  ADD COLUMN payment_status text NOT NULL DEFAULT 'not_quoted';

ALTER TABLE public.contact_messages
  ADD CONSTRAINT contact_messages_service_package_check CHECK (service_package IS NULL OR service_package IN ('launch', 'growth', 'care')),
  ADD CONSTRAINT contact_messages_budget_band_check CHECK (budget_band IS NULL OR budget_band IN ('under_15000', '15000_30000', '30000_60000', '60000_plus', 'not_sure')),
  ADD CONSTRAINT contact_messages_quote_amount_npr_check CHECK (quote_amount_npr IS NULL OR quote_amount_npr BETWEEN 1 AND 5000000),
  ADD CONSTRAINT contact_messages_paid_amount_npr_check CHECK (paid_amount_npr BETWEEN 0 AND 5000000),
  ADD CONSTRAINT contact_messages_payment_status_check CHECK (payment_status IN ('not_quoted', 'quoted', 'awaiting_payment', 'partially_paid', 'paid', 'cancelled', 'refunded')),
  ADD CONSTRAINT contact_messages_payment_state_check CHECK (
    payment_status IN ('cancelled', 'refunded')
    OR (payment_status = 'not_quoted' AND quote_amount_npr IS NULL AND paid_amount_npr = 0)
    OR (payment_status IN ('quoted', 'awaiting_payment') AND quote_amount_npr IS NOT NULL AND paid_amount_npr = 0)
    OR (payment_status = 'partially_paid' AND quote_amount_npr IS NOT NULL AND paid_amount_npr > 0 AND paid_amount_npr < quote_amount_npr)
    OR (payment_status = 'paid' AND quote_amount_npr IS NOT NULL AND paid_amount_npr = quote_amount_npr)
  );

GRANT INSERT (service_package, budget_band) ON public.contact_messages TO anon, authenticated;
GRANT UPDATE (quote_amount_npr, paid_amount_npr, payment_status) ON public.contact_messages TO authenticated;

ALTER TABLE public.analytics_events DROP CONSTRAINT IF EXISTS analytics_events_event_check;
ALTER TABLE public.analytics_events ADD CONSTRAINT analytics_events_event_check CHECK (event IN ('search','search_zero','click_call','click_whatsapp','click_directions','click_website','click_instagram','save','claim_click','preview_click','preview_view','preview_enquiry_click','claim_submit','enquiry_submit','nearby_click','service_package_select','service_quote_submit'));
