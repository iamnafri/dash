import { remember } from "@epic-web/remember";
import nodemailer from "nodemailer";

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
  html,
}: {
  email: string;
  html: string;
}) {
  const mailInfo = await mailer.sendMail({
    from: '"Remix Dashboard" <no-reply@mail.io>',
    to: email,
    subject: "Remix Dashboard - Reset Password",
    html,
  });

  if (!mailInfo.messageId) return null;

  return mailInfo.messageId;
}

export async function sendUpdatedPasswordEmail({
  email,
  html,
}: {
  email: string;
  html: string;
}) {
  const mailInfo = await mailer.sendMail({
    from: '"Remix Dashboard" <no-reply@mail.io>',
    to: email,
    subject: "Remix Dashboard - Your password has changed",
    html,
  });

  if (!mailInfo.messageId) return null;

  return mailInfo.messageId;
}
