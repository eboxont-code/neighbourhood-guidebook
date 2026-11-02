import { formatMinutes, openState, opensOn, weeklySchedule } from "@/lib/hours";
import { businesses, kathmanduNow, type Business } from "@/data/directory";

export type Badge = "open" | "closesSoon" | "open24" | "openSunday" | "trustWeb" | "trustSocial" | "newOnSewa";
export type StatusBadge = "open" | "closesSoon" | "open24" | "openSunday";
export type Trust = "website" | "social" | "none";

/**
 * One trust level per listing, from recorded facts only. A listing counts as checked only when it
 * has a last-checked date and its source notes name the business's own website or its own social page.
 */
export function trustLevel(b: Business): Trust {
  if (!b.lastChecked || b.verification === "not_verified") return "none";
  const src = b.sourceNotes.trim();
  if (b.website && b.websiteStatus !== "failed" && /^(their own (website|brand page)|the hotel's official|the radisson hotels website)/i.test(src)) return "website";
  if (/^(their (instagram|facebook|tiktok)|[\w' ]*facebook page)/i.test(src)) return "social";
  return "none";
}

export const NEW_DAYS = 30;
const DAY = 86_400_000;

/**
 * Listings that count as new: added after the launch batch and within NEW_DAYS.
 * Whole days of additions are taken newest first while they stay a minority, so a
 * fresh batch still shows as new even when older post-launch batches are large.
 */
export function newSlugs(all: Business[], now: Date): Set<string> {
  const dated = all.filter((b) => b.addedOn);
  if (!dated.length) return new Set();
  const launch = dated.map((b) => b.addedOn!).sort()[0]!;
  const fresh = dated.filter((b) => b.addedOn! > launch && now.getTime() - Date.parse(b.addedOn! + "T00:00:00Z") < NEW_DAYS * DAY);
  const days = [...new Set(fresh.map((b) => b.addedOn!))].sort().reverse();
  const out = new Set<string>();
  for (const day of days) {
    const batch = fresh.filter((b) => b.addedOn === day);
    if ((out.size + batch.length) * 2 >= all.length) break;
    for (const b of batch) out.add(b.slug);
  }
  return out;
}

/** Listings that count as new, newest first. Same rule as the New badge, so the two always agree. */
export function newListings(all: Business[], now: Date): Business[] {
  const slugs = newSlugs(all, now);
  return all.filter((b) => slugs.has(b.slug)).sort((x, y) => (y.addedOn! < x.addedOn! ? -1 : 1));
}

/** "17 October 2026" or the Nepali equivalent, from an ISO date. UTC so the day never shifts. */
export function formatDate(iso: string, lang: "en" | "ne"): string {
  return new Intl.DateTimeFormat(lang === "ne" ? "ne-NP" : "en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${iso}T00:00:00Z`));
}

/** At most two badges, all from recorded facts. Open now needs a clock, so it appears only after mount. */
export function badgesFor(b: Business, now: Date | null, open: boolean, all: Business[] = businesses): Badge[] {
  const out: Badge[] = [];
  if (open) out.push("open");
  if (now && newSlugs(all, now).has(b.slug)) out.push("newOnSewa");
  const tr = trustLevel(b);
  if (tr !== "none") out.push(tr === "website" ? "trustWeb" : "trustSocial");
  return out.slice(0, 2);
}

/** One entry per weekday (0 = Sunday), using the shared validated schedule parser. */
export function weekTable(hours: Business["hours"]): ({ time: string; open: boolean } | null)[] | null {
  const week = weeklySchedule(hours);
  if (!week) return null;
  return week.map((day) => day ? { time: day.source, open: !day.closed } : null);
}

export type Detail =
  | { kind: "open"; closes: string }
  | { kind: "open24" }
  | { kind: "closed"; opens?: string; tomorrow?: boolean }
  | null;

/** "Open now, closes at 19:00" or "Closed, opens at 10:00", using the shared overnight-aware schedule. */
export function statusDetail(hours: Business["hours"], now: Date): Detail {
  const state = openState(hours, now);
  const week = weeklySchedule(hours);
  if (!state || !week) return null;
  if (state.kind === "open24") return { kind: "open24" };
  if (state.kind !== "closed") {
    return { kind: "open", closes: formatMinutes(state.closes) };
  }

  const { day, minutes } = kathmanduNow(now);
  for (let distance = 0; distance <= 1; distance++) {
    const schedule = week[(day + distance) % 7];
    if (!schedule || schedule.closed) continue;
    if (schedule.allDay) {
      return { kind: "closed", opens: "00:00", ...(distance === 1 ? { tomorrow: true } : {}) };
    }
    for (const [opens] of schedule.ranges) {
      if (distance === 0 && opens <= minutes) continue;
      return {
        kind: "closed",
        opens: formatMinutes(opens),
        ...(distance === 1 ? { tomorrow: true } : {}),
      };
    }
  }
  return { kind: "closed" };
}

/**
 * The one status chip a card may show, after mount only. Closes soon replaces Open now. On Saturday, the usual
 * day off, a closed place that opens on Sunday shows "Open Sunday" so people can plan the next working day.
 */
export function statusBadge(b: Business, now: Date | null): StatusBadge | null {
  if (!now) return null;
  const s = openState(b.hours, now);
  if (!s) return null;
  if (s.kind === "open24") return "open24";
  if (s.kind === "closesSoon") return "closesSoon";
  if (s.kind === "open") return "open";
  return kathmanduNow(now).day === 6 && opensOn(b.hours, 0) ? "openSunday" : null;
}
