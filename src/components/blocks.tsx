import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ArrowRight, ChevronRight, Phone } from "lucide-react";
import { categories, getArea, getCategory, placeName, telLink, type Area, type Business } from "@/data/directory";
import { useI18n } from "@/lib/i18n";
import { HoursLine, Monogram } from "@/components/site";

const TONES = categories.map((c) => c.slug);
/** A stable tone per area, borrowed from the category palette so areas read as the same family. */
export const areaTone = (slug: string, i: number) => `cat-${TONES[(i * 3 + slug.length) % TONES.length]}`;

export function count(t: (k: never) => string, n: number) {
  const tt = t as (k: string) => string;
  return n === 1 ? tt("placesOne") : tt("placesN").replace("{n}", String(n));
}

export function SectionHead({ title, sub, action }: { title: string; sub?: string; action?: ReactNode }) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3">
      <div className="min-w-0">
        <h2 className="text-lg font-semibold sm:text-xl">{title}</h2>
        {sub && <p className="mt-0.5 text-sm text-muted-foreground">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

export function SeeAll({ children, ...link }: { children: ReactNode } & React.ComponentProps<typeof Link>) {
  return <Link {...link} className="-my-2 inline-flex min-h-11 shrink-0 items-center gap-0.5 text-sm font-semibold text-primary hover:underline">{children}<ChevronRight aria-hidden className="h-4 w-4" /></Link>;
}

/** Area tiles with their own tone and fine pattern. */
export function AreaTiles({ city, items, list }: { city: string; items: Business[]; list: Area[] }) {
  const { t, lang } = useI18n();
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
      {list.map((a, i) => (
        <Link key={a.slug} to="/$city/$section" params={{ city, section: a.slug }} className={`area-tile ${areaTone(a.slug, i)}`}>
          <span className="text-base font-semibold text-foreground">{placeName(a, lang)}</span>
          <span className="text-[13px] text-[var(--ph-ink)]">{count(t as never, items.filter((b) => b.area === a.slug).length)}</span>
        </Link>
      ))}
    </div>
  );
}

/** Small vertical card for horizontal rows. */
export function PlaceCard({ b }: { b: Business }) {
  const { lang } = useI18n();
  const cat = getCategory(b.category);
  const area = getArea(b.area);
  return (
    <li className="biz-card w-[15.5rem] shrink-0 snap-start !p-4">
      <div className="flex items-center gap-3">
        <Monogram name={b.name} category={b.category} />
        <div className="min-w-0">
          <Link to="/s/$slug" params={{ slug: b.slug }} className="stretched line-clamp-2 text-[15px] leading-snug font-semibold">{b.name}</Link>
          <p className="truncate text-[13px] text-muted-foreground">{lang === "ne" ? cat?.nameNe : cat?.name} · {placeName(area, lang)}</p>
        </div>
      </div>
      <p className="mt-3 truncate text-[13px]"><HoursLine b={b} /></p>
    </li>
  );
}

export function Carousel({ items, label }: { items: Business[]; label: string }) {
  return (
    <ul aria-label={label} className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pt-1 pb-3 [scrollbar-width:none] lg:mx-0 lg:px-0">
      {items.map((b) => <PlaceCard key={b.id} b={b} />)}
    </ul>
  );
}

/** Dense list row: many fit on a phone screen. */
export function CompactRow({ b }: { b: Business }) {
  const { t, lang } = useI18n();
  const cat = getCategory(b.category);
  const area = getArea(b.area);
  return (
    <li className="relative flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/60">
      <Monogram name={b.name} category={b.category} size="sm" />
      <div className="min-w-0 flex-1">
        <Link to="/s/$slug" params={{ slug: b.slug }} className="stretched-row block truncate text-[15px] font-semibold">{b.name}</Link>
        <p className="truncate text-[13px] text-muted-foreground">{lang === "ne" ? cat?.nameNe : cat?.name} · {placeName(area, lang)}</p>
        <p className="mt-0.5 truncate text-[13px]"><HoursLine b={b} /></p>
      </div>
      {b.phone && (
        <a href={telLink(b.phone)} aria-label={`${t("call")} ${b.name} ${b.phone}`} className="press relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border text-primary hover:bg-accent">
          <Phone aria-hidden className="h-4 w-4" />
        </a>
      )}
    </li>
  );
}

export function RowList({ items }: { items: Business[] }) {
  return <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">{items.map((b) => <CompactRow key={b.id} b={b} />)}</ul>;
}

export function BusinessBand() {
  const { t } = useI18n();
  return (
    <section className="app-hero flex flex-col gap-3 rounded-2xl px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
      <div>
        <h2 className="text-base font-semibold">{t("bizBandTitle")}</h2>
        <p className="mt-0.5 text-sm text-[var(--hero-muted)]">{t("bizBandBody")}</p>
      </div>
      <Link to="/for-businesses" className="action-btn action-accent shrink-0 text-sm">{t("bizBandCta")}<ArrowRight aria-hidden className="h-4 w-4" /></Link>
    </section>
  );
}
