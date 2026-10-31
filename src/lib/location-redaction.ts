/** Defence in depth for error contexts and breadcrumbs. Never serialize location objects. */
const privateKey = /^(lat|lng|lon|latitude|longitude|coords|coordinates|geolocation|here|position|accuracy|altitude|heading|speed)$/i;
export function redactLocationText(text: string): string {
  return text
    .replace(/\b(lat(?:itude)?|lng|lon(?:gitude)?)\s*[=:]\s*-?\d+(?:\.\d+)?/gi, "$1=[redacted]")
    .replace(/-?\d{1,3}\.\d{3,}\s*[,/]\s*-?\d{1,3}\.\d{3,}/g, "[location redacted]");
}
export function redactLocation(value: unknown, depth = 0): unknown {
  if (typeof value === "string") return redactLocationText(value);
  if (depth > 8) return "[omitted]";
  if (value instanceof Error) {
    const error = new Error(redactLocationText(value.message));
    error.name = value.name;
    if (value.stack) error.stack = redactLocationText(value.stack);
    else delete error.stack;
    return error;
  }
  if (Array.isArray(value)) return value.map((item) => redactLocation(item, depth + 1));
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).filter(([key]) => !privateKey.test(key)).map(([key, item]) => [key, redactLocation(item, depth + 1)]));
  return value;
}