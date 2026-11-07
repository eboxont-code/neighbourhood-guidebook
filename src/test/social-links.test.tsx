import { createElement, type AnchorHTMLAttributes, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { getBusiness, businesses, socialLinks, type Business } from "@/data/directory";
import { Route as ListingRoute } from "@/routes/s.$slug";
import { Route as PreviewRoute } from "@/routes/s.$slug_.website-preview";

vi.mock("@tanstack/react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@tanstack/react-router")>();
  return {
    ...actual,
    useRouter: () => ({ history: { back: vi.fn() }, navigate: vi.fn() }),
    Link: ({ to, params, search, children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & {
      to: string;
      params?: Record<string, string>;
      search?: Record<string, string>;
      children?: ReactNode;
    }) => {
      let href = to;
      for (const [key, value] of Object.entries(params ?? {})) href = href.replace("$" + key, value);
      if (search) href += "?" + new URLSearchParams(search).toString();
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
vi.mock("@/components/site", () => ({
  NotFoundView: () => null,
  HoursLine: () => null,
  pageMeta: () => ({ meta: [] }),
  useNow: () => new Date("2026-11-07T12:00:00.000Z"),
}));
vi.mock("@/lib/track", () => ({ track: vi.fn() }));
vi.mock("@/lib/i18n", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/i18n")>();
  return {
    ...actual,
    useI18n: () => ({ lang: "en", setLang: vi.fn(), t: (key: string) => key }),
  };
});

const SOCIAL_HOSTS = new Set([
  "www.instagram.com",
  "www.facebook.com",
  "www.tiktok.com",
  "www.youtube.com",
]);

function businessWithSocial(slug: string, social: string[]): Business {
  const original = getBusiness(slug);
  if (!original) throw new Error("Missing directory fixture: " + slug);
  return {
    ...original,
    website: undefined,
    sourceUrl: undefined,
    fieldSources: undefined,
    social,
  };
}

function renderListing(business: Business) {
  const component = ListingRoute.options.component;
  if (!component) throw new Error("Missing listing page component");
  const loader = vi.spyOn(ListingRoute, "useLoaderData").mockReturnValue({ business });
  try {
    const html = renderToStaticMarkup(createElement(component));
    return new DOMParser().parseFromString(html, "text/html");
  } finally {
    loader.mockRestore();
  }
}

function renderPreview(business: Business) {
  const component = PreviewRoute.options.component;
  if (!component) throw new Error("Missing website preview component");
  const loader = vi.spyOn(PreviewRoute, "useLoaderData").mockReturnValue({ business });
  try {
    const html = renderToStaticMarkup(createElement(component));
    return new DOMParser().parseFromString(html, "text/html");
  } finally {
    loader.mockRestore();
  }
}

function expectSafeSocialLinks(document: Document, business: Business) {
  const expected = socialLinks(business).map((link) => link.url).sort();
  const anchors = Array.from(document.querySelectorAll("a")).filter((anchor) => expected.includes(anchor.href));
  expect(anchors.map((anchor) => anchor.href).sort()).toEqual(expected);
  for (const anchor of anchors) {
    expect(anchor.getAttribute("target")).toBe("_blank");
    const rel = new Set((anchor.getAttribute("rel") ?? "").split(/\s+/));
    expect(rel.has("noopener")).toBe(true);
    expect(rel.has("noreferrer")).toBe(true);
  }
}

describe("business social-link construction", () => {
  it("uses only the social handles on the supplied business record", () => {
    const first = businessWithSocial("aavaran-durbar-marg", ["Instagram @first.clinic", "Facebook firstclinic"]);
    const second = businessWithSocial("nuad-thai-lazimpat", ["TikTok @secondspa", "YouTube @secondchannel"]);
    const firstLinks = socialLinks(first);
    const secondLinks = socialLinks(second);

    expect(firstLinks.map((link) => link.url)).toEqual([
      "https://www.instagram.com/first.clinic/",
      "https://www.facebook.com/firstclinic",
    ]);
    expect(secondLinks.map((link) => link.url)).toEqual([
      "https://www.tiktok.com/@secondspa",
      "https://www.youtube.com/@secondchannel",
    ]);
    expect(firstLinks.some((link) => secondLinks.some((other) => other.url === link.url))).toBe(false);
  });

  it("rejects unknown platforms, full URLs, paths, query strings, fragments and extra tokens", () => {
    const business = businessWithSocial("aavaran-durbar-marg", [
      "Instagram https://evil.example/path",
      "Facebook safe?next=https://evil.example",
      "TikTok @safe/redirect",
      "YouTube @safe#fragment",
      "Instagram safe extra",
      "Unknown safehandle",
      "__proto__ safehandle",
      "Instagram @",
    ]);
    expect(socialLinks(business)).toEqual([]);
  });

  it("keeps every existing directory social entry on its official HTTPS host", () => {
    const links = businesses.flatMap((business) => socialLinks(business));
    expect(links).toHaveLength(24);
    for (const link of links) {
      const url = new URL(link.url);
      expect(url.protocol).toBe("https:");
      expect(SOCIAL_HOSTS.has(url.hostname)).toBe(true);
    }
  });
});

describe("listing and preview social-link rendering", () => {
  const first = businessWithSocial("aavaran-durbar-marg", ["Instagram @first.clinic", "Facebook firstclinic"]);
  const second = businessWithSocial("nuad-thai-lazimpat", ["TikTok @secondspa", "YouTube @secondchannel"]);

  it("renders only the current listing's social links with safe external-link attributes", () => {
    const firstDocument = renderListing(first);
    expectSafeSocialLinks(firstDocument, first);
    expect(firstDocument.querySelectorAll('a[href="https://www.tiktok.com/@secondspa"]')).toHaveLength(0);

    const secondDocument = renderListing(second);
    expectSafeSocialLinks(secondDocument, second);
    expect(secondDocument.querySelectorAll('a[href="https://www.instagram.com/first.clinic/"]')).toHaveLength(0);
  });

  it("renders only the current preview's social links with safe external-link attributes", () => {
    const firstDocument = renderPreview(first);
    expectSafeSocialLinks(firstDocument, first);
    expect(firstDocument.querySelectorAll('a[href="https://www.youtube.com/@secondchannel"]')).toHaveLength(0);

    const secondDocument = renderPreview(second);
    expectSafeSocialLinks(secondDocument, second);
    expect(secondDocument.querySelectorAll('a[href="https://www.facebook.com/firstclinic"]')).toHaveLength(0);
  });
});
