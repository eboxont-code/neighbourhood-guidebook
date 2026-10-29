import { Link } from '@tanstack/react-router';
import { hasPin, type Business } from '@/data/directory';
import { useNow } from '@/components/site';
import { useI18n, type Key } from '@/lib/i18n';
import { fieldSource, sourceUrl, type SourceField } from '@/lib/provenance';
import { checkedDaysAgo } from '@/lib/verification';

export function ProvenanceDisclosure({ b }: { b: Business }) {
  const { t, lang } = useI18n();
  const now = useNow();
  const labels: Record<SourceField, Key> = { phone: 'provPhone', hours: 'tabHours', address: 'subAddress', website: 'actionWebsite', location: 'tabLocation' };
  const fields: SourceField[] = [];
  if (b.phone) fields.push('phone');
  if (b.hours?.length) fields.push('hours');
  if (b.address) fields.push('address');
  if (b.website) fields.push('website');
  if (hasPin(b)) fields.push('location');
  if (!fields.length) return null;
  return <details className="mt-2 text-xs leading-relaxed">
    <summary className="min-h-11 cursor-pointer content-center font-semibold text-primary focus-visible:outline-2 focus-visible:outline-ring">{t('provenanceTitle')}</summary>
    <dl className="divide-y divide-border">
      {fields.map((field) => {
        const source = fieldSource(b, field);
        const url = sourceUrl(source?.url);
        const days = now && source?.checked ? checkedDaysAgo({ ...b, lastChecked: source.checked }, now) : null;
        return <div key={field} className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-2 py-2">
          <dt className="text-muted-foreground">{t(labels[field])}</dt>
          <dd className="min-w-0 break-words">{source ? t(`sourceTier_${source.tier}`) : t('sourceUnchecked')}
            {url && <a href={url} target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center text-primary underline">{t('viewSource')}</a>}
            {days !== null && <span className="block text-muted-foreground">{t('checkedDays').replace('{n}', new Intl.NumberFormat(lang === 'ne' ? 'ne-NP' : 'en').format(days))}</span>}
          </dd>
        </div>;
      })}
    </dl>
    <Link to="/how-we-verify" className="inline-flex min-h-11 items-center text-primary underline">{t('footVerify')}</Link>
  </details>;
}