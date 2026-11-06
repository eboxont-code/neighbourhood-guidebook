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

function baseBusiness() {
  const business = getBusiness("aavaran-durbar-marg");
  if (!business) throw new Error("Missing phone test business");
  return business;
}

function callAction(document: Document) {
  return document.querySelector<HTMLAnchorElement>('#contact a[href^="tel:"]');
}

function phoneFact(document: Document) {
  return document.querySelectorAll("dl dd").item(2)?.textContent?.trim();
}

describe("website preview phone trust", () => {
  it("does not show a phone number or call action when only an unlinked source note exists", () => {
    const business = baseBusiness();
    expect(business.phone).toBeTruthy();
    expect(business.sourceNotes).toBe("Their own website");
    expect(business.sourceUrl).toBeUndefined();

    const document = renderPreview(business);
    expect(callAction(document)).toBeNull();
    expect(phoneFact(document)).toBe(dict.en.pvAddThis);
  });

  it("shows a call action for a phone with checked official-website evidence", () => {
    const business = baseBusiness();
    const checked: Business = {
      ...business,
      sourceUrl: "https://www.aavaranskin.com/contact",
    };

    const document = renderPreview(checked);
    const action = callAction(document);
    expect(action).not.toBeNull();
    expect(action?.getAttribute("href")).toMatch(/^tel:/);
    expect(action?.textContent).toContain(business.phone);
    expect(phoneFact(document)).toBe(business.phone);
  });

  it("shows a call action for explicitly sourced official-social phone evidence", () => {
    const business = baseBusiness();
    const checked: Business = {
      ...business,
      fieldSources: {
        phone: {
          tier: "official_social",
          url: "https://www.instagram.com/aavaranclinic/",
          checked: "2026-10-11",
        },
      },
    };

    const document = renderPreview(checked);
    expect(callAction(document)?.getAttribute("href")).toMatch(/^tel:/);
    expect(phoneFact(document)).toBe(business.phone);
  });

  it.each([
    {
      label: "a third-party directory source",
      sourceUrl: "https://www.yellowpagesnepal.com/aavaran",
    },
    {
      label: "a map listing source",
      sourceUrl: "https://www.google.com/maps/place/aavaran",
    },
  ])("does not show a call action for $label", ({ sourceUrl }) => {
    const business = { ...baseBusiness(), sourceUrl };
    const document = renderPreview(business);

    expect(callAction(document)).toBeNull();
    expect(phoneFact(document)).toBe(dict.en.pvAddThis);
  });

  it.each([
    {
      label: "a missing source URL",
      source: { tier: "website" as const, checked: "2026-10-11" },
    },
    {
      label: "a missing field check date",
      source: { tier: "website" as const, url: "https://www.aavaranskin.com/contact" },
    },
    {
      label: "a future field check date",
      source: {
        tier: "website" as const,
        url: "https://www.aavaranskin.com/contact",
        checked: "2999-12-31",
      },
    },
    {
      label: "an invalid field check date",
      source: {
        tier: "website" as const,
        url: "https://www.aavaranskin.com/contact",
        checked: "2026-02-30",
      },
    },
    {
      label: "a user-submitted phone",
      source: {
        tier: "user_submission" as const,
        url: "https://www.aavaranskin.com/contact",
        checked: "2026-10-11",
      },
    },
    {
      label: "a third-party source",
      source: {
        tier: "third_party" as const,
        url: "https://www.yellowpagesnepal.com/aavaran",
        checked: "2026-10-11",
      },
    },
  ])("does not show a call action for $label", ({ source }) => {
    const business: Business = {
      ...baseBusiness(),
      fieldSources: { phone: source },
    };
    const document = renderPreview(business);

    expect(callAction(document)).toBeNull();
    expect(phoneFact(document)).toBe(dict.en.pvAddThis);
  });

  it("does not show a call action when the phone number is missing", () => {
    const business: Business = { ...baseBusiness() };
    delete business.phone;
    const document = renderPreview(business);

    expect(callAction(document)).toBeNull();
    expect(phoneFact(document)).toBe(dict.en.pvAddThis);
  });
});
