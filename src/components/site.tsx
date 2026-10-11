import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { SITE_NAME } from "@/config";
import { useI18n } from "@/lib/i18n";
import { getArea, getCategory, hoursStatus, websiteShortLabel, type Business } from "@/data/directory";

export function Header() {
  const { lang, setLang, t } = useI18n();
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
        <Link to="/" className="font-serif text-xl font-semibold">{SITE_NAME}</Link>
        <div className="flex items-center gap-1 text-sm">
        <Link to="/for-businesses" className="inline-flex min-h-11 items-center rounded-md px-2 text-muted-foreground hover:text-foreground" activeProps={{ className: "text-foreground font-semibold" }}>{t("navBusinesses")}</Link>
        <span aria-hidden className="mx-1 h-5 w-px bg-border" />
        <div className="flex items-center" role="group" aria-label="Language">
          <button onClick={() => setLang("en")} aria-pressed={lang === "en"} className={`px-2 py-2 ${lang === "en" ? "font-semibold text-primary" : "text-muted-foreground"}`}>EN</button>
          <span className="text-muted-foreground">|</span>
          <button onClick={() => setLang("ne")} aria-pressed={lang === "ne"} className={`px-2 py-2 ${lang === "ne" ? "font-semibold text-primary" : "text-muted-foreground"}`}>ने</button>
        </div>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  const { t } = useI18n();
  const links = [
    ["/about", t("footAbout")], ["/suggest-correction", t("footSuggest")], ["/for-businesses", t("footClaim")],
    ["/privacy", t("footPrivacy")], ["/contact", t("footContact")],
  ] as const;
  return (
    <footer className="mt-12 border-t border-border">
      <div className="mx-auto max-w-2xl px-4 py-6 text-sm">
        <nav className="grid grid-cols-2 gap-x-4 gap-y-1 sm:flex sm:flex-wrap sm:gap-x-2">
          {links.map(([to, label]) => (
            <Link key={to} to={to} className="-mx-2 inline-flex min-h-11 items-center rounded-md px-2 text-muted-foreground hover:bg-muted hover:text-foreground sm:mx-0">{label}</Link>
          ))}
        </nav>
        <p className="mt-4 text-xs text-muted-foreground">{SITE_NAME} · {t("noindex")}</p>
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
  const { t } = useI18n();
  const now = useNow();
  if (!b.hours?.length) return <span className="text-muted-foreground">{t("hoursNotListed")}</span>;
  const unverified = b.hoursSource && !b.hoursVerified ? <span className="text-unverified"> · {t("unverifiedShort")}</span> : null;
  const st = now ? hoursStatus(b.hours, now) : null;
  if (!st || st.kind === "text" || st.kind === "none") {
    const text = st && st.kind === "text" ? st.today : b.hours.map((h) => `${h.days} ${h.time}`.trim()).join(", ");
    return <span>{text}{unverified}</span>;
  }
  return (
    <span>
      <span className={st.kind === "open" ? "font-semibold text-primary" : "text-muted-foreground"}>{t(st.kind === "open" ? "openNow" : "closedNow")}</span>
      {st.today && <span> · {st.today}</span>}
      {unverified}
    </span>
  );
}

export function Page({ children }: { children: ReactNode }) {
  return <main className="mx-auto max-w-2xl px-4 py-6">{children}</main>;
}


export function Monogram({ name, size = "md" }: { name: string; size?: "md" | "lg" }) {
  return <div aria-hidden className={`monogram ${size === "lg" ? "h-16 w-16 text-3xl" : "h-12 w-12 text-xl"}`}>{name.charAt(0)}</div>;
}

export function SearchBox({ initial = "", autoFocus = false }: { initial?: string; autoFocus?: boolean }) {
  const { t } = useI18n();
  const [q, setQ] = useState(initial);
  const navigate = useNavigate();
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const go = (value: string, replace: boolean) => navigate({ to: "/search", search: { q: value }, replace });
  return (
    <form role="search" className="flex gap-2" onSubmit={(e) => { e.preventDefault(); clearTimeout(timer.current); go(q, false); }}>
      <input value={q} autoFocus={autoFocus} name="q" type="search" aria-label={t("search")} placeholder={t("searchPlaceholder")}
        onChange={(e) => {
          const v = e.target.value;
          setQ(v);
          clearTimeout(timer.current);
          timer.current = setTimeout(() => go(v, true), 300);
        }}
        className="h-12 min-w-0 flex-1 rounded-md border border-input bg-card px-3 text-base outline-none focus:ring-2 focus:ring-ring" />
      <button type="submit" className="action-btn action-primary px-4">{t("search")}</button>
    </form>
  );
}

export function BusinessCard({ b }: { b: Business }) {
  const { lang, t } = useI18n();
  const cat = getCategory(b.category);
  const area = getArea(b.area);
  const web = websiteShortLabel(b);
  return (
    <li>
      <Link to="/s/$slug" params={{ slug: b.slug }} className="flex gap-3 py-4 hover:bg-muted/60">
        <Monogram name={b.name} />
        <div className="min-w-0 flex-1 space-y-0.5">
          <p className="font-serif text-lg leading-tight font-semibold">{b.name}</p>
          <p className="text-sm text-muted-foreground">{lang === "ne" ? cat?.nameNe : cat?.name} · {area?.name}</p>
          {b.phone && <p className="text-sm">{b.phone}</p>}
          <p className="text-sm"><HoursLine b={b} /></p>
          <p className={`text-xs ${web === "webWorking" ? "text-primary" : web === "webDown" ? "text-unverified" : "text-muted-foreground"}`}>{t(web)}</p>
        </div>
      </Link>
    </li>
  );
}

export function CardList({ items }: { items: Business[] }) {
  return <ul className="divide-y divide-border border-y border-border">{items.map((b) => <BusinessCard key={b.id} b={b} />)}</ul>;
}

export function TextPage({ title, body }: { title: string; body: string }) {
  return <Page><h1 className="font-serif text-3xl font-semibold">{title}</h1><p className="mt-4 leading-relaxed">{body}</p></Page>;
}

export function NotFoundView() {
  const { t } = useI18n();
  return (
    <Page>
      <h1 className="font-serif text-3xl font-semibold">{t("notFound")}</h1>
      <p className="mt-3 text-muted-foreground">{t("notFoundBody")}</p>
      <Link to="/" className="action-btn action-primary mt-6 inline-flex px-5">{t("goHome")}</Link>
    </Page>
  );
}

export { pageMeta } from "@/lib/seo";
