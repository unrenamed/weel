import * as PopoverPrimitive from "@radix-ui/react-popover";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  content: ReactNode | string;
  align?: "start" | "end" | "center";
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export default function Popover({
  children,
  content,
  align,
  isOpen,
  onOpenChange,
}: Props) {
  return (
    <PopoverPrimitive.Root open={isOpen} onOpenChange={onOpenChange}>
      <PopoverPrimitive.Trigger asChild>{children}</PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align={align}
          className="animate-slide-up-fade z-50 items-center rounded-md border border-gray-200 bg-white drop-shadow-lg sm:block mt-2"
        >
          {content}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
