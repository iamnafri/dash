import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();
async function main() {
  console.log("🌱 Seeding...");
  console.time(`🌱 Database has been seeded`);

  console.time("🔑 Created permissions...");
  const entities = ["user"];
  const actions = ["create", "read", "update", "delete"];
  const accesses = ["own", "any"] as const;
  for (const entity of entities) {
    for (const action of actions) {
      for (const access of accesses) {
        await prisma.permission.create({ data: { entity, action, access } });
      }
    }
  }
  console.timeEnd("🔑 Created permissions...");

  console.time("👑 Created roles...");
  await prisma.role.create({
    data: {
      name: "admin",
      permissions: {
        connect: await prisma.permission.findMany({
          select: { id: true },
          where: { access: "any" },
        }),
      },
    },
  });
  await prisma.role.create({
    data: {
      name: "user",
      permissions: {
        connect: await prisma.permission.findMany({
          select: { id: true },
          where: { access: "own" },
        }),
      },
    },
  });
  console.timeEnd("👑 Created roles...");

  console.time("👤 Created user...");
  const password = await bcrypt.hash("budz", 10);
  await prisma.user.create({
    select: { id: true },
    data: {
      email: "budz@mail.io",
      name: "Budz",
      password: { create: { hash: password } },
      roles: { connect: { name: "admin" } },
    },
  });
  console.timeEnd("👤 Created user...");

  console.timeEnd(`🌱 Database has been seeded`);
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
