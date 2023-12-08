import { prisma } from "~/utils/db.server";

type RemoveSessionOptions = {
  sessionId: string;
};

export async function removeSession({ sessionId }: RemoveSessionOptions) {
  return await prisma.session.deleteMany({ where: { id: sessionId } });
}
