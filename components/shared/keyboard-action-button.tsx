import { forwardRef } from "react";
import Button, { ButtonProps } from "./button";
import { classNames } from "../utils";

type KeyboardActionButtonProps = {
  kbd: string;
} & ButtonProps;

const variantColors = {
  primary: classNames(
    "bg-zinc-700 text-gray-400 border-zinc-500/40 group-hover:bg-gray-100 group-hover:text-gray-500",
    "dark:group-hover:bg-zinc-700 dark:group-hover:text-gray-400 dark:group-hover:border-zinc-500/40 dark:bg-gray-100 dark:text-gray-500"
  ),
  secondary: classNames(
    "bg-gray-200 text-gray-500 border-gray-500/40 group-hover:bg-gray-100 group-hover:text-gray-600",
    "dark:bg-neutral-600 dark:text-gray-300 dark:border-gray-500/40 dark:group-hover:bg-gray-200 dark:group-hover:text-gray-500"
  ),
  error: classNames(
    "bg-red-400 text-white border-red-500/40 group-hover:bg-red-100 group-hover:text-red-600",
    "dark:group-hover:bg-red-400 dark:group-hover:text-white dark:group-hover:border-red-500 dark:bg-red-100 dark:text-red-600"
  ),
};

const disabledVariantColors = {
  primary: "bg-zinc-600 border-gray-400/40 dark:bg-zinc-400 dark:text-gray-200",
  secondary:
    "bg-gray-200 border-gray-400/40 dark:bg-gray-300 dark:text-gray-400",
  error: "bg-red-300 border-red-400/40 dark:text-red-300",
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
