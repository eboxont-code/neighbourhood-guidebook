import { createFileRoute, Link, notFound, redirect, useNavigate } from "@tanstack/react-router";
import { List, Map as MapIcon } from "lucide-react";
import { useState } from "react";
import { NotFoundView, Page, pageMeta, useNow } from "@/components/site";
import { MapView } from "@/components/map-view";
import { CatIcon } from "@/components/cover";
import { Carousel, RowList, SectionHead, SeeAll } from "@/components/blocks";
import { placeName, areasIn, businessesIn, categoryRedirects, categoriesIn, getArea, getCategory, getCity, resolveSection } from "@/data/directory";
import { applyCatFilters, parseCatSearch, type CatFilters } from "@/lib/filters";
import { useI18n, type Key } from "@/lib/i18n";

export const Route = createFileRoute("/$city/$section")({
  validateSearch: (s: Record<string, unknown>): CatFilters => parseCatSearch(s),
  loader: ({ params }) => {
    const city = getCity(params.city);
    if (!city) throw notFound();
    const moved = categoryRedirects[params.section];
    if (moved) throw redirect({ to: "/$city/$section", params: { city: city.slug, section: moved }, statusCode: 301 });
    const sec = resolveSection(city.slug, params.section);
    if (!sec) throw notFound();
    const items = businessesIn(city.slug).filter((b) => (sec.kind === "area" ? b.area : b.category) === sec.slug);
    if (!items.length) throw notFound();
    return { city, sec };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Not found" }, { name: "robots", content: "noindex" }] };
    const { city, sec } = loaderData;
    const path = `/${city.slug}/${sec.slug}`;
    if (sec.kind === "area") {
      const a = getArea(sec.slug)!;
      return pageMeta(`Businesses in ${a.name}, ${city.name}`, `Local places in ${a.name}, ${city.name}, with phone numbers, opening hours, directions and whether each website works.`, path);
    }
    const c = getCategory(sec.slug)!;
    return pageMeta(`${c.name} in ${city.name}`, `${c.name} in ${city.name}, with phone numbers, opening hours, directions and whether each website works.`, path);
  },
  notFoundComponent: NotFoundView,
  component: SectionPage,
});

function SectionPage() {
  const { sec } = Route.useLoaderData();
  return sec.kind === "area" ? <AreaPage /> : <CategoryPage />;
}

function Crumb({ city, name, light = true }: { city: string; name: string; light?: boolean }) {
  return <Link to="/$city" params={{ city }} className={`-ml-1 inline-flex min-h-11 items-center gap-1 px-1 text-sm font-medium hover:underline ${light ? "text-[var(--hero-muted)]" : "text-muted-foreground"}`}>← {name}</Link>;
}

/** Neighbourhood feature: intro and mini map, then one row per category that has places here. */
function AreaPage() {
  const { city, sec } = Route.useLoaderData();
  const { t, lang } = useI18n();
  const a = getArea(sec.slug)!;
  const items = businessesIn(city.slug).filter((b) => b.area === a.slug);
  const areaName = placeName(a, lang);
  const catName = (c: { name: string; nameNe: string }) => (lang === "ne" ? c.nameNe : c.name);
  return (
    <>
      <section className="app-hero">
        <div className="mx-auto grid max-w-6xl gap-5 px-4 pt-2 pb-6 lg:grid-cols-[minmax(0,1fr)_26rem] lg:items-end lg:pt-6 lg:pb-10">
          <div>
            <Crumb city={city.slug} name={lang === "ne" ? city.nameNe : city.name} />
            <h1 className="text-2xl font-semibold sm:text-3xl">{areaName}</h1>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-[var(--hero-muted)]">{t(`intro_${a.slug.replace(/-/g, "_")}` as Key)}</p>
          </div>
          <MapView items={items} className="h-44 lg:h-56" note={false} />
        </div>
      </section>
      <Page wide>
        <div className="space-y-9">
          {categoriesIn(items).map((c) => {
            const row = items.filter((b) => b.category === c.slug);
            return (
              <section key={c.slug}>
                <SectionHead title={t("catInArea").replace("{cat}", catName(c)).replace("{area}", areaName)} sub={t(row.length === 1 ? "placesOne" : "placesN").replace("{n}", String(row.length))}
                  action={<SeeAll to="/$city/$section" params={{ city: city.slug, section: c.slug }} search={{ area: a.slug }}>{t("seeAll")}</SeeAll>} />
                <Carousel items={row} label={catName(c)} />
              </section>
            );
          })}
        </div>
      </Page>
    </>
  );
}

/** Focused list: sticky filters in the URL, compact rows, list or map. */
function CategoryPage() {
  const { city, sec } = Route.useLoaderData();
  const f = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const { t, lang } = useI18n();
  const now = useNow();
  const [view, setView] = useState<"list" | "map">("list");
  const c = getCategory(sec.slug)!;
  const all = businessesIn(city.slug).filter((b) => b.category === c.slug);
  const shown = applyCatFilters(all, f, now);
  const set = (patch: Partial<CatFilters>) => navigate({ search: (prev: CatFilters) => { const n = { ...prev, ...patch }; (Object.keys(n) as (keyof CatFilters)[]).forEach((k) => { if (!n[k]) delete n[k]; }); return n; }, replace: true });
  const areaOpts = areasIn(all);
  const pill = (on: boolean) => `chip !min-h-11 !text-[13px] ${on ? "chip-on" : ""}`;
  return (
    <>
      <section className={`venue-placeholder cat-${c.slug} !h-auto`}>
        <div className="mx-auto flex max-w-6xl items-end justify-between gap-4 px-4 pt-2 pb-5 lg:pt-6 lg:pb-8">
          <div className="min-w-0">
            <Crumb city={city.slug} name={lang === "ne" ? city.nameNe : city.name} light={false} />
            <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">{lang === "ne" ? c.nameNe : c.name}</h1>
            <p className="text-sm text-muted-foreground">{t(all.length === 1 ? "placesOne" : "placesN").replace("{n}", String(all.length))}</p>
          </div>
          <span aria-hidden className="cat-tile-icon !h-12 !w-12 shrink-0"><CatIcon category={c.slug} className="h-6 w-6" /></span>
        </div>
      </section>
      <div className="sticky-bar">
        <div className="mx-auto max-w-6xl px-4 py-2">
          <div className="chip-row !flex-nowrap lg:!overflow-x-auto" role="group" aria-label={t("filterBy")}>
            {areaOpts.length > 1 && (
              <>
                <button type="button" aria-pressed={!f.area} onClick={() => set({ area: undefined })} className={pill(!f.area)}>{t("allAreas")}</button>
                {areaOpts.map((a) => <button key={a.slug} type="button" aria-pressed={f.area === a.slug} onClick={() => set({ area: f.area === a.slug ? undefined : a.slug })} className={pill(f.area === a.slug)}>{placeName(a, lang)}</button>)}
                <span aria-hidden className="w-px shrink-0 self-stretch bg-border" />
              </>
            )}
            <button type="button" aria-pressed={!!f.open} onClick={() => set({ open: f.open ? undefined : true })} className={pill(!!f.open)}><span aria-hidden className="h-1.5 w-1.5 rounded-full bg-success" />{t("openNow")}</button>
          </div>
        </div>
      </div>
      <Page wide>
        <div className="mx-auto max-w-3xl">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              {t("sortLabel")}
              <select value={f.sort ?? "name"} onChange={(e) => set({ sort: e.target.value === "open" ? "open" : undefined })} className="min-h-11 rounded-full border border-border bg-card px-3 text-sm text-foreground">
                <option value="name">{t("sortName")}</option>
                <option value="open">{t("sortOpen")}</option>
              </select>
            </label>
            <div className="seg w-28 shrink-0" role="group" aria-label={t("viewToggle")}>
              <span aria-hidden className="seg-thumb" style={{ transform: view === "map" ? "translateX(100%)" : "none" }} />
              {(["list", "map"] as const).map((v) => (
                <button key={v} type="button" aria-pressed={view === v} aria-label={t(v === "list" ? "viewList" : "viewMap")} onClick={() => setView(v)}
                  className={`relative flex min-h-11 items-center justify-center rounded-full transition-colors ${view === v ? "text-primary" : "text-muted-foreground"}`}>
                  {v === "list" ? <List aria-hidden className="h-4 w-4" /> : <MapIcon aria-hidden className="h-4 w-4" />}
                </button>
              ))}
            </div>
          </div>
          <p className="mb-2 text-sm text-muted-foreground" aria-live="polite">{t("showing")} {shown.length} {t("ofTotal")} {all.length} {t("places")}</p>
          {shown.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-6 text-center">
              <p className="font-medium">{t("noResults")}</p>
              <button type="button" onClick={() => set({ area: undefined, open: undefined })} className="action-btn action-secondary mt-3 text-sm">{t("clearFilters")}</button>
            </div>
          ) : (
            <div key={view} className="page-enter">{view === "list" ? <RowList items={shown} /> : <MapView items={shown} />}</div>
          )}
        </div>
      </Page>
    </>
  );
}
