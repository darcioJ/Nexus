import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  css: {
    transformer: "lightningcss", // Força o uso do motor moderno
  },
  build: {
    cssMinify: "lightningcss",
  },
  server: {
    allowedHosts: ["nexus.local"],
  },
});
