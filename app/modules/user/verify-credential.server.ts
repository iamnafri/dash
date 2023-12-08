import { compare } from "bcryptjs";
import { prisma } from "~/utils/db.server";

type VerifyCredentialOption = {
  email: string;
  password: string;
};

export async function verifyCredential({
  email,
  password,
}: VerifyCredentialOption) {
  const user = await prisma.user.findUniqueOrThrow({
    where: { email },
    select: { id: true, password: { select: { hash: true } } },
  });

  if (!user || !user.password) return null;

  const matchedPassword = await compare(password, user.password.hash);

  if (!matchedPassword) return null;

  return user.id;
}
