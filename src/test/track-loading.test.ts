import { beforeEach, describe, expect, it, vi } from "vitest";

const { insert, clientLoaded } = vi.hoisted(() => ({
  insert: vi.fn().mockResolvedValue({ error: null }),
  clientLoaded: vi.fn(),
}));

vi.mock("@/integrations/supabase/client", () => {
  clientLoaded();
  return { supabase: { from: () => ({ insert }) } };
});

describe("on-demand anonymous analytics", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    localStorage.clear();
    history.replaceState({}, "", "/");
    Object.defineProperty(navigator, "doNotTrack", { configurable: true, value: "0" });
  });

  it("does not load the client just for browsing or a Do Not Track event", async () => {
    const { track } = await import("@/lib/track");
    expect(clientLoaded).not.toHaveBeenCalled();
    Object.defineProperty(navigator, "doNotTrack", { configurable: true, value: "1" });
    track("save", { slug: "aavaran-durbar-marg" });
    await Promise.resolve();
    expect(clientLoaded).not.toHaveBeenCalled();
    expect(insert).not.toHaveBeenCalled();
  });

  it("retains the event's page and language while the client loads", async () => {
    const { track } = await import("@/lib/track");
    history.replaceState({}, "", "/search?q=spa");
    localStorage.setItem("dir-lang", "ne");
    track("search", { query: "  SPA  " });
    history.replaceState({}, "", "/about");
    localStorage.setItem("dir-lang", "en");
    await vi.waitFor(() => expect(insert).toHaveBeenCalledTimes(1));
    expect(insert).toHaveBeenCalledWith({
      event: "search", listing_slug: null, query: "spa", lang: "ne", path: "/search",
    });
  });

  it("does not propagate a failed event insert to the page", async () => {
    insert.mockRejectedValueOnce(new Error("SEWA event unavailable"));
    const { track } = await import("@/lib/track");
    expect(() => track("save", { slug: "aavaran-durbar-marg" })).not.toThrow();
    await vi.waitFor(() => expect(insert).toHaveBeenCalledTimes(1));
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
});