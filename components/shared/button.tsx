import { ButtonHTMLAttributes, ReactNode, forwardRef } from "react";
import { cn } from "../utils";

export type ButtonProps = {
  text?: string;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  children?: ReactNode;
  variant?: "primary" | "secondary" | "error";
} & ButtonHTMLAttributes<HTMLButtonElement>;

const variantColors = {
  primary: cn(
    "border-primary-btn-b bg-primary-btn text-primary-btn-txt",
    "hover:bg-content hover:text-primary-btn-txt-hover",
    "disabled:border-primary-btn-b-disabled disabled:bg-primary-btn-disabled disabled:text-primary-btn-txt-disabled"
  ),
  secondary: cn(
    "border-secondary-btn-b bg-secondary-btn text-secondary-btn-txt",
    "hover:bg-content hover:text-secondary-btn-txt-hover",
    "disabled:border-secondary-btn-b-disabled disabled:bg-secondary-btn-disabled disabled:text-secondary-btn-txt-disabled"
  ),
  error: cn(
    "border-error-btn-b bg-error-btn text-error-btn-txt",
    "hover:bg-content hover:text-error-btn-txt-hover",
    "disabled:border-error-btn-b-disabled disabled:bg-error-btn-disabled disabled:text-error-btn-txt-disabled"
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
      className={cn(
        "group rounded-md border focus:outline-none px-4",
        "flex items-center justify-center",
        "text-sm font-medium",
        "duration-75 transition-all",
        disabled ? "pointer-events-none" : "hover:shadow-md active:scale-95",
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
