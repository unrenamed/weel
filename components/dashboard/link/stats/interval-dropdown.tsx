import { ButtonDropdown } from "@/components/shared";
import { INTERVALS_DISPLAY_VALUES } from "@/lib/constants";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Calendar, Check } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

export default function IntervalDropdown() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedInterval = useMemo(() => {
    return (
      INTERVALS_DISPLAY_VALUES.find(
        (s) => s.value === searchParams.get("interval")
      ) ?? INTERVALS_DISPLAY_VALUES[1]
    );
  }, [searchParams]);

  const changeInterval = (key: string) => {
    const params = new URLSearchParams(searchParams);
    if (key !== "24h") {
      params.set("interval", key);
    } else {
      params.delete("interval");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <ButtonDropdown
      content={
        <div className="p-2 xs:w-48 w-full">
          {INTERVALS_DISPLAY_VALUES.map(({ value, displayValue }) => (
            <DropdownMenuPrimitive.Item
              key={value}
              className="flex w-full items-center justify-between space-x-2 px-2 py-2 rounded-md hover:bg-gray-100 active:bg-gray-100 focus-visible:bg-gray-100 outline-0"
              asChild
            >
              <button onClick={() => changeInterval(value)}>
                <p className="text-sm">{displayValue}</p>
                {selectedInterval.value === value && (
                  <Check className="h-4 w-4" />
                )}
              </button>
            </DropdownMenuPrimitive.Item>
          ))}
        </div>
      }
      icon={<Calendar className="h-4 w-4" />}
      text={selectedInterval.displayValue}
    />
  );
}
