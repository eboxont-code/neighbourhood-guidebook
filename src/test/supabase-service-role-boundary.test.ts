import { readdirSync, readFileSync } from "node:fs";
import { relative, resolve, sep } from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = process.cwd();
const sourceRoot = resolve(projectRoot, "src");

function listSourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) return listSourceFiles(path);
    return /\.(?:[cm]?[jt]sx?)$/.test(entry.name) ? [path] : [];
  });
}

function readProjectFile(path: string): string {
  return readFileSync(resolve(projectRoot, path), "utf8");
}

function relativeProjectPath(path: string): string {
  return relative(projectRoot, path).split(sep).join("/");
}

const sourceFiles = listSourceFiles(sourceRoot).filter(
  (path) => !relative(sourceRoot, path).split(sep).includes("test"),
);
const sharedSourceFiles = sourceFiles.filter(
  (path) => !/\.server\.(?:[cm]?[jt]sx?)$/.test(path),
);

describe("Supabase service-role key boundary", () => {
  it("keeps service-role key references out of shared and browser-reachable source", () => {
    const exposed = sharedSourceFiles.filter((path) =>
      /\bSUPABASE_SERVICE_ROLE_KEY\b|\bservice_role\b/i.test(readFileSync(path, "utf8")),
    );

    expect(exposed.map(relativeProjectPath)).toEqual([]);
  });

  it("prevents shared and browser-reachable source from importing the server-only client", () => {
    const serverClientImports = sharedSourceFiles.filter((path) =>
      /(?:\bfrom\s*|\bimport\s*\(\s*|\brequire\s*\(\s*)["'][^"']*client\.server(?:\.[cm]?[jt]sx?)?["']/.test(
        readFileSync(path, "utf8"),
      ),
    );

    expect(serverClientImports.map(relativeProjectPath)).toEqual([]);
  });

  it("uses publishable credentials in the browser client and Vite configuration", () => {
    const browserClient = readProjectFile("src/integrations/supabase/client.ts");
    expect(browserClient).toContain("VITE_SUPABASE_URL");
    expect(browserClient).toContain("VITE_SUPABASE_PUBLISHABLE_KEY");
    expect(browserClient).not.toContain("SUPABASE_SERVICE_ROLE_KEY");

    const envExample = readProjectFile(".env.example");
    const browserVariables = envExample.split(/\r?\n/).filter((line) => line.startsWith("VITE_"));
    expect(browserVariables).toContain(
      "VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_replace_with_your_publishable_key",
    );
    expect(browserVariables.some((line) => /SERVICE_ROLE/i.test(line))).toBe(false);

    const viteConfig = readProjectFile("vite.config.ts");
    expect(viteConfig).not.toMatch(/\benvPrefix\s*:/);
    expect(viteConfig).not.toContain("SUPABASE_SERVICE_ROLE_KEY");
  });

  it("keeps the service-role client server-only and ignores local environment files", () => {
    const serverClient = readProjectFile("src/integrations/supabase/client.server.ts");
    expect(serverClient).toContain("process.env['SUPABASE_SERVICE_ROLE_KEY']");
    expect(serverClient).not.toMatch(/\bimport\.meta\.env\b|\bVITE_[A-Z0-9_]+\b/);

    const gitignore = readProjectFile(".gitignore");
    expect(gitignore).toMatch(/^\.env$/m);
    expect(gitignore).toMatch(/^\.env\.\*$/m);
    expect(gitignore).toMatch(/^\.dev\.vars$/m);
  });
});
