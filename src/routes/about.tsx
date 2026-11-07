import { createFileRoute, Link } from "@tanstack/react-router";
import { Page, pageMeta } from "@/components/site";
import { SITE_NAME } from "@/config";
import { useI18n, type Key } from "@/lib/i18n";

export const Route = createFileRoute("/about")({
  head: () => pageMeta("About the directory", `What ${SITE_NAME} is, who runs it, and where each listing's details come from.`, "/about"),
  component: About,
});

function About() {
  const { t } = useI18n();
  const sections: [Key, Key][] = [['aboutPurposeTitle', 'aboutPurposeBody'], ['aboutWhoTitle', 'aboutWhoBody'], ['aboutChosenTitle', 'aboutChosenBody'], ['aboutVerifyTitle', 'aboutVerifyBody'], ['aboutRecheckTitle', 'aboutRecheckBody'], ['aboutCorrectionsTitle', 'aboutCorrectionsBody'], ['aboutClaimsTitle', 'aboutClaimsBody'], ['aboutLanguageTitle', 'aboutLanguageBody'], ['aboutLimitsTitle', 'aboutLimitsBody']];
  return <Page><h1 className="text-2xl font-semibold sm:text-3xl">{t("footAbout")}</h1><div className="mt-7 space-y-7">{sections.map(([title, body]) => <section key={title}><h2 className="text-lg font-semibold">{t(title)}</h2><p className="mt-2 leading-relaxed text-muted-foreground">{t(body)}</p>
    {title === 'aboutVerifyTitle' && <Link to="/how-we-verify" className="inline-flex min-h-11 items-center text-primary underline">{t('footVerify')}</Link>}
    {title === 'aboutCorrectionsTitle' && <Link to="/suggest-correction" className="inline-flex min-h-11 items-center text-primary underline">{t('reportOutdated')}</Link>}
    {title === 'aboutClaimsTitle' && <Link to="/claim" search={{ listing: '' }} className="inline-flex min-h-11 items-center text-primary underline">{t('footClaimBusiness')}</Link>}
  </section>)}</div></Page>;
}
