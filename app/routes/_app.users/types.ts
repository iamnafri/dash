import { User as UserModel } from "@prisma/client";

export type User = Omit<UserModel, "createdAt" | "updatedAt"> & {
  roles: { name: string }[];
};
