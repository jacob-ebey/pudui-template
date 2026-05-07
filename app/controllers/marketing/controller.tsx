import type { Controller } from "remix/fetch-router";
import mascot from "pudui/assets/mascot.svg?url";

import { Document } from "#components/document.tsx";
import { render } from "#lib/render.ts";
import type { routes } from "#routes.ts";

export default {
  actions: {
    home() {
      return render(
        <Document
          title="Pudui Template"
          description="A template for building Remix apps with Pudui."
        >
          <div class="flex min-h-screen items-center justify-center bg-white px-6 text-slate-900">
            <main class="w-full max-w-xl">
              <div class="rounded-2xl border border-slate-200 p-8 shadow-sm">
                <div class="mb-3">
                  <img src={mascot} alt="Pudui logo" class="h-20 w-20 mx-auto" />
                </div>

                <h1 class="text-3xl font-semibold tracking-tight">Welcome to your new app</h1>

                <p class="mt-3 text-slate-600">
                  This starter page is here to help you begin. Replace it with your own content when
                  you're ready.
                </p>

                <div class="mt-6 rounded-lg bg-slate-50 p-4">
                  <p class="text-sm text-slate-500">Edit this page to get started.</p>

                  <code class="mt-2 block text-sm font-medium text-slate-800 overflow-x-auto">
                    app/controllers/marketing/controller.tsx
                  </code>
                </div>
              </div>
            </main>
          </div>
        </Document>,
      );
    },
  },
} satisfies Controller<typeof routes.marketing>;
