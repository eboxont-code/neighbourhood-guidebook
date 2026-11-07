import { createElement, type ReactNode } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { getBusiness, type Business } from "@/data/directory";
import { dict } from "@/lib/i18n";
import { track } from "@/lib/track";
import { Route } from "@/routes/s.$slug_.website-preview";

vi.mock("@/lib/track", () => ({ track: vi.fn() }));

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

function previewBusiness(
  sourceSlug: string,
  slug: string,
  marker: "ALPHA_ONLY" | "BETA_ONLY",
): Business {
  const source = getBusiness(sourceSlug);
  if (!source) throw new Error(`Missing source listing: ${sourceSlug}`);

  const isAlpha = marker === "ALPHA_ONLY";
  const handle = isAlpha ? "alpha_only_profile" : "beta_only_profile";

  return {
    ...source,
    slug,
    name: `${marker} BUSINESS`,
    area: isAlpha ? "lazimpat" : "durbar-marg",
    category: isAlpha ? "spas" : "clinics",
    address: `${marker}_ADDRESS`,
    phone: isAlpha ? "9800000001" : "9800000002",
    whatsapp: isAlpha ? "9800000001" : "9800000002",
    description: `${marker}_DESCRIPTION`,
    services: [{ name: `${marker}_SERVICE` }],
    hours: [{ days: "Every day", time: isAlpha ? "08:00–09:00" : "17:00–18:00" }],
    hoursSource: `${marker}_HOURS_SOURCE`,
    hoursVerified: false,
    social: [`Instagram ${handle}`],
    directions: `https://maps.example.test/${handle}`,
    cover: {
      url: `https://images.example.test/${handle}.jpg`,
      credit: `${marker}_PHOTO_CREDIT`,
    },
  };
}

describe("shared website-preview slug isolation", () => {
  it("replaces all business-specific content and resets preview image state when the slug changes", async () => {
    const alpha = previewBusiness("nuad-thai-lazimpat", "preview-alpha", "ALPHA_ONLY");
    const beta = previewBusiness("aavaran-durbar-marg", "preview-beta", "BETA_ONLY");
    const component = Route.options.component;
    if (!component) throw new Error("Missing website-preview component");

    const loader = vi.spyOn(Route, "useLoaderData").mockReturnValue({ business: alpha });
    const { container, rerender, unmount } = render(createElement(component));

    try {
      expect(screen.getByRole("heading", { level: 1, name: alpha.name })).toBeInTheDocument();
      expect(container.textContent).toContain(alpha.address);
      expect(container.textContent).toContain(alpha.description);
      expect(container.textContent).toContain(alpha.services[0]?.name);
      expect(container.querySelector(`a[href="${alpha.directions}"]`)).toBeInTheDocument();
      expect(container.querySelector('a[href*="alpha_only_profile"]')).toBeInTheDocument();
      expect(container.querySelector(`a[href="/s/${alpha.slug}"]`)).toBeInTheDocument();
      expect(track).toHaveBeenCalledWith("preview_view", { slug: alpha.slug });

      const alphaImage = container.querySelector(`img[src="${alpha.cover?.url}"]`);
      expect(alphaImage).toBeInTheDocument();
      fireEvent.error(alphaImage!);
      await waitFor(() => {
        expect(container.querySelector(`img[src="${alpha.cover?.url}"]`)).not.toBeInTheDocument();
      });

      loader.mockReturnValue({ business: beta });
      rerender(createElement(component));

      await waitFor(() => {
        expect(screen.getByRole("heading", { level: 1, name: beta.name })).toBeInTheDocument();
        expect(container.querySelector(`img[src="${beta.cover?.url}"]`)).toBeInTheDocument();
      });

      expect(container.textContent).toContain(beta.address);
      expect(container.textContent).toContain(beta.description);
      expect(container.textContent).toContain(beta.services[0]?.name);
      expect(container.textContent).toContain(beta.phone);
      expect(container.textContent).toContain(beta.cover?.credit);
      expect(container.textContent).not.toContain("ALPHA_ONLY");
      expect(container.querySelector(`a[href="${beta.directions}"]`)).toBeInTheDocument();
      expect(container.querySelector('a[href*="beta_only_profile"]')).toBeInTheDocument();
      expect(container.querySelector(`a[href="/s/${beta.slug}"]`)).toBeInTheDocument();
      expect(container.querySelector(`img[src="${alpha.cover?.url}"]`)).not.toBeInTheDocument();
      expect(container.querySelector('a[href="https://www.instagram.com/alpha_only_profile"]')).not.toBeInTheDocument();
      expect(container.querySelector(`a[href="${alpha.directions}"]`)).not.toBeInTheDocument();

      const ownerCta = screen.getByRole("link", { name: dict.en.pvBarCta });
      expect(ownerCta.getAttribute("href")).toContain(`listing=${beta.slug}`);
      expect(ownerCta.getAttribute("href")).toContain(`business=${encodeURIComponent(beta.name)}`);
      expect(screen.getByRole("link", { name: dict.en.pvBackListing })).toHaveAttribute("href", `/s/${beta.slug}`);
      expect(track).toHaveBeenLastCalledWith("preview_view", { slug: beta.slug });
    } finally {
      unmount();
      loader.mockRestore();
    }
  });
});
