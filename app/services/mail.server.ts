import { remember } from "@epic-web/remember";
import nodemailer from "nodemailer";

export const mailer = remember("mailer", () =>
  nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "donna30@ethereal.email",
      pass: "dw9UexekRZuNSkjS25",
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

  console.log(mailInfo);

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
