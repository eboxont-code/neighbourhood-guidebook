import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { getBusiness, type Business } from "@/data/directory";
import { dict } from "@/lib/i18n";
import { rowToBusiness } from "@/lib/listings.functions";
import { Route } from "@/routes/s.$slug_.website-preview";

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
      for (const [key, value] of Object.entries(params ?? {})) {
        href = href.replace(`$${key}`, value);
      }
      if (search) href += `?${new URLSearchParams(search)}`;
      return <a href={href} {...props}>{children}</a>;
    },
  };
});

vi.mock("@/components/map-view", () => ({ MapView: () => null }));

function previewMarkup(services: Business["services"]) {
  const original = getBusiness("nuad-thai-lazimpat");
  if (!original) throw new Error("Missing test listing");
  const component = Route.options.component;
  if (!component) throw new Error("Missing preview page");
  const loader = vi.spyOn(Route, "useLoaderData").mockReturnValue({
    business: { ...original, services },
  });
  try {
    return renderToStaticMarkup(createElement(component));
  } finally {
    loader.mockRestore();
  }
}

function serviceItems(markup: string): string[] {
  const document = new DOMParser().parseFromString(markup, "text/html");
  const labels: string[] = [dict.en.services, dict.ne.services];
  const heading = Array.from(document.querySelectorAll("h3")).find((item) =>
    labels.includes(item.textContent ?? ""),
  );
  const list = heading?.nextElementSibling;
  if (!(list instanceof HTMLUListElement)) throw new Error("Missing preview services list");
  return Array.from(list.querySelectorAll("li"), (item) => item.textContent?.trim() ?? "");
}

function normalizedListing(data: unknown) {
  return rowToBusiness({
    id: "service-fixture",
    slug: "service-fixture",
    name: "Test business",
    area: "thamel",
    category: "spas",
    data,
  });
}

describe("website-preview service details", () => {
  it("renders only the service names explicitly recorded for this business", () => {
    const items = serviceItems(previewMarkup([
      { name: "Recorded test service alpha" },
      { name: "Recorded test service beta" },
    ]));

    expect(items).toEqual([
      "Recorded test service alpha",
      "Recorded test service beta",
    ]);
  });

  it("uses the existing add-details placeholder instead of inventing services", () => {
    const items = serviceItems(previewMarkup([]));

    expect(items).toHaveLength(1);
    expect([dict.en.pvAddThis, dict.ne.pvAddThis]).toContain(items[0]);
  });
});

describe("published service data normalization", () => {
  it("trims explicit service fields and strips unrecognised metadata", () => {
    const listing = normalizedListing({
      services: [{
        name: "  Recorded service  ",
        price: " NPR 500 ",
        internalNote: "must not reach the preview",
      }],
    });

    expect(listing.services).toEqual([
      { name: "Recorded service", price: "NPR 500" },
    ]);
  });

  it("uses an empty service list when service data is absent or invalid", () => {
    expect(normalizedListing({}).services).toEqual([]);
    expect(normalizedListing({ services: [{ name: "   " }] }).services).toEqual([]);
  });
});
