import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  build: { target: "safari10" },
  plugins: [react()],
  server: {
    // Evita CORS: o browser fala com o Vite, que encaminha ao json-server
    proxy: {
      "/api": {
        target: "http://localhost:3005",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
