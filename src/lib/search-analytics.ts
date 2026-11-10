const SAFE_SEARCH_CLASS = /^(?:category:(?:[a-z0-9_-]+|mixed)(?:;area:[a-z0-9_-]+)?|area:[a-z0-9_-]+|other)$/;

/** Reject raw or malformed values before they reach first-party search analytics. */
export function safeSearchClass(value?: string): string {
  const candidate = value?.trim().toLowerCase();
  return candidate && SAFE_SEARCH_CLASS.test(candidate) ? candidate : "other";
}
