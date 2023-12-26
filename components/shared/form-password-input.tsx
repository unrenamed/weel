import { forwardRef, useState } from "react";
import { cn } from "../utils";
import { Eye, EyeOff } from "lucide-react";
import FormInput, { FormInputProps } from "./form-input";

type Props = Omit<FormInputProps, "type"> & {
  passwordVisibilityEnabled?: boolean;
};

const FormPasswordInput = forwardRef<HTMLInputElement, Props>(
  function FormPasswordInput(
    { passwordVisibilityEnabled = false, ...props }: Props,
    ref
  ) {
    const [showPassword, setShowPassword] = useState(false);
    return (
      <FormInput {...props} type={showPassword ? "text" : "password"} ref={ref}>
        {passwordVisibilityEnabled && (
          <button
            className={cn(
              "absolute inset-y-0 flex items-center",
              props.isError ? "right-10" : "right-3"
            )}
            onClick={(e) => {
              e.preventDefault();
              setShowPassword(!showPassword);
            }}
          >
            {showPassword ? (
              <Eye className="h-4 w-4 text-secondary" />
            ) : (
              <EyeOff className="h-4 w-4 text-secondary" />
            )}
          </button>
        )}
      </FormInput>
    );
  }
);

export default FormPasswordInput;
