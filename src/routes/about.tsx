import { createFileRoute } from "@tanstack/react-router";
import { TextPage, pageMeta } from "@/components/site";
import { SITE_NAME } from "@/config";

export const Route = createFileRoute("/about")({
  head: () => pageMeta("About the directory", `What ${SITE_NAME} is and how listings are recorded.`),
  component: () => <TextPage title="About the directory" body={`${SITE_NAME} is a plain list of local businesses: name, type, area, phone, hours and website, with a note on whether each website was checked. It is meant to sit beside your map app, not replace it. This version is a prototype and every listing is sample data, not a real business.`} />,
});
