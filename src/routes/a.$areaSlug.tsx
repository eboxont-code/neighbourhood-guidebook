import { createFileRoute, notFound } from "@tanstack/react-router";
import { CardList, NotFoundView, Page, pageMeta } from "@/components/site";
import { businesses, getArea } from "@/data/directory";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/a/$areaSlug")({
  loader: ({ params }) => {
    const area = getArea(params.areaSlug);
    if (!area) throw notFound();
    return { area };
  },
  head: ({ loaderData }) => loaderData ? pageMeta(`Businesses in ${loaderData.area.name}`, `Local businesses in ${loaderData.area.name}, ${loaderData.area.city}.`) : { meta: [{ title: "Not found" }] },
  notFoundComponent: NotFoundView,
  component: AreaPage,
});

function AreaPage() {
  const { area } = Route.useLoaderData();
  const { t } = useI18n();
  return (
    <Page>
      <h1 className="mb-4 font-serif text-3xl font-semibold">{area.name}, {area.city}</h1>
      {businesses.some((b) => b.area === area.slug) ? <CardList items={businesses.filter((b) => b.area === area.slug)} /> : <p className="text-muted-foreground">{t("noneListed")}</p>}
    </Page>
  );
}
