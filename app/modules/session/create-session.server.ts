import { ONE_MONTH } from "~/constants/time";
import { prisma } from "~/utils/db.server";

type CreateSessionOptions = {
  userId: string;
};

export async function createSession({ userId }: CreateSessionOptions) {
  return await prisma.session.create({
    select: { id: true, expires: true, userId: true },
    data: {
      expires: new Date(Date.now() + ONE_MONTH),
      userId: userId,
    },
  });
}
