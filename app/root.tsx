import "~/styles/tailwind.css";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  ShouldRevalidateFunctionArgs,
  useNavigate,
} from "@remix-run/react";
import { NextUIProvider } from "@nextui-org/react";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { getTheme } from "~/utils/theme.server";
import { clientHints } from "~/utils/client-hints";
import { ClientHintCheck } from "~/components/client-hint-check";
import { useTheme } from "~/utils/hooks/use-theme";

export function shouldRevalidate({
  formAction,
  defaultShouldRevalidate,
}: ShouldRevalidateFunctionArgs) {
  if (formAction === "/prefereces/theme") {
    return defaultShouldRevalidate;
  }

  return false;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const theme = await getTheme(request);
  const hints = clientHints.getHints(request);

  return json({ theme, hints });
}

export default function App() {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <html lang="en" className={theme}>
      <head>
        <ClientHintCheck />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen bg-background text-foreground font-sans antialiased">
        <NextUIProvider navigate={navigate}>
          <Outlet />
        </NextUIProvider>
        <ScrollRestoration />
        <LiveReload />
        <Scripts />
      </body>
    </html>
  );
}
