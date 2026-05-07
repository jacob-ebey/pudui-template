import { hydrate, Raw } from "pudui";
import { load } from "pudui/vite-runtime";

const root = hydrate(document, { load });

navigation.addEventListener("navigate", (event) => {
  if (!event.canIntercept || event.hashChange || event.downloadRequest) return;

  const url = new URL(event.destination.url);
  const method = event.formData ? "POST" : "GET";
  const signal = event.signal;

  if (url.origin !== location.origin) return;

  event.intercept({
    focusReset: event.formData ? "manual" : "after-transition",
    async handler() {
      try {
        const response = await fetch(url, {
          body: event.formData,
          method,
          mode: "same-origin",
          signal,
        });

        if (signal.aborted) return;

        const responseURL = new URL(response.url);
        if (responseURL.origin !== location.origin) {
          location.href = url.href;
          return;
        }

        const manualRedirect = response.headers.get("X-Manual-Redirect");
        const manualRedirectStatus = Number.parseInt(
          response.headers.get("X-Manual-Redirect-Status") || "NaN",
          10,
        );
        const redirectUrl = new URL(manualRedirect || "", location.origin);

        if (
          response.status === 204 &&
          manualRedirect &&
          Number.isSafeInteger(manualRedirectStatus)
        ) {
          if (redirectUrl.origin !== location.origin) {
            location.href = redirectUrl.href;
            return;
          }

          await navigation.navigate(manualRedirect, { history: "replace" }).finished;
          return;
        }

        if (!response.headers.get("content-type")?.includes("text/html")) {
          throw new Error(`Unexpected content type: ${response.headers.get("content-type")}`);
        }

        const html = await response.text();

        if (signal.aborted) return;

        root.rerender(<Raw>{html}</Raw>);
      } catch (error) {
        if (signal.aborted) return;

        console.error("Navigation error:", error);
        location.href = url.href;
      }
    },
  });
});
