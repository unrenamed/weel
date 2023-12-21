import { ReactNode } from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Drawer } from "vaul";
import { useMediaQuery } from "@/hooks";

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
          <Drawer.Overlay className="fixed inset-0 z-50 bg-gray-100/20 dark:bg-neutral-900/20 backdrop-blur" />
          <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 rounded-t-[10px] bg-white dark:bg-neutral-900 border-t border-zinc-200 dark:border-neutral-700">
            <div className="sticky my-3 top-0 z-20 rounded-t-[10px] bg-inherit">
              <div className="mx-auto h-1.5 w-12 rounded-full bg-zinc-300 flex-shrink-0" />
            </div>
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
          className="animate-slide-up-fade z-50 items-center rounded-md border border-gray-200 bg-white dark:bg-neutral-900 dark:border-neutral-700 drop-shadow-lg sm:block mt-2"
        >
          {content}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
