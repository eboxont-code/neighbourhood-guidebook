import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock, Globe, Plus, Search, Smartphone } from "lucide-react";
import { Page, pageMeta } from "@/components/site";
import { useI18n, type Key } from "@/lib/i18n";

export const Route = createFileRoute("/for-businesses")({
  head: () => pageMeta("For businesses", "Simple, mobile-friendly websites for salons, barbers, spas and clinics in Kathmandu. Your directory listing stays free either way.", "/for-businesses"),
  component: ForBusinesses,
});

function H2({ children }: { children: string }) {
  return <h2 className="text-2xl font-extrabold sm:text-3xl">{children}</h2>;
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
        <div className="page-enter mx-auto max-w-4xl px-4 pt-8 pb-16 lg:pt-16 lg:pb-24">
          <p className="inline-flex rounded-full bg-card/15 px-3 py-1 text-sm font-bold">{t("fbKicker")}</p>
          <h1 className="mt-3 text-4xl leading-tight font-extrabold sm:text-5xl">{t("fbTitle")}</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed opacity-90">{t("fbIntro")}</p>
          <div className="mt-6">{cta()}</div>
        </div>
      </section>

      <Page wide>
        <section className="-mt-12">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {why.map((k, i) => {
              const Icon = WHY_ICONS[i]!;
              return (
                <div key={k} className="rounded-3xl bg-card p-5 shadow-[var(--shadow-lift)]">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground"><Icon aria-hidden className="h-6 w-6" /></span>
                  <p className="mt-3 leading-relaxed">{t(k)}</p>
                </div>
              );
            })}
          </div>
          <h2 className="sr-only">{t("fbWhyTitle")}</h2>
        </section>

        <div className="mx-auto max-w-3xl">
          <section className="mt-14">
            <H2>{t("fbWhatTitle")}</H2>
            <p className="mt-3 text-lg leading-relaxed text-muted-foreground">{t("fbWhatBody")}</p>
          </section>

          <section className="mt-14">
            <H2>{t("fbHowTitle")}</H2>
            <ol className="relative mt-6 space-y-4 before:absolute before:top-6 before:bottom-6 before:left-6 before:w-0.5 before:bg-border">
              {how.map((k, i) => (
                <li key={k} className="relative flex gap-4">
                  <span aria-hidden className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-extrabold text-primary-foreground shadow-[var(--shadow-card)]">{i + 1}</span>
                  <span className="flex-1 rounded-2xl bg-card p-4 leading-relaxed shadow-[var(--shadow-card)]">{t(k)}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className="mt-14">
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

        <section className="app-hero mt-14 rounded-3xl p-6 sm:p-10">
          <h2 className="text-2xl font-extrabold sm:text-3xl">{t("fbCtaTitle")}</h2>
          <p className="mt-2 mb-5 max-w-2xl leading-relaxed opacity-90">{t("fbCtaBody")}</p>
          {cta()}
        </section>
      </Page>
    </>
  );
}
