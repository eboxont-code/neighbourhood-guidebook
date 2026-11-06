import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { getBusiness, type Business } from "@/data/directory";
import { dict } from "@/lib/i18n";
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

describe("website preview hours trust", () => {
  it("shows sourced but unverified hours with a warning and no open/closed status", () => {
    const business = getBusiness("tranquility-spa");
    if (!business) throw new Error("Missing test business");
    expect(business.hoursVerified).toBe(false);
    const document = renderPreview(business);

    expect(document.querySelector("header h1 + p")?.textContent?.trim()).toBe("");
    expect(document.querySelector("dl dd")?.textContent).not.toBe(dict.en.pvAddThis);
    const hours = document.querySelector("#hours")?.textContent ?? "";
    expect(hours).toContain(dict.en.hoursUnverified);
    expect(hours).toContain(business.hoursSource);
  });

  it("shows a live status only for verified hours with a recorded source", () => {
    const business = getBusiness("nuad-thai-lazimpat");
    if (!business) throw new Error("Missing test business");
    expect(business.hoursVerified).toBe(true);
    const document = renderPreview(business);

    expect(document.querySelector("header h1 + p")?.textContent).toContain("Open now");
    expect(document.querySelector("dl dd")?.textContent).not.toBe(dict.en.pvAddThis);
  });

  it("does not display hours when the listing has no recorded source", () => {
    const sourceListing = getBusiness("tranquility-spa");
    if (!sourceListing) throw new Error("Missing test business");
    const business: Business = { ...sourceListing, hoursSource: undefined, hoursVerified: false };
    const document = renderPreview(business);

    expect(document.querySelector("header h1 + p")?.textContent?.trim()).toBe("");
    expect(document.querySelector("dl dd")?.textContent).toBe(dict.en.pvAddThis);
    const hours = document.querySelector("#hours")?.textContent ?? "";
    expect(hours).toContain(dict.en.pvAddThis);
    expect(hours).not.toMatch(/\b8:00\b/);
  });
});
