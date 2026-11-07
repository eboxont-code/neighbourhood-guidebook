import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { trackMock, fromMock, insertMock } = vi.hoisted(() => ({
  trackMock: vi.fn(),
  fromMock: vi.fn(),
  insertMock: vi.fn(),
}));

vi.mock("@/lib/track", () => ({ track: trackMock }));
vi.mock("@/integrations/supabase/client", () => ({ supabase: { from: fromMock } }));
vi.mock("@/lib/i18n", () => ({ useI18n: () => ({ t: (key: string) => key, lang: "en" }) }));

import { ClaimForm } from "@/components/claim-form";
import { businesses } from "@/data/directory";

const listingSlug = businesses[0]?.slug;
if (!listingSlug) throw new Error("Expected a directory listing for claim analytics tests");

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

beforeEach(() => {
  fromMock.mockReturnValue({ insert: insertMock });
  insertMock.mockResolvedValue({ error: null });
});

function fillValidFields(container: HTMLElement) {
  const name = container.querySelector<HTMLInputElement>("#claim-name");
  const role = container.querySelector<HTMLSelectElement>("#claim-role");
  const contact = container.querySelector<HTMLInputElement>("#claim-contact");
  const proof = container.querySelector<HTMLInputElement>("#claim-proof_url");
  if (!name || !role || !contact || !proof) throw new Error("Expected required claim fields");
  fireEvent.change(name, { target: { value: "Sam" } });
  fireEvent.change(role, { target: { value: "owner" } });
  fireEvent.change(contact, { target: { value: "sam@example.com" } });
  fireEvent.change(proof, { target: { value: "https://example.com/owner-proof" } });
}

describe("business claim analytics", () => {
  it("records one anonymous start on the first interaction with a selected business", () => {
    const { container } = render(<ClaimForm listing={listingSlug} />);
    const name = container.querySelector<HTMLInputElement>("#claim-name");
    const contact = container.querySelector<HTMLInputElement>("#claim-contact");
    if (!name || !contact) throw new Error("Expected claim form fields");

    fireEvent.focus(name);
    fireEvent.focus(contact);

    expect(trackMock).toHaveBeenCalledTimes(1);
    expect(trackMock).toHaveBeenCalledWith("claim_start", { slug: listingSlug });
    expect(trackMock).not.toHaveBeenCalledWith("claim_submit", expect.anything());
  });

  it("waits for a successful business_claims insert before recording claim_submit", async () => {
    let resolveInsert: ((value: { error: null }) => void) | undefined;
    insertMock.mockReturnValueOnce(new Promise<{ error: null }>((resolve) => { resolveInsert = resolve; }));
    const { container } = render(<ClaimForm listing={listingSlug} />);
    fillValidFields(container);
    const form = container.querySelector("form");
    if (!form) throw new Error("Expected claim form");

    fireEvent.submit(form);
    await waitFor(() => expect(insertMock).toHaveBeenCalledTimes(1));
    expect(trackMock.mock.calls).toEqual([["claim_start", { slug: listingSlug }]]);

    if (!resolveInsert) throw new Error("Expected pending claim insert resolver");
    resolveInsert({ error: null });
    await waitFor(() => expect(trackMock).toHaveBeenCalledWith("claim_submit", { slug: listingSlug }));
    expect(trackMock.mock.calls).toEqual([
      ["claim_start", { slug: listingSlug }],
      ["claim_submit", { slug: listingSlug }],
    ]);
  });

  it("does not record claim_submit when the database insert fails", async () => {
    insertMock.mockResolvedValueOnce({ error: { message: "offline" } });
    const { container, findByRole } = render(<ClaimForm listing={listingSlug} />);
    fillValidFields(container);
    const form = container.querySelector("form");
    if (!form) throw new Error("Expected claim form");

    fireEvent.submit(form);
    await findByRole("alert");
    expect(trackMock.mock.calls).toEqual([["claim_start", { slug: listingSlug }]]);
    expect(trackMock).not.toHaveBeenCalledWith("claim_submit", expect.anything());
  });

  it("counts an invalid attempt as a start but never as a successful claim", () => {
    const { container } = render(<ClaimForm listing={listingSlug} />);
    const form = container.querySelector("form");
    if (!form) throw new Error("Expected claim form");

    fireEvent.submit(form);

    expect(trackMock).toHaveBeenCalledTimes(1);
    expect(trackMock).toHaveBeenCalledWith("claim_start", { slug: listingSlug });
    expect(trackMock).not.toHaveBeenCalledWith("claim_submit", expect.anything());
    expect(insertMock).not.toHaveBeenCalled();
  });

  it("waits until a business is selected before attributing a generic claim form start", () => {
    const { container } = render(<ClaimForm listing="" />);
    const search = container.querySelector<HTMLInputElement>("#claim-search");
    const select = container.querySelector<HTMLSelectElement>("#claim-listing_slug");
    if (!search || !select) throw new Error("Expected generic claim listing selector");

    fireEvent.focus(search);
    expect(trackMock).not.toHaveBeenCalled();
    fireEvent.change(select, { target: { value: listingSlug } });

    expect(trackMock).toHaveBeenCalledTimes(1);
    expect(trackMock).toHaveBeenCalledWith("claim_start", { slug: listingSlug });
  });
});
