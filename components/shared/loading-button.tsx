import { forwardRef } from "react";
import Button, { ButtonProps } from "./button";
import LoadingSpinner from "./loading-spinner";
import { cn } from "../utils";

type LoadingButtonProps = {
  loading?: boolean;
} & ButtonProps;

const LoadingButton = forwardRef<HTMLButtonElement, LoadingButtonProps>(
  function LoadingButton(
    { loading = false, className, disabled, ...props },
    ref
  ) {
    return (
      <Button
        {...props}
        ref={ref}
        className={cn("space-x-2", className)}
        disabled={loading || disabled}
      >
        {loading && <LoadingSpinner />}
        <p>{props.text}</p>
      </Button>
    );
  }
);

export default LoadingButton;
