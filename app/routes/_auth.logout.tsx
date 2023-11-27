import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { logout } from "~/services/auth.server";

export async function loader() {
  return redirect("/");
}

export async function action({ request }: ActionFunctionArgs) {
  return logout(request);
}
