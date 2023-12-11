import { VariantProps, tv } from "@nextui-org/react";
import { FC, HTMLAttributes, ReactNode } from "react";

const alertStyles = tv({
  base: "border px-4 bg-default-50 py-3 rounded-medium [&>p]:m-0",
  variants: {
    variant: {
      default: "border-default-200 dark:border-default-100 bg-default-200/20",
      primary: "border-primary text-primary bg-primary-50",
      secondary: "border-secondary text-secondary bg-secondary-50",
      success: "border-success text-success bg-success-50",
      warning: "border-warning text-warning bg-warning-50",
      danger: "border-danger text-danger bg-danger-50",
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
