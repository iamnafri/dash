import { useForm } from "@conform-to/react";
import { getFieldsetConstraint, parse } from "@conform-to/zod";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { Button, Card, CardBody, Input } from "@nextui-org/react";
import {
  type ActionFunctionArgs,
  type MetaFunction,
  json,
  LoaderFunctionArgs,
} from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { z } from "zod";
import { Logo } from "~/components";
import { AlertProps } from "~/components/ui";
import { createResetToken, requireAnonymous } from "~/services/auth.server";
import { sendResetPasswordEmail } from "~/services/mail.server";
import { prisma } from "~/utils/db.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Forgot Password - Remix Dashboard" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

const ForgotPasswordSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Email is invalid"),
});

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAnonymous(request);
  return json({});
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const requestUrl = new URL(request.url);

  const submission = await parse(formData, { schema: ForgotPasswordSchema });

  if (submission.intent !== "submit") {
    return json({ status: "idle", submission } as const);
  }

  if (!submission.value) {
    return json({ status: "error", submission } as const, { status: 400 });
  }

  const { email } = submission.value;

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (!user) {
    return json({ status: "done", submission });
  }

  const resetToken = await createResetToken(user.id);

  await sendResetPasswordEmail({
    email,
    html: `<a href="${requestUrl.origin}/reset-password?token=${resetToken}">Reset Paassword</a>`,
  });

  return json({ status: "done", submission });
};

export default function ForgotPassword() {
  const forgotPassword = useFetcher<typeof action>();

  const [form, { email }] = useForm({
    id: "forgot-password-form",
    constraint: getFieldsetConstraint(ForgotPasswordSchema),
    lastSubmission: forgotPassword.data?.submission,
    onValidate({ formData }) {
      return parse(formData, { schema: ForgotPasswordSchema });
    },
    shouldRevalidate: "onBlur",
  });

  return (
    <>
      <div className="flex flex-col items-center gap-4">
        <Logo className="w-16 h-16" />
        <h1 className="block text-2xl font-bold text-slate-800 dark:text-white">
          Forgot Password
        </h1>
      </div>
      <Card shadow="sm" classNames={{ base: "w-full" }}>
        <CardBody className="p-6">
          {forgotPassword.data?.status === "done" && (
            <AlertProps variant="success" size="small" className="mb-5">
              Please check your email
            </AlertProps>
          )}
          <forgotPassword.Form
            method="post"
            className="flex flex-col justify-between"
            {...form.props}
          >
            <Input
              autoComplete="off"
              endContent={
                <EnvelopeIcon className="text-default-400 h-6 w-6 pointer-events-none" />
              }
              label="Email"
              labelPlacement="outside"
              placeholder="Enter your email"
              variant="flat"
              name="email"
              type="email"
              defaultValue={email.defaultValue}
              errorMessage={email.error}
              isInvalid={!!email.error}
            />

            <Button
              color="primary"
              type="submit"
              isLoading={forgotPassword.state === "submitting"}
              className="mt-5"
              disableRipple
              disableAnimation
            >
              Reset Password
            </Button>
          </forgotPassword.Form>
        </CardBody>
      </Card>
    </>
  );
}
