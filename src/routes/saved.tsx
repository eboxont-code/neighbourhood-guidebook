import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { EmptyState, Page } from "@/components/site";
import { VenueCard, VenueGrid } from "@/components/venue";
import { businesses, citiesInUse, getArea } from "@/data/directory";
import { savedCategorySuggestions } from "@/lib/saved-categories";
import { useFavourites } from "@/lib/favourites";
import { useI18n } from "@/lib/i18n";
import { SITE_NAME } from "@/config";

export const Route = createFileRoute("/saved")({
  head: () => ({
    meta: [
      { title: `Saved places · ${SITE_NAME}` },
      { name: "description", content: "Places you saved on this device." },
      { property: "og:title", content: `Saved places · ${SITE_NAME}` },
      { property: "og:description", content: "Places you saved on this device." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: SavedPage,
});

function SavedPage() {
  const { t, lang } = useI18n();
  const { list } = useFavourites();
  const items = list.map((s) => businesses.find((b) => b.slug === s)).filter((b): b is NonNullable<typeof b> => !!b);
  const city = citiesInUse()[0];
  const suggestions = savedCategorySuggestions(businesses);
  return (
    <Page wide>
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{t("savedTitle")}</h1>
      <p className="mt-1 mb-6 text-sm text-muted-foreground">{t("savedSub")}</p>
      {items.length ? <VenueGrid items={items} extra={(b) => <VenueCard b={b} wide />} />
        : <><EmptyState icon={Heart} title={t("savedEmptyTitle")} body={t("savedEmptyBody")} action={city ? <Link to="/$city" params={{ city: city.slug }} className="action-btn action-dark">{t("savedEmptyCta")}</Link> : undefined} />
          <div className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-1">{suggestions.map(({ category }) => {
            const listing = businesses.find((b) => b.category === category.slug);
            const area = listing ? getArea(listing.area) : undefined;
            return area ? <Link key={category.slug} to="/$city/$section" params={{ city: area.city, section: category.slug }} className="inline-flex min-h-11 min-w-11 items-center justify-center px-2 text-sm text-primary underline">{lang === 'ne' ? category.nameNe : category.name}</Link> : null;
          })}</div></>}
    </Page>
  );
}
