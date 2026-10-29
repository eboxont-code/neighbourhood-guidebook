import { expect, it } from 'vitest';
import { businesses } from '@/data/directory';
import { checkedDaysAgo, freshnessBucket, recentlyVerified, stalestFirst } from '@/lib/verification';
const b = businesses[0];
if (!b) throw new Error('Missing fixture');
const now = new Date('2026-10-29T00:38:00Z');
it.each([[0,'green'],[29,'green'],[30,'yellow'],[90,'yellow'],[91,'orange'],[180,'orange'],[181,'red']])('buckets age %s as %s', (age, bucket) => {
  const lastChecked = new Date(Date.parse('2026-10-29') - Number(age) * 86400000).toISOString().slice(0,10);
  expect(freshnessBucket({ ...b, lastChecked }, now)).toBe(bucket);
});
it('treats missing, future and impossible dates as unchecked', () => {
  for (const lastChecked of [undefined, '2026-10-30', '2026-02-30']) {
    expect(freshnessBucket({ ...b, lastChecked }, now)).toBe('grey');
    expect(checkedDaysAgo({ ...b, lastChecked }, now)).toBeNull();
  }
});
it('orders undated and oldest checks first in the admin queue', () => {
  const all = [{ ...b, name:'new', lastChecked:'2026-10-28' },{ ...b, name:'old', lastChecked:'2026-01-01' },{ ...b, name:'none', lastChecked:undefined }];
  expect([...all].sort((a,c)=>stalestFirst(a,c,now)).map(x=>x.name)).toEqual(['none','old','new']);
  expect(recentlyVerified(all).map(x=>x.name)).toEqual(['new','old','none']);
});