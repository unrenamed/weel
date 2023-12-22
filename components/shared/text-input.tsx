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
        "bg-gray-200 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-gray-500 focus:ring-gray-500",
        "dark:bg-neutral-700 dark:border-neutral-600 dark:text-gray-50 dark:placeholder:text-neutral-500 dark:focus:border-neutral-500 dark:focus:ring-neutral-500",
        className
      )}
      {...props}
    />
  );
});

export default TextInput;
