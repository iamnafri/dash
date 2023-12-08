import { z, TypeOf } from "zod";

const schema = z.object({
  DATABASE_URL: z.string(),
  SMTP_HOST: z.string(),
  SMTP_PORT: z.string(),
  SMTP_USER: z.string(),
  SMTP_PASS: z.string(),
  SMTP_FROM_NAME: z.string(),
  SMTP_FROM_EMAIL: z.string(),
  SESSION_SECRET: z.string(),
  WEBAPP_URL: z.string(),
});

declare global {
  namespace NodeJS {
    interface ProcessEnv extends TypeOf<typeof schema> {}
  }
}

function init() {
  const parsed = schema.safeParse(process.env);

  if (parsed.success === false) {
    console.error(
      "Missing environment variables:",
      parsed.error.flatten().fieldErrors
    );

    throw new Error("Missing environment variables");
  }
}

init();
