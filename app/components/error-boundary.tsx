import { Link } from "@nextui-org/react";
import { isRouteErrorResponse, useRouteError } from "@remix-run/react";
import { Logo } from "~/components/logo";
import { Button } from "~/components/ui/button";

export function GeneralErrorBoundary() {
  const error = useRouteError();
  const isRouteError = isRouteErrorResponse(error);

  function onReloadPage() {
    window.location.reload();
  }

  return (
    <div className="grid h-screen w-screen">
      <div className="flex flex-col items-center justify-center space-y-6">
        <Logo className="h-16 w-16" />

        <h1 className="text-xl font-semibold md:text-3xl">
          {isRouteError
            ? error.data || `${error.status} ${error.statusText}`
            : "Sorry! We're having trouble, please reload the page"}
        </h1>

        {isRouteError ? (
          <Button as={Link} href={"/"}>
            Go to homepage
          </Button>
        ) : (
          <Button onClick={onReloadPage}>Reload page</Button>
        )}
      </div>
    </div>
  );
}
