import { ButtonDropdown } from "@/components/shared";
import { INTERVALS_DISPLAY_VALUES } from "@/lib/constants";
import { Calendar } from "lucide-react";
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
      text={selectedInterval.displayValue}
      icon={<Calendar className="h-4 w-4" />}
      items={INTERVALS_DISPLAY_VALUES.map(
        ({ value, displayValue: display }) => ({
          value,
          display,
        })
      )}
      onSelect={changeInterval}
      selected={selectedInterval.value}
    />
  );
}
