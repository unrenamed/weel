import { ReactNode } from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Drawer } from "vaul";
import { useMediaQuery } from "@/hooks";
import { Check } from "lucide-react";

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
        <Drawer.Overlay className="fixed inset-0 bg-gray-100/10 backdrop-blur" />
          <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 rounded-t-[10px] bg-white border-t border-zinc-200">
            <div className="sticky my-3 top-0 z-20 rounded-t-[10px] bg-inherit">
              <div className="mx-auto h-1.5 w-12 rounded-full bg-zinc-300 flex-shrink-0" />
            </div>
            <div className="max-w-md p-2">
              {items.map(({ value, display }) => (
                <button
                  key={value}
                  onClick={() => onSelect(value)}
                  className="flex w-full items-center justify-between px-2 py-2 rounded-md hover:bg-gray-100 active:bg-gray-100 focus-visible:bg-gray-100 outline-0"
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
        <DropdownMenuPrimitive.Content className="animate-slide-up-fade z-50 items-center rounded-md border border-gray-200 bg-white drop-shadow-lg sm:block mt-2">
          <div className="p-2 xs:w-48 w-full">
            {items.map(({ value, display }) => (
              <DropdownMenuPrimitive.Item
                key={value}
                onClick={() => onSelect(value)}
                className="flex w-full items-center justify-between px-2 py-2 rounded-md hover:bg-gray-100 active:bg-gray-100 focus-visible:bg-gray-100 outline-0"
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
