import { describe, expect, it } from "vitest";
import { buildSalesOutreachDraft, inboundLeadInterest, inboundLeadStage, isOpenSalesStage, salesFollowUpState } from "@/lib/sales-pipeline";

const business = { name: "Sample Salon", area: "naxal" };

describe("Boxont sales pipeline", () => {
  it("creates a personalised English outreach draft without invented pricing", () => {
    const message = buildSalesOutreachDraft(business, "sponsored_placement", "en");
    expect(message).toContain("Sample Salon");
    expect(message).toContain("Boxont");
    expect(message).toContain("clearly labelled sponsored placement");
    expect(message).not.toMatch(/NPR\s*\d|\$\d/);
  });

  it("creates a Nepali draft and never sends it", () => {
    const message = buildSalesOutreachDraft(business, "website", "ne");
    expect(message).toContain("Sample Salon");
    expect(message).toContain("Boxont");
    expect(message).toContain("मोबाइलमैत्री व्यवसाय वेबसाइट");
  });

  it("maps existing enquiry statuses into sales stages without changing the source enquiry", () => {
    expect(inboundLeadStage("new")).toBe("identified");
    expect(inboundLeadStage("contacted")).toBe("contacted");
    expect(inboundLeadStage("quoted")).toBe("proposal");
    expect(inboundLeadStage("won")).toBe("won");
    expect(inboundLeadStage("lost")).toBe("lost");
  });

  it("maps inbound service package choices into sales interests", () => {
    expect(inboundLeadInterest("launch")).toBe("website");
    expect(inboundLeadInterest("growth")).toBe("website");
    expect(inboundLeadInterest("redesign")).toBe("redesign");
    expect(inboundLeadInterest("care")).toBe("care");
    expect(inboundLeadInterest("promotion")).toBe("sponsored_placement");
    expect(inboundLeadInterest(null)).toBe("unsure");
  });

  it("keeps closed and do-not-contact prospects out of follow-up queues", () => {
    expect(isOpenSalesStage("identified")).toBe(true);
    expect(isOpenSalesStage("won")).toBe(false);
    expect(isOpenSalesStage("lost")).toBe(false);
    expect(isOpenSalesStage("do_not_contact")).toBe(false);
  });

  it("classifies follow-up dates into overdue, due, later and none", () => {
    const now = Date.parse("2026-11-04T00:00:00Z");
    expect(salesFollowUpState("2026-11-03T23:59:00Z", now)).toBe("overdue");
    expect(salesFollowUpState("2026-11-05T00:00:00Z", now)).toBe("due");
    expect(salesFollowUpState("2026-11-20T00:00:00Z", now)).toBe("later");
    expect(salesFollowUpState(null, now)).toBe("none");
  });
});
