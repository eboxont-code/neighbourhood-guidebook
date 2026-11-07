-- Count listing-detail visits separately from generated website-preview visits.
-- The event contains only the listing slug and the existing anonymous page context.
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
    'listing_view',
    'preview_click',
    'preview_view',
    'preview_enquiry_click',
    'claim_submit',
    'enquiry_submit',
    'nearby_click',
    'service_package_select',
    'service_quote_submit',
    'sponsored_click'
  ));
