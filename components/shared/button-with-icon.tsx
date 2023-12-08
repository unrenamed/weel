import { ReactNode, forwardRef } from "react";
import Button, { ButtonProps } from "./button";
import { classNames } from "../utils";

type ButtonWithIconProps = {
  icon: ReactNode;
} & ButtonProps;

const ButtonWithIcon = forwardRef<HTMLButtonElement, ButtonWithIconProps>(
  function ButtonWithIcon({ icon, className, ...props }, ref) {
    return (
      <Button
        {...props}
        ref={ref}
        className={classNames("space-x-2", className)}
      >
        {icon}
        <p>{props.text}</p>
      </Button>
    );
  }
);

export default ButtonWithIcon;
