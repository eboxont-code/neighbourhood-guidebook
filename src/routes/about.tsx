import { createFileRoute, Link } from "@tanstack/react-router";
import { Page, pageMeta } from "@/components/site";
import { SITE_NAME } from "@/config";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/about")({
  head: () => pageMeta("About the directory", `What ${SITE_NAME} is, who runs it, and where each listing's details come from.`, "/about"),
  component: About,
});

function About() {
  const { t } = useI18n();
  return <Page><h1 className="text-2xl font-semibold sm:text-3xl">{t("footAbout")}</h1><p className="mt-5 leading-relaxed">{t("aboutBody").replace("{site}", SITE_NAME)}</p><Link to="/how-we-verify" className="mt-4 inline-flex min-h-11 items-center text-primary underline">{t("footVerify")}</Link></Page>;
}
