import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { NotFoundView } from "@/components/site";
import { getArea } from "@/data/directory";

// Old area address; areas now live under their city.
export const Route = createFileRoute("/a/$areaSlug")({
  loader: ({ params }) => {
    const area = getArea(params.areaSlug);
    if (!area) throw notFound();
    throw redirect({ to: "/$city/$section", params: { city: area.city, section: area.slug }, statusCode: 301 });
  },
  head: () => ({ meta: [{ title: "Not found" }, { name: "robots", content: "noindex" }] }),
  notFoundComponent: NotFoundView,
});
