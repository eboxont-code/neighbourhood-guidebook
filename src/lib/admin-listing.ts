import { parseDays, parseRange, type Business } from "@/data/directory";

export type DayValue = { kind: "open"; from: string; to: string } | { kind: "closed" } | { kind: "unknown" };
const SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const hhmm = (m: number) => `${String(Math.floor(m / 60) % 24).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

/** Day-by-day hours (0 = Sunday), or null when a recorded line is free text that can't be split into days. */
export function hoursToWeek(hours: Business["hours"]): DayValue[] | null {
  const week: DayValue[] = Array.from({ length: 7 }, () => ({ kind: "unknown" }));
  for (const h of hours ?? []) {
    const days = parseDays(h.days);
    const r = parseRange(h.time);
    if (!days || !r) return null;
    for (const d of days) week[d] = r === "closed" ? { kind: "closed" } : { kind: "open", from: hhmm(r[0]), to: hhmm(r[1]) };
  }
  return week;
}

const same = (a: DayValue, b: DayValue) => a.kind === b.kind && (a.kind !== "open" || (b.kind === "open" && a.from === b.from && a.to === b.to));

/** Back to the stored rows: neighbouring days with the same hours share one row; unknown days are left out. */
export function weekToHours(week: DayValue[]): NonNullable<Business["hours"]> {
  if (week.every((d) => d.kind !== "unknown" && same(d, week[0]!))) return [{ days: "Every day", time: timeText(week[0]!) }];
  const out: NonNullable<Business["hours"]> = [];
  for (let i = 0; i < 7; ) {
    const v = week[i]!;
    let j = i;
    while (j + 1 < 7 && same(week[j + 1]!, v)) j++;
    if (v.kind !== "unknown") out.push({ days: i === j ? SHORT[i]! : `${SHORT[i]}–${SHORT[j]}`, time: timeText(v) });
    i = j + 1;
  }
  return out;
}
const timeText = (v: DayValue) => (v.kind === "open" ? `${v.from}–${v.to}` : "Closed");

export const slugify = (s: string) =>
  s.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 100).replace(/-+$/, "");
export const validSlug = (s: string) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(s) && s.length <= 100;

/** Phones are stored as 01-XXXXXXX (landline) or 98/97XXXXXXXX (mobile). */
export function normalizePhone(raw: string): string | null {
  const d = raw.replace(/\D/g, "").replace(/^977/, "");
  if (/^9[78]\d{8}$/.test(d)) return d;
  if (/^01\d{7}$/.test(d)) return `01-${d.slice(2)}`;
  if (/^1\d{7}$/.test(d)) return `01-${d.slice(1)}`;
  return null;
}

export function validUrl(s: string): boolean {
  try { const u = new URL(s); return (u.protocol === "https:" || u.protocol === "http:") && u.hostname.includes("."); } catch { return false; }
}

export const osmLink = (lat: number, lng: number) => `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=18/${lat}/${lng}`;
