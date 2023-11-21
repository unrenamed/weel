import { forwardRef } from "react";
import { Button, ButtonProps } from "./button";
import LoadingSpinner from "./loading-spinner";
import { classNames } from "../utils";

export type LoadingButtonProps = {
  loading?: boolean;
} & ButtonProps;

export const LoadingButton = forwardRef<HTMLButtonElement, LoadingButtonProps>(
  function LoadingButton({ loading = false, className, ...props }, ref) {
    return (
      <Button
        {...props}
        ref={ref}
        className={classNames("space-x-2", className)}
      >
        {loading && <LoadingSpinner />}
        <p>{props.text}</p>
      </Button>
    );
  }
);
