import { createFileRoute, notFound } from "@tanstack/react-router";
import { CardList, NotFoundView, Page, pageMeta } from "@/components/site";
import { businesses, getArea } from "@/data/directory";

export const Route = createFileRoute("/area/$areaSlug")({
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
  return (
    <Page>
      <h1 className="mb-4 font-serif text-3xl font-semibold">{area.name}, {area.city}</h1>
      <CardList items={businesses.filter((b) => b.area === area.slug)} />
    </Page>
  );
}
