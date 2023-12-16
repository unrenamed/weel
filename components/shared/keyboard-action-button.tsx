import { forwardRef } from "react";
import Button, { ButtonProps } from "./button";
import { classNames } from "../utils";

type KeyboardActionButtonProps = {
  kbd: string;
} & ButtonProps;

const variantColors = {
  primary:
    "bg-zinc-700 text-gray-400 group-hover:bg-gray-100 group-hover:text-gray-500 border-zinc-500/40",
  error:
    "bg-red-400 text-white group-hover:bg-red-100 group-hover:text-red-600 border-red-500/40",
  secondary:
    "bg-gray-200 text-gray-700 group-hover:bg-gray-100 group-hover:text-gray-600 border-gray-500/40",
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
      className={classNames("justify-between space-x-2", className)}
    >
      <p>{props.text}</p>
      <kbd
        className={classNames(
          "hidden sm:inline-block transition-all duration-75 px-2 py-0.5 rounded-md text-xs border shadow-kbd",
          {
            [variantColors.primary]: variant === "primary",
            [variantColors.secondary]: variant === "secondary",
            [variantColors.error]: variant === "error",
          }
        )}
      >
        {kbd}
      </kbd>
    </Button>
  );
});

export default KeyboardActionButton;
