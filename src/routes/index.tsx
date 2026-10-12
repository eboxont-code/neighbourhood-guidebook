import { createFileRoute, Link } from "@tanstack/react-router";
import { CategoryTiles, Page, SearchBox, pageMeta } from "@/components/site";
import { Directory } from "@/components/directory";
import { businesses, categoriesIn, citiesInUse, placeName } from "@/data/directory";
import { useI18n } from "@/lib/i18n";
import { SITE_NAME } from "@/config";

export const Route = createFileRoute("/")({
  head: () => pageMeta("A local guide to everyday businesses in Nepal", `${SITE_NAME} is a local guide to everyday businesses in Nepal, starting with Kathmandu: phone numbers, opening hours, directions and whether each website works.`, "/"),
  component: Home,
});

function Home() {
  const { t, lang } = useI18n();
  const cities = citiesInUse();
  const city = cities[0]?.slug ?? "kathmandu";
  return (
    <>
      <section className="app-hero">
        <div className="mx-auto max-w-6xl px-4 pt-5 pb-12 lg:pt-12 lg:pb-20">
          <div className="max-w-2xl">
            <h1 className="text-[1.75rem] leading-tight font-extrabold sm:text-4xl lg:text-5xl">{t("heroTitle")}</h1>
            <p className="mt-1.5 mb-4 text-[15px] leading-snug opacity-90 sm:text-base">{t("tagline")}</p>
            <SearchBox />
            <p className="mt-2 text-sm opacity-85">
              {t("coverageNote")}{" "}
              {cities.length === 1 && (
                <Link to="/$city" params={{ city }} className="inline-flex min-h-11 items-center font-bold underline underline-offset-2 sm:min-h-0">
                  {t("seeAreas").replace("{city}", placeName(cities[0], lang))}
                </Link>
              )}
            </p>
          </div>
        </div>
      </section>
      <Page wide>
        <div className="-mt-12 rounded-3xl bg-card p-3.5 shadow-[var(--shadow-lift)] sm:p-5 lg:-mt-16">
          <CategoryTiles city={city} cats={categoriesIn(businesses)} />
        </div>
        {cities.length > 1 && (
          <section className="mt-5">
            <h2 className="section-label">{t("cities")}</h2>
            <div className="chip-row">
              {cities.map((c) => <Link key={c.slug} to="/$city" params={{ city: c.slug }} className="chip">{placeName(c, lang)}</Link>)}
            </div>
          </section>
        )}
        <section className="mt-6">
          <Directory items={businesses} typeOnDesktopOnly />
        </section>
      </Page>
    </>
  );
}
