-- Link inbound SEWA enquiries to the private Boxont sales pipeline.
-- contact_messages remains the source of truth for customer, quote and payment data.

ALTER TABLE public.business_sales_prospects
  DROP CONSTRAINT IF EXISTS business_sales_prospects_listing_id_key,
  DROP CONSTRAINT IF EXISTS business_sales_prospects_listing_id_fkey;

ALTER TABLE public.business_sales_prospects
  ALTER COLUMN listing_id DROP NOT NULL,
  ADD COLUMN contact_message_id uuid;

ALTER TABLE public.business_sales_prospects
  ADD CONSTRAINT business_sales_prospects_listing_id_fkey
    FOREIGN KEY (listing_id) REFERENCES public.listings(id) ON DELETE CASCADE,
  ADD CONSTRAINT business_sales_prospects_contact_message_id_fkey
    FOREIGN KEY (contact_message_id) REFERENCES public.contact_messages(id) ON DELETE RESTRICT,
  ADD CONSTRAINT business_sales_prospects_listing_or_message_check
    CHECK (listing_id IS NOT NULL OR contact_message_id IS NOT NULL),
  ADD CONSTRAINT business_sales_prospects_contact_message_id_key UNIQUE (contact_message_id);

-- Manual listing prospects stay unique. Inbound enquiries may create separate opportunities
-- for the same directory business, because each has its own original contact-message record.
CREATE UNIQUE INDEX business_sales_prospects_manual_listing_uidx
  ON public.business_sales_prospects (listing_id)
  WHERE contact_message_id IS NULL;

CREATE INDEX business_sales_prospects_contact_message_idx
  ON public.business_sales_prospects (contact_message_id)
  WHERE contact_message_id IS NOT NULL;
