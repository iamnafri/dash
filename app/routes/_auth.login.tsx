import { useForm } from "@conform-to/react";
import { getFieldsetConstraint, parse } from "@conform-to/zod";
import { Link } from "@nextui-org/react";
import {
  type ActionFunctionArgs,
  type MetaFunction,
  json,
  LoaderFunctionArgs,
} from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { z } from "zod";
import { Logo } from "~/components/logo";
import { Alert } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";
import { Input } from "~/components/ui/input";
import { InputPassword } from "~/components/ui/input-password";
import { createSession } from "~/modules/session/create-session.server";
import { verifyCredential } from "~/modules/user/verify-credential.server";
import { handleNewLoginSession, requireAnonymous } from "~/utils/auth.server";

export const meta: MetaFunction = () => {
  return [{ title: "Login - Remix Dashboard" }];
};

const LoginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Email is invalid"),
  password: z.string({ required_error: "Password is required" }),
});

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAnonymous(request);
  return json({});
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  const submission = await parse(formData, {
    schema: (intent) =>
      LoginSchema.transform(async (data, ctx) => {
        if (intent !== "submit") return { ...data, session: null };

        const { email, password } = data;

        const validCredential = await verifyCredential({ email, password });

        if (!validCredential) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Invalid email or password",
          });
          return z.NEVER;
        }

        const session = await createSession({
          userId: validCredential,
        });

        return { ...data, session };
      }),
    async: true,
  });

  delete submission.payload.password;

  if (submission.intent !== "submit") {
    // @ts-expect-error - conform should probably have support for doing this
    delete submission.value?.password;
    return json({ status: "idle", submission } as const);
  }

  if (!submission.value?.session) {
    return json({ status: "error", submission } as const, { status: 400 });
  }

  const { session } = submission.value;

  return handleNewLoginSession(request, session);
};

export default function Login() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.formAction === "/login";
  const [form, { email, password }] = useForm({
    id: "login-form",
    constraint: getFieldsetConstraint(LoginSchema),
    lastSubmission: actionData?.submission,
    onValidate({ formData }) {
      return parse(formData, { schema: LoginSchema });
    },
    shouldRevalidate: "onBlur",
  });

  return (
    <>
      <div className="flex flex-col items-center gap-unit-4">
        <Logo className="w-unit-16 h-unit-16" />
        <h1 className="block text-2xl font-bold text-slate-800 dark:text-white">
          Login to your account
        </h1>
      </div>
      {form.error && (
        <Alert
          id={form.errorId}
          variant="danger"
          size="small"
          className="mb-unit-5"
        >
          {form.error}
        </Alert>
      )}
      <Form
        method="post"
        className="flex flex-col justify-between gap-unit-4"
        {...form.props}
      >
        <Input
          endContent={
            <Icon
              name="mail"
              classNames={{
                icon: "text-default-400 h-unit-5 w-unit-5 pointer-events-none self-end",
              }}
            />
          }
          label="Email"
          placeholder="Enter your email"
          name="email"
          type="email"
          defaultValue={email.defaultValue}
          errorMessage={email.error}
          isInvalid={!!email.error}
        />
        <InputPassword
          label="Password"
          placeholder="Enter your password"
          name="password"
          defaultValue={password.defaultValue}
          errorMessage={password.error}
          isInvalid={!!password.error}
        />
        <Button type="submit" isLoading={isSubmitting} size="lg">
          Sign in
        </Button>
      </Form>
      <Link
        color="primary"
        href="/forgot-password"
        className="text-center text-xs underline text-foreground"
      >
        Forgot password?
      </Link>
    </>
  );
}
