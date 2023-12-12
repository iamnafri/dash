import { VariantProps, tv } from "@nextui-org/react";
import { FC, HTMLAttributes, ReactNode } from "react";

const alertStyles = tv({
  base: "px-unit-4 bg-default-50 py-unit-3 rounded-medium [&>p]:m-0",
  variants: {
    variant: {
      default: "bg-default-200/20",
      primary: "text-primary bg-primary-50",
      secondary: "text-secondary bg-secondary-50",
      success: "text-success bg-success-50",
      warning: "text-warning bg-warning-50",
      danger: "text-danger bg-danger-50",
    },
    size: {
      small: "text-small",
      medium: "text-medium",
      large: "text-large",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "medium",
  },
});

type AlertVariantProps = VariantProps<typeof alertStyles>;

export interface AlertProps
  extends HTMLAttributes<HTMLDivElement>,
    AlertVariantProps {
  children?: ReactNode;
}

export const Alert: FC<AlertProps> = ({
  children,
  variant,
  size,
  className,
  ...props
}) => {
  const styles = alertStyles({ variant, size, className });

  return (
    <div className={styles} {...props}>
      {children}
    </div>
  );
};
