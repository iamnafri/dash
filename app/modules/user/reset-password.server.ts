import { hash } from "bcryptjs";
import { sendResetPassword } from "~/modules/auth/send-reset-password.sever";
import { prisma } from "~/libs/db.server";

type ResetPasswordOption = {
  userId: string;
  password: string;
};

export async function resetPassword({ userId, password }: ResetPasswordOption) {
  const hashedPassword = await hash(password, 10);

  await prisma.user.update({
    where: { id: userId },
    select: { email: true, name: true },
    data: {
      password: {
        update: {
          hash: hashedPassword,
        },
      },
      passwordResetToken: {
        delete: {
          userId,
        },
      },
      session: {
        deleteMany: {
          userId,
        },
      },
    },
  });

  await sendResetPassword({ userId });
}
