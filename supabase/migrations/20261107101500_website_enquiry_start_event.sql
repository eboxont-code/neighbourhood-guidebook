-- Count anonymous website-enquiry form starts separately from successful submissions.
-- The event contains only the optional listing slug and existing anonymous page context.
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
    'enquiry_start',
    'enquiry_submit',
    'nearby_click',
    'service_package_select',
    'service_quote_submit',
    'sponsored_click'
  ));
