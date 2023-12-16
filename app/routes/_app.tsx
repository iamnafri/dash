import {
  json,
  redirect,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { Header } from "~/components/header";
import { getUserById } from "~/modules/user/get-user-by-id.server";
import { requireUserId } from "~/utils/auth.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Remix Dashboard" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);
  if (!userId) {
    throw redirect("/login");
  }

  const user = userId ? await getUserById({ id: userId }) : null;

  return json(user);
}

export default function App() {
  return (
    <>
      <Header />
      <div className="container mx-auto p-unit-6">
        <Outlet />
      </div>
    </>
  );
}
