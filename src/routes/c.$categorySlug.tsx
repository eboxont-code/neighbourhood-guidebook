import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { CardList, NotFoundView, Page, pageMeta } from "@/components/site";
import { businesses, categoryRedirects, getCategory } from "@/data/directory";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/c/$categorySlug")({
  loader: ({ params }) => {
    const moved = categoryRedirects[params.categorySlug];
    if (moved) throw redirect({ to: "/c/$categorySlug", params: { categorySlug: moved }, statusCode: 301 });
    const category = getCategory(params.categorySlug);
    if (!category) throw notFound();
    return { category };
  },
  head: ({ loaderData }) => loaderData ? pageMeta(`${loaderData.category.name} in Kathmandu`, `${loaderData.category.name} in Kathmandu, with phone numbers, opening hours and whether each website works.`, `/c/${loaderData.category.slug}`) : { meta: [{ title: "Not found" }] },
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
