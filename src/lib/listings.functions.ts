import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import type { Business } from "@/data/directory";

export type ListingsPayload = { items: Business[]; redirects: Record<string, string> } | null;

type Row = { id: string; slug: string; name: string; area: string; category: string; data: unknown };

/** Turns a database row back into the Business shape every screen uses. */
export function rowToBusiness(r: Row): Business {
  const d = (r.data && typeof r.data === "object" ? r.data : {}) as Partial<Business>;
  return {
    services: [], verification: "source_checked", demo: false, websiteStatus: "not_checked", sourceNotes: "",
    ...d, id: r.id, slug: r.slug, name: r.name, area: r.area, category: r.category,
  };
}

/** Published listings and recorded slug renames, read with the public key. Returns null when the database can't answer. */
export const fetchPublishedListings = createServerFn({ method: "GET" }).handler(async (): Promise<ListingsPayload> => {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) { console.error("[listings] backend not configured, using bundled snapshot"); return null; }
  try {
    const db = createClient<Database>(url, key, {
      auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
      global: { fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      } },
    });
    const [l, r] = await Promise.all([
      db.from("listings").select("id, slug, name, area, category, data").eq("status", "published").order("sort_order").order("id"),
      db.from("slug_redirects").select("old_slug, new_slug"),
    ]);
    if (l.error) throw l.error;
    const redirects: Record<string, string> = {};
    for (const x of r.data ?? []) redirects[x.old_slug] = x.new_slug;
    if (r.error) console.error("[listings] slug redirects unavailable", r.error.message);
    return { items: (l.data ?? []).map(rowToBusiness), redirects };
  } catch (e) {
    console.error("[listings] query failed, using bundled snapshot", e instanceof Error ? e.message : e);
    return null;
  }
});
