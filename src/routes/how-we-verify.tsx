import { createFileRoute, Link } from '@tanstack/react-router';
import { Page, pageMeta } from '@/components/site';
import { useI18n, type Key } from '@/lib/i18n';
export const Route = createFileRoute('/how-we-verify')({
 head: () => pageMeta('How we verify', 'How Sewa checks Kathmandu business details against public sources, confirms hours and reviews owner edits.', '/how-we-verify'),
 component: VerificationPage,
});
function VerificationPage() {
 const { t } = useI18n();
 const tiers: [Key, Key][] = [['sourceTier_website','sourceWebsiteBody'],['sourceTier_official_social','sourceSocialBody'],['sourceTier_maps','sourceMapsBody'],['sourceTier_third_party','sourceThirdBody'],['sourceTier_user_submission','sourceUserBody']];
 const sections: [Key, Key][] = [['verifyWhatTitle','verifyWhatBody'],['verifySourcesTitle','verifySourcesBody'],['verifyMeaningTitle','verifyMeaningBody'],['verification_website','verifyWebsiteBody'],['verification_social','verifySocialBody'],['verification_partial','verifyPartialBody'],['verification_needed','verifyNeededBody'],['verifyHoursTitle','verifyHoursBody'],['verifyOwnersTitle','verifyOwnersBody'],['verifyProblemsTitle','verifyProblemsBody'],['verifyLimitsTitle','verifyLimitsBody']];
 return <Page><h1 className="text-2xl font-semibold sm:text-3xl">{t('verifyTitle')}</h1><p className="mt-3 leading-relaxed text-muted-foreground">{t('verifyIntro')}</p><div className="mt-8 space-y-7">{sections.map(([title,body]) => <section key={title}><h2 className="text-lg font-semibold">{t(title)}</h2><p className="mt-2 leading-relaxed">{t(body)}</p>{title === 'verifySourcesTitle' && <div className="mt-4"><h3 className="font-semibold">{t('sourceTiersTitle')}</h3><p className="mt-1 text-sm text-muted-foreground">{t('sourceTiersBody')}</p><ol className="mt-3 space-y-3">{tiers.map(([label, explanation]) => <li key={label}><h4 className="text-sm font-semibold">{t(label)}</h4><p className="text-sm text-muted-foreground">{t(explanation)}</p></li>)}</ol></div>}{title === 'verifyOwnersTitle' && <Link to="/claim" search={{ listing: "" }} className="inline-flex min-h-11 items-center text-primary underline">{t('footClaimBusiness')}</Link>}{title === 'verifyProblemsTitle' && <Link to="/suggest-correction" className="inline-flex min-h-11 items-center text-primary underline">{t('footSuggest')}</Link>}</section>)}</div></Page>;
}
