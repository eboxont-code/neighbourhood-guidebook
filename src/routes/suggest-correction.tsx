import { createFileRoute } from "@tanstack/react-router";
import { TextPage, pageMeta } from "@/components/site";

export const Route = createFileRoute("/suggest-correction")({
  head: () => pageMeta("Suggest a correction", "How corrections to listings will work."),
  component: () => <TextPage title="Suggest a correction" body="If a phone, hour, or website is wrong, send the correct detail." />,
});
