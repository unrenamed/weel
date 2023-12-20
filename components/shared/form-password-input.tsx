import { UseFormRegisterReturn } from "react-hook-form";
import { InputHTMLAttributes, forwardRef, useState } from "react";
import { classNames } from "../utils";
import { AlertCircle, Eye, EyeOff } from "lucide-react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;
type FormProps = UseFormRegisterReturn;
type OwnProps = {
  isError?: boolean;
  passwordVisibilityEnabled?: boolean;
};
type Props = InputProps & FormProps & OwnProps;

const FormPasswordInput = forwardRef<HTMLInputElement, Props>(
  function FormPasswordInput(
    { isError, className, passwordVisibilityEnabled = false, ...props }: Props,
    ref
  ) {
    const [showPassword, setShowPassword] = useState(false);
    return (
      <div className="relative rounded-md shadow-sm">
        <input
          {...props}
          ref={ref}
          type={showPassword ? "text" : "password"}
          autoComplete="off"
          className={classNames(
            "block w-full rounded-md focus:outline-none text-sm dark:bg-neutral-700",
            {
              "pr-10 border-red-300 text-red-500 placeholder-red-300 focus:border-red-500 focus:ring-red-500":
                isError,
              "border-gray-300 text-gray-900 placeholder-gray-300 focus:border-gray-500 focus:ring-gray-500 dark:border-neutral-600 dark:text-gray-50 dark:placeholder:text-neutral-500 dark:focus:border-neutral-600 dark:focus:ring-neutral-600":
                !isError,
              "cursor-not-allowed border-gray-300 bg-gray-100 text-gray-500":
                props.disabled,
            },
            className
          )}
        />
        {passwordVisibilityEnabled && (
          <button
            className={classNames(
              "absolute inset-y-0 flex items-center",
              isError ? "right-10" : "right-3"
            )}
            onClick={(e) => {
              e.preventDefault();
              setShowPassword(!showPassword);
            }}
          >
            {showPassword ? (
              <Eye className="h-4 w-4 text-gray-400" />
            ) : (
              <EyeOff className="h-4 w-4 text-gray-400" />
            )}
          </button>
        )}
        {isError && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
          </div>
        )}
      </div>
    );
  }
);

export default FormPasswordInput;
