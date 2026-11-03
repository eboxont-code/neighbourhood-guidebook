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
