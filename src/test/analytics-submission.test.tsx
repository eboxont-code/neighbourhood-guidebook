import { act, cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ClaimForm } from "@/components/claim-form";
import { ContactForm } from "@/components/forms";

const { fromMock, insertMock, trackMock } = vi.hoisted(() => {
  const insertMock = vi.fn();
  return {
    insertMock,
    fromMock: vi.fn(() => ({ insert: insertMock })),
    trackMock: vi.fn(),
  };
});

vi.mock("@/integrations/supabase/client", () => ({
  supabase: { from: fromMock },
}));
vi.mock("@/lib/track", () => ({ track: trackMock }));
vi.mock("@/lib/i18n", () => ({
  useI18n: () => ({ lang: "en", setLang: vi.fn(), t: (key: string) => key }),
}));

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((done) => { resolve = done; });
  return { promise, resolve };
}

function change(container: HTMLElement, selector: string, value: string) {
  const field = container.querySelector(selector);
  if (!field) throw new Error(`Missing test field: ${selector}`);
  fireEvent.change(field, { target: { value } });
}

function submitTwiceInOneBatch(form: HTMLFormElement) {
  act(() => {
    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
  });
}

beforeEach(() => {
  fromMock.mockClear();
  insertMock.mockReset();
  trackMock.mockReset();
});
afterEach(() => cleanup());

describe("analytics submission de-duplication", () => {
  it("writes one contact lead and emits one enquiry event for same-tick duplicate submits", async () => {
    const pending = deferred<{ error: null }>();
    insertMock.mockReturnValue(pending.promise);
    const { container } = render(
      <ContactForm business="Aavaran" listing="aavaran-durbar-marg" page="preview" />,
    );

    change(container, "#name", "Test Owner");
    change(container, "#message", "I would like a website for my business.");
    const form = container.querySelector("form");
    if (!form) throw new Error("Missing contact form");

    submitTwiceInOneBatch(form);
    expect(fromMock).toHaveBeenCalledTimes(1);
    expect(fromMock).toHaveBeenCalledWith("contact_messages");
    expect(insertMock).toHaveBeenCalledTimes(1);

    await act(async () => {
      pending.resolve({ error: null });
      await pending.promise;
    });
    await waitFor(() => expect(trackMock).toHaveBeenCalledTimes(1));
    expect(trackMock).toHaveBeenCalledWith("enquiry_submit", { slug: "aavaran-durbar-marg" });
  });

  it("writes one claim and emits one claim event for same-tick duplicate submits", async () => {
    const pending = deferred<{ error: null }>();
    insertMock.mockReturnValue(pending.promise);
    const { container } = render(<ClaimForm listing="aavaran-durbar-marg" />);

    change(container, "#claim-name", "Test Owner");
    change(container, "#claim-role", "owner");
    change(container, "#claim-contact", "owner@example.com");
    change(container, "#claim-proof_url", "https://example.com/proof");
    const form = container.querySelector("form");
    if (!form) throw new Error("Missing claim form");

    submitTwiceInOneBatch(form);
    expect(fromMock).toHaveBeenCalledTimes(1);
    expect(fromMock).toHaveBeenCalledWith("business_claims");
    expect(insertMock).toHaveBeenCalledTimes(1);

    await act(async () => {
      pending.resolve({ error: null });
      await pending.promise;
    });
    await waitFor(() => expect(trackMock).toHaveBeenCalledTimes(1));
    expect(trackMock).toHaveBeenCalledWith("claim_submit", { slug: "aavaran-durbar-marg" });
  });

  it("writes one website lead for a same-tick duplicate For Businesses submission", async () => {
    const pending = deferred<{ error: null }>();
    insertMock.mockReturnValue(pending.promise);
    const { container } = render(
      <ContactForm
        business=""
        listing=""
        page="for-businesses"
        topicPicker
        initialTopic="website"
        serviceOptions
      />,
    );

    change(container, "#name", "Test Owner");
    change(container, "#message", "I would like a website for my business.");
    const form = container.querySelector("form");
    if (!form) throw new Error("Missing For Businesses contact form");

    submitTwiceInOneBatch(form);
    expect(fromMock).toHaveBeenCalledTimes(1);
    expect(fromMock).toHaveBeenCalledWith("contact_messages");
    expect(insertMock).toHaveBeenCalledTimes(1);

    await act(async () => {
      pending.resolve({ error: null });
      await pending.promise;
    });
    await waitFor(() => expect(trackMock).toHaveBeenCalledTimes(2));
    expect(trackMock).toHaveBeenCalledWith("service_quote_submit", { query: "custom" });
    expect(trackMock).toHaveBeenCalledWith("enquiry_submit", {});
  });

});