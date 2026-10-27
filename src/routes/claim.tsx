import { createFileRoute } from '@tanstack/react-router';
import { Page, pageMeta } from '@/components/site';
import { ClaimForm } from '@/components/claim-form';
import { useI18n } from '@/lib/i18n';

export const Route = createFileRoute('/claim')({
  validateSearch: (s: Record<string, unknown>) => ({ listing: typeof s['listing'] === 'string' ? s['listing'] : '' }),
  head: ({ match }) => {
    const head = pageMeta('Claim a business for free', 'Claim your Kathmandu business listing for free. Send proof and request checked updates to your details.', '/claim');
    return { ...head, meta: [...head.meta, ...(match.search.listing ? [{ name: 'robots', content: 'noindex, follow' }] : [])] };
  },
  component: ClaimPage,
});
function ClaimPage() {
  const { t } = useI18n(); const { listing } = Route.useSearch();
  return <Page><h1 className="text-2xl font-semibold">{t('claimTitle')}</h1><p className="mt-3 leading-relaxed text-muted-foreground">{t('claimIntro')}</p><div className="mt-7"><ClaimForm key={listing} listing={listing} /></div></Page>;
}