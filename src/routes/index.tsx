import { createFileRoute, Link } from "@tanstack/react-router";
import { Page, SearchBox, pageMeta } from "@/components/site";
import { Directory } from "@/components/directory";
import { businesses, citiesInUse, placeName } from "@/data/directory";
import { useI18n } from "@/lib/i18n";
import { SITE_NAME } from "@/config";

export const Route = createFileRoute("/")({
  head: () => pageMeta("A local guide to everyday businesses in Nepal", `${SITE_NAME} is a local guide to everyday businesses in Nepal, starting with Kathmandu: phone numbers, opening hours, directions and whether each website works.`, "/"),
  component: Home,
});

function Home() {
  const { t, lang } = useI18n();
  const cities = citiesInUse();
  return (
    <Page wide>
      <div className="max-w-2xl">
        <h1 className="text-[17px] leading-snug font-normal sm:text-lg">{t("tagline")}</h1>
        <p className="mt-1 mb-3 text-sm text-muted-foreground">
          {t("coverageNote")}{" "}
          {cities.length === 1 && (
            <Link to="/$city" params={{ city: cities[0]!.slug }} className="inline-flex min-h-11 items-center text-primary underline sm:min-h-0">
              {t("seeAreas").replace("{city}", placeName(cities[0], lang))}
            </Link>
          )}
        </p>
        <SearchBox />
      </div>
      {cities.length > 1 && (
        <section className="mt-5">
          <h2 className="section-label">{t("cities")}</h2>
          <div className="chip-row">
            {cities.map((c) => <Link key={c.slug} to="/$city" params={{ city: c.slug }} className="chip">{placeName(c, lang)}</Link>)}
          </div>
        </section>
      )}
      <section className="mt-5">
        <Directory items={businesses} />
      </section>
    </Page>
  );
}
