import { UseFormRegisterReturn } from "react-hook-form";
import { cn } from "../utils";
import { InputHTMLAttributes, ReactNode, forwardRef } from "react";
import { AlertCircle } from "lucide-react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;
type FormProps = UseFormRegisterReturn;
type OwnProps = {
  children?: ReactNode;
  isError?: boolean;
};

export type FormInputProps = InputProps & FormProps & OwnProps;

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  function FormInput(
    { isError, className, children, ...props }: FormInputProps,
    ref
  ) {
    return (
      <div className="relative rounded-md shadow-sm">
        <input
          {...props}
          ref={ref}
          autoComplete="off"
          className={cn(
            "w-full rounded-md focus:outline-none text-sm bg-input",
            {
              "pr-10 border-danger/70 text-danger placeholder-danger/70 focus:border-danger focus:ring-danger":
                isError,
              "border-input-border text-primary placeholder-input-placeholder focus:border-input-border focus:ring-input-border":
                !isError,
              "cursor-not-allowed border-border bg-skeleton/70 text-secondary":
                props.disabled,
            },
            className
          )}
        />
        {children}
        {isError && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
          </div>
        )}
      </div>
    );
  }
);

export default FormInput;
