import { prisma } from "~/libs/db.server";

type GetResetTokenOptions = {
  token: string;
};

export async function getResetToken({ token }: GetResetTokenOptions) {
  return await await prisma.passwordResetToken.findFirst({
    where: { token, expires: { gt: new Date() } },
    select: { userId: true },
  });
}
