import { IconName } from "~/components/ui/icon";

export type ColorScheme = "dark" | "light";
export type Theme = {
  value: ColorScheme | "system";
  title: string;
  icon: IconName;
};

export type Menu = {
  title: string;
  url: string;
  icon?: IconName;
};
