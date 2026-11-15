import { businesses, liveSlugRedirects, setListings } from "@/data/directory";
import { fetchPublishedListings } from "@/lib/listings.functions";
import { reportSewaError } from "@/lib/sewa-error-reporting";

/** How long a loaded set of listings is reused before asking the database again. */
export const LISTINGS_TTL_MS = 60_000;
let loadedAt = 0;
let inflight: Promise<void> | null = null;

/**
 * Makes sure the live listings are fresh. Runs in the root beforeLoad, which finishes before
 * any child route loads, so every page sees the same set. On failure the current set (the
 * bundled snapshot at first) stays in place.
 */
export function ensureListings(): Promise<void> {
  if (Date.now() - loadedAt < LISTINGS_TTL_MS) return Promise.resolve();
  inflight ??= fetchPublishedListings()
    .then((r) => { if (r) setListings(r.items, r.redirects); })
    .catch((e) => {
      if (typeof window !== "undefined") reportSewaError(e, { source: "listings-refresh" });
      else console.error("[listings] refresh failed, keeping current set", e);
    })
    .finally(() => { loadedAt = Date.now(); inflight = null; });
  return inflight;
}

/** Sent with the server HTML so the browser starts from exactly the listings the server rendered. */
export const dehydrateListings = () => ({ items: [...businesses], redirects: { ...liveSlugRedirects } });
export function hydrateListings(d: { items: typeof businesses; redirects: Record<string, string> } | undefined) {
  if (!d) return;
  setListings(d.items, d.redirects);
  loadedAt = Date.now();
}
/** Forget the cache, e.g. right after the admin saves, so the next page load reads fresh data. */
export const expireListings = () => { loadedAt = 0; };
