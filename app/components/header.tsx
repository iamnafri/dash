import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Navbar,
  NavbarBrand,
  NavbarContent,
  User,
} from "@nextui-org/react";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import { Logo } from "./logo";
import { Form, useSubmit } from "@remix-run/react";
import { useRef } from "react";

export const Header = () => {
  const submit = useSubmit();
  const logoutFormRef = useRef<HTMLFormElement>(null);

  return (
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
      <NavbarContent justify="end" as={"div"}>
        <Dropdown placement="bottom-end">
          <DropdownTrigger className="aria-expanded:scale-100 aria-expanded:opacity-100">
            <User
              as={"button"}
              classNames={{
                name: "text-white",
              }}
              name="Jane Doe"
              description="Product Designer"
              avatarProps={{
                src: "https://i.pravatar.cc/150?u=a04258114e29026702d",
              }}
            />
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Profile Actions"
            variant="light"
            color="primary"
          >
            <DropdownItem key="settings" textValue="settings">
              Profile
            </DropdownItem>
            <DropdownItem
              key="logout"
              textValue="logout"
              color="danger"
              onPress={() => submit(logoutFormRef.current)}
            >
              <Form action="/logout" method="POST" ref={logoutFormRef}>
                <button
                  className="flex flex-row justify-between items-center w-full"
                  type="submit"
                >
                  <span>Logout</span>
                  <ArrowRightOnRectangleIcon className="h-4 w-4" />
                </button>
              </Form>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </Navbar>
  );
};
