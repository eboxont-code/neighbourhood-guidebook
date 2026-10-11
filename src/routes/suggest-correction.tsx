import { createFileRoute } from "@tanstack/react-router";
import { Page, pageMeta } from "@/components/site";
import { CorrectionForm } from "@/components/forms";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/suggest-correction")({
  validateSearch: (s: Record<string, unknown>): { listing?: string } =>
    typeof s["listing"] === "string" ? { listing: s["listing"].slice(0, 100) } : {},
  head: () => pageMeta("Suggest a correction", "Tell us if a phone number, opening hours or website on a listing is wrong."),
  component: CorrectionPage,
});

function CorrectionPage() {
  const { listing = "" } = Route.useSearch();
  const { t } = useI18n();
  return (
    <Page>
      <h1 className="font-serif text-3xl font-semibold">{t("correctionTitle")}</h1>
      <p className="mt-3 mb-6 leading-relaxed">{t("correctionIntro")}</p>
      <CorrectionForm key={listing} listing={listing} />
    </Page>
  );
}
