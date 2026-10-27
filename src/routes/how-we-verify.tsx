import { createFileRoute, Link } from '@tanstack/react-router';
import { Page, pageMeta } from '@/components/site';
import { useI18n, type Key } from '@/lib/i18n';
export const Route = createFileRoute('/how-we-verify')({
 head: () => pageMeta('How we verify', 'How Sewa checks Kathmandu business details against public sources, confirms hours and reviews owner edits.', '/how-we-verify'),
 component: VerificationPage,
});
function VerificationPage() {
 const { t } = useI18n();
 const sections: [Key, Key][] = [['verifyWhatTitle','verifyWhatBody'],['verifySourcesTitle','verifySourcesBody'],['verifyMeaningTitle','verifyMeaningBody'],['verification_website','verifyWebsiteBody'],['verification_social','verifySocialBody'],['verification_partial','verifyPartialBody'],['verification_needed','verifyNeededBody'],['verifyHoursTitle','verifyHoursBody'],['verifyOwnersTitle','verifyOwnersBody'],['verifyProblemsTitle','verifyProblemsBody'],['verifyLimitsTitle','verifyLimitsBody']];
 return <Page><h1 className="text-2xl font-semibold sm:text-3xl">{t('verifyTitle')}</h1><p className="mt-3 leading-relaxed text-muted-foreground">{t('verifyIntro')}</p><div className="mt-8 space-y-7">{sections.map(([title,body]) => <section key={title}><h2 className="text-lg font-semibold">{t(title)}</h2><p className="mt-2 leading-relaxed">{t(body)}</p>{title === 'verifyOwnersTitle' && <Link to="/claim" className="inline-flex min-h-11 items-center text-primary underline">{t('footClaimBusiness')}</Link>}{title === 'verifyProblemsTitle' && <Link to="/suggest-correction" className="inline-flex min-h-11 items-center text-primary underline">{t('footSuggest')}</Link>}</section>)}</div></Page>;
}
