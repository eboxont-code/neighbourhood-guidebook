import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import type { Business } from "@/data/directory";
import {
  directionsLink,
  telLink,
  websiteButton,
  websiteShortLabel,
} from "@/data/directory";
import { offersPreview } from "@/lib/preview";
import { Route as PreviewRoute } from "@/routes/s.$slug_.website-preview";

vi.mock("@tanstack/react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@tanstack/react-router")>();
  return {
    ...actual,
    Link: ({
      to,
      params,
      search,
      children,
      ...props
    }: {
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

vi.mock("@/components/site", () => ({
  NotFoundView: () => null,
  useNow: () => null,
}));
vi.mock("@/components/map-view", () => ({ MapView: () => null }));
vi.mock("@/components/cover", () => ({ CatIcon: () => null }));
vi.mock("@/lib/track", () => ({ track: vi.fn() }));
vi.mock("@/lib/i18n", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/i18n")>();
  return {
    ...actual,
    useI18n: () => ({
      lang: "en",
      t: (key: string) => actual.dict.en[key as keyof typeof actual.dict.en] ?? key,
    }),
  };
});

/**
 * Minimal public-field fixture copied from the read-only Production listing
 * for Dental Solution. The ID is synthetic and this test never accesses or
 * changes the Production record. Its failed website status was last checked
 * on 17 October 2026; this fixture does not claim a current outage.
 */
const brokenWebsiteBusiness = {
  id: "test-fixture-dental-solution-baluwatar",
  slug: "dental-solution-baluwatar",
  name: "Dental Solution",
  category: "clinics",
  area: "baluwatar",
  address: "Kirtan Chowk, Baluwatar, Kathmandu",
  phone: "9818174710",
  website: "http://dentalsolutionnepal.com",
  websiteStatus: "failed",
  description: "Dental clinic set up in 2022.",
  services: [],
  sourceNotes: "",
  verification: "source_checked",
  lastChecked: "2026-10-17",
  demo: false,
  directions: "https://www.google.com/maps/search/?api=1&query=Dental+Solution+Kirtan+Chowk+Baluwatar+Kathmandu",
} satisfies Business;

function renderPreview() {
  const component = PreviewRoute.options.component;
  if (!component) throw new Error("Missing website-preview component");
  const loader = vi.spyOn(PreviewRoute, "useLoaderData").mockReturnValue({ business: brokenWebsiteBusiness });
  try {
    return new DOMParser().parseFromString(
      renderToStaticMarkup(createElement(component)),
      "text/html",
    );
  } finally {
    loader.mockRestore();
  }
}

describe("shared website preview for a listing with a recorded failed website check", () => {
  it("keeps the failed official URL out of preview links while retaining business context", () => {
    expect(brokenWebsiteBusiness.websiteStatus).toBe("failed");
    expect(brokenWebsiteBusiness.lastChecked).toBe("2026-10-17");
    expect(offersPreview(brokenWebsiteBusiness)).toBe(true);
    expect(websiteButton(brokenWebsiteBusiness)).toBe(false);
    expect(websiteShortLabel(brokenWebsiteBusiness)).toBe("webDown");

    const document = renderPreview();
    expect(document.querySelector("header h1")?.textContent).toBe(brokenWebsiteBusiness.name);
    expect(document.querySelector("header nav .truncate")?.textContent).toBe(brokenWebsiteBusiness.name);
    expect(document.querySelector("footer p.font-semibold")?.textContent).toBe(brokenWebsiteBusiness.name);
    expect(document.body.textContent).toContain(brokenWebsiteBusiness.address);
    expect(document.body.textContent).toContain(brokenWebsiteBusiness.phone);
    expect(document.body.textContent).not.toContain("dentalsolutionnepal.com");

    const ownerCta = document.querySelector<HTMLAnchorElement>('a[href^="/contact?from=preview"]');
    expect(ownerCta).not.toBeNull();
    const ownerUrl = new URL(ownerCta!.getAttribute("href")!, "https://sewa.boxont.com");
    expect(ownerUrl.searchParams.get("listing")).toBe(brokenWebsiteBusiness.slug);
    expect(ownerUrl.searchParams.get("business")).toBe(brokenWebsiteBusiness.name);

    const allHrefs = Array.from(document.querySelectorAll<HTMLAnchorElement>("a[href]"))
      .map((link) => link.getAttribute("href"));
    expect(allHrefs).not.toContain(brokenWebsiteBusiness.website);

    const externalHrefs = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href^="https://"]'))
      .map((link) => link.getAttribute("href"))
      .sort();
    expect(externalHrefs).toEqual([directionsLink(brokenWebsiteBusiness)]);

    const contactHrefs = Array.from(document.querySelectorAll<HTMLAnchorElement>("#contact a"))
      .map((link) => link.getAttribute("href"));
    expect(contactHrefs).toEqual([telLink(brokenWebsiteBusiness.phone)]);
  });
});
