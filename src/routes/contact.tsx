import { createFileRoute } from "@tanstack/react-router";
import { TextPage, pageMeta } from "@/components/site";

export const Route = createFileRoute("/contact")({
  head: () => pageMeta("Contact", "How to reach the people behind the directory."),
  component: () => <TextPage title="Contact" body="A contact address is not set up yet for this prototype. When the directory opens, this page will list a way to reach the team. There is no form here, so nothing you type is sent anywhere." />,
});
