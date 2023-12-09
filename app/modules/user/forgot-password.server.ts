import crypto from "crypto";
import { TEN_MINUTES } from "~/constants/time";
import { sendForgotPassword } from "~/modules/auth/send-forgot-password.sever";
import { prisma } from "~/libs/db.server";

type ForgotPasswordOption = {
  userId: string;
};

export async function forgotPassword({ userId }: ForgotPasswordOption) {
  const token = crypto.randomBytes(32).toString("hex");

  const resetTokenData = {
    expires: new Date(Date.now() + TEN_MINUTES),
    token,
    userId,
  };

  await prisma.passwordResetToken.upsert({
    where: { userId },
    create: resetTokenData,
    update: resetTokenData,
    select: { token: true },
  });

  await sendForgotPassword({ userId });
}
