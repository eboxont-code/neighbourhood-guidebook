import { resolve } from "node:path";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => ({
  plugins: [
    tanstackStart({
      server: { entry: "server" },
    }),
    nitro(mode === "development" ? { output: { publicDir: resolve(process.cwd(), "dist") } } : {}),
    tsconfigPaths(),
    tailwindcss(),
    react(),
  ],
  resolve: {
    alias: {
      "@": resolve(process.cwd(), "src"),
    },
    dedupe: ["react", "react-dom", "@tanstack/react-router"],
  },
}));
