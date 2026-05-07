import tailwindcss from "@tailwindcss/vite";
import pudui from "pudui/vite-plugin";
import { createRequestListener } from "remix/node-fetch-server";
import { defineConfig, type Plugin, type RunnableDevEnvironment } from "vite-plus";

const browserEntry = "app/browser.tsx";
const routerEntry = "app/router.ts";

export default defineConfig({
  lint: {
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
  fmt: {},
  builder: {
    async buildApp(builder) {
      await builder.build(builder.environments.client);
      await builder.build(builder.environments.ssr);
    },
  },
  environments: {
    ssr: {
      build: {
        outDir: "dist/ssr",
        rolldownOptions: {
          input: {
            server: routerEntry,
          },
        },
      },
    },
  },
  plugins: [tailwindcss(), pudui({ browserEntry: browserEntry }), devServer()],
});

function devServer(): Plugin {
  return {
    name: "server",
    configureServer(server) {
      return () => {
        const listener = createRequestListener(async (request) => {
          const runner = (server.environments.ssr as RunnableDevEnvironment).runner;
          const { router } = await runner.import<typeof import("./app/router")>(routerEntry);

          return router.fetch(request);
        });
        server.middlewares.use((req, res) => {
          req.url = req.originalUrl;
          listener(req, res);
        });
      };
    },
    async configurePreviewServer(server) {
      // @ts-ignore - file is JS and may or may not exist yet
      const { router } = await import("./dist/ssr/server.mjs");
      const listener = createRequestListener(router.fetch);
      return () => {
        server.middlewares.use((req, res) => {
          req.url = req.originalUrl;
          listener(req, res);
        });
      };
    },
  };
}
