import { createFileRoute } from "@tanstack/react-router";
import { Page, pageMeta } from "@/components/site";
import { CONTACT_PHONE, CONTACT_PHONE_PLACEHOLDER } from "@/config";

export const Route = createFileRoute("/website-help")({
  head: () => pageMeta("Website check and new site", "We check whether a business website works, and can update it or make a new one."),
  component: WebsiteHelp,
});

function WebsiteHelp() {
  return (
    <Page>
      <h1 className="font-serif text-3xl font-semibold">Website check and new site</h1>
      <p className="mt-4 leading-relaxed">
        We check whether a business website works. If it is down, missing, or out of date, we can update it or make a new one.
        The listing stays free. A site made by us includes the right to edit the listing later.
      </p>
      <h2 className="section-label mt-6">How to ask</h2>
      <p className="leading-relaxed">Call or message the number on this page.</p>
      <p className="mt-3 font-semibold">
        Contact:{" "}
        {CONTACT_PHONE ? <a href={`tel:${CONTACT_PHONE}`} className="text-primary underline">{CONTACT_PHONE}</a>
          : <span>{CONTACT_PHONE_PLACEHOLDER} <span className="font-normal text-muted-foreground">(placeholder, number not set yet)</span></span>}
      </p>
    </Page>
  );
}
