import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { NotFoundView, Page, pageMeta } from "@/components/site";
import { MapView } from "@/components/map-view";
import { CatIcon } from "@/components/cover";
import { areaTone, count, firstSentence, SectionHead } from "@/components/blocks";
import { placeName, areasInUse, businessesIn, categoriesIn, getCity } from "@/data/directory";
import { useI18n, type Key } from "@/lib/i18n";
import { shareImage, shareText } from "@/lib/social-meta";

export const Route = createFileRoute("/$city/")({
  loader: ({ params }) => {
    const city = getCity(params.city);
    if (!city || !businessesIn(city.slug).length) throw notFound();
    return { city };
  },
  head: ({ loaderData }) => loaderData
    ? cityMeta(loaderData.city.slug, loaderData.city.name)
    : { meta: [{ title: "Not found" }, { name: "robots", content: "noindex" }] },
  notFoundComponent: NotFoundView,
  component: CityPage,
});

function CityPage() {
  const { city } = Route.useLoaderData();
  const { t, lang } = useI18n();
  const items = businessesIn(city.slug);
  return (
    <>
      <section className="app-hero">
        <div className="mx-auto max-w-6xl px-4 pt-6 pb-8 lg:pt-10 lg:pb-12">
          <p className="section-label !text-[var(--hero-muted)]">{count(t as never, items.length)}</p>
          <h1 className="text-2xl font-semibold sm:text-3xl">{lang === "ne" ? city.nameNe : city.name}</h1>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-[var(--hero-muted)]">{t(`intro_city_${city.slug}` as Key)}</p>
        </div>
      </section>
      <Page wide>
        <div className="space-y-10 lg:grid lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-8 lg:space-y-0">
          <section className="lg:sticky lg:top-20 lg:self-start">
            <SectionHead title={t("cityMapTitle")} />
            <MapView items={items} className="h-[50vh] lg:h-[68vh]" />
          </section>
          <div className="space-y-10">
            <section>
              <SectionHead title={t("browseAreas")} />
              <ul className="space-y-2.5">
                {areasInUse(city.slug).map((a, i) => (
                  <li key={a.slug}>
                    <Link to="/$city/$section" params={{ city: city.slug, section: a.slug }} className={`area-tile !min-h-0 ${areaTone(a.slug, i)}`}>
                      <span className="flex items-baseline justify-between gap-3">
                        <span className="text-base font-semibold text-foreground">{placeName(a, lang)}</span>
                        <span className="shrink-0 text-[13px] text-[var(--ph-ink)]">{count(t as never, items.filter((b) => b.area === a.slug).length)}</span>
                      </span>
                      <span className="mt-1 line-clamp-2 text-[13px] leading-snug text-muted-foreground">{firstSentence(t(`intro_${a.slug.replace(/-/g, "_")}` as Key))}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <SectionHead title={t("cityTypesTitle")} />
              <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
                {categoriesIn(items).map((c) => (
                  <li key={c.slug}>
                    <Link to="/$city/$section" params={{ city: city.slug, section: c.slug }} className={`cat-${c.slug} flex min-h-12 items-center gap-3 px-4 py-2.5 hover:bg-muted/60`}>
                      <span className="cat-tile-icon !h-8 !w-8 !bg-[var(--ph-bg)]"><CatIcon category={c.slug} className="h-4 w-4" /></span>
                      <span className="flex-1 font-medium">{lang === "ne" ? c.nameNe : c.name}</span>
                      <span className="text-sm text-muted-foreground tabular-nums">{items.filter((b) => b.category === c.slug).length}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </Page>
    </>
  );
}

function cityMeta(slug: string, name: string) {
  return pageMeta(shareText("shareCityTitle", { city: name }), shareText("shareCityDescription", { city: name }), `/${slug}`, shareImage());
}
