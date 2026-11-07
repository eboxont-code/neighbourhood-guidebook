import { createElement, type ReactNode } from "react";
import { cleanup, render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const { trackMock } = vi.hoisted(() => ({ trackMock: vi.fn() }));
vi.mock("@/lib/track", () => ({ track: trackMock }));
vi.mock("@tanstack/react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@tanstack/react-router")>();
  return {
    ...actual,
    useRouter: () => ({ history: { back: vi.fn() }, navigate: vi.fn() }),
    Link: ({ to, params, search, children, ...props }: {
      to: string;
      children?: ReactNode;
      params?: Record<string, string>;
      search?: Record<string, string>;
    }) => {
      let href = to;
      for (const [key, value] of Object.entries(params ?? {})) href = href.replace(`$${key}`, value);
      if (search) href += `?${new URLSearchParams(search)}`;
      return <a href={href} {...props}>{children}</a>;
    },
  };
});
vi.mock("@/lib/geo", async (importOriginal) => ({
  ...await importOriginal<typeof import("@/lib/geo")>(),
  useLocation: () => ({ here: null }),
}));
vi.mock("@/components/site", () => ({
  NotFoundView: () => null,
  HoursLine: () => null,
  pageMeta: () => ({}),
  useNow: () => null,
}));
vi.mock("@/components/cover", () => ({ CatIcon: () => null }));
vi.mock("@/components/blocks", () => ({ SectionHead: () => null }));
vi.mock("@/components/venue", () => ({ HeartButton: () => null, VenueRow: () => null }));
vi.mock("@/components/map-view", () => ({ MapView: () => null }));
vi.mock("@/components/verification-badge", () => ({ VerificationBadge: () => null }));
vi.mock("@/components/provenance-disclosure", () => ({ ProvenanceDisclosure: () => null }));
vi.mock("@/lib/i18n", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/i18n")>();
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key, lang: "en" }),
    hoursSourceLabel: () => "",
  };
});

import { businesses, getBusiness } from "@/data/directory";
import { Route } from "@/routes/s.$slug";

class TestIntersectionObserver {
  observe() {}
  disconnect() {}
  unobserve() {}
}

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  vi.unstubAllGlobals();
});

describe("listing-page analytics", () => {
  it("records one listing_view per business slug without duplicating on rerender", async () => {
    const first = getBusiness("nuad-thai-lazimpat");
    const second = businesses.find((business) => business.slug !== first?.slug);
    if (!first || !second) throw new Error("Expected two listing records");

    const component = Route.options.component;
    if (!component) throw new Error("Missing listing page component");

    vi.stubGlobal("IntersectionObserver", TestIntersectionObserver);
    const loader = vi.spyOn(Route, "useLoaderData").mockReturnValue({ business: first });
    try {
      const view = render(createElement(component));

      await waitFor(() => expect(trackMock).toHaveBeenCalledTimes(1));
      expect(trackMock).toHaveBeenNthCalledWith(1, "listing_view", { slug: first.slug });

      view.rerender(createElement(component));
      expect(trackMock).toHaveBeenCalledTimes(1);

      loader.mockReturnValue({ business: second });
      view.rerender(createElement(component));

      await waitFor(() => expect(trackMock).toHaveBeenCalledTimes(2));
      expect(trackMock).toHaveBeenNthCalledWith(2, "listing_view", { slug: second.slug });
    } finally {
      loader.mockRestore();
    }
  });
});
