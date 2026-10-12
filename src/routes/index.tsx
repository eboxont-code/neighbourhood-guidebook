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
        <div className="mx-auto max-w-6xl px-4 pt-4 pb-10 lg:pt-10 lg:pb-16">
          <div className="max-w-2xl">
            <h1 className="text-[1.375rem] leading-tight font-semibold sm:text-[1.75rem] lg:text-[2.125rem]">{t("heroTitle")}</h1>
            <p className="mt-1 mb-3 text-sm leading-snug text-[var(--hero-muted)] sm:text-base">{t("tagline")}</p>
            <SearchBox />
            <p className="mt-1.5 text-[13px] leading-snug text-[var(--hero-muted)] sm:text-sm">
              {t("coverageNote")}{" "}
              {cities.length === 1 && (
                <Link to="/$city" params={{ city }} className="-my-3 inline-block py-3 font-semibold text-[var(--hero-foreground)] underline underline-offset-2">
                  {t("seeAreas").replace("{city}", placeName(cities[0], lang))}
                </Link>
              )}
            </p>
          </div>
        </div>
      </section>
      <Page wide>
        <div className="-mt-7 rounded-2xl border border-border bg-card p-3 sm:p-4 shadow-[var(--shadow-lift)] sm:p-5 lg:-mt-9">
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
        <section className="mt-7">
          <Directory items={businesses} typeOnDesktopOnly />
        </section>
      </Page>
    </>
  );
}
