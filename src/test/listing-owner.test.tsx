import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { getBusiness, type Business, type WebsiteStatus } from "@/data/directory";
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

function renderListingDocument(business: Business) {
  const component = Route.options.component;
  if (!component) throw new Error("Missing listing page");
  const loader = vi.spyOn(Route, "useLoaderData").mockReturnValue({ business });
  try {
    return new DOMParser().parseFromString(renderToStaticMarkup(createElement(component)), "text/html");
  } finally {
    loader.mockRestore();
  }
}

function listingBusiness(status: WebsiteStatus, slug = "nuad-thai-lazimpat", website?: string | null) {
  const original = getBusiness(slug);
  if (!original) throw new Error("Missing test listing");
  const business: Business = { ...original, websiteStatus: status };
  if (website === null) delete business.website;
  else if (website !== undefined) business.website = website;
  return business;
}

function listingLinks(status: WebsiteStatus, slug = "nuad-thai-lazimpat", website?: string | null) {
  return Array.from(renderListingDocument(listingBusiness(status, slug, website)).querySelectorAll("a"), (a) => a.getAttribute("href") ?? "");
}

function websiteActionLinks(status: WebsiteStatus, slug: string, website?: string | null) {
  return Array.from(renderListingDocument(listingBusiness(status, slug, website)).querySelectorAll('[role="group"] a'), (a) => a.getAttribute("href") ?? "");
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

describe("listing website action availability", () => {
  it.each(["failed", "not_checked", "none_found", "owner_no_site"] as const)(
    "does not expose a website action when the website status is %s",
    (status) => {
      const business = getBusiness("aavaran-durbar-marg");
      if (!business?.website) throw new Error("Missing official website fixture");
      const links = websiteActionLinks(status, business.slug);
      expect(links).not.toContain(business.website);
    },
  );

  it("exposes one action for a recorded working official website", () => {
    const business = getBusiness("aavaran-durbar-marg");
    if (!business?.website) throw new Error("Missing official website fixture");
    const links = websiteActionLinks("working", business.slug);
    expect(links).toContain(business.website);
  });

  it.each([
    "https://www.instagram.com/aavaranclinic/",
    "javascript:alert(1)",
  ])("does not expose a non-website URL as a website action: %s", (website) => {
    const business = getBusiness("aavaran-durbar-marg");
    if (!business) throw new Error("Missing website fixture");
    expect(websiteActionLinks("working", business.slug, website)).not.toContain(website);
  });

  it("does not expose a website action when the URL is missing", () => {
    const business = getBusiness("aavaran-durbar-marg");
    if (!business?.website) throw new Error("Missing official website fixture");
    expect(websiteActionLinks("working", business.slug, null)).not.toContain(business.website);
  });
});
