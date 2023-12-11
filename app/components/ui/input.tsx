import { Input as NextUIInput, extendVariants } from "@nextui-org/react";

export const Input = extendVariants(NextUIInput, {
  variants: {
    variant: {
      bordered: {
        inputWrapper: [
          "border-small",
          "data-[hover=true]:border-primary",
          "group-data-[focus=true]:border-primary",
        ],
      },
    },
  },
  defaultVariants: {
    variant: "bordered",
  },
});
