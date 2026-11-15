import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { getBusiness } from "@/data/directory";
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

function renderPreview(slug: string) {
  const business = getBusiness(slug);
  if (!business) throw new Error(`Missing test business: ${slug}`);
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

describe("website preview business-name binding", () => {
  it.each(["nuad-thai-lazimpat", "deezy-cuts-baluwatar"])(
    "renders the listing name for %s in the hero, navigation and footer",
    (slug) => {
      const business = getBusiness(slug);
      if (!business) throw new Error(`Missing test business: ${slug}`);
      const document = renderPreview(slug);

      expect(document.querySelector("header h1")?.textContent).toBe(business.name);
      expect(document.querySelector("header nav .truncate")?.textContent).toBe(business.name);
      expect(document.querySelector("footer p.font-semibold")?.textContent).toBe(business.name);
    },
  );
});
