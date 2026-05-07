import { createRouter } from "remix/fetch-router";

import marketingController from "#controllers/marketing/controller.tsx";
import { manualFetchRedirects } from "#lib/manual-fetch-redirects.ts";
import { routes } from "#routes.ts";

export const router = createRouter({
  middleware: [manualFetchRedirects()],
});

router.map(routes.marketing, marketingController);
