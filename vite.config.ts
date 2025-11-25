// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  // ⚠️ No declares PostCSS aquí. Tailwind v4 usa postcss.config.js
  // con "@tailwindcss/postcss". Mantén este archivo sin 'css.postcss'.

  resolve: {
    alias: {
      "@": "/src",
    },
  },

  server: {
    host: true,         // permite exponer en LAN (equivale a --host)
    port: 5173,
    strictPort: true,
    open: false,
    cors: true,

    // OneDrive/Windows a veces rompe el watcher; polling lo hace más estable
    watch: {
      usePolling: true,
      interval: 100,
      ignored: ["**/node_modules/**"],
    },

    hmr: {
      overlay: true,    // ponlo en false si te molesta el overlay de errores
    },

    // Proxy SOLO para API (Laravel en :8000)
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8001",
        changeOrigin: true,
        secure: false,
      },
      "/sanctum": {
        target: "http://127.0.0.1:8001",
        changeOrigin: true,
        secure: false,
      },
    },
  },

  preview: {
    host: true,
    port: 4173,
    strictPort: true,
    cors: true,
  },

  build: {
    target: "esnext",
    outDir: "dist",
    sourcemap: true,   // quítalo en producción si no lo necesitas
    chunkSizeWarningLimit: 1000, // Aumentar límite de advertencia a 1MB
    rollupOptions: {
      output: {
        manualChunks: {
          // Separar vendor chunks grandes
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'utils-vendor': ['axios'],
        },
      },
    },
  },
});
