import bcrypt from "bcryptjs";

import { prisma } from "~/libs/db.server";

type CreateUserOptions = {
  name: string;
  email: string;
  roles: string[];
};

export async function createUser({ name, email, roles }: CreateUserOptions) {
  const randomPassowrd = Math.random().toString(36).slice(-8);
  const hashedPassword = await bcrypt.hash(randomPassowrd, 10);

  return await prisma.user.create({
    data: {
      name,
      email,
      password: { create: { hash: hashedPassword } },
      roles: {
        connect: roles.map((role) => ({ name: role })),
      },
    },
  });
}
