import { describe, expect, it } from 'vitest';
import { businesses } from '@/data/directory';
import { fieldSource } from '@/lib/provenance';

const base = businesses[0];
if (!base) throw new Error('Missing fixture');
describe('field provenance', () => {
  it('prefers explicit evidence', () => {
    const source = { tier: 'user_submission' as const, checked: '2026-10-01' };
    expect(fieldSource({ ...base, fieldSources: { phone: source } }, 'phone')).toEqual(source);
  });
  it('derives website evidence only for an official website', () => {
    expect(fieldSource({ ...base, website: 'https://example.org' }, 'website')?.tier).toBe('website');
    expect(fieldSource({ ...base, website: 'https://instagram.com/example' }, 'website')).toBeNull();
  });
  it('does not infer phone or address without a source URL', () => {
    expect(fieldSource({ ...base, sourceUrl: undefined }, 'phone')).toBeNull();
    expect(fieldSource({ ...base, sourceUrl: undefined }, 'address')).toBeNull();
  });
  it.each([['https://instagram.com/example','official_social'],['https://facebook.com/example','official_social'],['https://www.google.com/maps/place/example','maps'],['https://directory.example/example','third_party']])('classifies recorded host %s', (url, tier) => {
    expect(fieldSource({ ...base, sourceUrl: url }, 'phone')?.tier).toBe(tier);
  });
  it('matches the business website host, not any arbitrary site', () => {
    expect(fieldSource({ ...base, website: 'https://example.org', sourceUrl: 'https://example.org/contact' }, 'address')?.tier).toBe('website');
  });
  it('does not promote unverified hours or verified social hours to a website', () => {
    expect(fieldSource({ ...base, hoursVerified: false }, 'hours')?.tier).toBe('third_party');
    expect(fieldSource({ ...base, website: undefined, hoursSource: 'their post', hoursVerified: true }, 'hours')?.tier).toBe('third_party');
    expect(fieldSource({ ...base, hoursSource: 'their own website', hoursVerified: true }, 'hours')?.tier).toBe('website');
  });
  it('requires real coordinates and a map link for location evidence', () => {
    expect(fieldSource({ ...base, lat: undefined, lng: undefined }, 'location')).toBeNull();
    expect(fieldSource({ ...base, lat: 27.71, lng: 85.32, directions: 'https://www.google.com/maps/?q=27.71,85.32' }, 'location')).toEqual({ tier: 'maps', url: 'https://www.google.com/maps/?q=27.71,85.32' });
  });
});