import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { NotFoundView, Page, pageMeta } from "@/components/site";
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
    <Page wide>
      <div className="max-w-2xl">
        <h1 className="font-serif text-3xl font-semibold">{lang === "ne" ? city.nameNe : city.name}</h1>
        <p className="mt-3 leading-relaxed">{t(`intro_city_${city.slug}` as Key)}</p>
      </div>
      <section className="mt-4">
        <h2 className="section-label">{t("areasIn")}</h2>
        <div className="chip-row">
          {areasInUse(city.slug).map((a) => <Link key={a.slug} to="/$city/$section" params={{ city: city.slug, section: a.slug }} className="chip">{placeName(a, lang)}</Link>)}
        </div>
      </section>
      <section className="mt-3 mb-5">
        <h2 className="section-label">{t("typesIn")}</h2>
        <div className="chip-row">
          {categoriesIn(items).map((c) => <Link key={c.slug} to="/$city/$section" params={{ city: city.slug, section: c.slug }} className="chip">{lang === "ne" ? c.nameNe : c.name}</Link>)}
        </div>
      </section>
      <Directory items={items} />
    </Page>
  );
}

function cityMeta(slug: string, name: string) {
  const names = areasInUse(slug).map((a) => getArea(a.slug)?.name ?? a.slug).slice(0, 4);
  const list = names.length > 1 ? `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}` : names[0] ?? name;
  return pageMeta(`${name} by neighbourhood: salons, cafés, hotels and more`, `Everyday places in ${name}, area by area, including ${list}, with phone numbers, opening hours and directions you can check.`, `/${slug}`);
}
