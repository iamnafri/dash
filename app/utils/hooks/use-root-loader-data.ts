import { SerializeFrom } from "@remix-run/node";
import { useMatches } from "@remix-run/react";
import { loader as rootLoader } from "~/root";

export function useRootLoaderData() {
  const rootLoaderData = useMatches()[0].data as SerializeFrom<
    typeof rootLoader
  >;

  return rootLoaderData;
}
