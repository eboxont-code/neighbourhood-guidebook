import { Link } from "@tanstack/react-router";
import { areas, hasPin, placeName, type Business } from "@/data/directory";
import { useI18n } from "@/lib/i18n";

export function AdminDataReview({ listings }: { listings: Business[] }) {
  const { t, lang } = useI18n();
  const missing = listings.filter((b) => !hasPin(b));
  return <section className="space-y-3" aria-labelledby="coordinate-review">
    <h2 id="coordinate-review" className="text-lg font-semibold">{t("adMissingCoordinates")}</h2>
    <p className="text-sm text-muted-foreground">{t("adMappedCount").replace("{n}", String(listings.length - missing.length)).replace("{m}", String(listings.length))}</p>
    {missing.length ? <ul className="divide-y divide-border">{missing.map((b) => <li key={b.id} className="min-w-0 py-2">
      <Link to="/s/$slug" params={{ slug: b.slug }} className="inline-flex min-h-11 items-center break-words text-primary underline">{b.name}</Link>
      <p className="break-all text-sm text-muted-foreground">{b.slug} · {placeName(areas.find((a) => a.slug === b.area), lang)}</p>
    </li>)}</ul> : <p className="text-sm text-muted-foreground">{t("adReviewEmpty")}</p>}
  </section>;
}