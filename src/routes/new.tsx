import { createFileRoute, Link } from "@tanstack/react-router";
import { NotFoundView, Page, pageMeta, useNow } from "@/components/site";
import { SectionHead } from "@/components/blocks";
import { areasInUse, businesses, citiesInUse, getArea, getCategory, placeName } from "@/data/directory";
import { formatDate, newListings } from "@/lib/venue";
import { useI18n } from "@/lib/i18n";
import { SITE_NAME } from "@/config";

export const Route = createFileRoute("/new")({
  head: () => pageMeta(`Recently added to ${SITE_NAME}`, `Places just added to ${SITE_NAME}, each checked against its own page or post before listing.`, "/new"),
  notFoundComponent: NotFoundView,
  component: NewPage,
});

function NewPage() {
  const { t, lang } = useI18n();
  const now = useNow();
  const fresh = now ? newListings(businesses, now) : [];
  const groups = new Map<string, typeof fresh>();
  for (const b of fresh) groups.set(b.addedOn!, [...(groups.get(b.addedOn!) ?? []), b]);
  const dates = [...groups.keys()].sort().reverse();
  const city = citiesInUse()[0]!;
  return (
    <Page>
      <div className="mb-3">
        <h1 className="text-lg font-semibold sm:text-xl">{t("newPageTitle")}</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">{t("newPageSub")}</p>
      </div>
      {dates.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-[var(--shadow-card)]">
          <h2 className="text-base font-semibold">{t("newEmptyTitle")}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t("newEmptyBody")}</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {areasInUse(city.slug).map((a) => (
              <Link key={a.slug} to="/$city/$section" params={{ city: city.slug, section: a.slug }} className="action-btn action-secondary min-h-11 px-4 text-sm">{placeName(a, lang)}</Link>
            ))}
          </div>
        </div>
      ) : (
        <ol className="space-y-8">
          {dates.map((d) => (
            <li key={d}>
              <div className="flex items-center gap-3">
                <span aria-hidden className="h-2 w-2 shrink-0 rounded-full bg-brand-accent" />
                <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">{formatDate(d, lang)}</h2>
                <span aria-hidden className="h-px flex-1 bg-border" />
              </div>
              <ul className="mt-3 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">
                {groups.get(d)!.map((b) => {
                  const cat = getCategory(b.category);
                  const area = getArea(b.area);
                  return (
                    <li key={b.id} className="px-4 py-3">
                      <Link to="/s/$slug" params={{ slug: b.slug }} className="block text-[15px] font-semibold underline-offset-4 hover:underline">{b.name}</Link>
                      <p className="mt-0.5 text-[13px] text-muted-foreground">{lang === "ne" ? cat?.nameNe : cat?.name} · {placeName(area, lang)}</p>
                      {b.sourceNotes && <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{t("source")}: {b.sourceNotes}</p>}
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ol>
      )}
    </Page>
  );
}
