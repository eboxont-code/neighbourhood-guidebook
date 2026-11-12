import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { Maximize2 } from "lucide-react";
import { NotFoundView, Page, pageMeta, useNow } from "@/components/site";
import { FullMap, MapView } from "@/components/map-view";
import { CatIcon } from "@/components/cover";
import { RowList } from "@/components/blocks";
import { areasIn, businessesIn, categoriesIn, categoryRedirects, getArea, getCategory, getCity, hasPin, placeName, type Area, type Business, type Category, type City } from "@/data/directory";
import { isOpen } from "@/lib/filters";
import { comboBreadcrumbJsonLd, itemListJsonLd } from "@/lib/seo";
import { sortByDistance, useLocation } from "@/lib/geo";
import { useI18n } from "@/lib/i18n";
import { shareImage } from "@/lib/social-meta";
import { qualifiesLocalPage } from "@/lib/local-pages";

/** Listings in one area and one category. Only combos with at least one listing exist. */
function comboItems(city: string, area: string, category: string): Business[] {
  return businessesIn(city).filter((b) => b.area === area && b.category === category);
}

export const Route = createFileRoute("/$city/$section_/$category")({
  loader: ({ params }) => {
    const city = getCity(params.city);
    if (!city) throw notFound();
    const area = getArea(params.section);
    if (!area || area.city !== city.slug) throw notFound();
    const moved = categoryRedirects[params.category];
    if (moved) throw redirect({ to: "/$city/$section/$category", params: { city: city.slug, section: area.slug, category: moved }, statusCode: 301 });
    const cat = getCategory(params.category);
    if (!cat || comboItems(city.slug, area.slug, cat.slug).length === 0) throw notFound();
    if (qualifiesLocalPage(area.slug, cat.slug)) {
      throw redirect({ to: "/a/$areaSlug/$categorySlug", params: { areaSlug: area.slug, categorySlug: cat.slug }, statusCode: 301 });
    }
    return { city, area, cat };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Not found" }, { name: "robots", content: "noindex" }] };
    const { city, area, cat } = loaderData;
    const items = comboItems(city.slug, area.slug, cat.slug);
    const name = `${cat.name} in ${area.name}, ${city.name}`;
    const n = items.length;
    const desc = `${n === 1 ? "1 place" : `${n} places`} in ${area.name}, ${city.name} listed under ${cat.name.toLowerCase()}, with phone numbers, opening hours, directions and whether each website works.`;
    const head = pageMeta(name, desc, `/${city.slug}/${area.slug}/${cat.slug}`, shareImage());
    return { ...head, meta: [...head.meta, { name: "robots", content: "noindex,follow" }], scripts: [
      { type: "application/ld+json", children: JSON.stringify(comboBreadcrumbJsonLd(city, area, cat)) },
      { type: "application/ld+json", children: JSON.stringify(itemListJsonLd(name, items)) },
    ] };
  },
  notFoundComponent: NotFoundView,
  component: ComboPage,
});

function ComboPage() {
  const { city, area, cat } = Route.useLoaderData() as { city: City; area: Area; cat: Category };
  const { t, lang } = useI18n();
  const now = useNow();
  const { here } = useLocation();
  const [full, setFull] = useState(false);
  const close = useCallback(() => setFull(false), []);
  const all = comboItems(city.slug, area.slug, cat.slug);
  const items = here ? sortByDistance(all, here) : all;
  const open = all.filter((b) => isOpen(b, now)).length;
  const areaName = placeName(area, lang);
  const cityName = placeName(city, lang);
  const catName = lang === "ne" ? cat.nameNe : cat.name;
  const heading = t("catInArea").replace("{cat}", catName).replace("{area}", areaName);
  const pinned = all.some(hasPin);
  const inCity = businessesIn(city.slug);
  const otherAreas = areasIn(inCity.filter((b) => b.category === cat.slug)).filter((a) => a.slug !== area.slug);
  const otherCats = categoriesIn(inCity.filter((b) => b.area === area.slug)).filter((c) => c.slug !== cat.slug);
  const chip = "chip !min-h-11 shrink-0 !text-[13px]";
  const count = (n: number) => (n === 1 ? t("comboCountOne") : t("comboCountN").replace("{n}", String(n))).replace("{area}", areaName).replace("{city}", cityName);
  const openLine = now === null ? "" : open === 0 ? t("comboOpenNone") : open === 1 ? t("comboOpenOne") : t("comboOpenN").replace("{n}", String(open));

  return (
    <>
      <section className={`venue-placeholder cat-${cat.slug} !h-auto`}>
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 pt-2 pb-6 lg:pt-8 lg:pb-10">
          <div className="min-w-0">
            <nav aria-label="Breadcrumb" className="-ml-1 flex flex-wrap items-center text-sm font-medium text-muted-foreground">
              <Link to="/$city" params={{ city: city.slug }} className="inline-flex min-h-11 items-center px-1 hover:underline">{cityName}</Link>
              <span aria-hidden>›</span>
              <Link to="/$city/$section" params={{ city: city.slug, section: area.slug }} className="inline-flex min-h-11 items-center px-1 hover:underline">{areaName}</Link>
            </nav>
            <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">{heading}</h1>
            <p className="mt-1 text-[15px] font-medium text-[var(--ph-ink)]">{count(all.length)} {openLine}</p>
            <p className="mt-1 max-w-2xl text-sm leading-snug text-muted-foreground">{t("comboHoursNote")}</p>
          </div>
          <span aria-hidden className="cat-tile-icon !h-16 !w-16 shrink-0 lg:!h-20 lg:!w-20"><CatIcon category={cat.slug} className="h-7 w-7 lg:h-9 lg:w-9" /></span>
        </div>
      </section>

      <Page wide>
        <div className={pinned ? "lg:grid lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-10" : "mx-auto max-w-3xl"}>
          <div className="min-w-0 space-y-8">
            <RowList items={items} />
            {pinned && (
              <section className="lg:hidden">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <h2 className="text-lg font-semibold">{t("comboMap")}</h2>
                  {!full && <button type="button" onClick={() => setFull(true)} className="action-btn action-dark min-h-11 px-4 text-sm"><Maximize2 aria-hidden className="h-4 w-4" />{t("tapFullMap")}</button>}
                </div>
                {full ? <FullMap items={all} onClose={close} closeLabel={t("closeMap")} /> : <MapView items={all} className="h-56" />}
              </section>
            )}
            {otherCats.length > 0 && (
              <section>
                <h2 className="mb-3 text-lg font-semibold">{t("comboMoreIn").replace("{area}", areaName)}</h2>
                <div className="flex flex-wrap gap-2">
                  {otherCats.map((c) => <Link key={c.slug} to="/$city/$section/$category" params={{ city: city.slug, section: area.slug, category: c.slug }} className={chip}><CatIcon category={c.slug} className="h-3.5 w-3.5" />{lang === "ne" ? c.nameNe : c.name}</Link>)}
                </div>
              </section>
            )}
            {otherAreas.length > 0 && (
              <section>
                <h2 className="mb-3 text-lg font-semibold">{t("comboOtherAreas").replace("{cat}", catName)}</h2>
                <div className="flex flex-wrap gap-2">
                  {otherAreas.map((a) => <Link key={a.slug} to="/$city/$section/$category" params={{ city: city.slug, section: a.slug, category: cat.slug }} className={chip}>{placeName(a, lang)}</Link>)}
                </div>
              </section>
            )}
            <p><Link to="/$city/$section" params={{ city: city.slug, section: cat.slug }} className="inline-flex min-h-11 items-center text-sm font-semibold underline-offset-4 hover:underline">{t("comboAllIn").replace("{cat}", catName).replace("{city}", cityName)} ›</Link></p>
          </div>
          {pinned && (
            <aside className="hidden lg:block">
              <div className="sticky top-32"><MapView items={all} className="h-[calc(100vh-12rem)] max-h-[38rem] min-h-80" /></div>
            </aside>
          )}
        </div>
      </Page>
    </>
  );
}
