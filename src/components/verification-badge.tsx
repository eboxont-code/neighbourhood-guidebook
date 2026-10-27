import { ShieldCheck, ShieldQuestion } from 'lucide-react';
import type { Business } from '@/data/directory';
import { useI18n } from '@/lib/i18n';
import { checkedDaysAgo, verificationLevel } from '@/lib/verification';
import { useEffect, useState } from 'react';

export function VerificationBadge({ b }: { b: Business }) {
  const { t, lang } = useI18n();
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => { setNow(new Date()); }, [b.lastChecked]);
  const level = verificationLevel(b);
  const days = now ? checkedDaysAgo(b, now) : null;
  const Icon = level === 'website' || level === 'social' ? ShieldCheck : ShieldQuestion;
  return <div className="mt-2 min-w-0 text-xs leading-relaxed">
    <span className={`inline-flex max-w-full items-center gap-1 rounded-lg px-2 py-1 ${level === 'website' || level === 'social' ? 'bg-success-soft text-success' : 'bg-muted text-muted-foreground'}`}><Icon aria-hidden className="h-3.5 w-3.5 shrink-0" /><span>{t(`verification_${level}`)}</span></span>
    {days !== null && <span className="mt-1 block text-muted-foreground">{days === 0 ? t('checkedToday') : t('checkedDays').replace('{n}', new Intl.NumberFormat(lang === 'ne' ? 'ne-NP' : 'en').format(days))}</span>}
  </div>;
}