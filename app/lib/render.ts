import { type Child, renderToStringAsync } from "pudui/server";
import { preload } from "pudui/vite-runtime";

export async function render(child: Child) {
  return new Response(
    await renderToStringAsync(child, {
      preload,
    }),
    {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    },
  );
}
