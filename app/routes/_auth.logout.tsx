import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { removeSession } from "~/modules/session/remove-session.server";
import { getAutSessionStorage } from "~/utils/auth.server";

export async function loader() {
  return redirect("/");
}

export async function action({ request }: ActionFunctionArgs) {
  const { authSession, destroyAuthSession } = await getAutSessionStorage(
    request
  );
  const sessionId = authSession.get("sessionId");

  if (sessionId) removeSession({ sessionId });

  throw redirect("/login", {
    headers: {
      "set-cookie": await destroyAuthSession(authSession),
    },
  });
}
