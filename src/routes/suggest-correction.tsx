import { createFileRoute } from "@tanstack/react-router";
import { TextPage, pageMeta } from "@/components/site";

export const Route = createFileRoute("/suggest-correction")({
  head: () => pageMeta("Suggest a correction", "How corrections to listings will work."),
  component: () => <TextPage title="Suggest a correction" body="If a phone number, hours or website is wrong, we want to know. Corrections are not being collected yet in this prototype; once they are, this page will explain how to send one and how we check it before changing a listing." />,
});
