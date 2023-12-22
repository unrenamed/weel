import { InputHTMLAttributes, forwardRef } from "react";
import { classNames } from "../utils";

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

const TextInput = forwardRef<HTMLInputElement, InputProps>(function TextInput(
  { className, ...props }: InputProps,
  ref
) {
  return (
    <input
      type="text"
      ref={ref}
      className={classNames(
        "w-full rounded-md focus:outline-none text-sm",
        "bg-input border-input-border text-primary placeholder-input-placeholder",
        "focus:border-input-border focus:ring-input-border",
        className
      )}
      {...props}
    />
  );
});

export default TextInput;
