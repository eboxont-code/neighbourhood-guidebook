import { createFileRoute, Link } from "@tanstack/react-router";
import { CategoryTiles, Page, SearchBox, pageMeta, useNow } from "@/components/site";
import { AreaTiles, BusinessBand, Carousel, SectionHead } from "@/components/blocks";
import { areasInUse, businessesIn, categoriesIn, citiesInUse, placeName } from "@/data/directory";
import { isOpen } from "@/lib/filters";
import { useI18n } from "@/lib/i18n";
import { SITE_NAME } from "@/config";

export const Route = createFileRoute("/")({
  head: () => pageMeta("A local guide to everyday businesses in Nepal", `${SITE_NAME} is a local guide to everyday businesses in Nepal, starting with Kathmandu: phone numbers, opening hours, directions and whether each website works.`, "/"),
  component: Home,
});

/** Mixes categories so a row reads as a picked selection from across the city, not one type. */
function spread<T extends { category: string }>(list: T[], max: number): T[] {
  const byCat = new Map<string, T[]>();
  for (const b of list) byCat.set(b.category, [...(byCat.get(b.category) ?? []), b]);
  const out: T[] = [];
  while (out.length < max && [...byCat.values()].some((v) => v.length)) for (const v of byCat.values()) { const x = v.shift(); if (x && out.length < max) out.push(x); }
  return out;
}

function Home() {
  const { t, lang } = useI18n();
  const now = useNow();
  const cities = citiesInUse();
  const city = cities[0]!;
  const items = businessesIn(city.slug);
  const open = now ? items.filter((b) => isOpen(b, now)) : [];
  const useOpen = open.length >= 3;
  const row = spread(useOpen ? open : items.filter((b) => b.hoursVerified && b.hours?.length), 10);
  const cityName = placeName(city, lang);
  return (
    <>
      <section className="app-hero">
        <div className="mx-auto max-w-6xl px-4 pt-5 pb-8 lg:pt-12 lg:pb-14">
          <div className="max-w-2xl">
            <h1 className="text-[1.375rem] leading-tight font-semibold sm:text-[1.75rem] lg:text-[2.125rem]">{t("heroTitle")}</h1>
            <p className="mt-1 mb-4 text-sm leading-snug text-[var(--hero-muted)] sm:text-base">{t("coverageNote")}</p>
            <SearchBox />
          </div>
        </div>
      </section>
      <Page wide>
        <div className="space-y-10 lg:space-y-14">
          <section>
            <SectionHead title={t("exploreAreas")} sub={`${cityName} · ${t("placesN").replace("{n}", String(items.length))}`}
              action={<Link to="/$city" params={{ city: city.slug }} className="-my-2 inline-flex min-h-11 shrink-0 items-center text-sm font-semibold text-primary hover:underline">{t("seeAll")} ›</Link>} />
            <AreaTiles city={city.slug} items={items} list={areasInUse(city.slug)} />
          </section>

          <section>
            <SectionHead title={useOpen ? t("openNow") : t("confirmedTitle")} sub={useOpen ? t("openNowSub") : t("confirmedSub")} />
            <Carousel items={row} label={useOpen ? t("openNow") : t("confirmedTitle")} />
          </section>

          <div className="rounded-2xl border border-border bg-card p-3 sm:p-4">
            <CategoryTiles city={city.slug} cats={categoriesIn(items)} />
          </div>

          <BusinessBand />

          <div className="text-center">
            <Link to="/$city" params={{ city: city.slug }} className="action-btn action-secondary">{t("seeAllIn").replace("{city}", cityName)}</Link>
          </div>
        </div>
      </Page>
    </>
  );
}
