import { renderAsync } from "@react-email/components";
import nodemailer from "nodemailer";
import { ReactElement } from "react";

export const mailer = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.NODE_ENV === "production",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function renderReactEmail(template: ReactElement) {
  const [html, text] = await Promise.all([
    renderAsync(template),
    renderAsync(template, { plainText: true }),
  ]);
  return { html, text };
}
