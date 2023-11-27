import { useForm } from "@conform-to/react";
import { getFieldsetConstraint, parse } from "@conform-to/zod";
import { EnvelopeIcon, EyeIcon } from "@heroicons/react/24/outline";
import {
  Button,
  Card,
  CardBody,
  Checkbox,
  Input,
  Link,
} from "@nextui-org/react";
import {
  type ActionFunctionArgs,
  type MetaFunction,
  json,
  LoaderFunctionArgs,
} from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { z } from "zod";
import { Logo } from "~/components";
import { AlertProps } from "~/components/ui";
import {
  handleNewLoginSession,
  login,
  requireAnonymous,
} from "~/services/auth.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Login - Remix Dashboard" },
    { name: "description", content: "Welcome to Remix!" },
  ];
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

        const session = await login(data);

        if (!session) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Invalid email or password",
          });
          return z.NEVER;
        }

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
      <div className="flex flex-col items-center gap-4">
        <Logo className="w-16 h-16" />
        <h1 className="block text-2xl font-bold text-slate-800 dark:text-white">
          Login to your account
        </h1>
      </div>
      <Card shadow="sm" classNames={{ base: "w-full" }}>
        <CardBody className="p-6">
          {form.error && (
            <AlertProps
              id={form.errorId}
              variant="danger"
              size="small"
              className="mb-5"
            >
              {form.error}
            </AlertProps>
          )}
          <Form
            method="post"
            className="flex flex-col justify-between gap-4"
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
            <div className="flex justify-between">
              <Checkbox
                classNames={{
                  label: "text-small",
                }}
                name="remember"
              >
                Remember me
              </Checkbox>
              <Link color="primary" href="/forgot-password" size="sm">
                Forgot password?
              </Link>
            </div>

            <Button
              color="primary"
              type="submit"
              isLoading={isSubmitting}
              className="mt-5"
              disableRipple
              disableAnimation
            >
              Sign in
            </Button>
          </Form>
        </CardBody>
      </Card>
    </>
  );
}
