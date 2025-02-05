import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ isSsrBuild }) => ({
  server: {
    allowedHosts: ["localhost", "127.0.0.1", "host.docker.internal"],
  },
  ssr: {
    noExternal: ["@apollo/client"],
  },
  build: {
    rollupOptions: isSsrBuild
      ? {
          input: "./src/server/app.ts",
        }
      : undefined,
  },
  plugins: [reactRouter(), tsconfigPaths()],
}));
