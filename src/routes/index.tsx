import { createFileRoute, Link } from "@tanstack/react-router";
import { CategoryTiles, pageMeta, useNow } from "@/components/site";
import { AreaTiles, BusinessBand, SectionHead } from "@/components/blocks";
import { LocationCard, VenueRow } from "@/components/venue";
import { SearchCard } from "@/components/search-card";
import { areasInUse, businessesIn, categoriesIn, citiesInUse, hasPin, placeName } from "@/data/directory";
import { isOpen } from "@/lib/filters";
import { sortByDistance, useLocation } from "@/lib/geo";
import { newListings } from "@/lib/venue";
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
  const { here } = useLocation();
  const city = citiesInUse()[0]!;
  const items = businessesIn(city.slug);
  const open = now ? items.filter((b) => isOpen(b, now)) : [];
  const useOpen = open.length >= 3;
  const row = spread(useOpen ? open : items.filter((b) => b.hoursVerified && b.hours?.length), 10);
  const near = here ? sortByDistance(items.filter(hasPin), here).slice(0, 10) : [];
  const fresh = now ? newListings(items, now).slice(0, 10) : [];
  const cityName = placeName(city, lang);
  return (
    <main>
      <section className="app-hero">
        <div className="mx-auto max-w-6xl px-5 pt-5 pb-6 lg:grid lg:grid-cols-[minmax(0,1fr)_26rem] lg:items-center lg:gap-10 lg:pt-12 lg:pb-14">
          <div className="mb-4 lg:mb-0">
            <h1 className="text-[1.5rem] leading-[1.15] font-semibold tracking-tight sm:text-[1.875rem] lg:text-[2.375rem]">{t("heroTitle")}</h1>
            <p className="mt-1.5 text-sm leading-snug text-[var(--hero-muted)] sm:text-base">{t("coverageNote")}</p>
          </div>
          <SearchCard />
        </div>
      </section>

      <section className="band !pt-5">
        <div className="mx-auto max-w-6xl space-y-6 px-5">
          <LocationCard />
          {near.length > 0 && (
            <div>
              <SectionHead title={t("nearYou")} sub={t("nearYouSub")} />
              <VenueRow items={near} label={t("nearYou")} />
            </div>
          )}
          <CategoryTiles city={city.slug} cats={categoriesIn(items)} />
          {fresh.length > 0 && (
            <div>
              <SectionHead title={t("justAdded")} sub={t("justAddedSub")}
                action={<Link to="/new" className="-my-2 inline-flex min-h-11 shrink-0 items-center text-sm font-semibold text-foreground underline-offset-4 hover:underline">{t("seeAllNew")} ›</Link>} />
              <VenueRow items={fresh} label={t("justAdded")} />
            </div>
          )}
        </div>
      </section>

      <section className="band band-alt">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHead title={useOpen ? t("openNow") : t("confirmedTitle")} sub={useOpen ? t("openNowSub") : t("confirmedSub")} />
          <VenueRow items={row} label={useOpen ? t("openNow") : t("confirmedTitle")} />
        </div>
      </section>

      <section className="band">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHead title={t("exploreAreas")} sub={`${cityName} · ${t("placesN").replace("{n}", String(items.length))}`}
            action={<Link to="/$city" params={{ city: city.slug }} className="-my-2 inline-flex min-h-11 shrink-0 items-center text-sm font-semibold text-foreground underline-offset-4 hover:underline">{t("seeAll")} ›</Link>} />
          <AreaTiles city={city.slug} items={items} list={areasInUse(city.slug)} />
        </div>
      </section>

      <section className="band band-alt">
        <div className="mx-auto max-w-6xl space-y-6 px-5">
          <BusinessBand />
          <div className="text-center">
            <Link to="/$city" params={{ city: city.slug }} className="action-btn action-secondary">{t("seeAllIn").replace("{city}", cityName)}</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
