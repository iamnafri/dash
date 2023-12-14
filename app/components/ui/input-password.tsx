import { InputProps, forwardRef } from "@nextui-org/react";
import { useState } from "react";
import { Icon } from "~/components/ui/icon";
import { Input } from "~/components/ui/input";

export interface InputPasswordProps
  extends Omit<InputProps, "type" | "endContent"> {}

export const InputPassword = forwardRef<"input", InputPasswordProps>(
  (props, ref) => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);

    return (
      <Input
        ref={ref}
        endContent={
          <button
            className="focus:outline-none"
            type="button"
            onClick={toggleVisibility}
          >
            <Icon
              name={isVisible ? "eye-off" : "eye"}
              classNames={{
                icon: "text-default-400 h-unit-6 w-unit-6 pointer-events-none self-end",
              }}
            />
          </button>
        }
        type={isVisible ? "text" : "password"}
        {...props}
      />
    );
  }
);
