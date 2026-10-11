import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";
import { NotFoundView, Page, pageMeta } from "@/components/site";
import { Directory } from "@/components/directory";
import { businessesIn, categoryRedirects, getArea, getCategory, getCity, resolveSection } from "@/data/directory";
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
      <Link to="/$city" params={{ city: city.slug }} className="text-primary underline">{cityName}</Link>
    </p>
  );
  if (sec.kind === "area") {
    const a = getArea(sec.slug)!;
    return (
      <Page wide>
        <div className="mb-6 max-w-2xl">
          {crumb}
          <h1 className="mt-1 font-serif text-3xl font-semibold">{a.name}</h1>
          <p className="mt-3 leading-relaxed">{t(`intro_${a.slug.replace(/-/g, "_")}` as Key)}</p>
        </div>
        <Directory key={a.slug} items={items} filterArea={false} />
      </Page>
    );
  }
  const c = getCategory(sec.slug)!;
  return (
    <Page wide>
      <div className="mb-6">
        {crumb}
        <h1 className="mt-1 font-serif text-3xl font-semibold">{lang === "ne" ? c.nameNe : c.name}</h1>
      </div>
      <Directory key={c.slug} items={items} filterType={false} />
    </Page>
  );
}
