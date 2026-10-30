import { businesses, categories, areas, type Business } from "@/data/directory";
import { sortByDistance, type Point } from "@/lib/geo";
import { isOpenState, openState, opensOn } from "@/lib/hours";

export type Sort = "name" | "open" | "near";
export type CatFilters = { area?: string; open?: boolean; sun?: boolean; sat?: boolean; sort?: Sort; view?: "map" };

/** Reads category-page filters from the URL; anything unknown is dropped so plain URLs stay plain. */
export function parseCatSearch(s: Record<string, unknown>): CatFilters {
  const out: CatFilters = {};
  if (typeof s["area"] === "string" && areas.some((a) => a.slug === s["area"])) out.area = s["area"];
  if (s["open"] === true || s["open"] === "1" || s["open"] === 1 || s["open"] === "true") out.open = true;
  const yes = (v: unknown) => v === true || v === "1" || v === 1 || v === "true";
  if (yes(s["sun"])) out.sun = true;
  if (yes(s["sat"])) out.sat = true;
  if (s["sort"] === "name" || s["sort"] === "open" || s["sort"] === "near") out.sort = s["sort"];
  if (s["view"] === "map") out.view = "map";
  return out;
}

/** Open right now in Kathmandu, including "closes soon" and 24-hour places. */
export const isOpen = (b: Business, now: Date | null) => !!now && isOpenState(openState(b.hours, now));

/** Applies area, open-now and sort. Without a clock, open-now cannot be known, so nothing is hidden for it. */
export function applyCatFilters(items: Business[], f: CatFilters, now: Date | null, here: Point | null = null): Business[] {
  let out = items.filter((b) => (!f.area || b.area === f.area) && (!f.open || !now || isOpen(b, now)) && (!f.sun || opensOn(b.hours, 0)) && (!f.sat || opensOn(b.hours, 6)));
  out = [...out].sort((a, b) => a.name.localeCompare(b.name));
  if (f.sort === "open" && now) out.sort((a, b) => Number(isOpen(b, now)) - Number(isOpen(a, now)));
  if (f.sort === "near" && here) out = sortByDistance(out, here);
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

export type SearchState = { q: string; area?: string; open?: boolean; sun?: boolean; sat?: boolean; near?: boolean; view?: "map" };

/** /search params. Plain /search?q= keeps working; unknown values are dropped. */
export function parseSearchParams(s: Record<string, unknown>): SearchState {
  const out: SearchState = { q: typeof s["q"] === "string" ? s["q"] : "" };
  const c = parseCatSearch(s);
  if (c.area) out.area = c.area;
  if (c.open) out.open = true;
  if (c.sun) out.sun = true;
  if (c.sat) out.sat = true;
  if (s["near"] === true || s["near"] === "1" || s["near"] === 1 || s["near"] === "true") out.near = true;
  if (s["view"] === "map") out.view = "map";
  return out;
}

const norm = (x: string) => x.toLowerCase().replace(/\s+/g, " ").trim();
/** Finds an area name (English or Nepali) inside a search like "spa near lazimpat" and returns the rest of the query. */
export function splitAreaQuery(q: string): { area?: string; rest: string } {
  const text = ` ${norm(q)} `;
  const hit = [...areas].sort((a, b) => b.name.length - a.name.length).map((a) => {
    for (const n of [norm(a.name), norm(a.name).replace(/\s/g, ""), a.nameNe]) {
      const m = text.match(new RegExp(`(^|\\s)${n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(मा)?(?=\\s)`));
      if (m) return { a, m };
    }
    return null;
  }).find(Boolean);
  if (!hit) return { rest: q.trim() };
  const rest = (text.slice(0, hit.m.index) + " " + text.slice(hit.m.index! + hit.m[0].length))
    .split(" ").filter(Boolean);
  while (rest.length && ["near", "in", "at", "नजिक", "मा"].includes(rest[rest.length - 1]!)) rest.pop();
  return { area: hit.a.slug, rest: rest.join(" ") };
}
