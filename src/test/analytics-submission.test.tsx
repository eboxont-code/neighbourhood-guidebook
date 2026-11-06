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
  });

});

describe("public form success feedback", () => {
  async function expectSavedConfirmation(container: HTMLElement, messageKey: string) {
    await waitFor(() => {
      const status = container.querySelector('[role="status"]');
      expect(status?.textContent).toContain(messageKey);
    });
    expect(container.querySelector("form")).toBeNull();
  }

  it("shows an accessible saved confirmation after a preview enquiry", async () => {
    insertMock.mockResolvedValue({ error: null });
    const { container } = render(
      <ContactForm business="Aavaran" listing="aavaran-durbar-marg" page="preview" />,
    );
    change(container, "#name", "Test Owner");
    change(container, "#message", "I would like a website for my business.");
    const form = container.querySelector("form");
    if (!form) throw new Error("Missing preview enquiry form");

    fireEvent.submit(form);

    await expectSavedConfirmation(container, "thanksContact");
    expect(insertMock).toHaveBeenCalledTimes(1);
    expect(fromMock).toHaveBeenCalledWith("contact_messages");
  });

  it("shows an accessible saved confirmation after a For Businesses enquiry", async () => {
    insertMock.mockResolvedValue({ error: null });
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
    change(container, "#message", "I need a website for my business.");
    const form = container.querySelector("form");
    if (!form) throw new Error("Missing For Businesses enquiry form");

    fireEvent.submit(form);

    await expectSavedConfirmation(container, "thanksContact");
    expect(insertMock).toHaveBeenCalledTimes(1);
    expect(fromMock).toHaveBeenCalledWith("contact_messages");
  });

  it("shows an accessible saved confirmation after a general contact message", async () => {
    insertMock.mockResolvedValue({ error: null });
    const { container } = render(<ContactForm business="" listing="" page="contact" />);
    change(container, "#name", "Test Visitor");
    change(container, "#message", "I have a question about the directory.");
    const form = container.querySelector("form");
    if (!form) throw new Error("Missing general contact form");

    fireEvent.submit(form);

    await expectSavedConfirmation(container, "thanksContact");
    expect(insertMock).toHaveBeenCalledTimes(1);
    expect(fromMock).toHaveBeenCalledWith("contact_messages");
  });

  it("shows an accessible saved confirmation after a business claim", async () => {
    insertMock.mockResolvedValue({ error: null });
    const { container } = render(<ClaimForm listing="aavaran-durbar-marg" />);
    change(container, "#claim-name", "Test Owner");
    change(container, "#claim-role", "owner");
    change(container, "#claim-contact", "owner@example.com");
    change(container, "#claim-proof_url", "https://example.com/proof");
    const form = container.querySelector("form");
    if (!form) throw new Error("Missing business claim form");

    fireEvent.submit(form);

    await expectSavedConfirmation(container, "claimThanks");
    expect(insertMock).toHaveBeenCalledTimes(1);
    expect(fromMock).toHaveBeenCalledWith("business_claims");
  });

  it("shows an accessible saved confirmation after a correction report", async () => {
    insertMock.mockResolvedValue({ error: null });
    const { container } = render(<CorrectionForm listing="aavaran-durbar-marg" />);
    change(container, "#correction-type", "phone");
    change(container, "#wrong", "The listed phone number needs correction.");
    const form = container.querySelector("form");
    if (!form) throw new Error("Missing correction form");

    fireEvent.submit(form);

    await expectSavedConfirmation(container, "thanksCorrection");
    expect(insertMock).toHaveBeenCalledTimes(1);
    expect(fromMock).toHaveBeenCalledWith("correction_reports");
  });

  it("shows an accessible saved confirmation after a new-business submission", async () => {
    insertMock.mockResolvedValue({ error: null });
    const { container } = render(<BusinessSubmissionForm initialName="Test Cafe" />);
    change(container, "#sub-category", "cafes");
    change(container, "#sub-area", "thamel");
    change(container, "#sub-is_owner", "yes");
    change(container, "#sub-contact", "owner@example.com");
    const form = container.querySelector("form");
    if (!form) throw new Error("Missing new-business submission form");

    fireEvent.submit(form);

    await expectSavedConfirmation(container, "addThanks");
    expect(insertMock).toHaveBeenCalledTimes(1);
    expect(fromMock).toHaveBeenCalledWith("business_submissions");
  });
});

describe("public form failure and retry feedback", () => {
  async function expectRetryableFailure(
    container: HTMLElement,
    values: Record<string, string>,
  ) {
    await waitFor(() => {
      const alert = container.querySelector('[role="alert"]');
      expect(alert?.textContent).toContain("sendError");
    });
    expect(container.querySelector("form")).not.toBeNull();
    const submit = container.querySelector<HTMLButtonElement>('button[type="submit"]');
    expect(submit?.disabled).toBe(false);
    for (const [selector, value] of Object.entries(values)) {
      const field = container.querySelector<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(selector);
      expect(field?.value).toBe(value);
    }
  }

  it("keeps preview enquiry values and allows a retry after a returned database error", async () => {
    insertMock.mockResolvedValueOnce({ error: { message: "database unavailable" } });
    const { container } = render(
      <ContactForm business="Aavaran" listing="aavaran-durbar-marg" page="preview" />,
    );
    change(container, "#name", "Test Owner");
    change(container, "#message", "Please contact me about a website.");
    const form = container.querySelector("form");
    if (!form) throw new Error("Missing preview enquiry form");

    fireEvent.submit(form);

    await expectRetryableFailure(container, {
      "#name": "Test Owner",
      "#business": "Aavaran",
      "#message": "Please contact me about a website.",
    });
    expect(insertMock).toHaveBeenCalledTimes(1);

    insertMock.mockResolvedValueOnce({ error: null });
    fireEvent.submit(form);
    await waitFor(() => expect(container.querySelector('[role="status"]')?.textContent).toContain("thanksContact"));
    expect(insertMock).toHaveBeenCalledTimes(2);
  });

  it("keeps For Businesses enquiry values after a rejected request", async () => {
    insertMock.mockRejectedValueOnce(new Error("network unavailable"));
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
    change(container, "#message", "I need a website for my business.");
    const form = container.querySelector("form");
    if (!form) throw new Error("Missing For Businesses enquiry form");

    fireEvent.submit(form);

    await expectRetryableFailure(container, {
      "#topic": "website",
      "#name": "Test Owner",
      "#message": "I need a website for my business.",
    });
  });

  it("keeps general contact values after a returned database error", async () => {
    insertMock.mockResolvedValueOnce({ error: { message: "database unavailable" } });
    const { container } = render(<ContactForm business="" listing="" page="contact" />);
    change(container, "#name", "Test Visitor");
    change(container, "#message", "I have a question about the directory.");
    const form = container.querySelector("form");
    if (!form) throw new Error("Missing general contact form");

    fireEvent.submit(form);

    await expectRetryableFailure(container, {
      "#name": "Test Visitor",
      "#message": "I have a question about the directory.",
    });
  });

  it("keeps business claim values after a returned database error", async () => {
    insertMock.mockResolvedValueOnce({ error: { message: "database unavailable" } });
    const { container } = render(<ClaimForm listing="aavaran-durbar-marg" />);
    change(container, "#claim-name", "Test Owner");
    change(container, "#claim-role", "owner");
    change(container, "#claim-contact", "owner@example.com");
    change(container, "#claim-proof_url", "https://example.com/proof");
    const form = container.querySelector("form");
    if (!form) throw new Error("Missing business claim form");

    fireEvent.submit(form);

    await expectRetryableFailure(container, {
      "#claim-name": "Test Owner",
      "#claim-role": "owner",
      "#claim-contact": "owner@example.com",
      "#claim-proof_url": "https://example.com/proof",
    });
  });

  it("keeps correction report values after a rejected request", async () => {
    insertMock.mockRejectedValueOnce(new Error("network unavailable"));
    const { container } = render(<CorrectionForm listing="aavaran-durbar-marg" />);
    change(container, "#correction-type", "phone");
    change(container, "#wrong", "The listed phone number needs correction.");
    change(container, "#contact", "owner@example.com");
    const form = container.querySelector("form");
    if (!form) throw new Error("Missing correction form");

    fireEvent.submit(form);

    await expectRetryableFailure(container, {
      "#listing": "aavaran-durbar-marg",
      "#correction-type": "phone",
      "#wrong": "The listed phone number needs correction.",
      "#contact": "owner@example.com",
    });
  });

  it("keeps new-business submission values after a returned database error", async () => {
    insertMock.mockResolvedValueOnce({ error: { message: "database unavailable" } });
    const { container } = render(<BusinessSubmissionForm initialName="Test Cafe" />);
    change(container, "#sub-category", "cafes");
    change(container, "#sub-area", "thamel");
    change(container, "#sub-is_owner", "yes");
    change(container, "#sub-contact", "owner@example.com");
    change(container, "#sub-note", "Please review this listing.");
    const form = container.querySelector("form");
    if (!form) throw new Error("Missing new-business submission form");

    fireEvent.submit(form);

    await expectRetryableFailure(container, {
      "#sub-business_name": "Test Cafe",
      "#sub-category": "cafes",
      "#sub-area": "thamel",
      "#sub-is_owner": "yes",
      "#sub-contact": "owner@example.com",
      "#sub-note": "Please review this listing.",
    });
  });
});

describe("public form validation guidance", () => {
  it("identifies and focuses the first missing preview enquiry field", async () => {
    const { container } = render(
      <ContactForm business="Aavaran" listing="aavaran-durbar-marg" page="preview" />,
    );
    const form = container.querySelector("form");
    if (!form) throw new Error("Missing preview enquiry form");

    fireEvent.submit(form);

    await waitFor(() => expect(container.querySelector("#name-error")?.textContent).toContain("errName"));
    expect(container.querySelector("#name")?.getAttribute("aria-invalid")).toBe("true");
    expect(document.activeElement).toBe(container.querySelector("#name"));
    expect(fromMock).not.toHaveBeenCalled();
  });

  it("explains that the For Businesses enquiry topic must be selected", async () => {
    const { container } = render(
      <ContactForm business="" listing="" page="for-businesses" topicPicker />,
    );
    const form = container.querySelector("form");
    if (!form) throw new Error("Missing For Businesses enquiry form");

    fireEvent.submit(form);

    await waitFor(() => expect(container.querySelector("#topic-error")?.textContent).toContain("errChoice"));
    expect(container.querySelector("#topic")?.getAttribute("aria-invalid")).toBe("true");
    expect(document.activeElement).toBe(container.querySelector("#topic"));
    expect(fromMock).not.toHaveBeenCalled();
  });

  it("identifies and focuses the missing business-claim name", async () => {
    const { container } = render(<ClaimForm listing="aavaran-durbar-marg" />);
    const form = container.querySelector("form");
    if (!form) throw new Error("Missing business claim form");

    fireEvent.submit(form);

    await waitFor(() => expect(container.querySelector("#claim-name-error")?.textContent).toContain("errName"));
    expect(container.querySelector("#claim-name")?.getAttribute("aria-invalid")).toBe("true");
    expect(document.activeElement).toBe(container.querySelector("#claim-name"));
    expect(fromMock).not.toHaveBeenCalled();
  });

  it("explains which correction details and type are required", async () => {
    const { container } = render(<CorrectionForm listing="aavaran-durbar-marg" />);
    const form = container.querySelector("form");
    if (!form) throw new Error("Missing correction form");

    fireEvent.submit(form);

    await waitFor(() => expect(container.querySelector("#wrong-error")?.textContent).toContain("errWrong"));
    expect(container.querySelector("#wrong")?.getAttribute("aria-invalid")).toBe("true");
    expect(container.querySelector("#correction-type-error")?.textContent).toContain("errChoice");
    expect(container.querySelector("#correction-type")?.getAttribute("aria-invalid")).toBe("true");
    expect(fromMock).not.toHaveBeenCalled();
  });

  it("identifies and focuses the missing category on a new-business submission", async () => {
    const { container } = render(<BusinessSubmissionForm initialName="Test Cafe" />);
    const form = container.querySelector("form");
    if (!form) throw new Error("Missing new-business submission form");

    fireEvent.submit(form);

    await waitFor(() => expect(container.querySelector("#sub-category-error")?.textContent).toContain("errChoice"));
    expect(container.querySelector("#sub-category")?.getAttribute("aria-invalid")).toBe("true");
    expect(document.activeElement).toBe(container.querySelector("#sub-category"));
    expect(fromMock).not.toHaveBeenCalled();
  });
});

describe("For Businesses enquiry intent", () => {
  it("stores the For Businesses source and selected service package with the lead", async () => {
    insertMock.mockResolvedValue({ error: null });
    const { container } = render(
      <ContactForm
        business=""
        listing=""
        page="for-businesses"
        serviceOptions
        initialServicePackage="growth"
      />,
    );
    change(container, "#name", "Test Owner");
    change(container, "#message", "I need a website for my business.");
    const form = container.querySelector("form");
    if (!form) throw new Error("Missing For Businesses enquiry form");

    fireEvent.submit(form);

    await waitFor(() => expect(container.querySelector('[role="status"]')?.textContent).toContain("thanksContact"));
    expect(fromMock).toHaveBeenCalledWith("contact_messages");
    expect(insertMock).toHaveBeenCalledTimes(1);
    expect(insertMock).toHaveBeenCalledWith(expect.objectContaining({
      name: "Test Owner",
      message: "I need a website for my business.",
      page: "for-businesses",
      service_package: "growth",
      topic: null,
      budget_band: null,
    }));
  });
});
