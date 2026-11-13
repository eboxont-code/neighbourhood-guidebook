import { createElement, type ComponentType } from "react";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const authMocks = vi.hoisted(() => {
  const listeners = new Set<(event: string, session: unknown) => void>();
  return {
    listeners,
    onAuthStateChange: vi.fn((listener: (event: string, session: unknown) => void) => {
      listeners.add(listener);
      return { data: { subscription: { unsubscribe: () => listeners.delete(listener) } } };
    }),
    getSession: vi.fn(),
    signOut: vi.fn(),
    rpc: vi.fn(),
    from: vi.fn(),
    emit: (event: string, session: unknown) => {
      for (const listener of [...listeners]) listener(event, session);
    },
  };
});

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      onAuthStateChange: authMocks.onAuthStateChange,
      getSession: authMocks.getSession,
      signOut: authMocks.signOut,
    },
    rpc: authMocks.rpc,
    from: authMocks.from,
  },
}));
vi.mock("@/lib/i18n", () => ({
  useI18n: () => ({ t: (key: string) => key, lang: "en" }),
}));
vi.mock("@/lib/listings.functions", () => ({ rowToBusiness: (row: unknown) => row }));
vi.mock("@/lib/listings", () => ({ expireListings: vi.fn() }));
vi.mock("@/components/admin-claims", () => ({ AdminClaims: () => null }));
vi.mock("@/components/admin-insights", () => ({ AdminInsights: () => null }));
vi.mock("@/components/admin-promotions", () => ({ AdminPromotions: () => null }));

import { Route } from "@/routes/admin";

const AdminPage = (Route as unknown as { options: { component: ComponentType } }).options.component;
const adminSession = {
  user: { id: "admin-test-user", email: "admin@example.test" },
  access_token: "synthetic-access-token",
  refresh_token: "synthetic-refresh-token",
};

function listingQuery() {
  const result = Promise.resolve({ data: [] as unknown[], error: null });
  type Query = {
    select: (...args: unknown[]) => Query;
    order: (...args: unknown[]) => Query;
    then: typeof result.then;
  };
  let query: Query;
  query = {
    select: (..._args: unknown[]) => query,
    order: (..._args: unknown[]) => query,
    then: result.then.bind(result),
  };
  return query;
}

function countQuery() {
  const result = Promise.resolve({ count: 0, error: null });
  type Query = {
    select: (...args: unknown[]) => Query;
    eq: (...args: unknown[]) => typeof result;
  };
  let query: Query;
  query = {
    select: (..._args: unknown[]) => query,
    eq: (..._args: unknown[]) => result,
  };
  return query;
}

beforeEach(() => {
  authMocks.listeners.clear();
  vi.clearAllMocks();
  authMocks.getSession.mockReset();
  authMocks.signOut.mockReset();
  authMocks.rpc.mockReset();
  authMocks.from.mockReset();

  authMocks.getSession.mockResolvedValue({ data: { session: adminSession }, error: null });
  authMocks.rpc.mockResolvedValue({ data: true, error: null });
  authMocks.from.mockImplementation((table: string) =>
    table === "listings" ? listingQuery() : countQuery(),
  );
  authMocks.signOut.mockImplementation(async () => {
    authMocks.emit("SIGNED_OUT", null);
    return { error: null };
  });
});

afterEach(() => cleanup());

describe("admin session expiry and logout", () => {
  it("does not restore a stale session when the initial session read finishes after sign-out", async () => {
    let resolveInitialSession!: (value: { data: { session: typeof adminSession | null }; error: null }) => void;
    authMocks.getSession.mockImplementation(
      () => new Promise((resolve) => { resolveInitialSession = resolve; }),
    );

    render(createElement(AdminPage));
    await waitFor(() => expect(authMocks.onAuthStateChange).toHaveBeenCalledTimes(1));

    act(() => authMocks.emit("SIGNED_OUT", null));
    expect(await screen.findByRole("heading", { name: "adSignInTitle" })).toBeInTheDocument();

    await act(async () => {
      resolveInitialSession({ data: { session: adminSession }, error: null });
    });

    expect(screen.getByRole("heading", { name: "adSignInTitle" })).toBeInTheDocument();
    expect(screen.queryByRole("tab", { name: "adTabListings" })).not.toBeInTheDocument();
  });

  it("removes the admin dashboard when Supabase reports an expired or revoked session", async () => {
    render(createElement(AdminPage));
    expect(await screen.findByRole("tab", { name: "adTabListings" })).toBeInTheDocument();

    act(() => authMocks.emit("SIGNED_OUT", null));

    expect(await screen.findByRole("heading", { name: "adSignInTitle" })).toBeInTheDocument();
    expect(screen.queryByRole("tab", { name: "adTabListings" })).not.toBeInTheDocument();
  });

  it("returns to sign-in after the administrator chooses Sign out", async () => {
    render(createElement(AdminPage));
    const signOut = await screen.findByRole("button", { name: "adSignOut" });

    fireEvent.click(signOut);

    expect(authMocks.signOut).toHaveBeenCalledTimes(1);
    expect(await screen.findByRole("heading", { name: "adSignInTitle" })).toBeInTheDocument();
    expect(screen.queryByRole("tab", { name: "adTabListings" })).not.toBeInTheDocument();
  });

  it("fails closed when the initial session cannot be read", async () => {
    authMocks.getSession.mockRejectedValue(new Error("synthetic storage failure"));

    render(createElement(AdminPage));

    expect(await screen.findByRole("heading", { name: "adSignInTitle" })).toBeInTheDocument();
    expect(screen.queryByText("adLoading")).not.toBeInTheDocument();
  });
  it("fails closed when the initial session read returns an error", async () => {
    authMocks.getSession.mockResolvedValue({
      data: { session: adminSession },
      error: new Error("synthetic session error"),
    });

    render(createElement(AdminPage));

    expect(await screen.findByRole("heading", { name: "adSignInTitle" })).toBeInTheDocument();
    expect(screen.queryByRole("tab", { name: "adTabListings" })).not.toBeInTheDocument();
  });


  it("leaves password-recovery mode when Supabase reports sign-out", async () => {
    render(createElement(AdminPage));
    await screen.findByRole("tab", { name: "adTabListings" });

    act(() => authMocks.emit("PASSWORD_RECOVERY", adminSession));
    expect(await screen.findByRole("heading", { name: "adResetTitle" })).toBeInTheDocument();

    act(() => authMocks.emit("SIGNED_OUT", null));

    expect(await screen.findByRole("heading", { name: "adSignInTitle" })).toBeInTheDocument();
  });
});
