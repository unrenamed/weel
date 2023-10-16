import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  content: ReactNode | string;
};

export default function DropdownMenu({ children, content }: Props) {
  return (
    <DropdownMenuPrimitive.Root>
      <DropdownMenuPrimitive.Trigger asChild>{children}</DropdownMenuPrimitive.Trigger>
      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content className="animate-slide-up-fade z-50 items-center rounded-md border border-gray-200 bg-white drop-shadow-lg sm:block mt-2">
          {content}
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
}
