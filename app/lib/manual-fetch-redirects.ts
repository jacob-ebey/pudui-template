import type { Middleware } from "remix/fetch-router";

export function manualFetchRedirects(): Middleware {
  return async ({ request }, next) => {
    const response = await next();
    if (request.headers.get("Sec-Fetch-Site") !== "same-origin") {
      return response;
    }

    const location = response.headers.get("Location");
    if (location && response.status >= 300 && response.status < 400) {
      const headers = new Headers(response.headers);
      headers.delete("Location");
      headers.set("X-Manual-Redirect", location);
      headers.set("X-Manual-Redirect-Status", response.status.toString());

      return new Response(null, {
        status: 204,
        headers,
      });
    }
    return response;
  };
}
