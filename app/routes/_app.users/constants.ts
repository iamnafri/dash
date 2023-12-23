import { ChipProps } from "@nextui-org/react";

export const columns = [
  {
    key: "name",
    label: "NAME",
  },
  {
    key: "email",
    label: "EMAIL",
  },
  {
    key: "roles",
    label: "Roles",
  },
];

export const roleColorMap: Record<string, ChipProps["color"]> = {
  admin: "success",
  user: "warning",
};
