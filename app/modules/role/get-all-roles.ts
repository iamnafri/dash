import { prisma } from "~/libs/db.server";

type GetAllRolesOptions = {};

export async function getAllRoles() {
  return await prisma.role.findMany({
    select: { name: true, description: true },
  });
}
