import { UseFormRegisterReturn } from "react-hook-form";
import { classNames } from "../utils";
import { InputHTMLAttributes, forwardRef } from "react";
import { AlertCircle } from "lucide-react";

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;
type FormProps = UseFormRegisterReturn;
type OwnProps = {
  isError?: boolean;
};
type Props = InputProps & FormProps & OwnProps;

const FormDatetimeInput = forwardRef<HTMLInputElement, Props>(
  function FormDatetimeInput({ isError, className, ...props }: Props, ref) {
    return (
      <div className="relative">
        <input
          {...props}
          ref={ref}
          type="datetime-local"
          className={classNames(
            "rounded-md shadow-sm flex w-full items-center justify-center space-x-2 border transition-all focus:outline-non text-sm cursor-text dark:bg-neutral-700",
            {
              "pr-10 border-red-300 text-red-500 placeholder-red-300 focus:border-red-500 focus:ring-red-500":
                isError,
              "border-gray-300 text-gray-900 focus:border-gray-500 focus:ring-gray-500 dark:border-neutral-600 dark:text-gray-50 dark:focus:border-neutral-600 dark:focus:ring-neutral-600":
                !isError,
              "cursor-not-allowed border-gray-300 bg-gray-100 text-gray-500":
                props.disabled,
            },
            className
          )}
        />
        {isError && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
          </div>
        )}
      </div>
    );
  }
);

export default FormDatetimeInput;
