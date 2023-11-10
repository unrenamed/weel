import { UseFormRegisterReturn } from "react-hook-form";
import { classNames } from "../utils";
import { InputHTMLAttributes, forwardRef } from "react";
import AlertCircleFill from "../icons/alert-circle-fill";

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;
type FormProps = UseFormRegisterReturn;
type OwnProps = {
  isError?: boolean;
};
type Props = InputProps & FormProps & OwnProps;

const FormTextInput = forwardRef<HTMLInputElement, Props>(
  function FormTextInput({ isError, className, ...props }: Props, ref) {
    return (
      <div className="relative rounded-md shadow-sm">
        <input
          {...props}
          ref={ref}
          type="text"
          autoComplete="off"
          className={classNames(
            "block w-full rounded-md focus:outline-none sm:text-sm",
            {
              "border-red-300 pr-10 text-red-500 placeholder-red-300 focus:border-red-500 focus:ring-red-500":
                isError,
              "border-gray-300 text-gray-900 placeholder-gray-300 focus:border-gray-500 focus:ring-gray-500":
                !isError,
              "cursor-not-allowed border-gray-300 bg-gray-100 text-gray-500":
                props.disabled,
            },
            className
          )}
        />
        {isError && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <AlertCircleFill
              className="h-5 w-5 text-red-400"
              aria-hidden="true"
            />
          </div>
        )}
      </div>
    );
  }
);

export default FormTextInput;
