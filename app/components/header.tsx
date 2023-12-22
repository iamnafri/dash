import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  User,
} from "@nextui-org/react";
import { Logo } from "./logo";
import { Form, NavLink, useMatches, useSubmit } from "@remix-run/react";
import { useRef } from "react";
import { menus } from "~/constants/menu";
import { Icon } from "~/components/ui/icon";
import { cn } from "~/utils/styles";
import { User as UserType } from "@prisma/client";
import { ThemeSwitch } from "~/components/theme-switch";

export function Header() {
  const match = useMatches().find((d) => d.id === "routes/_app");
  const userData = match?.data as UserType;
  const submit = useSubmit();
  const logoutFormRef = useRef<HTMLFormElement>(null);

  const onLogout = () => {
    submit(logoutFormRef.current);
  };

  return (
    <header className="dark sticky top-0 bg-content2 pt-unit-4 pb-unit-2 space-y-unit-6 shadow-medium">
      <div className="container">
        <div className="flex items-center justify-between text-content2-foreground">
          <div className="inline-flex space-x-unit-3">
            <Logo className="h-8 w-8" />
            <span className="text-xl font-semibold text-inherit ">
              ACME Corp
            </span>
          </div>
          <div className="inline-flex space-x-unit-3">
            <ThemeSwitch />
            <Dropdown
              placement="bottom-start"
              classNames={{ content: "min-w-[120px]" }}
            >
              <DropdownTrigger className="aria-expanded:scale-100 aria-expanded:opacity-100">
                <User
                  as={"button"}
                  name={userData.name}
                  description={userData.email}
                  avatarProps={{
                    src: "https://i.pravatar.cc/150?u=a04258114e29026701d",
                    name: userData.name,
                    isBordered: true,
                    size: "sm",
                  }}
                  classNames={{
                    name: "text-small font-medium",
                    description: "text-content2-foreground/50",
                  }}
                />
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Profile Actions"
                variant="light"
                color="primary"
              >
                <DropdownItem
                  key="profile"
                  textValue="profile"
                  startContent={
                    <Icon name="user" classNames={{ icon: "h-4 w-4" }} />
                  }
                >
                  Profile
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  textValue="logout"
                  color="danger"
                  onPress={onLogout}
                >
                  <Form action="/logout" method="POST" ref={logoutFormRef}>
                    <button
                      className="flex flex-row justify-start items-center w-full space-x-2"
                      type="submit"
                    >
                      <Icon name="log-out" classNames={{ icon: "h-4 w-4" }} />
                      <span>Logout</span>
                    </button>
                  </Form>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <nav
          id="nav"
          className="scrollbar-hide flex items-center overflow-auto space-x-unit-3 md:container md:-left-3"
        >
          {menus.map((menu) => (
            <NavLink
              key={menu.url}
              to={menu.url}
              className={({ isActive }) =>
                cn({
                  "rounded-large group relative hover:opacity-100 hover:bg-content3/40 text-content2-foreground/80":
                    true,
                  "bg-content3/60 text-content2-foreground hover:bg-content3/60":
                    isActive,
                })
              }
            >
              <div className="whitespace-nowrap px-unit-3 py-unit-2 flex items-center space-x-unit-3">
                {menu?.icon && <Icon name={menu.icon} size="sm" />}
                <div className="font-semibold text-small">{menu.title}</div>
              </div>
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
