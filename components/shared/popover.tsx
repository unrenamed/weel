import { ReactNode } from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Drawer } from "vaul";
import { useMediaQuery } from "@/hooks";
import { DrawerIsland } from ".";

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
  const isMobile = useMediaQuery("only screen and (max-width : 640px)");

  if (isMobile) {
    return (
      <Drawer.Root open={isOpen} onOpenChange={onOpenChange}>
        <Drawer.Trigger asChild>{children}</Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 z-50 bg-overlay/20 backdrop-blur" />
          <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 rounded-t-[10px] bg-content border-t border-border">
            <DrawerIsland />
            <div className="max-w-md">{content}</div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    );
  }

  return (
    <PopoverPrimitive.Root open={isOpen} onOpenChange={onOpenChange}>
      <PopoverPrimitive.Trigger asChild>{children}</PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align={align}
          className="animate-slide-up-fade z-50 items-center rounded-md border border-border bg-content drop-shadow-lg sm:block mt-2"
        >
          {content}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
