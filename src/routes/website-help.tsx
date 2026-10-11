import { createFileRoute } from "@tanstack/react-router";
import { TextPage, pageMeta } from "@/components/site";

export const Route = createFileRoute("/website-help")({
  head: () => pageMeta("Website help", "Simple websites for local businesses — not open yet."),
  component: () => <TextPage title="Website help" body="Many local businesses have no website of their own. A simple site may be offered to listed businesses later. This is not open yet, and nothing can be requested here today." />,
});
