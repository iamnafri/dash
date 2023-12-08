import { prisma } from "~/utils/db.server";

type GetSessionById = {
  id: string;
};

export async function getSessionById({ id }: GetSessionById) {
  return await prisma.session.findUnique({
    select: { user: { select: { id: true } } },
    where: { id, expires: { gt: new Date() } },
  });
}
