import { prisma } from "~/libs/db.server";

type GetUserByIdOptions = {
  id: string;
};

export async function getUserById({ id }: GetUserByIdOptions) {
  return await prisma.user.findFirst({
    where: { id },
  });
}
