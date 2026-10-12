import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";
import { NotFoundView, Page, pageMeta } from "@/components/site";
import { Directory } from "@/components/directory";
import { CatIcon } from "@/components/cover";
import { placeName, businessesIn, categoryRedirects, getArea, getCategory, getCity, resolveSection } from "@/data/directory";
import { useI18n, type Key } from "@/lib/i18n";

export const Route = createFileRoute("/$city/$section")({
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
  const { city, sec } = Route.useLoaderData();
  const { t, lang } = useI18n();
  const items = businessesIn(city.slug).filter((b) => (sec.kind === "area" ? b.area : b.category) === sec.slug);
  const cityName = lang === "ne" ? city.nameNe : city.name;
  const crumb = (
    <p className="text-sm">
      <Link to="/$city" params={{ city: city.slug }} className="inline-flex min-h-11 items-center gap-1 rounded-full bg-card/15 px-3 font-bold underline-offset-2 hover:underline">← {cityName}</Link>
    </p>
  );
  if (sec.kind === "area") {
    const a = getArea(sec.slug)!;
    return (
      <>
        <section className="app-hero">
          <div className="mx-auto max-w-6xl px-4 pt-3 pb-8 lg:pt-6 lg:pb-12">
            <div className="max-w-2xl">
              {crumb}
              <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">{placeName(a, lang)}</h1>
              <p className="mt-2 text-[15px] leading-relaxed opacity-90 sm:text-base">{t(`intro_${a.slug.replace(/-/g, "_")}` as Key)}</p>
            </div>
          </div>
        </section>
        <Page wide><Directory key={a.slug} items={items} filterArea={false} /></Page>
      </>
    );
  }
  const c = getCategory(sec.slug)!;
  return (
    <>
      <section className={`venue-placeholder cat-${c.slug} !h-auto`}>
        <div className="mx-auto flex max-w-6xl items-end justify-between gap-4 px-4 pt-3 pb-6 lg:pt-6 lg:pb-10">
          <div className="min-w-0">
            {crumb}
            <h1 className="mt-1 text-2xl font-semibold text-foreground sm:text-3xl">{lang === "ne" ? c.nameNe : c.name}</h1>
          </div>
          <span aria-hidden className="cat-tile-icon !h-16 !w-16 shrink-0"><CatIcon category={c.slug} className="h-8 w-8" /></span>
        </div>
      </section>
      <Page wide><Directory key={c.slug} items={items} filterType={false} /></Page>
    </>
  );
}
