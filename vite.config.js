import { localPresentationPlugin } from "./server/localPresentation.js";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), localPresentationPlugin(process.env.AHM_DATA_ROOT || __dirname)],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  }
});
