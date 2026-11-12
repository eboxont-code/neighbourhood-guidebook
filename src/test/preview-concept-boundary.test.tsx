import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { getBusiness } from "@/data/directory";
import { dict } from "@/lib/i18n";
import { Route as PreviewRoute } from "@/routes/s.$slug_.website-preview";

const language = vi.hoisted(() => ({ current: "en" as "en" | "ne" }));

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
      lang: language.current,
      t: (key: string) => actual.dict[language.current][key as keyof typeof actual.dict.en] ?? key,
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

describe("preview concept versus launched website", () => {
  it("explains the launch boundary in English and Nepali business-page copy", () => {
    expect(dict.en.fbOwnerIntro).toContain("not a live website");
    expect(dict.en.fbOwnerIntro).toContain("separate project");
    expect(dict.en.fbExBody).toContain("not a live website");
    expect(dict.en.fbExBody).toContain("separate project");
    expect(dict.ne.fbOwnerIntro).toContain("लाइभ वेबसाइट होइन");
    expect(dict.ne.fbOwnerIntro).toContain("छुट्टै परियोजना");
    expect(dict.ne.fbExBody).toContain("लाइभ वेबसाइट होइन");
    expect(dict.ne.fbExBody).toContain("छुट्टै परियोजना");
    const previewBoundaryCopy = [
      dict.en.fbOwnerIntro, dict.en.fbExBody, dict.en.pvBarNote, dict.en.pvBarNoteShort, dict.en.pvOwnerSimpleBody,
      dict.ne.fbOwnerIntro, dict.ne.fbExBody, dict.ne.pvBarNote, dict.ne.pvBarNoteShort, dict.ne.pvOwnerSimpleBody,
    ];
    expect(previewBoundaryCopy.join(" ")).not.toContain("—");
  });

  it.each(["en", "ne"] as const)("renders clear preview-only wording in %s", (lang) => {
    language.current = lang;
    const document = renderPreview("the-new-barber-durbar-marg");
    const banner = document.querySelector(".pv-bar p span:nth-child(2)")?.textContent ?? "";
    const ownerNote = document.querySelector("#owner .owner-note p")?.textContent ?? "";
    const bannerCta = document.querySelector(".pv-bar a")?.textContent ?? "";

    if (lang === "en") {
      expect(banner).toContain("not a live");
      expect(bannerCta).toContain("Ask about making this your website");
      expect(ownerNote).toContain("not published on your own domain");
      expect(ownerNote).toContain("separate project");
      expect(ownerNote).toContain("in writing");
      expect(document.querySelector("#owner h2")?.textContent).toContain("separate website project");
    } else {
      expect(banner).toContain("लाइभ वेबसाइट");
      expect(bannerCta).toContain("यसलाई आफ्नो वेबसाइट बनाउनेबारे सोध्नुहोस्");
      expect(ownerNote).toContain("तपाईंको आफ्नै डोमेनमा प्रकाशित गरिएको छैन");
      expect(ownerNote).toContain("छुट्टै परियोजना");
      expect(ownerNote).toContain("लिखित रूपमा");
      expect(document.querySelector("#owner h2")?.textContent).toContain("छुट्टै वेबसाइट परियोजना");
    }
  });
});
