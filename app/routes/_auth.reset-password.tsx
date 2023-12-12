import { conform, useForm } from "@conform-to/react";
import { getFieldsetConstraint, parse } from "@conform-to/zod";
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
import { Logo } from "~/components/logo";
import { Alert } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { InputPassword } from "~/components/ui/input-password";
import { getResetToken } from "~/modules/user/get-reset-token.server";
import { resetPassword } from "~/modules/user/reset-password.server";
import { requireAnonymous } from "~/utils/auth.server";

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
    throw new Response(null, {
      status: 404,
    });
  }

  const user = await getResetToken({ token });

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

  await resetPassword({ userId, password });

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
      <div className="flex flex-col items-center gap-unit-4">
        <Logo className="w-unit-16 h-unit-16" />
        <h1 className="block text-2xl font-bold text-slate-800 dark:text-white">
          Reset Password
        </h1>
      </div>
      {!loaderData.userId ? (
        <Alert variant="danger" size="small">
          Invalid token
        </Alert>
      ) : (
        <Form
          method="post"
          className="flex flex-col justify-between gap-unit-4"
          {...form.props}
        >
          <InputPassword
            label="Password"
            placeholder="Enter your password"
            name="password"
            defaultValue={password.defaultValue}
            errorMessage={password.error}
            isInvalid={!!password.error}
          />

          <InputPassword
            label="Confirmation Password"
            placeholder="Enter your confirmation password"
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

          <Button type="submit" size="lg" isLoading={isSubmitting}>
            Change password
          </Button>
        </Form>
      )}
    </>
  );
}
