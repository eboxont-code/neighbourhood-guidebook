import { createFileRoute, Link } from "@tanstack/react-router";
import { CardList, Page, SearchBox, pageMeta } from "@/components/site";
import { areasInUse, businesses, categoriesInUse } from "@/data/directory";
import { useI18n } from "@/lib/i18n";
import { SITE_NAME } from "@/config";

export const Route = createFileRoute("/")({
  head: () => pageMeta("Local business directory", `${SITE_NAME} lists local shops in Kathmandu with phone numbers, opening hours and website checks.`),
  component: Home,
});

function Home() {
  const { t, lang } = useI18n();
  return (
    <Page>
      <p className="mb-4 text-lg leading-snug">{t("tagline")}</p>
      <SearchBox />
      <section className="mt-6">
        <h2 className="section-label">{t("categories")}</h2>
        <div className="flex flex-wrap gap-2">
          {categoriesInUse().map((c) => <Link key={c.slug} to="/c/$categorySlug" params={{ categorySlug: c.slug }} className="chip">{lang === "ne" ? c.nameNe : c.name}</Link>)}
        </div>
      </section>
      <section className="mt-5">
        <h2 className="section-label">{t("areas")}</h2>
        <div className="flex flex-wrap gap-2">
          {areasInUse().map((a) => <Link key={a.slug} to="/a/$areaSlug" params={{ areaSlug: a.slug }} className="chip">{a.name}</Link>)}
        </div>
      </section>
      <section className="mt-6">
        <h2 className="section-label">{t("listings")}</h2>
        <CardList items={businesses} />
      </section>
    </Page>
  );
}
