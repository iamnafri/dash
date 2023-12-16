import { IconName } from "~/components/ui/icon";

export type Menu = {
  title: string;
  url: string;
  icon?: IconName;
};

export const menus: Menu[] = [
  {
    title: "Home",
    url: "/",
    icon: "home",
  },
  {
    title: "Users",
    url: "/users",
    icon: "users",
  },
];
