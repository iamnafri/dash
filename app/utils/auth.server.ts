import { Session } from "@prisma/client";
import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { getSessionById } from "~/modules/session/get-session-by-id.server";

const authSessionStorage = createCookieSessionStorage({
  cookie: {
    name: "_session",
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secrets: process.env.SESSION_SECRET.split(","),
    secure: process.env.NODE_ENV === "production",
  },
});

export async function getAutSessionStorage(request: Request) {
  const authSession = await authSessionStorage.getSession(
    request.headers.get("cookie")
  );

  return {
    authSession,
    commitAuthSession: authSessionStorage.commitSession,
    destroyAuthSession: authSessionStorage.destroySession,
  };
}

export async function handleNewLoginSession(
  request: Request,
  session: Pick<Session, "expires" | "id" | "userId">
) {
  const { authSession, commitAuthSession } =
    await getAutSessionStorage(request);
  authSession.set("sessionId", session.id);

  return redirect("/", {
    headers: {
      "set-cookie": await commitAuthSession(authSession, {
        expires: session.expires,
      }),
    },
  });
}

export async function requireUserId(request: Request) {
  const { authSession, destroyAuthSession } =
    await getAutSessionStorage(request);
  const sessionId = authSession.get("sessionId");

  if (!sessionId) throw redirect("/login");

  const session = await getSessionById({ id: sessionId });

  if (!session?.user.id) {
    throw redirect("/login", {
      headers: {
        "set-cookie": await destroyAuthSession(authSession),
      },
    });
  }
  return session.user.id;
}

export async function requireAnonymous(request: Request) {
  const { authSession } = await getAutSessionStorage(request);
  const sessionId = authSession.get("sessionId");
  if (sessionId) {
    throw redirect("/");
  }
}
