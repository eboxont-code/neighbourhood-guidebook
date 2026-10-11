import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { SITE_NAME } from "@/config";
import { useI18n } from "@/lib/i18n";
import { getArea, getCategory, websiteStatusSentence, type Business } from "@/data/directory";

export function Header() {
  const { lang, setLang } = useI18n();
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
        <Link to="/" className="font-serif text-xl font-semibold">{SITE_NAME}</Link>
        <div className="flex items-center text-sm" role="group" aria-label="Language">
          <button onClick={() => setLang("en")} aria-pressed={lang === "en"} className={`px-2 py-2 ${lang === "en" ? "font-semibold text-primary" : "text-muted-foreground"}`}>EN</button>
          <span className="text-muted-foreground">|</span>
          <button onClick={() => setLang("ne")} aria-pressed={lang === "ne"} className={`px-2 py-2 ${lang === "ne" ? "font-semibold text-primary" : "text-muted-foreground"}`}>ने</button>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  const { t } = useI18n();
  const links = [
    ["/about", t("footAbout")], ["/suggest-correction", t("footSuggest")], ["/website-help", t("footHelp")],
    ["/privacy", t("footPrivacy")], ["/contact", t("footContact")],
  ] as const;
  return (
    <footer className="mt-12 border-t border-border">
      <div className="mx-auto max-w-2xl px-4 py-6 text-sm">
        <nav className="flex flex-wrap gap-x-4 gap-y-2">
          {links.map(([to, label]) => <Link key={to} to={to} className="text-muted-foreground hover:text-foreground">{label}</Link>)}
        </nav>
        <p className="mt-4 text-xs text-muted-foreground">{SITE_NAME} · {t("noindex")}</p>
      </div>
    </footer>
  );
}

export function Page({ children }: { children: ReactNode }) {
  return <main className="mx-auto max-w-2xl px-4 py-6">{children}</main>;
}

export function SampleBanner() {
  const { t } = useI18n();
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
  return (
    <li>
      <Link to="/s/$slug" params={{ slug: b.slug }} className="flex gap-3 py-3 hover:bg-muted/60">
        <Monogram name={b.name} />
        <div className="min-w-0">
          <p className="font-serif text-lg leading-tight font-semibold">{b.name}</p>
          <p className="text-sm text-muted-foreground">{lang === "ne" ? cat?.nameNe : cat?.name} · {area?.name}</p>
          <p className="text-sm">{b.phone ?? websiteStatusSentence(b, lang)}</p>
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

export const pageMeta = (title: string, description: string) => ({
  meta: [
    { title: `${title} — ${SITE_NAME}` },
    { name: "description", content: description },
    { property: "og:title", content: `${title} — ${SITE_NAME}` },
    { property: "og:description", content: description },
  ],
});
