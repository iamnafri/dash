import { useForm } from "@conform-to/react";
import { getFieldsetConstraint, parse } from "@conform-to/zod";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
} from "@nextui-org/react";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "@remix-run/react";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { getAllRoles } from "~/modules/role/get-all-roles";
import { createUser } from "~/modules/user/create-user";
import { getUserByEmail } from "~/modules/user/get-user-by-mail.server";
import { requireUserId } from "~/utils/auth.server";
import { getMessagesStorage } from "~/utils/messages.server";

const CreateUserSchema = z.object({
  name: z.string({ required_error: "Name is required" }),
  email: z
    .string({ required_error: "Email is required" })
    .email("Email is invalid"),
  roles: z.array(z.string()).nonempty({ message: "Role is required" }),
});

export async function loader({ request }: LoaderFunctionArgs) {
  await requireUserId(request);

  const roles = await getAllRoles();

  return json({ roles });
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const { searchParams } = new URL(request.url);

  const submission = await parse(formData, {
    schema: (intent) =>
      CreateUserSchema.transform(async (data, ctx) => {
        if (intent !== "submit") return { ...data };

        const { email } = data;

        const existingUser = await getUserByEmail({ email });

        if (existingUser) {
          ctx.addIssue({
            path: ["email"],
            code: z.ZodIssueCode.custom,
            message: "Email already used",
          });
          return z.NEVER;
        }

        return { ...data };
      }),
    async: true,
  });

  if (submission.intent !== "submit") {
    return json({ status: "idle", submission } as const);
  }

  if (!submission.value) {
    return json({ status: "error", submission } as const, { status: 400 });
  }

  const { email, name, roles } = submission.value;

  const newUser = await createUser({ email, name, roles });

  const { messages, commitMessages } = await getMessagesStorage(request);

  messages.flash(
    "user-created",
    `New user ${newUser.name} successfully created.`
  );

  return redirect(`/users?${searchParams.toString()}`, {
    headers: { "set-cookie": await commitMessages(messages) },
  });
};

export default function Createuser() {
  const { roles } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const isSubmitting = navigation.formAction?.includes("/users/create");
  const [form, fields] = useForm({
    id: "create-user-form",
    constraint: getFieldsetConstraint(CreateUserSchema),
    lastSubmission: actionData?.submission,
    onValidate({ formData }) {
      return parse(formData, { schema: CreateUserSchema });
    },
    shouldRevalidate: "onBlur",
  });

  function onCloseModal() {
    if (!isSubmitting) {
      navigate(-1);
    }
  }

  return (
    <Modal isOpen onClose={onCloseModal}>
      <Form method="post" {...form.props}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Create User</ModalHeader>
          <ModalBody>
            <Input
              label="Name"
              placeholder="Enter name"
              name="name"
              defaultValue={fields.name.defaultValue}
              errorMessage={fields.name.error}
              isInvalid={!!fields.name.error}
            />
            <Input
              label="Email"
              placeholder="Enter email"
              name="email"
              type="email"
              defaultValue={fields.email.defaultValue}
              errorMessage={fields.email.error}
              isInvalid={!!fields.email.error}
            />
            <Select
              label="Roles"
              placeholder="Select roles"
              name="roles"
              selectionMode="multiple"
              variant="bordered"
              defaultSelectedKeys={fields.roles.defaultValue}
              errorMessage={fields.roles.error}
              isInvalid={!!fields.roles.error}
              classNames={{
                trigger: [
                  "border-small",
                  "data-[open=true]:border-primary",
                  "data-[focus=true]:border-primary",
                ],
              }}
            >
              {roles.map((role) => (
                <SelectItem
                  key={role.name}
                  value={role.name}
                  className="capitalize"
                >
                  {role.name}
                </SelectItem>
              ))}
            </Select>
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="light"
              onPress={onCloseModal}
              isDisabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button color="primary" type="submit" isLoading={isSubmitting}>
              Create User
            </Button>
          </ModalFooter>
        </ModalContent>
      </Form>
    </Modal>
  );
}
