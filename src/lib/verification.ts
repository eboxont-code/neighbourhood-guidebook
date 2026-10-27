import { socialLinks, type Business } from '@/data/directory';

export type VerificationLevel = 'website' | 'social' | 'partial' | 'needed';
export function checkedDate(b: Business): string | undefined {
  return b.lastChecked && /^\d{4}-\d{2}-\d{2}$/.test(b.lastChecked) && Number.isFinite(Date.parse(b.lastChecked)) ? b.lastChecked : undefined;
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