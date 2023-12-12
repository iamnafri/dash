import { useForm } from "@conform-to/react";
import { getFieldsetConstraint, parse } from "@conform-to/zod";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { Link } from "@nextui-org/react";
import {
  type ActionFunctionArgs,
  type MetaFunction,
  json,
  LoaderFunctionArgs,
} from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { z } from "zod";
import { Logo } from "~/components/logo";
import { Alert } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { forgotPassword } from "~/modules/user/forgot-password.server";
import { getUserByEmail } from "~/modules/user/get-user-by-mail.server";
import { requireAnonymous } from "~/utils/auth.server";

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

  return new Response(null, {
    status: 200,
  });
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const submission = await parse(formData, { schema: ForgotPasswordSchema });

  if (submission.intent !== "submit") {
    return json({ status: "idle", submission } as const);
  }

  if (!submission.value) {
    return json({ status: "error", submission } as const, { status: 400 });
  }

  const { email } = submission.value;
  const user = await getUserByEmail({ email });

  if (!user) {
    return json({ status: "done", submission });
  }

  await forgotPassword({ userId: user.id });

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
      <div className="flex flex-col items-center gap-unit-4">
        <Logo className="w-unit-16 h-unit-16" />
        <h1 className="block text-2xl font-bold text-slate-800 dark:text-white">
          Forgot Password
        </h1>
      </div>
      {forgotPassword.data?.status === "done" && (
        <Alert variant="success" size="small" className="mb-unit-5">
          You’ve been emailed a password reset link.
        </Alert>
      )}
      <forgotPassword.Form
        method="post"
        className="flex flex-col justify-between gap-unit-4"
        {...form.props}
      >
        <Input
          endContent={
            <EnvelopeIcon className="text-default-400 h-unit-6 w-unit-6 pointer-events-none" />
          }
          label="Email"
          placeholder="Enter your email"
          name="email"
          type="email"
          defaultValue={email.defaultValue}
          errorMessage={email.error}
          isInvalid={!!email.error}
        />

        <Button
          type="submit"
          isLoading={forgotPassword.state === "submitting"}
          size="lg"
        >
          Send reset link
        </Button>
      </forgotPassword.Form>

      <Link
        color="primary"
        href="/login"
        className="text-center text-xs underline text-foreground"
      >
        Go to login
      </Link>
    </>
  );
}
