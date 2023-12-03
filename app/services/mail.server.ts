import { remember } from "@epic-web/remember";
import { render } from "@react-email/components";
import nodemailer from "nodemailer";
import { PasswordUpdated } from "~/emails/password-upated";
import { ResetPasswordLink } from "~/emails/reset-password-link";

export const mailer = remember("mailer", () =>
  nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.NODE_ENV === "production",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
);

export async function sendResetPasswordEmail({
  email,
  name,
  resetLink,
}: {
  email: string;
  name: string;
  resetLink: string;
}) {
  const mailInfo = await mailer.sendMail({
    from: '"Remix Dashboard" <no-reply@mail.io>',
    to: email,
    subject: "Remix Dashboard - Reset Password",
    html: render(ResetPasswordLink({ email, name, resetLink })),
  });

  if (!mailInfo.messageId) return null;

  return mailInfo.messageId;
}

export async function sendUpdatedPasswordEmail({
  email,
  name,
}: {
  email: string;
  name: string;
}) {
  const mailInfo = await mailer.sendMail({
    from: '"Remix Dashboard" <no-reply@mail.io>',
    to: email,
    subject: "Remix Dashboard - Your password has changed",
    html: render(PasswordUpdated({ email, name })),
  });

  if (!mailInfo.messageId) return null;

  return mailInfo.messageId;
}
