import { Select, SelectItem } from "@nextui-org/react";
import { Role } from "@prisma/client";
import { useSearchParams } from "@remix-run/react";
import { KeyboardEvent, useRef } from "react";
import { Icon } from "~/components/ui/icon";
import { Input } from "~/components/ui/input";

type UserFiltersProps = {
  roles: Pick<Role, "name" | "description">[];
};

export function UserFilters({ roles }: UserFiltersProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchParam = searchParams.get("search") || "";
  const rolesParam = searchParams.get("roles");

  function onSelectRoles(roles: React.ChangeEvent<HTMLSelectElement>) {
    setSearchParams(
      (prev) => {
        if (prev.has("page")) prev.set("page", "1");
        prev.set("roles", roles.target.value);
        return prev;
      },
      { preventScrollReset: true }
    );
  }

  function onSearchInputKeydown(
    event: KeyboardEvent<HTMLInputElement> | KeyboardEvent
  ) {
    const searchInputValue = searchInputRef.current?.value;
    if (event.key === "Enter") {
      setSearchParams((prev) => {
        if (prev.has("page")) prev.set("page", "1");
        prev.set("search", String(searchInputValue));
        return prev;
      });
    }
  }

  function onSearchInputBlur() {
    const searchInputValue = searchInputRef.current?.value;
    setSearchParams((prev) => {
      if (prev.has("page")) prev.set("page", "1");
      prev.set("search", String(searchInputValue));
      return prev;
    });
  }

  return (
    <div className="flex flex-col gap-unit-5 md:flex-row md:items-center">
      <Select
        label="Filter by roles"
        placeholder="Select roles..."
        selectionMode="multiple"
        size="sm"
        className="w-full sm:max-w-[30%]"
        defaultSelectedKeys={rolesParam ? rolesParam.split(",") : []}
        onChange={onSelectRoles}
      >
        {roles.map((role) => (
          <SelectItem key={role.name} value={role.name} className="capitalize">
            {role.name}
          </SelectItem>
        ))}
      </Select>

      <Input
        ref={searchInputRef}
        placeholder="Search by name or email..."
        name="search"
        defaultValue={searchParam}
        startContent={<Icon name="search" size="sm" />}
        size="sm"
        className="w-full sm:max-w-[70%]"
        onKeyDown={onSearchInputKeydown}
        onBlur={onSearchInputBlur}
      />
    </div>
  );
}
