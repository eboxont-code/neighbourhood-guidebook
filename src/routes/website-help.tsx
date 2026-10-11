import { createFileRoute, redirect } from "@tanstack/react-router";

// Old address for the owners' page; kept so existing links still work.
export const Route = createFileRoute("/website-help")({
  beforeLoad: () => {
    throw redirect({ to: "/for-businesses", statusCode: 301 });
  },
});
