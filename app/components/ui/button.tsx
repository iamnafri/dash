import {
  ButtonProps as NextUIButtonProps,
  Button as NextUIButton,
} from "@nextui-org/react";
import { forwardRef } from "react";

type ButtonProps = NextUIButtonProps;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      color = "primary",
      disableAnimation = true,
      disableRipple = true,
      ...rest
    },
    ref
  ) => {
    return (
      <NextUIButton
        ref={ref}
        color={color}
        disableAnimation={disableAnimation}
        disableRipple={disableRipple}
        {...rest}
      />
    );
  }
);
