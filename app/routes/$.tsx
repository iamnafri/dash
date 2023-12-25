import { MetaFunction } from "@remix-run/node";
import { GeneralErrorBoundary } from "~/components/error-boundary";

export const meta: MetaFunction = () => {
  return [{ title: "404 Not Found" }];
};

export async function loader() {
  throw new Response("Sorry! This page doesn't exist.", { status: 404 });
}

export default function NotFound() {
  return <ErrorBoundary />;
}

export function ErrorBoundary() {
  return <GeneralErrorBoundary />;
}
