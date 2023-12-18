import { createCookie } from "@remix-run/node";
import { ColorScheme } from "~/types";

const themeCookie = createCookie("theme", {
  maxAge: 34560000,
  sameSite: "lax",
});

export async function getTheme(
  request: Request
): Promise<ColorScheme | undefined> {
  const header = request.headers.get("Cookie");
  const theme = await themeCookie.parse(header);
  if (theme === "light" || theme === "dark") return theme;
  return undefined;
}

export function setTheme(theme: ColorScheme | "system") {
  if (theme === "system") {
    return themeCookie.serialize(undefined, {
      expires: new Date(0),
      maxAge: 0,
    });
  } else {
    return themeCookie.serialize(theme);
  }
}
