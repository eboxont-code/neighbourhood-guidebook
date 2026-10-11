import { createFileRoute } from "@tanstack/react-router";
import { Page, pageMeta } from "@/components/site";
import { ContactForm } from "@/components/forms";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/contact")({
  validateSearch: (s: Record<string, unknown>) => ({
    business: typeof s["business"] === "string" ? s["business"].slice(0, 150) : "",
    listing: typeof s["listing"] === "string" ? s["listing"].slice(0, 100) : "",
  }),
  head: () => pageMeta("Contact", "Get in touch about the directory, a listing, or a website."),
  component: ContactPage,
});

function ContactPage() {
  const { business, listing } = Route.useSearch();
  const { t } = useI18n();
  return (
    <Page>
      <h1 className="font-serif text-3xl font-semibold">{t("contactTitle")}</h1>
      <p className="mt-3 mb-6 leading-relaxed">{t("contactIntro")}</p>
      <ContactForm key={`${business}|${listing}`} business={business} listing={listing} />
    </Page>
  );
}
