import { expect, it } from 'vitest';
import { businesses } from '@/data/directory';
import { nearbyPlaces } from '@/lib/nearby';
import { savedCategorySuggestions } from '@/lib/saved-categories';
const b = businesses[0];
if (!b) throw new Error('Missing fixture');
it('only includes other pinned places within 500 metres, nearest first, up to four', () => {
  const origin = { ...b, id:'origin', lat:27.71, lng:85.32 };
  const rows = [100,200,300,400,450,501,800].map((metres,i) => ({ ...origin, id:String(i), lat:origin.lat + metres / 111194.9266 }));
  const result = nearbyPlaces(origin, [origin, ...rows, { ...origin, id:'no-pin', lat:undefined }]);
  expect(result.map(x=>x.business.id)).toEqual(['0','1','2','3']);
  expect(result.every(x=>x.metres <= 500)).toBe(true);
  expect(nearbyPlaces({ ...origin, lat:undefined }, rows)).toEqual([]);
  expect(nearbyPlaces(origin, rows.slice(5))).toEqual([]);
});
it('suggests exactly the three categories with most recorded listings', () => {
  const rows = ['cafes','cafes','cafes','hotels','hotels','salons','barbers'].map(category=>({ ...b, category }));
  expect(savedCategorySuggestions(rows).map(x=>[x.category.slug,x.count])).toEqual([['cafes',3],['hotels',2],['barbers',1]]);
});