import { createFileRoute, Link } from "@tanstack/react-router";
import { Page, SearchBox, pageMeta } from "@/components/site";
import { Directory } from "@/components/directory";
import { areasInUse, businesses, citiesInUse } from "@/data/directory";
import { useI18n } from "@/lib/i18n";
import { SITE_NAME } from "@/config";

export const Route = createFileRoute("/")({
  head: () => pageMeta("Local businesses in Kathmandu", `${SITE_NAME} is a local guide to salons, cafés, restaurants, gyms, hotels and more in Kathmandu, with phone numbers, opening hours and directions.`, "/"),
  component: Home,
});

function Home() {
  const { t, lang } = useI18n();
  return (
    <Page wide>
      <div className="max-w-2xl">
        <p className="text-lg leading-snug">{t("tagline")}</p>
        <p className="mt-1 mb-4 text-sm text-muted-foreground">{t("coverageNote")}</p>
        <SearchBox />
      </div>
      <section className="mt-6">
        <h2 className="section-label">{t("cities")}</h2>
        <div className="flex flex-wrap gap-2">
          {citiesInUse().map((c) => <Link key={c.slug} to="/$city" params={{ city: c.slug }} className="chip">{lang === "ne" ? c.nameNe : c.name}</Link>)}
          {areasInUse("kathmandu").map((a) => <Link key={a.slug} to="/$city/$section" params={{ city: a.city, section: a.slug }} className="chip text-muted-foreground">{a.name}</Link>)}
        </div>
      </section>
      <section className="mt-8">
        <h2 className="section-label">{t("listings")}</h2>
        <Directory items={businesses} />
      </section>
    </Page>
  );
}
