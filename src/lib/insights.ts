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
    if (r.event === "search" && r.query) bump(searches, r.query);
    else if (r.event === "search_zero" && r.query) { bump(zero, r.query); bump(searches, r.query); }
    else if (r.event !== "search" && r.event !== "search_zero") {
      bump(clicks, r.event);
      if (r.listing_slug) bump(listings, r.listing_slug);
    }
  }
  return { searches: top(searches, 20), zero: top(zero, 20), clicks: top(clicks, 20), listings: top(listings, 10) };
}
