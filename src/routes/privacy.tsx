import { createFileRoute } from "@tanstack/react-router";
import { TextPage, pageMeta } from "@/components/site";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/privacy")({
  head: () => pageMeta("Privacy", "What this directory stores when you use it or send a form, and what it doesn't.", "/privacy"),
  component: Privacy,
});

function Privacy() {
  const { t } = useI18n();
  return <TextPage title={t("footPrivacy")} body={t("privacyBody")} />;
}
