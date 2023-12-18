import { parse } from "@conform-to/zod";
import { useFetchers } from "@remix-run/react";
import { z } from "zod";
import { useRootLoaderData } from "~/utils/hooks/use-root-loader-data";

const ThemeFormSchema = z.object({
  theme: z.enum(["system", "light", "dark"]),
});

export function useOptimisticTheme() {
  const fetchers = useFetchers();
  const themeFetcher = fetchers.find(
    (f) => f.formAction === "/prefereces/theme"
  );

  if (themeFetcher && themeFetcher.formData) {
    const submission = parse(themeFetcher.formData, {
      schema: ThemeFormSchema,
    });
    return submission.value?.theme;
  }
}

export function useTheme() {
  const rootLoaderData = useRootLoaderData();
  const optimisticMode = useOptimisticTheme();

  if (optimisticMode) {
    return optimisticMode === "system"
      ? rootLoaderData.hints.theme
      : optimisticMode;
  }

  return rootLoaderData.theme ?? rootLoaderData.hints.theme;
}
