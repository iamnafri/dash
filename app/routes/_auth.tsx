import { Navbar, NavbarBrand } from "@nextui-org/react";
import { Outlet } from "@remix-run/react";
import { Logo } from "~/components";

export default function Auth() {
  return (
    <div className="h-screen flex flex-col">
      <Navbar
        position="static"
        isBlurred={false}
        classNames={{
          base: "bg-slate-900",
          wrapper: "max-w-7xl",
        }}
        as={"div"}
      >
        <NavbarBrand className="gap-3">
          <Logo className="h-8 w-8" />
          <span className="text-xl font-semibold text-inherit text-white">
            ACME Corp
          </span>
        </NavbarBrand>
      </Navbar>
      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-1 flex-col gap-8 max-w-md p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
