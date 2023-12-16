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
            "rounded-md shadow-sm flex w-full items-center justify-center space-x-2 border transition-all focus:outline-non text-sm cursor-text",
            {
              "border-red-300 pr-10 text-red-500 focus:border-red-500 focus:ring-red-500":
                isError,
              "border-gray-300 text-gray-900 focus:border-gray-500 focus:ring-gray-500":
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
