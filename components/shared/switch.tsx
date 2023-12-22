import * as SwitchPrimitive from "@radix-ui/react-switch";
import { classNames } from "../utils";

type Props = {
  className?: string;
} & SwitchPrimitive.SwitchProps;

export default function Switch({ className, ...rootProps }: Props) {
  return (
    <SwitchPrimitive.Root
      className={classNames(
        "w-9 h-5 rounded-full relative cursor-pointer border-2 border-transparent outline-none",
        "transition-colors duration-200 ease-in-out",
        "data-[state=unchecked]:bg-skeleton data-[state=checked]:bg-accent",
        "focus-visible:ring focus-visible:ring-accent focus-visible:ring-opacity-75",
        className
      )}
      {...rootProps}
    >
      <SwitchPrimitive.Thumb className="block w-4 h-4 bg-content rounded-full transition-transform duration-200 will-change-transform data-[state=checked]:translate-x-4" />
    </SwitchPrimitive.Root>
  );
}
