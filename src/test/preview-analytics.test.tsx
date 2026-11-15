import { createElement, type MouseEventHandler, type ReactNode } from "react";
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const { trackMock } = vi.hoisted(() => ({ trackMock: vi.fn() }));
vi.mock("@/lib/track", () => ({ track: trackMock }));
vi.mock("@tanstack/react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@tanstack/react-router")>();
  return {
    ...actual,
    Link: ({ to, children, params: _params, search: _search, onClick, ...props }: {
      to: string;
      children?: ReactNode;
      params?: Record<string, string>;
      search?: Record<string, string>;
      onClick?: MouseEventHandler<HTMLAnchorElement>;
    }) => <a href={to} {...props} onClick={(event) => { event.preventDefault(); onClick?.(event); }}>{children}</a>,
  };
});
vi.mock("@/components/site", () => ({ NotFoundView: () => null, useNow: () => null }));
vi.mock("@/components/map-view", () => ({ MapView: () => null }));

import { businesses } from "@/data/directory";
import { Route } from "@/routes/s.$slug_.website-preview";
import { previewExamples } from "@/lib/preview";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("website preview analytics", () => {
  it("records one preview_view per business slug without duplicating on rerender", async () => {
    const [first, second] = previewExamples(businesses);
    if (!first || !second) throw new Error("Expected two eligible preview listings");

    const component = Route.options.component;
    if (!component) throw new Error("Missing website preview page component");

    const loader = vi.spyOn(Route, "useLoaderData").mockReturnValue({ business: first });
    try {
      const view = render(createElement(component));

      await waitFor(() => expect(trackMock).toHaveBeenCalledTimes(1));
      expect(trackMock).toHaveBeenNthCalledWith(1, "preview_view", { slug: first.slug });

      view.rerender(createElement(component));
      expect(trackMock).toHaveBeenCalledTimes(1);

      loader.mockReturnValue({ business: second });
      view.rerender(createElement(component));

      await waitFor(() => expect(trackMock).toHaveBeenCalledTimes(2));
      expect(trackMock).toHaveBeenNthCalledWith(2, "preview_view", { slug: second.slug });
    } finally {
      loader.mockRestore();
    }
  });

  it("tracks one primary enquiry CTA click with only the business slug", async () => {
    const [business] = previewExamples(businesses);
    if (!business) throw new Error("Expected an eligible preview listing");

    const component = Route.options.component;
    if (!component) throw new Error("Missing website preview page component");

    const loader = vi.spyOn(Route, "useLoaderData").mockReturnValue({ business });
    try {
      const view = render(createElement(component));

      await waitFor(() => expect(trackMock).toHaveBeenCalledWith("preview_view", { slug: business.slug }));
      trackMock.mockClear();

      const cta = view.container.querySelector(".pv-bar a");
      if (!cta) throw new Error("Missing primary preview enquiry CTA");
      fireEvent.click(cta);

      expect(trackMock).toHaveBeenCalledTimes(1);
      expect(trackMock).toHaveBeenCalledWith("preview_enquiry_click", { slug: business.slug });
      expect(trackMock.mock.calls[0]).toEqual(["preview_enquiry_click", { slug: business.slug }]);
    } finally {
      loader.mockRestore();
    }
  });
});
