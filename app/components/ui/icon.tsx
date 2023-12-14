import { type SVGProps } from "react";
import { type IconName } from "~/components/ui/icons/name";
import href from "./icons/sprite.svg";
import { VariantProps, SlotsToClasses, tv } from "@nextui-org/react";

export { IconName };

const icontyles = tv({
  slots: {
    base: "inline-flex items-center",
    icon: "inline self-center",
  },
  variants: {
    size: {
      font: {
        base: "gap-unit-1",
        icon: "w-[1em] h-unit-[1em]",
      },
      xs: {
        base: "gap-unit-1",
        icon: "w-unit-3 h-unit-3",
      },
      sm: {
        base: "gap-unit-1",
        icon: "w-unit-4 h-unit-4",
      },
      md: {
        base: "gap-unit-2",
        icon: "w-unit-5 h-unit-5",
      },
      lg: {
        base: "gap-unit-2",
        icon: "w-unit-6 h-unit-6",
      },
      xl: {
        base: "gap-unit-3",
        icon: "w-unit-7 h-unit-7",
      },
    },
  },
  defaultVariants: {
    size: "font",
  },
});

type IconVariantProps = VariantProps<typeof icontyles>;
type IconSlots = keyof ReturnType<typeof icontyles>;

type IconProps = SVGProps<SVGSVGElement> &
  IconVariantProps & {
    name: IconName;
    classNames?: SlotsToClasses<IconSlots>;
  };

export function Icon({
  name,
  size,
  className,
  children,
  classNames,
  ...props
}: IconProps) {
  const { base, icon } = icontyles({ size, className });

  if (children) {
    return (
      <span className={base({ className: classNames?.base })}>
        <Icon name={name} size={size} className={className} {...props} />
        {children}
      </span>
    );
  }

  return (
    <svg {...props} className={icon({ className: classNames?.icon })}>
      <use href={`${href}#${name}`} />
    </svg>
  );
}
