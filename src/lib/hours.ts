import { kathmanduNow, parseDays, parseRange, type Business } from "@/data/directory";

/** One day of a weekly schedule. Ranges are minutes since midnight; a close at or before the open runs past midnight. */
export type DaySchedule =
  | { closed: true; source: string }
  | { closed: false; allDay: boolean; ranges: [number, number][]; source: string };
/** Index 0 = Sunday. A null day means the recorded hours do not mention it, so nothing is shown or assumed. */
export type Week = (DaySchedule | null)[];

/** Reads one recorded time text. Adds "From 10:00, last booking 18:00" (10:00 to 18:00) on top of the shared parser. */
export function parseTime(time: string): [number, number] | "closed" | null {
  const base = parseRange(time);
  if (base) return base;
  const m = time.trim().match(/^from\s+(\d{1,2}):(\d{2}),?\s*last booking\s+(\d{1,2}):(\d{2})$/i);
  return m ? [Number(m[1]) * 60 + Number(m[2]), Number(m[3]) * 60 + Number(m[4])] : null;
}

/** Turns recorded {days, time} lines into a 7-day schedule. Any line that can't be read makes the whole result null. */
export function weeklySchedule(hours: Business["hours"]): Week | null {
  if (!hours?.length) return null;
  const week: Week = Array(7).fill(null);
  for (const h of hours) {
    const days = parseDays(h.days);
    const r = parseTime(h.time);
    if (!days || !r) return null;
    for (const d of days)
      week[d] = r === "closed" ? { closed: true, source: h.time } : { closed: false, allDay: r[0] === 0 && r[1] >= 1440, ranges: [r], source: h.time };
  }
  return week;
}

export type OpenState = { kind: "open24" } | { kind: "closesSoon" | "open"; closes: number } | { kind: "closed" } | null;
export const CLOSES_SOON_MIN = 60;

/** Status in Kathmandu time. Null when the hours can't be read, so nothing is guessed. */
export function openState(hours: Business["hours"], now: Date): OpenState {
  const week = weeklySchedule(hours);
  if (!week) return null;
  const { day, minutes } = kathmanduNow(now);
  const status = (left: number, closes: number): OpenState => ({ kind: left <= CLOSES_SOON_MIN ? "closesSoon" : "open", closes });
  const today = week[day];
  if (today && !today.closed) {
    if (today.allDay) return { kind: "open24" };
    for (const [a, b] of today.ranges) {
      if (b > a && minutes >= a && minutes < b) return status(b - minutes, b);
      if (b <= a && minutes >= a) return status(1440 - minutes + b, b);
    }
  }
  const prev = week[(day + 6) % 7];
  if (prev && !prev.closed && !prev.allDay)
    for (const [a, b] of prev.ranges) if (b <= a && minutes < b) return status(b - minutes, b);
  return { kind: "closed" };
}

export const isOpenState = (s: OpenState) => !!s && s.kind !== "closed";

/** True only when the recorded hours say the place opens on that weekday (0 = Sunday, 6 = Saturday). */
export function opensOn(hours: Business["hours"], day: number): boolean {
  const d = weeklySchedule(hours)?.[day];
  return !!d && !d.closed;
}

const hhmm = (m: number) => `${String(Math.floor(m / 60) % 24).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
export const formatMinutes = hhmm;

const SCHEMA_DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
/** schema.org OpeningHoursSpecification entries, only for days with readable open hours. */
export function openingHoursSpecification(hours: Business["hours"]): Record<string, unknown>[] | undefined {
  const week = weeklySchedule(hours);
  if (!week) return undefined;
  const out: Record<string, unknown>[] = [];
  week.forEach((d, i) => {
    if (!d || d.closed) return;
    for (const [a, b] of d.ranges)
      out.push({ "@type": "OpeningHoursSpecification", dayOfWeek: `https://schema.org/${SCHEMA_DAYS[i]}`, opens: hhmm(a), closes: d.allDay ? "23:59" : hhmm(b) });
  });
  return out.length ? out : undefined;
}
