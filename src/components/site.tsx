import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Briefcase, Compass, Globe, Heart, Home, MapPin, Phone, Search, SearchX, type LucideIcon } from "lucide-react";
import { CatIcon } from "@/components/cover";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { SITE_NAME } from "@/config";
import { useI18n, type Key } from "@/lib/i18n";
import { citiesInUse, telLink, dayLabel, getArea, getCategory, hoursStatus, placeName, timeLabel, websiteShortLabel, type Business } from "@/data/directory";

function LangToggle() {
  const { lang, setLang } = useI18n();
  return (
    <div className="seg w-[5.75rem] shrink-0 py-0.5" role="group" aria-label="Language">
      <span aria-hidden className="seg-thumb" style={{ transform: lang === "ne" ? "translateX(100%)" : "none" }} />
      <button onClick={() => setLang("en")} aria-pressed={lang === "en"} className={`relative min-h-10 rounded-full text-sm font-semibold transition-colors ${lang === "en" ? "text-primary" : "text-muted-foreground"}`}>EN</button>
      <button onClick={() => setLang("ne")} aria-pressed={lang === "ne"} className={`relative min-h-10 rounded-full text-sm font-semibold transition-colors ${lang === "ne" ? "text-primary" : "text-muted-foreground"}`}>ने</button>
    </div>
  );
}

export function Brand() {
  const { t } = useI18n();
  return (
    <Link to="/" className="flex min-h-11 min-w-0 items-center gap-2.5">
      <span aria-hidden className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-base font-semibold text-primary-foreground">
        {SITE_NAME.charAt(0)}<span className="mb-1.5 ml-px h-1.5 w-1.5 self-end rounded-full bg-brand-accent" />
      </span>
      <span className="truncate text-[1.0625rem] font-semibold tracking-tight">{SITE_NAME}</span>
      <span className="shrink-0 rounded-full border border-brand-accent px-1.5 text-[11px] leading-[18px] font-semibold text-brand-accent-foreground">{t("brandTag")}</span>
    </Link>
  );
}

function navItems(t: (k: Key) => string) {
  const city = citiesInUse()[0]?.slug ?? "kathmandu";
  return [
    { key: "home", label: t("navHome"), icon: Home, link: { to: "/" as const } },
    { key: "search", label: t("navSearch"), icon: Search, link: { to: "/search" as const, search: { q: "" } } },
    { key: "areas", label: t("navAreas"), icon: Compass, link: { to: "/$city" as const, params: { city } } },
    { key: "saved", label: t("navSaved"), icon: Heart, link: { to: "/saved" as const } },
    { key: "biz", label: t("navBusinesses"), icon: Briefcase, link: { to: "/for-businesses" as const } },
  ];
}

export function Header() {
  const { t } = useI18n();
  return (
    <header className="sticky top-0 z-[950] border-b border-border bg-card/90 backdrop-blur-md">
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-2 lg:flex lg:justify-between">
        <Brand />
        <div className="flex items-center gap-1">
          <nav aria-label={t("navMain")} className="mr-2 hidden items-center gap-1 lg:flex">
            {navItems(t).map((n) => (
              <Link key={n.key} {...n.link} activeOptions={{ exact: n.key === "home", includeSearch: false }} className="inline-flex min-h-11 items-center gap-2 rounded-full px-3.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground" activeProps={{ className: "bg-accent !text-accent-foreground" }}>
                <n.icon className="h-4 w-4" aria-hidden />{n.label}
              </Link>
            ))}
          </nav>
          <LangToggle />
        </div>
      </div>
    </header>
  );
}

/** Thumb-friendly bottom bar on phones; listing pages show their own action bar instead. */
export function BottomNav() {
  const { t } = useI18n();
  const path = useRouterState({ select: (s) => s.location.pathname });
  if (path.startsWith("/s/") || path.startsWith("/admin")) return null;
  return (
    <nav aria-label={t("navMain")} className="bottom-nav lg:hidden">
      <div className="mx-auto grid h-[3.75rem] max-w-md grid-cols-5">
        {navItems(t).map((n) => (
          <Link key={n.key} {...n.link} aria-label={n.label} activeOptions={{ exact: n.key === "home", includeSearch: false }} className="group flex min-h-11 flex-col items-center justify-center gap-0.5 text-[11px] font-medium text-muted-foreground transition-colors" activeProps={{ className: "!text-primary" }}>
            <span className="flex h-7 w-12 items-center justify-center rounded-full transition-colors group-aria-[current=page]:bg-accent"><n.icon className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden /></span>
            <span className="max-w-full truncate px-1">{n.key === "biz" ? t("navBizShort") : n.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

export function Footer() {
  const { t } = useI18n();
  const links = [
    ["/about", t("footAbout")], ["/suggest-correction", t("footSuggest")], ["/for-businesses", t("footClaim")],
    ["/privacy", t("footPrivacy")], ["/contact", t("footContact")],
  ] as const;
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm">
        <Brand />
        <nav className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1 sm:flex sm:flex-wrap sm:gap-x-2">
          {links.map(([to, label]) => (
            <Link key={to} to={to} className="-mx-2 inline-flex min-h-11 items-center rounded-full px-3 font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:mx-0">{label}</Link>
          ))}
        </nav>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{SITE_NAME} · {t("noindex")}</p>
      </div>
    </footer>
  );
}

/** Current time, only after mount, so server and browser render the same first HTML. */
export function useNow(): Date | null {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);
  return now;
}

export function HoursLine({ b }: { b: Business }) {
  const { t, lang } = useI18n();
  const now = useNow();
  if (!b.hours?.length) return <span className="text-muted-foreground">{t("hoursNotListed")}</span>;
  const unverified = b.hoursSource && !b.hoursVerified ? <span className="text-unverified"> · {t("unverifiedShort")}</span> : null;
  const st = now ? hoursStatus(b.hours, now) : null;
  if (!st || st.kind === "text" || st.kind === "none") {
    const text = st && st.kind === "text" ? st.today : b.hours.map((h) => `${dayLabel(h.days, lang)} ${timeLabel(h.time, lang)}`.trim()).join(", ");
    return <span>{text}{unverified}</span>;
  }
  return (
    <span>
      <span className={`status-chip ${st.kind === "open" ? "status-success" : "status-neutral"}`}>{st.kind === "open" && <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-success" />}{t(st.kind === "open" ? "openNow" : "closedNow")}</span>
      {st.today && <span> · {timeLabel(st.today, lang)}</span>}
      {unverified}
    </span>
  );
}

export function Page({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  return <main className={`page-enter mx-auto px-5 py-6 ${wide ? "max-w-6xl" : "max-w-2xl"}`}>{children}</main>;
}


export function Monogram({ name, category, size = "md" }: { name: string; category?: string; size?: "sm" | "md" | "lg" }) {
  return (
    <div aria-hidden className={`monogram relative ${category ? `cat-${category}` : ""} ${size === "lg" ? "h-14 w-14 text-2xl" : size === "sm" ? "h-10 w-10 text-base" : "h-12 w-12 text-xl"}`}>
      {name.charAt(0)}
      {category && <span className="absolute -right-1 -bottom-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-card bg-[var(--ph-ink)] text-panel"><CatIcon category={category} className="h-3 w-3" /></span>}
    </div>
  );
}

export function SearchBox({ initial = "", autoFocus = false }: { initial?: string; autoFocus?: boolean }) {
  const { t } = useI18n();
  const [q, setQ] = useState(initial);
  const navigate = useNavigate();
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const input = useRef<HTMLInputElement>(null);
  // Follow the URL when it changes from outside the box, such as tapping a suggestion.
  useEffect(() => { if (document.activeElement !== input.current) setQ(initial); }, [initial]);
  const go = (value: string, replace: boolean) => navigate({ to: "/search", search: { q: value }, replace });
  return (
    <form role="search" className="relative flex items-center gap-2 rounded-full border border-border bg-card p-1 shadow-[var(--shadow-lift)]" onSubmit={(e) => { e.preventDefault(); clearTimeout(timer.current); go(q, false); }}>
      <input ref={input} value={q} autoFocus={autoFocus} name="q" type="search" aria-label={t("search")} placeholder={t("searchPlaceholder")}
        onChange={(e) => {
          const v = e.target.value;
          setQ(v);
          clearTimeout(timer.current);
          timer.current = setTimeout(() => go(v, true), 300);
        }}
        className="h-11 min-w-0 flex-1 rounded-full bg-transparent pr-2 pl-10 text-[15px] text-base text-foreground outline-none placeholder:text-muted-foreground" />
      <Search aria-hidden className="pointer-events-none absolute top-1/2 left-4 h-[18px] w-[18px] -translate-y-1/2 text-muted-foreground" />
      <button type="submit" className="action-btn action-primary min-h-11 shrink-0 px-4 text-sm">{t("search")}</button>
    </form>
  );
}

const WEB_TONE: Record<string, string> = { webWorking: "status-success", webDown: "status-error", webNone: "status-neutral", webNotChecked: "status-warning" };

export function BusinessCard({ b }: { b: Business }) {
  const { lang, t } = useI18n();
  const cat = getCategory(b.category);
  const area = getArea(b.area);
  const web = websiteShortLabel(b);
  return (
    <li className="biz-card">
      <div className="flex gap-3.5">
        <Monogram name={b.name} category={b.category} />
        <div className="min-w-0 flex-1">
          <Link to="/s/$slug" params={{ slug: b.slug }} className="stretched block text-base leading-snug font-semibold break-words">{b.name}</Link>
          <p className="mt-0.5 text-[13px] text-muted-foreground">{lang === "ne" ? cat?.nameNe : cat?.name} · {placeName(area, lang)}</p>
          <p className="mt-2 text-sm"><HoursLine b={b} /></p>
        </div>
      </div>
      <div className="mt-3.5 flex flex-nowrap items-center justify-between gap-2 border-t border-border pt-3">
        <span className={`status-chip min-w-0 ${WEB_TONE[web]}`}><Globe aria-hidden className="h-3.5 w-3.5" />{t(web)}</span>
        {b.phone && (
          <a href={telLink(b.phone)} className="press relative z-10 -my-1 inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full px-3 text-[13px] font-semibold whitespace-nowrap text-primary hover:bg-accent" aria-label={`${t("call")} ${b.name} ${b.phone}`}>
            <Phone aria-hidden className="h-3.5 w-3.5" /><span className="tabular-nums">{b.phone}</span>
          </a>
        )}
      </div>
    </li>
  );
}

export function CardList({ items }: { items: Business[] }) {
  return <ul className="card-list">{items.map((b) => <BusinessCard key={b.id} b={b} />)}</ul>;
}

/** Colourful category tiles that link to each category page in a city. */
export function CategoryTiles({ city, cats }: { city: string; cats: { slug: string; name: string; nameNe: string }[] }) {
  const { t, lang } = useI18n();
  return (
    <section aria-label={t("browseTypes")}>
      <h2 className="section-label !mb-2.5">{t("browseTypes")}</h2>
      <div className="grid grid-cols-4 gap-2 sm:gap-3 lg:grid-cols-8">
        {cats.map((c) => (
          <Link key={c.slug} to="/$city/$section" params={{ city, section: c.slug }} className={`cat-tile cat-${c.slug}`}>
            <span className="cat-tile-icon"><CatIcon category={c.slug} className="h-4 w-4" /></span>
            <span className="max-w-full break-words">{lang === "ne" ? c.nameNe : c.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

/** One empty-state pattern everywhere: outline icon, one-line heading, short hint, one button. */
export function EmptyState({ title, body, icon: Icon = SearchX, action, as: H = "p" }: { title: string; body?: string; icon?: LucideIcon; action?: ReactNode; as?: "p" | "h1" | "h2" }) {
  return (
    <div className="flex flex-col items-center px-6 py-12 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-foreground"><Icon aria-hidden className="h-7 w-7" strokeWidth={1.6} /></span>
      <H className="mt-4 text-lg font-semibold tracking-tight">{title}</H>
      {body && <p className="mt-1 max-w-sm text-[15px] leading-snug text-muted-foreground">{body}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function TextPage({ title, body }: { title: string; body: string }) {
  return <Page><h1 className="text-2xl font-semibold sm:text-3xl">{title}</h1><div className="form-card mt-5"><p className="leading-relaxed">{body}</p></div></Page>;
}

export function NotFoundView() {
  const { t } = useI18n();
  return (
    <Page>
      <EmptyState as="h1" icon={MapPin} title={t("notFound")} body={`${t("notFoundBody")} ${t("notFoundHint")}`} action={<Link to="/" className="action-btn action-primary px-6">{t("goHome")}</Link>} />
    </Page>
  );
}

export { pageMeta } from "@/lib/seo";
