import { createElement, type ReactNode } from "react";
import { cleanup, render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const { trackMock } = vi.hoisted(() => ({ trackMock: vi.fn() }));
vi.mock("@/lib/track", () => ({ track: trackMock }));
vi.mock("@tanstack/react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@tanstack/react-router")>();
  return {
    ...actual,
    Link: ({ to, children, params: _params, search: _search, ...props }: {
      to: string;
      children?: ReactNode;
      params?: Record<string, string>;
      search?: Record<string, string>;
    }) => <a href={to} {...props}>{children}</a>,
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
});
