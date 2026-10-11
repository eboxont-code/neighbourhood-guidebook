import { createFileRoute, notFound } from "@tanstack/react-router";
import { CardList, NotFoundView, Page, pageMeta } from "@/components/site";
import { businesses, getCategory } from "@/data/directory";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/c/$categorySlug")({
  loader: ({ params }) => {
    const category = getCategory(params.categorySlug);
    if (!category) throw notFound();
    return { category };
  },
  head: ({ loaderData }) => loaderData ? pageMeta(loaderData.category.name, `${loaderData.category.name} listed in the directory.`) : { meta: [{ title: "Not found" }] },
  notFoundComponent: NotFoundView,
  component: CategoryPage,
});

function CategoryPage() {
  const { category } = Route.useLoaderData();
  const { lang, t } = useI18n();
  return (
    <Page>
      <h1 className="mb-4 font-serif text-3xl font-semibold">{lang === "ne" ? category.nameNe : category.name}</h1>
      {businesses.some((b) => b.category === category.slug) ? <CardList items={businesses.filter((b) => b.category === category.slug)} /> : <p className="text-muted-foreground">{t("noneListed")}</p>}
    </Page>
  );
}
