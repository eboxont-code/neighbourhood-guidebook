import { businesses, categories, areas, hoursStatus, type Business } from "@/data/directory";

export type Sort = "name" | "open";
export type CatFilters = { area?: string; open?: boolean; sort?: Sort };

/** Reads category-page filters from the URL; anything unknown is dropped so plain URLs stay plain. */
export function parseCatSearch(s: Record<string, unknown>): CatFilters {
  const out: CatFilters = {};
  if (typeof s["area"] === "string" && areas.some((a) => a.slug === s["area"])) out.area = s["area"];
  if (s["open"] === true || s["open"] === "1" || s["open"] === 1 || s["open"] === "true") out.open = true;
  if (s["sort"] === "name" || s["sort"] === "open") out.sort = s["sort"];
  return out;
}

export const isOpen = (b: Business, now: Date | null) => !!now && hoursStatus(b.hours, now).kind === "open";

/** Applies area, open-now and sort. Without a clock, open-now cannot be known, so nothing is hidden for it. */
export function applyCatFilters(items: Business[], f: CatFilters, now: Date | null): Business[] {
  let out = items.filter((b) => (!f.area || b.area === f.area) && (!f.open || !now || isOpen(b, now)));
  out = [...out].sort((a, b) => a.name.localeCompare(b.name));
  if (f.sort === "open" && now) out.sort((a, b) => Number(isOpen(b, now)) - Number(isOpen(a, now)));
  return out;
}

/** Suggested searches built only from categories and areas that really have places. */
export function suggestedSearches(lang: "en" | "ne", template: string): string[] {
  const nm = (x: { name: string; nameNe: string }) => (lang === "ne" ? x.nameNe : x.name);
  const combos: { n: number; label: string }[] = [];
  for (const a of areas) for (const c of categories) {
    const n = businesses.filter((b) => b.area === a.slug && b.category === c.slug).length;
    if (n >= 2) combos.push({ n, label: template.replace("{cat}", nm(c)).replace("{area}", nm(a)) });
  }
  combos.sort((x, y) => y.n - x.n);
  const cats = categories.filter((c) => businesses.some((b) => b.category === c.slug)).map(nm);
  return [...combos.slice(0, 4).map((c) => c.label), ...cats.slice(0, 4)];
}
