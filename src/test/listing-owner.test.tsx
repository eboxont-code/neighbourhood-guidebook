import { createElement, type ReactNode } from "react";
import { fireEvent, render } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";

const { trackMock } = vi.hoisted(() => ({ trackMock: vi.fn() }));
vi.mock("@/lib/track", () => ({ track: trackMock }));
afterEach(() => vi.unstubAllGlobals());
import { getBusiness, type WebsiteStatus } from "@/data/directory";
import { Route } from "@/routes/s.$slug";

vi.mock("@tanstack/react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@tanstack/react-router")>();
  return {
    ...actual,
    useRouter: () => ({ history: { back: vi.fn() }, navigate: vi.fn() }),
    Link: ({ to, params, search, children, ...props }: { to: string; params?: Record<string, string>; search?: Record<string, string>; children?: ReactNode }) => {
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
vi.mock("@/components/map-view", () => ({ MapView: () => null }));
vi.mock("@/components/venue", () => ({ HeartButton: () => null, VenueRow: () => null }));

function listingLinks(status: WebsiteStatus) {
  const original = getBusiness("nuad-thai-lazimpat");
  if (!original) throw new Error("Missing test listing");
  const component = Route.options.component;
  if (!component) throw new Error("Missing listing page");
  const loader = vi.spyOn(Route, "useLoaderData").mockReturnValue({ business: { ...original, websiteStatus: status } });
  try {
    const document = new DOMParser().parseFromString(renderToStaticMarkup(createElement(component)), "text/html");
    return Array.from(document.querySelectorAll("a"), (a) => a.getAttribute("href") ?? "");
  } finally {
    loader.mockRestore();
  }
}

describe("listing owner destinations", () => {
  it.each(["none_found", "owner_no_site", "failed", "not_checked"] as const)("offers exactly one preview and one claim action for %s", (status) => {
    const links = listingLinks(status);
    expect(links.filter((href) => href === "/s/nuad-thai-lazimpat/website-preview")).toHaveLength(1);
    expect(links.filter((href) => href === "/claim?listing=nuad-thai-lazimpat")).toHaveLength(1);
  });
  it("does not offer a preview for a working website", () => {
    expect(listingLinks("working").filter((href) => href.includes("website-preview"))).toHaveLength(0);
  });
});

describe("listing preview analytics", () => {
  it("records one stable preview_click event with the listing slug when its preview link is clicked", () => {
    const original = getBusiness("nuad-thai-lazimpat");
    if (!original) throw new Error("Missing test listing");
    const component = Route.options.component;
    if (!component) throw new Error("Missing listing page");
    const loader = vi.spyOn(Route, "useLoaderData").mockReturnValue({
      business: { ...original, websiteStatus: "none_found" },
    });
    try {
      vi.stubGlobal("IntersectionObserver", class {
        observe() {}
        unobserve() {}
        disconnect() {}
      });
      const { container, unmount } = render(createElement(component));
      const previewLink = container.querySelector<HTMLAnchorElement>(
        'a[href="/s/nuad-thai-lazimpat/website-preview"]',
      );
      if (!previewLink) throw new Error("Missing listing preview link");
      expect(trackMock).not.toHaveBeenCalled();
      fireEvent.click(previewLink);
      expect(trackMock).toHaveBeenCalledTimes(1);
      expect(trackMock).toHaveBeenCalledWith("preview_click", { slug: original.slug });
      unmount();
    } finally {
      loader.mockRestore();
    }
  });
});
