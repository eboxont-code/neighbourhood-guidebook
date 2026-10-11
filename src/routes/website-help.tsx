import { createFileRoute } from "@tanstack/react-router";
import { TextPage, pageMeta } from "@/components/site";

export const Route = createFileRoute("/website-help")({
  head: () => pageMeta("Website help", "Simple websites for local businesses — not open yet."),
  component: () => <TextPage title="Website help" body="We check whether a business website works. If it does not, we can update it or make a new one. Contact: details to be added." />,
});
