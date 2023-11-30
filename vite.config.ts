import { unstable_vitePlugin as remix } from "@remix-run/dev";
import morgan from "morgan";
import { defineConfig, ViteDevServer } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [morganPlugin(), remix(), tsconfigPaths()],
});

function morganPlugin() {
  return {
    name: "morgan-plugin",
    configureServer(server: ViteDevServer) {
      return () => {
        server.middlewares.use(morgan("tiny"));
      };
    },
  };
}
