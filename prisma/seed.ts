import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();
async function main() {
  const password = await bcrypt.hash("Qwerty@123", 10);
  const budz = await prisma.user.create({
    select: { id: true },
    data: {
      email: "budz@mail.io",
      name: "Bob",
      username: "budz",
      password: { create: { hash: password } },
    },
  });
  console.log({ budz });
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
