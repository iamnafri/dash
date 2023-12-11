import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { InputProps, forwardRef } from "@nextui-org/react";
import { useState } from "react";
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
            {isVisible ? (
              <EyeSlashIcon className="text-default-400 h-6 w-6 pointer-events-none" />
            ) : (
              <EyeIcon className="text-default-400 h-6 w-6 pointer-events-none" />
            )}
          </button>
        }
        type={isVisible ? "text" : "password"}
        {...props}
      />
    );
  }
);
