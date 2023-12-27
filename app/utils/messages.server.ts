import { createCookieSessionStorage, redirect } from "@remix-run/node";

const messagesStorage = createCookieSessionStorage({
  cookie: {
    name: "_messages",
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    maxAge: 60,
    secrets: process.env.SESSION_SECRET.split(","),
    secure: process.env.NODE_ENV === "production",
  },
});

export async function getMessagesStorage(request: Request) {
  const messages = await messagesStorage.getSession(
    request.headers.get("cookie")
  );

  return {
    messages,
    commitMessages: messagesStorage.commitSession,
    destroyMessages: messagesStorage.destroySession,
  };
}
