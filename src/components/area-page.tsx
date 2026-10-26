import { Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { ArrowRight, Maximize2, MessageSquarePlus, Store } from "lucide-react";
import { Page, useNow } from "@/components/site";
import { FullMap, MapView } from "@/components/map-view";
import { CatIcon } from "@/components/cover";
import { areaTone, count, RowList } from "@/components/blocks";
import { VenueRow } from "@/components/venue";
import { businessesIn, categoriesIn, getArea, placeName, type City } from "@/data/directory";
import { isOpen } from "@/lib/filters";
import { sortByDistance, useLocation } from "@/lib/geo";
import { areaFacts, otherAreas } from "@/lib/areas";
import { newListings } from "@/lib/venue";
import { useI18n, type Key } from "@/lib/i18n";

/** Neighbourhood guide: facts, a jump bar, open-now first, groups sized to their real counts, a sticky map on desktop. */
export function AreaGuide({ city, slug }: { city: City; slug: string }) {
  const { t, lang } = useI18n();
  const now = useNow();
  const { here } = useLocation();
  const a = getArea(slug)!;
  const items = businessesIn(city.slug).filter((b) => b.area === a.slug);
  const order = <T extends typeof items>(list: T) => (here ? sortByDistance(list, here) : list);
  const areaName = placeName(a, lang);
  const altName = lang === "ne" ? a.name : a.nameNe;
  const cityName = placeName(city, lang);
  const catName = (c: { name: string; nameNe: string }) => (lang === "ne" ? c.nameNe : c.name);
  const cats = categoriesIn(items);
  const facts = areaFacts(a.slug, now);
  const open = order(items.filter((b) => isOpen(b, now)));
  const fresh = now ? newListings(businessesIn(city.slug), now).filter((b) => b.area === a.slug) : [];
  const pinned = facts.pinned > 0;
  const thin = items.length <= 2;
  const [full, setFull] = useState(false);
  const close = useCallback(() => setFull(false), []);
  const [active, setActive] = useState("all");

  useEffect(() => {
    const io = new IntersectionObserver((es) => { for (const e of es) if (e.isIntersecting) setActive(e.target.id.replace(/^g-/, "")); }, { rootMargin: "-130px 0px -55% 0px" });
    document.querySelectorAll("[data-group]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [a.slug, open.length]);
  const jump = (id: string) => document.getElementById(id === "all" ? "g-all" : `g-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });

  const fact = (n: number, one: Key, many: Key) => (n > 0 ? <li className="hero-fact">{(n === 1 ? t(one) : t(many)).replace("{n}", String(n))}</li> : null);
  const others = otherAreas(city.slug, a.slug);
  const pill = (on: boolean) => `chip !min-h-11 shrink-0 !text-[13px] ${on ? "chip-on" : ""}`;

  return (
    <>
      <section className="app-hero">
        <div className="mx-auto max-w-6xl px-5 pt-2 pb-6 lg:pt-6 lg:pb-10">
          <Link to="/$city" params={{ city: city.slug }} className="-ml-1 inline-flex min-h-11 items-center gap-1 px-1 text-sm font-medium text-[var(--hero-muted)] hover:underline">← {cityName}</Link>
          <h1 className="text-2xl font-semibold sm:text-3xl">{areaName} <span lang={lang === "ne" ? "en" : "ne"} className="ml-1 align-middle text-base font-medium text-[var(--hero-muted)]">{altName}</span></h1>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-[var(--hero-muted)]">{t(`intro_${a.slug.replace(/-/g, "_")}` as Key)}</p>
          <ul aria-label={t("atGlance")} className="mt-4 flex flex-wrap gap-2">
            {fact(facts.places, "placesOne", "placesN")}
            {fact(facts.types, "typesOne", "typesN")}
            {fact(facts.open, "openN", "openN")}
            {fact(facts.pinned, "onMapN", "onMapN")}
          </ul>
        </div>
      </section>

      {cats.length > 1 && (
        <nav aria-label={t("jumpLabel")} className="sticky-bar">
          <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-5 py-2 [scrollbar-width:none]">
            <button type="button" aria-pressed={active === "all"} onClick={() => jump("all")} className={pill(active === "all")}>{t("jumpAll")} <span className="tabular-nums opacity-70">{items.length}</span></button>
            {cats.map((c) => {
              const n = items.filter((b) => b.category === c.slug).length;
              return <button key={c.slug} type="button" aria-pressed={active === c.slug} onClick={() => jump(c.slug)} className={pill(active === c.slug)}><CatIcon category={c.slug} className="h-3.5 w-3.5" />{catName(c)} <span className="tabular-nums opacity-70">{n}</span></button>;
            })}
          </div>
        </nav>
      )}

      <Page wide>
        <div className={pinned ? "lg:grid lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-10 xl:grid-cols-[minmax(0,1fr)_28rem]" : ""}>
          <div id="g-all" data-group className="min-w-0 scroll-mt-32 space-y-9">
            {fresh.length > 0 && (
              <section>
                <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold"><span aria-hidden className="h-2 w-2 rounded-full bg-brand-accent" />{t("newInArea").replace("{area}", areaName)} <span className="text-sm font-medium text-muted-foreground tabular-nums">{fresh.length}</span></h2>
                {fresh.length >= 3 ? <VenueRow items={fresh} label={t("newInArea").replace("{area}", areaName)} /> : <RowList items={fresh} />}
              </section>
            )}
            {open.length > 0 && (
              <section>
                <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold"><span aria-hidden className="h-2 w-2 rounded-full bg-success" />{t("openNowIn").replace("{area}", areaName)}</h2>
                <VenueRow items={open} label={t("openNowIn").replace("{area}", areaName)} />
              </section>
            )}

            {pinned && (
              <div className="lg:hidden">
                {!full && (
                  <div className="mb-2 flex justify-end">
                    <button type="button" onClick={() => setFull(true)} className="action-btn action-dark min-h-11 px-4 text-sm"><Maximize2 aria-hidden className="h-4 w-4" />{t("tapFullMap")}</button>
                  </div>
                )}
                {full ? <FullMap items={items} onClose={close} closeLabel={t("closeMap")} /> : <MapView items={items} className="h-56" />}
              </div>
            )}

            {cats.map((c) => {
              const row = order(items.filter((b) => b.category === c.slug));
              return (
                <section key={c.slug} id={`g-${c.slug}`} data-group className="scroll-mt-32">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h2 className={`flex min-w-0 items-center gap-2.5 text-lg font-semibold cat-${c.slug}`}>
                      <span aria-hidden className="cat-tile-icon !h-8 !w-8 shrink-0 !bg-[var(--ph-bg)]"><CatIcon category={c.slug} className="h-4 w-4" /></span>
                      <span className="min-w-0">{t("catInArea").replace("{cat}", catName(c)).replace("{area}", areaName)} <span className="text-sm font-normal text-muted-foreground">· {row.length}</span></span>
                    </h2>
                    <Link to="/$city/$section/$category" params={{ city: city.slug, section: a.slug, category: c.slug }} className="-my-2 inline-flex min-h-11 shrink-0 items-center text-sm font-semibold text-foreground underline-offset-4 hover:underline">{t("seeAll")} ›</Link>
                  </div>
                  {row.length >= 3 ? <VenueRow items={row} label={catName(c)} /> : <RowList items={row} />}
                </section>
              );
            })}

            {thin && (
              <section className="rounded-2xl bg-muted p-5 sm:p-6">
                <h2 className="text-lg font-semibold">{t("thinTitle").replace("{area}", areaName)}</h2>
                <p className="mt-1 text-[15px] leading-snug text-muted-foreground">{t("thinBody")}</p>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <Link to="/add-a-business" className="action-btn action-secondary text-sm"><Store aria-hidden className="h-4 w-4" />{t("addBusiness")}</Link>
                </div>
              </section>
            )}
          </div>

          {pinned && (
            <aside className="hidden lg:block">
              <div className="sticky top-32">
                <MapView items={items} className="h-[calc(100vh-12rem)] max-h-[38rem] min-h-80" />
              </div>
            </aside>
          )}
        </div>
      </Page>

      {others.length > 0 && (
        <section className="band band-alt">
          <div className="mx-auto max-w-6xl px-5">
            <h2 className="mb-3 text-lg font-semibold sm:text-xl">{thin ? t("nearbyAreas") : t("moreAreasIn").replace("{city}", cityName)}</h2>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
              {others.map((o, i) => (
                <Link key={o.slug} to="/$city/$section" params={{ city: city.slug, section: o.slug }} className={`area-tile ${areaTone(o.slug, i)}`}>
                  <span className="text-base font-semibold text-foreground">{placeName(o, lang)}</span>
                  <span lang={lang === "ne" ? "en" : "ne"} className="text-[13px] text-muted-foreground">{lang === "ne" ? o.name : o.nameNe}</span>
                  <span className="text-[13px] text-[var(--ph-ink)]">{count(t as never, businessesIn(city.slug).filter((b) => b.area === o.slug).length)}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="band">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h2 className="text-base font-semibold">{t("ownerBandTitle").replace("{area}", areaName)}</h2>
            <p className="mt-0.5 max-w-2xl text-sm leading-snug text-muted-foreground">{t("ownerBandBody")}</p>
          </div>
          <Link to="/for-businesses" className="action-btn action-secondary shrink-0 text-sm">{t("ownerBandCta")}<ArrowRight aria-hidden className="h-4 w-4" /></Link>
        </div>
      </section>
    </>
  );
}

