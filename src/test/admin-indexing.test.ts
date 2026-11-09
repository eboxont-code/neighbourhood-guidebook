import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { sitemapPaths } from "@/lib/sitemap";

function readProjectFile(path: string): string {
  return readFileSync(resolve(process.cwd(), path), "utf8");
}

describe("admin indexing controls", () => {
  it("keeps the admin route marked noindex and nofollow", () => {
    const adminRoute = readProjectFile("src/routes/admin.tsx");
    expect(adminRoute).toMatch(/name:\s*"robots",\s*content:\s*"noindex, nofollow"/);
  });

  it("lets crawlers fetch the admin route so they can read its noindex directive", () => {
    const robots = readProjectFile("public/robots.txt");
    expect(robots).not.toMatch(/^\s*Disallow:\s*\/admin(?:\/|\s|$)/im);
  });

  it("keeps admin paths out of the public sitemap", () => {
    const paths = sitemapPaths();
    expect(paths).not.toContain("/admin");
    expect(paths.some((path) => path.startsWith("/admin/"))).toBe(false);
  });
});
