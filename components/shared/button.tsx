import { ButtonHTMLAttributes, ReactNode, forwardRef } from "react";
import { classNames } from "../utils";

export type ButtonProps = {
  text?: string;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  children?: ReactNode;
  variant?: "primary" | "secondary" | "error";
} & ButtonHTMLAttributes<HTMLButtonElement>;

const variantColors = {
  primary: classNames(
    "border-black bg-black text-white hover:bg-white hover:text-black",
    "dark:border-gray-50 dark:bg-gray-50 dark:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-gray-50",
    "disabled:border-neutral-600 disabled:bg-neutral-700 disabled:text-gray-400",
    "dark:disabled:border-gray-400 dark:disabled:bg-gray-300 dark:disabled:text-gray-500"
  ),
  secondary: classNames(
    "border-gray-300 bg-gray-200 text-black hover:bg-white hover:text-gray-900",
    "dark:border-neutral-600 dark:text-gray-50 dark:bg-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-gray-200",
    "disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-400",
    "dark:disabled:border-neutral-600 dark:disabled:bg-neutral-500 dark:disabled:text-gray-300"
  ),
  error: classNames(
    "border-red-500 bg-red-500 text-white hover:bg-white hover:text-red-500",
    "dark:hover:bg-neutral-800",
    "disabled:border-red-300 disabled:bg-red-200"
  ),
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    text,
    disabled = false,
    variant = "primary",
    className,
    onClick,
    children,
    ...props
  },
  ref
) {
  return (
    <button
      {...props}
      ref={ref}
      className={classNames(
        "group flex rounded-md border text-sm focus:outline-none font-medium duration-75 transition-all items-center justify-center px-4",
        {
          "pointer-events-none": disabled,
          "hover:shadow-md active:scale-95": !disabled,
        },
        variantColors[variant],
        className
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children ?? <p>{text}</p>}
    </button>
  );
});

export default Button;
