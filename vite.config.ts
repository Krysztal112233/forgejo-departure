import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

// Forgejo themes are plain CSS files named theme-<name>.css, looked up by
// filename in $FORGEJO_CUSTOM/public/assets/css/ — so output names must be
// stable (no content hashing) and land in dist/css/, with dist/ mounted into
// the container at /data/gitea/public/assets.
export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        "theme-departure-light": "src/theme-departure-light.css",
        "theme-departure-dark": "src/theme-departure-dark.css",
        "theme-departure-auto": "src/theme-departure-auto.css",
      },
      output: {
        assetFileNames: (assetInfo) =>
          assetInfo.names?.some((n) => n.endsWith(".css"))
            ? "css/[name][extname]"
            : "[name][extname]",
      },
    },
  },
});
