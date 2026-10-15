import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { dehydrateListings, hydrateListings } from "@/lib/listings";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    dehydrate: () => ({ listings: dehydrateListings() }),
    hydrate: (d) => hydrateListings(d?.listings),
  });

  return router;
};
