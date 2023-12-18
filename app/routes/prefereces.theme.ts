import { ActionFunctionArgs, json } from "@remix-run/node";
import { setTheme } from "~/utils/theme.server";
import { z } from "zod";
import { parse } from "@conform-to/zod";

const ThemeFormSchema = z.object({
  theme: z.enum(["system", "light", "dark"]),
});

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const submission = parse(formData, {
    schema: ThemeFormSchema,
  });

  if (submission.intent !== "submit") {
    return json({ status: "idle", submission } as const);
  }

  if (!submission.value) {
    return json({ status: "error", submission } as const, { status: 400 });
  }

  const { theme } = submission.value;

  return json(
    { success: true, submission },
    {
      headers: {
        "Set-Cookie": await setTheme(theme),
      },
    }
  );
}
