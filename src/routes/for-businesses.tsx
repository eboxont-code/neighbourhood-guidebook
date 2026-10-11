import { createFileRoute, Link } from "@tanstack/react-router";
import { Page, pageMeta } from "@/components/site";
import { useI18n, type Key } from "@/lib/i18n";

export const Route = createFileRoute("/for-businesses")({
  head: () => pageMeta("For businesses", "Simple, mobile-friendly websites for salons, barbers, spas and clinics in Kathmandu. Your directory listing stays free either way.", "/for-businesses"),
  component: ForBusinesses,
});

function H2({ children }: { children: string }) {
  return <h2 className="font-serif text-2xl font-semibold">{children}</h2>;
}

function ForBusinesses() {
  const { t } = useI18n();
  const why: Key[] = ["fbWhy1", "fbWhy2", "fbWhy3", "fbWhy4"];
  const how: Key[] = ["fbHow1", "fbHow2", "fbHow3", "fbHow4"];
  const faq: [Key, Key][] = [["fbQ1", "fbA1"], ["fbQ2", "fbA2"], ["fbQ3", "fbA3"], ["fbQ4", "fbA4"], ["fbQ5", "fbA5"]];
  const cta = (
    <Link to="/contact" className="action-btn action-primary inline-flex w-full px-6 sm:w-auto">{t("fbCta")}</Link>
  );
  return (
    <Page>
      <h1 className="font-serif text-3xl font-semibold">{t("fbTitle")}</h1>
      <p className="mt-4 text-lg leading-relaxed">{t("fbIntro")}</p>
      <div className="mt-5">{cta}</div>

      <section className="mt-10">
        <H2>{t("fbWhyTitle")}</H2>
        <ul className="mt-4 divide-y divide-border border-y border-border">
          {why.map((k) => <li key={k} className="py-3 leading-relaxed">{t(k)}</li>)}
        </ul>
      </section>

      <section className="mt-10">
        <H2>{t("fbWhatTitle")}</H2>
        <p className="mt-3 leading-relaxed">{t("fbWhatBody")}</p>
      </section>

      <section className="mt-10">
        <H2>{t("fbHowTitle")}</H2>
        <ol className="mt-4 space-y-3">
          {how.map((k, i) => (
            <li key={k} className="flex gap-3">
              <span aria-hidden className="monogram h-8 w-8 text-base">{i + 1}</span>
              <span className="pt-1 leading-relaxed">{t(k)}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-10">
        <H2>{t("fbFaqTitle")}</H2>
        <div className="mt-3 divide-y divide-border border-y border-border">
          {faq.map(([q, a]) => (
            <details key={q} className="group py-1">
              <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 font-medium">
                {t(q)}<span aria-hidden className="text-muted-foreground transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="pb-3 leading-relaxed text-muted-foreground">{t(a)}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="venue-panel mt-10">
        <h2 className="font-serif text-2xl font-semibold">{t("fbCtaTitle")}</h2>
        <p className="mt-2 mb-4 leading-relaxed">{t("fbCtaBody")}</p>
        {cta}
      </section>
    </Page>
  );
}
