/** Remove credentials and private routes before application data reaches logs. */
const sensitiveProperty =
  /(?:authorization|access[_-]?token|refresh[_-]?token|id[_-]?token|auth[_-]?token|token|password|passwd|secret|client[_-]?secret|api[_-]?key|apikey|service[_-]?role|private[_-]?key|cookie|session|credential|jwt|signature|code[_-]?verifier|code[_-]?challenge|nonce|oauth[_-]?state|oauth[_-]?code)/i;

export function redactSensitiveText(text: string): string {
  return text
    .replace(
      /\bhttps?:\/\/[^\s"'<>]*\/admin(?=[/?#\s"'<>]|$)(?:[/?#][^\s"'<>]*)?/gi,
      "[admin URL redacted]",
    )
    .replace(
      /\bhttps?:\/\/(?:localhost|127(?:\.\d{1,3}){3}|0\.0\.0\.0|\[::1\]|10(?:\.\d{1,3}){3}|192\.168(?:\.\d{1,3}){2}|172\.(?:1[6-9]|2\d|3[01])(?:\.\d{1,3}){2}|[a-z0-9-]+\.(?:local|internal)|host\.docker\.internal)(?::\d+)?(?:\/[^\s"'<>]*)?/gi,
      "[internal URL redacted]",
    )
    .replace(/(https?:\/\/)[^/\s:@]+:[^/\s@]+@/gi, "$1[credentials]@")
    .replace(/\b((?:proxy-)?authorization\s*[:=]\s*)(?:bearer|basic)\s+[^\s,;]+/gi, "$1[redacted]")
    .replace(
      /(["'](?:access[_-]?token|refresh[_-]?token|id[_-]?token|auth[_-]?token|token|api[_-]?key|apikey|client[_-]?secret|secret|password|passwd|authorization|cookie|session|signature|sig|nonce|oauth[_-]?state|oauth[_-]?code|code[_-]?verifier|code[_-]?challenge)["']\s*:\s*)(?:"[^"]*"|'[^']*')/gi,
      '$1"[redacted]"',
    )
    .replace(
      /([?&](?:access[_-]?token|refresh[_-]?token|id[_-]?token|auth[_-]?token|token|api[_-]?key|apikey|client[_-]?secret|secret|password|passwd|authorization|cookie|session|signature|sig|code|code[_-]?verifier|code[_-]?challenge|state|nonce)=)[^&#\s"'<>]*/gi,
      "$1[redacted]",
    )
    .replace(/\b(?:bearer|basic)\s+[A-Za-z0-9._~+\/-]{8,}={0,2}/gi, "[credential redacted]")
    .replace(/\bsb_secret_[A-Za-z0-9_-]{8,}\b/gi, "[secret redacted]")
    .replace(/\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\b/g, "[token redacted]")
    .replace(
      /\b([A-Z0-9_]*(?:ACCESS_TOKEN|REFRESH_TOKEN|ID_TOKEN|AUTH_TOKEN|TOKEN|PASSWORD|PASSWD|SECRET|API_KEY|APIKEY|SERVICE_ROLE_KEY|AUTHORIZATION|COOKIE|PRIVATE_KEY|NONCE|OAUTH_CODE|OAUTH_STATE)[A-Z0-9_]*\s*[:=]\s*)(?:"[^"]*"|'[^']*'|[^\s,;]+)/gi,
      "$1[redacted]",
    )
    .replace(/(^|[\s"'(])\/admin(?=\/|[?#\s"'\x60]|$)/gi, "$1[admin route]");
}

export function redactSensitiveData(
  value: unknown,
  depth = 0,
  seen: WeakSet<object> = new WeakSet(),
): unknown {
  if (typeof value === "string") return redactSensitiveText(value);
  if (value === null || typeof value !== "object") return value;
  if (depth > 8) return "[omitted]";

  if (value instanceof Error) {
    const safeError = new Error(redactSensitiveText(value.message));
    safeError.name = value.name;
    if (value.stack) safeError.stack = redactSensitiveText(value.stack);
    const cause = (value as Error & { cause?: unknown }).cause;
    if (cause !== undefined) {
      Object.defineProperty(safeError, "cause", {
        value: redactSensitiveData(cause, depth + 1, seen),
        enumerable: true,
      });
    }
    return safeError;
  }

  if (typeof URL !== "undefined" && value instanceof URL) {
    return redactSensitiveText(value.href);
  }
  if (typeof URLSearchParams !== "undefined" && value instanceof URLSearchParams) {
    return redactSensitiveText(value.toString());
  }
  if (typeof Headers !== "undefined" && value instanceof Headers) {
    return Object.fromEntries(
      Array.from(value.entries(), ([key, item]) => [
        key,
        sensitiveProperty.test(key) ? "[redacted]" : redactSensitiveData(item, depth + 1, seen),
      ]),
    );
  }
  if (typeof Request !== "undefined" && value instanceof Request) {
    return { type: "Request", method: value.method, url: redactSensitiveText(value.url) };
  }
  if (typeof Response !== "undefined" && value instanceof Response) {
    return { type: "Response", status: value.status };
  }
  if (value instanceof Date) return value.toISOString();
  if (seen.has(value)) return "[circular]";
  seen.add(value);

  if (Array.isArray(value)) {
    return value.map((item) => redactSensitiveData(item, depth + 1, seen));
  }

  try {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        sensitiveProperty.test(key) ? "[redacted]" : redactSensitiveData(item, depth + 1, seen),
      ]),
    );
  } catch {
    return "[unavailable]";
  }
}
