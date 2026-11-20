import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  // "./" makes every asset path relative, so the same build works on
  // username.github.io/repo-name/, username.github.io, or a custom domain.
  base: "./",
  // Permit the hosted development and preview URLs, without disabling host checks.
  server: { allowedHosts: [".e2b.app"] },
  preview: { allowedHosts: [".e2b.app"] },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
