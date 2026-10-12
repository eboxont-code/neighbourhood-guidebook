import { useSyncExternalStore } from "react";

/** Saved places live in this browser only, as a list of listing slugs. */
export const FAV_KEY = "saved-places";

type Store = Pick<Storage, "getItem" | "setItem">;

export function readFavs(s: Store | undefined): string[] {
  try {
    const v = JSON.parse(s?.getItem(FAV_KEY) ?? "[]");
    return Array.isArray(v) ? [...new Set(v.filter((x): x is string => typeof x === "string"))] : [];
  } catch { return []; }
}

export function toggleFav(s: Store | undefined, slug: string): string[] {
  const cur = readFavs(s);
  const next = cur.includes(slug) ? cur.filter((x) => x !== slug) : [slug, ...cur];
  try { s?.setItem(FAV_KEY, JSON.stringify(next)); } catch { /* storage may be off */ }
  return next;
}

const subs = new Set<() => void>();
let cache: string[] | null = null;
const EMPTY: string[] = [];
const store = () => (typeof window === "undefined" ? undefined : window.localStorage);

export function useFavourites() {
  const list = useSyncExternalStore(
    (f) => { subs.add(f); return () => subs.delete(f); },
    () => (cache ??= readFavs(store())),
    () => EMPTY,
  );
  return {
    list,
    has: (slug: string) => list.includes(slug),
    toggle: (slug: string) => { cache = toggleFav(store(), slug); subs.forEach((f) => f()); },
  };
}
