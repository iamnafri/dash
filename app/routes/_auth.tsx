import { Outlet } from "@remix-run/react";

export default function Auth() {
  return (
    <div className="container mx-auto px-unit-6 flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-unit-6 max-w-sm">
        <Outlet />
      </div>
    </div>
  );
}
