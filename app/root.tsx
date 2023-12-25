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
import { ColorScheme } from "~/types";
import { GeneralErrorBoundary } from "~/components/error-boundary";

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

function Document({
  children,
  theme = "light",
  title,
}: {
  children: React.ReactNode;
  theme?: ColorScheme;
  title?: string;
}) {
  const navigate = useNavigate();

  return (
    <html lang="en" className={theme}>
      <head>
        <ClientHintCheck />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {title ? <title>{title}</title> : null}
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen bg-background text-foreground font-sans antialiased">
        <NextUIProvider navigate={navigate}>{children}</NextUIProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export default function App() {
  const theme = useTheme();

  return (
    <Document theme={theme}>
      <Outlet />
    </Document>
  );
}

export function ErrorBoundary() {
  return (
    <Document title="Oops! Something went wrong">
      <GeneralErrorBoundary />
    </Document>
  );
}
