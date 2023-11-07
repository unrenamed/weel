import Tick from "@/components/icons/tick";
import DropdownMenu from "@/components/shared/dropdown";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { ArrowDown10 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

const sortOptions = [
  {
    key: "createdAt", // used by default
    displayText: "Date Created",
  },
  {
    key: "totalClicks",
    displayText: "Number of clicks",
  },
  {
    key: "lastClicked",
    displayText: "Last Clicked",
  },
];

export default function LinkSort() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedSort = useMemo(() => {
    return (
      sortOptions.find((s) => s.key === searchParams.get("sort")) ??
      sortOptions[0]
    );
  }, [searchParams]);

  const changeSort = (key: string) => {
    const params = new URLSearchParams(searchParams);
    if (key !== "createdAt") {
      params.set("sort", key);
    } else {
      params.delete("sort");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <DropdownMenu
      content={
        <div className="w-full p-2 md:w-48">
          {sortOptions.map((o) => (
            <DropdownMenuPrimitive.Item
              key={o.key}
              className="flex w-full items-center justify-between space-x-2 px-2 py-2 rounded-md hover:bg-gray-100 active:bg-gray-100 focus-visible:bg-gray-100 outline-0"
              asChild
            >
              <button onClick={() => changeSort(o.key)}>
                <p className="text-sm">{o.displayText}</p>
                {selectedSort.key === o.key && <Tick className="h-4 w-4" />}
              </button>
            </DropdownMenuPrimitive.Item>
          ))}
        </div>
      }
    >
      <button className="flex items-center rounded-md shadow transition-all active:scale-95 px-3 py-2.5 w-48 space-x-2 bg-white hover:shadow-md">
        <ArrowDown10 className="h-4 w-4" strokeWidth={1.5} />
        <p className="text-sm">Sort by</p>
      </button>
    </DropdownMenu>
  );
}
