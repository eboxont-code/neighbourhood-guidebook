import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Clock, Globe, Plus, Search, Smartphone, X } from "lucide-react";
import { Page, pageMeta } from "@/components/site";
import { useI18n, type Key } from "@/lib/i18n";

export const Route = createFileRoute("/for-businesses")({
  head: () => pageMeta("For businesses", "Simple, mobile-friendly websites for salons, barbers, spas and clinics in Kathmandu. Your directory listing stays free either way.", "/for-businesses"),
  component: ForBusinesses,
});

function H2({ children }: { children: string }) {
  return <h2 className="text-2xl font-semibold sm:text-2xl">{children}</h2>;
}

const WHY_ICONS = [Search, Smartphone, Clock, Globe];

function ForBusinesses() {
  const { t } = useI18n();
  const why: Key[] = ["fbWhy1", "fbWhy2", "fbWhy3", "fbWhy4"];
  const how: Key[] = ["fbHow1", "fbHow2", "fbHow3", "fbHow4"];
  const faq: [Key, Key][] = [["fbQ1", "fbA1"], ["fbQ2", "fbA2"], ["fbQ3", "fbA3"], ["fbQ4", "fbA4"], ["fbQ5", "fbA5"]];
  const cta = (cls = "action-accent") => (
    <Link to="/contact" className={`action-btn ${cls} inline-flex w-full px-7 sm:w-auto`}>{t("fbCta")}<ArrowRight aria-hidden className="h-5 w-5" /></Link>
  );
  return (
    <>
      <section className="app-hero">
        <div className="page-enter mx-auto max-w-4xl px-4 pt-8 pb-16 lg:pt-14 lg:pb-24">
          <p className="inline-flex rounded-full bg-card/15 px-3 py-1 text-sm font-semibold">{t("fbTitle")}</p>
          <h1 className="mt-3 max-w-3xl text-[1.75rem] leading-tight font-semibold sm:text-4xl">{t("fbHeroTitle")}</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[var(--hero-muted)]">{t("fbIntro")}</p>
          <div className="mt-6">{cta()}</div>
        </div>
      </section>

      <Page wide>
        <section className="-mt-8" aria-labelledby="compare">
          <h2 id="compare" className="sr-only">{t("fbCompareTitle")}</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <Mock good={false} />
            <Mock good />
          </div>
          <p className="mt-2 text-center text-[13px] text-muted-foreground">{t("fbExampleNote")}</p>
        </section>

        <section className="mx-auto mt-12 max-w-3xl">
          <H2>{t("fbWhyTitle")}</H2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {why.map((k, i) => {
              const Icon = WHY_ICONS[i]!;
              return (
                <li key={k} className="flex gap-3 rounded-xl border border-border bg-card p-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground"><Icon aria-hidden className="h-[18px] w-[18px]" strokeWidth={1.75} /></span>
                  <span className="text-[15px] leading-relaxed">{t(k)}</span>
                </li>
              );
            })}
          </ul>
        </section>

        <div className="mx-auto max-w-3xl">
          <section className="mt-12">
            <H2>{t("fbWhatTitle")}</H2>
            <p className="mt-3 text-lg leading-relaxed text-muted-foreground">{t("fbWhatBody")}</p>
          </section>

          <section className="mt-12">
            <H2>{t("fbHowTitle")}</H2>
            <ol className="relative mt-6 space-y-4 before:absolute before:top-6 before:bottom-6 before:left-5 before:w-0.5 before:bg-border">
              {how.map((k, i) => (
                <li key={k} className="relative flex gap-4">
                  <span aria-hidden className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-base font-semibold text-primary-foreground shadow-[var(--shadow-card)]">{i + 1}</span>
                  <span className="flex-1 rounded-2xl bg-card p-4 leading-relaxed shadow-[var(--shadow-card)]">{t(k)}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className="mt-12">
            <H2>{t("fbFaqTitle")}</H2>
            <div className="mt-5 space-y-3">
              {faq.map(([q, a]) => (
                <details key={q} className="group rounded-2xl bg-card shadow-[var(--shadow-card)] open:shadow-[var(--shadow-lift)]">
                  <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 px-5 py-3 font-bold">
                    {t(q)}<span aria-hidden className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground transition-transform duration-200 group-open:rotate-45"><Plus className="h-4 w-4" /></span>
                  </summary>
                  <p className="px-5 pb-4 leading-relaxed text-muted-foreground">{t(a)}</p>
                </details>
              ))}
            </div>
          </section>
        </div>

        <section className="app-hero mt-14 rounded-2xl p-6 sm:p-10">
          <h2 className="text-2xl font-semibold sm:text-2xl">{t("fbCtaTitle")}</h2>
          <p className="mt-2 mb-5 max-w-2xl leading-relaxed text-[var(--hero-muted)]">{t("fbCtaBody")}</p>
          {cta()}
        </section>
      </Page>
    </>
  );
}

/** A generic example card, never a real business from the directory. */
function Mock({ good }: { good: boolean }) {
  const { t } = useI18n();
  const rows: Key[] = good ? ["fbAfter1", "fbAfter2", "fbAfter3"] : ["fbBefore1", "fbBefore2", "fbBefore3"];
  return (
    <figure className={`rounded-2xl border bg-card p-5 shadow-[var(--shadow-lift)] ${good ? "border-success/30" : "border-border"}`}>
      <figcaption className={`status-chip ${good ? "status-success" : "status-neutral"}`}>{t(good ? "fbAfterLabel" : "fbBeforeLabel")}</figcaption>
      <div className={`mt-4 flex items-center gap-3 ${good ? "" : "opacity-70"}`}>
        <span aria-hidden className="monogram cat-salons h-12 w-12 text-xl">{t("fbExampleName").charAt(0)}</span>
        <p className="text-base font-semibold">{t("fbExampleName")}</p>
      </div>
      <ul className="mt-4 space-y-2">
        {rows.map((k) => (
          <li key={k} className="flex items-start gap-2 text-[15px]">
            <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${good ? "bg-success-soft text-success" : "bg-muted text-muted-foreground"}`}>
              {good ? <Check aria-hidden className="h-3 w-3" /> : <X aria-hidden className="h-3 w-3" />}
            </span>
            {t(k)}
          </li>
        ))}
      </ul>
    </figure>
  );
}
