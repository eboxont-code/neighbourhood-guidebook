import { safeSearchClass } from "@/lib/search-analytics";

export type EventRow = { event: string; listing_slug: string | null; query: string | null; created_at: string };
export type Counted = [string, number][];

const top = (m: Map<string, number>, n: number): Counted => [...m.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, n);
const bump = (m: Map<string, number>, k: string) => m.set(k, (m.get(k) ?? 0) + 1);

/** Aggregates anonymous events for the admin Insights tab. Only rows newer than `days` before `now` count. */
export function summarise(rows: EventRow[], days: number, now = new Date()) {
  const since = now.getTime() - days * 86400000;
  const searches = new Map<string, number>(), zero = new Map<string, number>(), clicks = new Map<string, number>(), listings = new Map<string, number>();
  for (const r of rows) {
    if (new Date(r.created_at).getTime() < since) continue;
    if (r.event === "search") bump(searches, safeSearchClass(r.query ?? undefined));
    else if (r.event === "search_zero") {
      const label = safeSearchClass(r.query ?? undefined);
      bump(zero, label);
      bump(searches, label);
    }
    else if (r.event !== "search" && r.event !== "search_zero") {
      bump(clicks, r.event);
      if (r.listing_slug) bump(listings, r.listing_slug);
    }
  }
  return { searches: top(searches, 20), zero: top(zero, 20), clicks: top(clicks, 20), listings: top(listings, 10) };
}

export const FUNNEL_STEPS = ["preview_click", "preview_view", "preview_enquiry_click", "claim_click", "claim_submit", "enquiry_submit"] as const;
export type FunnelStep = { event: (typeof FUNNEL_STEPS)[number]; count: number; rate: number | null };

/** Funnel counts inside the window; rate is the percentage of the previous step (null for the first step or when the previous count is 0). */
export function funnel(rows: EventRow[], days: number, now = new Date()) {
  const since = now.getTime() - days * 86400000;
  const counts = new Map<string, number>(), views = new Map<string, number>();
  for (const r of rows) {
    if (new Date(r.created_at).getTime() < since) continue;
    bump(counts, r.event);
    if (r.event === "preview_view" && r.listing_slug) bump(views, r.listing_slug);
  }
  const steps: FunnelStep[] = FUNNEL_STEPS.map((event, i) => {
    const count = counts.get(event) ?? 0;
    const prev = i ? counts.get(FUNNEL_STEPS[i - 1]!) ?? 0 : 0;
    return { event, count, rate: i && prev ? Math.round((count / prev) * 100) : null };
  });
  return { steps, topPreviews: top(views, 10) };
}
