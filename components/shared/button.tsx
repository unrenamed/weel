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
  primary:
    "border-black bg-black text-white hover:bg-white hover:text-black disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-400",
  error:
    "border-red-500 bg-red-500 text-white hover:bg-white hover:text-red-500 disabled:bg-red-300 disabled:hover:text-white disabled:border-red-300",
  secondary:
    "border-gray-300 bg-gray-100 text-black hover:bg-white hover:text-gray-900",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
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
            "cursor-not-allowed": disabled,
            "hover:shadow-md active:scale-95": !disabled,
          },
          variantColors[variant],
          className
        )}
        onClick={onClick}
        disabled={disabled}
      >
        {children ? children : <p>{text}</p>}
      </button>
    );
  }
);

export default Button;
