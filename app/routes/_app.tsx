import {
  json,
  redirect,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import { Outlet, ShouldRevalidateFunctionArgs } from "@remix-run/react";
import { Header } from "~/components/header";
import { getUserById } from "~/modules/user/get-user-by-id.server";
import { requireUserId } from "~/utils/auth.server";

export function shouldRevalidate({
  defaultShouldRevalidate,
  currentUrl,
  nextUrl,
}: ShouldRevalidateFunctionArgs) {
  if (currentUrl.pathname === nextUrl.pathname) {
    return false;
  }

  return defaultShouldRevalidate;
}

export const meta: MetaFunction = () => {
  return [{ title: "Remix Dashboard" }];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);

  const user = await getUserById({ id: userId });

  return json(user);
}

export default function App() {
  return (
    <>
      <Header />
      <div className="container pt-unit-10 pb-unit-5">
        <Outlet />
      </div>
    </>
  );
}
