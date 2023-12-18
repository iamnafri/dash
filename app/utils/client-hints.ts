import { getHintUtils } from "@epic-web/client-hints";
import { clientHint as colorSchemeHint } from "@epic-web/client-hints/color-scheme";

export const clientHints = getHintUtils({
  theme: colorSchemeHint,
});
