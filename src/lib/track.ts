/** Anonymous, first-party counts only: no names, no IDs, no cookies, never any location. */
export const TRACK_EVENTS = ["search", "search_zero", "click_call", "click_whatsapp", "click_directions", "click_website", "click_instagram", "save", "claim_click", "preview_click", "preview_view", "preview_enquiry_click", "claim_submit", "enquiry_submit", "nearby_click", "service_package_select", "service_quote_submit", "sponsored_click"] as const;
export type TrackEvent = (typeof TRACK_EVENTS)[number];

export function trackPayload(event: TrackEvent, extra: { slug?: string; query?: string } = {}) {
  const q = extra.query?.trim().toLowerCase().replace(/\s+/g, " ").slice(0, 80);
  let lang: string | null = null;
  let path: string | null = null;
  try { lang = (localStorage.getItem("dir-lang") ?? "en").slice(0, 5); path = location.pathname.slice(0, 200); } catch { /* no browser */ }
  return { event, listing_slug: extra.slug ? extra.slug.slice(0, 120) : null, query: q ? q : null, lang, path };
}

export function track(event: TrackEvent, extra: { slug?: string; query?: string } = {}): void {
  try {
    if (typeof window === "undefined") return;
    if (navigator.doNotTrack === "1") return;
    // Capture the originating page now, before loading the client or navigating away.
    const payload = trackPayload(event, extra);
    void import("@/integrations/supabase/client")
      .then(({ supabase }) => supabase.from("analytics_events").insert(payload))
      .then(() => undefined, () => undefined);
  } catch { /* never block the page */ }
}
