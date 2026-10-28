import { createFileRoute } from "@tanstack/react-router";
import { Page, pageMeta } from "@/components/site";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/privacy")({
  head: () => pageMeta("Privacy", "What this directory stores when you use it or send a form, and what it doesn't.", "/privacy"),
  component: Privacy,
});

function Privacy() {
  const { t } = useI18n();
  return (
    <Page>
      <h1 className="text-2xl font-semibold sm:text-3xl">{t("footPrivacy")}</h1>
      <div className="form-card mt-5 space-y-3 leading-relaxed">
        <p>{t("privacyBody")}</p>
        <p>{t("privacyLocation")}</p>
        <p>{t("privacyCounts")}</p>
      </div>
    </Page>
  );
}
