import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CategoryTiles, NotFoundView, Page, pageMeta } from "@/components/site";
import { Directory } from "@/components/directory";
import { placeName, areasInUse, getArea, businessesIn, categoriesIn, getCity } from "@/data/directory";
import { useI18n, type Key } from "@/lib/i18n";

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
        <div className="mx-auto max-w-6xl px-4 pt-5 pb-10 lg:pt-8 lg:pb-14">
          <div className="max-w-2xl">
            <h1 className="text-2xl font-semibold sm:text-3xl">{lang === "ne" ? city.nameNe : city.name}</h1>
            <p className="mt-2 text-[15px] leading-relaxed text-[var(--hero-muted)] sm:text-base">{t(`intro_city_${city.slug}` as Key)}</p>
          </div>
        </div>
      </section>
      <Page wide>
        <div className="-mt-7 rounded-2xl border border-border bg-card p-3 sm:p-4 lg:-mt-9">
          <CategoryTiles city={city.slug} cats={categoriesIn(items)} />
        </div>
        <section className="mt-6">
          <h2 className="section-title">{t("browseAreas")}</h2>
          <div className="chip-row">
            {areasInUse(city.slug).map((a) => <Link key={a.slug} to="/$city/$section" params={{ city: city.slug, section: a.slug }} className="chip">{placeName(a, lang)}</Link>)}
          </div>
        </section>
        <section className="mt-6">
          <Directory items={items} filterArea={false} typeOnDesktopOnly />
        </section>
      </Page>
    </>
  );
}

function cityMeta(slug: string, name: string) {
  const names = areasInUse(slug).map((a) => getArea(a.slug)?.name ?? a.slug).slice(0, 4);
  const list = names.length > 1 ? `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}` : names[0] ?? name;
  return pageMeta(`${name} by neighbourhood: salons, cafés, hotels and more`, `Everyday places in ${name}, area by area, including ${list}, with phone numbers, opening hours and directions you can check.`, `/${slug}`);
}
