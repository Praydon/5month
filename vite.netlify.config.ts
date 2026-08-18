import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const siteOrigin = (process.env.URL
  ?? process.env.DEPLOY_PRIME_URL
  ?? "https://five-months-zhanym.jamesmasterbro.chatgpt.site")
  .replace(/\/$/, "");

export default defineConfig({
  plugins: [
    react(),
    {
      name: "social-preview-origin",
      transformIndexHtml(html) {
        return html.replaceAll("__SITE_ORIGIN__", siteOrigin);
      },
    },
  ],
  publicDir: "public",
  build: {
    outDir: "netlify-dist",
    emptyOutDir: true,
  },
});
