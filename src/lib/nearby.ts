import { hasPin, type Business } from '@/data/directory';
import { distanceKm } from '@/lib/geo';

export function nearbyPlaces(b: Business, all: Business[]): { business: Business; metres: number }[] {
  if (!hasPin(b) || typeof b.lat !== 'number' || typeof b.lng !== 'number') return [];
  const origin = { lat: b.lat, lng: b.lng };
  return all.flatMap((other) => {
    if (other.id === b.id || !hasPin(other) || typeof other.lat !== 'number' || typeof other.lng !== 'number') return [];
    const metres = distanceKm(origin, { lat: other.lat, lng: other.lng }) * 1000;
    return metres <= 500 ? [{ business: other, metres }] : [];
  }).sort((a, c) => a.metres - c.metres).slice(0, 4);
}