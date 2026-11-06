import { hasPin, type Business } from '@/data/directory';
import { checkedDate, checkedDaysAgo, officialWebsite } from '@/lib/verification';

export type SourceField = 'phone' | 'hours' | 'address' | 'website' | 'location';
export type FieldSource = NonNullable<Business['fieldSources']>[SourceField];
export function sourceUrl(url: string | undefined): string | undefined {
  try { const u = new URL(url ?? ''); return /^https?:$/.test(u.protocol) ? u.href : undefined; } catch { return undefined; }
}
function tierFromUrl(b: Business, url: string): NonNullable<FieldSource>['tier'] {
  const host = new URL(url).hostname.toLowerCase().replace(/^www\./, '');
  if (/(^|\.)(instagram|facebook)\.com$/.test(host)) return 'official_social';
  if (/^(maps\.google\.[a-z.]+|maps\.app\.goo\.gl|goo\.gl)$/.test(host) || /(^|\.)google\.[a-z.]+$/.test(host) && /^\/maps(?:\/|$)/.test(new URL(url).pathname)) return 'maps';
  if (officialWebsite(b) && host === new URL(b.website ?? '').hostname.toLowerCase().replace(/^www\./, '')) return 'website';
  return 'third_party';
}
export function fieldSource(b: Business, field: SourceField): FieldSource | null {
  const explicit = b.fieldSources?.[field];
  if (explicit) return explicit;
  const checked = checkedDate(b);
  if (field === 'website' && officialWebsite(b)) return { tier: 'website', url: b.website, checked };
  if (field === 'hours' && b.hours?.length && b.hoursSource) {
    const url = sourceUrl(b.hoursSource) ?? (/own (website|contact page|about page|store page)/i.test(b.hoursSource) && officialWebsite(b) ? b.website : undefined);
    const tier = b.hoursVerified && url && tierFromUrl(b, url) === 'website' ? 'website' : 'third_party';
    return { tier, url, checked };
  }
  if ((field === 'phone' && b.phone || field === 'address' && b.address) && sourceUrl(b.sourceUrl)) {
    const url = sourceUrl(b.sourceUrl);
    if (url) return { tier: tierFromUrl(b, url), url, checked };
  }
  const directions = sourceUrl(b.directions);
  if (field === 'location' && hasPin(b) && directions && tierFromUrl(b, directions) === 'maps') return { tier: 'maps', url: directions };
  return null;
}

/**
 * A public call action needs traceable, checked evidence from the business's own
 * website or official social profile. A listing-wide "source checked" flag,
 * free-text source note, map listing, or third-party directory is not enough.
 */
export function verifiedPublicPhone(b: Business): string | undefined {
  const phone = b.phone?.trim();
  if (!phone) return undefined;

  const source = fieldSource(b, 'phone');
  if (!source || (source.tier !== 'website' && source.tier !== 'official_social')) return undefined;
  if (!sourceUrl(source.url) || !source.checked) return undefined;
  if (checkedDaysAgo({ ...b, lastChecked: source.checked }, new Date()) === null) return undefined;

  return phone;
}
