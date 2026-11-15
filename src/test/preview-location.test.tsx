import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getBusiness, mapsLink, type Business } from "@/data/directory";
import { dict } from "@/lib/i18n";
import { Route as PreviewRoute } from "@/routes/s.$slug_.website-preview";

const mapMocks = vi.hoisted(() => ({
  MapView: vi.fn(() => null),
}));

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
      for (const [key, value] of Object.entries(params ?? {})) href = href.replace(`$${key}`, value);
      if (search) href += `?${new URLSearchParams(search).toString()}`;
      return <a href={href} {...props}>{children}</a>;
    },
  };
});

vi.mock("@/components/site", () => ({
  NotFoundView: () => null,
  useNow: () => new Date("2026-10-28T12:00:00+05:45"),
}));
vi.mock("@/components/map-view", () => ({ MapView: mapMocks.MapView }));
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

function renderPreview(business: Business) {
  const component = PreviewRoute.options.component;
  if (!component) throw new Error("Missing website-preview component");
  const loader = vi.spyOn(PreviewRoute, "useLoaderData").mockReturnValue({ business });
  try {
    return new DOMParser().parseFromString(
      renderToStaticMarkup(createElement(component)),
      "text/html",
    );
  } finally {
    loader.mockRestore();
  }
}


function quickFactAddress(document: Document) {
  return document.querySelectorAll("dl dd").item(1)?.textContent?.trim();
}

function visitAddress(document: Document) {
  return document.querySelector("#visit p span")?.textContent?.trim();
}

function directionsHref(document: Document) {
  return document.querySelector<HTMLAnchorElement>("#visit a")?.getAttribute("href");
}

describe("website preview location accuracy", () => {
  beforeEach(() => mapMocks.MapView.mockClear());

  it("renders an exact recorded address verbatim and uses it for the address fallback link", () => {
    const business = getBusiness("aavaran-durbar-marg");
    if (!business) throw new Error("Missing exact-address test business");
    expect(business.address).toBe("Durbar Marg, next to ANTA showroom, Kathmandu");

    const recorded = renderPreview(business);
    expect(quickFactAddress(recorded)).toBe(business.address);
    expect(visitAddress(recorded)).toBe(business.address);
    expect(directionsHref(recorded)).toBe(business.directions);

    const addressFallback: Business = { ...business };
    delete addressFallback.directions;
    const fallback = renderPreview(addressFallback);
    expect(directionsHref(fallback)).toBe(mapsLink(`${business.name}, ${business.address}`));
  });

  it("keeps a recorded street-level address eligible for directions fallback", () => {
    const business = getBusiness("filli-cafe-lazimpat");
    if (!business) throw new Error("Missing street-address test business");
    expect(business.address).toBe("Lazimpat Road, Kathmandu");

    const withoutExplicitDirections: Business = { ...business };
    delete withoutExplicitDirections.directions;
    const document = renderPreview(withoutExplicitDirections);

    expect(visitAddress(document)).toBe("Lazimpat Road, Kathmandu");
    expect(directionsHref(document)).toBe(mapsLink(business.name + ", " + business.address));
  });

  it("keeps an area-only address at its recorded level without adding street detail", () => {
    const business = getBusiness("the-new-barber-boudha");
    if (!business) throw new Error("Missing area-only address test business");
    expect(business.address).toBe("Boudha, Kathmandu");
    expect(business.lat).toBeUndefined();
    expect(business.lng).toBeUndefined();

    const document = renderPreview(business);
    expect(quickFactAddress(document)).toBe("Boudha, Kathmandu");
    expect(visitAddress(document)).toBe("Boudha, Kathmandu");
    expect(document.querySelector("#visit")?.textContent).toContain("Boudha, Kathmandu");
    expect(directionsHref(document)).toBe(business.directions);
    expect(mapMocks.MapView).not.toHaveBeenCalled();
  });

  it("does not turn an area into an address or directions link when neither is recorded", () => {
    const business = getBusiness("deezy-cuts-baluwatar");
    if (!business) throw new Error("Missing area-only test business");
    expect(business.area).toBe("baluwatar");
    expect(business.address).toBeUndefined();
    expect(business.lat).toBeUndefined();
    expect(business.lng).toBeUndefined();
    expect(business.directions).toBeTruthy();

    const recorded = renderPreview(business);
    expect(quickFactAddress(recorded)).toBe(dict.en.pvAddThis);
    expect(visitAddress(recorded)).toBe(dict.en.pvAddThis);
    expect(documentText(recorded, "#visit")).toContain("Baluwatar, Kathmandu");
    expect(directionsHref(recorded)).toBe(business.directions);
    expect(mapMocks.MapView).not.toHaveBeenCalled();

    const withoutDirections: Business = { ...business };
    delete withoutDirections.directions;
    const noDirections = renderPreview(withoutDirections);
    expect(directionsHref(noDirections)).toBeUndefined();
    expect(mapMocks.MapView).not.toHaveBeenCalled();
  });

  it("renders the map only for a listing with recorded coordinates", () => {
    const business = getBusiness("kathmandu-spa-thamel");
    if (!business) throw new Error("Missing pinned test business");
    expect(typeof business.lat).toBe("number");
    expect(typeof business.lng).toBe("number");

    renderPreview(business);
    expect(mapMocks.MapView).toHaveBeenCalledTimes(1);
  });

  it("does not create a directions link from an area-and-city-only address", () => {
    const business = getBusiness("the-new-barber-boudha");
    if (!business) throw new Error("Missing area-only address test business");

    const withoutExplicitDirections: Business = { ...business };
    delete withoutExplicitDirections.directions;
    const document = renderPreview(withoutExplicitDirections);

    expect(visitAddress(document)).toBe("Boudha, Kathmandu");
    expect(directionsHref(document)).toBeUndefined();
    expect(mapMocks.MapView).not.toHaveBeenCalled();
  });

  it.each([
    { label: "a missing latitude", lat: undefined, lng: 85.3110464 },
    { label: "a missing longitude", lat: 27.716144, lng: undefined },
    { label: "a non-finite latitude", lat: Number.NaN, lng: 85.3110464 },
    { label: "a non-finite longitude", lat: 27.716144, lng: Number.POSITIVE_INFINITY },
    { label: "a latitude above 90 degrees", lat: 90.0001, lng: 85.3110464 },
    { label: "a latitude below -90 degrees", lat: -90.0001, lng: 85.3110464 },
    { label: "a longitude above 180 degrees", lat: 27.716144, lng: 180.0001 },
    { label: "a longitude below -180 degrees", lat: 27.716144, lng: -180.0001 },
  ])("does not render a map for $label", ({ lat, lng }) => {
    const business = getBusiness("kathmandu-spa-thamel");
    if (!business) throw new Error("Missing pinned test business");

    renderPreview({ ...business, lat, lng });
    expect(mapMocks.MapView).not.toHaveBeenCalled();
  });
});

function documentText(document: Document, selector: string) {
  return document.querySelector(selector)?.textContent ?? "";
}
