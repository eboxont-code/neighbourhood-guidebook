import { createFileRoute, Link } from "@tanstack/react-router";
import { Page, pageMeta } from "@/components/site";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/website-help")({
  head: () => pageMeta("Website check and new site", "We check whether a business website works, and can update it or make a new one."),
  component: WebsiteHelp,
});

function WebsiteHelp() {
  const { t } = useI18n();
  return (
    <Page>
      <h1 className="font-serif text-3xl font-semibold">{t("helpTitle")}</h1>
      <p className="mt-4 leading-relaxed">{t("helpBody1")}</p>
      <p className="mt-3 leading-relaxed">{t("helpBody2")}</p>
      <Link to="/contact" className="action-btn action-primary mt-6 inline-flex w-full px-6 sm:w-auto">
        {t("helpCta")}
      </Link>
    </Page>
  );
}
