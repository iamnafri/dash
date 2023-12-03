import { Password, Session, User } from "@prisma/client";
import { redirect } from "@remix-run/node";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { authSessionStorage } from "~/services/session.server";
import { prisma } from "~/utils/db.server";

// Session expiration in one month
const SESSION_EXPIRATION_TIME = 1000 * 60 * 60 * 24 * 30;
const sessionExpirationDate = new Date(Date.now() + SESSION_EXPIRATION_TIME);

// Token expiration in 10 minutes
const RESET_TOKEN_EXPIRATION_TIME = 1000 * 60 * 10;
const resetTokenExpirationDate = new Date(
  Date.now() + RESET_TOKEN_EXPIRATION_TIME
);

export async function createHashData(value: string) {
  const hash = await bcrypt.hash(value, 10);
  return hash;
}

export async function verifyUserCredential(
  email: User["email"],
  password: Password["hash"]
) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, password: { select: { hash: true } } },
  });

  if (!user || !user.password) return null;

  const matchedPassword = await bcrypt.compare(password, user.password.hash);

  if (!matchedPassword) return null;

  return user.id;
}

export async function handleNewLoginSession(
  request: Request,
  session: Pick<Session, "expires" | "id" | "userId">
) {
  const authSession = await authSessionStorage.getSession(
    request.headers.get("cookie")
  );
  authSession.set("sessionId", session.id);

  return redirect("/", {
    headers: {
      "set-cookie": await authSessionStorage.commitSession(authSession, {
        expires: session.expires,
      }),
    },
  });
}

export async function login({
  email,
  password,
}: {
  email: User["email"];
  password: string;
}) {
  const userId = await verifyUserCredential(email, password);

  if (!userId) return null;

  const session = await prisma.session.create({
    select: { id: true, expires: true, userId: true },
    data: {
      expires: sessionExpirationDate,
      userId: userId,
    },
  });

  return session;
}

export async function logout(request: Request) {
  const authSession = await authSessionStorage.getSession(
    request.headers.get("cookie")
  );
  const sessionId = authSession.get("sessionId");

  if (sessionId) prisma.session.deleteMany({ where: { id: sessionId } });

  throw redirect("/login", {
    headers: {
      "set-cookie": await authSessionStorage.destroySession(authSession),
    },
  });
}

export async function requireUserId(request: Request) {
  const authSession = await authSessionStorage.getSession(
    request.headers.get("cookie")
  );
  const sessionId = authSession.get("sessionId");

  if (!sessionId) return null;

  const session = await prisma.session.findUnique({
    select: { user: { select: { id: true } } },
    where: { id: sessionId, expires: { gt: new Date() } },
  });
  if (!session?.user) {
    throw redirect("/", {
      headers: {
        "set-cookie": await authSessionStorage.destroySession(authSession),
      },
    });
  }
  return session.user.id;
}

export async function requireAnonymous(request: Request) {
  const userId = await requireUserId(request);
  if (userId) {
    throw redirect("/");
  }
}

export async function createResetToken(userId: User["id"]) {
  const token = crypto.randomBytes(32).toString("hex");

  const resetTokenData = {
    expires: resetTokenExpirationDate,
    token,
    userId,
  };

  await prisma.passwordResetToken.upsert({
    where: { userId },
    create: resetTokenData,
    update: resetTokenData,
    select: { token: true },
  });

  return token;
}

export async function resetUserPassword({
  userId,
  password,
}: {
  userId: User["id"];
  password: string;
}) {
  const hashedPassword = await createHashData(password);
  return prisma.user.update({
    where: { id: userId },
    data: {
      password: {
        update: {
          hash: hashedPassword,
        },
      },
      passwordResetToken: {
        delete: {
          userId,
        },
      },
      session: {
        deleteMany: {
          userId,
        },
      },
    },
  });
}
