import { createFileRoute } from "@tanstack/react-router";
import { TextPage, pageMeta } from "@/components/site";
import { SITE_NAME } from "@/config";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/about")({
  head: () => pageMeta("About the directory", `What ${SITE_NAME} is, who runs it, and where each listing's details come from.`, "/about"),
  component: About,
});

function About() {
  const { t } = useI18n();
  return <TextPage title={t("footAbout")} body={t("aboutBody").replace("{site}", SITE_NAME)} />;
}
