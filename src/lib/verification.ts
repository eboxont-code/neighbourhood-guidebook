import { socialLinks, type Business } from '@/data/directory';

export type VerificationLevel = 'website' | 'social' | 'partial' | 'needed';
export function checkedDate(b: Business): string | undefined {
  const date = b.lastChecked;
  return date && /^\d{4}-\d{2}-\d{2}$/.test(date) && Number.isFinite(Date.parse(date)) && new Date(date).toISOString().slice(0, 10) === date ? date : undefined;
}
export function officialWebsite(b: Business): boolean {
  if (!b.website) return false;
  try {
    const url = new URL(b.website);
    return /^https?:$/.test(url.protocol) && !/(^|\.)(instagram|facebook|tiktok|youtube)\.com$/i.test(url.hostname);
  } catch { return false; }
}
export function verificationLevel(b: Business): VerificationLevel {
  const date = checkedDate(b);
  if (date && officialWebsite(b)) return 'website';
  if (date && !officialWebsite(b) && socialLinks(b).some((s) => s.platform === 'Instagram' || s.platform === 'Facebook')) return 'social';
  return b.sourceNotes?.trim() || b.sourceUrl || b.hoursSource ? 'partial' : 'needed';
}
/** Calendar days in Kathmandu, never a guessed or future date. */
export function checkedDaysAgo(b: Business, now: Date): number | null {
  const date = checkedDate(b);
  if (!date) return null;
  const today = new Date(now.getTime() + 20_700_000).toISOString().slice(0, 10);
  const days = Math.round((Date.parse(today) - Date.parse(date)) / 86_400_000);
  return days >= 0 ? days : null;
}

export const freshnessBuckets = ['green', 'yellow', 'orange', 'red', 'grey'] as const;
export type FreshnessBucket = typeof freshnessBuckets[number];
export function freshnessBucket(b: Business, now: Date): FreshnessBucket {
  const days = checkedDaysAgo(b, now);
  if (days === null) return 'grey';
  if (days < 30) return 'green';
  if (days <= 90) return 'yellow';
  if (days <= 180) return 'orange';
  return 'red';
}
export function stalestFirst(a: Business, b: Business, now: Date): number {
  const age = (item: Business) => checkedDaysAgo(item, now) ?? Infinity;
  const x = age(a), y = age(b);
  return x === y ? a.name.localeCompare(b.name) : x > y ? -1 : 1;
}
export function recentlyVerified(all: Business[]): Business[] {
  return [...all].sort((a, b) => (checkedDate(b) ?? '').localeCompare(checkedDate(a) ?? '') || a.name.localeCompare(b.name));
}