import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  content: ReactNode | string;
} & Pick<TooltipPrimitive.TooltipContentProps, "side"> &
  Pick<TooltipPrimitive.TooltipProviderProps, "delayDuration">;

export function Tooltip({
  children,
  content,
  side = "top",
  delayDuration = 150,
}: Props) {
  return (
    <TooltipPrimitive.Provider delayDuration={delayDuration}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side}
            sideOffset={12}
            className="animate-slide-up-fade z-[99] items-center overflow-hidden rounded border shadow-md md:block border-gray-200 bg-white"
          >
            {typeof content === "string" ? (
              <div className="block max-w-xs px-4 py-2 text-center text-xs text-gray-800">
                {content}
              </div>
            ) : (
              content
            )}
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
