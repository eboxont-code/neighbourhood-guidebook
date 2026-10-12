import { createFileRoute } from "@tanstack/react-router";
import { Page, pageMeta } from "@/components/site";
import { ContactForm } from "@/components/forms";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/contact")({
  validateSearch: (s: Record<string, unknown>): { business?: string; listing?: string } => ({
    ...(typeof s["business"] === "string" ? { business: s["business"].slice(0, 150) } : {}),
    ...(typeof s["listing"] === "string" ? { listing: s["listing"].slice(0, 100) } : {}),
  }),
  head: () => pageMeta("Contact", "Send a note about the directory, a listing, or a website for your business.", "/contact"),
  component: ContactPage,
});

function ContactPage() {
  const { business = "", listing = "" } = Route.useSearch();
  const { t } = useI18n();
  return (
    <Page>
      <h1 className="text-2xl font-semibold sm:text-3xl">{t("contactTitle")}</h1>
      <p className="mt-3 mb-6 leading-relaxed text-muted-foreground">{t("contactIntro")}</p>
      <div className="form-card"><ContactForm key={`${business}|${listing}`} business={business} listing={listing} /></div>
    </Page>
  );
}
