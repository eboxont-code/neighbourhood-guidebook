import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { NotFoundView } from "@/components/site";
import { categoryRedirects, getCategory } from "@/data/directory";

// Old category address; categories now live under a city. Kathmandu is the only city with listings so far.
export const LEGACY_CATEGORY_CITY = "kathmandu";

export const Route = createFileRoute("/c/$categorySlug")({
  loader: ({ params }) => {
    const slug = categoryRedirects[params.categorySlug] ?? params.categorySlug;
    if (!getCategory(slug)) throw notFound();
    throw redirect({ to: "/$city/$section", params: { city: LEGACY_CATEGORY_CITY, section: slug }, statusCode: 301 });
  },
  head: () => ({ meta: [{ title: "Not found" }, { name: "robots", content: "noindex" }] }),
  notFoundComponent: NotFoundView,
});
