-- Allow anonymous claim-start events with only the existing listing slug and page context.
-- Claim submissions remain recorded only after a successful business_claims insert.
ALTER TABLE public.analytics_events
  DROP CONSTRAINT IF EXISTS analytics_events_event_check;

ALTER TABLE public.analytics_events
  ADD CONSTRAINT analytics_events_event_check
  CHECK (event IN (
    'search',
    'search_zero',
    'click_call',
    'click_whatsapp',
    'click_directions',
    'click_website',
    'click_instagram',
    'save',
    'claim_click',
    'claim_start',
    'listing_view',
    'preview_click',
    'preview_view',
    'preview_enquiry_click',
    'claim_submit',
    'enquiry_start',
    'enquiry_submit',
    'nearby_click',
    'service_package_select',
    'service_quote_submit',
    'sponsored_click'
  ));
