import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, import.meta.dirname, "");
  const basePath = env.VITE_BASE_PATH || "/";
  const base = basePath.endsWith("/") ? basePath : `${basePath}/`;

  return {
    base,
    plugins: [react(), tailwindcss()],
    server: {
      host: "localhost",
      port: 5173,
      watch: {
        usePolling: true,
      },
    },
    preview: {
      host: "localhost",
      port: 4173,
    },
  };
});
