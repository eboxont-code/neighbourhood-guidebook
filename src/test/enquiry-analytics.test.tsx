import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { trackMock, fromMock, insertMock } = vi.hoisted(() => ({
  trackMock: vi.fn(),
  fromMock: vi.fn(),
  insertMock: vi.fn(),
}));

vi.mock("@/lib/track", () => ({ track: trackMock }));
vi.mock("@/integrations/supabase/client", () => ({ supabase: { from: fromMock } }));
vi.mock("@/lib/i18n", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/i18n")>();
  return { ...actual, useI18n: () => ({ t: (key: string) => key, lang: "en" }) };
});
vi.mock("@tanstack/react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@tanstack/react-router")>();
  return {
    ...actual,
    Link: ({ to, children }: { to: string; children?: ReactNode }) => <a href={to}>{children}</a>,
  };
});

import { ContactForm } from "@/components/forms";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

beforeEach(() => {
  fromMock.mockReturnValue({ insert: insertMock });
  insertMock.mockResolvedValue({ error: null });
});

function requiredFields(container: HTMLElement) {
  const name = container.querySelector<HTMLInputElement>("#name");
  const message = container.querySelector<HTMLTextAreaElement>("#message");
  if (!name || !message) throw new Error("Expected website enquiry fields");
  fireEvent.change(name, { target: { value: "Sam" } });
  fireEvent.change(message, { target: { value: "Please help with a business website." } });
}

describe("website enquiry analytics", () => {
  it("records one anonymous start on the first interaction with a preview enquiry", () => {
    const { container } = render(<ContactForm business="Aavaran" listing="aavaran-durbar-marg" page="preview" />);
    const name = container.querySelector<HTMLInputElement>("#name");
    const message = container.querySelector<HTMLTextAreaElement>("#message");
    if (!name || !message) throw new Error("Expected website enquiry fields");

    fireEvent.focus(name);
    fireEvent.focus(message);

    expect(trackMock).toHaveBeenCalledTimes(1);
    expect(trackMock).toHaveBeenCalledWith("enquiry_start", { slug: "aavaran-durbar-marg" });
  });

  it("starts tracking a general contact form only after website is selected", () => {
    const { container } = render(<ContactForm business="" listing="" topicPicker />);
    const name = container.querySelector<HTMLInputElement>("#name");
    const topic = container.querySelector<HTMLSelectElement>("#topic");
    if (!name || !topic) throw new Error("Expected contact topic and name fields");

    fireEvent.focus(name);
    expect(trackMock).not.toHaveBeenCalled();

    fireEvent.change(topic, { target: { value: "other" } });
    expect(trackMock).not.toHaveBeenCalled();

    fireEvent.change(topic, { target: { value: "website" } });
    expect(trackMock).toHaveBeenCalledTimes(1);
    expect(trackMock).toHaveBeenCalledWith("enquiry_start", {});
  });

  it("records enquiry_submit only after the database insert succeeds and sends no form data to analytics", async () => {
    let resolveInsert: ((value: { error: null }) => void) | undefined;
    insertMock.mockReturnValueOnce(new Promise<{ error: null }>((resolve) => { resolveInsert = resolve; }));
    const { container } = render(<ContactForm business="Aavaran" listing="aavaran-durbar-marg" page="preview" />);
    requiredFields(container);
    const form = container.querySelector("form");
    if (!form) throw new Error("Expected contact form");

    fireEvent.submit(form);
    await waitFor(() => expect(insertMock).toHaveBeenCalledTimes(1));
    expect(trackMock).toHaveBeenCalledWith("enquiry_start", { slug: "aavaran-durbar-marg" });
    expect(trackMock).not.toHaveBeenCalledWith("enquiry_submit", { slug: "aavaran-durbar-marg" });

    if (!resolveInsert) throw new Error("Expected pending insert resolver");
    resolveInsert({ error: null });
    await waitFor(() => expect(trackMock).toHaveBeenCalledWith("enquiry_submit", { slug: "aavaran-durbar-marg" }));
    expect(trackMock.mock.calls).toEqual([
      ["enquiry_start", { slug: "aavaran-durbar-marg" }],
      ["enquiry_submit", { slug: "aavaran-durbar-marg" }],
    ]);
  });

  it("records a start but never a successful submission when the database insert fails", async () => {
    insertMock.mockResolvedValueOnce({ error: { message: "offline" } });
    const { container, findByRole } = render(<ContactForm business="Aavaran" listing="aavaran-durbar-marg" page="preview" />);
    requiredFields(container);
    const form = container.querySelector("form");
    if (!form) throw new Error("Expected contact form");

    fireEvent.submit(form);
    await findByRole("alert");
    expect(trackMock).toHaveBeenCalledTimes(1);
    expect(trackMock).toHaveBeenCalledWith("enquiry_start", { slug: "aavaran-durbar-marg" });
    expect(trackMock).not.toHaveBeenCalledWith("enquiry_submit", expect.anything());
  });

  it("counts an invalid website form attempt as a start but not a submission", () => {
    const { container } = render(<ContactForm business="Aavaran" listing="aavaran-durbar-marg" page="preview" />);
    const form = container.querySelector("form");
    if (!form) throw new Error("Expected contact form");

    fireEvent.submit(form);
    expect(trackMock).toHaveBeenCalledTimes(1);
    expect(trackMock).toHaveBeenCalledWith("enquiry_start", { slug: "aavaran-durbar-marg" });
    expect(trackMock).not.toHaveBeenCalledWith("enquiry_submit", expect.anything());
  });
});
