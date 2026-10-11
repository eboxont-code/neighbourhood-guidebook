import { createFileRoute } from "@tanstack/react-router";
import { TextPage, pageMeta } from "@/components/site";

export const Route = createFileRoute("/privacy")({
  head: () => pageMeta("Privacy", "How this directory handles your information."),
  component: () => <TextPage title="Privacy" body="This prototype has no accounts and collects no personal information. The only thing it stores is your language choice, kept in your own browser. Links to calls, WhatsApp, websites and maps take you to those services, which have their own policies." />,
});
