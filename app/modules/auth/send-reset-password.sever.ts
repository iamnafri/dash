import { createElement } from "react";
import { ResetPasswordTemplate } from "~/emails/reset-password";
import { prisma } from "~/utils/db.server";
import { mailer, renderReactEmail } from "~/utils/mail.server";

type SendResetPasswordOption = {
  userId: string;
};

export async function sendResetPassword({ userId }: SendResetPasswordOption) {
  const user = await prisma.user.findFirst({
    where: { id: userId },
  });

  if (!user) return null;

  const template = createElement(ResetPasswordTemplate, {
    name: user.name,
    email: user.email,
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
      subject: "Password Reset Success! - Remix Dashboard",
      html,
      text,
    })
    .catch(console.error);
}
