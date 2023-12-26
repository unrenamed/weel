import { ReactNode } from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Drawer } from "vaul";
import { useMediaQuery } from "@/hooks";
import { Check } from "lucide-react";
import { DrawerIsland } from ".";
import { cn } from "../utils";

type Props = {
  children: ReactNode;
  items: { value: string; display: string }[];
  selected: string;
  onSelect: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function DropdownMenu({
  children,
  items,
  selected,
  onSelect,
  open,
  setOpen,
}: Props) {
  const isMobile = useMediaQuery("only screen and (max-width : 640px)");

  if (isMobile) {
    return (
      <Drawer.Root open={open} onOpenChange={setOpen}>
        <Drawer.Trigger asChild>{children}</Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-overlay/20 backdrop-blur" />
          <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 rounded-t-[10px] bg-content border-t border-border">
            <DrawerIsland />
            <div className="max-w-md p-2">
              {items.map(({ value, display }) => (
                <button
                  key={value}
                  onClick={() => onSelect(value)}
                  className={cn(
                    "flex w-full items-center justify-between px-2 py-2 outline-0 rounded-md",
                    "hover:bg-skeleton/70",
                    "active:bg-skeleton/70",
                    "focus-visible:bg-skeleton/70"
                  )}
                >
                  <p className="text-sm">{display}</p>
                  {selected === value && <Check className="h-4 w-4" />}
                </button>
              ))}
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    );
  }

  return (
    <DropdownMenuPrimitive.Root onOpenChange={setOpen}>
      <DropdownMenuPrimitive.Trigger asChild>
        {children}
      </DropdownMenuPrimitive.Trigger>
      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content className="animate-slide-up-fade z-50 items-center rounded-md border border-border bg-content  drop-shadow-lg sm:block mt-2">
          <div className="p-2 xs:w-48 w-full">
            {items.map(({ value, display }) => (
              <DropdownMenuPrimitive.Item
                key={value}
                onClick={() => onSelect(value)}
                className={cn(
                  "flex w-full items-center justify-between px-2 py-2 outline-0 rounded-md",
                  "hover:bg-skeleton/70",
                  "active:bg-skeleton/70",
                  "focus-visible:bg-skeleton/70"
                )}
                asChild
              >
                <button>
                  <p className="text-sm">{display}</p>
                  {selected === value && <Check className="h-4 w-4" />}
                </button>
              </DropdownMenuPrimitive.Item>
            ))}
          </div>
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
}
