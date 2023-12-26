import { forwardRef } from "react";
import Button, { ButtonProps } from "./button";
import { cn } from "../utils";

type KeyboardActionButtonProps = {
  kbd: string;
} & ButtonProps;

const variantColors = {
  primary: cn(
    "bg-primary-kbd text-primary-kbd-txt border-primary-kbd-b/60",
    "group-hover:bg-primary-kbd-hover group-hover:text-primary-kbd-txt-hover"
  ),
  secondary: cn(
    "bg-secondary-kbd text-secondary-kbd-txt border-secondary-kbd-b/60",
    "group-hover:bg-secondary-kbd-hover group-hover:text-secondary-kbd-txt-hover"
  ),
  error: cn(
    "bg-error-kbd text-error-kbd-txt border-error-kbd-b/60",
    "group-hover:bg-error-kbd-hover group-hover:text-error-kbd-txt-hover"
  ),
};

const disabledVariantColors = {
  primary: "bg-primary-kbd/50 border-primary-kbd-b/50 text-primary-kbd-txt/50",
  secondary: "bg-secondary-kbd/50 border-secondary-kbd-b/50 text-secondary-kbd-txt/50",
  error: "bg-error-kbd/50 border-error-kbd-b/50 text-error-kbd-txt/50",
};

const KeyboardActionButton = forwardRef<
  HTMLButtonElement,
  KeyboardActionButtonProps
>(function KeyboardActionButton(
  { kbd, variant = "primary", className, ...props },
  ref
) {
  return (
    <Button
      {...props}
      ref={ref}
      variant={variant}
      className={cn("justify-between space-x-2", className)}
    >
      <p>{props.text}</p>
      <kbd
        className={cn(
          "hidden sm:inline-block px-2 py-0.5 rounded-md text-xs border shadow-kbd",
          "transition-all duration-75",
          variantColors[variant],
          props.disabled && disabledVariantColors[variant]
        )}
      >
        {kbd}
      </kbd>
    </Button>
  );
});

export default KeyboardActionButton;
