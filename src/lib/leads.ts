import { businesses, intlDigits, liveSlugRedirects, slugRedirects, type Business } from "@/data/directory";
import { offersPreview, previewPath as buildPreviewPath } from "@/lib/preview";

/** Where a lead is in the sales pipeline. Mirrors the contact_messages status CHECK. */
export const leadStatuses = ["new", "contacted", "quoted", "won", "lost"] as const;
export type LeadStatus = (typeof leadStatuses)[number];
export const isLeadStatus = (s: string): s is LeadStatus => (leadStatuses as readonly string[]).includes(s);

/** Which page the message came from, as saved in contact_messages.page. */
export const leadSources = ["preview", "claim", "for-businesses", "listing", "contact"] as const;
export type LeadSource = (typeof leadSources)[number] | "other";
export const leadSource = (page: string | null | undefined): LeadSource =>
  (leadSources as readonly string[]).includes(page ?? "") ? (page as LeadSource) : "other";

/** Sales leads first: owners who came from a preview or a claim are the warmest. */
const warmth: Record<LeadSource, number> = { preview: 0, claim: 1, "for-businesses": 2, listing: 3, contact: 4, other: 5 };
export const leadWarmth = (page: string | null | undefined) => warmth[leadSource(page)];

/** Resolve a lead's recorded source slug to the current published listing. */
type LeadListing = Pick<Business, "slug" | "name" | "websiteStatus" | "website">;

export function leadListingLinks(
  sourceSlug: string | null | undefined,
  items: readonly LeadListing[] = businesses,
  redirects: Readonly<Record<string, string>> = { ...slugRedirects, ...liveSlugRedirects },
): { business: LeadListing; slug: string; previewPath: string | null } | null {
  let currentSlug = sourceSlug?.trim();
  if (!currentSlug) return null;

  const visited = new Set<string>();
  while (currentSlug && !visited.has(currentSlug)) {
    visited.add(currentSlug);
    const business = items.find((item) => item.slug === currentSlug);
    if (business) {
      return {
        business,
        slug: business.slug,
        previewPath: offersPreview(business) ? buildPreviewPath(business.slug) : null,
      };
    }
    currentSlug = redirects[currentSlug]?.trim() ?? "";
  }
  return null;
}

/** Count of leads per status, plus "all". */
export function countByStatus(rows: { status: string }[]): Record<LeadStatus | "all", number> {
  const out = { all: rows.length, new: 0, contacted: 0, quoted: 0, won: 0, lost: 0 };
  for (const r of rows) if (isLeadStatus(r.status)) out[r.status]++;
  return out;
}

/** A tel: link for a Nepali number, or null when it isn't one we can dial. */
export function leadTel(phone: string | null | undefined): string | null {
  const d = (phone ?? "").replace(/\D/g, "");
  return d.length >= 7 ? `tel:+${intlDigits(phone!)}` : null;
}

/** WhatsApp only works for mobiles (98/97...). */
export function leadWhatsapp(phone: string | null | undefined, text: string): string | null {
  const intl = phone ? intlDigits(phone) : "";
  return /^9779[78]\d{8}$/.test(intl) ? `https://wa.me/${intl}?text=${encodeURIComponent(text)}` : null;
}
