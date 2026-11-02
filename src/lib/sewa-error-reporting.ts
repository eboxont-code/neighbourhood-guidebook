import { redactLocation, redactLocationText } from "@/lib/location-redaction";

function describeThrown(error: unknown): string {
  if (error instanceof Response) return `Request failed with status ${error.status}.`;
  if (error instanceof Error) return `${error.name}: ${error.message}`;
  if (typeof error === "string") return error;

  try {
    return JSON.stringify(redactLocation(error))?.slice(0, 2_000) ?? String(error);
  } catch {
    return "An unknown application error occurred.";
  }
}

/** Log client-side failures after removing precise location data from the payload. */
export function reportSewaError(
  error: unknown,
  context: Record<string, unknown> = {},
): void {
  if (typeof window === "undefined") return;

  const safeError = redactLocation(error);
  const safeMessage = redactLocationText(describeThrown(safeError));
  const safeContext = redactLocation(context) as Record<string, unknown>;
  const stack =
    safeError instanceof Error && safeError.stack
      ? redactLocationText(safeError.stack)
      : undefined;

  console.error("[SEWA] Application error", {
    message: safeMessage,
    ...(stack ? { stack } : {}),
    route: redactLocationText(window.location.pathname),
    context: safeContext,
  });
}
