import { createFileRoute, notFound } from "@tanstack/react-router";
import { NotFoundView, Page } from "@/components/site";
import { RowList } from "@/components/blocks";
import { getArea, getCategory, getCity, placeName } from "@/data/directory";
import { localFacts, localItems, qualifiesLocalPage } from "@/lib/local-pages";
import { dict, useI18n, type Key } from "@/lib/i18n";
import { itemListJsonLd, pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/a/$areaSlug_/$categorySlug")({
  loader: ({ params }) => {
    const area = getArea(params.areaSlug);
    const category = getCategory(params.categorySlug);
    const city = area ? getCity(area.city) : undefined;
    if (!area || !category || !city || !qualifiesLocalPage(area.slug, category.slug)) throw notFound();
    return { area, category, city, items: localItems(area.slug, category.slug) };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Page not found | Sewa" }, { name: "robots", content: "noindex,follow" }] };
    const { area, category, city, items } = loaderData;
    const name = `${category.name} in ${area.name}, ${city.name}`;
    const facts = localFacts(items);
    const description = `${items.length} recorded ${category.name.toLowerCase()} listings in ${area.name}, ${city.name}. ${facts.mapped} mapped, ${facts.saturday} with Saturday hours and ${facts.verified} verified against official sources.`;
    const head = pageMeta(name, description, `/a/${area.slug}/${category.slug}`);
    const title = `${name} | Sewa`;
    return { ...head, meta: head.meta.map((meta) => "title" in meta ? { title } : meta["property"] === "og:title" || meta["name"] === "twitter:title" ? { ...meta, content: title } : meta), scripts: [{ type: "application/ld+json", children: JSON.stringify(itemListJsonLd(name, items)) }] };
  },
  notFoundComponent: NotFoundView,
  component: LocalPage,
});

function LocalPage() {
  const { area, category, items } = Route.useLoaderData();
  const { t, lang } = useI18n();
  const introKey = `intro_${area.slug.replace(/-/g, "_")}` as Key;
  const facts = localFacts(items);
  let summary = t("localSummary");
  for (const [key, count] of Object.entries(facts)) summary = summary.replace(`{${key}}`, new Intl.NumberFormat(lang === "ne" ? "ne-NP" : "en").format(count));
  return <>
    <section className={`venue-placeholder cat-${category.slug} !h-auto`}>
      <div className="mx-auto max-w-6xl px-5 py-6 lg:py-10">
        <h1 className="text-2xl font-semibold sm:text-3xl">{t("catInArea").replace("{cat}", lang === "ne" ? category.nameNe : category.name).replace("{area}", placeName(area, lang))}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">{summary}</p>
        {dict.en[introKey] && <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">{t(introKey)}</p>}
        <p className="mt-2 text-sm text-muted-foreground">{t("localHoursNote")}</p>
      </div>
    </section>
    <Page wide><RowList items={items} /></Page>
  </>;
}