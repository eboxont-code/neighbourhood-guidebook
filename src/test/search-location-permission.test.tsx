import { createElement, type ReactNode } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const { requestLocationMock } = vi.hoisted(() => ({
  requestLocationMock: vi.fn(),
}));

vi.mock("@/lib/geo", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/geo")>();
  return {
    ...actual,
    requestLocation: requestLocationMock,
    useLocation: () => ({ state: { status: "idle" }, dismissed: false, here: null }),
  };
});

vi.mock("@/lib/i18n", () => ({
  useI18n: () => ({ lang: "en", setLang: vi.fn(), t: (key: string) => key }),
}));

vi.mock("@tanstack/react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@tanstack/react-router")>();
  return {
    ...actual,
    Link: ({
      to,
      children,
      className,
    }: {
      to: string;
      children?: ReactNode;
      className?: string;
      params?: unknown;
      search?: unknown;
    }) => (
      <a href={to} className={className}>
        {children}
      </a>
    ),
    useNavigate: () => vi.fn(),
  };
});

vi.mock("@/components/site", () => ({
  EmptyState: ({ title, body, action }: { title: string; body: string; action?: ReactNode }) => (
    <div>
      {title}
      {body}
      {action}
    </div>
  ),
  Page: ({ children }: { children: ReactNode }) => <main>{children}</main>,
  SearchBox: () => null,
  pageMeta: () => ({ meta: [] }),
  useNow: () => new Date("2026-11-10T00:00:00.000Z"),
}));

vi.mock("@/components/blocks", () => ({
  RowList: ({ items }: { items: { id: string; name: string }[] }) => (
    <ul>
      {items.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  ),
  SectionHead: ({ title }: { title: string }) => <h2>{title}</h2>,
}));

vi.mock("@/components/map-view", () => ({ FullMap: () => null }));
vi.mock("@/lib/track", () => ({ track: vi.fn() }));

import { SearchCard } from "@/components/search-card";
import { getCity, resolveSection } from "@/data/directory";
import { Route as CategoryRoute } from "@/routes/$city.$section";
import { Route as SearchRoute } from "@/routes/search";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("search location permission", () => {
  it("does not request location when a shared URL already has the near filter", () => {
    const component = SearchRoute.options.component;
    if (!component) throw new Error("Missing search page component");

    const search = vi.spyOn(SearchRoute, "useSearch").mockReturnValue({ q: "", near: true });
    try {
      render(createElement(component));

      expect(screen.getByRole("button", { name: "locUse" })).toBeInTheDocument();
      expect(requestLocationMock).not.toHaveBeenCalled();

      fireEvent.click(screen.getByRole("button", { name: "locUse" }));
      expect(requestLocationMock).toHaveBeenCalledTimes(1);
    } finally {
      search.mockRestore();
    }
  });

  it("requests location after the visitor selects Current location", () => {
    render(<SearchCard />);

    fireEvent.change(screen.getByLabelText("fWhere"), { target: { value: "near" } });

    expect(requestLocationMock).toHaveBeenCalledTimes(1);
  });
});

describe("category location permission", () => {
  function categoryRoute() {
    const component = CategoryRoute.options.component;
    const city = getCity("kathmandu");
    const sec = city ? resolveSection(city.slug, "cafes") : null;
    if (!component || !city || !sec || sec.kind !== "category") {
      throw new Error("Missing Kathmandu cafe category route fixture");
    }
    return { component, loaderData: { city, sec } };
  }

  it("does not request location when a shared category URL already has near sorting", () => {
    const { component, loaderData } = categoryRoute();
    const loader = vi.spyOn(CategoryRoute, "useLoaderData").mockReturnValue(loaderData);
    const search = vi.spyOn(CategoryRoute, "useSearch").mockReturnValue({ sort: "near" });
    try {
      render(createElement(component));

      expect(screen.getByRole("button", { name: "locUse" })).toBeInTheDocument();
      expect(requestLocationMock).not.toHaveBeenCalled();

      fireEvent.click(screen.getByRole("button", { name: "locUse" }));
      expect(requestLocationMock).toHaveBeenCalledTimes(1);
    } finally {
      loader.mockRestore();
      search.mockRestore();
    }
  });

  it("requests location after the visitor chooses nearby sorting", () => {
    const { component, loaderData } = categoryRoute();
    const loader = vi.spyOn(CategoryRoute, "useLoaderData").mockReturnValue(loaderData);
    const search = vi.spyOn(CategoryRoute, "useSearch").mockReturnValue({});
    try {
      render(createElement(component));

      fireEvent.change(screen.getByLabelText("sortLabel"), { target: { value: "near" } });

      expect(requestLocationMock).toHaveBeenCalledTimes(1);
    } finally {
      loader.mockRestore();
      search.mockRestore();
    }
  });
});
