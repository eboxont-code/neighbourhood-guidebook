import { intlDigits } from "@/data/directory";
import { normalizePhone } from "@/lib/admin-listing";

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

/** Count of leads per status, plus "all". */
export function countByStatus(rows: { status: string }[]): Record<LeadStatus | "all", number> {
  const out = { all: rows.length, new: 0, contacted: 0, quoted: 0, won: 0, lost: 0 };
  for (const r of rows) if (isLeadStatus(r.status)) out[r.status]++;
  return out;
}

/** A tel: link for a valid Nepali mobile or Kathmandu landline number. */
export function leadTel(phone: string | null | undefined): string | null {
  const normalized = normalizePhone(phone ?? "");
  return normalized ? `tel:+${intlDigits(normalized)}` : null;
}

/** WhatsApp is offered only for a valid Nepali mobile (97/98...). */
export function leadWhatsapp(phone: string | null | undefined, text: string): string | null {
  const normalized = normalizePhone(phone ?? "");
  const intl = normalized ? intlDigits(normalized) : "";
  return /^9779[78]\d{8}$/.test(intl) ? `https://wa.me/${intl}?text=${encodeURIComponent(text)}` : null;
}

/** Build admin contact actions only from the phone submitted on this specific lead/submission row. */
export function leadContactActions(
  submitted: { phone: string | null | undefined },
  whatsappText: string,
): { tel: string | null; whatsapp: string | null } {
  return {
    tel: leadTel(submitted.phone),
    whatsapp: leadWhatsapp(submitted.phone, whatsappText),
  };
}
