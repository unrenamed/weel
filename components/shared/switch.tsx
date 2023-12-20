import * as SwitchPrimitive from "@radix-ui/react-switch";
import { classNames } from "../utils";

type Props = {
  className?: string;
} & SwitchPrimitive.SwitchProps;

export default function Switch({ className, ...rootProps }: Props) {
  return (
    <SwitchPrimitive.Root
      className={classNames(
        "rounded-full relative outline-none cursor-pointer w-9 h-5 data-[state=unchecked]:bg-gray-200 dark:data-[state=unchecked]:bg-neutral-700 data-[state=checked]:bg-yellow-400 dark:data-[state=checked]:bg-blue-500 focus-visible:ring focus-visible:ring-yellow-400 dark:focus-visible:ring-blue-500 focus-visible:ring-opacity-75 transition-colors duration-200 ease-in-out border-2 border-transparent",
        className
      )}
      {...rootProps}
    >
      <SwitchPrimitive.Thumb className="block w-4 h-4 bg-white rounded-full transition-transform duration-200 will-change-transform data-[state=checked]:translate-x-4" />
    </SwitchPrimitive.Root>
  );
}
