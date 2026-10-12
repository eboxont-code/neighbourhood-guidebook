import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { EmptyState, Page } from "@/components/site";
import { VenueCard, VenueGrid } from "@/components/venue";
import { businesses, citiesInUse } from "@/data/directory";
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
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: SavedPage,
});

function SavedPage() {
  const { t } = useI18n();
  const { list } = useFavourites();
  const items = list.map((s) => businesses.find((b) => b.slug === s)).filter((b): b is NonNullable<typeof b> => !!b);
  const city = citiesInUse()[0]!;
  return (
    <Page wide>
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{t("savedTitle")}</h1>
      <p className="mt-1 mb-6 text-sm text-muted-foreground">{t("savedSub")}</p>
      {items.length ? <VenueGrid items={items} extra={(b) => <VenueCard b={b} wide />} />
        : <EmptyState icon={Heart} title={t("savedEmptyTitle")} body={t("savedEmptyBody")} action={<Link to="/$city" params={{ city: city.slug }} className="action-btn action-dark">{t("savedEmptyCta")}</Link>} />}
    </Page>
  );
}
