import { conform, useForm } from "@conform-to/react";
import { getFieldsetConstraint, parse } from "@conform-to/zod";
import { EyeIcon } from "@heroicons/react/24/outline";
import { Button, Card, CardBody, Input } from "@nextui-org/react";
import {
  type ActionFunctionArgs,
  type MetaFunction,
  json,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { z } from "zod";
import { Logo } from "~/components";
import { AlertProps } from "~/components/ui";
import { requireAnonymous, resetUserPassword } from "~/services/auth.server";
import { sendUpdatedPasswordEmail } from "~/services/mail.server";
import { prisma } from "~/utils/db.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Reset Password - Remix Dashboard" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

const ResetPasswordSchema = z
  .object({
    userId: z.string(),
    password: z
      .string({ required_error: "Password is required" })
      .min(6, { message: "Password is too short" })
      .max(100, { message: "Password is too long" }),
    confirmPassword: z
      .string({ required_error: "Password is required" })
      .min(6, { message: "Password is too short" })
      .max(100, { message: "Password is too long" }),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        path: ["confirmPassword"],
        code: z.ZodIssueCode.custom,
        message: "The passwords must match",
      });
    }
  });

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAnonymous(request);
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return json({ status: "error", userId: null } as const, {
      status: 400,
    });
  }

  const user = await prisma.passwordResetToken.findUnique({
    where: { token, expires: { gt: new Date() } },
    select: { userId: true },
  });

  if (!user) {
    return json({ status: "error", userId: null } as const, {
      status: 400,
    });
  }

  return json({ status: "done", userId: user.userId });
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  const submission = parse(formData, {
    schema: ResetPasswordSchema,
  });

  if (submission.intent !== "submit") {
    return json({ status: "idle", submission } as const);
  }

  if (!submission.value?.password || !submission.value.userId) {
    return json({ status: "error", submission } as const, { status: 400 });
  }

  const { password, userId } = submission.value;

  const { email, name } = await resetUserPassword({ userId, password });

  sendUpdatedPasswordEmail({
    name,
    email,
  });

  return redirect("/login");
};

export default function ResetPassword() {
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [form, { password, confirmPassword, userId }] = useForm({
    id: "reset-pasword-form",
    constraint: getFieldsetConstraint(ResetPasswordSchema),
    defaultValue: { userId: loaderData.userId },
    lastSubmission: actionData?.submission,
    onValidate({ formData }) {
      return parse(formData, { schema: ResetPasswordSchema });
    },
    shouldRevalidate: "onBlur",
  });

  return (
    <>
      <div className="flex flex-col items-center gap-4">
        <Logo className="w-16 h-16" />
        <h1 className="block text-2xl font-bold text-slate-800 dark:text-white">
          Reset Password
        </h1>
      </div>
      <Card shadow="sm" classNames={{ base: "w-full" }}>
        <CardBody className="p-6">
          {!loaderData.userId ? (
            <AlertProps variant="danger" size="small">
              Invalid token
            </AlertProps>
          ) : (
            <Form
              method="post"
              className="flex flex-col justify-between gap-4"
              {...form.props}
            >
              <Input
                endContent={
                  <EyeIcon className="text-default-400 h-6 w-6 pointer-events-none" />
                }
                label="Password"
                labelPlacement="outside"
                placeholder="Enter your password"
                type="password"
                variant="flat"
                name="password"
                defaultValue={password.defaultValue}
                errorMessage={password.error}
                isInvalid={!!password.error}
              />

              <Input
                endContent={
                  <EyeIcon className="text-default-400 h-6 w-6 pointer-events-none" />
                }
                label="Confirmation Password"
                labelPlacement="outside"
                placeholder="Enter your confirmation password"
                type="password"
                variant="flat"
                name="confirmPassword"
                defaultValue={confirmPassword.defaultValue}
                errorMessage={confirmPassword.error}
                isInvalid={!!confirmPassword.error}
              />

              <input
                {...conform.input(userId, {
                  type: "hidden",
                })}
              />

              <Button
                color="primary"
                type="submit"
                isLoading={isSubmitting}
                className="mt-5"
                disableRipple
                disableAnimation
              >
                Change Password
              </Button>
            </Form>
          )}
        </CardBody>
      </Card>
    </>
  );
}
