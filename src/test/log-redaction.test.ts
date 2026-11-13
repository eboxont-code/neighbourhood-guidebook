import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import { redactSensitiveData, redactSensitiveText } from "@/lib/log-redaction";

function listFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name);
    return entry.isDirectory() ? listFiles(path) : [path];
  });
}

describe("application log redaction", () => {
  it("removes credentials, private tokens and secret assignments from text", () => {
    const bearer = "synthetic-bearer-token-value";
    const refresh = "synthetic-refresh-token-value";
    const serviceRole = "synthetic-service-role-value";
    const supabaseSecret = "sb_secret_syntheticsecretvalue";
    const jwt = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzZXdhIn0.synthetic-signature-value";
    const safe = redactSensitiveText(
      [
        `Authorization: Bearer ${bearer}`,
        `refresh_token=${refresh}`,
        `SUPABASE_SERVICE_ROLE_KEY=${serviceRole}`,
        supabaseSecret,
        jwt,
      ].join(" | "),
    );

    for (const secret of [bearer, refresh, serviceRole, supabaseSecret, jwt]) {
      expect(safe).not.toContain(secret);
    }
    expect(safe).toContain("[redacted]");
    expect(safe).toContain("[secret redacted]");
    expect(safe).toContain("[token redacted]");
  });

  it("redacts JSON secrets, URL credentials, internal hosts and admin URLs", () => {
    const json = redactSensitiveText('{"refresh_token":"refresh-secret-value","note":"safe"}');
    expect(json).not.toContain("refresh-secret-value");
    expect(json).toContain('"note":"safe"');

    const url = redactSensitiveText(
      "https://operator:password-value@example.test/path?code=private-code",
    );
    expect(url).not.toContain("password-value");
    expect(url).not.toContain("private-code");

    const query = redactSensitiveText("https://example.test/callback?token=private-token");
    expect(query).toBe("https://example.test/callback?token=[redacted]");

    const admin = redactSensitiveText("Open https://sewa.boxont.com/admin?code=private-code");
    expect(admin).toBe("Open [admin URL redacted]");
    expect(redactSensitiveText("Request http://localhost:3000/health")).not.toContain("localhost");
    expect(redactSensitiveText("route /admin/reset")).toContain("[admin route]/reset");
  });

  it("redacts sensitive object fields recursively while keeping safe context", () => {
    const safe = redactSensitiveData({
      route: "/search",
      authorization: "Bearer synthetic-bearer-token-value",
      nested: {
        refreshToken: "synthetic-refresh-token-value",
        business: "Example business",
      },
      message: "token=synthetic-token-value",
    }) as Record<string, unknown>;
    const nested = safe.nested as Record<string, unknown>;

    expect(safe.authorization).toBe("[redacted]");
    expect(nested.refreshToken).toBe("[redacted]");
    expect(nested.business).toBe("Example business");
    expect(safe.route).toBe("/search");
    expect(String(safe.message)).not.toContain("synthetic-token-value");
  });

  it("redacts error messages, stacks and causes without losing the useful error", () => {
    const error = new Error(
      "Request failed at https://sewa.boxont.com/admin?token=synthetic-reset-token",
    );
    error.stack = "Error: Authorization: Bearer synthetic-bearer-token-value";
    Object.defineProperty(error, "cause", {
      value: new Error("SUPABASE_SERVICE_ROLE_KEY=synthetic-service-role-value"),
    });

    const safe = redactSensitiveData(error) as Error & { cause?: Error };
    expect(safe.message).toContain("Request failed");
    expect(safe.message).not.toContain("synthetic-reset-token");
    expect(safe.stack).not.toContain("synthetic-bearer-token-value");
    expect(safe.cause?.message).not.toContain("synthetic-service-role-value");
  });
});

describe("public asset boundary", () => {
  const projectRoot = process.cwd();
  const publicRoot = resolve(projectRoot, "public");
  const publicFiles = listFiles(publicRoot);

  it("keeps logs, source maps and environment files out of public assets", () => {
    const forbidden = publicFiles.filter((path) =>
      /(?:\.log|\.map)$/i.test(path) || /(?:^|[/\\])\.env(?:\.|$)/i.test(path),
    );
    expect(forbidden).toEqual([]);
  });

  it("keeps credentials and internal admin URLs out of public text assets", () => {
    const textAssets = publicFiles.filter((path) =>
      /\.(?:txt|svg|json|xml|html|js|css|map)$/i.test(path),
    );
    for (const path of textAssets) {
      const content = readFileSync(path, "utf8");
      expect(content).not.toMatch(/sb_secret_[A-Za-z0-9_-]{8,}/i);
      expect(content).not.toMatch(/SUPABASE_SERVICE_ROLE_KEY\s*[:=]/i);
      expect(content).not.toMatch(/\bBearer\s+[A-Za-z0-9._~+\/-]{8,}/i);
      expect(content).not.toMatch(
        /https?:\/\/(?:localhost|127(?:\.\d{1,3}){3}|0\.0\.0\.0|10(?:\.\d{1,3}){3}|192\.168(?:\.\d{1,3}){2}|172\.(?:1[6-9]|2\d|3[01])(?:\.\d{1,3}){2}|[a-z0-9-]+\.local)/i,
      );
      expect(content).not.toMatch(/https?:\/\/[^\s"'<>]*\/admin(?=[/?#\s"'<>]|$)/i);
    }

    const robots = readFileSync(resolve(publicRoot, "robots.txt"), "utf8");
    expect(robots).toContain("Disallow: /admin");
  });

  it("keeps the password-recovery redirect on the approved public domain", () => {
    const adminRoute = readFileSync(resolve(projectRoot, "src/routes/admin.tsx"), "utf8");
    const adminUrls = [...adminRoute.matchAll(/https?:\/\/[^\s"'<>]*\/admin(?=[/?#\s"'<>]|$)/gi)].map(
      ([url]) => url,
    );
    expect(adminUrls).toEqual(["https://sewa.boxont.com/admin"]);
    expect(adminRoute).not.toMatch(/https?:\/\/(?:localhost|127(?:\.\d{1,3}){3}|[^/\s]+\.vercel\.app)\/admin/i);
  });
});



describe("safe application log wiring", () => {
  it("sanitizes server warnings and browser listing refresh errors", () => {
    const projectRoot = process.cwd();
    const serverCapture = readFileSync(resolve(projectRoot, "src/lib/error-capture.ts"), "utf8");
    const listingSource = readFileSync(resolve(projectRoot, "src/lib/listings.ts"), "utf8");
    const browserReporter = readFileSync(resolve(projectRoot, "src/lib/sewa-error-reporting.ts"), "utf8");

    expect(serverCapture).toContain("console.warn =");
    expect(serverCapture).toContain("redactSensitiveData");
    expect(listingSource).toContain('reportSewaError(e, { source: "listings-refresh" })');
    expect(browserReporter).toContain("redactSensitiveText");
  });
});
