import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Link,
  User,
} from "@nextui-org/react";
import { Logo } from "./logo";
import { Form, useLocation, useMatches, useSubmit } from "@remix-run/react";
import { useRef } from "react";
import { Menu, menus } from "~/constants/menu";
import { Icon } from "~/components/ui/icon";
import { cn } from "~/utils/styles";
import { User as UserType } from "@prisma/client";

export function NavLink({ title, url, icon }: Menu) {
  const location = useLocation();
  const isActive = location.pathname === url;

  return (
    <Link
      key={title}
      className={cn({
        "rounded-large group relative hover:opacity-100 hover:bg-slate-700/40 text-slate-400":
          true,
        "bg-slate-700/50 text-slate-50 hover:bg-slate-700/50": isActive,
      })}
      href={url}
    >
      <div className="whitespace-nowrap px-unit-3 py-unit-2 flex items-center space-x-unit-3">
        {icon && (
          <Icon
            name={icon}
            size="md"
            classNames={{
              icon: "hidden sm:inline-block",
            }}
          />
        )}
        <div className="font-semibold text-small">{title}</div>
      </div>
    </Link>
  );
}

export function Header() {
  const match = useMatches().find((d) => d.id === "routes/_app");
  const userData = match?.data as UserType;
  const submit = useSubmit();
  const logoutFormRef = useRef<HTMLFormElement>(null);

  const onLogout = () => {
    submit(logoutFormRef.current);
  };

  return (
    <header className="bg-slate-800 pt-unit-4 pb-unit-2 space-y-unit-6 shadow-medium">
      <div className="container mx-auto px-unit-3">
        <div className="flex items-center justify-between text-slate-50">
          <div className="inline-flex space-x-unit-3">
            <Logo className="h-8 w-8" />
            <span className="text-xl font-semibold text-inherit ">
              ACME Corp
            </span>
          </div>
          <Dropdown placement="bottom-end">
            <DropdownTrigger className="aria-expanded:scale-100 aria-expanded:opacity-100">
              <User
                as={"button"}
                name={userData.name}
                description={userData.email}
                avatarProps={{
                  src: "https://i.pravatar.cc/150?u=a04258114e29026702d",
                }}
                classNames={{
                  name: "text-small font-medium",
                  description: "text-slate-400",
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

      <div className="relative overflow-hidden">
        <nav
          id="nav"
          className="scrollbar-hide flex items-center overflow-auto space-x-unit-3 md:container md:mx-auto md:px-unit-3 md:-left-3"
        >
          {menus.map((menu) => (
            <NavLink
              key={menu.title}
              title={menu.title}
              url={menu.url}
              icon={menu.icon}
            />
          ))}
        </nav>
      </div>
    </header>
  );
}
