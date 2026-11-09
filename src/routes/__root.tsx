import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportSewaError } from "../lib/sewa-error-reporting";
import { LangProvider, useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { BottomNav, Footer, Header, NotFoundView } from "@/components/site";
import { ensureListings } from "@/lib/listings";
import { previewSlug } from "@/lib/preview";
import { getBusiness } from "@/data/directory";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-5xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  return <LangProvider><PublicError error={error} reset={reset} /></LangProvider>;
}

function PublicError({ error, reset }: ErrorComponentProps) {
  const { t } = useI18n();
  const router = useRouter();
  useEffect(() => {
    reportSewaError(error, { boundary: "root_error_component" });
  }, [error]);

  return (
    <main id="main-content" tabIndex={-1} className="flex min-h-dvh items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          {t("pageErrorTitle")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("pageErrorBody")}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="min-h-11 px-4"
          >
            {t("retryPage")}
          </Button>
          <a
            href="/"
            className="inline-flex min-h-11 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            {t("goHome")}
          </a>
        </div>
      </div>
    </main>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  // Load the listing data before child routes so every page receives the same record set.
  beforeLoad: () => ensureListings(),
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "theme-color", content: "#263550" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Mukta:wght@400;500;600;700;800&display=swap" },
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "icon", href: "/favicon.ico", sizes: "48x48" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png", sizes: "180x180" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: () => (<LangProvider><Header /><NotFoundView /><Footer /><BottomNav /></LangProvider>),
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  // The free website preview stands alone like a real business site, so the directory chrome is
  // left out there. Unknown slugs keep it, so the normal not-found page looks as usual.
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const slug = previewSlug(pathname);
  const standalone = slug !== null && Boolean(getBusiness(slug));

  return (
    <QueryClientProvider client={queryClient}>
      <LangProvider>
        <SkipLink />
        {!standalone && <Header />}
        <Outlet />
        {!standalone && <Footer />}
        {!standalone && <BottomNav />}
      </LangProvider>
    </QueryClientProvider>
  );
}

function SkipLink() {
  const { t } = useI18n();
  return <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[1100] focus:inline-flex focus:min-h-11 focus:items-center focus:rounded-md focus:bg-card focus:px-4 focus:text-primary focus:shadow-lg">{t("skipContent")}</a>;
}
