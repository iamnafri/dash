import { prisma } from "~/libs/db.server";

type GetUserByEmailOptions = {
  email: string;
};

export async function getUserByEmail({ email }: GetUserByEmailOptions) {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
}
