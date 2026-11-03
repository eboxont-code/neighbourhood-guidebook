import { describe, expect, it } from "vitest";
import { summariseRevenue, type RevenueRecord } from "@/lib/commerce";

const lead = (overrides: Partial<RevenueRecord> = {}): RevenueRecord => ({
  page: "for-businesses",
  service_package: "launch",
  quote_amount_npr: null,
  paid_amount_npr: 0,
  payment_status: "not_quoted",
  ...overrides,
});

describe("SEWA revenue totals", () => {
  it("separates quotes, received cash and outstanding balances", () => {
    const summary = summariseRevenue([
      lead({ quote_amount_npr: 15000, paid_amount_npr: 5000, payment_status: "partially_paid" }),
      lead({ page: "preview", service_package: "care", quote_amount_npr: 20000, paid_amount_npr: 20000, payment_status: "paid" }),
      lead({ page: "contact", service_package: null }),
      lead({ quote_amount_npr: 30000, paid_amount_npr: 30000, payment_status: "refunded" }),
      lead({ quote_amount_npr: 8000, payment_status: "cancelled" }),
    ]);

    expect(summary).toEqual({
      enquiries: 4,
      quotes: 2,
      paidJobs: 1,
      quotedNpr: 35000,
      receivedNpr: 25000,
      outstandingNpr: 10000,
    });
  });

  it("counts service enquiries even before a quote exists", () => {
    expect(summariseRevenue([
      lead({ payment_status: "not_quoted" }),
      lead({ page: "preview", service_package: null }),
    ])).toEqual({
      enquiries: 2,
      quotes: 0,
      paidJobs: 0,
      quotedNpr: 0,
      receivedNpr: 0,
      outstandingNpr: 0,
    });
  });

  it("does not treat unsupported payment states as quotes or cash", () => {
    expect(summariseRevenue([
      lead({ quote_amount_npr: 10000, paid_amount_npr: 10000, payment_status: "unknown" }),
    ])).toEqual({
      enquiries: 1,
      quotes: 0,
      paidJobs: 0,
      quotedNpr: 0,
      receivedNpr: 0,
      outstandingNpr: 0,
    });
  });
});
