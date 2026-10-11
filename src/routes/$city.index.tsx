import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { NotFoundView, Page, pageMeta } from "@/components/site";
import { Directory } from "@/components/directory";
import { areasInUse, businessesIn, categoriesIn, getCity } from "@/data/directory";
import { useI18n, type Key } from "@/lib/i18n";

export const Route = createFileRoute("/$city/")({
  loader: ({ params }) => {
    const city = getCity(params.city);
    if (!city || !businessesIn(city.slug).length) throw notFound();
    return { city };
  },
  head: ({ loaderData }) => loaderData
    ? pageMeta(`Local businesses in ${loaderData.city.name}`, `Salons, cafés, restaurants, gyms, hotels and more in ${loaderData.city.name}, by neighbourhood, with phone numbers, hours and directions.`, `/${loaderData.city.slug}`)
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
      <section className="mt-6">
        <h2 className="section-label">{t("areasIn")}</h2>
        <div className="flex flex-wrap gap-2">
          {areasInUse(city.slug).map((a) => <Link key={a.slug} to="/$city/$section" params={{ city: city.slug, section: a.slug }} className="chip">{a.name}</Link>)}
        </div>
      </section>
      <section className="mt-4 mb-8">
        <h2 className="section-label">{t("typesIn")}</h2>
        <div className="flex flex-wrap gap-2">
          {categoriesIn(items).map((c) => <Link key={c.slug} to="/$city/$section" params={{ city: city.slug, section: c.slug }} className="chip">{lang === "ne" ? c.nameNe : c.name}</Link>)}
        </div>
      </section>
      <Directory items={items} />
    </Page>
  );
}
