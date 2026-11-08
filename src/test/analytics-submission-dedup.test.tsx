import { act, cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ClaimForm } from "@/components/claim-form";
import { BusinessSubmissionForm, ContactForm, CorrectionForm } from "@/components/forms";

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
  it("writes one preview enquiry and emits one enquiry event for same-tick duplicate submits", async () => {
    const pending = deferred<{ error: null }>();
    insertMock.mockReturnValue(pending.promise);
    const { container } = render(
      <ContactForm business="Aavaran" listing="aavaran-durbar-marg" page="preview" />,
    );
    change(container, "#name", "Test Owner");
    change(container, "#message", "I would like a website for my business.");
    const form = container.querySelector("form");
    if (!form) throw new Error("Missing preview enquiry form");

    submitTwiceInOneBatch(form);
    expect(fromMock).toHaveBeenCalledTimes(1);
    expect(fromMock).toHaveBeenCalledWith("contact_messages");
    expect(insertMock).toHaveBeenCalledTimes(1);
    expect(insertMock).toHaveBeenCalledWith(expect.objectContaining({
      name: "Test Owner",
      business_name: "Aavaran",
      message: "I would like a website for my business.",
      source_listing_slug: "aavaran-durbar-marg",
      page: "preview",
    }));

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
    expect(insertMock).toHaveBeenCalledWith(expect.objectContaining({
      listing_slug: "aavaran-durbar-marg",
      listing_id: "b1",
      name: "Test Owner",
    }));

    await act(async () => {
      pending.resolve({ error: null });
      await pending.promise;
    });
    await waitFor(() => expect(trackMock).toHaveBeenCalledTimes(1));
    expect(trackMock).toHaveBeenCalledWith("claim_submit", { slug: "aavaran-durbar-marg" });
  });

  it("writes one For Businesses lead and emits one of each success event for same-tick duplicates", async () => {
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
    expect(trackMock).toHaveBeenNthCalledWith(1, "service_quote_submit", { query: "custom" });
    expect(trackMock).toHaveBeenNthCalledWith(2, "enquiry_submit", {});
  });

  it("writes one correction report for same-tick duplicate submits", async () => {
    const pending = deferred<{ error: null }>();
    insertMock.mockReturnValue(pending.promise);
    const { container } = render(<CorrectionForm listing="aavaran-durbar-marg" />);
    change(container, "#correction-type", "phone");
    change(container, "#wrong", "The listed phone number needs correction.");
    const form = container.querySelector("form");
    if (!form) throw new Error("Missing correction form");

    submitTwiceInOneBatch(form);
    expect(fromMock).toHaveBeenCalledTimes(1);
    expect(fromMock).toHaveBeenCalledWith("correction_reports");
    expect(insertMock).toHaveBeenCalledTimes(1);

    await act(async () => {
      pending.resolve({ error: null });
      await pending.promise;
    });
    expect(trackMock).not.toHaveBeenCalled();
  });

  it("writes one business submission for same-tick duplicate submits", async () => {
    const pending = deferred<{ error: null }>();
    insertMock.mockReturnValue(pending.promise);
    const { container } = render(<BusinessSubmissionForm initialName="Test Cafe" />);
    change(container, "#sub-category", "cafes");
    change(container, "#sub-area", "thamel");
    change(container, "#sub-is_owner", "yes");
    change(container, "#sub-contact", "owner@example.com");
    const form = container.querySelector("form");
    if (!form) throw new Error("Missing business submission form");

    submitTwiceInOneBatch(form);
    expect(fromMock).toHaveBeenCalledTimes(1);
    expect(fromMock).toHaveBeenCalledWith("business_submissions");
    expect(insertMock).toHaveBeenCalledTimes(1);

    await act(async () => {
      pending.resolve({ error: null });
      await pending.promise;
    });
    expect(trackMock).not.toHaveBeenCalled();
  });

  it("writes one general contact lead for same-tick duplicate submits", async () => {
    const pending = deferred<{ error: null }>();
    insertMock.mockReturnValue(pending.promise);
    const { container } = render(<ContactForm business="" listing="" page="contact" />);
    change(container, "#name", "Test Visitor");
    change(container, "#message", "I have a question about the directory.");
    const form = container.querySelector("form");
    if (!form) throw new Error("Missing general contact form");

    submitTwiceInOneBatch(form);
    expect(fromMock).toHaveBeenCalledTimes(1);
    expect(fromMock).toHaveBeenCalledWith("contact_messages");
    expect(insertMock).toHaveBeenCalledTimes(1);

    await act(async () => {
      pending.resolve({ error: null });
      await pending.promise;
    });
    expect(trackMock).not.toHaveBeenCalled();
  });

  it("releases the in-flight guard after a failed request so a genuine retry can emit once", async () => {
    insertMock
      .mockResolvedValueOnce({ error: { message: "database unavailable" } })
      .mockResolvedValueOnce({ error: null });
    const { container } = render(
      <ContactForm business="Aavaran" listing="aavaran-durbar-marg" page="preview" />,
    );
    change(container, "#name", "Test Owner");
    change(container, "#message", "Please contact me about a website.");
    const form = container.querySelector("form");
    if (!form) throw new Error("Missing preview enquiry form");

    fireEvent.submit(form);
    await waitFor(() => expect(container.querySelector('[role="alert"]')?.textContent).toContain("sendError"));
    expect(insertMock).toHaveBeenCalledTimes(1);
    expect(trackMock).not.toHaveBeenCalled();

    fireEvent.submit(form);
    await waitFor(() => expect(container.querySelector('[role="status"]')?.textContent).toContain("thanksContact"));
    expect(insertMock).toHaveBeenCalledTimes(2);
    expect(trackMock).toHaveBeenCalledTimes(1);
    expect(trackMock).toHaveBeenCalledWith("enquiry_submit", { slug: "aavaran-durbar-marg" });
  });
});
