import { describe, expect, it } from "vitest";
import { buildServiceProposalDraft } from "@/lib/sales-pipeline";

describe("Boxont custom service proposals", () => {
  it("includes only the provided scope, date, timeline and custom quote in English", () => {
    const proposal = buildServiceProposalDraft({
      businessName: "Sample Salon",
      interest: "website",
      scope: "Design and build the five-page website described in the approved brief.",
      timeline: "Schedule to be agreed after approval.",
      quoteNpr: 45000,
      preparedOn: "4 Nov 2026",
      lang: "en",
    });
    expect(proposal).toContain("Sample Salon");
    expect(proposal).toContain("NPR 45,000");
    expect(proposal).toContain("five-page website");
    expect(proposal).toContain("Schedule to be agreed after approval");
    expect(proposal).toContain("confirmed in writing before work begins");
  });

  it("builds a Nepali proposal with the exact supplied quote and no assumed delivery date", () => {
    const proposal = buildServiceProposalDraft({
      businessName: "Sample Salon",
      interest: "care",
      scope: "दिइएको सेवा विवरणअनुसार वेबसाइट हेरचाह।",
      timeline: "",
      quoteNpr: 12000,
      preparedOn: "४ नोभेम्बर २०२६",
      lang: "ne",
    });
    expect(proposal).toContain("Sample Salon");
    expect(proposal).toContain("NPR १२,०००");
    expect(proposal).toContain("दिइएको सेवा विवरणअनुसार");
    expect(proposal).toContain("दायरा स्वीकृत भएपछि");
    expect(proposal?.length).toBeLessThan(1500);
  });

  it("refuses to create a proposal without a business, scope or valid supplied quote", () => {
    const input = {
      businessName: "Sample Salon",
      interest: "website" as const,
      scope: "A supplied scope",
      timeline: "",
      quoteNpr: 0,
      preparedOn: "4 Nov 2026",
      lang: "en" as const,
    };
    expect(buildServiceProposalDraft(input)).toBeNull();
    expect(buildServiceProposalDraft({ ...input, quoteNpr: 1, scope: " " })).toBeNull();
    expect(buildServiceProposalDraft({ ...input, quoteNpr: 5_000_001 })).toBeNull();
    expect(buildServiceProposalDraft({ ...input, businessName: " " })).toBeNull();
  });

  it("bounds the proposal snapshot to the activity-history field limit", () => {
    const proposal = buildServiceProposalDraft({
      businessName: "Salon",
      interest: "redesign",
      scope: "Scope ".repeat(200),
      timeline: "Timeline ".repeat(40),
      quoteNpr: 999999,
      preparedOn: "4 Nov 2026",
      lang: "en",
    });
    expect(proposal).not.toBeNull();
    expect(proposal!.length).toBeLessThanOrEqual(1499);
  });
});
