import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import type { Business } from "@/data/directory";
import { z } from "zod";
import { safeExternalHttpUrl } from "@/lib/urls";

export type ListingsPayload = { items: Business[]; redirects: Record<string, string> } | null;

type Row = { id: string; slug: string; name: string; area: string; category: string; data: unknown };

/** Turns untrusted database JSON into the safe Business shape every screen uses. */
const optionalText = (max: number) => z.string().trim().max(max).optional().catch(undefined);

const isHttpUrl = (value: string) => safeExternalHttpUrl(value) !== null;

const safeHttpUrl = z
  .string()
  .trim()
  .max(2048)
  .url()
  .refine(isHttpUrl)
  .optional()
  .catch(undefined);

const safeIsoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine((value) => {
    const date = new Date(`${value}T00:00:00.000Z`);
    return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
  })
  .optional()
  .catch(undefined);

const serviceSchema = z.object({
  name: z.string().trim().min(1).max(120),
  price: optionalText(80),
}).strip();

const hourSchema = z.object({
  days: z.string().trim().min(1).max(80),
  time: z.string().trim().min(1).max(120),
}).strip();

const phoneSchema = z.object({
  number: z.string().trim().min(1).max(30),
  note: z.enum(["fromOtherListings"]).optional().catch(undefined),
}).strip();

const fieldSourceSchema = z.object({
  tier: z.enum(["website", "official_social", "maps", "third_party", "user_submission"]),
  url: safeHttpUrl,
  checked: safeIsoDate,
}).strip();

const fieldSourcesSchema = z.object({
  phone: fieldSourceSchema.optional().catch(undefined),
  hours: fieldSourceSchema.optional().catch(undefined),
  address: fieldSourceSchema.optional().catch(undefined),
  website: fieldSourceSchema.optional().catch(undefined),
  location: fieldSourceSchema.optional().catch(undefined),
}).strip().optional().catch(undefined);

const businessDataSchema = z.object({
  brand: optionalText(150),
  address: optionalText(500),
  phone: optionalText(30),
  whatsapp: optionalText(30),
  website: safeHttpUrl,
  websiteStatus: z.enum(["working", "failed", "owner_no_site", "none_found", "not_checked"]).catch("not_checked"),
  description: optionalText(2000),
  services: z.array(serviceSchema).max(100).catch([]),
  hours: z.array(hourSchema).max(14).optional().catch(undefined),
  hoursSource: optionalText(500),
  hoursVerified: z.boolean().optional().catch(undefined),
  otherPhones: z.array(phoneSchema).max(20).optional().catch(undefined),
  social: z.array(z.string().trim().min(1).max(180)).max(20).optional().catch(undefined),
  directions: safeHttpUrl,
  sourceNotes: z.string().trim().max(1000).catch(""),
  verification: z.enum(["not_verified", "source_checked", "business_confirmed"]).catch("not_verified"),
  lastChecked: safeIsoDate,
  demo: z.boolean().catch(false),
  cover: z.object({
    url: z.string().trim().max(2048).url().refine(isHttpUrl),
    credit: z.string().trim().min(1).max(150),
  }).strip().optional().catch(undefined),
  sourceUrl: safeHttpUrl,
  lat: z.number().finite().min(-90).max(90).optional().catch(undefined),
  lng: z.number().finite().min(-180).max(180).optional().catch(undefined),
  addedOn: safeIsoDate,
  fieldSources: fieldSourcesSchema,
}).strip();

const EMPTY_BUSINESS_DATA = businessDataSchema.parse({});

/** Remove absent optional values recursively so exact optional property types remain truthful. */
function stripUndefined(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stripUndefined);
  if (value && typeof value === "object") {
    const entries = Object.entries(value)
      .filter(([, fieldValue]) => fieldValue !== undefined)
      .map(([key, fieldValue]) => [key, stripUndefined(fieldValue)] as const)
      .filter(([, fieldValue]) => fieldValue !== undefined);
    return entries.length > 0 ? Object.fromEntries(entries) : undefined;
  }
  return value;
}

function normalizedBusinessData(value: unknown): Partial<Business> {
  const parsed = businessDataSchema.safeParse(value);
  const candidate = parsed.success ? parsed.data : EMPTY_BUSINESS_DATA;
  return stripUndefined(candidate) as Partial<Business>;
}

/** Turns a database row back into the Business shape every screen uses, without trusting its JSON blob. */
export function rowToBusiness(r: Row): Business {
  const d = normalizedBusinessData(r.data);
  const storedWebsiteStatus = d.websiteStatus ?? "not_checked";
  const websiteStatus =
    !d.website && (storedWebsiteStatus === "working" || storedWebsiteStatus === "failed")
      ? "not_checked"
      : storedWebsiteStatus;

  return {
    services: d.services ?? [],
    verification: d.verification ?? "not_verified",
    demo: d.demo ?? false,
    sourceNotes: d.sourceNotes ?? "",
    ...d,
    websiteStatus,
    id: r.id,
    slug: r.slug,
    name: r.name,
    area: r.area,
    category: r.category,
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
    const now = new Date().toISOString();
    const [l, r, p] = await Promise.all([
      db.from("listings").select("id, slug, name, area, category, data").eq("status", "published").order("sort_order").order("id"),
      db.from("slug_redirects").select("old_slug, new_slug"),
      db.from("listing_promotions").select("listing_id, placement, target_area, target_category, starts_at, ends_at")
        .eq("status", "paid").lte("starts_at", now).gt("ends_at", now),
    ]);
    if (l.error) throw l.error;
    const redirects: Record<string, string> = {};
    for (const x of r.data ?? []) redirects[x.old_slug] = x.new_slug;
    if (r.error) console.error("[listings] slug redirects unavailable", r.error.message);
    if (p.error) console.warn("[listings] sponsored placements unavailable", p.error.message);
    const promotionMap = new Map<string, NonNullable<Business["promotions"]>>();
    for (const promotion of p.data ?? []) {
      const current = promotionMap.get(promotion.listing_id) ?? [];
      current.push({
        placement: promotion.placement as "area_featured" | "category_featured",
        target_area: promotion.target_area,
        target_category: promotion.target_category,
        starts_at: promotion.starts_at,
        ends_at: promotion.ends_at,
      });
      promotionMap.set(promotion.listing_id, current);
    }
    const items = (l.data ?? []).map((row) => ({
      ...rowToBusiness(row),
      promotions: promotionMap.get(row.id) ?? [],
    }));
    return { items, redirects };
  } catch (e) {
    console.error("[listings] query failed, using bundled snapshot", e instanceof Error ? e.message : e);
    return null;
  }
});
