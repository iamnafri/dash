import { createElement } from "react";
import { ForgotPasswordTemplate } from "~/emails/forgot-password";
import { prisma } from "~/utils/db.server";
import { mailer, renderReactEmail } from "~/utils/mail.server";

type SendForgotPasswordOption = {
  userId: string;
};

export async function sendForgotPassword({ userId }: SendForgotPasswordOption) {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
    include: {
      passwordResetToken: {
        select: { token: true },
      },
    },
  });

  if (!user) return null;

  const token = user.passwordResetToken?.token;

  if (!token) return null;

  const resetPasswordLink = `${process.env.WEBAPP_URL}/reset-password?token=${token}`;

  const template = createElement(ForgotPasswordTemplate, {
    name: user.name,
    email: user.email,
    resetPasswordLink,
  });

  const { html, text } = await renderReactEmail(template);

  return await mailer
    .sendMail({
      to: {
        address: user.email,
        name: user.name || "",
      },
      from: {
        name: process.env.SMTP_FROM_NAME || "Remix Dashboard",
        address: process.env.SMTP_FROM_EMAIL || "noreply@mail.io",
      },
      subject: "Forgot Password - Remix Dashboard",
      html,
      text,
    })
    .catch(console.error);
}
