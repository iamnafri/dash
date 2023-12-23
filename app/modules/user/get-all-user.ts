import { prisma } from "~/libs/db.server";

type GetAllUsersOptions = {
  pagination: {
    page: number;
    limit: number;
  };
  search?: string;
  filters?: {
    roles?: string[];
  };
};

export async function getAllUsers({
  pagination,
  search = "",
  filters,
}: GetAllUsersOptions) {
  return await prisma.user
    .paginate({
      orderBy: { name: "asc" },
      where: {
        OR: [{ name: { contains: search } }, { email: { contains: search } }],
        AND: {
          roles: {
            some: {
              name: {
                in: filters?.roles,
              },
            },
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        roles: { select: { name: true } },
      },
    })
    .withPages({ ...pagination });
}
