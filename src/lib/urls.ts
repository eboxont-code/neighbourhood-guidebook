const MAX_EXTERNAL_URL_LENGTH = 2048;
const DNS_LABEL = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;

function isPublicDnsHostname(hostname: string): boolean {
  if (!hostname || hostname.length > 253 || hostname.endsWith(".")) return false;
  if (hostname.startsWith("[") || /^\d+(?:\.\d+){3}$/.test(hostname)) return false;
  if (
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    hostname.endsWith(".local") ||
    hostname.endsWith(".internal")
  ) return false;

  const labels = hostname.split(".");
  return labels.length >= 2 &&
    labels.every((label) => label.length <= 63 && DNS_LABEL.test(label)) &&
    /[a-z]/i.test(labels[labels.length - 1] ?? "");
}

/**
 * Return a canonical HTTP(S) URL suitable for an external link, or null.
 * Reject credentials, local/IP hosts and non-web schemes so untrusted input
 * cannot turn an admin link into a script, local-service or misleading URL.
 */
export function safeExternalHttpUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const input = value.trim();
  if (
    !input ||
    input.length > MAX_EXTERNAL_URL_LENGTH ||
    !/^https?:\/\//i.test(input) ||
    /[\u0000-\u0020\u007f]/.test(input)
  ) return null;

  try {
    const url = new URL(input);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    if (url.username || url.password) return null;
    if (!isPublicDnsHostname(url.hostname.toLowerCase())) return null;
    return url.href;
  } catch {
    return null;
  }
}

/** A human-readable host label for checking an untrusted external destination. */
export function externalUrlHost(value: unknown): string | null {
  const safe = safeExternalHttpUrl(value);
  if (!safe) return null;
  return new URL(safe).hostname.toLowerCase().replace(/^www\./, "");
}
