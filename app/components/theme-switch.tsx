import { useForm } from "@conform-to/react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Selection,
} from "@nextui-org/react";
import { useFetcher } from "@remix-run/react";
import React from "react";
import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";
import { themes } from "~/constants/theme";
import { action as themeAction } from "~/routes/prefereces.theme";
import { ColorScheme } from "~/types";
import { useRootLoaderData } from "~/utils/hooks/use-root-loader-data";

export function ThemeSwitch() {
  const fetcher = useFetcher<typeof themeAction>();
  const theme = useRootLoaderData().theme;

  const [form] = useForm({
    id: "theme-switch",
    lastSubmission: fetcher.data?.submission,
  });

  const [selectedKeys, setSelectedKeys] = React.useState(
    new Set([theme || "system"])
  );

  const onSelectTheme = (keys: Selection) => {
    setSelectedKeys(keys as Set<ColorScheme>);
  };

  return (
    <Dropdown
      placement="bottom-start"
      classNames={{ content: "min-w-[120px]" }}
    >
      <DropdownTrigger className="aria-expanded:scale-100 aria-expanded:opacity-100">
        <Button
          isIconOnly
          aria-label="Theme switcher"
          className="bg-transparent text-inherit hover:hover:bg-content3/40"
        >
          <Icon
            name="moon"
            size="lg"
            classNames={{ icon: "hidden dark:inline" }}
          />
          <Icon
            name="sun"
            size="lg"
            classNames={{ icon: "inline dark:hidden" }}
          />
        </Button>
      </DropdownTrigger>
      <fetcher.Form method="POST" action="/prefereces/theme" {...form.props}>
        <DropdownMenu
          aria-label="Themes menu"
          variant="light"
          color="primary"
          selectionMode="single"
          selectedKeys={selectedKeys}
          onSelectionChange={onSelectTheme}
        >
          {themes.map((theme) => (
            <DropdownItem key={theme.value} textValue={theme.value}>
              <button
                className="flex flex-row justify-start items-center w-full space-x-2"
                value={theme.value}
                name="theme"
              >
                <Icon name={theme.icon} size="sm" />
                <span>{theme.title}</span>
              </button>
            </DropdownItem>
          ))}
        </DropdownMenu>
      </fetcher.Form>
    </Dropdown>
  );
}
