import { type Child, Component } from "pudui";
import { entry } from "pudui/macros";

import "./document.css";

type DocumentProps = {
  children?: Child;
  description: string;
  title: string;
};

export function Document() {
  const [script, deps, styles] = entry();

  return new Component<DocumentProps>({
    render({ children, title, description }) {
      return (
        <html lang="en">
          <head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>{title}</title>
            <meta name="description" content={description} />
            {styles.map((href) => (
              <link rel="stylesheet" href={href} />
            ))}
            {deps.map((dep) => (
              <link rel="modulepreload" href={dep} />
            ))}
            <script type="module" src={script} />
          </head>
          <body>{children}</body>
        </html>
      );
    },
  });
}
