export const SERVICE_PACKAGE_IDS = ["launch", "growth", "care"] as const;
export type ServicePackageId = (typeof SERVICE_PACKAGE_IDS)[number];

export const SERVICE_BUDGET_BANDS = [
  "under_15000",
  "15000_30000",
  "30000_60000",
  "60000_plus",
  "not_sure",
] as const;
export type ServiceBudgetBand = (typeof SERVICE_BUDGET_BANDS)[number];

export const PAYMENT_STATUSES = [
  "not_quoted",
  "quoted",
  "awaiting_payment",
  "partially_paid",
  "paid",
  "cancelled",
  "refunded",
] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export function isPaymentStatus(value: string): value is PaymentStatus {
  return (PAYMENT_STATUSES as readonly string[]).includes(value);
}

export type RevenueRecord = {
  page: string;
  service_package: string | null;
  quote_amount_npr: number | null;
  paid_amount_npr: number;
  payment_status: string;
};

const ACTIVE_QUOTE_STATUSES = new Set<PaymentStatus>([
  "quoted",
  "awaiting_payment",
  "partially_paid",
  "paid",
]);

/** Summarise recorded commercial enquiries without treating quotes as collected revenue. */
export function summariseRevenue(rows: RevenueRecord[]) {
  const commercial = rows.filter(
    (row) => row.page === "for-businesses" || row.page === "preview" || Boolean(row.service_package),
  );
  const quoted = commercial.filter(
    (row) => isPaymentStatus(row.payment_status) && ACTIVE_QUOTE_STATUSES.has(row.payment_status),
  );
  const received = commercial.filter(
    (row) => row.payment_status === "partially_paid" || row.payment_status === "paid",
  );

  const total = (values: number[]) => values.reduce((sum, value) => sum + value, 0);
  const quotedNpr = total(quoted.map((row) => row.quote_amount_npr ?? 0));
  const receivedNpr = total(received.map((row) => row.paid_amount_npr ?? 0));
  const outstandingNpr = total(
    quoted.map((row) => Math.max((row.quote_amount_npr ?? 0) - (row.paid_amount_npr ?? 0), 0)),
  );

  return {
    enquiries: commercial.length,
    quotes: quoted.length,
    paidJobs: commercial.filter((row) => row.payment_status === "paid").length,
    quotedNpr,
    receivedNpr,
    outstandingNpr,
  };
}
