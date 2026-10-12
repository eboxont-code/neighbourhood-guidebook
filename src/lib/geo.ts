import { useSyncExternalStore } from "react";
import { hasPin, type Business } from "@/data/directory";

/** Nepal's outline, simplified. A point must be inside this polygon to count as "in Nepal". */
const NEPAL: [number, number][] = [
  [80.06, 28.84], [80.5, 29.73], [80.95, 30.2], [81.53, 30.42], [82.33, 30.12], [83.34, 29.46], [84.1, 29.29],
  [84.6, 28.65], [85.2, 28.64], [85.9, 28.2], [86.5, 27.95], [87.2, 27.83], [88.0, 27.9], [88.2, 27.45],
  [88.05, 26.5], [87.2, 26.37], [86.0, 26.6], [85.15, 26.86], [84.62, 27.25], [83.9, 27.43], [83.3, 27.33],
  [82.7, 27.72], [81.9, 27.85], [81.0, 28.4], [80.3, 28.6],
];

export function inNepal(lat: number, lng: number): boolean {
  let inside = false;
  for (let i = 0, j = NEPAL.length - 1; i < NEPAL.length; j = i++) {
    const [xi, yi] = NEPAL[i]!, [xj, yj] = NEPAL[j]!;
    if (yi > lat !== yj > lat && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

export type Point = { lat: number; lng: number };

/** Great-circle distance in kilometres. */
export function distanceKm(a: Point, b: Point): number {
  const r = (d: number) => (d * Math.PI) / 180;
  const h = Math.sin(r(b.lat - a.lat) / 2) ** 2 + Math.cos(r(a.lat)) * Math.cos(r(b.lat)) * Math.sin(r(b.lng - a.lng) / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

const NE_DIGITS = "०१२३४५६७८९";
export const neDigits = (s: string) => s.replace(/\d/g, (d) => NE_DIGITS[Number(d)]!);

/** "350 m away" under a kilometre, "1.2 km away" up to 10 km, then whole kilometres. */
export function formatDistance(km: number, lang: "en" | "ne"): string {
  const n = km < 1 ? `${Math.max(10, Math.round((km * 1000) / 10) * 10)} m` : `${km < 10 ? km.toFixed(1) : Math.round(km)} km`;
  if (lang === "ne") {
    const [v, u] = n.split(" ");
    return `${neDigits(v!)} ${u === "m" ? "मिटर" : "किमी"} टाढा`;
  }
  return `${n} away`;
}

export const distanceTo = (b: Business, here: Point | null): number | null => (here && hasPin(b) ? distanceKm(here, { lat: b.lat!, lng: b.lng! }) : null);

/** Nearest first; listings without coordinates keep their order after all the ones with a distance. */
export function sortByDistance<T extends Business>(items: T[], here: Point): T[] {
  const withPin = items.filter(hasPin).map((b) => ({ b, d: distanceTo(b, here)! })).sort((x, y) => x.d - y.d).map((x) => x.b);
  return [...withPin, ...items.filter((b) => !hasPin(b))];
}

// ---- Device-only location state. Coordinates never leave the browser. ----
export type LocState =
  | { status: "idle" | "asking" | "denied" }
  | { status: "nepal" | "outside"; here: Point };

const DISMISS = "loc-dismissed";
const SESSION = "loc-here";
let state: LocState = { status: "idle" };
let dismissed = false;
let started = false;
const subs = new Set<() => void>();
const emit = () => subs.forEach((f) => f());

function init() {
  if (started || typeof window === "undefined") return;
  started = true;
  try {
    dismissed = localStorage.getItem(DISMISS) === "1";
    const s = JSON.parse(sessionStorage.getItem(SESSION) ?? "null");
    if (s && typeof s.lat === "number" && typeof s.lng === "number") state = { status: inNepal(s.lat, s.lng) ? "nepal" : "outside", here: s };
  } catch { /* storage may be off */ }
}

const snap: { state: LocState; dismissed: boolean } = { state, dismissed };
let last = snap;
function getSnap() {
  init();
  if (last.state !== state || last.dismissed !== dismissed) last = { state, dismissed };
  return last;
}
const serverSnap: { state: LocState; dismissed: boolean } = { state: { status: "idle" }, dismissed: false };

export function requestLocation() {
  if (typeof navigator === "undefined" || !navigator.geolocation) { state = { status: "denied" }; emit(); return; }
  state = { status: "asking" }; emit();
  navigator.geolocation.getCurrentPosition(
    (p) => {
      const here = { lat: p.coords.latitude, lng: p.coords.longitude };
      try { sessionStorage.setItem(SESSION, JSON.stringify(here)); } catch { /* ignore */ }
      state = { status: inNepal(here.lat, here.lng) ? "nepal" : "outside", here }; emit();
    },
    () => { state = { status: "denied" }; emit(); },
    { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
  );
}

export function dismissLocation() {
  dismissed = true;
  try { localStorage.setItem(DISMISS, "1"); } catch { /* ignore */ }
  emit();
}

/** Location only after the person asked for it; null before mount and on the server. */
export function useLocation() {
  const s = useSyncExternalStore((f) => { subs.add(f); return () => subs.delete(f); }, getSnap, () => serverSnap);
  const here = s.state.status === "nepal" ? s.state.here : null;
  return { ...s, here };
}
