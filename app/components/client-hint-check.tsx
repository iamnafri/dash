import { subscribeToSchemeChange } from "@epic-web/client-hints/color-scheme";
import { useRevalidator } from "@remix-run/react";
import { useEffect } from "react";
import { clientHints } from "~/utils/client-hints";

export function ClientHintCheck() {
  const { revalidate } = useRevalidator();

  useEffect(() => subscribeToSchemeChange(() => revalidate()), [revalidate]);

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: clientHints.getClientHintCheckScript(),
      }}
    />
  );
}
