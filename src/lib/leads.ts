import { intlDigits } from "@/data/directory";

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

/** Elapsed time in the currently saved lead stage. New leads fall back to their creation time. */
export type LeadStageDurationUnit = "minute" | "hour" | "day" | "month" | "year";
export type LeadStageDuration = { value: number; unit: LeadStageDurationUnit; lessThanMinute?: boolean };

export function leadStageDuration(
  status: string,
  createdAt: string | null | undefined,
  statusChangedAt: string | null | undefined,
  now = Date.now(),
): LeadStageDuration | null {
  const stageStartedAt = statusChangedAt?.trim() || (status === "new" ? createdAt : null);
  if (!stageStartedAt) return null;
  const startedAt = Date.parse(stageStartedAt);
  const elapsedMs = now - startedAt;
  if (!Number.isFinite(startedAt) || elapsedMs < 0) return null;
  if (elapsedMs < 60_000) return { value: 1, unit: "minute", lessThanMinute: true };

  const minutes = Math.floor(elapsedMs / 60_000);
  if (minutes < 60) return { value: minutes, unit: "minute" };
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return { value: hours, unit: "hour" };
  const days = Math.floor(hours / 24);
  if (days < 30) return { value: days, unit: "day" };
  const years = Math.floor(days / 365);
  if (years > 0) return { value: years, unit: "year" };
  return { value: Math.max(1, Math.floor(days / 30)), unit: "month" };
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
